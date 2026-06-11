/**
 * StreamCast Proxy Worker v1.2.1
 * Correct ArcGIS field names confirmed from /fields endpoint.
 *
 * Endpoints:
 *   GET /stocking?river=Credit River   single river
 *   GET /stocking                      all 15 StreamCast rivers
 *   GET /flow?station=02HB001
 *   GET /fields                        diagnostic
 *   GET /health
 */

const ARCGIS_BASE = 'https://services1.arcgis.com/TJH5KDher0W13Kgo/arcgis/rest/services/FishStockingDataForRecreationalPurposes/FeatureServer/0/query';
const EC_FLOW_BASE = 'https://api.weather.gc.ca/collections/hydrometric-realtime/items';

const CACHE_TTL_STOCKING = 86400; // 24h — stocking data updated a few times/year
const CACHE_TTL_FLOW     = 300;   // 5min

// Correct field names from ArcGIS (confirmed via /fields)
// Note: "Unoffcial" is a typo in the source data — kept as-is
const F = {
  district:    'MNRF_District',
  year:        'Stocking_Year',
  species:     'Species',
  nameOfficial:'Official_Waterbody_Name',
  nameUnofficial:'Unoffcial_Waterbody_Name',  // typo in source
  wbid:        'Waterbody_Location_Identifier',
  stage:       'Developmental_Stage',
  quantity:    'Number_of_Fish_Stocked',
  lat:         'Latitude',
  lng:         'Longitude',
};

// StreamCast rivers — search keyword maps to what appears in waterbody name fields
// Using the first distinctive word of each river name
const STREAMCAST_RIVERS = [
  { name: 'Credit River',       keyword: 'Credit' },
  { name: 'Grand River',        keyword: 'Grand'  },
  { name: 'Humber River',       keyword: 'Humber' },
  { name: 'Bronte Creek',       keyword: 'Bronte' },
  { name: 'Duffins Creek',      keyword: 'Duffin' },
  { name: 'Rouge River',        keyword: 'Rouge'  },
  { name: 'Sixteen Mile Creek', keyword: 'Sixteen Mile' },
  { name: 'Ganaraska River',    keyword: 'Ganaraska' },
  { name: 'Beaver River',       keyword: 'Beaver' },
  { name: 'Saugeen River',      keyword: 'Saugeen' },
  { name: 'Nottawasaga River',  keyword: 'Nottawasaga' },
  { name: 'Speed River',        keyword: 'Speed'  },
  { name: 'Eramosa River',      keyword: 'Eramosa' },
  { name: 'Bowmanville Creek',  keyword: 'Bowmanville' },
  { name: 'Wilmot Creek',       keyword: 'Wilmot' },
];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

// Query ArcGIS for a single river using keyword match on both name fields
async function fetchStockingForRiver({ name, keyword }) {
  // Search both the official and unofficial name fields
  const where = `${F.nameOfficial} LIKE '%${keyword}%' OR ${F.nameUnofficial} LIKE '%${keyword}%'`;

  const params = new URLSearchParams({
    where,
    outFields: [F.year, F.species, F.nameOfficial, F.nameUnofficial, F.stage, F.quantity, F.district].join(','),
    orderByFields: `${F.year} DESC`,
    resultRecordCount: '200',
    f: 'json',
  });

  const res = await fetch(`${ARCGIS_BASE}?${params}`, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'StreamCast/1.0' }
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.features || [];
}

function summarise(features, riverName) {
  if (!features.length) return null;

  // Group by species — keep most recent stocking per species
  const perSpecies = {};
  features.forEach(f => {
    const p = f.attributes;
    const sp = p[F.species] || 'Unknown';
    const yr = p[F.year]    || 0;
    if (!perSpecies[sp] || yr > perSpecies[sp].year) {
      perSpecies[sp] = {
        species:      sp,
        year:         yr,
        stage:        p[F.stage]    || null,  // e.g. "Yearlings", "Fry", "Adults"
        quantity:     p[F.quantity] || null,
        waterbody:    p[F.nameOfficial] || p[F.nameUnofficial] || riverName,
      };
    }
  });

  const stockedSpecies = Object.values(perSpecies)
    .sort((a, b) => b.year - a.year);

  return {
    stockedSpecies,
    mostRecentYear: stockedSpecies[0]?.year || null,
    totalRecords:   features.length,
  };
}

// ── /stocking ─────────────────────────────────────────────────────────────────
async function handleStocking(url, ctx) {
  const singleRiverName = url.searchParams.get('river');
  const rivers = singleRiverName
    ? STREAMCAST_RIVERS.filter(r => r.name === singleRiverName)
    : STREAMCAST_RIVERS;

  if (singleRiverName && !rivers.length) {
    return errorResponse(`Unknown river: ${singleRiverName}. Valid rivers: ${STREAMCAST_RIVERS.map(r=>r.name).join(', ')}`, 400);
  }

  const cacheKey = new Request(
    `https://cache.streamcast/stocking-v3?rivers=${rivers.map(r=>r.name).join(',')}`
  );
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const result = { updated: new Date().toISOString(), rivers: {}, errors: {} };

  for (const river of rivers) {
    try {
      const features = await fetchStockingForRiver(river);
      const summary  = summarise(features, river.name);
      result.rivers[river.name] = summary || { stockedSpecies: [], mostRecentYear: null, totalRecords: 0, note: 'No stocking records found' };
    } catch (e) {
      result.errors[river.name] = e.message;
    }
  }

  const response = jsonResponse(result, 200, CACHE_TTL_STOCKING);
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

// ── /flow ─────────────────────────────────────────────────────────────────────
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

  const response = jsonResponse({ flow, trend, at: readings[0].at, station }, 200, CACHE_TTL_FLOW);
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

// ── /fields (diagnostic) ──────────────────────────────────────────────────────
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

// ── Router ────────────────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }
    const url  = new URL(request.url);
  
  // ── EMAIL SUBSCRIPTION ─────────────────────────────────────────────────────
  if (url.pathname === '/subscribe') {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers: { ...CORS, 'Content-Type': 'application/json' } });
    }
    try {
      const body    = await request.json();
      const { email, rivers, species, source } = body;

      if (!email || !email.includes('@')) {
        return new Response(JSON.stringify({ error: 'Valid email required' }), { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } });
      }

      const clean = email.toLowerCase().trim();
      const ts    = new Date().toISOString();

      // 1. Save preferences to KV
      await env.SUBSCRIBERS.put('sub:' + clean, JSON.stringify({
        email: clean, rivers: rivers || [], species: species || [],
        source: source || 'notify-panel', createdAt: ts, confirmed: false,
      }));

      // 2. Add to Resend audience
      await fetch('https://api.resend.com/audiences/' + env.RESEND_AUDIENCE_ID + '/contacts', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clean,
          data: { rivers: (rivers||[]).join(', '), species: (species||[]).join(', '), source: source || 'notify-panel' },
          unsubscribed: false,
        }),
      });

      // 3. Send welcome email
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:    'HereFishyFishy <hello@herefishyfishy.ca>',
          to:      [clean],
          subject: "You're on the list 🎣",
          html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1a2e3a">
            <h2 style="color:#1e7a6e">You're on the list.</h2>
            <p>We'll send you an alert when conditions are excellent for
            <strong>${(species||[]).join(', ') || 'your target species'}</strong>
            on the <strong>${(rivers||[]).join(', ') || 'rivers you follow'}</strong>.</p>
            <p>In the meantime, check conditions any time at
            <a href="https://herefishyfishy.ca" style="color:#1e7a6e">herefishyfishy.ca</a>.</p>
            <p style="color:#999;font-size:11px;margin-top:32px">
              <a href="https://herefishyfishy.ca/unsubscribe?email=${encodeURIComponent(clean)}" style="color:#999">Unsubscribe</a>
            </p>
          </div>`,
        }),
      });

      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } });
    }
  }
  // ── END EMAIL SUBSCRIPTION ──────────────────────────────────────────────────
    
  const path = url.pathname;
    if (path === '/health')   return jsonResponse({ status: 'ok', version: '1.2.0', ts: new Date().toISOString() });
    if (path === '/stocking') return handleStocking(url, ctx);
    if (path === '/flow')     return handleFlow(url, ctx);
    if (path === '/fields')   return handleFields();
    return jsonResponse({ error: 'Valid endpoints: /stocking, /flow, /health, /fields' }, 404);
  }
};
