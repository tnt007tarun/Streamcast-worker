/**
 * StreamCast Proxy Worker
 * 
 * Proxies requests to Ontario ArcGIS fish stocking API and EC flow API
 * with 24h caching, CORS headers, and clean JSON output.
 * 
 * Endpoints:
 *   GET /stocking?rivers=Credit River,Humber River,Duffins Creek
 *   GET /flow?station=02HB001
 *   GET /health
 */

const ARCGIS_BASE = 'https://services1.arcgis.com/TJH5KDher0W13Kgo/arcgis/rest/services/FishStockingDataForRecreationalPurposes/FeatureServer/0/query';
const EC_FLOW_BASE = 'https://api.weather.gc.ca/collections/hydrometric-realtime/items';
const CACHE_TTL_STOCKING = 86400; // 24 hours — stocking data rarely changes
const CACHE_TTL_FLOW     = 300;   // 5 minutes — flow data is near-real-time

// All 16 StreamCast rivers — used for bulk stocking queries
const STREAMCAST_RIVERS = [
  'Credit River', 'Grand River', 'Humber River', 'Bronte Creek',
  'Duffins Creek', 'Rouge River', 'Sixteen Mile Creek', 'Ganaraska River',
  'Beaver River', 'Saugeen River', 'Nottawasaga River', 'Speed River',
  'Eramosa River', 'Bowmanville Creek', 'Wilmot Creek', 'Black Creek'
];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200, ttl = 0) {
  const headers = {
    ...CORS,
    'Content-Type': 'application/json',
  };
  if (ttl > 0) {
    headers['Cache-Control'] = `public, max-age=${ttl}`;
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function errorResponse(msg, status = 500) {
  return jsonResponse({ error: msg }, status);
}

// ── /stocking handler ─────────────────────────────────────────────────────────
async function handleStocking(url, ctx) {
  const param = url.searchParams.get('rivers');
  const rivers = param
    ? param.split(',').map(r => r.trim()).filter(Boolean)
    : STREAMCAST_RIVERS;

  // Build WHERE clause — match any of the requested rivers
  const conditions = rivers.map(r => `WATERBODY_NAME LIKE '%${r}%'`).join(' OR ');
  const params = new URLSearchParams({
    where: conditions,
    outFields: 'WATERBODY_NAME,YEAR,SPECIES,SIZE,QUANTITY,DATE',
    orderByFields: 'YEAR DESC,WATERBODY_NAME ASC',
    resultRecordCount: '500',
    f: 'json',
  });

  const cacheKey = new Request(`https://cache.streamcast/stocking?${params}`);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  let upstream;
  try {
    upstream = await fetch(`${ARCGIS_BASE}?${params}`, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'StreamCast/1.0' }
    });
  } catch (e) {
    return errorResponse('ArcGIS upstream fetch failed: ' + e.message);
  }

  if (!upstream.ok) {
    return errorResponse(`ArcGIS returned ${upstream.status}`);
  }

  const raw = await upstream.json();
  if (raw.error) return errorResponse('ArcGIS error: ' + raw.error.message);

  // Shape the data — group stocking records by river name
  const byRiver = {};
  (raw.features || []).forEach(f => {
    const p = f.attributes;
    const name = p.WATERBODY_NAME || 'Unknown';
    // Normalise river name to match our config (e.g. "CREDIT RIVER" → "Credit River")
    const key = name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    if (!byRiver[key]) byRiver[key] = [];
    byRiver[key].push({
      year:     p.YEAR,
      species:  p.SPECIES,
      size:     p.SIZE,
      quantity: p.QUANTITY,
      date:     p.DATE ? new Date(p.DATE).toISOString().slice(0, 10) : null,
    });
  });

  // Summarise per river: most recent stocking per species
  const summary = {};
  Object.entries(byRiver).forEach(([river, records]) => {
    const perSpecies = {};
    records.forEach(r => {
      if (!perSpecies[r.species] || r.year > perSpecies[r.species].year) {
        perSpecies[r.species] = r;
      }
    });
    summary[river] = {
      stockedSpecies: Object.values(perSpecies).sort((a, b) => b.year - a.year),
      lastStocked: records[0]?.date || null,
      totalRecords: records.length,
    };
  });

  const result = { updated: new Date().toISOString(), rivers: summary };
  const response = jsonResponse(result, 200, CACHE_TTL_STOCKING);

  // Store in cache
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

// ── /flow handler ─────────────────────────────────────────────────────────────
async function handleFlow(url, ctx) {
  const station = url.searchParams.get('station');
  if (!station) return errorResponse('Missing ?station= parameter', 400);
  if (!/^[0-9A-Z]{7,10}$/.test(station)) return errorResponse('Invalid station ID', 400);

  const params = new URLSearchParams({
    STATION_NUMBER: station,
    'sortby': '-DATETIME',
    limit: '5',
    f: 'json',
  });

  const cacheKey = new Request(`https://cache.streamcast/flow?station=${station}`);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  let upstream;
  try {
    upstream = await fetch(`${EC_FLOW_BASE}?${params}`, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'StreamCast/1.0' }
    });
  } catch (e) {
    return errorResponse('EC upstream fetch failed: ' + e.message);
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

  const readings = features.map(f => ({
    flow: getVal(f.properties, ['DISCHARGE', 'discharge', 'LEVEL', 'level']),
    at:   f.properties.DATETIME || f.properties.datetime || null,
  })).filter(r => r.flow != null && !isNaN(r.flow));

  if (!readings.length) return jsonResponse({ flow: null, trend: null, station });

  const flow  = Math.round(readings[0].flow * 100) / 100;
  const prev  = readings[1]?.flow ?? null;
  const trend = prev == null ? 'stable'
    : flow > prev + 0.05 ? 'up'
    : flow < prev - 0.05 ? 'down'
    : 'stable';

  const result = { flow, trend, at: readings[0].at, station };
  const response = jsonResponse(result, 200, CACHE_TTL_FLOW);
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

// ── Main router ───────────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/health') {
      return jsonResponse({ status: 'ok', version: '1.0.0', ts: new Date().toISOString() });
    }

    if (path === '/stocking') return handleStocking(url, ctx);
    if (path === '/flow')     return handleFlow(url, ctx);

    return errorResponse('Not found. Valid endpoints: /stocking, /flow, /health', 404);
  }
};
