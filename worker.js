/**
 * StreamCast Proxy Worker v1.3.0
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
const CACHE_TTL_LAKE     = 86400; // 24h — GLSEA lake surface temp updates daily

// GLERL ERDDAP — Great Lakes Surface Environmental Analysis (satellite SST, daily, ~1.3km)
const ERDDAP_GLSEA = 'https://apps.glerl.noaa.gov/erddap/griddap/GLSEA_ACSPO_GCS.json';

// River-mouth offshore sample points (pushed into the lake so the grid cell is water,
// not land). key matches STAGING_ZONES[...].key in the app. Each samples a small
// bbox and averages the valid (non-fill) water cells.
const LAKE_MOUTH_POINTS = [
  { key: 'credit',      lat: 43.54, lng: -79.58 },
  { key: 'humber',      lat: 43.61, lng: -79.47 },
  { key: 'ganaraska',   lat: 43.915, lng: -78.29 },
  { key: 'bowmanville', lat: 43.87, lng: -78.685 },
  { key: 'wilmot',      lat: 43.885, lng: -78.59 },
  { key: 'bronte',      lat: 43.37, lng: -79.715 },
  { key: 'sixteen',     lat: 43.415, lng: -79.665 },
  { key: 'rouge',       lat: 43.78, lng: -79.13 },
  { key: 'duffins',     lat: 43.81, lng: -79.06 },
  { key: 'nottawasaga', lat: 44.52, lng: -80.01 },
];

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


// ── /lake-temps ────────────────────────────────────────────────────────────────
// Returns {credit: 18.3, rouge: 17.9, ...} — daily lake surface temp at each mouth.
// Queries GLERL ERDDAP GLSEA gridded SST. Land/cloud cells return the fill value
// (-99999); we sample a small offshore bbox per mouth and average valid water cells.
async function handleLakeTemps(url, ctx) {
  const cacheKey = new Request('https://cache.streamcast/lake-temps-v1');
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const FILL = -9999; // anything <= this is land/cloud/no-data
  const out = {};

  // Query each mouth: a 3x3-ish bbox around the offshore point, latest time.
  // ERDDAP griddap subset syntax: sst[(time)][(latMin):(latMax)][(lngMin):(lngMax)]
  await Promise.all(LAKE_MOUTH_POINTS.map(async (m) => {
    const d = 0.03; // ~3km half-box, a few grid cells
    const q = ERDDAP_GLSEA + '?sst[(last)][(' +
      (m.lat - d) + '):(' + (m.lat + d) + ')][(' +
      (m.lng - d) + '):(' + (m.lng + d) + ')]';
    try {
      const r = await fetch(q, { headers: { 'Accept': 'application/json', 'User-Agent': 'HereFishyFishy/1.0' } });
      if (!r.ok) { out[m.key] = null; return; }
      const j = await r.json();
      // ERDDAP JSON: { table: { columnNames:[...], rows:[[time,lat,lng,sst],...] } }
      const rows = (j && j.table && j.table.rows) ? j.table.rows : [];
      const sstIdx = j.table.columnNames.indexOf('sst');
      const vals = rows
        .map(row => parseFloat(row[sstIdx]))
        .filter(v => !isNaN(v) && v > FILL);
      if (vals.length) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        out[m.key] = Math.round(avg * 10) / 10;
      } else {
        out[m.key] = null; // all land/cloud — no reading
      }
    } catch (e) {
      out[m.key] = null;
    }
  }));

  const response = jsonResponse({ updated: new Date().toISOString(), temps: out }, 200, CACHE_TTL_LAKE);
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

// ROUTE TABLE 
// Maps URL slug → river data. One entry per species per river.
// "bestSection" is which section to pull gauge data from.
const SSR_ROUTES = {
  'credit-river/brown-trout': {
    river: 'Credit River',
    species: 'Brown Trout',
    section: 'Upper Credit River',          // most relevant section for this species
    gauge: '02HB001',                        // Credit River near Cataract
    sweetMin: 5, sweetMax: 15,
    lat: 43.870, lng: -80.010,
    seasonMonths: [3, 9],                    // April–October (0-indexed)
    peakMonths: [3, 5],                      // April–June peak
    access: [
      'Forks of the Credit Provincial Park — Cataract, ON',
      'Belfountain Conservation Area — Belfountain, ON',
      'Upper Credit Conservation Area — Caledon, ON',
    ],
    evergreen: `The Upper Credit River is one of Southern Ontario's best wild brown trout fisheries. The river runs cold year-round through the Niagara Escarpment gorge, holding resident browns from Cataract down through Belfountain. Best action is April through June on nymphs and dry flies, and again in September as water cools. The stretch above Old Baseline Road in Caledon is catch-and-release, artificial only — some of the most pristine trout water in the province.`,
    tips: `Fish the seams at the head of pools in the morning before the sun hits the water. Hendrickson hatches in late April and early May draw fish to the surface — a size 14 parachute pattern dead-drifted over rising fish is hard to beat. In summer, switch to a dropper rig with a small nymph off a dry.`,
  },
  'credit-river/rainbow-trout': {
    river: 'Credit River',
    species: 'Rainbow Trout',
    section: 'Upper Credit River',
    gauge: '02HB001',
    sweetMin: 5, sweetMax: 15,
    lat: 43.870, lng: -80.010,
    seasonMonths: [2, 4],                    // March–May (spring run)
    peakMonths: [2, 3],
    access: [
      'Norval Conservation Area — Norval, ON',
      'Streetsville Road Allowances — Mississauga, ON',
      'Forks of the Credit Provincial Park — Cataract, ON',
    ],
    evergreen: `Rainbow trout (including migratory steelhead) enter the Credit River in spring, typically March through May. Resident rainbows hold in the upper reaches year-round in smaller numbers. The best spring run fishing is in the middle section around Norval and the Forks, where fish stack below holding pools waiting for water temperatures to peak. Flows between 10–20 m³/s produce the best conditions — fish spread out and become more accessible when the river is at moderate height.`,
    tips: `Drift roe, bead patterns, or large nymphs through the deep pools during peak flows. As levels drop through April, switch to lighter nymphing rigs with smaller flies. Rising fish are uncommon in early spring — focus on the bottom third of the water column.`,
  },
  'credit-river/brook-trout': {
    river: 'Credit River',
    species: 'Brook Trout',
    section: 'Upper Credit River',
    gauge: '02HB001',
    sweetMin: 3, sweetMax: 10,
    lat: 43.870, lng: -80.010,
    seasonMonths: [3, 9],                    // April–October
    peakMonths: [3, 4],
    access: [
      'Upper Credit Conservation Area — Caledon, ON (catch-and-release)',
      'Belfountain Conservation Area — Belfountain, ON',
    ],
    evergreen: `Brook trout are found in the coldest headwater reaches of the Upper Credit River, particularly in the catch-and-release sections above Old Baseline Road in Caledon. These are wild fish — smaller than the browns below but extraordinarily beautiful. The Upper Credit Conservation Area protects some of the best habitat. Water temperature is the key variable: brookies go off the feed when water exceeds 18°C in midsummer. Best fishing is May–June and again in September.`,
    tips: `Use light tackle — 3 or 4 weight fly rod, 5x or 6x tippet, small flies (size 14–18). Brook trout in clear headwater streams spook easily. Wade carefully, stay low, and cast accurately to specific fish rather than covering water randomly.`,
  },
  'credit-river/steelhead': {
    river: 'Credit River',
    species: 'Steelhead',
    section: 'Middle Credit River',
    gauge: '02HB001',
    sweetMin: 8, sweetMax: 25,
    lat: 43.660, lng: -79.880,
    seasonMonths: [8, 4],                    // Sept–May (wraps around winter)
    peakMonths: [2, 3],
    access: [
      'Norval Conservation Area — Norval, ON',
      'Streetsville Conservation Area — Streetsville, ON',
      'Erindale Park — Mississauga, ON',
    ],
    evergreen: `Steelhead begin entering the Credit River in late September following the Chinook salmon run, and continue through winter into late April. Peak fishing is March–April when fish are pushing upriver on rising spring temperatures. The Credit produces both fall-run and spring-run fish, with the middle section around Norval and Streetsville holding the most accessible water. Lake Ontario surface temperature is the key trigger — when it cools below 10°C in fall, fish start staging near the harbour mouth.`,
    tips: `In fall, swing large streamers or run float rigs with roe through the deeper pools. Spring fish are more willing to take nymphs dead-drifted through feeding lanes. Early morning before 9AM is consistently the most productive window, especially on bright days.`,
  },
  'credit-river/chinook-salmon': {
    river: 'Credit River',
    species: 'Chinook Salmon',
    section: 'Lower Credit River',
    gauge: '02HB001',
    sweetMin: 10, sweetMax: 40,
    lat: 43.560, lng: -79.720,
    seasonMonths: [8, 10],                   // September–November
    peakMonths: [9, 9],
    access: [
      'Erindale Park — Mississauga, ON',
      'Port Credit Harbour Mouth — Port Credit, ON',
      'Streetsville Conservation Area — Streetsville, ON',
    ],
    evergreen: `Chinook salmon enter the Credit River from Lake Ontario starting in late September, with peak numbers moving through in October. Fish stack near the harbour mouth at Port Credit waiting for sufficient flow, then push upriver after rain events raise levels. The lower Credit through Mississauga holds the most fish — the middle section at Streetsville sees fish arrive 1–2 weeks later. Chinook can reach 15–20kg on the Credit, making this one of the most exciting urban fisheries in Ontario.`,
    tips: `Target the Credit during and just after rain events when flows spike above 15 m³/s — fresh fish push hard on rising water. Anchor beads, roe bags, or large streamers near the bottom of the deepest pools. Early morning low-light conditions produce the most aggressive fish.`,
  },
  'credit-river/coho-salmon': {
    river: 'Credit River',
    species: 'Coho Salmon',
    section: 'Lower Credit River',
    gauge: '02HB001',
    sweetMin: 8, sweetMax: 30,
    lat: 43.560, lng: -79.720,
    seasonMonths: [9, 10],                   // October–November
    peakMonths: [9, 10],
    access: [
      'Erindale Park — Mississauga, ON',
      'Port Credit Harbour Mouth — Port Credit, ON',
    ],
    evergreen: `Coho salmon arrive on the Credit River in October, following the main Chinook push. Smaller and more acrobatic than Chinook, coho are known for aggressive takes and spectacular aerial fights. They tend to hold higher in the water column than Chinook and are more willing to chase flies and lures. The lower Credit through Port Credit and Mississauga is the primary coho water — fish rarely push as far upriver as steelhead do.`,
    tips: `Coho respond well to swung flies and small spoons — a size 2 silver spoon retrieved steadily through pools can be deadly. They are far more willing to take a moving fly than Chinook. Focus on the lower 5km of the Credit, particularly in the pools below Erindale Park.`,
  },
};

// SCORING LOGIC 
// Simplified version of the app's condition scoring.
// Returns { quality, label, flowState, tempState, skyState }

function scoreConditions(flow, airTemp, cloudPct, route, month) {
  // Flow score
  let flowState = 'unknown', flowLabel = 'Check gauge';
  if (flow != null) {
    if (flow >= route.sweetMin && flow <= route.sweetMax) {
      flowState = 'good'; flowLabel = 'In range';
    } else if (flow < route.sweetMin) {
      flowState = flow >= route.sweetMin * 0.4 ? 'ok' : 'poor';
      flowLabel = 'Low';
    } else {
      flowState = flow <= route.sweetMax * 1.8 ? 'ok' : 'poor';
      flowLabel = 'High';
    }
  }

  // Water temp (estimated from air)
  const waterTemp = airTemp != null ? Math.round((airTemp * 0.7 + 4) * 10) / 10 : null;
  let tempState = 'unknown', tempLabel = 'Unknown';
  if (waterTemp != null) {
    if (waterTemp >= 8 && waterTemp <= 14) { tempState = 'good'; tempLabel = 'Ideal'; }
    else if (waterTemp >= 5 && waterTemp < 8) { tempState = 'ok'; tempLabel = 'Cool'; }
    else if (waterTemp > 14 && waterTemp <= 18) { tempState = 'ok'; tempLabel = 'Warm'; }
    else if (waterTemp > 18) { tempState = 'poor'; tempLabel = 'Too warm'; }
    else { tempState = 'poor'; tempLabel = 'Too cold'; }
  }

  // Sky / cloud cover
  let skyState = 'unknown', skyLabel = 'Unknown';
  if (cloudPct != null) {
    if (cloudPct >= 50) { skyState = 'good'; skyLabel = 'Good cover'; }
    else if (cloudPct >= 25) { skyState = 'ok'; skyLabel = 'Some cover'; }
    else { skyState = 'poor'; skyLabel = 'Clear sky'; }
  }

  // Season check
  const [seasonStart, seasonEnd] = route.seasonMonths;
  const inSeason = seasonStart <= seasonEnd
    ? month >= seasonStart && month <= seasonEnd
    : month >= seasonStart || month <= seasonEnd;

  // Overall quality score
  const scores = { good: 2, ok: 1, poor: 0, unknown: 1 };
  const total = scores[flowState] + scores[tempState] + scores[skyState];
  let quality, qualityLabel;
  if (!inSeason) { quality = 'out-of-season'; qualityLabel = 'Out of season'; }
  else if (total >= 5) { quality = 'excellent'; qualityLabel = 'Excellent'; }
  else if (total >= 3) { quality = 'good'; qualityLabel = 'Good'; }
  else if (total >= 2) { quality = 'marginal'; qualityLabel = 'Marginal'; }
  else { quality = 'tough'; qualityLabel = 'Tough'; }

  return {
    quality, qualityLabel, inSeason,
    flow: flow != null ? Math.round(flow * 10) / 10 : null,
    flowState, flowLabel,
    waterTemp, tempState, tempLabel,
    cloudPct, skyState, skyLabel,
  };
}

// HTML TEMPLATE 
function renderSSRPage(route, cond, slug) {
  const speciesSlug = slug.split('/')[1];
  const qualityColor = {
    excellent: '#6dbf8a', good: '#6dbf8a',
    marginal: '#e8a85a', tough: '#e07070', 'out-of-season': '#9ecfca'
  }[cond.quality] || '#9ecfca';

  const stateColor = (s) => ({ good:'#6dbf8a', ok:'#e8a85a', poor:'#e07070', unknown:'#9ecfca' }[s] || '#9ecfca');
  const stateBar = (s) => `background:${stateColor(s)}`;

  const today = new Date().toLocaleDateString('en-CA', { weekday:'long', year:'numeric', month:'long', day:'numeric', timeZone:'America/Toronto' });

  // Deep link into the app with river + species pre-selected
  const riverParam = encodeURIComponent(route.section);
  const speciesParam = speciesSlug.replace('-trout','').replace('-salmon','').replace('brook','brook').replace('coho','coho').replace('chinook','chinook').replace('steelhead','steelhead');
  const appLink = `https://herefishyfishy.ca/?river=${riverParam}&species=${speciesParam}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${route.river} ${route.species} Fishing Conditions — HereFishyFishy</title>
  <meta name="description" content="Live ${route.species} fishing conditions on the ${route.river} today. Flow: ${cond.flow != null ? cond.flow + ' m³/s' : 'check gauge'} · Water: ${cond.waterTemp != null ? '~' + cond.waterTemp + '°C' : 'unknown'} · Conditions: ${cond.qualityLabel}. Updated ${today}.">
  <link rel="canonical" href="https://herefishyfishy.ca/${slug}">
  <link rel="icon" href="https://herefishyfishy.ca/favicon.ico">
  <meta property="og:title" content="${route.river} ${route.species} — ${cond.qualityLabel} conditions today">
  <meta property="og:description" content="Flow ${cond.flow != null ? cond.flow + ' m³/s (' + cond.flowLabel + ')' : 'check gauge'} · ${cond.tempLabel} water · ${cond.skyLabel}. Updated live.">
  <meta property="og:url" content="https://herefishyfishy.ca/${slug}">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${route.river} ${route.species} Fishing Conditions",
    "description": "Live fishing conditions for ${route.species} on the ${route.river}, Ontario. Updated ${today}.",
    "url": "https://herefishyfishy.ca/${slug}",
    "isPartOf": { "@type": "WebApplication", "name": "HereFishyFishy", "url": "https://herefishyfishy.ca" }
  }
  </script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f5f0ea; color: #1a2e3a; }
    a { color: #1e7a6e; }

    .top-bar { background: #0d1f2d; padding: .75rem 1.5rem; display: flex; align-items: center; justify-content: space-between; }
    .top-bar-brand { font-family: Georgia, serif; font-style: italic; font-weight: 700; color: #fff; font-size: 1.1rem; text-decoration: none; }
    .top-bar-link { font-size: .75rem; color: #9ecfca; text-decoration: none; }

    .hero { background: linear-gradient(160deg, #0d1f2d, #1a3a4a); padding: 2rem 1.5rem 1.75rem; }
    .hero-eyebrow { font-family: 'Courier New', monospace; font-size: .55rem; letter-spacing: .15em; text-transform: uppercase; color: #9ecfca; opacity: .65; margin-bottom: .5rem; }
    .hero-title { font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: .25rem; }
    .hero-sub { font-size: .9rem; color: #9ecfca; margin-bottom: 1rem; }
    .quality-pill { display: inline-block; font-family: 'Courier New', monospace; font-size: .72rem; font-weight: 700; letter-spacing: .06em; color: ${qualityColor}; background: ${qualityColor}20; padding: .3rem .8rem; border-radius: 20px; margin-bottom: 1.25rem; }

    .tiles { display: flex; gap: 6px; margin-bottom: 1.25rem; }
    .tile { flex: 1; border-radius: 10px; overflow: hidden; background: rgba(255,255,255,.04); border: 1px solid rgba(158,207,202,.12); }
    .tile-bar { height: 4px; }
    .tile-body { padding: 9px 8px; }
    .tile-lbl { font-family: 'Courier New', monospace; font-size: .5rem; letter-spacing: .06em; color: #9ecfca; opacity: .8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
    .tile-val { font-size: 1rem; font-weight: 700; color: #fff; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tile-meaning { font-family: 'Courier New', monospace; font-size: .48rem; margin-top: 3px; text-transform: uppercase; }

    .cta-btn { display: block; background: #1e7a6e; color: #fff; text-align: center; padding: .85rem 1rem; border-radius: 10px; font-weight: 700; font-size: .95rem; text-decoration: none; letter-spacing: .01em; }
    .cta-btn:hover { background: #2a9d8f; }
    .cta-note { font-size: .65rem; color: #9ecfca; opacity: .65; text-align: center; margin-top: .4rem; font-family: 'Courier New', monospace; }

    .content { max-width: 680px; margin: 0 auto; padding: 1.5rem; }
    .section { background: #fff; border-radius: 14px; padding: 1.25rem; margin-bottom: 1rem; border: 1px solid rgba(30,122,110,.1); }
    .section-title { font-family: 'Courier New', monospace; font-size: .55rem; letter-spacing: .12em; text-transform: uppercase; color: #4a8c7a; margin-bottom: .6rem; }
    .section-body { font-size: .9rem; line-height: 1.65; color: #2c3e50; }
    .section-tip { margin-top: .75rem; padding: .6rem .85rem; background: rgba(30,122,110,.05); border-left: 3px solid #1e7a6e; border-radius: 0 6px 6px 0; font-size: .85rem; color: #1a3a4a; line-height: 1.55; }

    .access-list { list-style: none; }
    .access-list li { padding: .4rem 0; border-bottom: 1px solid rgba(30,122,110,.08); font-size: .88rem; color: #2c3e50; }
    .access-list li:last-child { border-bottom: none; }
    .access-list li::before { content: '📍 '; }

    .updated { font-family: 'Courier New', monospace; font-size: .6rem; color: #9ab5b0; text-align: center; padding: 1rem; letter-spacing: .05em; }
    .footer { background: #0d1f2d; padding: 1.25rem 1.5rem; text-align: center; }
    .footer a { color: #9ecfca; font-size: .8rem; text-decoration: none; margin: 0 .75rem; }
  </style>
</head>
<body>

<div class="top-bar">
  <a href="https://herefishyfishy.ca" class="top-bar-brand">HereFishyFishy</a>
  <a href="https://herefishyfishy.ca" class="top-bar-link">← All rivers</a>
</div>

<div class="hero">
  <div style="max-width:680px;margin:0 auto">
    <div class="hero-eyebrow">Live conditions · ${today}</div>
    <div class="hero-title">${route.river} · ${route.species}</div>
    <div class="hero-sub">${route.section} · ${route.access[0].split('—')[0].trim()}</div>
    <div class="quality-pill">Conditions: ${cond.qualityLabel}</div>

    <div class="tiles">
      <div class="tile">
        <div class="tile-bar" style="${stateBar(cond.flowState)}"></div>
        <div class="tile-body">
          <div class="tile-lbl">Flow</div>
          <div class="tile-val">${cond.flow != null ? cond.flow : '—'}</div>
          <div class="tile-meaning" style="color:${stateColor(cond.flowState)}">${cond.flowLabel}</div>
        </div>
      </div>
      <div class="tile">
        <div class="tile-bar" style="${stateBar(cond.tempState)}"></div>
        <div class="tile-body">
          <div class="tile-lbl">Water</div>
          <div class="tile-val">${cond.waterTemp != null ? '~' + cond.waterTemp + '°' : '—'}</div>
          <div class="tile-meaning" style="color:${stateColor(cond.tempState)}">${cond.tempLabel}</div>
        </div>
      </div>
      <div class="tile">
        <div class="tile-bar" style="${stateBar(cond.skyState)}"></div>
        <div class="tile-body">
          <div class="tile-lbl">Sky</div>
          <div class="tile-val">${cond.cloudPct != null ? cond.cloudPct + '%' : '—'}</div>
          <div class="tile-meaning" style="color:${stateColor(cond.skyState)}">${cond.skyLabel}</div>
        </div>
      </div>
    </div>

    <a href="${appLink}" class="cta-btn">See full conditions, access points &amp; gear →</a>
    <div class="cta-note">Opens the full app · free · no account needed</div>
  </div>
</div>

<div class="content">
  <div class="section">
    <div class="section-title">About ${route.river} ${route.species} fishing</div>
    <div class="section-body">
      ${route.evergreen}
      <div class="section-tip">${route.tips}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Access points</div>
    <ul class="access-list">
      ${route.access.map(a => `<li>${a}</li>`).join('\n      ')}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">More Credit River fishing</div>
    <div class="section-body" style="display:flex;flex-direction:column;gap:.4rem">
      <a href="/credit-river/brown-trout">Credit River — Brown Trout</a>
      <a href="/credit-river/rainbow-trout">Credit River — Rainbow Trout</a>
      <a href="/credit-river/brook-trout">Credit River — Brook Trout</a>
      <a href="/credit-river/steelhead">Credit River — Steelhead</a>
      <a href="/credit-river/chinook-salmon">Credit River — Chinook Salmon</a>
      <a href="/credit-river/coho-salmon">Credit River — Coho Salmon</a>
    </div>
  </div>
</div>

<div class="updated">Conditions updated ${new Date().toLocaleTimeString('en-CA', { hour:'2-digit', minute:'2-digit', timeZone:'America/Toronto' })} ET · Flow: Water Survey of Canada · Weather: Open-Meteo</div>

<div class="footer">
  <a href="https://herefishyfishy.ca">Home</a>
  <a href="https://herefishyfishy.ca/sitemap.xml">All rivers</a>
</div>

</body>
</html>`;
}

// MAIN SSR HANDLER 
// Call this from the top of your Worker's fetch handler.
// Returns a Response if the URL matches an SSR route, or null to fall through.

async function handleSSR(request, env) {
  const url = new URL(request.url);
  const slug = url.pathname.replace(/^\//, '').replace(/\/$/, '');

  const route = SSR_ROUTES[slug];
  if (!route) return null;  // not an SSR route — fall through to normal handling

  // Check KV cache first (30 min TTL)
  const cacheKey = `ssr:${slug}`;
  if (env.CACHE) {
    const cached = await env.CACHE.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8', 'X-Cache': 'HIT' }
      });
    }
  }

  // Fetch live data in parallel
  const [flowData, weatherData] = await Promise.allSettled([
    fetch(`https://streamcast-proxy.tnt-tarun.workers.dev/flow?station=${route.gauge}`)
      .then(r => r.json()).catch(() => null),
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${route.lat}&longitude=${route.lng}&current=temperature_2m,cloudcover&timezone=America/Toronto`)
      .then(r => r.json()).catch(() => null),
  ]);

  const flow = flowData.status === 'fulfilled' && flowData.value?.flow != null
    ? flowData.value.flow : null;
  const airTemp = weatherData.status === 'fulfilled' && weatherData.value?.current?.temperature_2m != null
    ? weatherData.value.current.temperature_2m : null;
  const cloudPct = weatherData.status === 'fulfilled' && weatherData.value?.current?.cloudcover != null
    ? weatherData.value.current.cloudcover : null;

  const month = new Date().getMonth();
  const cond = scoreConditions(flow, airTemp, cloudPct, route, month);
  const html = renderSSRPage(route, cond, slug);

  // Cache for 30 minutes
  if (env.CACHE) {
    await env.CACHE.put(cacheKey, html, { expirationTtl: 1800 });
  }

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'X-Cache': 'MISS' }
  });
}

// ============================================================
// INTEGRATION INSTRUCTIONS
// ============================================================
//
// In your existing worker.js, find the main fetch handler:
//
//   export default {
//     async fetch(request, env, ctx) {
//       // ... existing code ...
//     }
//   }
//
// Add ONE LINE near the top of that fetch handler, after the
// URL is parsed but before any existing route handling:
//
//   const ssrResult = await handleSSR(request, env);
//   if (ssrResult) return ssrResult;
//
// Also add CACHE to your KV bindings in Cloudflare dashboard:
//   Workers & Pages → streamcast-proxy → Settings → Bindings
//   Add KV Namespace: variable name = CACHE
//   Use your existing HEREFISHYFISHY_CACHE namespace, or create a new one.
//
// That's it. The SSR routes will be live at:
//   herefishyfishy.ca/credit-river/brown-trout
//   herefishyfishy.ca/credit-river/rainbow-trout
//   herefishyfishy.ca/credit-river/brook-trout
//   herefishyfishy.ca/credit-river/steelhead
//   herefishyfishy.ca/credit-river/chinook-salmon
//   herefishyfishy.ca/credit-river/coho-salmon
// ========================================================

// ── Router ────────────────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }
    const url  = new URL(request.url);
    
  // SSR landing pages — /credit-river/{species} etc.
    const ssrResult = await handleSSR(request, env);
    if (ssrResult) return ssrResult;
    
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
    if (path === '/health')   return jsonResponse({ status: 'ok', version: '1.3.0', ts: new Date().toISOString() });
    if (path === '/stocking') return handleStocking(url, ctx);
    if (path === '/flow')     return handleFlow(url, ctx);
    if (path === '/fields')   return handleFields();
    if (path === '/lake-temps') return handleLakeTemps(url, ctx);
    return jsonResponse({ error: 'Valid endpoints: /stocking, /flow, /health, /fields, /lake-temps' }, 404);
  }
};
