/**
 * StreamCast Proxy Worker v1.1
 * 
 * Endpoints:
 *   GET /stocking?river=Credit River   (single river)
 *   GET /stocking                      (all rivers, sequential)
 *   GET /flow?station=02HB001
 *   GET /health
 */

const ARCGIS_BASE = 'https://services1.arcgis.com/TJH5KDher0W13Kgo/arcgis/rest/services/FishStockingDataForRecreationalPurposes/FeatureServer/0/query';
const EC_FLOW_BASE = 'https://api.weather.gc.ca/collections/hydrometric-realtime/items';

const CACHE_TTL_STOCKING = 86400; // 24h
const CACHE_TTL_FLOW     = 300;   // 5min

const STREAMCAST_RIVERS = [
  'Credit River', 'Grand River', 'Humber River', 'Bronte Creek',
  'Duffins Creek', 'Rouge River', 'Sixteen Mile Creek', 'Ganaraska River',
  'Beaver River', 'Saugeen River', 'Nottawasaga River', 'Speed River',
  'Eramosa River', 'Bowmanville Creek', 'Wilmot Creek'
];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200, ttl = 0) {
  const headers = { ...CORS, 'Content-Type': 'application/json' };
  if (ttl > 0) headers['Cache-Control'] = `public, max-age=${ttl}`;
  return new Response(JSON.stringify(data), { status, headers });
}

function errorResponse(msg, status = 500) {
  return jsonResponse({ error: msg }, status);
}

// Query ArcGIS for a single river name
async function fetchStockingForRiver(riverName) {
  // ArcGIS requires simple equality or single LIKE — use exact name match first
  // The waterbody names in the DB use title case e.g. "CREDIT RIVER" or "Credit River"
  // Use a simple LIKE with just the key word to be safe
  const keyword = riverName.split(' ')[0]; // e.g. "Credit" from "Credit River"
  
  const params = new URLSearchParams({
    where: `WATERBODY_NAME LIKE '${keyword}%'`,
    outFields: 'WATERBODY_NAME,YEAR,SPECIES,SIZE_GROUP,QUANTITY,STOCKING_DATE',
    orderByFields: 'YEAR DESC',
    resultRecordCount: '100',
    f: 'json',
  });

  const url = `${ARCGIS_BASE}?${params}`;
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'StreamCast/1.0' }
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.features || [];
}

// Summarise raw features into per-species most-recent records
function summarise(features, riverName) {
  if (!features.length) return null;

  const perSpecies = {};
  features.forEach(f => {
    const p = f.attributes;
    const sp = p.SPECIES || p.FISH_SPECIES || 'Unknown';
    const yr = p.YEAR || 0;
    if (!perSpecies[sp] || yr > perSpecies[sp].year) {
      perSpecies[sp] = {
        species:  sp,
        year:     yr,
        size:     p.SIZE_GROUP || p.SIZE || null,
        quantity: p.QUANTITY || null,
        date:     p.STOCKING_DATE ? new Date(p.STOCKING_DATE).toISOString().slice(0,10) : null,
        waterbody: p.WATERBODY_NAME || riverName,
      };
    }
  });

  const stockedSpecies = Object.values(perSpecies)
    .sort((a, b) => b.year - a.year);

  return {
    stockedSpecies,
    lastStocked: stockedSpecies[0]?.date || null,
    mostRecentYear: stockedSpecies[0]?.year || null,
    totalRecords: features.length,
  };
}

// ── /stocking handler ─────────────────────────────────────────────────────────
async function handleStocking(url, ctx) {
  const singleRiver = url.searchParams.get('river');
  const rivers = singleRiver ? [singleRiver] : STREAMCAST_RIVERS;

  const cacheKey = new Request(
    `https://cache.streamcast/stocking-v2?rivers=${rivers.join(',')}`
  );
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const result = { updated: new Date().toISOString(), rivers: {}, errors: {} };

  // Query rivers sequentially to avoid hammering ArcGIS
  for (const river of rivers) {
    try {
      const features = await fetchStockingForRiver(river);
      const summary  = summarise(features, river);
      if (summary) result.rivers[river] = summary;
    } catch (e) {
      result.errors[river] = e.message;
    }
  }

  const response = jsonResponse(result, 200, CACHE_TTL_STOCKING);
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

// ── /flow handler ─────────────────────────────────────────────────────────────
async function handleFlow(url, ctx) {
  const station = url.searchParams.get('station');
  if (!station) return errorResponse('Missing ?station= parameter', 400);
  if (!/^[0-9A-Z]{5,10}$/.test(station)) return errorResponse('Invalid station ID', 400);

  const cacheKey = new Request(`https://cache.streamcast/flow?station=${station}`);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    STATION_NUMBER: station,
    sortby: '-DATETIME',
    limit: '5',
    f: 'json',
  });

  let upstream;
  try {
    upstream = await fetch(`${EC_FLOW_BASE}?${params}`, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'StreamCast/1.0' }
    });
  } catch (e) {
    return errorResponse('EC fetch failed: ' + e.message);
  }

  if (!upstream.ok) return errorResponse(`EC returned ${upstream.status}`);

  const raw = await upstream.json();
  const features = raw.features || [];
  if (!features.length) return jsonResponse({ flow: null, trend: null, station });

  const getVal = (obj, keys) => {
    for (const k of keys) {
      if (obj[k] != null) return parseFloat(obj[k]);
      const kl = Object.keys(obj).find(ok => ok.toLowerCase() === k.toLowerCase());
      if (kl && obj[kl] != null) return parseFloat(obj[kl]);
    }
    return null;
  };

  const readings = features
    .map(f => ({
      flow: getVal(f.properties, ['DISCHARGE','discharge','LEVEL','level']),
      at:   f.properties.DATETIME || f.properties.datetime || null,
    }))
    .filter(r => r.flow != null && !isNaN(r.flow));

  if (!readings.length) return jsonResponse({ flow: null, trend: null, station });

  const flow  = Math.round(readings[0].flow * 100) / 100;
  const prev  = readings[1]?.flow ?? null;
  const trend = prev == null ? 'stable'
    : flow > prev + 0.05 ? 'up'
    : flow < prev - 0.05 ? 'down' : 'stable';

  const response = jsonResponse(
    { flow, trend, at: readings[0].at, station },
    200, CACHE_TTL_FLOW
  );
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

// ── /fields handler — inspect ArcGIS field names ──────────────────────────────
async function handleFields() {
  const res = await fetch(`${ARCGIS_BASE}?where=1%3D1&outFields=*&resultRecordCount=1&f=json`, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'StreamCast/1.0' }
  });
  const data = await res.json();
  const fields = data.features?.[0]?.attributes
    ? Object.keys(data.features[0].attributes)
    : (data.fields || []).map(f => f.name);
  return jsonResponse({ fields, sample: data.features?.[0]?.attributes || null });
}

// ── Main router ───────────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url  = new URL(request.url);
    const path = url.pathname;

    if (path === '/health')   return jsonResponse({ status: 'ok', version: '1.1.0', ts: new Date().toISOString() });
    if (path === '/stocking') return handleStocking(url, ctx);
    if (path === '/flow')     return handleFlow(url, ctx);
    if (path === '/fields')   return handleFields();   // diagnostic — check ArcGIS field names

    return jsonResponse({ error: 'Valid endpoints: /stocking, /flow, /health, /fields' }, 404);
  }
};
