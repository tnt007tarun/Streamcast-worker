var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../assets/conditions-core.js
var RIVER_SECTIONS = { "Beaver River": ["Lower Beaver River (Thornbury)", "Middle Beaver River (Clarksburg to Heathcote)", "Upper Beaver River (Kimberley)"], "Black Creek": ["Black Creek \u2014 Upper Reaches (Vaughan to North York)", "Black Creek \u2014 Lower Watershed & Humber Confluence"], "Bowmanville Creek": ["Bowmanville Creek \u2014 River Mouth & Piers", "Lower Bowmanville Creek", "Middle Bowmanville Creek (Fish Ladder)", "Upper Bowmanville Creek"], "Bronte Creek": ["Bronte Creek \u2014 Lower Estuary & Mouth", "Bronte Creek \u2014 Mid-Section & Provincial Park", "Bronte Creek \u2014 Upper Headwaters"], "Credit River": ["Upper Credit River", "Middle Credit River", "Lower Credit River"], "Duffins Creek": ["Duffins Creek \u2014 Lower Section", "Duffins Creek \u2014 Middle Section", "Duffins Creek \u2014 Upper Reaches"], "Eramosa River": ["Eramosa River \u2014 Upper Headwaters (Above Rockwood)", "Eramosa River \u2014 Mid-Section (Rockwood to Eden Mills)"], "Ganaraska River": ["Ganaraska River \u2014 Lower (Lake to CNR Bridge)", "Ganaraska River \u2014 Port Hope Sanctuary", "Ganaraska River \u2014 Upper & Conservation Areas"], "Grand River": ["Upper Grand River (Tailwater)", "Lower Grand River"], "Humber River": ["Lower Humber River", "Lower-Mid Humber (Old Mill to Eglinton)", "Upper Humber River (Headwaters)"], "Nottawasaga River": ["Nottawasaga River \u2014 Headwaters (Niagara Escarpment)", "Nottawasaga River \u2014 Middle Section (Alliston to Angus)", "Nottawasaga River \u2014 Lower Section (Boyne to Wasaga Beach)"], "Rouge River": ["Rouge River \u2014 Marsh & Mouth (Lake Ontario)", "Rouge River \u2014 Mid-Section (Rouge National Urban Park)", "Rouge River \u2014 Upper & Milne Dam (Markham)"], "Saugeen River": ["Saugeen River \u2014 Headwaters & Upper Tributaries", "Saugeen River \u2014 Lower Main Stem (Paisley to Southampton)"], "Sixteen Mile Creek": ["Sixteen Mile Creek \u2014 Lower Reaches & Oakville Harbour", "Sixteen Mile Creek \u2014 Middle Reaches & Main Valley", "Sixteen Mile Creek \u2014 Upper West Branch (Trout)"], "Speed River": ["Speed River \u2014 Upper (Above Guelph Lake)"], "Wilmot Creek": ["Wilmot Creek \u2014 Mouth & Marsh (Lake Ontario)", "Wilmot Creek \u2014 Lower River (to CN Rail Tracks)", "Wilmot Creek \u2014 Middle Section (Hwy 401 to Hwy 2)", "Wilmot Creek \u2014 Upper Watershed & Orono Crown Lands"] };
var SECTION_DISPLAY = {
  // "Sanctuary" read as closed, but this is the town reach, open outside Sep 1 to Oct 14.
  "Ganaraska River \u2014 Port Hope Sanctuary": "Ganaraska River \u2014 Port Hope Town Reach (Jocelyn St to CNR)"
};
function secDisplay(s) {
  s = String(s == null ? "" : s);
  return SECTION_DISPLAY[s] || s;
}
__name(secDisplay, "secDisplay");
function secLabel(s) {
  return secDisplay(s).replace(/ \u2014 /g, " \xB7 ");
}
__name(secLabel, "secLabel");
function secShort(s) {
  var d = secDisplay(s);
  return d.indexOf(" \u2014 ") !== -1 ? d.split(" \u2014 ")[1] : d;
}
__name(secShort, "secShort");
var STAGING_ZONES = {
  "Lower Credit River": { key: "credit", lat: 43.56, lng: -79.72, sLat: 43.53, sLng: -79.72, lake: "Lake Ontario" },
  "Lower Humber River": { key: "humber", lat: 43.64, lng: -79.48, sLat: 43.61, sLng: -79.47, lake: "Lake Ontario" },
  "Ganaraska River \u2014 Lower (Lake to CNR Bridge)": { key: "ganaraska", lat: 43.94, lng: -78.305, sLat: 43.915, sLng: -78.29, lake: "Lake Ontario" },
  "Bowmanville Creek \u2014 River Mouth & Piers": { key: "bowmanville", lat: 43.893, lng: -78.692, sLat: 43.87, sLng: -78.685, lake: "Lake Ontario" },
  "Wilmot Creek \u2014 Mouth & Marsh (Lake Ontario)": { key: "wilmot", lat: 43.912, lng: -78.598, sLat: 43.888, sLng: -78.59, lake: "Lake Ontario" },
  "Bronte Creek \u2014 Lower Estuary & Mouth": { key: "bronte", lat: 43.393, lng: -79.723, sLat: 43.37, sLng: -79.715, lake: "Lake Ontario" },
  "Sixteen Mile Creek \u2014 Lower Reaches & Oakville Harbour": { key: "sixteen", lat: 43.44, lng: -79.672, sLat: 43.415, sLng: -79.665, lake: "Lake Ontario" },
  "Rouge River \u2014 Marsh & Mouth (Lake Ontario)": { key: "rouge", lat: 43.803, lng: -79.134, sLat: 43.78, sLng: -79.125, lake: "Lake Ontario" },
  "Duffins Creek \u2014 Lower Section": { key: "duffins", lat: 43.835, lng: -79.075, sLat: 43.81, sLng: -79.06, lake: "Lake Ontario" },
  "Nottawasaga River \u2014 Lower Section (Boyne to Wasaga Beach)": { key: "nottawasaga", lat: 44.333, lng: -79.878, sLat: 44.355, sLng: -79.89, lake: "Georgian Bay" }
};
var STAGING_GROUP = {
  bowmanville: "east",
  wilmot: "east",
  ganaraska: "east",
  duffins: "centralEarly",
  humber: "central",
  credit: "central",
  rouge: "central",
  sixteen: "central",
  nottawasaga: "central",
  bronte: "late"
};
function _mfrac(month, day) {
  return month + Math.min(day, 30) / 30;
}
__name(_mfrac, "_mfrac");
function getSalmonPhase(groupKey, month, day) {
  var m = _mfrac(month, day);
  var G = {
    // eastern: stage Jul 1, run can trigger late Jul, big push mid-late Aug
    east: { stageStart: 6, runStart: 6.8, runPeak: 7.5, runEnd: 9.3 },
    // duffins: a few weeks ahead of west — stage mid-Jul, run early Sep
    centralEarly: { stageStart: 6.5, runStart: 8, runPeak: 8.4, runEnd: 9.7 },
    // central/west: stage late Jul, run mid-late Sep
    central: { stageStart: 6.8, runStart: 8.4, runPeak: 8.7, runEnd: 10 },
    // bronte: ~2 weeks behind central
    late: { stageStart: 7, runStart: 8.9, runPeak: 9.2, runEnd: 10.3 }
  };
  var g = G[groupKey] || G.central;
  if (m < g.stageStart) return { active: false, intensity: 0, label: "", mode: "none" };
  if (m < g.runStart) {
    var sFrac = (m - g.stageStart) / (g.runStart - g.stageStart);
    var inten = 0.25 + 0.55 * sFrac;
    return {
      active: true,
      intensity: Math.round(inten * 100) / 100,
      label: sFrac < 0.5 ? "Early staging" : "Staging building",
      mode: "stage"
    };
  }
  if (m < g.runEnd) {
    var peakDist = Math.abs(m - g.runPeak);
    var inten2 = m < g.runPeak ? 0.8 + 0.2 * ((m - g.runStart) / (g.runPeak - g.runStart)) : 1 - 0.6 * ((m - g.runPeak) / (g.runEnd - g.runPeak));
    inten2 = Math.max(0.3, Math.min(1, inten2));
    return {
      active: true,
      intensity: Math.round(inten2 * 100) / 100,
      label: m < g.runPeak ? "Run starting" : m < g.runPeak + 0.5 ? "Peak run" : "Run tapering",
      mode: "run"
    };
  }
  return { active: false, intensity: 0, label: "", mode: "none" };
}
__name(getSalmonPhase, "getSalmonPhase");
function getSteelheadPhase(month, day, lakeTemp) {
  var m = _mfrac(month, day);
  if (m >= 8 && m < 8.7) return { active: true, intensity: 0.4, label: "Fall staging", mode: "stage" };
  if (m >= 8.7 && m < 10.3) return { active: true, intensity: 0.6, label: "Fall run", mode: "run" };
  if (m >= 10.3 || m < 2) return { active: true, intensity: 0.3, label: "Winter holdovers", mode: "run" };
  if (m >= 2 && m < 4.4) {
    if (lakeTemp != null) {
      if (lakeTemp >= 5 && lakeTemp <= 12) return { active: true, intensity: 0.9, label: "Spring run", mode: "stage" };
      if (lakeTemp > 12 && lakeTemp <= 15) return { active: true, intensity: 0.45, label: "Spring run winding down", mode: "run" };
      if (lakeTemp > 15) return { active: false, intensity: 0, label: "", mode: "none" };
      return { active: true, intensity: 0.25, label: "Pre-run, water still cold", mode: "stage" };
    }
    if (m >= 2.3 && m < 4) return { active: true, intensity: 0.8, label: "Spring run", mode: "stage" };
    return { active: true, intensity: 0.4, label: "Spring run building", mode: "stage" };
  }
  return { active: false, intensity: 0, label: "", mode: "none" };
}
__name(getSteelheadPhase, "getSteelheadPhase");
function computeStagingScore(lakeTempC, windDir, windSpeed, cloudPct, intensity, mouthFaces, tempIsEstimate) {
  var score = intensity;
  var factors = [];
  var _tSuffix = tempIsEstimate ? " (seasonal est.)" : "";
  if (lakeTempC != null) {
    if (lakeTempC >= 10 && lakeTempC <= 17) {
      score += 0.25;
      factors.push("surface temp in staging band" + _tSuffix);
    } else if (lakeTempC > 17 && lakeTempC <= 20) {
      score += 0.1;
      factors.push("surface temp slightly warm" + _tSuffix);
    } else if (lakeTempC > 20) {
      score -= 0.1;
      factors.push("surface temp warm, fish holding deeper" + _tSuffix);
    } else if (lakeTempC < 10) {
      score += 0.05;
      factors.push("cool surface, fish may be shallow" + _tSuffix);
    }
  }
  var _upwell = null;
  if (windDir != null && mouthFaces != null && windSpeed != null) {
    var _ekman = (windDir + 270) % 360;
    var _off = Math.abs((_ekman - mouthFaces + 540) % 360 - 180);
    if (_off <= 45 && windSpeed >= 15) {
      score += 0.25;
      _upwell = "up-strong";
      factors.push("upwelling, cold water pushing into the mouth");
    } else if (_off <= 45 && windSpeed >= 8) {
      score += 0.12;
      _upwell = "up-light";
      factors.push("light upwelling, water cooling at the mouth");
    } else if (_off <= 75 && windSpeed >= 18) {
      score += 0.1;
      _upwell = "up-light";
      factors.push("some upwelling push");
    } else if (_off >= 135 && windSpeed >= 15) {
      score -= 0.15;
      _upwell = "down-strong";
      factors.push("downwelling, warm surface water piling up at the mouth");
    } else if (_off >= 135 && windSpeed >= 8) {
      score -= 0.07;
      _upwell = "down-light";
      factors.push("mild downwelling, surface warming at the mouth");
    } else {
      if (windSpeed < 8) {
        factors.push("wind light, little upwelling push either way");
      } else {
        factors.push("wind mostly alongshore, little upwelling effect");
      }
    }
    if (_upwell === "up-strong" && lakeTempC != null && lakeTempC > 20) {
      score += 0.1;
      factors.push("offshore reading warm but shore water cooling fast");
    }
  }
  if (windDir != null && mouthFaces != null) {
    var diff = Math.abs((windDir - mouthFaces + 540) % 360 - 180);
    if (diff < 60 && windSpeed >= 10) {
      score += 0.15;
      factors.push("onshore wind stacking bait at the mouth");
    } else if (diff < 90 && windSpeed >= 8) {
      score += 0.08;
      factors.push("some onshore push");
    } else if (diff > 130 && windSpeed >= 15) {
      score -= 0.08;
      factors.push("offshore wind flattening the bite");
    }
  }
  if (cloudPct != null) {
    if (cloudPct >= 70) {
      score += 0.12;
      factors.push("overcast, fish holding higher in the water");
    } else if (cloudPct <= 20) {
      score -= 0.05;
      factors.push("bright sun, fish sounding deeper");
    }
  }
  score = Math.max(0, Math.min(1, score));
  return { score, factors, upwell: _upwell, windSpeed };
}
__name(computeStagingScore, "computeStagingScore");
function riverSystemName(sectionName) {
  if (!sectionName) return "";
  return String(sectionName).split(",")[0].split(" \u2014 ")[0].replace(/\s*\([^)]*\)\s*/g, " ").replace(/^(Upper|Middle|Lower-Mid|Lower|Mid)\s+/i, "").trim();
}
__name(riverSystemName, "riverSystemName");
function stagingZoneForSection(sectionName) {
  if (typeof STAGING_ZONES === "undefined" || !sectionName) return null;
  var base = String(sectionName).split(",")[0].trim();
  if (STAGING_ZONES[base]) return base;
  var core = riverSystemName(base);
  if (!core) return null;
  var found = null;
  Object.keys(STAGING_ZONES).forEach(function(z) {
    if (found) return;
    if (z.indexOf(core) !== -1 || riverSystemName(z) === core) found = z;
  });
  return found;
}
__name(stagingZoneForSection, "stagingZoneForSection");
function seasonWindowFor(band, year) {
  var openD = _resolveClosureDate("FRI_BEFORE_4TH_SAT_APRIL", year);
  if (openD) {
    openD = new Date(openD);
    openD.setDate(openD.getDate() + 1);
  }
  if (band === "all-year") return null;
  var close = band === "extended" ? new Date(year, 11, 31) : new Date(year, 8, 30);
  return { open: openD, close };
}
__name(seasonWindowFor, "seasonWindowFor");
function seasonClosureFor(cfg, dateStr) {
  if (!cfg || !dateStr) return null;
  var band = cfg.season || "standard";
  var parts = dateStr.split("-");
  var y = parseInt(parts[0], 10);
  var d = new Date(y, parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  var w = seasonWindowFor(band, y);
  if (!w) return null;
  if (d >= w.open && d <= w.close) return null;
  var reopen = d > w.close ? y + 1 : y;
  return {
    band,
    reason: band === "extended" ? "Trout and salmon season on this reach runs from the fourth Saturday in April to December 31." : "Trout and salmon season on this reach runs from the fourth Saturday in April to September 30.",
    reopens: reopen
  };
}
__name(seasonClosureFor, "seasonClosureFor");
function speciesFishableIn(sectionName, speciesName2, dateStr) {
  var c = getRiverConfig(sectionName);
  if (!c || !c.species || c.species.indexOf(speciesName2) === -1) return false;
  if (seasonClosureFor(c, dateStr)) return false;
  if (allAccessClosed(c, dateStr)) return false;
  var s = getCurrentSeason(speciesName2, dateStr, sectionName);
  return !!s && (s.quality === "peak" || s.quality === "good");
}
__name(speciesFishableIn, "speciesFishableIn");
var UPSTREAM_OF = {
  "Ganaraska River \u2014 Lower (Lake to CNR Bridge)": "Ganaraska River \u2014 Port Hope Sanctuary",
  "Ganaraska River \u2014 Port Hope Sanctuary": "Ganaraska River \u2014 Upper & Conservation Areas",
  "Bowmanville Creek \u2014 River Mouth & Piers": "Lower Bowmanville Creek",
  "Lower Bowmanville Creek": "Middle Bowmanville Creek (Fish Ladder)",
  "Middle Bowmanville Creek (Fish Ladder)": "Upper Bowmanville Creek",
  "Wilmot Creek \u2014 Mouth & Marsh (Lake Ontario)": "Wilmot Creek \u2014 Lower River (to CN Rail Tracks)",
  "Wilmot Creek \u2014 Lower River (to CN Rail Tracks)": "Wilmot Creek \u2014 Middle Section (Hwy 401 to Hwy 2)",
  "Wilmot Creek \u2014 Middle Section (Hwy 401 to Hwy 2)": "Wilmot Creek \u2014 Upper Watershed & Orono Crown Lands",
  "Duffins Creek \u2014 Lower Section": "Duffins Creek \u2014 Middle Section",
  "Duffins Creek \u2014 Middle Section": "Duffins Creek \u2014 Upper Reaches",
  "Rouge River \u2014 Marsh & Mouth (Lake Ontario)": "Rouge River \u2014 Mid-Section (Rouge National Urban Park)",
  "Rouge River \u2014 Mid-Section (Rouge National Urban Park)": "Rouge River \u2014 Upper & Milne Dam (Markham)",
  "Lower Humber River": "Lower-Mid Humber (Old Mill to Eglinton)",
  "Lower-Mid Humber (Old Mill to Eglinton)": "Upper Humber River (Headwaters)",
  "Lower Credit River": "Middle Credit River",
  "Middle Credit River": "Upper Credit River",
  "Sixteen Mile Creek \u2014 Lower Reaches & Oakville Harbour": "Sixteen Mile Creek \u2014 Middle Reaches & Main Valley",
  "Sixteen Mile Creek \u2014 Middle Reaches & Main Valley": "Sixteen Mile Creek \u2014 Upper West Branch (Trout)",
  "Bronte Creek \u2014 Lower Estuary & Mouth": "Bronte Creek \u2014 Mid-Section & Provincial Park",
  "Bronte Creek \u2014 Mid-Section & Provincial Park": "Bronte Creek \u2014 Upper Headwaters",
  "Nottawasaga River \u2014 Lower Section (Boyne to Wasaga Beach)": "Nottawasaga River \u2014 Middle Section (Alliston to Angus)",
  "Nottawasaga River \u2014 Middle Section (Alliston to Angus)": "Nottawasaga River \u2014 Headwaters (Niagara Escarpment)",
  "Saugeen River \u2014 Lower Main Stem (Paisley to Southampton)": "Saugeen River \u2014 Headwaters & Upper Tributaries",
  "Lower Beaver River (Thornbury)": "Middle Beaver River (Clarksburg to Heathcote)",
  "Middle Beaver River (Clarksburg to Heathcote)": "Upper Beaver River (Kimberley)"
};
function upstreamWindowOn(dateStr) {
  if (!dateStr) return false;
  var p = dateStr.split("-"), y = parseInt(p[0], 10);
  var d = new Date(y, parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  if (d.getMonth() >= 9) return true;
  var opener = seasonWindowFor("standard", y);
  return !!(opener && d >= opener.open && d <= new Date(y, 4, 31));
}
__name(upstreamWindowOn, "upstreamWindowOn");
function furthestUpstreamOpen(sectionName, speciesNames, dateStr) {
  if (!dateStr || !speciesNames || !speciesNames.length) return null;
  if (!upstreamWindowOn(dateStr)) return null;
  var cur = String(sectionName || "").split(",")[0].trim(), best = null, seen = {};
  while (UPSTREAM_OF[cur] && !seen[cur]) {
    seen[cur] = true;
    cur = UPSTREAM_OF[cur];
    var ok = speciesNames.filter(function(n) {
      return speciesFishableIn(cur, n, dateStr);
    });
    if (ok.length) best = { section: cur, species: ok[0] };
  }
  return best;
}
__name(furthestUpstreamOpen, "furthestUpstreamOpen");
function _nthWeekdayOfMonth(year, month, weekday, n) {
  var d = new Date(year, month - 1, 1), count = 0;
  while (d.getMonth() === month - 1) {
    if (d.getDay() === weekday) {
      count++;
      if (count === n) return new Date(d);
    }
    d.setDate(d.getDate() + 1);
  }
  return null;
}
__name(_nthWeekdayOfMonth, "_nthWeekdayOfMonth");
function _resolveClosureDate(token, year) {
  if (/^\d{2}-\d{2}$/.test(token)) {
    return new Date(year, parseInt(token.slice(0, 2), 10) - 1, parseInt(token.slice(3), 10));
  }
  if (token === "FRI_BEFORE_4TH_SAT_APRIL") {
    var s = _nthWeekdayOfMonth(year, 4, 6, 4);
    if (!s) return null;
    var f = new Date(s);
    f.setDate(f.getDate() - 1);
    return f;
  }
  if (token === "FRI_BEFORE_2ND_SAT_MAY") {
    var s2 = _nthWeekdayOfMonth(year, 5, 6, 2);
    if (!s2) return null;
    var f2 = new Date(s2);
    f2.setDate(f2.getDate() - 1);
    return f2;
  }
  return null;
}
__name(_resolveClosureDate, "_resolveClosureDate");
function accessClosureOn(spot, dateStr) {
  if (!spot || !spot.closed || !spot.closed.length || !dateStr) return null;
  var parts = dateStr.split("-");
  var y = parseInt(parts[0], 10);
  var d = new Date(y, parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  for (var i = 0; i < spot.closed.length; i++) {
    var win = spot.closed[i];
    if (win.allYear) return win;
    var from = _resolveClosureDate(win.from, y);
    var to = _resolveClosureDate(win.to, y);
    if (!from || !to) continue;
    if (from <= to) {
      if (d >= from && d <= to) return win;
    } else {
      if (d >= from || d <= to) return win;
    }
  }
  return null;
}
__name(accessClosureOn, "accessClosureOn");
function isAccessOpen(spot, dateStr) {
  return !accessClosureOn(spot, dateStr);
}
__name(isAccessOpen, "isAccessOpen");
function allAccessClosed(cfg, dateStr) {
  if (!cfg || !cfg.access || !cfg.access.length || !dateStr) return false;
  return !cfg.access.some(function(a) {
    return isAccessOpen(a, dateStr);
  });
}
__name(allAccessClosed, "allAccessClosed");
var REGS_ROW_PATTERNS = {
  brown: /brown/i,
  rainbow: /rainbow/i,
  brook: /brook/i,
  chinook: /chinook/i,
  coho: /coho/i,
  steelhead: /steelhead|rainbow/i
};
function regsRowMatches(rowName, speciesKey) {
  var re = REGS_ROW_PATTERNS[speciesKey];
  return re ? re.test(rowName || "") : false;
}
__name(regsRowMatches, "regsRowMatches");
function bestAccessSpot(access, atMouth) {
  if (!access || !access.length) return null;
  if (atMouth) {
    return access.filter(function(a) {
      return a.mouth === true;
    })[0] || access.find(function(a) {
      return a.crowd === "low";
    }) || access[0];
  }
  var inRiver = access.filter(function(a) {
    return a.mouth !== true;
  });
  var pool = inRiver.length ? inRiver : access;
  return pool.find(function(a) {
    return a.crowd === "low";
  }) || pool.find(function(a) {
    return a.crowd === "med";
  }) || pool[0];
}
__name(bestAccessSpot, "bestAccessSpot");
function sectionClosedOn(cfg, dateStr) {
  return !!(seasonClosureFor(cfg, dateStr) || allAccessClosed(cfg, dateStr));
}
__name(sectionClosedOn, "sectionClosedOn");
function mouthPreferenceFor(speciesName2, dateStr) {
  var MIG = ["Chinook Salmon", "Coho Salmon", "Steelhead"];
  if (!speciesName2 || MIG.indexOf(speciesName2) === -1) return 0;
  if (typeof getCurrentSeason !== "function") return 0;
  var w = getCurrentSeason(speciesName2, dateStr);
  if (!w) return 0;
  var lab = (w.label || "").toLowerCase();
  if (/in lake/.test(lab)) return 8;
  if (/harbour|staging|mouth/.test(lab)) return 6;
  if (/early run/.test(lab)) return 3;
  return 0;
}
__name(mouthPreferenceFor, "mouthPreferenceFor");
var LAKE_TEMP_CLIMATOLOGY = {
  "Lake Ontario": [3, 2, 2, 5, 10, 16, 21, 22, 19, 14, 9, 5],
  "Georgian Bay": [2, 1, 2, 5, 10, 16, 20, 21, 18, 12, 7, 4],
  "Lake Huron": [2, 1, 2, 5, 10, 16, 20, 21, 18, 12, 7, 4],
  "Lake Erie": [3, 2, 3, 7, 13, 19, 23, 24, 21, 15, 9, 5]
};
function seasonalLakeTempEst(lakeName, monthIdx) {
  var series = LAKE_TEMP_CLIMATOLOGY[lakeName] || LAKE_TEMP_CLIMATOLOGY["Lake Ontario"];
  var m = monthIdx == null ? (/* @__PURE__ */ new Date()).getMonth() : monthIdx;
  return series[Math.max(0, Math.min(11, m))];
}
__name(seasonalLakeTempEst, "seasonalLakeTempEst");
var TEMP_MIN = 8;
var TEMP_MAX = 14;
var TEMP_STRESS = 18;
var RIVER_CONFIG = {
  "Upper Grand River (Tailwater)": {
    season: "standard",
    // MNR 2026: Brook, Brown and Rainbow Trout are S-0 / C-0 here \u2014 catch and release only.
    catchRelease: ["Brook Trout", "Brown Trout", "Rainbow Trout", "Steelhead"],
    // MNR 2026: only artificial lures, one single-pointed barbless hook. Roe, worms and
    // all other organic bait are illegal here — no float/bait method may be recommended.
    artificialOnly: true,
    gauge: "02GA016",
    gaugeName: "Grand River below Shand Dam",
    sweetMin: 8,
    sweetMax: 12,
    flowLow: 3,
    flowHigh: 25,
    lat: 43.7,
    lng: -80.28,
    loc: "Below Shand Dam through Elora Gorge to West Montrose",
    driveTime: { toronto: 25, mississauga: 15, brampton: 20, oakville: 15, burlington: 25, milton: 15, hamilton: 35, guelph: 45, cambridge: 55, kitchener: 65, waterloo: 70, orangeville: 50, "north york": 30, scarborough: 35, etobicoke: 15, markham: 45, "richmond hill": 45, vaughan: 40, ajax: 65, pickering: 60, oshawa: 80, whitby: 75, bowmanville: 95, clarington: 105, newcastle: 105, cobourg: 145, "port hope": 130, barrie: 100, collingwood: 120, "owen sound": 160 },
    species: ["Brown Trout", "Rainbow Trout"],
    active: true,
    regs: [],
    methods: ["fly", "spin", "float"],
    access: [
      { name: "Fergus Pool \xB7 Below Shand Dam", closed: [{ from: "10-01", to: "12-31", why: "Trout season is closed Oct 1 to Dec 31 on this reach. It is catch and release, artificial lures and one barbless hook when open." }, { from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "Trout season is closed until the opener on the fourth Saturday in April" }], loc: "Fergus, ON \xB7 Below Shand Dam", crowd: "med", desc: "Closest tailwater to the dam. Cold, steady flows all year from bottom-draw releases make it prime summer water when other rivers are too warm." },
      { name: "Elora Gorge", closed: [{ from: "10-01", to: "12-31", why: "Trout season is closed Oct 1 to Dec 31 on this reach. It is catch and release, artificial lures and one barbless hook when open." }, { from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "Trout season is closed until the opener on the fourth Saturday in April" }], loc: "Elora, ON \xB7 Below gorge on river-right", crowd: "high", desc: "Deep pools, limestone walls and predictable brown trout habitat. Heavy weekend pressure. The gorge walls throw shade even on sunny days, which helps at midday." },
      { name: "Racquet Club", closed: [{ from: "10-01", to: "12-31", why: "Trout season is closed Oct 1 to Dec 31 on this reach. It is catch and release, artificial lures and one barbless hook when open." }, { from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "Trout season is closed until the opener on the fourth Saturday in April" }], loc: "Elora, ON \xB7 North of Quarry CA on Wellington Rd 18", crowd: "low", desc: "North of Elora on Wellington Rd 18. Turn right at the next road after the Quarry Conservation Area. Park here and follow the steep trail down to the river. It can be slippery in wet weather." },
      { name: "The Trestle", closed: [{ from: "10-01", to: "12-31", why: "Trout season is closed Oct 1 to Dec 31 on this reach. It is catch and release, artificial lures and one barbless hook when open." }, { from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "Trout season is closed until the opener on the fourth Saturday in April" }], loc: "Elora, ON \xB7 Wellington Rd 18", crowd: "low", desc: "Past the railway trestle on Wellington Rd 18. Look for a sharp right turn, where a marked trail and stairs lead down to the river." },
      { name: "Wilson's Flats", closed: [{ from: "10-01", to: "12-31", why: "Trout season is closed Oct 1 to Dec 31 on this reach. It is catch and release, artificial lures and one barbless hook when open." }, { from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "Trout season is closed until the opener on the fourth Saturday in April" }], loc: "Elora, ON \xB7 Grand River, Wilson's Flats", crowd: "low", desc: "Continue north on Wellington Rd 18 and turn left onto 2nd Line. Limited roadside parking, and the river is a short walk away." },
      { name: "Irvine Creek Confluence", closed: [{ from: "10-01", to: "12-31", why: "Trout season is closed Oct 1 to Dec 31 on this reach. It is catch and release, artificial lures and one barbless hook when open." }, { from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "Trout season is closed until the opener on the fourth Saturday in April" }], loc: "Elora, ON \xB7 Where Irvine Creek meets the Grand", crowd: "low", desc: "Underused. The confluence concentrates baitfish and large browns. Most anglers don't walk past the gorge. Access is via the Wellington County trail system." },
      { name: "Elora Gorge Conservation Area", closed: [{ from: "10-01", to: "12-31", why: "Trout season is closed Oct 1 to Dec 31 on this reach. It is catch and release, artificial lures and one barbless hook when open." }, { from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "Trout season is closed until the opener on the fourth Saturday in April" }], loc: "Elora, ON \xB7 GRCA managed access", crowd: "high", desc: "Managed access with day-use fee. Interior sections slightly less pressured. The upstream end near the lookout bridge consistently holds large fish." }
    ]
  },
  "Middle Grand River": {
    // MNR 2026: Brook, Brown and Rainbow Trout are S-0 / C-0 here \u2014 catch and release only.
    catchRelease: ["Brook Trout", "Brown Trout", "Rainbow Trout", "Steelhead"],
    // MNR 2026: only artificial lures, one single-pointed barbless hook. Roe, worms and
    // all other organic bait are illegal here — no float/bait method may be recommended.
    artificialOnly: true,
    gauge: "02GA016",
    gaugeName: "Grand River below Shand Dam",
    sweetMin: 8,
    sweetMax: 15,
    flowLow: 3,
    flowHigh: 30,
    lat: 43.42,
    lng: -80.32,
    loc: "Waterloo through Cambridge, Paris, Brantford",
    driveTime: { toronto: 100, mississauga: 90, brampton: 65, oakville: 55, burlington: 50, milton: 40, hamilton: 45, guelph: 15, cambridge: 5, kitchener: 15, waterloo: 20, orangeville: 65, markham: 105, "richmond hill": 100, vaughan: 95, ajax: 130, pickering: 125, "north york": 95, scarborough: 105, etobicoke: 85, oshawa: 145, whitby: 140, bowmanville: 160, clarington: 170, newcastle: 170, cobourg: 205, "port hope": 195, barrie: 135, collingwood: 135, "owen sound": 155 },
    species: ["Brown Trout", "Rainbow Trout"],
    active: false,
    regs: [],
    methods: ["spin", "float"],
    access: []
  },
  "Lower Grand River": {
    season: "extended",
    // MNR 2026: catch and release (S-0 / C-0) applies from Paris to Brantford only. This
    // section's access points (Caledonia, Dunnville) are below Brantford, where Brown and
    // Rainbow Trout combined are S-1 / C-0 from Oct 1 to Dec 31 and zone limits otherwise.
    // So no catchRelease tag here; the regs line below carries the fall limit.
    gauge: "02GA016",
    gaugeName: "Grand River below Shand Dam",
    sweetMin: 10,
    sweetMax: 30,
    flowLow: 5,
    flowHigh: 60,
    lat: 43,
    lng: -79.9,
    loc: "Caledonia through Dunnville to Lake Erie",
    driveTime: { toronto: 100, mississauga: 100, brampton: 90, oakville: 60, burlington: 40, milton: 65, hamilton: 30, guelph: 75, cambridge: 60, kitchener: 80, waterloo: 80, orangeville: 115, markham: 120, "richmond hill": 120, vaughan: 115, ajax: 130, pickering: 130, "north york": 110, scarborough: 115, etobicoke: 95, oshawa: 145, whitby: 140, bowmanville: 160, clarington: 165, newcastle: 165, cobourg: 200, "port hope": 185, barrie: 175, collingwood: 190, "owen sound": 215 },
    species: ["Steelhead"],
    active: true,
    regs: [{ rule: "Paris to Lake Erie: open fourth Saturday in April to Dec 31. Below Brantford, Brown and Rainbow Trout are S-1 and C-0 from Oct 1 to Dec 31.", icon: "\u{1F4CB}" }, { rule: "Below the Caledonia dam: Walleye S-4 and C-2, any size. Walleye and Pike are closed Mar 1 to the Friday before the second Saturday in May.", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Caledonia \xB7 Argyle Street Access", loc: "Caledonia, ON \xB7 Argyle Street bridge", crowd: "low", desc: "Good access to the lower Grand. Spring and fall steelhead runs from Lake Erie. Best fished from a kayak for this wider section of river." },
      { name: "Dunnville \xB7 Lower Grand", loc: "Dunnville, ON \xB7 Near Lake Erie mouth", crowd: "med", desc: "Near the mouth of the Grand at Lake Erie. Major steelhead staging area in spring and fall. Some access from shoreline but boat is preferred for best results." }
    ]
  },
  "Upper Credit River": {
    season: "standard",
    // MNR 2026: Brook, Brown and Rainbow Trout are S-0 / C-0 here \u2014 catch and release only.
    catchRelease: ["Brook Trout", "Brown Trout", "Rainbow Trout", "Steelhead"],
    // MNR 2026: only artificial lures, one single-pointed barbless hook. Roe, worms and
    // all other organic bait are illegal here — no float/bait method may be recommended.
    artificialOnly: true,
    gauge: "02HB001",
    gaugeName: "Credit River near Cataract",
    sweetMin: 5,
    sweetMax: 15,
    flowLow: 1,
    flowHigh: 25,
    lat: 43.87,
    lng: -80.01,
    loc: "Headwaters to Inglewood (Erin, Mono, Orangeville)",
    driveTime: { toronto: 35, mississauga: 35, brampton: 20, oakville: 30, burlington: 35, milton: 20, hamilton: 40, guelph: 20, cambridge: 35, kitchener: 35, waterloo: 35, orangeville: 5, markham: 30, "richmond hill": 30, vaughan: 25, ajax: 45, pickering: 40, "north york": 30, scarborough: 35, etobicoke: 30, oshawa: 50, whitby: 50, bowmanville: 60, clarington: 60, newcastle: 65, cobourg: 80, "port hope": 80, barrie: 35, collingwood: 40, "owen sound": 60 },
    species: ["Brown Trout", "Rainbow Trout", "Brook Trout"],
    active: true,
    regs: [],
    methods: [],
    access: [
      { name: "Upper Credit Conservation Area", loc: "Caledon, ON \xB7 CVC managed \xB7 above Orangeville", crowd: "low", desc: "CVC-designated coldwater fishery on the upper Credit headwaters. Wild brook trout in the main river and feeder creeks. Catch-and-release only. Quieter than Belfountain. Bring waders, as bank access is limited." },
      { name: "Belfountain Conservation Area", loc: "Belfountain, ON \xB7 Above the falls", crowd: "med", desc: "Picturesque gorge setting above a small dam. Good dry fly water in low flows. The pool below the dam holds resident brown trout year-round. CVC managed, day-use fee applies." },
      { name: "Forks of the Credit Provincial Park", closed: [{ from: "10-01", to: "12-31", why: "Fish sanctuary. No fishing Oct 1 to Dec 31 (Old Baseline Rd to Hwy 9)" }, { from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "Fish sanctuary. Closed until the trout opener" }], loc: "Cataract, ON \xB7 Niagara Escarpment gorge", crowd: "med", desc: "Spectacular gorge section below the Cataract waterfalls. Wild brown trout in pools below the escarpment. Catch-and-release only in most sections. Hike-in required to the best water." },
      { name: "Belfountain to Inglewood Reach", loc: "Between Belfountain and Inglewood", crowd: "low", desc: "Walk-in access only along this productive section. Fewer anglers, quality fish. Brown trout and rainbow trout throughout. Road allowance access at several bridge crossings." }
    ]
  },
  "Middle Credit River": {
    season: "extended",
    gauge: "02HB001",
    gaugeName: "Credit River near Cataract",
    sweetMin: 5,
    sweetMax: 20,
    flowLow: 1,
    flowHigh: 40,
    lat: 43.66,
    lng: -79.88,
    loc: "Norval Dam upstream to Inglewood",
    driveTime: { toronto: 30, mississauga: 5, brampton: 15, oakville: 20, burlington: 30, milton: 15, hamilton: 40, guelph: 35, cambridge: 50, kitchener: 60, waterloo: 60, orangeville: 35, "north york": 35, scarborough: 40, etobicoke: 20, markham: 45, "richmond hill": 40, vaughan: 35, ajax: 65, pickering: 60, oshawa: 75, whitby: 70, bowmanville: 90, clarington: 100, newcastle: 100, cobourg: 135, "port hope": 125, barrie: 90, collingwood: 110, "owen sound": 150 },
    // Chinook and Coho removed: the Streetsville dam is their upstream limit, and the
    // CRAA fishway is deliberately closed during the chinook run so MNR can collect
    // eggs. Only Atlantic salmon, steelhead, brown trout and coaster brook trout are
    // lifted above it.
    species: ["Brown Trout", "Rainbow Trout", "Steelhead"],
    active: true,
    regs: [{ rule: "Britannia Rd to Hwy 407: open fourth Saturday in April to Dec 31. Hwy 403 to Britannia Rd is a sanctuary from Aug 15 to Dec 31. Above Hwy 407 (Norval) the season ends Sept 30.", icon: "\u{1F4CB}" }],
    methods: ["float"],
    access: [
      { name: "McNab Park", closed: [{ from: "10-01", to: "12-31", why: "Norval is above Hwy 407, where the trout and salmon season ends Sept 30" }, { from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "Fish sanctuary. Closed until the trout opener" }], loc: "Norval, ON \xB7 Below Norval Dam", crowd: "low", desc: "Village park access on the Credit below the Norval dam. Migratory fish stack below the dam in fall, since the dam is the upstream limit for salmon on this system. Quieter than the Streetsville reaches. The season here ends Sept 30, so fish it in spring and September." },
      { name: "Streetsville Road Allowances", closed: [{ from: "08-15", to: "12-31", why: "Part of this reach is below the Britannia Rd bridge, inside the Hwy 403\u2013Britannia sanctuary, where there\u2019s no fishing Aug 15 to Dec 31. Fish above Britannia only, and know exactly where the bridge is." }, { from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "Fish sanctuary. Closed until the trout opener" }], loc: "Streetsville, ON \xB7 Multiple road allowances", crowd: "low", desc: "Several road allowance access points through this reach. Quieter than the lower river access points." }
    ]
  },
  "Lower Credit River": {
    season: "all-year",
    // Cataract sits ~40 km upstream near the Forks and does not represent lower-river flow.
    gauge: "02HB029",
    gaugeName: "Credit River at Streetsville",
    sweetMin: 5,
    sweetMax: 30,
    flowLow: 1,
    flowHigh: 60,
    lat: 43.56,
    lng: -79.72,
    // Reach now runs up to the Norval dam. Chinook and Coho still stop at the
    // Streetsville dam partway up it, so the access list stays below Streetsville —
    // Erindale and the river mouth — and never sends anyone to water salmon cannot reach.
    loc: "Norval Dam to Port Credit / Lake Ontario",
    driveTime: { toronto: 20, mississauga: 15, brampton: 10, oakville: 5, burlington: 15, milton: 10, hamilton: 20, guelph: 25, cambridge: 30, kitchener: 35, waterloo: 40, orangeville: 30, markham: 25, "richmond hill": 25, vaughan: 20, ajax: 35, pickering: 30, "north york": 20, scarborough: 25, etobicoke: 15, oshawa: 40, whitby: 40, bowmanville: 50, clarington: 55, newcastle: 55, cobourg: 75, "port hope": 70, barrie: 50, collingwood: 60, "owen sound": 80 },
    species: ["Steelhead", "Chinook Salmon", "Coho Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "Check the regulations. This section has specific rules around the river mouth", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Erindale Park", loc: "Mississauga, ON \xB7 Erindale", crowd: "med", desc: "Popular access point with parking. Good pool and run structure. Steelhead and salmon stack here during peak migrations." },
      { name: "Credit River Mouth \xB7 Port Credit", mouth: true, loc: "Mississauga, ON \xB7 Port Credit Harbour", crowd: "high", desc: "The river mouth at Port Credit Harbour. Very accessible but heavily pressured during peak salmon season. Best early morning on weekdays. Check water temperatures at the port, since cooler surface water increases fish activity." }
    ]
  },
  "Bronte Creek \u2014 Lower Estuary & Mouth": {
    season: "all-year",
    gauge: "02HB011",
    gaugeName: "Bronte Creek at Zimmerman",
    sweetMin: 2,
    sweetMax: 10,
    flowLow: 0.5,
    flowHigh: 20,
    lat: 43.434,
    lng: -79.716,
    loc: "Lake Ontario to Lakeshore Road West (Bronte Harbour)",
    driveTime: { "toronto": 35, "north york": 35, "scarborough": 40, "etobicoke": 25, "markham": 45, "richmond hill": 45, "vaughan": 40, "ajax": 55, "pickering": 50, "mississauga": 30, "brampton": 25, "oakville": 5, "burlington": 10, "milton": 15, "hamilton": 15, "guelph": 35, "cambridge": 35, "kitchener": 45, "waterloo": 50, "orangeville": 45, "oshawa": 65, "whitby": 60, "bowmanville": 75, "clarington": 80, "newcastle": 80, "cobourg": 105, "port hope": 95, "barrie": 80, "collingwood": 95, "owen sound": 120 },
    species: ["Steelhead", "Chinook Salmon", "Coho Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "Generally open year-round. Standard FMZ limits and dates for trout and salmon apply.", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Bronte Harbour / Pier", mouth: true, loc: "Bronte Harbour \xB7 Oakville, ON", crowd: "high", desc: "The staging area for fall salmon and spring steelhead coming in from Lake Ontario. Fishing spoons and crankbaits from the pier intercepts chrome fish before they push upriver. Very popular, so expect crowds on fall weekends." },
      { name: "Petro-Canada Park (Petro Park)", loc: "Bronte \xB7 Below Lakeshore Road West", crowd: "high", desc: "One of the most heavily fished spots on the creek. Deep pools below Lakeshore Road hold staging fish throughout the run season. Float fishing with roe and beads most productive." },
      { name: "Below Lakeshore Road West", loc: "Lakeshore Road West \xB7 Creek access", crowd: "med", desc: "Access point between the harbour and the mid-section. Good run and pool structure. Slightly less pressure than the pier or Petro Park." }
    ]
  },
  "Bronte Creek \u2014 Mid-Section & Provincial Park": {
    season: "extended",
    gauge: "02HB011",
    gaugeName: "Bronte Creek at Zimmerman",
    sweetMin: 2,
    sweetMax: 10,
    flowLow: 0.5,
    flowHigh: 20,
    lat: 43.465,
    lng: -79.735,
    loc: "Lakeshore Road West to Highway 407 (Bronte Creek Provincial Park)",
    driveTime: { "toronto": 40, "north york": 40, "scarborough": 40, "etobicoke": 25, "markham": 45, "richmond hill": 45, "vaughan": 40, "ajax": 60, "pickering": 55, "mississauga": 30, "brampton": 25, "oakville": 5, "burlington": 15, "milton": 10, "hamilton": 20, "guelph": 35, "cambridge": 40, "kitchener": 50, "waterloo": 50, "orangeville": 50, "oshawa": 70, "whitby": 70, "bowmanville": 80, "clarington": 90, "newcastle": 90, "cobourg": 115, "port hope": 110, "barrie": 85, "collingwood": 100, "owen sound": 130 },
    species: ["Steelhead", "Chinook Salmon", "Coho Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "Closed Jan 1 to Friday before 4th Saturday in April. Open 4th Saturday in April through Dec 31 for migratory species.", icon: "\u{1F4CB}" }],
    methods: ["float", "fly"],
    access: [
      { name: "Bronte Creek Provincial Park", loc: "Burloak Drive \xB7 Oakville, ON \xB7 Ontario Parks managed", crowd: "med", desc: "Access via the Half Moon Valley Trail down into the shale bedrock valley. Deep, narrow holding water for migratory fish. Day-use fee applies. Popular for fly fishing and centrepin. The hike down filters out casual anglers, so expect a better fish-to-angler ratio than the lower section." },
      { name: "Lowville Park", closed: [{ from: "10-01", to: "12-31", why: "Fish sanctuary. No fishing Oct 1 to Dec 31 (Progreston CPR track to Hwy 407)" }, { from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "Fish sanctuary. Closed until the trout opener" }], loc: "Lowville, ON \xB7 Lowville Park Road", crowd: "high", desc: "The pool immediately below Lowville Falls concentrates fish during migrations. Very popular with centrepin and float fishermen. Can be crowded during peak runs, but fish are reliably present." }
    ]
  },
  "Bronte Creek \u2014 Upper Headwaters": {
    season: "standard",
    gauge: "02HB022",
    gaugeName: "Bronte Creek at Carlisle",
    sweetMin: 0.5,
    sweetMax: 4,
    flowLow: 0.1,
    flowHigh: 8,
    lat: 43.53,
    lng: -79.8,
    loc: "Upstream of Lowville to Progreston and Carlisle (Niagara Escarpment)",
    driveTime: { "toronto": 45, "north york": 45, "scarborough": 50, "etobicoke": 35, "markham": 50, "richmond hill": 50, "vaughan": 45, "ajax": 70, "pickering": 65, "mississauga": 35, "brampton": 20, "oakville": 15, "burlington": 20, "milton": 10, "hamilton": 30, "guelph": 35, "cambridge": 45, "kitchener": 55, "waterloo": 55, "orangeville": 50, "oshawa": 85, "whitby": 80, "bowmanville": 95, "clarington": 105, "newcastle": 105, "cobourg": 135, "port hope": 125, "barrie": 95, "collingwood": 110, "owen sound": 145 },
    species: ["Brook Trout", "Brown Trout"],
    active: true,
    regs: [{ rule: "Inland stream, open from the fourth Saturday in April to September 30. Catch-and-release and tackle restrictions may apply. Check the regulations for specific tributaries.", icon: "\u{1F4CB}" }],
    methods: ["fly", "spin"],
    access: [
      { name: "Progreston Area \xB7 Road Allowances", loc: "Progreston, ON \xB7 Road allowance crossings", crowd: "low", desc: "Classic inland trout fishery in cool, spring-fed water near the Niagara Escarpment. Native brook trout and resident brown trout. Light spinning gear or dry fly fishing suits this narrow, intimate water. Minimal pressure compared to the lower sections." },
      { name: "Carlisle Reach", loc: "Carlisle, ON \xB7 Upper creek", crowd: "low", desc: "Quieter, cooler water above the migratory barrier. The best brook trout habitat on the Bronte system. Road allowance access at bridge crossings. The Carlisle gauge (02HB022) is on this stretch, so its flow readings apply best here." }
    ]
  },
  "Lower Humber River": {
    season: "all-year",
    gauge: "02HC025",
    gaugeName: "Humber River at Elder Mills",
    sweetMin: 3,
    sweetMax: 12,
    flowLow: 1,
    flowHigh: 25,
    lat: 43.64,
    lng: -79.48,
    loc: "South of Lakeshore Blvd to Lake Ontario (Humber Bay)",
    driveTime: { toronto: 20, mississauga: 40, brampton: 30, oakville: 30, burlington: 50, milton: 40, hamilton: 60, guelph: 70, cambridge: 85, kitchener: 95, waterloo: 95, orangeville: 65, markham: 30, "richmond hill": 35, vaughan: 30, ajax: 50, pickering: 45, "north york": 20, scarborough: 25, etobicoke: 15, oshawa: 65, whitby: 60, bowmanville: 80, clarington: 85, newcastle: 85, cobourg: 125, "port hope": 115, barrie: 95, collingwood: 125, "owen sound": 175 },
    species: ["Brown Trout", "Steelhead", "Chinook Salmon"],
    active: true,
    regs: [{ rule: "TRCA managed. Check catch regulations for this section", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Humber River Mouth \xB7 Humber Bay Park", mouth: true, loc: "Etobicoke / Toronto \xB7 Lakeshore Blvd", crowd: "high", desc: "The gathering point for migratory fish entering the Humber. Very accessible with parking. Most fishing pressure in the system. Arrive before dawn during peak salmon and steelhead runs." },
      { name: "Humber Valley Heritage Trail \xB7 Lower", loc: "Etobicoke / North York \xB7 TRCA managed", crowd: "high", desc: "Urban lower Humber through Toronto. Receives large salmon and steelhead runs in fall and spring. Heavy pressure during peak runs. TRCA managed with catch regulations." }
    ]
  },
  "Lower-Mid Humber (Old Mill to Eglinton)": {
    season: "all-year",
    gauge: "02HC025",
    gaugeName: "Humber River at Elder Mills",
    sweetMin: 3,
    sweetMax: 12,
    flowLow: 1,
    flowHigh: 25,
    lat: 43.67,
    lng: -79.49,
    loc: "Old Mill area north to Eglinton Avenue (Etienne Brul\xE9 Park)",
    driveTime: { toronto: 20, mississauga: 40, brampton: 30, oakville: 30, burlington: 50, milton: 40, hamilton: 60, guelph: 70, cambridge: 85, kitchener: 95, waterloo: 95, orangeville: 60, markham: 25, "richmond hill": 30, vaughan: 25, ajax: 50, pickering: 40, "north york": 15, scarborough: 25, etobicoke: 15, oshawa: 65, whitby: 55, bowmanville: 80, clarington: 85, newcastle: 85, cobourg: 125, "port hope": 115, barrie: 90, collingwood: 120, "owen sound": 170 },
    species: ["Steelhead", "Chinook Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "TRCA managed. Check the regulations", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Etienne Br\xFBl\xE9 Park", loc: "Etobicoke \xB7 Old Mill area", crowd: "med", desc: "Good park access to the lower-mid Humber. Steelhead and salmon push into this section. Trail access along the river for several kilometres north." },
      { name: "Scarlett Mills Park", loc: "North York \xB7 Eglinton Avenue", crowd: "med", desc: "Popular access point at the upper end of this section. Good pool structure where fish hold during migration runs." }
    ]
  },
  "Middle Humber (Black Creek to Woodbridge)": {
    season: "extended",
    gauge: "02HC025",
    gaugeName: "Humber River at Elder Mills",
    sweetMin: 3,
    sweetMax: 12,
    flowLow: 1,
    flowHigh: 25,
    lat: 43.76,
    lng: -79.53,
    loc: "Highway 401 to Woodbridge and Kleinburg",
    driveTime: { toronto: 30, mississauga: 55, brampton: 25, oakville: 45, burlington: 65, milton: 50, hamilton: 70, guelph: 65, cambridge: 85, kitchener: 90, waterloo: 90, orangeville: 50, markham: 30, "richmond hill": 30, vaughan: 20, ajax: 55, pickering: 50, "north york": 25, scarborough: 35, etobicoke: 30, oshawa: 70, whitby: 65, bowmanville: 85, clarington: 95, newcastle: 95, cobourg: 135, "port hope": 125, barrie: 80, collingwood: 110, "owen sound": 160 },
    species: [],
    active: false,
    regs: [],
    methods: [],
    access: []
  },
  "Upper Humber River (Headwaters)": {
    season: "standard",
    gauge: "02HC025",
    gaugeName: "Humber River at Elder Mills",
    sweetMin: 2,
    sweetMax: 8,
    flowLow: 0.5,
    flowHigh: 15,
    lat: 43.87,
    lng: -79.73,
    loc: "Above Highway 407 to Oak Ridges Moraine / Niagara Escarpment",
    driveTime: { toronto: 50, mississauga: 60, brampton: 30, oakville: 50, burlington: 70, milton: 45, hamilton: 75, guelph: 60, cambridge: 85, kitchener: 85, waterloo: 85, orangeville: 35, markham: 35, "richmond hill": 30, vaughan: 25, ajax: 65, pickering: 55, "north york": 35, scarborough: 45, etobicoke: 45, oshawa: 80, whitby: 70, bowmanville: 95, clarington: 100, newcastle: 100, cobourg: 140, "port hope": 130, barrie: 65, collingwood: 90, "owen sound": 140 },
    species: ["Brown Trout", "Rainbow Trout", "Brook Trout"],
    active: true,
    regs: [{ rule: "Some sections are strictly catch-and-release. Check the regulations before fishing", icon: "\u{1F4CB}" }],
    methods: ["fly", "float"],
    access: [
      { name: "Upper Humber \xB7 Mono / Orangeville Area", loc: "Mono Township \xB7 Above Bolton", crowd: "low", desc: "The most pristine section of the Humber. Wild brook trout in cold, spring-fed water. Forested banks, minimal angling pressure. Road allowance access at bridge crossings." },
      { name: "Humber River \xB7 Bolton Reach", loc: "Bolton, ON \xB7 Various road access points", crowd: "med", desc: "Good transition water between the small upper creek and the larger lower river. Brown trout and brook trout resident, steelhead and salmon in season. Multiple access points at bridge crossings." }
    ]
  },
  "Nottawasaga River \u2014 Headwaters (Niagara Escarpment)": {
    season: "standard",
    gauge: "02ED101",
    gaugeName: "Nottawasaga River near Angus",
    sweetMin: 5,
    sweetMax: 20,
    flowLow: 1,
    flowHigh: 40,
    lat: 44.13,
    lng: -79.95,
    loc: "Niagara Escarpment and Hockley Valley, upstream of Alliston",
    driveTime: { "toronto": 85, "north york": 70, "scarborough": 75, "etobicoke": 85, "markham": 65, "richmond hill": 60, "vaughan": 60, "ajax": 90, "pickering": 85, "mississauga": 95, "brampton": 65, "oakville": 85, "burlington": 100, "milton": 75, "hamilton": 110, "guelph": 80, "cambridge": 100, "kitchener": 100, "waterloo": 100, "orangeville": 30, "oshawa": 100, "whitby": 95, "bowmanville": 115, "clarington": 125, "newcastle": 125, "cobourg": 160, "port hope": 150, "barrie": 40, "collingwood": 50, "owen sound": 105 },
    species: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    active: true,
    regs: [{ rule: "FMZ 16. Most of this section is private land. Access only via the Bruce Trail or public road allowances, and respect no-trespassing signs.", icon: "\u{1F4CB}" }],
    methods: ["fly", "spin"],
    access: [
      { name: "Bruce Trail Access Points \xB7 Upper Notty", loc: "Hockley Valley \xB7 Bruce Trail corridor", crowd: "low", desc: "Technical cold-water fishing in bouldery runs and small pools. The Bruce Trail is the only reliable public access through an otherwise private section. Resident rainbow, brown and brook trout. It takes stealth, light tackle and patience. The fish here see less pressure than downstream." },
      { name: "Headwaters - Road Allowances", loc: "Hockley Valley \xB7 Road allowance crossings", crowd: "low", desc: "Limited bridge crossing access above Alliston. Cold, clean, clear water straight off the Niagara Escarpment. Best in spring before run-off warms the lower river and in fall when temperatures drop. Respect all posted no-trespassing signs strictly." }
    ]
  },
  "Nottawasaga River \u2014 Middle Section (Alliston to Angus)": {
    season: "standard",
    gauge: "02ED101",
    gaugeName: "Nottawasaga River near Angus",
    sweetMin: 5,
    sweetMax: 20,
    flowLow: 1,
    flowHigh: 40,
    lat: 44.15,
    lng: -79.9,
    loc: "Alliston through Angus: extended steelhead water, with the Pine and Boyne River confluences",
    driveTime: { "toronto": 85, "north york": 70, "scarborough": 75, "etobicoke": 85, "markham": 60, "richmond hill": 55, "vaughan": 55, "ajax": 85, "pickering": 85, "mississauga": 95, "brampton": 65, "oakville": 85, "burlington": 105, "milton": 80, "hamilton": 110, "guelph": 80, "cambridge": 105, "kitchener": 100, "waterloo": 100, "orangeville": 35, "oshawa": 100, "whitby": 90, "bowmanville": 115, "clarington": 120, "newcastle": 120, "cobourg": 160, "port hope": 145, "barrie": 35, "collingwood": 50, "owen sound": 105 },
    species: ["Steelhead", "Chinook Salmon", "Brown Trout"],
    active: true,
    regs: [
      { rule: "Boyne River to Pine River: Rainbow Trout CATCH AND RELEASE ONLY, open all year.", icon: "\u{1F501}" },
      { rule: "Sanctuary areas (Essa Township/Nicholson Dam): Closed Jan 1 to Friday before 2nd Saturday in May, and Oct 1\u2013Dec 31.", icon: "\u{1F6AB}" },
      { rule: "Water is often coloured after rain, so adjust your tactics.", icon: "\u{1F4A7}" }
    ],
    methods: ["float", "spin"],
    access: [
      { name: "Alliston \xB7 Main River Access", loc: "Alliston, ON \xB7 Town access points", crowd: "med", desc: "Start of the extended-season steelhead water. The sandy, clay-based banks colour the water after heavy rain, which is typical of the Notty\u2019s middle section. Drift boats and canoes are common for covering water. Steelhead and Chinook push through here in season." },
      { name: "Pine River Confluence", loc: "Pine River meets Nottawasaga \xB7 Below Alliston", crowd: "med", desc: "The Pine River is an important spawning tributary. Fish concentrate at the confluence during peak runs. Between the Boyne River and the Pine River, rainbow trout are catch-and-release only. Check posted signs carefully." },
      { name: "Boyne River Confluence", loc: "Boyne River meets Nottawasaga \xB7 Angus area", crowd: "med", desc: "The Boyne is another major spawning tributary with its own fish runs. Below this confluence opens to the standard limit zone for rainbow trout (S-2, C-1). The Angus area has good drift access for float fishermen." },
      { name: "Nicholson Dam / Essa Township Sanctuary", closed: [{ from: "01-01", to: "FRI_BEFORE_2ND_SAT_MAY", why: "Fish sanctuary. No fishing Jan 1 to the Friday before the second Saturday in May" }, { from: "10-01", to: "12-31", why: "Fish sanctuary. No fishing Oct 1 to Dec 31" }], loc: "Essa Township \xB7 Nicholson Dam area", crowd: "low", desc: "SANCTUARY area, closed Jan 1 to the Friday before the 2nd Saturday in May, and Oct 1 to Dec 31. When open, this is productive water for steelhead and brown trout. Check the current year\u2019s dates before fishing, as the rules are strictly enforced." }
    ]
  },
  "Nottawasaga River \u2014 Lower Section (Boyne to Wasaga Beach)": {
    season: "all-year",
    // MNR 2026: Rainbow Trout are S-0 / C-0 from the Boyne River down to the Pine River
    // only. Both access points here (McKinnon Road, confirmed below the Pine by TJ, and the
    // Wasaga Beach mouth) are below the Pine, where rainbows are S-2 / C-1. No C&R tag.
    gauge: "02ED101",
    gaugeName: "Nottawasaga River near Angus",
    sweetMin: 8,
    sweetMax: 30,
    flowLow: 2,
    flowHigh: 60,
    lat: 44.3,
    lng: -79.98,
    loc: "Below the Boyne River confluence to Wasaga Beach (Georgian Bay mouth)",
    driveTime: { "toronto": 105, "north york": 85, "scarborough": 90, "etobicoke": 105, "markham": 80, "richmond hill": 75, "vaughan": 75, "ajax": 100, "pickering": 100, "mississauga": 115, "brampton": 85, "oakville": 105, "burlington": 125, "milton": 100, "hamilton": 130, "guelph": 100, "cambridge": 120, "kitchener": 115, "waterloo": 115, "orangeville": 50, "oshawa": 110, "whitby": 105, "bowmanville": 125, "clarington": 130, "newcastle": 135, "cobourg": 170, "port hope": 155, "barrie": 30, "collingwood": 30, "owen sound": 90 },
    species: ["Steelhead", "Chinook Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "Pine River to Georgian Bay: Rainbow Trout open all year, limit S-2 C-1, no size limit. Salmon peak August\u2013September.", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "McKinnon Road Access Point", loc: "McKinnon Road \xB7 Lower Nottawasaga", crowd: "med", desc: "One of the best-known access points on the lower Notty. Good drift water for steelhead and Chinook. The lower section is wider and easier to reach than upstream, and popular with drift boat and pontoon anglers covering long stretches." },
      { name: "Wasaga Beach \xB7 River Mouth (Georgian Bay)", loc: "Wasaga Beach \xB7 Georgian Bay estuary", crowd: "high", desc: "The mouth of the Nottawasaga where it enters Georgian Bay. Chinook salmon peak here in August\u2013September before pushing upstream. Steelhead return in spring. The wide, sandy-bottomed lower river transitions to the warm-water fishery with northern pike, musky, and bass in the slower sections near the bay." }
    ]
  },
  "Duffins Creek \u2014 Lower Section": {
    season: "all-year",
    gauge: "02HC022",
    gaugeName: "Duffins Creek above Pickering",
    sweetMin: 2,
    sweetMax: 10,
    flowLow: 0.5,
    flowHigh: 20,
    lat: 43.843,
    lng: -79.065,
    loc: "Lake Ontario to Highway 2 (Ajax / Pickering)",
    driveTime: { "toronto": 40, "north york": 35, "scarborough": 20, "etobicoke": 55, "markham": 25, "richmond hill": 35, "vaughan": 45, "ajax": 5, "pickering": 5, "mississauga": 85, "brampton": 70, "oakville": 75, "burlington": 90, "milton": 85, "hamilton": 105, "guelph": 115, "cambridge": 130, "kitchener": 140, "waterloo": 140, "orangeville": 95, "oshawa": 20, "whitby": 15, "bowmanville": 35, "clarington": 45, "newcastle": 45, "cobourg": 80, "port hope": 70, "barrie": 90, "collingwood": 130, "owen sound": 190 },
    species: ["Steelhead", "Chinook Salmon", "Coho Salmon"],
    active: true,
    regs: [{ rule: "South of the CNR tracks: open all year. Between the CNR and Hwy 2: open fourth Saturday in April to Dec 31. Standard FMZ 17 limits.", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Rotary Park", loc: "Ajax \xB7 Rotary Park near Lake Ontario", crowd: "high", desc: "Primary access for migratory runs entering from Lake Ontario. Heavy pressure during fall Chinook and Coho runs and spring steelhead. Float fishing with roe and beads most productive. Arrive before dawn on fall weekends." },
      { name: "Duffins Creek Marsh", mouth: true, loc: "Ajax / Pickering \xB7 Duffins Creek marsh", crowd: "med", desc: "Estuary section holds staging fish before they push upstream. Good for casting spoons and crankbaits at chrome fish. Smallmouth bass and pike year-round for warmwater anglers." },
      { name: "Below CNR Railway Line", loc: "South of CNR tracks \xB7 Lower Duffins", crowd: "med", desc: "Extended fall season applies south of the CNR track (Oct\u2013Dec 31). Check boundary markers carefully. Good pool and run structure for float fishing." }
    ]
  },
  "Duffins Creek \u2014 Middle Section": {
    // Greenwood and Whitevale are both north of Hwy 2. Durham's extended season only
    // covers Hwy 2 down to the CNR, so this reach closes Sept 30 like inland water.
    season: "standard",
    gauge: "02HC022",
    gaugeName: "Duffins Creek above Pickering",
    sweetMin: 2,
    sweetMax: 10,
    flowLow: 0.5,
    flowHigh: 20,
    lat: 43.87,
    lng: -79.058,
    loc: "Highway 2 to the dams (Greenwood Conservation Area / Whitevale)",
    driveTime: { "toronto": 45, "north york": 40, "scarborough": 20, "etobicoke": 60, "markham": 25, "richmond hill": 40, "vaughan": 45, "ajax": 5, "pickering": 5, "mississauga": 85, "brampton": 70, "oakville": 75, "burlington": 95, "milton": 85, "hamilton": 105, "guelph": 115, "cambridge": 130, "kitchener": 140, "waterloo": 140, "orangeville": 95, "oshawa": 15, "whitby": 10, "bowmanville": 35, "clarington": 45, "newcastle": 45, "cobourg": 80, "port hope": 70, "barrie": 85, "collingwood": 130, "owen sound": 190 },
    species: ["Steelhead", "Chinook Salmon", "Coho Salmon", "Rainbow Trout", "Brown Trout"],
    active: true,
    regs: [{ rule: "Fishing near Whitevale Dam and the barrier north of Church Street is prohibited. Both are fish sanctuaries. Check posted signs.", icon: "\u{1F6AB}" }, { rule: "North of Hwy 2 the trout and salmon season ends Sept 30.", icon: "\u{1F4CB}" }],
    methods: ["float", "fly", "spin"],
    access: [
      { name: "Greenwood Conservation Area", loc: "Greenwood, ON \xB7 TRCA managed", crowd: "med", desc: "Deep valley lands with excellent holding water. Migratory salmon and steelhead push through in season. Resident rainbow and brown trout in cooler upper pools. TRCA managed with day-use fee." },
      { name: "Whitevale \xB7 Below Dam", loc: "Whitevale, ON \xB7 Below Whitevale Dam", crowd: "high", desc: "Fish concentrate below the dam before the sanctuary zone. The dam separates migratory fish from resident trout upstream. Don\u2019t fish inside the sanctuary boundary. It\u2019s signed, and wardens patrol it." }
    ]
  },
  "Duffins Creek \u2014 Upper Reaches": {
    season: "standard",
    gauge: "02HC022",
    gaugeName: "Duffins Creek above Pickering",
    sweetMin: 0.5,
    sweetMax: 4,
    flowLow: 0.1,
    flowHigh: 8,
    lat: 43.94,
    lng: -79.04,
    loc: "Above the dams to the Oak Ridges Moraine (Glen Major / West Duffins headwaters)",
    driveTime: { "toronto": 50, "north york": 45, "scarborough": 30, "etobicoke": 70, "markham": 30, "richmond hill": 40, "vaughan": 50, "ajax": 10, "pickering": 15, "mississauga": 95, "brampton": 80, "oakville": 85, "burlington": 100, "milton": 90, "hamilton": 115, "guelph": 120, "cambridge": 135, "kitchener": 145, "waterloo": 145, "orangeville": 95, "oshawa": 15, "whitby": 10, "bowmanville": 30, "clarington": 40, "newcastle": 40, "cobourg": 80, "port hope": 65, "barrie": 80, "collingwood": 125, "owen sound": 185 },
    species: ["Brook Trout", "Brown Trout"],
    active: true,
    regs: [{ rule: "Cold-water habitat. Baitfish collection is heavily restricted and redside dace are present. Check the regulations for specific tributary rules.", icon: "\u{1F4CB}" }],
    methods: ["fly", "spin"],
    access: [
      { name: "Glen Major \xB7 Seaton Hiking Trail", loc: "Glen Major \xB7 Trans Canada / Seaton Trail", crowd: "low", desc: "Cool tributary water on the Oak Ridges Moraine. Native brook trout in forested sections. Trail access keeps pressure low. Light dry fly or nymph fishing works well in this intimate water." },
      { name: "West Duffins Headwaters", loc: "West Duffins \xB7 Headwater tributaries", crowd: "low", desc: "The most pristine section of the Duffins system. Spring-fed cool water with sensitive native brook trout. Baitfish collection is prohibited because this is redside dace habitat. Catch-and-release is strongly recommended even where it isn\u2019t required." }
    ]
  },
  "Ganaraska River \u2014 Lower (Lake to CNR Bridge)": {
    season: "all-year",
    gauge: "02HD012",
    gaugeName: "Ganaraska River above Dale",
    sweetMin: 2,
    sweetMax: 12,
    flowLow: 0.5,
    flowHigh: 25,
    lat: 43.94,
    lng: -78.305,
    loc: "Lake Ontario to the CNR railway bridge (Port Hope harbour)",
    driveTime: { toronto: 90, "north york": 85, scarborough: 75, etobicoke: 100, markham: 70, "richmond hill": 75, vaughan: 80, ajax: 55, pickering: 50, mississauga: 120, brampton: 105, oakville: 110, burlington: 120, milton: 105, hamilton: 130, guelph: 140, cambridge: 155, kitchener: 165, waterloo: 165, orangeville: 125, oshawa: 35, whitby: 25, bowmanville: 10, clarington: 15, newcastle: 15, cobourg: 35, "port hope": 5, barrie: 110, collingwood: 150, "owen sound": 210 },
    species: ["Steelhead", "Chinook Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "Open all year below the CNR. Upstream, Jocelyn St to the CNR is closed Sept 1 to Oct 14, and Hwy 401 to Jocelyn St is closed all year.", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Port Hope Harbour \xB7 River Mouth", mouth: true, loc: "Port Hope, ON \xB7 Lake Ontario harbour", crowd: "high", desc: "Staging area for spring steelhead and fall Chinook coming in from Lake Ontario. Drift spawn sacks under a float, or cast spoons or spinners for chrome fish. Heavy pressure during peak runs, so arrive before dawn on fall weekends." },
      { name: "Below CNR Railway Bridge", loc: "Port Hope \xB7 South of CNR tracks", crowd: "high", desc: "The first holding water above the harbour. Excellent pool structure for drifting roe under a float. Spring Brown Trout and Steelhead stack here before pushing through. Open year-round on this section." }
    ]
  },
  "Ganaraska River \u2014 Port Hope Sanctuary": {
    season: "extended",
    gauge: "02HD012",
    gaugeName: "Ganaraska River above Dale",
    sweetMin: 2,
    sweetMax: 12,
    flowLow: 0.5,
    flowHigh: 25,
    lat: 43.945,
    lng: -78.3,
    loc: "Jocelyn Street Bridge to the CNR bridge, through Port Hope",
    driveTime: { toronto: 90, "north york": 85, scarborough: 75, etobicoke: 100, markham: 70, "richmond hill": 75, vaughan: 80, ajax: 55, pickering: 50, mississauga: 120, brampton: 105, oakville: 110, burlington: 120, milton: 105, hamilton: 130, guelph: 140, cambridge: 155, kitchener: 165, waterloo: 165, orangeville: 125, oshawa: 35, whitby: 25, bowmanville: 10, clarington: 15, newcastle: 15, cobourg: 35, "port hope": 5, barrie: 110, collingwood: 150, "owen sound": 210 },
    species: ["Steelhead", "Chinook Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "Jocelyn St bridge to the CNR: open fourth Saturday in April to Aug 31 and Oct 15 to Dec 31. Closed Sept 1 to Oct 14.", icon: "\u{1F6AB}" }, { rule: "Fish south of the Jocelyn St bridge only. Upstream to Hwy 401 is a sanctuary, closed all year.", icon: "\u{1F6AB}" }],
    methods: ["float", "fly"],
    access: [
      { name: "Jocelyn Street Bridge Access", closed: [{ from: "09-01", to: "10-14", why: "Fish sanctuary. No fishing Sep 1 to Oct 14 (Jocelyn St to CNR right-of-way)" }], loc: "Jocelyn Street \xB7 Port Hope", crowd: "med", desc: "Upstream end of the seasonal stretch. Fish the south side of the bridge only: above it, up to Hwy 401, is closed all year. Good pool and run structure. Open Oct 15 through December for the extended fall season. During open periods this stretch holds excellent numbers of Chinook and Coho waiting below Corbetts Dam." },
      { name: "Port Hope Town Section \xB7 Sanctuary Area", closed: [{ from: "09-01", to: "10-14", why: "Fish sanctuary. No fishing Sep 1 to Oct 14 (Jocelyn St to CNR right-of-way)" }], loc: "Port Hope \xB7 Through town", crowd: "high", desc: "When open (Oct 15 to Dec 31), this downtown stretch fishes surprisingly well, with fish stacked below the dam upstream. Fly fishing and centrepin work well in the deeper pools. Respect the Sep 1 to Oct 14 closure. Wardens patrol this section." }
    ]
  },
  "Ganaraska River \u2014 Corbetts Dam (Closed Year-Round)": {
    gauge: "02HD012",
    gaugeName: "Ganaraska River above Dale",
    sweetMin: 2,
    sweetMax: 12,
    flowLow: 0.5,
    flowHigh: 25,
    lat: 43.95,
    lng: -78.298,
    loc: "Highway 401 to the Jocelyn Street Bridge (Corbetts Dam and fishway)",
    driveTime: { toronto: 95, "north york": 90, scarborough: 80, etobicoke: 105, markham: 75, "richmond hill": 80, vaughan: 85, ajax: 60, pickering: 55, mississauga: 120, brampton: 110, oakville: 115, burlington: 125, milton: 110, hamilton: 135, guelph: 145, cambridge: 160, kitchener: 170, waterloo: 170, orangeville: 130, oshawa: 40, whitby: 30, bowmanville: 15, clarington: 20, newcastle: 20, cobourg: 40, "port hope": 10, barrie: 115, collingwood: 155, "owen sound": 215 },
    species: ["Steelhead", "Chinook Salmon", "Brown Trout"],
    active: false,
    regs: [{ rule: "CLOSED TO FISHING ALL YEAR. Fish sanctuary protecting migrating salmon and trout at Corbetts Dam and fishway.", icon: "\u{1F6AB}" }],
    methods: [],
    access: []
  },
  "Ganaraska River \u2014 Upper & Conservation Areas": {
    season: "standard",
    gauge: "02HD012",
    gaugeName: "Ganaraska River above Dale",
    sweetMin: 1,
    sweetMax: 8,
    flowLow: 0.3,
    flowHigh: 15,
    lat: 43.98,
    lng: -78.29,
    loc: "North of Highway 401: Ganaraska Millennium CA, Sylvan Glen CA, Thurne Parks",
    driveTime: { toronto: 95, "north york": 90, scarborough: 80, etobicoke: 105, markham: 75, "richmond hill": 80, vaughan: 85, ajax: 60, pickering: 55, mississauga: 120, brampton: 110, oakville: 115, burlington: 125, milton: 110, hamilton: 135, guelph: 145, cambridge: 160, kitchener: 170, waterloo: 170, orangeville: 130, oshawa: 40, whitby: 30, bowmanville: 15, clarington: 20, newcastle: 20, cobourg: 40, "port hope": 10, barrie: 115, collingwood: 155, "owen sound": 215 },
    species: ["Steelhead", "Rainbow Trout", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 17. Obey posted property lines and GRCA rules. The spring rainbow run is popular here.", icon: "\u{1F4CB}" }],
    methods: ["fly", "float"],
    access: [
      { name: "Ganaraska Millennium Conservation Area", loc: "North of Hwy 401 \xB7 GRCA managed", crowd: "med", desc: "Upper section, popular during the spring rainbow trout run. Less pressure than downtown Port Hope. Fly fishing and drifting natural baits work well. GRCA managed, so respect all posted property lines and rules." },
      { name: "Sylvan Glen Conservation Area", loc: "Sylvan Glen \xB7 Upper Ganaraska", crowd: "high", desc: "Quieter upper water with good pool structure. Spring rainbow trout push up from below during high flows. Forested banks and clear water make it good dry fly and nymph water once the heavy spring flows drop." },
      { name: "Thurne Parks", loc: "Thurne \xB7 Upper Ganaraska valley", crowd: "low", desc: "Good access to upper holding water. Less frequented than the conservation areas. Best during peak spring Rainbow run when water is slightly off-colour and fish are actively pushing upstream." }
    ]
  },
  "Lower Beaver River (Thornbury)": {
    season: "extended",
    gauge: "02FB009",
    gaugeName: "Beaver River near Clarksburg",
    sweetMin: 2,
    sweetMax: 10,
    flowLow: 0.5,
    flowHigh: 20,
    lat: 44.563,
    lng: -80.457,
    loc: "Thornbury Dam to Georgian Bay",
    driveTime: { toronto: 155, mississauga: 165, brampton: 130, oakville: 155, burlington: 165, milton: 140, hamilton: 170, guelph: 130, cambridge: 150, kitchener: 140, waterloo: 135, orangeville: 85, markham: 135, "richmond hill": 130, vaughan: 130, ajax: 155, pickering: 150, "north york": 140, scarborough: 145, etobicoke: 155, oshawa: 165, whitby: 160, bowmanville: 175, clarington: 185, newcastle: 185, cobourg: 220, "port hope": 205, barrie: 70, collingwood: 25, "owen sound": 45 },
    species: ["Steelhead", "Chinook Salmon"],
    active: true,
    regs: [{ rule: "Extended fall season for trout and salmon. Check the regulations", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Thornbury \xB7 Lower River / Harbour", loc: "Thornbury, ON \xB7 Georgian Bay mouth", crowd: "high", desc: "The lower Beaver near Thornbury receives strong Georgian Bay steelhead and salmon runs. The river mouth and lower pools are extremely popular during peak migrations. Outside of run season, smaller resident browns inhabit this section." },
      { name: "Thornbury Fishway", loc: "Thornbury, ON \xB7 Fish ladder at dam", crowd: "high", desc: "The fish ladder concentrates migrating fish. Very productive during peak runs. Heavy fishing pressure, so arrive before dawn on fall weekends." }
    ]
  },
  "Middle Beaver River (Clarksburg to Heathcote)": {
    season: "standard",
    gauge: "02FB009",
    gaugeName: "Beaver River near Clarksburg",
    sweetMin: 2,
    sweetMax: 10,
    flowLow: 0.5,
    flowHigh: 20,
    lat: 44.52,
    lng: -80.43,
    loc: "Clarksburg to Heathcote",
    driveTime: { toronto: 150, mississauga: 160, brampton: 125, oakville: 145, burlington: 160, milton: 135, hamilton: 165, guelph: 125, cambridge: 145, kitchener: 135, waterloo: 130, orangeville: 80, markham: 130, "richmond hill": 125, vaughan: 125, ajax: 150, pickering: 145, "north york": 135, scarborough: 140, etobicoke: 150, oshawa: 160, whitby: 155, bowmanville: 170, clarington: 180, newcastle: 180, cobourg: 215, "port hope": 205, barrie: 70, collingwood: 20, "owen sound": 45 },
    species: ["Brown Trout", "Steelhead"],
    active: true,
    regs: [],
    methods: ["fly", "float", "spin"],
    access: [
      { name: "Below Kimberley \xB7 Mid-Beaver", loc: "Between Kimberley and Thornbury", crowd: "low", desc: "Less explored than the village reach. Walk-in access required for most of this section which keeps pressure low. Large brown trout, some reach trophy size in the deeper pools." }
    ]
  },
  "Beaver River Swamp (Heathcote to Kimberley)": {
    gauge: "02FB009",
    gaugeName: "Beaver River near Clarksburg",
    sweetMin: 1,
    sweetMax: 5,
    flowLow: 0.2,
    flowHigh: 10,
    lat: 44.5,
    lng: -80.415,
    loc: "Heathcote to Kimberley, slow warm water",
    driveTime: { toronto: 150, mississauga: 155, brampton: 125, oakville: 145, burlington: 160, milton: 130, hamilton: 165, guelph: 120, cambridge: 145, kitchener: 130, waterloo: 130, orangeville: 80, markham: 125, "richmond hill": 120, vaughan: 120, ajax: 150, pickering: 145, "north york": 130, scarborough: 140, etobicoke: 145, oshawa: 160, whitby: 150, bowmanville: 170, clarington: 175, newcastle: 180, cobourg: 215, "port hope": 200, barrie: 65, collingwood: 20, "owen sound": 45 },
    species: [],
    active: false,
    regs: [],
    methods: [],
    access: []
  },
  "Upper Beaver River (Kimberley)": {
    season: "standard",
    gauge: "02FB009",
    gaugeName: "Beaver River near Clarksburg",
    sweetMin: 1,
    sweetMax: 6,
    flowLow: 0.3,
    flowHigh: 12,
    lat: 44.49,
    lng: -80.4,
    loc: "Kimberley village up to Hogs Falls / Headwaters",
    driveTime: { toronto: 145, mississauga: 155, brampton: 120, oakville: 145, burlington: 155, milton: 130, hamilton: 160, guelph: 120, cambridge: 140, kitchener: 130, waterloo: 130, orangeville: 75, markham: 125, "richmond hill": 120, vaughan: 120, ajax: 145, pickering: 145, "north york": 130, scarborough: 135, etobicoke: 145, oshawa: 155, whitby: 150, bowmanville: 170, clarington: 175, newcastle: 175, cobourg: 210, "port hope": 200, barrie: 65, collingwood: 15, "owen sound": 50 },
    species: ["Brown Trout", "Rainbow Trout", "Brook Trout"],
    active: true,
    regs: [],
    methods: ["fly", "float"],
    access: [
      { name: "Kimberley \xB7 Village Reach", loc: "Kimberley, ON \xB7 Main village access", crowd: "med", desc: "The centrepiece of Beaver River fishing. Classic limestone pools and riffles through the village. Strong hatches of sulphurs, caddis and PMDs bring large browns to the surface. Several road allowance access points." }
    ]
  },
  "Saugeen River \u2014 Headwaters & Upper Tributaries": {
    season: "standard",
    gauge: "02FC016",
    gaugeName: "Saugeen River above Durham",
    sweetMin: 8,
    sweetMax: 25,
    flowLow: 2,
    flowHigh: 50,
    lat: 44.1,
    lng: -80.75,
    loc: "Rocky Saugeen, North Saugeen, South Saugeen and Beatty Saugeen, above Hanover",
    driveTime: { "toronto": 145, "north york": 130, "scarborough": 140, "etobicoke": 135, "markham": 130, "richmond hill": 125, "vaughan": 120, "ajax": 160, "pickering": 155, "mississauga": 140, "brampton": 110, "oakville": 125, "burlington": 130, "milton": 105, "hamilton": 130, "guelph": 85, "cambridge": 100, "kitchener": 85, "waterloo": 80, "orangeville": 65, "oshawa": 170, "whitby": 165, "bowmanville": 185, "clarington": 195, "newcastle": 195, "cobourg": 230, "port hope": 220, "barrie": 100, "collingwood": 70, "owen sound": 60 },
    species: ["Brook Trout", "Brown Trout", "Rainbow Trout", "Steelhead"],
    residentBrowns: true,
    // steelhead reach here in small numbers; the browns are stream residents,
    active: true,
    regs: [{ rule: "FMZ 16. Check specific tributary regulations. The Rocky Saugeen is particularly sensitive, so practise catch-and-release and disturb as little as you can.", icon: "\u{1F4CB}" }],
    methods: ["fly", "spin"],
    access: [
      { name: "Rocky Saugeen \xB7 Public Access", loc: "Rocky Saugeen River \xB7 Durham area", crowd: "low", desc: "A highly regarded spring-fed tributary with excellent resident brown trout. Beautiful clear water, so wade carefully. The Rocky Saugeen is the best cold-water tributary on the system. Stealth and light tackle are a must, because these fish are educated and spook easily." },
      { name: "North Saugeen River", loc: "North Saugeen \xB7 Above main stem junction", crowd: "low", desc: "Smaller, winding cold-water with brook and brown trout. Best accessed from road allowances at bridge crossings. Fly fishing and light spinning. Less known than the Rocky Saugeen but holds quality fish in cooler sections." },
      { name: "South Saugeen River", loc: "South Saugeen \xB7 Above Hanover", crowd: "low", desc: "Similar to the North Saugeen: small brook trout and brown trout water. Good in spring before temperatures rise. Access from municipal road bridges." }
    ]
  },
  "Saugeen River \u2014 Middle Main Stem (Hanover to Paisley)": {
    season: "standard",
    gauge: "02FC016",
    gaugeName: "Saugeen River above Durham",
    sweetMin: 8,
    sweetMax: 25,
    flowLow: 2,
    flowHigh: 50,
    lat: 44.22,
    lng: -81,
    loc: "Hanover through Walkerton to Paisley, a warm-water bass and pike fishery",
    driveTime: { "toronto": 170, "north york": 160, "scarborough": 165, "etobicoke": 160, "markham": 155, "richmond hill": 150, "vaughan": 145, "ajax": 185, "pickering": 180, "mississauga": 170, "brampton": 135, "oakville": 150, "burlington": 155, "milton": 135, "hamilton": 160, "guelph": 110, "cambridge": 125, "kitchener": 105, "waterloo": 105, "orangeville": 90, "oshawa": 195, "whitby": 190, "bowmanville": 210, "clarington": 220, "newcastle": 220, "cobourg": 255, "port hope": 245, "barrie": 120, "collingwood": 80, "owen sound": 45 },
    species: [],
    active: false,
    regs: [],
    methods: [],
    access: []
  },
  "Saugeen River \u2014 Lower Main Stem (Paisley to Southampton)": {
    season: "extended",
    gauge: "02FC016",
    gaugeName: "Saugeen River above Durham",
    sweetMin: 10,
    sweetMax: 40,
    flowLow: 3,
    flowHigh: 80,
    lat: 44.4,
    lng: -81.2,
    loc: "Paisley to Southampton: Lake Huron mouth, Denny's Dam and the main migratory runs",
    driveTime: { "toronto": 195, "north york": 185, "scarborough": 190, "etobicoke": 190, "markham": 180, "richmond hill": 175, "vaughan": 170, "ajax": 205, "pickering": 200, "mississauga": 195, "brampton": 165, "oakville": 180, "burlington": 185, "milton": 160, "hamilton": 185, "guelph": 135, "cambridge": 150, "kitchener": 135, "waterloo": 130, "orangeville": 115, "oshawa": 220, "whitby": 210, "bowmanville": 230, "clarington": 240, "newcastle": 240, "cobourg": 275, "port hope": 265, "barrie": 135, "collingwood": 90, "owen sound": 30 },
    species: ["Steelhead", "Chinook Salmon"],
    active: true,
    regs: [{ rule: "FMZ 16. One of the largest steelhead and Chinook salmon runs in the Great Lakes. Walkerton to Denny's Dam: open fourth Saturday in April to Dec 31.", icon: "\u{1F4CB}" }, { rule: "Denny's Dam to the concrete abutments downstream: no night fishing Oct 1 to 31.", icon: "\u{1F6AB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Denny's Dam", loc: "Lower Saugeen \xB7 Below dam", crowd: "high", desc: "The focal point of the lower Saugeen and one of the best-known steelhead and Chinook spots in Ontario. Fish concentrate below the dam before the ladder. Heavy pressure during peak runs, so arrive before dawn. It marks the upper limit of the main migratory push." },
      { name: "Southampton \xB7 Lake Huron Mouth", loc: "Southampton, ON \xB7 Lake Huron", crowd: "high", desc: "Staging area for incoming steelhead and Chinook before they push upstream. Cast spoons and spinners for chrome fish off the pier or from shore during peak runs. Chinook and Coho peak August through October, steelhead in spring." }
    ]
  },
  "Sixteen Mile Creek \u2014 Lower Reaches & Oakville Harbour": {
    season: "all-year",
    gauge: "02HB005",
    gaugeName: "Sixteen Mile Creek at Milton",
    sweetMin: 1,
    sweetMax: 6,
    flowLow: 0.3,
    flowHigh: 15,
    lat: 43.44,
    lng: -79.672,
    loc: "Lake Ontario mouth to Lakeshore Road (Oakville Harbour)",
    driveTime: { "toronto": 20, "north york": 25, "scarborough": 30, "etobicoke": 20, "markham": 30, "richmond hill": 30, "vaughan": 30, "ajax": 40, "pickering": 35, "mississauga": 20, "brampton": 20, "oakville": 5, "burlington": 10, "milton": 10, "hamilton": 15, "guelph": 30, "cambridge": 30, "kitchener": 40, "waterloo": 40, "orangeville": 35, "oshawa": 45, "whitby": 40, "bowmanville": 50, "clarington": 60, "newcastle": 60, "cobourg": 75, "port hope": 70, "barrie": 60, "collingwood": 70, "owen sound": 90 },
    species: ["Steelhead", "Chinook Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 16. Lakeshore Rd (Hwy 2) to Lake Ontario: open all year.", icon: "\u{1F4CB}" }],
    methods: ["spin", "float"],
    access: [
      { name: "Lakeside Park \xB7 Creek Mouth", loc: "Lakeside Park \xB7 Oakville Harbour", crowd: "high", desc: "Where spring steelhead and fall Chinook enter from Lake Ontario. Rocky banks and harbour breakwalls hold staging fish. Cast spoons and spinners for chrome fish before they push upstream. Heavy fall salmon pressure, so arrive before dawn on weekends." },
      { name: "Tannery Park", loc: "Tannery Park \xB7 Lower Sixteen Mile Creek", crowd: "med", desc: "Access to the lower creek just above the harbour. Good smallmouth bass fishing year-round along the rocky banks. Steelhead and salmon push through this section during peak migrations. Float fishing with roe or beads works well in the deeper runs." }
    ]
  },
  "Sixteen Mile Creek \u2014 Middle Reaches & Main Valley": {
    season: "extended",
    gauge: "02HB005",
    gaugeName: "Sixteen Mile Creek at Milton",
    sweetMin: 1,
    sweetMax: 6,
    flowLow: 0.3,
    flowHigh: 15,
    lat: 43.47,
    lng: -79.685,
    loc: "Rebecca Street to Dundas Street (Lions Valley Park, central Oakville)",
    driveTime: { "toronto": 30, "north york": 30, "scarborough": 35, "etobicoke": 20, "markham": 35, "richmond hill": 40, "vaughan": 35, "ajax": 45, "pickering": 45, "mississauga": 25, "brampton": 20, "oakville": 5, "burlington": 10, "milton": 10, "hamilton": 20, "guelph": 30, "cambridge": 40, "kitchener": 45, "waterloo": 45, "orangeville": 40, "oshawa": 55, "whitby": 55, "bowmanville": 65, "clarington": 70, "newcastle": 70, "cobourg": 95, "port hope": 90, "barrie": 70, "collingwood": 85, "owen sound": 110 },
    species: ["Steelhead", "Chinook Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 16. Hwy 2 to Hwy 407: open fourth Saturday in April to Dec 31. Heavy fall rains trigger salmon and steelhead runs, and conditions can change quickly.", icon: "\u{1F4CB}" }],
    methods: ["float", "fly"],
    access: [
      { name: "Lions Valley Park", loc: "Lions Valley Park \xB7 Central Oakville", crowd: "high", desc: "The most popular access point on Sixteen Mile Creek. Deep shale-bottom valley pools hold migratory salmon and steelhead well. Centrepin float fishing dominates here. Heavy pressure during peak runs, though the valley trail hike filters out some casual anglers." },
      { name: "Rebecca Street to Dundas Street Reach", loc: "Central Oakville valley \xB7 Road access points", crowd: "med", desc: "Multiple access points through the valley between Rebecca and Dundas Streets. Deep holding pools and shale-bedrock runs hold fish throughout the migratory season. Resident smallmouth bass year-round in the deeper pools." }
    ]
  },
  "Sixteen Mile Creek \u2014 Upper West Branch (Trout)": {
    // Road crossings are below Hwy 407 (extended, tributaries included); the Milton
    // headwaters are above it and carry their own Oct 1 closure.
    season: "extended",
    gauge: "02HB005",
    gaugeName: "Sixteen Mile Creek at Milton",
    sweetMin: 0.5,
    sweetMax: 3,
    flowLow: 0.1,
    flowHigh: 6,
    lat: 43.53,
    lng: -79.75,
    loc: "North of Highway 407: West Branch, cold-water trout habitat",
    driveTime: { "toronto": 45, "north york": 45, "scarborough": 55, "etobicoke": 35, "markham": 55, "richmond hill": 55, "vaughan": 50, "ajax": 75, "pickering": 70, "mississauga": 35, "brampton": 25, "oakville": 10, "burlington": 25, "milton": 15, "hamilton": 35, "guelph": 45, "cambridge": 55, "kitchener": 70, "waterloo": 70, "orangeville": 55, "oshawa": 90, "whitby": 85, "bowmanville": 105, "clarington": 115, "newcastle": 115, "cobourg": 150, "port hope": 140, "barrie": 105, "collingwood": 130, "owen sound": 170 },
    species: ["Brook Trout", "Brown Trout", "Rainbow Trout"],
    active: true,
    regs: [{ rule: "FMZ 16. Below Hwy 407: open fourth Saturday in April to Dec 31. Above Hwy 407 (Milton) the season ends Sept 30.", icon: "\u{1F4CB}" }],
    methods: ["fly", "spin"],
    access: [
      { name: "West Branch \xB7 Road Allowance Crossings", loc: "West Branch \xB7 North Oakville / Milton border", crowd: "low", desc: "Cold-water habitat supporting resident brook, brown, and rainbow trout. The West Branch maintains cooler temperatures than the main creek, making it the only section with viable year-round trout habitat. Access via road allowances at bridge crossings. Light tackle and stealth required." },
      { name: "Upper West Branch Tributaries", closed: [{ from: "10-01", to: "12-31", why: "These headwaters are north of Hwy 407, where the trout and salmon season ends Sept 30" }], loc: "West Branch headwaters \xB7 Milton area", crowd: "low", desc: "Small stream fishing for resident trout in spring-fed water. The least pressured section of the entire Sixteen Mile Creek system. Brook trout in the coldest, most shaded sections." }
    ]
  },
  "Sixteen Mile Creek \u2014 Upper Middle/East Branches": {
    gauge: "02HB005",
    gaugeName: "Sixteen Mile Creek at Milton",
    sweetMin: 0.5,
    sweetMax: 3,
    flowLow: 0.1,
    flowHigh: 6,
    lat: 43.545,
    lng: -79.79,
    loc: "North of Highway 407: Middle and East branches, Mill Pond, warmwater fishery",
    driveTime: { "toronto": 40, "north york": 35, "scarborough": 40, "etobicoke": 25, "markham": 40, "richmond hill": 40, "vaughan": 40, "ajax": 60, "pickering": 55, "mississauga": 30, "brampton": 20, "oakville": 10, "burlington": 20, "milton": 10, "hamilton": 25, "guelph": 30, "cambridge": 40, "kitchener": 50, "waterloo": 50, "orangeville": 40, "oshawa": 70, "whitby": 70, "bowmanville": 80, "clarington": 85, "newcastle": 90, "cobourg": 115, "port hope": 110, "barrie": 80, "collingwood": 95, "owen sound": 125 },
    species: [],
    active: false,
    regs: [],
    methods: [],
    access: []
  },
  "Rouge River \u2014 Marsh & Mouth (Lake Ontario)": {
    season: "all-year",
    gauge: "02HC022",
    gaugeName: "Rouge River near Markham",
    sweetMin: 1,
    sweetMax: 6,
    flowLow: 0.3,
    flowHigh: 15,
    lat: 43.803,
    lng: -79.134,
    loc: "Lake Ontario mouth (Rouge Beach, Pickering / Scarborough)",
    driveTime: { "toronto": 30, "north york": 30, "scarborough": 10, "etobicoke": 50, "markham": 20, "richmond hill": 30, "vaughan": 40, "ajax": 10, "pickering": 5, "mississauga": 75, "brampton": 65, "oakville": 65, "burlington": 85, "milton": 75, "hamilton": 95, "guelph": 105, "cambridge": 120, "kitchener": 130, "waterloo": 130, "orangeville": 85, "oshawa": 25, "whitby": 20, "bowmanville": 45, "clarington": 50, "newcastle": 50, "cobourg": 90, "port hope": 75, "barrie": 90, "collingwood": 130, "owen sound": 185 },
    species: ["Steelhead", "Chinook Salmon"],
    active: true,
    regs: [{ rule: "FMZ 16. Kingston Rd (Hwy 2) to Lake Ontario: open all year.", icon: "\u{1F4CB}" }],
    methods: ["spin", "float"],
    access: [
      { name: "Rouge Beach \xB7 River Mouth", mouth: true, loc: "Rouge Beach Park \xB7 Pickering / Scarborough border", crowd: "high", desc: "Entry point for migratory Chinook, steelhead, and brown trout from Lake Ontario. Casting spoons and spinners around the rocks and under railway bridges near the mouth is highly productive during seasonal runs. Spring pike fishing in the shallow marsh areas with shiners or crankbaits." },
      { name: "CNR Railway Bridge Area", loc: "Below CNR bridge \xB7 Lower Rouge", crowd: "high", desc: "Fish concentrate below structures near the mouth during the runs. Good holding water for steelhead in spring and Chinook in fall. Heavy pressure on peak run weekends, so arrive early." }
    ]
  },
  "Rouge River \u2014 Mid-Section (Rouge National Urban Park)": {
    season: "extended",
    gauge: "02HC022",
    gaugeName: "Rouge River near Markham",
    sweetMin: 1,
    sweetMax: 6,
    flowLow: 0.3,
    flowHigh: 15,
    lat: 43.835,
    lng: -79.142,
    loc: "Highway 2 (Kingston Road) north through Rouge National Urban Park and Toronto Zoo",
    driveTime: { "toronto": 35, "north york": 30, "scarborough": 15, "etobicoke": 50, "markham": 15, "richmond hill": 30, "vaughan": 40, "ajax": 10, "pickering": 5, "mississauga": 80, "brampton": 65, "oakville": 65, "burlington": 85, "milton": 80, "hamilton": 100, "guelph": 105, "cambridge": 120, "kitchener": 130, "waterloo": 130, "orangeville": 85, "oshawa": 25, "whitby": 20, "bowmanville": 40, "clarington": 50, "newcastle": 50, "cobourg": 90, "port hope": 75, "barrie": 85, "collingwood": 125, "owen sound": 185 },
    species: ["Steelhead", "Chinook Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "Rouge National Urban Park, managed by Parks Canada. Respect all park rules. Hwy 2 to Hwy 407: open fourth Saturday in April to Dec 31 (FMZ 16).", icon: "\u{1F4CB}" }],
    methods: ["float", "fly"],
    access: [
      { name: "Rouge National Urban Park \xB7 Main Access", loc: "Rouge National Urban Park \xB7 Parks Canada", crowd: "med", desc: "Cool to cold-water fishery best known for its fall and spring salmon and steelhead runs. Target deeper pools and runs below structures. Managed by Parks Canada, so respect all posted rules inside the park." },
      { name: "Kingston Road (Hwy 2) Bridge Area", loc: "Kingston Road bridge \xB7 Lower mid-section", crowd: "med", desc: "Access at the southern boundary of the mid-section. Transition zone between the warm marsh and the cooler mid-river. Fish push through this zone on their way upstream. Float fishing with roe or beads under a centrepin setup works well." },
      { name: "Toronto Zoo Valley", loc: "Behind Toronto Zoo \xB7 Rouge valley", crowd: "low", desc: "Less accessible than the main park entry points, which keeps pressure lower. Deep valley pools hold steelhead and salmon during runs. The tree canopy and valley walls create shaded, cooler water even in summer." }
    ]
  },
  "Rouge River \u2014 Upper & Milne Dam (Markham)": {
    season: "standard",
    gauge: "02HC022",
    gaugeName: "Rouge River near Markham",
    sweetMin: 0.5,
    sweetMax: 4,
    flowLow: 0.1,
    flowHigh: 8,
    lat: 43.88,
    lng: -79.25,
    loc: "Northern tributaries and Milne Dam Conservation Park (Markham)",
    driveTime: { "toronto": 35, "north york": 25, "scarborough": 15, "etobicoke": 50, "markham": 10, "richmond hill": 20, "vaughan": 30, "ajax": 20, "pickering": 15, "mississauga": 75, "brampton": 55, "oakville": 65, "burlington": 85, "milton": 70, "hamilton": 95, "guelph": 100, "cambridge": 115, "kitchener": 125, "waterloo": 125, "orangeville": 75, "oshawa": 35, "whitby": 30, "bowmanville": 50, "clarington": 60, "newcastle": 60, "cobourg": 100, "port hope": 85, "barrie": 75, "collingwood": 115, "owen sound": 175 },
    species: ["Rainbow Trout", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 16. North of Hwy 407 the trout and salmon season ends Sept 30. Urban watershed. Check TRCA rules for Milne Dam Conservation Park. Heavily influenced by urban development.", icon: "\u{1F4CB}" }],
    methods: ["spin", "fly"],
    access: [
      { name: "Milne Dam Conservation Park", loc: "Milne Dam \xB7 Markham, ON \xB7 TRCA managed", crowd: "med", desc: "Resident rainbow and brown trout in the tailwater below Milne Dam. Slower, urban-influenced water but surprisingly productive for trout anglers in spring. The dam creates a barrier concentrating fish. Largemouth and smallmouth bass also present throughout." },
      { name: "Toogood Pond Area", loc: "Toogood Pond \xB7 Unionville, Markham", crowd: "med", desc: "Slower, warmer impoundment water. Resident largemouth bass are the main draw, but rainbow trout are present, especially in spring before the water warms. An easy-to-reach urban fishery and a good start for newer anglers." }
    ]
  },
  "Wilmot Creek \u2014 Mouth & Marsh (Lake Ontario)": {
    season: "all-year",
    gauge: "02HD009",
    gaugeName: "Wilmot Creek near Newcastle",
    sweetMin: 1,
    sweetMax: 5,
    flowLow: 0.2,
    flowHigh: 10,
    lat: 43.89,
    lng: -78.594,
    loc: "Sir Samuel Wilmot Nature Area (Lake Ontario mouth, Cobbledick Road)",
    driveTime: { "toronto": 80, "north york": 80, "scarborough": 60, "etobicoke": 100, "markham": 65, "richmond hill": 80, "vaughan": 85, "ajax": 40, "pickering": 45, "mississauga": 125, "brampton": 115, "oakville": 110, "burlington": 130, "milton": 125, "hamilton": 140, "guelph": 155, "cambridge": 170, "kitchener": 180, "waterloo": 180, "orangeville": 135, "oshawa": 25, "whitby": 30, "bowmanville": 10, "clarington": 5, "newcastle": 5, "cobourg": 40, "port hope": 30, "barrie": 115, "collingwood": 165, "owen sound": 225 },
    species: ["Steelhead", "Chinook Salmon", "Coho Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 17. Standard trout and salmon limits apply. Sir Samuel Wilmot Nature Area is a provincially significant wetland, so respect all posted rules.", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Sir Samuel Wilmot Nature Area", mouth: true, loc: "Cobbledick Road \xB7 South of CN tracks \xB7 Clarington", crowd: "high", desc: "The marsh and creek mouth where Wilmot Creek enters Lake Ontario through a provincially significant wetland. Excellent staging area for fall Chinook and Coho before they push upstream, and spring steelhead. Also holds northern pike, crappie, sunfish, and large carp year-round. Heavy pressure during peak fall salmon runs." }
    ]
  },
  "Wilmot Creek \u2014 Lower River (to CN Rail Tracks)": {
    season: "all-year",
    gauge: "02HD009",
    gaugeName: "Wilmot Creek near Newcastle",
    sweetMin: 1,
    sweetMax: 5,
    flowLow: 0.2,
    flowHigh: 10,
    lat: 43.9,
    lng: -78.592,
    loc: "Mouth to the CN railway tracks: gravel runs and holding pools",
    driveTime: { "toronto": 80, "north york": 80, "scarborough": 60, "etobicoke": 100, "markham": 65, "richmond hill": 80, "vaughan": 85, "ajax": 40, "pickering": 45, "mississauga": 125, "brampton": 115, "oakville": 115, "burlington": 130, "milton": 125, "hamilton": 140, "guelph": 155, "cambridge": 170, "kitchener": 180, "waterloo": 185, "orangeville": 135, "oshawa": 25, "whitby": 30, "bowmanville": 10, "clarington": 5, "newcastle": 5, "cobourg": 40, "port hope": 30, "barrie": 115, "collingwood": 165, "owen sound": 225 },
    species: ["Steelhead", "Chinook Salmon", "Coho Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 17. Heavy pressure during peak runs. Respect other anglers and release fish where you can.", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Nature Preserve Trails \xB7 Lower Creek", loc: "Cobbledick Road \xB7 Nature preserve trail access", crowd: "high", desc: "Gravel runs, shallows and holding pools, the first river water above the marsh. It\u2019s one of the first sections fish reach, so pressure is heavy during peak runs. Brown trout and steelhead are both targeted here during their runs. Float fishing with roe and beads dominates." },
      { name: "CN Railway Track Crossing", loc: "CN Rail bridge \xB7 Lower Wilmot Creek", crowd: "med", desc: "The CN railway crossing marks the upper boundary of this section. Good pool structure below the bridge. Slightly less pressure than the very lowest water near the marsh, but still popular during peak season." }
    ]
  },
  "Wilmot Creek \u2014 Middle Section (Hwy 401 to Hwy 2)": {
    season: "extended",
    gauge: "02HD009",
    gaugeName: "Wilmot Creek near Newcastle",
    sweetMin: 1,
    sweetMax: 4,
    flowLow: 0.2,
    flowHigh: 8,
    lat: 43.915,
    lng: -78.585,
    loc: "Newcastle: wooded corridor with riffles and holding pools",
    driveTime: { "toronto": 80, "north york": 80, "scarborough": 65, "etobicoke": 100, "markham": 70, "richmond hill": 80, "vaughan": 90, "ajax": 40, "pickering": 45, "mississauga": 125, "brampton": 115, "oakville": 115, "burlington": 130, "milton": 125, "hamilton": 145, "guelph": 155, "cambridge": 170, "kitchener": 180, "waterloo": 185, "orangeville": 135, "oshawa": 25, "whitby": 30, "bowmanville": 10, "clarington": 5, "newcastle": 5, "cobourg": 40, "port hope": 25, "barrie": 115, "collingwood": 165, "owen sound": 225 },
    species: ["Steelhead", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 17. Water can get shallow depending on rainfall, so check conditions before making the trip.", icon: "\u{1F4CB}" }],
    methods: ["float", "fly"],
    access: [
      { name: "Newcastle \xB7 Highway 401 to Highway 2 Reach", loc: "Newcastle, ON \xB7 Wooded valley corridor", crowd: "low", desc: "Houses give way to a wooded corridor with fast riffles and holding pools. Resident brown trout and migrating steelhead. Much less pressure than the lower stretches, and worth the walk if you want a quieter day. The water can get shallow in low-flow periods." }
    ]
  },
  "Wilmot Creek \u2014 Upper Watershed & Orono Crown Lands": {
    season: "standard",
    gauge: "02HD009",
    gaugeName: "Wilmot Creek near Newcastle",
    sweetMin: 0.5,
    sweetMax: 3,
    flowLow: 0.1,
    flowHigh: 6,
    lat: 43.96,
    lng: -78.575,
    loc: "North of Highway 2: Orono Crown Lands, cold-water headwaters",
    driveTime: { "toronto": 85, "north york": 85, "scarborough": 65, "etobicoke": 105, "markham": 70, "richmond hill": 80, "vaughan": 90, "ajax": 45, "pickering": 50, "mississauga": 130, "brampton": 115, "oakville": 115, "burlington": 135, "milton": 130, "hamilton": 145, "guelph": 160, "cambridge": 175, "kitchener": 185, "waterloo": 185, "orangeville": 135, "oshawa": 30, "whitby": 35, "bowmanville": 10, "clarington": 5, "newcastle": 5, "cobourg": 35, "port hope": 25, "barrie": 115, "collingwood": 160, "owen sound": 225 },
    species: ["Brook Trout", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 17. Cold-water, sensitive habitat. The Orono Crown Lands provide public access. Check for specific tributary restrictions.", icon: "\u{1F4CB}" }],
    methods: ["fly", "spin"],
    access: [
      { name: "Orono Crown Lands", loc: "Orono, ON \xB7 Crown Land access", crowd: "low", desc: "The upper three-quarters of the Wilmot watershed feature cold-water, shaded stream conditions supporting sustained brook trout and brown trout populations. Crown Land designation provides public access in the Orono area. Light tackle and fly fishing for resident trout. Minimal angling pressure compared to the lower sections." },
      { name: "Upper Wilmot Tributaries", loc: "Above Orono \xB7 Headwater tributaries", crowd: "low", desc: "Spring-fed cool water with native brook trout. Best in early season before temperatures rise. The least pressured section of the entire Wilmot system." }
    ]
  },
  "Bowmanville Creek \u2014 River Mouth & Piers": {
    season: "all-year",
    gauge: "02HD006",
    gaugeName: "Bowmanville Creek at Bowmanville",
    sweetMin: 1,
    sweetMax: 8,
    flowLow: 0.3,
    flowHigh: 15,
    lat: 43.893,
    lng: -78.685,
    loc: "Lake Ontario mouth \xB7 Darlington / Bowmanville Marina",
    driveTime: { "toronto": 70, "north york": 70, "scarborough": 55, "etobicoke": 90, "markham": 60, "richmond hill": 70, "vaughan": 80, "ajax": 30, "pickering": 35, "mississauga": 120, "brampton": 105, "oakville": 105, "burlington": 125, "milton": 115, "hamilton": 135, "guelph": 145, "cambridge": 160, "kitchener": 170, "waterloo": 175, "orangeville": 125, "oshawa": 15, "whitby": 25, "bowmanville": 5, "clarington": 10, "newcastle": 10, "cobourg": 45, "port hope": 35, "barrie": 110, "collingwood": 155, "owen sound": 220 },
    species: ["Steelhead", "Chinook Salmon", "Coho Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 17. South of the CNR: open all year.", icon: "\u{1F4CB}" }],
    methods: ["spin", "float"],
    access: [
      { name: "Bowmanville Marina Pier", loc: "Bowmanville Marina \xB7 Lake Ontario", crowd: "med", desc: "Staging area for incoming salmon in late summer and fall, and steelhead in spring. Cast off the pier with spoons, crankbaits, or spawn sacks. Action can be explosive during peak staging." },
      { name: "Creek Mouth \xB7 East Bank", loc: "South of CNR railway bridge \xB7 East bank", crowd: "high", desc: "Classic river mouth access. Bottom fishing with spawn sacks and beads, or casting spoons. Heavy pressure on fall weekends during peak Chinook runs, so arrive before dawn." }
    ]
  },
  "Lower Bowmanville Creek": {
    season: "all-year",
    gauge: "02HD006",
    gaugeName: "Bowmanville Creek at Bowmanville",
    sweetMin: 1,
    sweetMax: 8,
    flowLow: 0.3,
    flowHigh: 15,
    lat: 43.9,
    lng: -78.685,
    loc: "Lake Ontario to Baseline Road",
    driveTime: { "toronto": 70, "north york": 70, "scarborough": 55, "etobicoke": 90, "markham": 60, "richmond hill": 70, "vaughan": 80, "ajax": 30, "pickering": 35, "mississauga": 120, "brampton": 105, "oakville": 105, "burlington": 125, "milton": 120, "hamilton": 135, "guelph": 145, "cambridge": 160, "kitchener": 170, "waterloo": 175, "orangeville": 125, "oshawa": 15, "whitby": 25, "bowmanville": 5, "clarington": 10, "newcastle": 10, "cobourg": 45, "port hope": 35, "barrie": 110, "collingwood": 155, "owen sound": 220 },
    species: ["Steelhead", "Chinook Salmon", "Coho Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 17. Open all year south of the CNR bridge. Between the CNR and Hwy 2, including Baseline Rd, the season is the fourth Saturday in April to Dec 31.", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Baseline Road Bridge \xB7 Parking Lot", closed: [{ from: "01-01", to: "FRI_BEFORE_4TH_SAT_APRIL", why: "North of the CNR, where the season runs from the fourth Saturday in April to Dec 31" }], loc: "Baseline Road \xB7 East of Highway 57", crowd: "high", desc: "Most popular access on the lower creek. Deep pools and shallow runs hold fish through fall and spring runs. Float fishing with centrepin or spinning setup. Drift roe bags, jigs, or worms as fish push upstream." },
      { name: "CNR Railway Bridge \xB7 South Side", loc: "South of CNR bridge \xB7 Lower creek", crowd: "med", desc: "Open year-round south of the railway bridge. Good pool structure. Salmon in fall, steelhead in spring. Less crowded than the Baseline Rd lot." }
    ]
  },
  "Middle Bowmanville Creek (Fish Ladder)": {
    season: "extended",
    gauge: "02HD006",
    gaugeName: "Bowmanville Creek at Bowmanville",
    sweetMin: 1,
    sweetMax: 6,
    flowLow: 0.3,
    flowHigh: 12,
    lat: 43.907,
    lng: -78.683,
    loc: "Baseline Road to Goodyear / Vanstone Dam (Fish Ladder)",
    driveTime: { "toronto": 75, "north york": 70, "scarborough": 55, "etobicoke": 90, "markham": 60, "richmond hill": 70, "vaughan": 80, "ajax": 30, "pickering": 40, "mississauga": 120, "brampton": 105, "oakville": 105, "burlington": 125, "milton": 120, "hamilton": 135, "guelph": 150, "cambridge": 160, "kitchener": 170, "waterloo": 175, "orangeville": 125, "oshawa": 15, "whitby": 25, "bowmanville": 5, "clarington": 10, "newcastle": 10, "cobourg": 45, "port hope": 35, "barrie": 110, "collingwood": 155, "owen sound": 220 },
    species: ["Steelhead", "Chinook Salmon", "Coho Salmon", "Brown Trout"],
    active: true,
    regs: [{ rule: "Fishing is prohibited at the fish ladder and dam, and sanctuary signs are posted. No fishing within 23 m below a fishway entrance. FMZ 17: open fourth Saturday in April to Dec 31 between the CNR and Hwy 2.", icon: "\u{1F6AB}" }],
    methods: ["float", "fly"],
    access: [
      { name: "Bowmanville Valley Trail Access", loc: "Bowmanville Valley Trail \xB7 Middle creek", crowd: "high", desc: "Fish concentrate in the pools below the Goodyear Dam, waiting to pass the fish ladder. Heavy pressure during peak fall runs. Respect the sanctuary signs. Wardens patrol regularly during salmon season." },
      { name: "Goodyear Dam Lower Pools", loc: "Below Vanstone / Goodyear Dam", crowd: "high", desc: "Fish stall before ascending the fish ladder. Productive for centrepin and fly fishing in the pools below. Do not fish within the sanctuary boundary marked with posted signs." }
    ]
  },
  "Upper Bowmanville Creek": {
    season: "standard",
    gauge: "02HD006",
    gaugeName: "Bowmanville Creek at Bowmanville",
    sweetMin: 0.5,
    sweetMax: 4,
    flowLow: 0.1,
    flowHigh: 8,
    lat: 43.93,
    lng: -78.68,
    loc: "Above Goodyear Dam to Oak Ridges Moraine headwaters",
    driveTime: { "toronto": 75, "north york": 70, "scarborough": 55, "etobicoke": 95, "markham": 60, "richmond hill": 70, "vaughan": 80, "ajax": 30, "pickering": 40, "mississauga": 120, "brampton": 110, "oakville": 110, "burlington": 125, "milton": 120, "hamilton": 135, "guelph": 150, "cambridge": 165, "kitchener": 175, "waterloo": 175, "orangeville": 125, "oshawa": 15, "whitby": 25, "bowmanville": 5, "clarington": 5, "newcastle": 10, "cobourg": 45, "port hope": 35, "barrie": 105, "collingwood": 155, "owen sound": 215 },
    species: ["Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 17. North of Hwy 2 the trout and salmon season ends Sept 30. Critical spawning habitat. Check for seasonal closures and C&R requirements above the dam.", icon: "\u{1F4CB}" }],
    methods: ["fly", "spin"],
    access: [
      { name: "Upper Creek \xB7 Road Allowance Crossings", loc: "Above Goodyear Dam \xB7 Various bridge crossings", crowd: "low", desc: "Narrow, shallow, cool water with resident brown trout. Fly fishing with dry flies and nymphs, or light spinning with small spinners. Critical spawning habitat, so handle fish carefully and check for closures." },
      { name: "Oak Ridges Moraine Headwaters", loc: "Upper watershed \xB7 Headwater tributaries", crowd: "low", desc: "Most pristine section of the Bowmanville system. Small stream fishing for resident Brown Trout. Minimal pressure, forested banks, spring-fed cool water. Road allowance access at bridge crossings." },
      { name: "Headwaters near Enniskillen", loc: "Near Enniskillen \xB7 Upper Bowmanville Creek watershed", crowd: "low", desc: "Upper watershed access near Enniskillen. Remote and lightly pressured. Brook trout habitat in the cooler headwater reaches." }
    ]
  },
  "Speed River \u2014 Upper (Above Guelph Lake)": {
    season: "standard",
    gauge: "02GA029",
    gaugeName: "Eramosa River above Guelph",
    sweetMin: 1,
    sweetMax: 5,
    flowLow: 0.2,
    flowHigh: 10,
    lat: 43.64,
    lng: -80.22,
    loc: "Wellington County rural reaches flowing into Guelph Lake reservoir",
    driveTime: { "toronto": 85, "north york": 80, "scarborough": 90, "etobicoke": 75, "markham": 85, "richmond hill": 80, "vaughan": 75, "ajax": 110, "pickering": 105, "mississauga": 75, "brampton": 45, "oakville": 55, "burlington": 55, "milton": 35, "hamilton": 55, "guelph": 15, "cambridge": 35, "kitchener": 35, "waterloo": 35, "orangeville": 35, "oshawa": 125, "whitby": 120, "bowmanville": 140, "clarington": 150, "newcastle": 150, "cobourg": 190, "port hope": 175, "barrie": 105, "collingwood": 105, "owen sound": 130 },
    species: ["Brook Trout", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 16. Cold-water trout habitat. Check the regulations and GRCA rules for Wellington County tributaries.", icon: "\u{1F4CB}" }],
    methods: ["fly", "spin"],
    access: [
      { name: "Wellington County Road Bridge Crossings", loc: "Upper Speed River \xB7 Wellington County rural", crowd: "low", desc: "Cool, spring-fed, clear water with quality brook and brown trout habitat. Fly fishing and light spinning tackle work best in these tight, rural stretches. Access via road allowances at bridge crossings throughout Wellington County. Smallmouth bass and white sucker also present in the slower sections." },
      { name: "Guelph Lake Reservoir Inflow", loc: "Upper Speed near Guelph Lake \xB7 GRCA managed", crowd: "low", desc: "The upper river as it approaches the Guelph Lake reservoir. GRCA managed conservation land provides some access. Cold tributary water holds resident trout before they enter the warmer reservoir. Best in spring and fall when temperatures are optimal." }
    ]
  },
  "Speed River \u2014 Middle (Guelph Lake to Downtown Guelph)": {
    season: "standard",
    gauge: "02GA029",
    gaugeName: "Eramosa River above Guelph",
    sweetMin: 1,
    sweetMax: 5,
    flowLow: 0.2,
    flowHigh: 10,
    lat: 43.57,
    lng: -80.25,
    loc: "Guelph Lake reservoir through Riverside Park to downtown Guelph",
    driveTime: { "toronto": 85, "north york": 85, "scarborough": 95, "etobicoke": 75, "markham": 90, "richmond hill": 85, "vaughan": 80, "ajax": 115, "pickering": 110, "mississauga": 80, "brampton": 50, "oakville": 55, "burlington": 50, "milton": 35, "hamilton": 50, "guelph": 5, "cambridge": 25, "kitchener": 25, "waterloo": 30, "orangeville": 45, "oshawa": 130, "whitby": 125, "bowmanville": 145, "clarington": 155, "newcastle": 155, "cobourg": 195, "port hope": 180, "barrie": 115, "collingwood": 115, "owen sound": 140 },
    species: [],
    active: false,
    regs: [],
    methods: [],
    access: []
  },
  "Speed River \u2014 Lower (Guelph to Cambridge Confluence)": {
    season: "standard",
    gauge: "02GA029",
    gaugeName: "Eramosa River above Guelph",
    sweetMin: 1,
    sweetMax: 5,
    flowLow: 0.2,
    flowHigh: 10,
    lat: 43.43,
    lng: -80.31,
    loc: "Southern Guelph through Puslinch and Hespeler to the Grand River confluence (Cambridge)",
    driveTime: { "toronto": 95, "north york": 95, "scarborough": 105, "etobicoke": 85, "markham": 100, "richmond hill": 100, "vaughan": 95, "ajax": 130, "pickering": 120, "mississauga": 85, "brampton": 65, "oakville": 55, "burlington": 50, "milton": 40, "hamilton": 45, "guelph": 15, "cambridge": 10, "kitchener": 15, "waterloo": 20, "orangeville": 65, "oshawa": 145, "whitby": 135, "bowmanville": 160, "clarington": 165, "newcastle": 165, "cobourg": 205, "port hope": 190, "barrie": 130, "collingwood": 135, "owen sound": 155 },
    species: [],
    active: false,
    regs: [],
    methods: [],
    access: []
  },
  "Eramosa River \u2014 Upper Headwaters (Above Rockwood)": {
    season: "standard",
    gauge: "02GA029",
    gaugeName: "Eramosa River above Guelph",
    sweetMin: 1,
    sweetMax: 5,
    flowLow: 0.2,
    flowHigh: 8,
    lat: 43.615,
    lng: -80.148,
    loc: "Above Rockwood to the headwaters: cold water, road bridge access",
    driveTime: { "toronto": 80, "north york": 70, "scarborough": 85, "etobicoke": 65, "markham": 80, "richmond hill": 75, "vaughan": 70, "ajax": 105, "pickering": 100, "mississauga": 70, "brampton": 40, "oakville": 45, "burlington": 50, "milton": 25, "hamilton": 50, "guelph": 15, "cambridge": 35, "kitchener": 35, "waterloo": 40, "orangeville": 40, "oshawa": 120, "whitby": 115, "bowmanville": 135, "clarington": 145, "newcastle": 145, "cobourg": 185, "port hope": 170, "barrie": 105, "collingwood": 110, "owen sound": 140 },
    species: ["Brook Trout", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 16 seasonal dates apply. Access from municipal road bridges only, as most of this section flows through private land.", icon: "\u{1F4CB}" }],
    methods: ["fly", "spin"],
    access: [
      { name: "Municipal Road Bridge Crossings \xB7 Upper", loc: "Above Rockwood \xB7 Road allowances", crowd: "low", desc: "Wild brook and brown trout in cold, clear water. Wading from road allowances at bridge crossings is the only legal access through private land. Stealth required: tight quarters, clear water and spooky fish. Light tackle or dry flies work best." },
      { name: "Headwaters Tributaries", loc: "Upper Eramosa watershed", crowd: "low", desc: "The most pristine section of the system. Native brook trout in spring-fed tributaries. Very limited access, road allowances only. Fish carefully and release everything." }
    ]
  },
  "Eramosa River \u2014 Mid-Section (Rockwood to Eden Mills)": {
    season: "standard",
    gauge: "02GA029",
    gaugeName: "Eramosa River above Guelph",
    sweetMin: 1,
    sweetMax: 5,
    flowLow: 0.2,
    flowHigh: 10,
    lat: 43.595,
    lng: -80.195,
    loc: "Rockwood Conservation Area to Eden Mills: limestone bluffs and glacial potholes",
    driveTime: { "toronto": 85, "north york": 75, "scarborough": 85, "etobicoke": 70, "markham": 85, "richmond hill": 80, "vaughan": 75, "ajax": 110, "pickering": 105, "mississauga": 75, "brampton": 45, "oakville": 50, "burlington": 50, "milton": 30, "hamilton": 50, "guelph": 10, "cambridge": 30, "kitchener": 30, "waterloo": 35, "orangeville": 40, "oshawa": 125, "whitby": 120, "bowmanville": 140, "clarington": 150, "newcastle": 150, "cobourg": 190, "port hope": 175, "barrie": 110, "collingwood": 115, "owen sound": 140 },
    species: ["Rainbow Trout", "Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 16 seasonal dates apply. GRCA manages Rockwood Conservation Area, and there\u2019s a day-use fee.", icon: "\u{1F4CB}" }],
    methods: ["spin", "fly", "float"],
    access: [
      { name: "Rockwood Conservation Area", loc: "Rockwood, ON \xB7 GRCA managed", crowd: "high", desc: "Known for its steep limestone bluffs, glacial potholes and the Rockwood millpond. The MNR stocks rainbow and brown trout here every year, so spring fishing is excellent. Day-use fee applies. Northern pike and smallmouth bass hold in the slower pockets." },
      { name: "Eden Mills \xB7 Lower Mid-Section", loc: "Eden Mills, ON \xB7 Village access", crowd: "med", desc: "Scenic village section with good pool structure. Stocked trout move through from Rockwood. Northern pike and smallmouth bass present in slower water. Accessible from village road allowances." }
    ]
  },
  "Eramosa River \u2014 Lower Stretches (Eden Mills to Guelph)": {
    gauge: "02GA029",
    gaugeName: "Eramosa River above Guelph",
    sweetMin: 1,
    sweetMax: 5,
    flowLow: 0.2,
    flowHigh: 10,
    lat: 43.565,
    lng: -80.225,
    loc: "Eden Mills to Guelph, a warm-water bass and pike fishery",
    driveTime: { "toronto": 85, "north york": 80, "scarborough": 90, "etobicoke": 75, "markham": 85, "richmond hill": 85, "vaughan": 75, "ajax": 115, "pickering": 110, "mississauga": 75, "brampton": 50, "oakville": 50, "burlington": 50, "milton": 30, "hamilton": 50, "guelph": 5, "cambridge": 25, "kitchener": 30, "waterloo": 30, "orangeville": 45, "oshawa": 130, "whitby": 125, "bowmanville": 145, "clarington": 155, "newcastle": 155, "cobourg": 190, "port hope": 180, "barrie": 115, "collingwood": 115, "owen sound": 140 },
    species: [],
    active: false,
    regs: [],
    methods: [],
    access: []
  },
  "Black Creek \u2014 Upper Reaches (Vaughan to North York)": {
    season: "standard",
    gauge: "02HC025",
    gaugeName: "Humber River at Elder Mills",
    sweetMin: 1,
    sweetMax: 6,
    flowLow: 0.2,
    flowHigh: 12,
    lat: 43.76,
    lng: -79.49,
    loc: "North of Finch Avenue: Downsview, York University area, naturalized ravines",
    driveTime: { "toronto": 25, "north york": 10, "scarborough": 20, "etobicoke": 25, "markham": 20, "richmond hill": 20, "vaughan": 15, "ajax": 45, "pickering": 40, "mississauga": 50, "brampton": 30, "oakville": 40, "burlington": 60, "milton": 45, "hamilton": 70, "guelph": 75, "cambridge": 90, "kitchener": 100, "waterloo": 100, "orangeville": 55, "oshawa": 60, "whitby": 50, "bowmanville": 75, "clarington": 85, "newcastle": 85, "cobourg": 120, "port hope": 110, "barrie": 80, "collingwood": 115, "owen sound": 165 },
    species: ["Brown Trout"],
    active: true,
    regs: [{ rule: "FMZ 16. Urban waterway with flashy flows. Water levels can surge after rain, so check conditions before you go.", icon: "\u{1F4CB}" }],
    methods: ["spin", "fly"],
    access: [
      { name: "Black Creek Parkland \xB7 Upper", loc: "North York \xB7 Black Creek Parkland", crowd: "low", desc: "Naturalized ravines and wooded parklands with undercut stream banks and riffle-pool sequences. Brown trout present along with smallmouth bass, rock bass, and carp. A surprising urban fishery for those willing to explore. Best in early spring before water temperatures rise." },
      { name: "Downsview Park Area", loc: "Downsview \xB7 Near York University", crowd: "low", desc: "A more natural upper section with some good structure. Brown trout are the main draw for trout anglers. Access via parkland trails. Flashy flows, so avoid it after heavy rain, when the creek turns chocolate brown and rises fast." }
    ]
  },
  "Black Creek \u2014 Concrete Channel (Central North York)": {
    gauge: "02HC025",
    gaugeName: "Humber River at Elder Mills",
    sweetMin: 1,
    sweetMax: 6,
    flowLow: 0.2,
    flowHigh: 12,
    lat: 43.72,
    lng: -79.49,
    loc: "Wilson Avenue to Eglinton Avenue: flood control concrete channel",
    driveTime: { "toronto": 20, "north york": 15, "scarborough": 20, "etobicoke": 20, "markham": 20, "richmond hill": 25, "vaughan": 20, "ajax": 45, "pickering": 40, "mississauga": 45, "brampton": 30, "oakville": 35, "burlington": 55, "milton": 45, "hamilton": 65, "guelph": 70, "cambridge": 85, "kitchener": 95, "waterloo": 100, "orangeville": 60, "oshawa": 60, "whitby": 55, "bowmanville": 75, "clarington": 85, "newcastle": 85, "cobourg": 125, "port hope": 110, "barrie": 85, "collingwood": 115, "owen sound": 170 },
    species: [],
    active: false,
    regs: [],
    methods: [],
    access: []
  },
  "Black Creek \u2014 Lower Watershed & Humber Confluence": {
    // The all-year rule covers the Humber main stem below Eglinton, not its tributaries.
    season: "standard",
    gauge: "02HC025",
    gaugeName: "Humber River at Elder Mills",
    sweetMin: 1,
    sweetMax: 6,
    flowLow: 0.2,
    flowHigh: 12,
    lat: 43.67,
    lng: -79.5,
    loc: "South of Eglinton Avenue: Smythe Park to the Humber River junction, Etobicoke",
    driveTime: { "toronto": 20, "north york": 15, "scarborough": 25, "etobicoke": 15, "markham": 30, "richmond hill": 30, "vaughan": 25, "ajax": 50, "pickering": 45, "mississauga": 40, "brampton": 30, "oakville": 30, "burlington": 50, "milton": 40, "hamilton": 60, "guelph": 70, "cambridge": 85, "kitchener": 95, "waterloo": 95, "orangeville": 60, "oshawa": 65, "whitby": 55, "bowmanville": 80, "clarington": 85, "newcastle": 90, "cobourg": 125, "port hope": 115, "barrie": 90, "collingwood": 120, "owen sound": 170 },
    species: ["Steelhead", "Chinook Salmon"],
    active: true,
    regs: [{ rule: "FMZ 16. Trout and salmon season on Black Creek ends Sept 30; the Humber main stem below Eglinton is open all year. Highly accessible urban fishery. Migratory fish push up from the Humber during spring and fall runs.", icon: "\u{1F4CB}" }],
    methods: ["float", "spin"],
    access: [
      { name: "Smythe Park", loc: "Smythe Park \xB7 Etobicoke near Eglinton", crowd: "med", desc: "Where the creek regains its natural banks with deep pools, overhanging vegetation, and natural structure. Migratory steelhead and Chinook push up from the Humber during spring and fall runs. Brown bullhead, pumpkinseed, panfish, and carp year-round. Highly accessible urban spot." },
      { name: "Humber Marshes \xB7 Black Creek Confluence", loc: "Humber Marshes \xB7 Black Creek meets Humber River", crowd: "med", desc: "The confluence of Black Creek and the main Humber River. Fish moving up the Humber system enter Black Creek here during migrations. Good pool and slack-water structure at the junction. Accessible from the Humber Valley trail system." }
    ]
  },
  // Default fallback for rivers without full config
  "default": {
    gauge: null,
    gaugeName: "No gauge available",
    gaugeUrl: null,
    lat: 43.7,
    lng: -79.4,
    sweetMin: 5,
    sweetMax: 15,
    flowLow: 2,
    flowHigh: 25,
    species: ["Trout", "Salmon"],
    routine: [
      { t: "Check the local Conservation Authority", d: "Each watershed has a Conservation Authority that tracks conditions and may issue flow or flood advisories." },
      { t: "Review recent rain in the upstream watershed", d: "Most Southern Ontario rivers respond to rain within 6\u201324 hours. A modest rain 24\u201348 hrs prior often produces ideal, slightly-stained conditions." },
      { t: "Make your go/no-go call based on flow direction", d: "A rising flow is almost always better than a falling one at the same level. Direction matters more than the number." }
    ],
    dam: {
      icon: "U0001f4e1",
      label: "Data \xB7 Environment Canada Water Office",
      title: "Check live flow data for this river",
      desc: "For rivers not yet in the HereFishyFishy database, check the Environment Canada Water Office for the nearest active gauge. Real-time data is updated hourly.",
      links: [
        { text: "Water Office Search", url: "https://wateroffice.ec.gc.ca/search/real_time_e.html" },
        { text: "OMNR Regulations", url: "https://www.ontario.ca/page/sport-fishing-ontario" }
      ]
    },
    access: [
      { name: "Check local conservation area access", crowd: "med", crowdLabel: "Varies", loc: "See local Conservation Authority website", desc: "Access points and regulations vary by river. Check the local Conservation Authority website for current access information and any seasonal closures.", tags: ["Check Local CA", "Access Varies"], best: "Conditions vary, so check local sources before your trip." }
    ]
  }
};
var RIVER_REGS = {
  "Grand River": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2 (aggregate trout)",
        "notes": "Fergus\u2013Elora reach: catch & release only (S-0, C-0). Artificial lure only. One barbless hook only."
      },
      {
        "name": "Rainbow Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-2 / C-1",
        "notes": "Same C&R restriction as brown trout in Fergus\u2013Elora reach. Artificial only."
      },
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Catch & release only in Fergus\u2013Elora designated reach."
      }
    ],
    "special": [
      "Fergus\u2013Elora reach: ARTIFICIAL LURES ONLY, no bait of any kind",
      "ONE barbless hook maximum throughout designated reach",
      "Brown, Rainbow & Brook Trout: S-0 / C-0 (catch & release only) in Fergus\u2013Elora",
      "Paris to Brantford: Fish Sanctuary: no fishing March 1 \u2013 Fri. before 4th Sat. in April",
      "Southern Bait Management Zone: no live baitfish transport"
    ]
  },
  "Credit River": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Chinook / Coho Salmon",
        "season": "4th Sat. April \u2013 Sept. 30 (zone-wide)",
        "limit": "S-5 / C-2",
        "notes": "Pacific salmon count toward the S-5 / C-2 trout and salmon aggregate."
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2 (aggregate trout)",
        "notes": "Upper reach (above Old Baseline Rd.): artificial only, barbless hook, C&R only (S-0/C-0)."
      },
      {
        "name": "Rainbow Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-2 / C-1",
        "notes": "Varies by reach. Check specific section regulations."
      },
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Upper Credit (above Old Baseline Rd.): S-0 / C-0."
      }
    ],
    "special": [
      "Above Old Baseline Road, Town of Caledon: ARTIFICIAL LURE ONLY, one barbless hook, trout C&R only",
      "Different reaches have different fish sanctuary periods. Check your exact location",
      "Britannia Rd. to Hwy 407: open 4th Sat. April \u2013 Dec. 31 (extended fall season)",
      "Britannia to Old Baseline Rd.: sanctuary Jan. 1 \u2013 Fri. before 4th Sat. April",
      "Old Baseline Rd. to Hwy 9: sanctuary Jan. 1\u2013Fri. before 4th Sat. April & Oct. 1\u2013Dec. 31",
      "Hwy 403 to Britannia Rd.: sanctuary Jan. 1\u2013Apr. & Aug. 15\u2013Dec. 31",
      "Southern Bait Management Zone"
    ]
  },
  "Bronte Creek": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30 (zone-wide)",
        "limit": "S-5 / C-2",
        "notes": ""
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30; open all year near mouth (Hwy 2 to Lake)",
        "limit": "S-5 / C-2",
        "notes": "Lower reach (Hwy 2 to Lake Ontario): open all year with extended season."
      },
      {
        "name": "Rainbow Trout",
        "season": "4th Sat. April \u2013 Sept. 30; open all year near mouth",
        "limit": "S-2 / C-1",
        "notes": "Extended open season applies to Hwy 2\u2013Lake Ontario section."
      },
      {
        "name": "Chinook / Coho Salmon",
        "season": "Open all year near Lake Ontario; 4th Sat. April \u2013 Sept. 30 inland",
        "limit": "S-5 / C-2 (Pacific Salmon)",
        "notes": "Best fishing in fall run (Sept\u2013Nov)."
      }
    ],
    "special": [
      "Progreston CPR track to Hwy 407, including Lowville: sanctuary Jan. 1\u2013Fri. before 4th Sat. April & Oct. 1\u2013Dec. 31",
      "Lower reach (Hwy 2 to Lake Ontario): open all year for Atlantic/Brown/Rainbow/Pacific Salmon",
      "Southern Bait Management Zone: no live baitfish transport",
      "Aggregate trout and salmon limit: S-5 / C-2 combined"
    ]
  },
  "Humber River": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Rainbow Trout (Steelhead)",
        "season": "4th Sat. April \u2013 Sept. 30 (zone-wide)",
        "limit": "S-2 / C-1",
        "notes": "Counts toward the S-5 / C-2 trout and salmon aggregate."
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-2 / C-1 (combined with Brook & Rainbow upstream of Eglinton)",
        "notes": "Upper Humber (above Eglinton Ave.): combined Brook, Brown & Rainbow limit S-2/C-1."
      },
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-2 / C-1 combined (above Eglinton)",
        "notes": "Combined limit with Brown and Rainbow Trout above Eglinton Ave."
      },
      {
        "name": "Chinook / Coho Salmon",
        "season": "Open all year (Eglinton to Lake Ontario)",
        "limit": "S-5 / C-2",
        "notes": "Lower Humber extended season applies."
      }
    ],
    "special": [
      "Above Hwy 407 (York/Peel/Dufferin/Simcoe): sanctuary Jan. 1\u2013Fri. before 4th Sat. April & Oct. 1\u2013Dec. 31",
      "Above Eglinton Ave.: Brook, Brown & Rainbow combined limit S-2 / C-1",
      "Eglinton to Lake Ontario: open all year for Atlantic/Brown/Rainbow/Pacific Salmon",
      "Southern Bait Management Zone"
    ]
  },
  "Nottawasaga River": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Headwaters and upper tributaries. Standard FMZ 16 season."
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Extended fall season applies to lower reaches toward Georgian Bay."
      },
      {
        "name": "Rainbow Trout (Steelhead)",
        "season": "4th Sat. April \u2013 Sept. 30 (inland); open all year (lower toward Georgian Bay)",
        "limit": "S-2 / C-1",
        "notes": "Lower Nottawasaga (Boyne River to Georgian Bay): open all year."
      },
      {
        "name": "Chinook / Coho Salmon",
        "season": "4th Sat. April \u2013 Sept. 30; open all year (lower)",
        "limit": "S-5 / C-2",
        "notes": "Best in fall (Sept\u2013Nov) in lower river toward Georgian Bay."
      }
    ],
    "special": [
      "Nicholson Dam (Hwy 89 down to near the Boyne): sanctuary Jan. 1\u2013Fri. before 2nd Sat. in May & Oct. 1\u2013Dec. 31",
      "Lower Nottawasaga (Boyne to Georgian Bay): open all year for Brown, Rainbow & Pacific Salmon",
      "Boyne River to Pine River: Rainbow Trout catch and release only (S-0 / C-0)",
      "Southern Bait Management Zone"
    ]
  },
  "Duffins Creek": {
    "zone": "FMZ 17",
    "species": [
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30 (zone-wide)",
        "limit": "S-2 / C-1",
        "notes": "Zone 17 brook trout limit is S-2 / C-1."
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30; open all year (lower, south of CNR)",
        "limit": "S-5 / C-2",
        "notes": "Lower section (south of CNR right-of-way to Lake Ontario): open all year."
      },
      {
        "name": "Rainbow Trout (Steelhead)",
        "season": "4th Sat. April \u2013 Sept. 30; open all year (lower)",
        "limit": "S-2 / C-1",
        "notes": "Extended season south of CNR."
      },
      {
        "name": "Chinook / Coho Salmon",
        "season": "Open all year (lower); 4th Sat. April \u2013 Sept. 30 (inland)",
        "limit": "S-5 / C-2",
        "notes": "Fall run (Sept\u2013Nov) is peak season."
      }
    ],
    "special": [
      "Durham Region waters between Hwy 2 and the CNR: open 4th Sat. April \u2013 Dec. 31 (extended fall season)",
      "Durham Region waters between CNR right-of-way and Lake Ontario: open all year",
      "Aggregate trout and salmon limit applies: S-5 / C-2 combined",
      "Southern Bait Management Zone",
      "Check TRCA for any additional local closures or sanctuary areas"
    ]
  },
  "Ganaraska River": {
    "zone": "FMZ 17",
    "species": [
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30; open all year (Ganaraska, CNR to Lake Ontario)",
        "limit": "S-5 / C-2",
        "notes": "The Ganaraska between CNR right-of-way and Lake Ontario is open all year."
      },
      {
        "name": "Rainbow Trout (Steelhead)",
        "season": "4th Sat. April \u2013 Sept. 30; open all year (lower)",
        "limit": "S-2 / C-1",
        "notes": "Open all year below the CNR. Jocelyn St to the CNR is open from the fourth Saturday in April to Aug 31 and Oct 15 to Dec 31."
      },
      {
        "name": "Chinook / Coho Salmon",
        "season": "Open all year (lower reach)",
        "limit": "S-5 / C-2",
        "notes": "Peak fall run Sept\u2013Nov. One of the most accessible salmon rivers near Toronto."
      }
    ],
    "special": [
      "Ganaraska River (CNR right-of-way to Lake Ontario): open all year for all salmonids",
      "Aggregate trout & salmon limit: S-5 / C-2 combined",
      "Southern Bait Management Zone",
      "Jocelyn St bridge to CNR: closed Sept. 1 \u2013 Oct. 14; open 4th Sat. April \u2013 Aug. 31 and Oct. 15 \u2013 Dec. 31",
      "Hwy 401 to Jocelyn St bridge (Corbetts Dam): fish sanctuary closed all year",
      "Check Ganaraska Region CA for current access"
    ]
  },
  "Beaver River": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Inland reaches above Thornbury Dam. Standard FMZ 16 season."
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30; extended fall season (Thornbury Dam to Georgian Bay)",
        "limit": "S-5 / C-2",
        "notes": "Thornbury Dam to Georgian Bay: extended season open 4th Sat. April to Dec. 31."
      },
      {
        "name": "Rainbow Trout (Steelhead)",
        "season": "4th Sat. April \u2013 Sept. 30; open all year (lower near Georgian Bay)",
        "limit": "S-2 / C-1",
        "notes": "Lower river and Georgian Bay mouth area regulations may differ."
      },
      {
        "name": "Chinook / Coho Salmon",
        "season": "Open all year (lower, Georgian Bay tributaries)",
        "limit": "S-5 / C-2",
        "notes": "Georgian Bay mouth area open all year for Pacific Salmon."
      }
    ],
    "special": [
      "Thornbury Dam to Georgian Bay: open 4th Sat. April \u2013 Dec. 31 (extended fall)",
      "Zone 13/14 regulations may apply at the Georgian Bay mouth. Check your exact location",
      "Southern Bait Management Zone",
      "Beaver River at Kimberley: standard Zone 16 seasons apply to inland reaches"
    ]
  },
  "Saugeen River": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Headwaters and upper tributaries. Standard FMZ 16 season."
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Standard Zone 16 seasons. Extended fall season may apply to lower reaches toward Lake Huron."
      },
      {
        "name": "Rainbow Trout (Steelhead)",
        "season": "4th Sat. April \u2013 Sept. 30; open all year (near Lake Huron)",
        "limit": "S-2 / C-1",
        "notes": "Lake Huron tributaries Zone 13 regulations apply to the mouth area."
      },
      {
        "name": "Chinook / Coho Salmon",
        "season": "Open all year (lower, near Lake Huron)",
        "limit": "S-5 / C-2",
        "notes": "Exceptional fall Chinook and Coho runs. Zone 13 applies at Lake Huron end."
      }
    ],
    "special": [
      "Denny's Dam section: sanctuary closed to night fishing Oct. 1\u2013Oct. 31",
      "Maple Hill Dam section: fish sanctuary closed all year",
      "Zone 13 (Lake Huron) regulations apply at the river mouth. Check which zone you are in",
      "Southern Bait Management Zone inland",
      "Aggregate trout & salmon limit: S-5 / C-2 combined"
    ]
  },
  "Sixteen Mile Creek": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30 (zone-wide)",
        "limit": "S-5 / C-2",
        "notes": ""
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30; open all year (Hwy 2 to Lake Ontario)",
        "limit": "S-5 / C-2",
        "notes": "Lower reach (Oakville, Hwy 2 to Lake): open all year. Extended opportunity."
      },
      {
        "name": "Rainbow Trout (Steelhead)",
        "season": "Open all year (lower reach to Lake Ontario)",
        "limit": "S-2 / C-1",
        "notes": "Best in spring (steelhead) and fall. Lower reach open all year."
      },
      {
        "name": "Chinook / Coho Salmon",
        "season": "Open all year (lower reach)",
        "limit": "S-5 / C-2",
        "notes": "Fall run (Sept\u2013Nov) is the primary draw."
      }
    ],
    "special": [
      "Sixteen Mile Creek and tributaries (Hwy 2 to Hwy 407): open 4th Sat. April \u2013 Dec. 31 (extended fall season)",
      "Lower reach (Hwy 2 to Lake Ontario): open all year for Atlantic/Brown/Rainbow/Pacific Salmon",
      "Southern Bait Management Zone",
      "Aggregate trout & salmon limit: S-5 / C-2 combined"
    ]
  },
  "Rouge River": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30; open all year (Hwy 2 to Lake Ontario)",
        "limit": "S-5 / C-2",
        "notes": "Rouge River (Hwy 2/Kingston Rd. to Lake Ontario) open all year."
      },
      {
        "name": "Rainbow Trout (Steelhead)",
        "season": "Open all year (lower reach)",
        "limit": "S-2 / C-1",
        "notes": "Extended season applies in the lower Rouge."
      },
      {
        "name": "Chinook / Coho Salmon",
        "season": "Open all year (lower reach)",
        "limit": "S-5 / C-2",
        "notes": "Fall run (Sept\u2013Nov) is peak. Lower reach open all year."
      }
    ],
    "special": [
      "Rouge River (Kingston Rd. to Lake Ontario, City of Toronto): open all year for salmonids",
      "Rouge River (Kingston Rd. to Hwy 407): open 4th Sat. April \u2013 Dec. 31 (extended fall season)",
      "Rouge National Urban Park: check Parks Canada for any extra access restrictions",
      "Aggregate trout & salmon limit: S-5 / C-2 combined",
      "Southern Bait Management Zone"
    ]
  },
  "Wilmot Creek": {
    "zone": "FMZ 17",
    "species": [
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30 (zone-wide)",
        "limit": "S-2 / C-1",
        "notes": "Zone 17 brook trout limit is S-2 / C-1."
      },
      {
        "name": "Rainbow Trout (Steelhead)",
        "season": "4th Sat. April \u2013 Sept. 30; open all year (lower reach south of CNR)",
        "limit": "S-2 / C-1",
        "notes": "Durham Region waters between CNR and Lake Ontario open all year."
      },
      {
        "name": "Chinook / Coho Salmon",
        "season": "Open all year (lower reach)",
        "limit": "S-5 / C-2",
        "notes": "Best in fall Oct\u2013Nov."
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Resident fish in upper reaches."
      }
    ],
    "special": [
      "Durham Region waters between Hwy 2 and the CNR: open 4th Sat. April \u2013 Dec. 31 (extended fall season)",
      "Durham Region, all waters between the CNR right-of-way and Lake Ontario: open all year",
      "Aggregate trout & salmon limit: S-5 / C-2 combined",
      "Southern Bait Management Zone"
    ]
  },
  "Bowmanville Creek": {
    "zone": "FMZ 17",
    "species": [
      {
        "name": "Rainbow Trout (Steelhead)",
        "season": "4th Sat. April \u2013 Sept. 30; open all year (lower reach)",
        "limit": "S-2 / C-1",
        "notes": "Durham Region lower reach open all year."
      },
      {
        "name": "Chinook / Coho Salmon",
        "season": "Open all year (lower reach)",
        "limit": "S-5 / C-2",
        "notes": "Fall Chinook & Coho Oct\u2013Nov is peak season."
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Upper creek resident fish."
      }
    ],
    "special": [
      "Durham Region waters between Hwy 2 and the CNR: open 4th Sat. April \u2013 Dec. 31 (extended fall season)",
      "Durham Region waters between CNR and Lake Ontario: open all year",
      "Aggregate trout & salmon limit: S-5 / C-2 combined",
      "Southern Bait Management Zone"
    ]
  },
  "Speed River": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Standard Zone 16 regulations apply to the Speed River through Guelph."
      },
      {
        "name": "Rainbow Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-2 / C-1",
        "notes": "Standard Zone 16 regulations."
      },
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Upper Speed River may have additional restrictions."
      }
    ],
    "special": [
      "Standard Zone 16 trout seasons apply",
      "Southern Bait Management Zone",
      "Aggregate trout & salmon limit: S-5 / C-2 combined",
      "Check GRCA for any local waterbody exceptions on the Speed"
    ]
  },
  "Eramosa River": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Rainbow Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-2 / C-1",
        "notes": ""
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Standard Zone 16 regulations. The river stays cold, so it fishes through the whole season."
      },
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Wild brook trout in upper reaches. Handle carefully."
      }
    ],
    "special": [
      "Standard Zone 16 trout seasons apply",
      "Rockwood Conservation Area: check Conservation Halton for any local rules",
      "Southern Bait Management Zone",
      "Wild brook trout present. Catch and release strongly encouraged"
    ]
  },
  "Black Creek": {
    "zone": "FMZ 16",
    "species": [
      {
        "name": "Chinook / Coho Salmon",
        "season": "4th Sat. April \u2013 Sept. 30 (zone-wide)",
        "limit": "S-5 / C-2",
        "notes": "Pacific salmon count toward the S-5 / C-2 trout and salmon aggregate."
      },
      {
        "name": "Brown Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Standard Zone 16 regulations apply."
      },
      {
        "name": "Brook Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-5 / C-2",
        "notes": "Wild brook trout. Catch & release strongly recommended for this fragile population."
      },
      {
        "name": "Rainbow Trout",
        "season": "4th Sat. April \u2013 Sept. 30",
        "limit": "S-2 / C-1",
        "notes": "Some rainbow trout present."
      }
    ],
    "special": [
      "Standard Zone 16 trout seasons apply",
      "Southern Bait Management Zone",
      "Wild brook trout present. Catch and release strongly recommended",
      "No real-time gauge. Contact TRCA for conditions"
    ]
  }
};
function getRiverRegs(riverName) {
  if (!riverName) return null;
  var name = riverName.split(",")[0].trim();
  if (RIVER_REGS[name]) return RIVER_REGS[name];
  if (name.indexOf(" \u2014 ") !== -1) {
    var p1 = name.split(" \u2014 ")[0].trim();
    if (RIVER_REGS[p1]) return RIVER_REGS[p1];
  }
  var stripped = name.replace(/^(Upper|Middle|Lower-Mid|Lower|Mid)\s+/i, "").replace(/\s*\([^)]*\)\s*$/, "").trim();
  if (RIVER_REGS[stripped]) return RIVER_REGS[stripped];
  if (!/river|creek/i.test(stripped)) {
    var withRiver = stripped + " River";
    if (RIVER_REGS[withRiver]) return RIVER_REGS[withRiver];
  }
  var riverMatch = stripped.match(/^(.+?(?:River|Creek|Brook))/i);
  if (riverMatch) {
    var coreRiver = riverMatch[1].trim();
    if (RIVER_REGS[coreRiver]) return RIVER_REGS[coreRiver];
  }
  return null;
}
__name(getRiverRegs, "getRiverRegs");
var ACCESS_COORDS = {
  "Upper Grand River (Tailwater)": [
    { lat: 43.7073, lng: -80.3767 },
    // Fergus Pool · Below Shand Dam
    { lat: 43.6812, lng: -80.4312 },
    // Elora Gorge
    { lat: 43.691044, lng: -80.412394 },
    // Racquet Club
    { lat: 43.690579, lng: -80.39624 },
    // The Trestle
    { lat: 43.624724, lng: -80.447657 },
    // Wilson
    { lat: 43.6789, lng: -80.4334 },
    // Irvine Creek Confluence
    { lat: 43.6823, lng: -80.4289 }
    // Elora Gorge Conservation Area
  ],
  "Lower Grand River": [
    { lat: 43.0734, lng: -79.9543 },
    // Caledonia · Argyle Street Access
    { lat: 42.9034, lng: -79.6189 }
    // Dunnville · Lower Grand
  ],
  "Upper Credit River": [
    { lat: 43.8851, lng: -80.0456 },
    // Upper Credit Conservation Area
    { lat: 43.7935, lng: -80.0023 },
    // Belfountain Conservation Area
    { lat: 43.7994, lng: -80.0289 },
    // Forks of the Credit Provincial Park
    { lat: 43.8098, lng: -79.982 }
    // Belfountain to Inglewood Reach
  ],
  "Middle Credit River": [
    { lat: 43.6473977, lng: -79.8569259 },
    // McNab Park
    { lat: 43.5868, lng: -79.7158 }
    // Streetsville Road Allowances
  ],
  "Lower Credit River": [
    { lat: 43.5465, lng: -79.6587 },
    // Erindale Park
    { lat: 43.5489787, lng: -79.5837633 }
    // Credit River Mouth · Port Credit  [mouth]
  ],
  "Bronte Creek \u2014 Lower Estuary & Mouth": [
    { lat: 43.3934, lng: -79.7234 },
    // Bronte Harbour / Pier  [mouth]
    { lat: 43.3956, lng: -79.7267 },
    // Petro-Canada Park (Petro Park)
    { lat: 43.3919, lng: -79.7134 }
    // Below Lakeshore Road West
  ],
  "Bronte Creek \u2014 Mid-Section & Provincial Park": [
    { lat: 43.4423, lng: -79.7567 },
    // Bronte Creek Provincial Park
    { lat: 43.4912, lng: -79.7934 }
    // Lowville Park
  ],
  "Bronte Creek \u2014 Upper Headwaters": [
    { lat: 43.3993, lng: -79.9581 },
    // Progreston Area · Road Allowances
    { lat: 43.3907, lng: -79.9843 }
    // Carlisle Reach
  ],
  "Lower Humber River": [
    { lat: 43.6267, lng: -79.4734 },
    // Humber River Mouth · Humber Bay Park  [mouth]
    { lat: 43.6523, lng: -79.5123 }
    // Humber Valley Heritage Trail · Lower
  ],
  "Lower-Mid Humber (Old Mill to Eglinton)": [
    { lat: 43.6634, lng: -79.5123 },
    // Etienne Brûlé Park
    { lat: 43.6756, lng: -79.5034 }
    // Scarlett Mills Park
  ],
  "Upper Humber River (Headwaters)": [
    { lat: 43.9368, lng: -79.8634 },
    // Upper Humber · Mono / Orangeville Area
    { lat: 43.8756, lng: -79.7312 }
    // Humber River · Bolton Reach
  ],
  "Nottawasaga River \u2014 Headwaters (Niagara Escarpment)": [
    { lat: 44.3114, lng: -79.8625 },
    // Bruce Trail Access Points · Upper Notty
    { lat: 44.0595, lng: -79.8104 }
    // Headwaters - Road Allowances
  ],
  "Nottawasaga River \u2014 Middle Section (Alliston to Angus)": [
    { lat: 44.1534, lng: -79.8712 },
    // Alliston · Main River Access
    { lat: 44.2123, lng: -79.9034 },
    // Pine River Confluence
    { lat: 44.1721, lng: -79.8131 },
    // Boyne River Confluence
    { lat: 44.2567, lng: -79.9456 }
    // Nicholson Dam / Essa Township Sanctuary
  ],
  "Nottawasaga River \u2014 Lower Section (Boyne to Wasaga Beach)": [
    { lat: 44.3325, lng: -79.8782 },
    // McKinnon Road Access Point
    { lat: 44.5212, lng: -80.0167 }
    // Wasaga Beach · River Mouth (Georgian Bay)
  ],
  "Duffins Creek \u2014 Lower Section": [
    { lat: 43.8378, lng: -79.0289 },
    // Rotary Park
    { lat: 43.8334, lng: -79.0312 },
    // Duffins Creek Marsh  [mouth]
    { lat: 43.8396, lng: -79.0406 }
    // Below CNR Railway Line
  ],
  "Duffins Creek \u2014 Middle Section": [
    { lat: 43.9023, lng: -79.0934 },
    // Greenwood Conservation Area
    { lat: 43.9156, lng: -79.1234 }
    // Whitevale · Below Dam
  ],
  "Duffins Creek \u2014 Upper Reaches": [
    { lat: 43.9567, lng: -79.1456 },
    // Glen Major · Seaton Hiking Trail
    { lat: 43.9205, lng: -79.1206 }
    // West Duffins Headwaters
  ],
  "Ganaraska River \u2014 Lower (Lake to CNR Bridge)": [
    { lat: 43.9423674, lng: -78.290492 },
    // Port Hope Harbour · River Mouth  [mouth]
    { lat: 43.9545, lng: -78.2956 }
    // Below CNR Railway Bridge
  ],
  "Ganaraska River \u2014 Port Hope Sanctuary": [
    { lat: 43.9612, lng: -78.2934 },
    // Jocelyn Street Bridge Access
    { lat: 43.946, lng: -78.299 }
    // Port Hope Town Section · Sanctuary Area
  ],
  "Ganaraska River \u2014 Upper & Conservation Areas": [
    { lat: 44.0234, lng: -78.3456 },
    // Ganaraska Millennium Conservation Area
    { lat: 44.0512, lng: -78.3789 },
    // Sylvan Glen Conservation Area
    { lat: 44.0097, lng: -78.3705 }
    // Thurne Parks
  ],
  "Lower Beaver River (Thornbury)": [
    { lat: 44.5623, lng: -80.4523 },
    // Thornbury · Lower River / Harbour
    { lat: 44.5634, lng: -80.4512 }
    // Thornbury Fishway
  ],
  "Middle Beaver River (Clarksburg to Heathcote)": [
    { lat: 44.4925, lng: -80.4912 }
    // Below Kimberley · Mid-Beaver
  ],
  "Upper Beaver River (Kimberley)": [
    { lat: 44.49, lng: -80.4 }
    // Kimberley · Village Reach
  ],
  "Saugeen River \u2014 Headwaters & Upper Tributaries": [
    { lat: 44.2302, lng: -80.8324 },
    // Rocky Saugeen · Public Access
    { lat: 44.285, lng: -80.91 },
    // North Saugeen River
    { lat: 44.155, lng: -80.945 }
    // South Saugeen River
  ],
  "Saugeen River \u2014 Lower Main Stem (Paisley to Southampton)": [
    { lat: 44.2934, lng: -81.2123 },
    // Denny
    { lat: 44.5034, lng: -81.3712 }
    // Southampton · Lake Huron Mouth
  ],
  "Sixteen Mile Creek \u2014 Lower Reaches & Oakville Harbour": [
    { lat: 43.4378, lng: -79.6823 },
    // Lakeside Park · Creek Mouth
    { lat: 43.4423, lng: -79.6867 }
    // Tannery Park
  ],
  "Sixteen Mile Creek \u2014 Middle Reaches & Main Valley": [
    { lat: 43.4712, lng: -79.7034 },
    // Lions Valley Park
    { lat: 43.4545, lng: -79.73 }
    // Rebecca Street to Dundas Street Reach
  ],
  "Sixteen Mile Creek \u2014 Upper West Branch (Trout)": [
    { lat: 43.5427, lng: -79.813 },
    // West Branch · Road Allowance Crossings
    { lat: 43.5949, lng: -79.9082 }
    // Upper West Branch Tributaries
  ],
  "Rouge River \u2014 Marsh & Mouth (Lake Ontario)": [
    { lat: 43.8034, lng: -79.1312 },
    // Rouge Beach · River Mouth  [mouth]
    { lat: 43.8056, lng: -79.1323 }
    // CNR Railway Bridge Area
  ],
  "Rouge River \u2014 Mid-Section (Rouge National Urban Park)": [
    { lat: 43.8289, lng: -79.1456 },
    // Rouge National Urban Park · Main Access
    { lat: 43.8178, lng: -79.1389 },
    // Kingston Road (Hwy 2) Bridge Area
    { lat: 43.8178, lng: -79.1823 }
    // Toronto Zoo Valley
  ],
  "Rouge River \u2014 Upper & Milne Dam (Markham)": [
    { lat: 43.8645, lng: -79.2734 },
    // Milne Dam Conservation Park
    { lat: 43.881, lng: -79.249 }
    // Toogood Pond Area
  ],
  "Wilmot Creek \u2014 Mouth & Marsh (Lake Ontario)": [
    { lat: 43.9123, lng: -78.5978 }
    // Sir Samuel Wilmot Nature Area  [mouth]
  ],
  "Wilmot Creek \u2014 Lower River (to CN Rail Tracks)": [
    { lat: 43.9234, lng: -78.5923 },
    // Nature Preserve Trails · Lower Creek
    { lat: 43.9053, lng: -78.6011 }
    // CN Railway Track Crossing
  ],
  "Wilmot Creek \u2014 Middle Section (Hwy 401 to Hwy 2)": [
    { lat: 43.9099, lng: -78.608 }
    // Newcastle · Highway 401 to Highway 2 Reach
  ],
  "Wilmot Creek \u2014 Upper Watershed & Orono Crown Lands": [
    { lat: 43.9856, lng: -78.6234 },
    // Orono Crown Lands
    { lat: 44.0258, lng: -78.6494 }
    // Upper Wilmot Tributaries
  ],
  "Bowmanville Creek \u2014 River Mouth & Piers": [
    { lat: 43.8934, lng: -78.6923 },
    // Bowmanville Marina Pier
    { lat: 43.8893, lng: -78.664 }
    // Creek Mouth · East Bank
  ],
  "Lower Bowmanville Creek": [
    { lat: 43.9056, lng: -78.6867 },
    // Baseline Road Bridge · Parking Lot
    { lat: 43.8956, lng: -78.6775 }
    // CNR Railway Bridge · South Side
  ],
  "Middle Bowmanville Creek (Fish Ladder)": [
    { lat: 43.9134, lng: -78.6812 },
    // Bowmanville Valley Trail Access
    { lat: 43.908, lng: -78.682 }
    // Goodyear Dam Lower Pools
  ],
  "Upper Bowmanville Creek": [
    { lat: 43.9864, lng: -78.7327 },
    // Upper Creek · Road Allowance Crossings
    { lat: 44.005, lng: -78.76 },
    // Oak Ridges Moraine Headwaters
    { lat: 44.0173, lng: -78.7808 }
    // Headwaters near Enniskillen
  ],
  "Speed River \u2014 Upper (Above Guelph Lake)": [
    { lat: 43.6281, lng: -80.1861 },
    // Wellington County Road Bridge Crossings
    { lat: 43.6234, lng: -80.2056 }
    // Guelph Lake Reservoir Inflow
  ],
  "Eramosa River \u2014 Upper Headwaters (Above Rockwood)": [
    { lat: 43.6617, lng: -80.1533 },
    // Municipal Road Bridge Crossings · Upper
    { lat: 43.7106, lng: -80.2399 }
    // Headwaters Tributaries
  ],
  "Eramosa River \u2014 Mid-Section (Rockwood to Eden Mills)": [
    { lat: 43.6123, lng: -80.1523 },
    // Rockwood Conservation Area
    { lat: 43.5756, lng: -80.1834 }
    // Eden Mills · Lower Mid-Section
  ],
  "Black Creek \u2014 Upper Reaches (Vaughan to North York)": [
    { lat: 43.763, lng: -79.5071 },
    // Black Creek Parkland · Upper
    { lat: 43.7434, lng: -79.4756 }
    // Downsview Park Area
  ],
  "Black Creek \u2014 Lower Watershed & Humber Confluence": [
    { lat: 43.6712, lng: -79.4934 },
    // Smythe Park
    { lat: 43.6634, lng: -79.4867 }
    // Humber Marshes · Black Creek Confluence
  ]
};
var LAKE_RUN_BROWN_WINDOWS = [
  { months: [9, 10], quality: "good", label: "Fall Run", note: "Lake-run browns push in as the water cools. Drift roe bags under a float." },
  { months: [11, 1], quality: "good", label: "Winter", note: "Lake-run browns hold over in the deeper pools through winter. Slow float with roe." },
  { months: [2, 3], quality: "good", label: "Spring Run", note: "A second push of lake-run browns in March and April, alongside the steelhead." },
  { months: [4, 7], quality: "absent", label: "Lake", note: "Lake-run browns are out in the lake. They enter the river in October and November." }
];
var LAKE_RUN_BROWN_SEPT = {
  early: { months: [8, 8], quality: "good", label: "Early Fall Run", note: "On the eastern rivers lake-run browns can start in September. Drift roe bags under a float." },
  late: { months: [8, 8], quality: "absent", label: "Lake", note: "Lake-run browns are out in the lake. They enter the river in October and November." }
};
function sectionBaseName(section) {
  return String(section || "").split(",")[0].trim();
}
__name(sectionBaseName, "sectionBaseName");
function isLakeRunBrownSection(section) {
  var c = RIVER_CONFIG[sectionBaseName(section)];
  var sp = c && c.species || [];
  if (!c || c.residentBrowns) return false;
  return sp.indexOf("Brown Trout") !== -1 && sp.some(function(n) {
    return n === "Steelhead" || n === "Chinook Salmon" || n === "Coho Salmon";
  });
}
__name(isLakeRunBrownSection, "isLakeRunBrownSection");
function lakeRunBrownWindows(section) {
  var regs = typeof getRiverRegs === "function" ? getRiverRegs(sectionBaseName(section)) : null;
  var fmz17 = !!(regs && regs.zone === "FMZ 17");
  return LAKE_RUN_BROWN_WINDOWS.concat([fmz17 ? LAKE_RUN_BROWN_SEPT.early : LAKE_RUN_BROWN_SEPT.late]);
}
__name(lakeRunBrownWindows, "lakeRunBrownWindows");
function getRiverConfig(riverName) {
  if (!riverName) return RIVER_CONFIG["default"];
  var name = riverName.split(",")[0].trim();
  var validKeys = getRiverConfig._keys || (getRiverConfig._keys = Object.keys(RIVER_CONFIG).filter(function(k2) {
    return k2 !== "default" && RIVER_CONFIG[k2] && RIVER_CONFIG[k2].lat !== void 0;
  }));
  if (validKeys.indexOf(name) !== -1 && RIVER_CONFIG[name] && RIVER_CONFIG[name].lat !== void 0) {
    return RIVER_CONFIG[name];
  }
  for (var i = 0; i < validKeys.length; i++) {
    var k = validKeys[i];
    if (name.toLowerCase().indexOf(k.toLowerCase()) !== -1 || k.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
      if (RIVER_CONFIG[k] && RIVER_CONFIG[k].lat !== void 0) return RIVER_CONFIG[k];
    }
  }
  return RIVER_CONFIG["default"];
}
__name(getRiverConfig, "getRiverConfig");
function clsFlow(f, cfg) {
  var lo = cfg ? cfg.flowLow : 6, mn = cfg ? cfg.sweetMin : 8, mx = cfg ? cfg.sweetMax : 12, hi = cfg ? cfg.flowHigh : 20;
  return f < lo ? "bad" : f < mn ? "warn" : f <= mx ? "good" : f <= hi ? "warn" : "bad";
}
__name(clsFlow, "clsFlow");
function clsTemp(t) {
  return t < TEMP_MIN - 2 ? "bad" : t < TEMP_MIN ? "warn" : t <= TEMP_MAX ? "good" : t < TEMP_STRESS ? "warn" : "bad";
}
__name(clsTemp, "clsTemp");
function clsSky(c) {
  return c >= 70 ? "good" : c >= 40 ? "warn" : "bad";
}
__name(clsSky, "clsSky");
var GROUNDWATER_C = 8.5;
var WATER_CURVE_MID = 12.5;
var WATER_MODEL_OVERRIDES = {
  "Lower Humber River": { gw: 0.05 },
  // urban runoff, warm
  "Black Creek \u2014 Lower Watershed & Humber Confluence": { gw: 0.05 },
  "Black Creek \u2014 Upper Reaches (Vaughan to North York)": { gw: 0.15 },
  "Upper Grand River (Tailwater)": { gw: 0.35, tau: 5 },
  // cold bottom release from the dam, not springs
  "Lower Grand River": { gw: 0.05, tau: 6 },
  // big, runoff-fed river
  // Bowmanville: small, short creek. TJ sees it cool faster than other rivers (unverified, no public data).
  "Bowmanville Creek \u2014 River Mouth & Piers": { tau: 3 },
  "Lower Bowmanville Creek": { tau: 3 },
  "Middle Bowmanville Creek (Fish Ladder)": { tau: 2.5 },
  "Upper Bowmanville Creek": { tau: 2 }
};
function waterModelParams(section) {
  var s = String(section || "").split(",")[0].trim();
  var p;
  if (/mouth|harbour|estuary|marsh|pier/i.test(s)) p = { gw: 0.1, tau: 5 };
  else if (/lower-mid|middle|mid-/i.test(s)) p = { gw: 0.25, tau: 4 };
  else if (/lower/i.test(s)) p = { gw: 0.15, tau: 5 };
  else if (/upper|headwater/i.test(s)) p = { gw: 0.4, tau: 3 };
  else p = { gw: 0.25, tau: 4 };
  var o = WATER_MODEL_OVERRIDES[s];
  if (o) {
    if (o.gw != null) p.gw = o.gw;
    if (o.tau != null) p.tau = o.tau;
  }
  return p;
}
__name(waterModelParams, "waterModelParams");
function modelWaterTemp(series, p) {
  var vals = (series || []).filter(function(t) {
    return t != null && !isNaN(t);
  });
  if (vals.length < 7) return null;
  var k = 1 - Math.exp(-1 / p.tau);
  var a = vals.slice(0, 7).reduce(function(x, y) {
    return x + y;
  }, 0) / 7;
  var w = null;
  vals.forEach(function(t) {
    a += (t - a) * k;
    var surf = 26 / (1 + Math.exp(0.18 * (WATER_CURVE_MID - a)));
    var target = p.gw * GROUNDWATER_C + (1 - p.gw) * surf;
    w = w == null ? target : Math.max(w - 1.5, Math.min(w + 1.5, target));
  });
  return Math.round(Math.max(0, w) * 10) / 10;
}
__name(modelWaterTemp, "modelWaterTemp");
var SPECIES_SEASONS = {
  "Brown Trout": {
    latin: "Salmo trutta",
    type: "resident",
    // Resident year-round but feeding windows are seasonal
    windows: [
      { months: [3, 4], quality: "peak", label: "Spring", note: "Post-ice-off, active feeding. Best dry fly and nymph of the year." },
      { months: [5, 5], quality: "good", label: "June", note: "Good early season. Evenings best before summer heat." },
      { months: [6, 7], quality: "slow", label: "Summer", note: "Heat stress risk above 18\xB0C. Early morning only. Consider C&R moratorium." },
      { months: [8, 9], quality: "peak", label: "Fall", note: "Feeding ramps up. Streamers and nymphs. Best streamer fishing of the year." },
      { months: [10, 10], quality: "good", label: "Late Fall", note: "Still active but slowing. Slow nymphing near bottom." },
      { months: [11, 2], quality: "slow", label: "Winter", note: "Lethargic. Very slow nymph on the bottom. Closed season most sections." }
    ]
  },
  "Rainbow Trout": {
    latin: "Oncorhynchus mykiss",
    type: "resident",
    windows: [
      { months: [3, 5], quality: "peak", label: "Spring", note: "Resident rainbow active post-steelhead season. Nymphs and emerging dries." },
      { months: [5, 6], quality: "good", label: "Late Spring", note: "Good evening dry fly fishing. Find fish in riffles and runs." },
      { months: [6, 7], quality: "slow", label: "Summer", note: "Seek cold headwaters. Early morning essential above 18\xB0C." },
      { months: [8, 9], quality: "good", label: "Fall", note: "Resident fish feeding hard pre-winter. Nymphs and streamers." },
      { months: [10, 11], quality: "slow", label: "Late Fall", note: "Cooling water slows residents. Fish deep slow pools." },
      { months: [11, 2], quality: "slow", label: "Winter", note: "Very slow. Residents hold in deepest pools. Closed most sections." }
    ]
  },
  "Steelhead": {
    latin: "Oncorhynchus mykiss (anadromous)",
    type: "migratory",
    windows: [
      { months: [2, 4], quality: "peak", label: "Spring Run", note: "Peak spring steelhead run from Lake Ontario and Georgian Bay. Best of the year." },
      { months: [5, 8], quality: "absent", label: "Lake", note: "Steelhead have dropped back to the lake. Target resident rainbow instead." },
      { months: [9, 10], quality: "good", label: "Fall Return", note: "Early steelhead begin entering rivers. Numbers build through October." },
      { months: [11, 1], quality: "good", label: "Winter Run", note: "Winter steelhead in larger rivers. Slow float with roe or beads. Hardy angling." }
    ]
  },
  "Brook Trout": {
    latin: "Salvelinus fontinalis",
    type: "resident",
    windows: [
      { months: [3, 5], quality: "peak", label: "Spring", note: "Best brook trout season. Post-ice-off feeding frenzy. Dry fly and small nymphs." },
      { months: [5, 6], quality: "good", label: "Late Spring", note: "Still active. Small dry flies and midges in evenings." },
      { months: [7, 8], quality: "slow", label: "Summer", note: "Heat sensitive. Only cold spring-fed streams are productive. Early morning essential." },
      { months: [8, 10], quality: "peak", label: "Fall", note: "Fall spawning colours. Active feeding pre-spawn. Most beautiful time of year." },
      { months: [10, 11], quality: "good", label: "Spawn", note: "Spawning activity. Handle with care. Some sections closed." },
      { months: [11, 2], quality: "slow", label: "Winter", note: "Cold water reduces activity. Closed season most sections." }
    ]
  },
  "Chinook Salmon": {
    latin: "Oncorhynchus tshawytscha",
    type: "migratory",
    windows: [
      { months: [0, 6], quality: "absent", label: "In Lake", note: "Chinook in Lake Ontario / Georgian Bay. Not accessible from rivers." },
      { months: [7, 7], quality: "slow", label: "Harbour Mouth", note: "Early Chinook staging near harbour mouths in late July\u2013August. A few enter rivers mid-August." },
      { months: [8, 8], quality: "good", label: "Early Run", note: "Chinook entering rivers through September. Numbers building toward peak." },
      { months: [9, 9], quality: "peak", label: "Peak Run", note: "Peak Chinook run. Best of the year. Fish stacked in pools." },
      { months: [10, 10], quality: "good", label: "Late Run", note: "Run tapering. Spawned-out fish. Still worth fishing early October." },
      { months: [11, 11], quality: "slow", label: "Post-Spawn", note: "Run over. Occasional late fish. Most have spawned out." }
    ]
  },
  "Coho Salmon": {
    latin: "Oncorhynchus kisutch",
    type: "migratory",
    windows: [
      { months: [0, 8], quality: "absent", label: "In Lake", note: "Coho in Lake Ontario. Not accessible from rivers." },
      { months: [9, 9], quality: "good", label: "Early Run", note: "Coho enter rivers October. Bright fish, aggressive fighters." },
      { months: [10, 10], quality: "peak", label: "Peak Run", note: "Peak Coho run. More willing to take flies and lures than Chinook." },
      { months: [11, 11], quality: "good", label: "Late Run", note: "Late Coho still in system. Slowing but fish present." }
    ]
  }
};
function getCurrentSeason(speciesName2, dateStr, section) {
  var now = dateStr ? /* @__PURE__ */ new Date(dateStr + "T12:00:00") : /* @__PURE__ */ new Date();
  var month = now.getMonth();
  var data = SPECIES_SEASONS[speciesName2];
  if (!data) return null;
  var windows = data.windows;
  if (speciesName2 === "Brown Trout") {
    var sec = section !== void 0 ? section : typeof selectedRiver !== "undefined" ? selectedRiver : null;
    if (sec && isLakeRunBrownSection(sec)) windows = lakeRunBrownWindows(sec);
  }
  for (var i = 0; i < windows.length; i++) {
    var w = windows[i];
    var start = w.months[0], end = w.months[1];
    if (start <= end) {
      if (month >= start && month <= end) return w;
    } else {
      if (month >= start || month <= end) return w;
    }
  }
  return windows[0];
}
__name(getCurrentSeason, "getCurrentSeason");
function liveConditionsScore(flow, sweetMin, sweetMax, flowLow, flowHigh, tempC, cloudPct) {
  var s = 0;
  if (flow != null) {
    if (flow >= sweetMin && flow <= sweetMax) s += 5;
    else if (flow >= flowLow && flow <= flowHigh) s += 0;
    else s -= 4;
  }
  if (tempC != null) {
    if (tempC >= 8 && tempC <= 14) s += 3;
    else if (tempC >= 4 && tempC < 8) s += 1;
    else if (tempC > 14 && tempC <= 18) s += 1;
    else s -= 3;
  }
  if (cloudPct != null) {
    if (cloudPct >= 60) s += 2;
    else if (cloudPct >= 30) s += 1;
  }
  return s;
}
__name(liveConditionsScore, "liveConditionsScore");
function scoreToConfidence(score) {
  if (score >= 10) return { label: "\u2605\u2605\u2605", stars: 3, cls: "conf-excellent", word: "Excellent" };
  if (score >= 6) return { label: "\u2605\u2605\u2606", stars: 2, cls: "conf-good", word: "Good" };
  if (score >= 2) return { label: "\u2605\u2606\u2606", stars: 1, cls: "conf-marginal", word: "Marginal" };
  return { label: "\u2606\u2606\u2606", stars: 0, cls: "conf-tough", word: "Tough" };
}
__name(scoreToConfidence, "scoreToConfidence");
var LIVE_WATER_STATIONS = {
  "Lower Credit River": { station: "Credit River at Mississaugua Golf and Country Club", place: "Mississauga" },
  "Middle Credit River": { station: "Credit River at Old Derry Road", place: "Meadowvale" },
  "Upper Credit River": { station: "Credit River at Cataract Falls", place: "Cataract" }
};
function salmonMethodMode(opts) {
  opts = opts || {};
  var speciesKey = opts.speciesKey || null;
  var fam = opts.fam || "";
  var cfg = opts.cfg || null;
  var staging = !!opts.stagingModeActive;
  var blocked = !!opts.migratoryBlocked;
  var section = opts.section !== void 0 ? opts.section : typeof selectedRiver !== "undefined" ? selectedRiver : null;
  var dateStr = opts.dateStr || (typeof getTripDateStr === "function" ? getTripDateStr() : null);
  var isSalmon = speciesKey === "chinook" || speciesKey === "coho";
  var isSteelhead = speciesKey === "steelhead" || speciesKey === "brown" && !!section && isLakeRunBrownSection(section);
  if (!isSalmon && !isSteelhead) return null;
  if (fam === "fly") return null;
  if (blocked) return null;
  if (cfg && cfg.artificialOnly) return null;
  if (fam === "spin" && typeof mouthPreferenceFor === "function") {
    var _nm = { chinook: "Chinook Salmon", coho: "Coho Salmon", steelhead: "Steelhead" }[speciesKey];
    if (_nm && mouthPreferenceFor(_nm, dateStr) > 0) return null;
  }
  if (isSteelhead) return fam === "spin" ? "spin-float" : "float";
  if (staging) return "spin";
  return fam === "spin" ? "spin-float" : "float";
}
__name(salmonMethodMode, "salmonMethodMode");
var SALMON_MODE_METHOD = {
  spin: "Throwing spoons at the river mouth",
  float: "Float Fishing \xB7 Roe & Beads"
};
function bringPhraseFor(topMethod, spinFloat) {
  var methodPhrase = String(topMethod || "").toLowerCase();
  if (/^spinning\s*[—·]/i.test(topMethod)) return "spinning gear with spoons & lures";
  if (spinFloat && /float/i.test(topMethod)) return "spinning rod with float gear";
  if (/^float fishing\s*[—·]\s*roe/i.test(topMethod)) return "centrepin or spinning rod with float gear";
  if (/nymphing|dry fly|streamer|midge/i.test(topMethod)) return "fly rod and " + methodPhrase + " setup";
  if (/spinner|spoon|crankbait|jig|lure|plug/i.test(topMethod)) return "spinning gear and " + methodPhrase;
  if (/float/i.test(topMethod)) return "centrepin or spinning rod with a float and bait";
  if (/bait|drift/i.test(topMethod)) return "spinning rod with bait";
  return methodPhrase + " gear";
}
__name(bringPhraseFor, "bringPhraseFor");
function stagingRead(sectionName, dateStr, wantsSalmon, wantsSteelhead, lakeTemp, cloudPct, windDir, windSpd) {
  var zone = STAGING_ZONES[sectionName];
  if (!zone || !wantsSalmon && !wantsSteelhead) return null;
  var now = dateStr ? /* @__PURE__ */ new Date(dateStr + "T12:00:00") : /* @__PURE__ */ new Date();
  var month = now.getMonth(), day = now.getDate();
  var groupKey = STAGING_GROUP[zone.key] || "central";
  var mouthFaces = zone.lake === "Georgian Bay" ? 0 : 180;
  var tempIsEstimate = false;
  if (lakeTemp == null) {
    lakeTemp = seasonalLakeTempEst(zone.lake, now.getMonth());
    tempIsEstimate = true;
  }
  var salmonPhase = wantsSalmon ? getSalmonPhase(groupKey, month, day) : { active: false };
  var steelPhase = wantsSteelhead ? getSteelheadPhase(month, day, lakeTemp) : { active: false };
  var which, phase, species;
  if (salmonPhase.active && (!steelPhase.active || salmonPhase.intensity >= steelPhase.intensity)) {
    which = "salmon";
    phase = salmonPhase;
    species = "Salmon";
  } else if (steelPhase.active) {
    which = "steelhead";
    phase = steelPhase;
    species = "Steelhead";
  } else {
    return null;
  }
  var res = computeStagingScore(lakeTemp, windDir, windSpd, cloudPct, phase.intensity, mouthFaces, tempIsEstimate);
  return {
    zone,
    groupKey,
    lakeTemp,
    tempIsEstimate,
    salmonPhase,
    steelPhase,
    which,
    phase,
    species,
    res,
    pct: Math.round(res.score * 100)
  };
}
__name(stagingRead, "stagingRead");
function waterTempFromHistory(section, hist, dateStr, todayStr, liveVal) {
  if (!hist) return null;
  var p = waterModelParams(String(section || "").split(",")[0].trim());
  var seriesTo = /* @__PURE__ */ __name(function(d) {
    var i = hist.time.indexOf(d);
    return i === -1 ? null : hist.mean.slice(0, i + 1);
  }, "seriesTo");
  var model = modelWaterTemp(seriesTo(dateStr), p);
  if (model == null) return null;
  if (liveVal != null && todayStr) {
    var mToday = modelWaterTemp(seriesTo(todayStr), p);
    var days = Math.round((/* @__PURE__ */ new Date(dateStr + "T12:00:00") - /* @__PURE__ */ new Date(todayStr + "T12:00:00")) / 864e5);
    if (mToday != null && days > 0) model = Math.round((model + (liveVal - mToday) * Math.exp(-days / 4)) * 10) / 10;
  }
  return model;
}
__name(waterTempFromHistory, "waterTempFromHistory");
function stagingSectionFor(sectionName) {
  var base = String(sectionName || "").split(",")[0].trim();
  var zone = stagingZoneForSection(base);
  if (!zone) return null;
  var secCfg = RIVER_CONFIG[base];
  var secSpecies = secCfg && secCfg.species || [];
  var MIG = ["Chinook Salmon", "Coho Salmon", "Steelhead"];
  var hasMig = secSpecies.some(function(s) {
    return MIG.indexOf(s) !== -1;
  });
  if (!hasMig && secSpecies.length) return null;
  return zone;
}
__name(stagingSectionFor, "stagingSectionFor");
function sectionSeasonScore(sectionName, targetSpeciesNames, dateStr, seasonSection) {
  var cfg = getRiverConfig(sectionName);
  var score = 0;
  var notes = [];
  var warnings = [];
  targetSpeciesNames = targetSpeciesNames || [];
  var targetSpeciesName = targetSpeciesNames.length === 1 ? targetSpeciesNames[0] : null;
  var hasSpecies = targetSpeciesNames.length === 0 || targetSpeciesNames.some(function(n) {
    return cfg.species && cfg.species.indexOf(n) !== -1;
  });
  if (!hasSpecies) {
    score -= 20;
    warnings.push(targetSpeciesName + " not on this river");
  }
  var _MIG = ["Chinook Salmon", "Coho Salmon", "Steelhead"];
  var _isMigTarget = targetSpeciesName && _MIG.indexOf(targetSpeciesName) !== -1;
  var _isMouthSection = typeof STAGING_ZONES !== "undefined" && !!STAGING_ZONES[sectionName];
  if (hasSpecies && targetSpeciesName) {
    var seasonal = getCurrentSeason(targetSpeciesName, dateStr, seasonSection);
    if (seasonal) {
      var _q = seasonal.quality;
      if (_q === "peak") {
        score += 10;
        notes.push("Peak season");
      } else if (_q === "good") {
        score += 6;
        notes.push("In season");
      } else if (_q === "absent") {
        if (_isMigTarget) {
          score -= 8;
          warnings.push("Staging in the lake, not in the river yet");
        } else {
          score -= 15;
          warnings.push("Out of season");
        }
      } else {
        score += 1;
        notes.push("Present but slow");
      }
      if (_isMigTarget) {
        var _mouthBonus = mouthPreferenceFor(targetSpeciesName, dateStr);
        if (_mouthBonus) {
          if (_isMouthSection) {
            score += _mouthBonus;
            notes.push(_q === "good" ? "Fish still concentrated at the mouth" : "Staging at the mouth");
          } else {
            score -= _mouthBonus;
            warnings.push(_q === "good" ? "Most fish still at the mouth" : "Fish at the mouth, not this reach");
          }
        }
      }
    }
  } else if (!targetSpeciesName) {
    var bestQuality = "absent";
    var bestSpecies = null;
    (cfg.species || []).forEach(function(s) {
      var w = getCurrentSeason(s, dateStr, seasonSection);
      if (w) {
        if (w.quality === "peak" && bestQuality !== "peak") {
          bestQuality = "peak";
          bestSpecies = s;
        } else if (w.quality === "good" && bestQuality !== "peak") {
          bestQuality = "good";
          bestSpecies = s;
        } else if (w.quality === "slow" && bestQuality === "absent") {
          bestQuality = "slow";
          bestSpecies = s;
        }
      }
    });
    if (bestSpecies) {
      if (bestQuality === "peak") {
        score += 10;
        notes.push(bestSpecies + ", peak");
      } else if (bestQuality === "good") {
        score += 6;
        notes.push(bestSpecies + ", in season");
      } else {
        score += 2;
      }
    }
  }
  if (seasonClosureFor(cfg, dateStr)) {
    score -= 30;
    warnings.unshift("Season closed on this reach");
  } else if (allAccessClosed(cfg, dateStr)) {
    score -= 30;
    warnings.unshift("Every access point on this reach is closed on this date");
  }
  return { score, notes, warnings, cfg };
}
__name(sectionSeasonScore, "sectionSeasonScore");
function conditionsScore(baseScore, cfg, flow, waterTemp, cloudPct, stagingPct) {
  if (stagingPct != null) return stagingPct >= 65 ? 8 : stagingPct >= 40 ? 5 : 2;
  if (cfg && flow != null) {
    return baseScore + liveConditionsScore(flow, cfg.sweetMin, cfg.sweetMax, cfg.flowLow, cfg.flowHigh, waterTemp, cloudPct);
  }
  return baseScore;
}
__name(conditionsScore, "conditionsScore");
function scoreDay(o) {
  var base = sectionSeasonScore(o.section, o.species || [], o.date, o.section);
  var closed = sectionClosedOn(base.cfg, o.date);
  var score = conditionsScore(base.score, base.cfg, o.flow, o.waterTemp, o.cloudPct, o.stagingPct);
  return {
    section: o.section,
    date: o.date,
    closed,
    score,
    confidence: closed ? null : scoreToConfidence(score),
    notes: base.notes,
    warnings: base.warnings
  };
}
__name(scoreDay, "scoreDay");
function driveVerdict(score, driveMin, closed) {
  if (closed) return { text: "\u2715 Closed on this date", cls: "verdict-no" };
  if (score >= 10 && driveMin <= 60) return { text: "\u2713 Worth the drive", cls: "verdict-yes" };
  if (score >= 6 && driveMin <= 90) return { text: "\u2713 Worth the drive", cls: "verdict-yes" };
  if (score >= 6 && driveMin <= 150) return { text: "\u2713 Conditions good, but a long drive", cls: "verdict-maybe" };
  if (score >= 2 && driveMin <= 60) return { text: "~ Marginal conditions. Short drive, your call", cls: "verdict-maybe" };
  if (score < 2) return { text: "\u2715 Tough day. Consider staying local", cls: "verdict-no" };
  return { text: "~ Long drive for current conditions", cls: "verdict-maybe" };
}
__name(driveVerdict, "driveVerdict");
if (typeof globalThis !== "undefined") {
  globalThis.HFF_CORE = {
    RIVER_SECTIONS,
    RIVER_CONFIG,
    RIVER_REGS,
    ACCESS_COORDS,
    SPECIES_SEASONS,
    STAGING_ZONES,
    STAGING_GROUP,
    UPSTREAM_OF,
    secDisplay,
    secLabel,
    secShort,
    getRiverConfig,
    getRiverRegs,
    getCurrentSeason,
    seasonClosureFor,
    accessClosureOn,
    isAccessOpen,
    allAccessClosed,
    sectionClosedOn,
    speciesFishableIn,
    furthestUpstreamOpen,
    bestAccessSpot,
    isLakeRunBrownSection,
    stagingZoneForSection,
    computeStagingScore,
    seasonalLakeTempEst,
    getSalmonPhase,
    getSteelheadPhase,
    mouthPreferenceFor,
    clsFlow,
    clsTemp,
    clsSky,
    waterModelParams,
    modelWaterTemp,
    liveConditionsScore,
    scoreToConfidence,
    LIVE_WATER_STATIONS,
    salmonMethodMode,
    SALMON_MODE_METHOD,
    stagingSectionFor,
    bringPhraseFor,
    stagingRead,
    waterTempFromHistory,
    regsRowMatches,
    upstreamWindowOn,
    sectionSeasonScore,
    conditionsScore,
    scoreDay,
    driveVerdict
  };
}

// weekly.js
var C = globalThis.HFF_CORE;
var WEEKLY_DAYS = 6;
var WEEKLY_MIN_SCORE = 6;
var BLOWOUT_RAIN_MM = 15;
var MARGINAL_CAP = 5;
var WEEKLY_GAP_DAYS = 6;
var MAX_SECTIONS_PER_RUN = 12;
var MIGRATORY = ["Chinook Salmon", "Coho Salmon", "Steelhead"];
var SPECIES_KEY = {
  "Brown Trout": "brown",
  "Rainbow Trout": "rainbow",
  "Brook Trout": "brook",
  "Steelhead": "steelhead",
  "Chinook Salmon": "chinook",
  "Coho Salmon": "coho"
};
var KEY_NAME = Object.fromEntries(Object.entries(SPECIES_KEY).map(([n, k]) => [k, n]));
function speciesName(s) {
  if (!s) return null;
  const t = String(s).trim();
  if (SPECIES_KEY[t]) return t;
  return KEY_NAME[t.toLowerCase()] || null;
}
__name(speciesName, "speciesName");
function sectionKey(s) {
  const base = String(s || "").split(",")[0].trim();
  const cfg = C.RIVER_CONFIG[base];
  return cfg && cfg.lat !== void 0 && base !== "default" ? base : null;
}
__name(sectionKey, "sectionKey");
function weeklyInterests(rec) {
  if (!rec || rec.unsubscribed) return [];
  const out = [], seen = {};
  const add = /* @__PURE__ */ __name((sec, sp) => {
    const s = sectionKey(sec), n = speciesName(sp);
    if (!s || !n) return;
    const cfg = C.RIVER_CONFIG[s];
    if (!cfg.species || cfg.species.indexOf(n) === -1) return;
    const k = s + "|" + n;
    if (seen[k]) return;
    seen[k] = true;
    out.push({ section: s, species: n });
  }, "add");
  (rec.weekly || []).forEach((w) => w && add(w.section, w.species));
  (rec.rivers || []).forEach((r) => (rec.species || []).forEach((sp) => add(r, sp)));
  return out.slice(0, 5);
}
__name(weeklyInterests, "weeklyInterests");
function addDays(iso, n) {
  const d = /* @__PURE__ */ new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
__name(addDays, "addDays");
function windowDates(todayIso) {
  return Array.from({ length: WEEKLY_DAYS }, (_, i) => addDays(todayIso, i + 1));
}
__name(windowDates, "windowDates");
function daysBetween(a, b) {
  return Math.round((Date.parse(b + "T12:00:00Z") - Date.parse(a + "T12:00:00Z")) / 864e5);
}
__name(daysBetween, "daysBetween");
function weatherUrl(cfg) {
  return "https://api.open-meteo.com/v1/forecast?latitude=" + cfg.lat + "&longitude=" + cfg.lng + "&daily=temperature_2m_mean,temperature_2m_max,temperature_2m_min,cloudcover_mean,precipitation_sum,winddirection_10m_dominant,windspeed_10m_max&past_days=30&forecast_days=8&timezone=America%2FToronto";
}
__name(weatherUrl, "weatherUrl");
function parseWeather(j) {
  if (!j || !j.daily || !j.daily.time) return null;
  const d = j.daily, byDate = {};
  d.time.forEach((t, i) => {
    byDate[t] = {
      cloud: d.cloudcover_mean ? d.cloudcover_mean[i] : null,
      rain: d.precipitation_sum ? d.precipitation_sum[i] : null,
      windDir: d.winddirection_10m_dominant ? d.winddirection_10m_dominant[i] : null,
      windSpd: d.windspeed_10m_max ? d.windspeed_10m_max[i] : null,
      hi: d.temperature_2m_max ? d.temperature_2m_max[i] : null,
      lo: d.temperature_2m_min ? d.temperature_2m_min[i] : null
    };
  });
  return { hist: { time: d.time, mean: d.temperature_2m_mean }, byDate };
}
__name(parseWeather, "parseWeather");
function scoreWeek({ section, species, dates, today, wx, flow, liveWater, lakeTemps }) {
  const cfg = C.getRiverConfig(section);
  return dates.map((date) => {
    const d = wx && wx.byDate[date];
    if (!d) return { date, missing: true, good: false };
    const fishable = C.speciesFishableIn(section, species, date);
    const waterTemp = C.waterTempFromHistory(section, wx.hist, date, today, liveWater);
    let staging = null;
    if (MIGRATORY.indexOf(species) !== -1) {
      const z = C.stagingSectionFor(section);
      if (z) {
        const lt = lakeTemps && lakeTemps[C.STAGING_ZONES[z].key] != null ? lakeTemps[C.STAGING_ZONES[z].key] : null;
        staging = C.stagingRead(z, date, /Chinook|Coho/.test(species), species === "Steelhead", lt, d.cloud, d.windDir, d.windSpd);
      }
    }
    const r = C.scoreDay({
      section,
      species: [species],
      date,
      flow,
      waterTemp,
      cloudPct: d.cloud,
      stagingPct: staging ? staging.pct : null
    });
    const prev = wx.byDate[addDays(date, -1)];
    const rainy = (d.rain || 0) >= BLOWOUT_RAIN_MM || !!(prev && (prev.rain || 0) >= BLOWOUT_RAIN_MM);
    const score = rainy ? Math.min(r.score, MARGINAL_CAP) : r.score;
    return {
      date,
      score,
      word: r.closed ? "Closed" : C.scoreToConfidence(score).word,
      closed: r.closed,
      fishable,
      good: fishable && !r.closed && score >= WEEKLY_MIN_SCORE,
      waterTemp,
      cloud: d.cloud,
      rain: d.rain,
      rainy,
      flow,
      flowClass: flow != null && cfg ? C.clsFlow(flow, cfg) : null,
      staging: staging ? { which: staging.which, mode: staging.phase.mode, pct: staging.pct, atMouth: stagingAtMouth(section, staging) } : null
    };
  });
}
__name(scoreWeek, "scoreWeek");
function stagingAtMouth(section, staging) {
  return staging.which === "salmon" && staging.phase.mode === "stage" && !!C.STAGING_ZONES[section];
}
__name(stagingAtMouth, "stagingAtMouth");
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
__name(esc, "esc");
function prettyDay(iso) {
  return (/* @__PURE__ */ new Date(iso + "T12:00:00Z")).toLocaleDateString("en-CA", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" });
}
__name(prettyDay, "prettyDay");
function dayReason(day, cfg) {
  const bits = [];
  if (day.staging) {
    const strength = day.staging.pct >= 65 ? "strong" : day.staging.pct >= 40 ? "fair" : "slow";
    const fish = day.staging.which === "salmon" ? "Salmon" : "Steelhead";
    bits.push(fish + (day.staging.mode === "stage" ? " staging at the mouth" : " run") + " looks " + strength);
  }
  if (day.waterTemp != null) bits.push("water about " + Math.round(day.waterTemp) + " \xB0C");
  if (day.cloud != null) bits.push(day.cloud >= 70 ? "overcast" : day.cloud >= 40 ? "some cloud" : "bright sky");
  if (day.flowClass === "good") bits.push("flow in the sweet spot today");
  else if (day.flow != null && cfg && day.flow < cfg.sweetMin) bits.push("flow on the low side today");
  else if (day.flow != null && cfg && day.flow > cfg.sweetMax) bits.push("flow on the high side today");
  const t = bits.join(", ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}
__name(dayReason, "dayReason");
function blockHeader(combo) {
  return `<h2 style="color:#1e7a6e;margin:24px 0 4px">${esc(combo.species)} on ${esc(C.secLabel(combo.section))}</h2>`;
}
__name(blockHeader, "blockHeader");
function blockDays(combo) {
  const cfg = C.getRiverConfig(combo.section);
  const good = combo.days.filter((d) => d.good).sort((a, b) => b.score - a.score).slice(0, 3).sort((a, b) => a.date < b.date ? -1 : 1);
  return `<ul style="padding-left:18px;line-height:1.6;margin:8px 0">` + good.map((d) => `<li><strong>${esc(prettyDay(d.date))}: ${esc(d.word)}.</strong> ${esc(dayReason(d, cfg))}.</li>`).join("") + `</ul>`;
}
__name(blockDays, "blockDays");
function bestDay(combo) {
  return combo.days.filter((d) => d.good).sort((a, b) => b.score - a.score || (a.date < b.date ? -1 : 1))[0] || null;
}
__name(bestDay, "bestDay");
function blockWhere(combo) {
  const day = bestDay(combo);
  const cfg = C.getRiverConfig(combo.section);
  const open = (cfg.access || []).filter((a) => C.isAccessOpen(a, day.date));
  const spot = C.bestAccessSpot(open, !!(day.staging && day.staging.atMouth));
  if (!spot) return "";
  return `<p style="margin:8px 0"><strong>Where:</strong> ${esc(spot.name)}${spot.loc ? ` (${esc(spot.loc)})` : ""}.</p>`;
}
__name(blockWhere, "blockWhere");
function blockGear(combo) {
  const day = bestDay(combo);
  const cfg = C.getRiverConfig(combo.section);
  const mode = C.salmonMethodMode({
    speciesKey: SPECIES_KEY[combo.species],
    fam: "",
    cfg,
    stagingModeActive: !!(day.staging && day.staging.atMouth),
    section: combo.section,
    dateStr: day.date
  });
  if (!mode) return "";
  const method = mode === "spin" ? C.SALMON_MODE_METHOD.spin : C.SALMON_MODE_METHOD.float;
  return `<p style="margin:8px 0"><strong>Bring:</strong> your ${esc(C.bringPhraseFor(method, false))}.</p>`;
}
__name(blockGear, "blockGear");
function blockRegs(combo, today) {
  const cfg = C.getRiverConfig(combo.section);
  let closing = null;
  for (let i = 1; i <= 14 && !closing; i++) {
    const d = addDays(today, i);
    if (C.sectionClosedOn(cfg, d) && !C.sectionClosedOn(cfg, addDays(d, -1))) closing = d;
  }
  return `<p style="margin:8px 0;font-size:13px;color:#555">This reach is open on the days above.` + (closing ? ` It closes on ${esc(prettyDay(closing))}.` : "") + ` Check posted signs and the regulations where you fish.</p>`;
}
__name(blockRegs, "blockRegs");
function appLink(combo, site) {
  const day = bestDay(combo);
  return site + "/?river=" + encodeURIComponent(combo.section) + "&species=" + SPECIES_KEY[combo.species] + "&date=" + day.date;
}
__name(appLink, "appLink");
function blockButton(combo, site) {
  return `<p style="margin:12px 0 4px"><a href="${appLink(combo, site)}" style="display:inline-block;background:#1e7a6e;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px">See ${esc(prettyDay(bestDay(combo).date).split(",")[0])} in the app</a></p>`;
}
__name(blockButton, "blockButton");
function renderCombo(combo, today, site) {
  return blockHeader(combo) + blockDays(combo) + blockWhere(combo) + blockGear(combo) + blockRegs(combo, today) + blockButton(combo, site);
}
__name(renderCombo, "renderCombo");
function weeklySubject(combos) {
  if (combos.length === 1) return "Good days ahead for " + combos[0].species + " on " + C.secShort(combos[0].section);
  return "Good days ahead on " + combos.length + " of your rivers";
}
__name(weeklySubject, "weeklySubject");
function renderEmail(combos, today, site, footerHtml) {
  const flowNote = combos.some((c) => c.days.some((d) => d.flow != null)) ? " Flow is today\u2019s gauge reading. Rain can change it fast, so check the app before you go." : "";
  return `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1a2e3a">
    <p>Your Thursday look at the next six days.${flowNote}</p>
    ${combos.map((c) => renderCombo(c, today, site)).join("")}
    ${footerHtml}
  </div>`;
}
__name(renderEmail, "renderEmail");
async function runWeekly(env, deps, opts = {}) {
  const mode = opts.mode || (env.ALERTS_MODE === "live" ? "live" : "preview");
  const today = opts.today || deps.torontoDate(/* @__PURE__ */ new Date());
  const dates = windowDates(today);
  const log = { date: today, mode, recipients: 0, sections: 0, skippedSections: [], sent: 0, previewed: 0, nothing: 0, capped: 0, errors: [] };
  const recs = await deps.listRecords();
  let people = recs.map((rec) => ({ rec, interests: weeklyInterests(rec) })).filter((p) => p.interests.length);
  if (people.length) {
    const gone = await deps.resendUnsubscribed();
    people = people.filter((p) => !gone.has(p.rec.email));
  }
  log.recipients = people.length;
  let sections = [...new Set(people.flatMap((p) => p.interests.map((i) => i.section)))];
  if (sections.length > MAX_SECTIONS_PER_RUN) {
    log.skippedSections = sections.slice(MAX_SECTIONS_PER_RUN);
    sections = sections.slice(0, MAX_SECTIONS_PER_RUN);
  }
  log.sections = sections.length;
  const needLake = people.some((p) => p.interests.some((i) => MIGRATORY.indexOf(i.species) !== -1));
  const lakeTemps = needLake ? await deps.lakeTemps().catch(() => null) : null;
  const needLive = sections.some((s) => C.LIVE_WATER_STATIONS[s]);
  const live = needLive ? await deps.liveWater().catch(() => null) : null;
  const inputs = {};
  for (const s of sections) {
    const cfg = C.getRiverConfig(s);
    let wx = null, flow = null;
    try {
      wx = parseWeather(await deps.fetchJson(weatherUrl(cfg)));
    } catch (e) {
      log.errors.push("weather " + s);
    }
    if (cfg.gauge) {
      try {
        flow = await deps.flow(cfg.gauge);
      } catch (e) {
        log.errors.push("flow " + s);
      }
    }
    const st = C.LIVE_WATER_STATIONS[s];
    const lw = live && st && live.water && live.water[st.station];
    const fresh = live && live.updated && Date.now() - Date.parse(live.updated) < 6 * 3600 * 1e3;
    inputs[s] = { wx, flow, liveWater: lw && fresh && lw.latest != null ? lw.latest : null };
  }
  const combos = {};
  const comboFor = /* @__PURE__ */ __name((i) => {
    const k = i.section + "|" + i.species;
    if (!combos[k] && inputs[i.section]) {
      combos[k] = {
        section: i.section,
        species: i.species,
        days: scoreWeek(Object.assign({ section: i.section, species: i.species, dates, today, lakeTemps }, inputs[i.section]))
      };
    }
    return combos[k] || null;
  }, "comboFor");
  const out = [];
  for (const p of people) {
    const all = p.interests.map(comboFor).filter(Boolean);
    const passing = all.filter((c) => c.days.some((d) => d.good));
    const last = p.rec.lastWeeklyAt ? p.rec.lastWeeklyAt.slice(0, 10) : null;
    const capped = !!(last && daysBetween(last, today) < WEEKLY_GAP_DAYS);
    out.push({ email: p.rec.email, rec: p.rec, all, passing, capped });
  }
  if (mode === "live") {
    const toSend = out.filter((o) => o.passing.length && !o.capped);
    for (let i = 0; i < toSend.length; i += 100) {
      const batch = [];
      for (const o of toSend.slice(i, i + 100)) {
        const links = await deps.unsubLinks(o.email);
        batch.push({
          from: deps.FROM,
          to: [o.email],
          subject: weeklySubject(o.passing),
          headers: deps.listHeaders(links),
          html: renderEmail(o.passing, today, deps.SITE, deps.emailFooter(
            links,
            "You're getting this because you asked for a Thursday heads-up on these rivers at herefishyfishy.ca."
          ))
        });
      }
      const ok = await deps.sendBatch(batch, "weekly-" + today + "-" + i);
      if (ok) {
        log.sent += batch.length;
        for (const o of toSend.slice(i, i + 100)) {
          o.rec.lastWeeklyAt = (/* @__PURE__ */ new Date()).toISOString();
          await deps.putRecord(o.rec);
        }
      } else log.errors.push("send batch " + i);
    }
  } else {
    log.previewed = out.filter((o) => o.passing.length && !o.capped).length;
    if (out.length) await deps.sendOwner("Weekly email preview: " + log.previewed + " of " + out.length + " would get one", renderPreview(out, combos, today, deps.SITE));
  }
  log.nothing = out.filter((o) => !o.passing.length).length;
  log.capped = out.filter((o) => o.passing.length && o.capped).length;
  await deps.putLog("alert:weekly:log:" + today, log);
  return { log, out, combos };
}
__name(runWeekly, "runWeekly");
function renderPreview(out, combos, today, site) {
  const rows = Object.values(combos).map((c) => `<tr><td style="padding:2px 6px">${esc(c.species)}, ${esc(C.secShort(c.section))}</td>` + c.days.map((d) => `<td style="padding:2px 6px;${d.good ? "font-weight:bold;color:#1e7a6e" : "color:#777"}">${esc(d.date.slice(5))} ${esc(d.missing ? "no data" : d.word)}${d.rainy ? " (rain)" : ""}</td>`).join("") + "</tr>").join("");
  const people = out.map((o) => {
    const head = `<p style="margin:16px 0 4px"><strong>${esc(o.email)}</strong>: `;
    if (!o.passing.length) return head + "nothing this week (no Good day on open water).</p>";
    if (o.capped) return head + "skipped, already had a weekly email in the last 6 days.</p>";
    return head + `would get "${esc(weeklySubject(o.passing))}"</p><div style="border:1px solid #e2ded6;padding:8px 12px">` + renderEmail(o.passing, today, site, '<p style="color:#999;font-size:11px">[unsubscribe footer]</p>') + "</div>";
  }).join("");
  return `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1a2e3a">
    <p><strong>Preview only. Nothing was sent to subscribers.</strong> Set ALERTS_MODE to live on the Worker to start sending.</p>
    <table style="font-size:12px;border-collapse:collapse">${rows}</table>${people}</div>`;
}
__name(renderPreview, "renderPreview");

// worker.js
var ARCGIS_BASE = "https://services1.arcgis.com/TJH5KDher0W13Kgo/arcgis/rest/services/FishStockingDataForRecreationalPurposes/FeatureServer/0/query";
var EC_FLOW_BASE = "https://api.weather.gc.ca/collections/hydrometric-realtime/items";
var CACHE_TTL_STOCKING = 86400;
var CACHE_TTL_FLOW = 300;
var CACHE_TTL_LAKE = 3600;
var NDBC_BASE = "https://www.ndbc.noaa.gov/data/realtime2/";
var BUOYS = {
  west: "45139",
  east: "45012",
  georgian: "45143"
};
var ZONE_BUOY = {
  credit: "west",
  humber: "west",
  bronte: "west",
  sixteen: "west",
  rouge: "west",
  duffins: "west",
  bowmanville: "west",
  wilmot: "west",
  ganaraska: "east",
  nottawasaga: "georgian"
};
var NEARSHORE_OFFSET_C = 1.5;
var BUOY_MAX_AGE_HOURS = 12;
var F = {
  district: "MNRF_District",
  year: "Stocking_Year",
  species: "Species",
  nameOfficial: "Official_Waterbody_Name",
  nameUnofficial: "Unoffcial_Waterbody_Name",
  // typo in source
  wbid: "Waterbody_Location_Identifier",
  stage: "Developmental_Stage",
  quantity: "Number_of_Fish_Stocked",
  lat: "Latitude",
  lng: "Longitude"
};
var STREAMCAST_RIVERS = [
  { name: "Credit River", keyword: "Credit" },
  { name: "Grand River", keyword: "Grand" },
  { name: "Humber River", keyword: "Humber" },
  { name: "Bronte Creek", keyword: "Bronte" },
  { name: "Duffins Creek", keyword: "Duffin" },
  { name: "Rouge River", keyword: "Rouge" },
  { name: "Sixteen Mile Creek", keyword: "Sixteen Mile" },
  { name: "Ganaraska River", keyword: "Ganaraska" },
  { name: "Beaver River", keyword: "Beaver" },
  { name: "Saugeen River", keyword: "Saugeen" },
  { name: "Nottawasaga River", keyword: "Nottawasaga" },
  { name: "Speed River", keyword: "Speed" },
  { name: "Eramosa River", keyword: "Eramosa" },
  { name: "Bowmanville Creek", keyword: "Bowmanville" },
  { name: "Wilmot Creek", keyword: "Wilmot" }
];
var CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
function jsonResponse(data, status = 200, ttl = 0) {
  const headers = { ...CORS, "Content-Type": "application/json" };
  if (ttl > 0)
    headers["Cache-Control"] = `public, max-age=${ttl}`;
  return new Response(JSON.stringify(data), { status, headers });
}
__name(jsonResponse, "jsonResponse");
function errorResponse(msg, status = 500) {
  return jsonResponse({ error: msg }, status);
}
__name(errorResponse, "errorResponse");
async function fetchStockingForRiver({ name, keyword }) {
  const where = `${F.nameOfficial} LIKE '%${keyword}%' OR ${F.nameUnofficial} LIKE '%${keyword}%'`;
  const params = new URLSearchParams({
    where,
    outFields: [F.year, F.species, F.nameOfficial, F.nameUnofficial, F.stage, F.quantity, F.district].join(","),
    orderByFields: `${F.year} DESC`,
    resultRecordCount: "200",
    f: "json"
  });
  const res = await fetch(`${ARCGIS_BASE}?${params}`, {
    headers: { "Accept": "application/json", "User-Agent": "StreamCast/1.0" }
  });
  if (!res.ok)
    throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error)
    throw new Error(data.error.message || JSON.stringify(data.error));
  return data.features || [];
}
__name(fetchStockingForRiver, "fetchStockingForRiver");
function summarise(features, riverName) {
  if (!features.length)
    return null;
  const perSpecies = {};
  features.forEach((f) => {
    const p = f.attributes;
    const sp = p[F.species] || "Unknown";
    const yr = p[F.year] || 0;
    if (!perSpecies[sp] || yr > perSpecies[sp].year) {
      perSpecies[sp] = {
        species: sp,
        year: yr,
        stage: p[F.stage] || null,
        // e.g. "Yearlings", "Fry", "Adults"
        quantity: p[F.quantity] || null,
        waterbody: p[F.nameOfficial] || p[F.nameUnofficial] || riverName
      };
    }
  });
  const stockedSpecies = Object.values(perSpecies).sort((a, b) => b.year - a.year);
  return {
    stockedSpecies,
    mostRecentYear: stockedSpecies[0]?.year || null,
    totalRecords: features.length
  };
}
__name(summarise, "summarise");
async function handleStocking(url, ctx) {
  const singleRiverName = url.searchParams.get("river");
  const rivers = singleRiverName ? STREAMCAST_RIVERS.filter((r) => r.name === singleRiverName) : STREAMCAST_RIVERS;
  if (singleRiverName && !rivers.length) {
    return errorResponse(`Unknown river: ${singleRiverName}. Valid rivers: ${STREAMCAST_RIVERS.map((r) => r.name).join(", ")}`, 400);
  }
  const cacheKey = new Request(
    `https://cache.streamcast/stocking-v3?rivers=${rivers.map((r) => r.name).join(",")}`
  );
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached)
    return cached;
  const result = { updated: (/* @__PURE__ */ new Date()).toISOString(), rivers: {}, errors: {} };
  for (const river of rivers) {
    try {
      const features = await fetchStockingForRiver(river);
      const summary = summarise(features, river.name);
      result.rivers[river.name] = summary || { stockedSpecies: [], mostRecentYear: null, totalRecords: 0, note: "No stocking records found" };
    } catch (e) {
      result.errors[river.name] = e.message;
    }
  }
  const response = jsonResponse(result, 200, CACHE_TTL_STOCKING);
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
__name(handleStocking, "handleStocking");
async function handleFlow(url, ctx) {
  const station = url.searchParams.get("station");
  if (!station)
    return errorResponse("Missing ?station= parameter", 400);
  if (!/^[0-9A-Z]{5,10}$/.test(station))
    return errorResponse("Invalid station ID", 400);
  const cacheKey = new Request(`https://cache.streamcast/flow?station=${station}`);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached)
    return cached;
  const params = new URLSearchParams({
    STATION_NUMBER: station,
    sortby: "-DATETIME",
    limit: "5",
    f: "json"
  });
  let upstream;
  try {
    upstream = await fetch(`${EC_FLOW_BASE}?${params}`, {
      headers: { "Accept": "application/json", "User-Agent": "StreamCast/1.0" }
    });
  } catch (e) {
    return errorResponse("EC fetch failed: " + e.message);
  }
  if (!upstream.ok)
    return errorResponse(`EC returned ${upstream.status}`);
  const raw = await upstream.json();
  const features = raw.features || [];
  if (!features.length)
    return jsonResponse({ flow: null, trend: null, station });
  const getVal = /* @__PURE__ */ __name((obj, keys) => {
    for (const k of keys) {
      if (obj[k] != null)
        return parseFloat(obj[k]);
      const kl = Object.keys(obj).find((ok) => ok.toLowerCase() === k.toLowerCase());
      if (kl && obj[kl] != null)
        return parseFloat(obj[kl]);
    }
    return null;
  }, "getVal");
  const readings = features.map((f) => ({
    flow: getVal(f.properties, ["DISCHARGE", "discharge", "LEVEL", "level"]),
    at: f.properties.DATETIME || f.properties.datetime || null
  })).filter((r) => r.flow != null && !isNaN(r.flow));
  if (!readings.length)
    return jsonResponse({ flow: null, trend: null, station });
  const flow = Math.round(readings[0].flow * 100) / 100;
  const prev = readings[1]?.flow ?? null;
  const trend = prev == null ? "stable" : flow > prev + 0.05 ? "up" : flow < prev - 0.05 ? "down" : "stable";
  const response = jsonResponse({ flow, trend, at: readings[0].at, station }, 200, CACHE_TTL_FLOW);
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
__name(handleFlow, "handleFlow");
async function handleFields() {
  const res = await fetch(`${ARCGIS_BASE}?where=1%3D1&outFields=*&resultRecordCount=1&f=json`, {
    headers: { "Accept": "application/json", "User-Agent": "StreamCast/1.0" }
  });
  const data = await res.json();
  const fields = data.features?.[0]?.attributes ? Object.keys(data.features[0].attributes) : (data.fields || []).map((f) => f.name);
  return jsonResponse({ fields, sample: data.features?.[0]?.attributes || null });
}
__name(handleFields, "handleFields");
function parseBuoyWtmp(text) {
  if (!text)
    return null;
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 3)
    return null;
  const header = lines[0].replace(/^#/, "").trim().split(/\s+/);
  let wtmpIdx = header.indexOf("WTMP");
  if (wtmpIdx === -1)
    wtmpIdx = 14;
  const now = Date.now();
  for (const line of lines) {
    if (line.startsWith("#"))
      continue;
    const f = line.trim().split(/\s+/);
    if (f.length <= wtmpIdx)
      continue;
    const raw = f[wtmpIdx];
    if (!raw || raw === "MM")
      continue;
    const val = parseFloat(raw);
    if (!isFinite(val) || val < -5 || val > 35)
      continue;
    const ts = Date.UTC(
      parseInt(f[0], 10),
      parseInt(f[1], 10) - 1,
      parseInt(f[2], 10),
      parseInt(f[3], 10),
      parseInt(f[4], 10)
    );
    if (!isFinite(ts))
      continue;
    if (now - ts > BUOY_MAX_AGE_HOURS * 3600 * 1e3)
      return null;
    return Math.round((val + NEARSHORE_OFFSET_C) * 10) / 10;
  }
  return null;
}
__name(parseBuoyWtmp, "parseBuoyWtmp");
async function fetchBuoyTemp(stationId) {
  try {
    const r = await fetch(NDBC_BASE + stationId + ".txt", {
      cf: { cacheTtl: 1800, cacheEverything: true },
      headers: { "User-Agent": "HereFishyFishy/1.0 (herefishyfishy.ca)" }
    });
    if (!r.ok)
      return null;
    return parseBuoyWtmp(await r.text());
  } catch (e) {
    return null;
  }
}
__name(fetchBuoyTemp, "fetchBuoyTemp");
async function handleLakeTemps(url, ctx) {
  const cacheKey = new Request("https://cache.streamcast/lake-temps-v2");
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached)
    return cached;
  const ids = Object.keys(BUOYS);
  const results = await Promise.all(ids.map((k) => fetchBuoyTemp(BUOYS[k])));
  const byBuoy = {};
  ids.forEach((k, i) => {
    byBuoy[k] = results[i];
  });
  const out = {};
  for (const zone of Object.keys(ZONE_BUOY)) {
    const t = byBuoy[ZONE_BUOY[zone]];
    out[zone] = t == null ? null : t;
  }
  const payload = {
    updated: (/* @__PURE__ */ new Date()).toISOString(),
    source: "NDBC buoys 45139 (west Lk Ontario) / 45012 (east Lk Ontario) / 45143 (S Georgian Bay)",
    nearshoreOffsetC: NEARSHORE_OFFSET_C,
    buoys: byBuoy,
    temps: out
  };
  const response = jsonResponse(payload, 200, CACHE_TTL_LAKE);
  if (Object.values(byBuoy).some((v) => v != null)) {
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
}
__name(handleLakeTemps, "handleLakeTemps");
var SSR_ROUTES = {
  "credit-river/brown-trout": {
    river: "Credit River",
    species: "Brown Trout",
    section: "Upper Credit River",
    // most relevant section for this species
    gauge: "02HB001",
    // Credit River near Cataract
    sweetMin: 5,
    sweetMax: 15,
    lat: 43.87,
    lng: -80.01,
    seasonMonths: [3, 9],
    // April–October (0-indexed)
    peakMonths: [3, 5],
    // April–June peak
    access: [
      "Forks of the Credit Provincial Park \u2014 Cataract, ON",
      "Belfountain Conservation Area \u2014 Belfountain, ON",
      "Upper Credit Conservation Area \u2014 Caledon, ON"
    ],
    evergreen: `The Upper Credit River is one of Southern Ontario's best wild brown trout fisheries. The river runs cold year-round through the Niagara Escarpment gorge, holding resident browns from Cataract down through Belfountain. Best action is April through June on nymphs and dry flies, and again in September as water cools. The stretch above Old Baseline Road in Caledon is catch-and-release, artificial only \u2014 some of the most pristine trout water in the province.`,
    tips: `Fish the seams at the head of pools in the morning before the sun hits the water. Hendrickson hatches in late April and early May draw fish to the surface \u2014 a size 14 parachute pattern dead-drifted over rising fish is hard to beat. In summer, switch to a dropper rig with a small nymph off a dry.`
  },
  "credit-river/rainbow-trout": {
    river: "Credit River",
    species: "Rainbow Trout",
    section: "Upper Credit River",
    gauge: "02HB001",
    sweetMin: 5,
    sweetMax: 15,
    lat: 43.87,
    lng: -80.01,
    seasonMonths: [2, 4],
    // March–May (spring run)
    peakMonths: [2, 3],
    access: [
      "Norval Conservation Area \u2014 Norval, ON",
      "Streetsville Road Allowances \u2014 Mississauga, ON",
      "Forks of the Credit Provincial Park \u2014 Cataract, ON"
    ],
    evergreen: `Rainbow trout (including migratory steelhead) enter the Credit River in spring, typically March through May. Resident rainbows hold in the upper reaches year-round in smaller numbers. The best spring run fishing is in the middle section around Norval and the Forks, where fish stack below holding pools waiting for water temperatures to peak. Flows between 10\u201320 m\xB3/s produce the best conditions \u2014 fish spread out and become more accessible when the river is at moderate height.`,
    tips: `Drift roe, bead patterns, or large nymphs through the deep pools during peak flows. As levels drop through April, switch to lighter nymphing rigs with smaller flies. Rising fish are uncommon in early spring \u2014 focus on the bottom third of the water column.`
  },
  "credit-river/brook-trout": {
    river: "Credit River",
    species: "Brook Trout",
    section: "Upper Credit River",
    gauge: "02HB001",
    sweetMin: 3,
    sweetMax: 10,
    lat: 43.87,
    lng: -80.01,
    seasonMonths: [3, 9],
    // April–October
    peakMonths: [3, 4],
    access: [
      "Upper Credit Conservation Area \u2014 Caledon, ON (catch-and-release)",
      "Belfountain Conservation Area \u2014 Belfountain, ON"
    ],
    evergreen: `Brook trout are found in the coldest headwater reaches of the Upper Credit River, particularly in the catch-and-release sections above Old Baseline Road in Caledon. These are wild fish \u2014 smaller than the browns below but extraordinarily beautiful. The Upper Credit Conservation Area protects some of the best habitat. Water temperature is the key variable: brookies go off the feed when water exceeds 18\xB0C in midsummer. Best fishing is May\u2013June and again in September.`,
    tips: `Use light tackle \u2014 3 or 4 weight fly rod, 5x or 6x tippet, small flies (size 14\u201318). Brook trout in clear headwater streams spook easily. Wade carefully, stay low, and cast accurately to specific fish rather than covering water randomly.`
  },
  "credit-river/steelhead": {
    river: "Credit River",
    species: "Steelhead",
    section: "Middle Credit River",
    gauge: "02HB001",
    sweetMin: 8,
    sweetMax: 25,
    lat: 43.66,
    lng: -79.88,
    seasonMonths: [8, 4],
    // Sept–May (wraps around winter)
    peakMonths: [2, 3],
    access: [
      "Norval Conservation Area \u2014 Norval, ON",
      "Streetsville Conservation Area \u2014 Streetsville, ON",
      "Erindale Park \u2014 Mississauga, ON"
    ],
    evergreen: `Steelhead begin entering the Credit River in late September following the Chinook salmon run, and continue through winter into late April. Peak fishing is March\u2013April when fish are pushing upriver on rising spring temperatures. The Credit produces both fall-run and spring-run fish, with the middle section around Norval and Streetsville holding the most accessible water. Lake Ontario surface temperature is the key trigger \u2014 when it cools below 10\xB0C in fall, fish start staging near the harbour mouth.`,
    tips: `In fall, swing large streamers or run float rigs with roe through the deeper pools. Spring fish are more willing to take nymphs dead-drifted through feeding lanes. Early morning before 9AM is consistently the most productive window, especially on bright days.`
  },
  "credit-river/chinook-salmon": {
    river: "Credit River",
    species: "Chinook Salmon",
    section: "Lower Credit River",
    gauge: "02HB001",
    sweetMin: 10,
    sweetMax: 40,
    lat: 43.56,
    lng: -79.72,
    seasonMonths: [8, 10],
    // September–November
    peakMonths: [9, 9],
    access: [
      "Erindale Park \u2014 Mississauga, ON",
      "Port Credit Harbour Mouth \u2014 Port Credit, ON",
      "Streetsville Conservation Area \u2014 Streetsville, ON"
    ],
    evergreen: `Chinook salmon enter the Credit River from Lake Ontario starting in late September, with peak numbers moving through in October. Fish stack near the harbour mouth at Port Credit waiting for sufficient flow, then push upriver after rain events raise levels. The lower Credit through Mississauga holds the most fish \u2014 the middle section at Streetsville sees fish arrive 1\u20132 weeks later. Chinook can reach 15\u201320kg on the Credit, making this one of the most exciting urban fisheries in Ontario.`,
    tips: `Target the Credit during and just after rain events when flows spike above 15 m\xB3/s \u2014 fresh fish push hard on rising water. Anchor beads, roe bags, or large streamers near the bottom of the deepest pools. Early morning low-light conditions produce the most aggressive fish.`
  },
  "credit-river/coho-salmon": {
    river: "Credit River",
    species: "Coho Salmon",
    section: "Lower Credit River",
    gauge: "02HB001",
    sweetMin: 8,
    sweetMax: 30,
    lat: 43.56,
    lng: -79.72,
    seasonMonths: [9, 10],
    // October–November
    peakMonths: [9, 10],
    access: [
      "Erindale Park \u2014 Mississauga, ON",
      "Port Credit Harbour Mouth \u2014 Port Credit, ON"
    ],
    evergreen: `Coho salmon arrive on the Credit River in October, following the main Chinook push. Smaller and more acrobatic than Chinook, coho are known for aggressive takes and spectacular aerial fights. They tend to hold higher in the water column than Chinook and are more willing to chase flies and lures. The lower Credit through Port Credit and Mississauga is the primary coho water \u2014 fish rarely push as far upriver as steelhead do.`,
    tips: `Coho respond well to swung flies and small spoons \u2014 a size 2 silver spoon retrieved steadily through pools can be deadly. They are far more willing to take a moving fly than Chinook. Focus on the lower 5km of the Credit, particularly in the pools below Erindale Park.`
  }
};
function scoreConditions(flow, airTemp, cloudPct, route, month) {
  let flowState = "unknown", flowLabel = "Check gauge";
  if (flow != null) {
    if (flow >= route.sweetMin && flow <= route.sweetMax) {
      flowState = "good";
      flowLabel = "In range";
    } else if (flow < route.sweetMin) {
      flowState = flow >= route.sweetMin * 0.4 ? "ok" : "poor";
      flowLabel = "Low";
    } else {
      flowState = flow <= route.sweetMax * 1.8 ? "ok" : "poor";
      flowLabel = "High";
    }
  }
  const waterTemp = airTemp != null ? Math.round((airTemp * 0.7 + 4) * 10) / 10 : null;
  let tempState = "unknown", tempLabel = "Unknown";
  if (waterTemp != null) {
    if (waterTemp >= 8 && waterTemp <= 14) {
      tempState = "good";
      tempLabel = "Ideal";
    } else if (waterTemp >= 5 && waterTemp < 8) {
      tempState = "ok";
      tempLabel = "Cool";
    } else if (waterTemp > 14 && waterTemp <= 18) {
      tempState = "ok";
      tempLabel = "Warm";
    } else if (waterTemp > 18) {
      tempState = "poor";
      tempLabel = "Too warm";
    } else {
      tempState = "poor";
      tempLabel = "Too cold";
    }
  }
  let skyState = "unknown", skyLabel = "Unknown";
  if (cloudPct != null) {
    if (cloudPct >= 50) {
      skyState = "good";
      skyLabel = "Good cover";
    } else if (cloudPct >= 25) {
      skyState = "ok";
      skyLabel = "Some cover";
    } else {
      skyState = "poor";
      skyLabel = "Clear sky";
    }
  }
  const [seasonStart, seasonEnd] = route.seasonMonths;
  const inSeason = seasonStart <= seasonEnd ? month >= seasonStart && month <= seasonEnd : month >= seasonStart || month <= seasonEnd;
  const scores = { good: 2, ok: 1, poor: 0, unknown: 1 };
  const total = scores[flowState] + scores[tempState] + scores[skyState];
  let quality, qualityLabel;
  if (!inSeason) {
    quality = "out-of-season";
    qualityLabel = "Out of season";
  } else if (total >= 5) {
    quality = "excellent";
    qualityLabel = "Excellent";
  } else if (total >= 3) {
    quality = "good";
    qualityLabel = "Good";
  } else if (total >= 2) {
    quality = "marginal";
    qualityLabel = "Marginal";
  } else {
    quality = "tough";
    qualityLabel = "Tough";
  }
  return {
    quality,
    qualityLabel,
    inSeason,
    flow: flow != null ? Math.round(flow * 10) / 10 : null,
    flowState,
    flowLabel,
    waterTemp,
    tempState,
    tempLabel,
    cloudPct,
    skyState,
    skyLabel
  };
}
__name(scoreConditions, "scoreConditions");
function renderSSRPage(route, cond, slug) {
  const speciesSlug = slug.split("/")[1];
  const qualityColor = {
    excellent: "#6dbf8a",
    good: "#6dbf8a",
    marginal: "#e8a85a",
    tough: "#e07070",
    "out-of-season": "#9ecfca"
  }[cond.quality] || "#9ecfca";
  const stateColor = /* @__PURE__ */ __name((s) => ({ good: "#6dbf8a", ok: "#e8a85a", poor: "#e07070", unknown: "#9ecfca" })[s] || "#9ecfca", "stateColor");
  const stateBar = /* @__PURE__ */ __name((s) => `background:${stateColor(s)}`, "stateBar");
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "America/Toronto" });
  const riverParam = encodeURIComponent(route.section);
  const speciesParam = speciesSlug.replace("-trout", "").replace("-salmon", "").replace("brook", "brook").replace("coho", "coho").replace("chinook", "chinook").replace("steelhead", "steelhead");
  const appLink2 = `https://herefishyfishy.ca/?river=${riverParam}&species=${speciesParam}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${route.river} ${route.species} Fishing Conditions \u2014 HereFishyFishy</title>
  <meta name="description" content="Live ${route.species} fishing conditions on the ${route.river} today. Flow: ${cond.flow != null ? cond.flow + " m\xB3/s" : "check gauge"} \xB7 Water: ${cond.waterTemp != null ? "~" + cond.waterTemp + "\xB0C" : "unknown"} \xB7 Conditions: ${cond.qualityLabel}. Updated ${today}.">
  <link rel="canonical" href="https://herefishyfishy.ca/${slug}">
  <link rel="icon" href="https://herefishyfishy.ca/favicon.ico">
  <meta property="og:title" content="${route.river} ${route.species} \u2014 ${cond.qualityLabel} conditions today">
  <meta property="og:description" content="Flow ${cond.flow != null ? cond.flow + " m\xB3/s (" + cond.flowLabel + ")" : "check gauge"} \xB7 ${cond.tempLabel} water \xB7 ${cond.skyLabel}. Updated live.">
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
  <\/script>
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
    .access-list li::before { content: '\u{1F4CD} '; }

    .updated { font-family: 'Courier New', monospace; font-size: .6rem; color: #9ab5b0; text-align: center; padding: 1rem; letter-spacing: .05em; }
    .footer { background: #0d1f2d; padding: 1.25rem 1.5rem; text-align: center; }
    .footer a { color: #9ecfca; font-size: .8rem; text-decoration: none; margin: 0 .75rem; }
  </style>
</head>
<body>

<div class="top-bar">
  <a href="https://herefishyfishy.ca" class="top-bar-brand">HereFishyFishy</a>
  <a href="https://herefishyfishy.ca" class="top-bar-link">\u2190 All rivers</a>
</div>

<div class="hero">
  <div style="max-width:680px;margin:0 auto">
    <div class="hero-eyebrow">Live conditions \xB7 ${today}</div>
    <div class="hero-title">${route.river} \xB7 ${route.species}</div>
    <div class="hero-sub">${route.section} \xB7 ${route.access[0].split("\u2014")[0].trim()}</div>
    <div class="quality-pill">Conditions: ${cond.qualityLabel}</div>

    <div class="tiles">
      <div class="tile">
        <div class="tile-bar" style="${stateBar(cond.flowState)}"></div>
        <div class="tile-body">
          <div class="tile-lbl">Flow</div>
          <div class="tile-val">${cond.flow != null ? cond.flow : "\u2014"}</div>
          <div class="tile-meaning" style="color:${stateColor(cond.flowState)}">${cond.flowLabel}</div>
        </div>
      </div>
      <div class="tile">
        <div class="tile-bar" style="${stateBar(cond.tempState)}"></div>
        <div class="tile-body">
          <div class="tile-lbl">Water</div>
          <div class="tile-val">${cond.waterTemp != null ? "~" + cond.waterTemp + "\xB0" : "\u2014"}</div>
          <div class="tile-meaning" style="color:${stateColor(cond.tempState)}">${cond.tempLabel}</div>
        </div>
      </div>
      <div class="tile">
        <div class="tile-bar" style="${stateBar(cond.skyState)}"></div>
        <div class="tile-body">
          <div class="tile-lbl">Sky</div>
          <div class="tile-val">${cond.cloudPct != null ? cond.cloudPct + "%" : "\u2014"}</div>
          <div class="tile-meaning" style="color:${stateColor(cond.skyState)}">${cond.skyLabel}</div>
        </div>
      </div>
    </div>

    <a href="${appLink2}" class="cta-btn">See full conditions, access points &amp; gear \u2192</a>
    <div class="cta-note">Opens the full app \xB7 free \xB7 no account needed</div>
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
      ${route.access.map((a) => `<li>${a}</li>`).join("\n      ")}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">More Credit River fishing</div>
    <div class="section-body" style="display:flex;flex-direction:column;gap:.4rem">
      <a href="/credit-river/brown-trout">Credit River \u2014 Brown Trout</a>
      <a href="/credit-river/rainbow-trout">Credit River \u2014 Rainbow Trout</a>
      <a href="/credit-river/brook-trout">Credit River \u2014 Brook Trout</a>
      <a href="/credit-river/steelhead">Credit River \u2014 Steelhead</a>
      <a href="/credit-river/chinook-salmon">Credit River \u2014 Chinook Salmon</a>
      <a href="/credit-river/coho-salmon">Credit River \u2014 Coho Salmon</a>
    </div>
  </div>
</div>

<div class="updated">Conditions updated ${(/* @__PURE__ */ new Date()).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit", timeZone: "America/Toronto" })} ET \xB7 Flow: Water Survey of Canada \xB7 Weather: Open-Meteo</div>

<div class="footer">
  <a href="https://herefishyfishy.ca">Home</a>
  <a href="https://herefishyfishy.ca/sitemap.xml">All rivers</a>
</div>

</body>
</html>`;
}
__name(renderSSRPage, "renderSSRPage");
async function handleSSR(request, env) {
  const url = new URL(request.url);
  const slug = url.pathname.replace(/^\//, "").replace(/\/$/, "");
  const route = SSR_ROUTES[slug];
  if (!route)
    return null;
  const cacheKey = `ssr:${slug}`;
  if (env.CACHE) {
    const cached = await env.CACHE.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: { "Content-Type": "text/html;charset=UTF-8", "X-Cache": "HIT" }
      });
    }
  }
  const [flowData, weatherData] = await Promise.allSettled([
    fetch(`https://streamcast-proxy.tnt-tarun.workers.dev/flow?station=${route.gauge}`).then((r) => r.json()).catch(() => null),
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${route.lat}&longitude=${route.lng}&current=temperature_2m,cloudcover&timezone=America/Toronto`).then((r) => r.json()).catch(() => null)
  ]);
  const flow = flowData.status === "fulfilled" && flowData.value?.flow != null ? flowData.value.flow : null;
  const airTemp = weatherData.status === "fulfilled" && weatherData.value?.current?.temperature_2m != null ? weatherData.value.current.temperature_2m : null;
  const cloudPct = weatherData.status === "fulfilled" && weatherData.value?.current?.cloudcover != null ? weatherData.value.current.cloudcover : null;
  const month = (/* @__PURE__ */ new Date()).getMonth();
  const cond = scoreConditions(flow, airTemp, cloudPct, route, month);
  const html = renderSSRPage(route, cond, slug);
  if (env.CACHE) {
    await env.CACHE.put(cacheKey, html, { expirationTtl: 1800 });
  }
  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8", "X-Cache": "MISS" }
  });
}
__name(handleSSR, "handleSSR");
var SITE = "https://herefishyfishy.ca";
var PROXY_PUBLIC = "https://proxy.herefishyfishy.ca";
var FROM = "HereFishyFishy <hello@herefishyfishy.ca>";
var SENDER_FOOTER = "HereFishyFishy \xB7 Shawnmarr Rd, Mississauga ON \xB7 hello@herefishyfishy.ca";
function resend(env, path, method, body, extraHeaders) {
  return fetch("https://api.resend.com" + path, {
    method,
    headers: Object.assign({ "Authorization": "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" }, extraHeaders || {}),
    body: body ? JSON.stringify(body) : void 0
  });
}
__name(resend, "resend");
async function unsubToken(env, email) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.UNSUBSCRIBE_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(email)));
  return btoa(String.fromCharCode(...sig)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "").slice(0, 32);
}
__name(unsubToken, "unsubToken");
function sameString(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
__name(sameString, "sameString");
async function unsubLinks(env, email) {
  const q = "e=" + encodeURIComponent(email) + "&t=" + await unsubToken(env, email);
  return { page: SITE + "/unsubscribe/?" + q, oneClick: PROXY_PUBLIC + "/unsubscribe?" + q };
}
__name(unsubLinks, "unsubLinks");
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
__name(escapeHtml, "escapeHtml");
var TOPIC_OUTLOOK = "8acca89a-661a-4607-819c-1290deac79b2";
var TOPIC_RUN = "81a6f6ee-5667-476e-92d0-bd06c32fd009";
var RUN_RIVERS = [
  "Beaver River",
  "Black Creek",
  "Bowmanville Creek",
  "Bronte Creek",
  "Credit River",
  "Duffins Creek",
  "Ganaraska River",
  "Grand River",
  "Humber River",
  "Nottawasaga River",
  "Rouge River",
  "Saugeen River",
  "Sixteen Mile Creek",
  "Wilmot Creek"
];
var OWNER_EMAIL = "tnt.tarun@gmail.com";
var MAX_TRIPS = 5;
function validEmail(e) {
  return typeof e === "string" && e.length < 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}
__name(validEmail, "validEmail");
function emailFooter(links, why) {
  return `<p style="color:#999;font-size:11px;margin-top:32px">
              ${escapeHtml(why)}
              <a href="${links.page}" style="color:#999">Unsubscribe</a><br>
              ${SENDER_FOOTER}
            </p>`;
}
__name(emailFooter, "emailFooter");
function listHeaders(links) {
  return { "List-Unsubscribe": "<" + links.oneClick + ">", "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" };
}
__name(listHeaders, "listHeaders");
async function getRecord(env, email) {
  const raw = await env.SUBSCRIBERS.get("sub:" + email);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
__name(getRecord, "getRecord");
async function upsertContact(env, email, topics) {
  const t = topics.map((id) => ({ id, subscription: "opt_in" }));
  const created = await resend(env, "/contacts", "POST", { email, unsubscribed: false, segments: [{ id: env.RESEND_AUDIENCE_ID }], topics: t });
  if (created.ok) return;
  await resend(env, "/contacts/" + encodeURIComponent(email), "PATCH", { unsubscribed: false });
  await resend(env, "/contacts/" + encodeURIComponent(email) + "/segments/" + env.RESEND_AUDIENCE_ID, "POST");
  if (t.length) await resend(env, "/contacts/" + encodeURIComponent(email) + "/topics", "PATCH", t);
}
__name(upsertContact, "upsertContact");
function isoDate(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}
__name(isoDate, "isoDate");
function prettyDate(iso) {
  return (/* @__PURE__ */ new Date(iso + "T12:00:00Z")).toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
}
__name(prettyDate, "prettyDate");
function secDisplay2(s) {
  return String(s || "").replace(/ — /g, " \xB7 ");
}
__name(secDisplay2, "secDisplay");
async function handleSubscribe(request, env) {
  if (request.method !== "POST")
    return jsonResponse({ error: "POST only" }, 405);
  try {
    const body = await request.json();
    if (!validEmail(body.email))
      return jsonResponse({ error: "Valid email required" }, 400);
    const clean = body.email.toLowerCase().trim();
    const kind = ["outlook", "run", "trip", "weekly"].indexOf(body.kind) !== -1 ? body.kind : "legacy";
    const record = await getRecord(env, clean) || { email: clean, createdAt: (/* @__PURE__ */ new Date()).toISOString(), runRivers: [], trips: [] };
    record.runRivers = record.runRivers || [];
    record.trips = record.trips || [];
    record.unsubscribed = false;
    record.source = body.source || record.source || "notify-panel";
    record.lastSignupAt = (/* @__PURE__ */ new Date()).toISOString();
    const topics = [];
    let trip = null;
    if (kind === "outlook" || body.outlook === true) {
      record.outlook = true;
      topics.push(TOPIC_OUTLOOK);
    }
    if (kind === "run") {
      const river = String(body.river || "");
      if (RUN_RIVERS.indexOf(river) === -1) return jsonResponse({ error: "Unknown river" }, 400);
      if (record.runRivers.indexOf(river) === -1) record.runRivers.push(river);
      topics.push(TOPIC_RUN);
    }
    if (kind === "trip") {
      const t = body.trip || {};
      const date = isoDate(t.date);
      const today = torontoDate(/* @__PURE__ */ new Date());
      const days = date ? (Date.parse(date) - Date.parse(today)) / 864e5 : -1;
      const lat = Number(t.lat), lng = Number(t.lng);
      if (!date || days < 1 || days > 16) return jsonResponse({ error: "Trip date must be 1 to 16 days out" }, 400);
      if (typeof t.section !== "string" || !t.section || t.section.length > 120) return jsonResponse({ error: "Section required" }, 400);
      if (!(lat > 41 && lat < 47 && lng > -84 && lng < -74)) return jsonResponse({ error: "Bad location" }, 400);
      record.trips = record.trips.filter((k) => k.slice(5, 15) >= today);
      const key = "trip:" + date + ":" + clean + ":" + t.section;
      if (record.trips.indexOf(key) === -1) {
        if (record.trips.length >= MAX_TRIPS) return jsonResponse({ error: "Too many trips saved" }, 429);
        record.trips.push(key);
      }
      trip = {
        email: clean,
        date,
        section: t.section,
        species: String(t.species || "").slice(0, 60),
        gauge: /^[0-9A-Z]{5,10}$/.test(t.gauge || "") ? t.gauge : null,
        lat,
        lng,
        sweetMin: Number(t.sweetMin) || null,
        sweetMax: Number(t.sweetMax) || null,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await env.SUBSCRIBERS.put(key, JSON.stringify(trip), { expirationTtl: (days + 3) * 86400 });
    }
    let weeklyAdded = null;
    if (kind === "weekly" || body.weekly && typeof body.weekly === "object") {
      const w = weeklyInterests({ weekly: [body.weekly || {}] })[0];
      if (!w) {
        if (kind === "weekly") return jsonResponse({ error: "Unknown river or species" }, 400);
      } else {
        record.weekly = (record.weekly || []).filter((x) => !(x.section === w.section && x.species === w.species));
        record.weekly.unshift(w);
        record.weekly = record.weekly.slice(0, 5);
        weeklyAdded = w;
      }
    }
    if (kind === "legacy") {
      record.rivers = Array.isArray(body.rivers) ? body.rivers.map(String).slice(0, 5) : record.rivers || [];
      record.species = Array.isArray(body.species) ? body.species.map(String).slice(0, 6) : record.species || [];
    }
    await env.SUBSCRIBERS.put("sub:" + clean, JSON.stringify(record));
    await upsertContact(env, clean, topics);
    const links = await unsubLinks(env, clean);
    let subject, lead;
    if (kind === "trip") {
      subject = "Your trip email is set for " + prettyDate(trip.date);
      lead = `<p>On the morning of <strong>${escapeHtml(prettyDate(trip.date))}</strong> we'll email you the flow and weather for
            <strong>${escapeHtml(secDisplay2(trip.section))}</strong>, with a link to the full forecast.</p>`;
    } else if (kind === "run") {
      subject = "Run alerts for the " + body.river;
      lead = `<p>We'll email you when salmon or steelhead are running on the <strong>${escapeHtml(body.river)}</strong>.
            Each alert is checked by an angler before it goes out, so expect a few a season, not a stream.</p>` + (weeklyAdded ? `<p>You'll also get a Thursday email when the coming days look good for ${escapeHtml(weeklyAdded.species)} on
            ${escapeHtml(secDisplay2(weeklyAdded.section))}. No good days, no email.</p>` : "") + (record.outlook ? `<p>You'll also get the monthly outlook.</p>` : "");
    } else if (kind === "weekly") {
      subject = "Thursday heads-up for " + weeklyAdded.species;
      lead = `<p>On Thursdays we check the next six days for <strong>${escapeHtml(weeklyAdded.species)}</strong> on
            <strong>${escapeHtml(secDisplay2(weeklyAdded.section))}</strong>. When at least one looks good, we email you which days,
            where to stand and what to bring. No good days, no email.</p>`;
    } else if (kind === "outlook") {
      subject = "You're on the monthly outlook";
      lead = `<p>Once a month we'll send what the forecast means for Ontario's trout and salmon rivers, plus the season
            openers and closures coming up.</p>`;
    } else {
      subject = "You're on the list \u{1F3A3}";
      lead = `<p>Thanks for signing up. We'll be in touch with conditions news for the rivers you follow.</p>`;
    }
    await resend(env, "/emails", "POST", {
      from: FROM,
      to: [clean],
      subject,
      headers: listHeaders(links),
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1a2e3a">
            <h2 style="color:#1e7a6e">You're set.</h2>
            ${lead}
            <p>Check conditions any time at <a href="${SITE}" style="color:#1e7a6e">herefishyfishy.ca</a>.</p>
            ${emailFooter(links, "You're getting this because you signed up at herefishyfishy.ca.")}
          </div>`
    });
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}
__name(handleSubscribe, "handleSubscribe");
function flowWord(flow, lo, hi) {
  if (flow == null) return "";
  if (lo && flow < lo) return "below the sweet spot (" + lo + " to " + hi + ")";
  if (hi && flow > hi) return "above the sweet spot (" + lo + " to " + hi + ")";
  if (lo && hi) return "in the sweet spot (" + lo + " to " + hi + ")";
  return "";
}
__name(flowWord, "flowWord");
async function sendTripEmails(env, ctx) {
  const today = torontoDate(/* @__PURE__ */ new Date());
  const listed = await env.SUBSCRIBERS.list({ prefix: "trip:" + today + ":" });
  for (const k of listed.keys) {
    const trip = await env.SUBSCRIBERS.get(k.name, "json");
    if (!trip || trip.sentAt) continue;
    const rec = await getRecord(env, trip.email);
    if (rec && rec.unsubscribed) {
      await env.SUBSCRIBERS.delete(k.name);
      continue;
    }
    let flow = null, trend = null;
    if (trip.gauge) {
      try {
        const r = await handleFlow(new URL("https://x/flow?station=" + trip.gauge), ctx);
        const j = await r.json();
        flow = j.flow;
        trend = j.trend;
      } catch (e) {
      }
    }
    let wx = null;
    try {
      const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + trip.lat + "&longitude=" + trip.lng + "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,cloud_cover_mean,wind_speed_10m_max&forecast_days=1&timezone=America%2FToronto");
      const j = await r.json();
      if (j.daily) wx = {
        hi: j.daily.temperature_2m_max[0],
        lo: j.daily.temperature_2m_min[0],
        rain: j.daily.precipitation_sum[0],
        cloud: j.daily.cloud_cover_mean ? j.daily.cloud_cover_mean[0] : null,
        wind: j.daily.wind_speed_10m_max[0]
      };
    } catch (e) {
    }
    const links = await unsubLinks(env, trip.email);
    const link = SITE + "/?river=" + encodeURIComponent(trip.section) + (trip.species ? "&species=" + encodeURIComponent(trip.species) : "");
    const rows = [];
    if (flow != null) rows.push(`<li>Flow: <strong>${flow} m\xB3/s</strong>, ${trend === "up" ? "rising" : trend === "down" ? "dropping" : "steady"}${flowWord(flow, trip.sweetMin, trip.sweetMax) ? ", " + flowWord(flow, trip.sweetMin, trip.sweetMax) : ""}.</li>`);
    if (wx) rows.push(`<li>Weather: ${Math.round(wx.lo)} to ${Math.round(wx.hi)} \xB0C, ${wx.cloud != null ? (wx.cloud >= 70 ? "overcast" : wx.cloud >= 30 ? "some cloud" : "mostly clear") + ", " : ""}${wx.rain >= 1 ? Math.round(wx.rain) + " mm of rain" : "little or no rain"}, wind up to ${Math.round(wx.wind)} km/h.</li>`);
    if (!rows.length) rows.push(`<li>Live flow and weather weren't available this morning. The app has the latest.</li>`);
    const sent = await resend(env, "/emails", "POST", {
      from: FROM,
      to: [trip.email],
      subject: "Today on the " + secDisplay2(trip.section).split(" \xB7 ")[0] + ": your trip conditions",
      headers: listHeaders(links),
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1a2e3a">
            <h2 style="color:#1e7a6e">${escapeHtml(secDisplay2(trip.section))}</h2>
            <p>Conditions for your trip today, ${escapeHtml(prettyDate(trip.date))}:</p>
            <ul style="padding-left:18px;line-height:1.6">${rows.join("")}</ul>
            <p><a href="${link}" style="display:inline-block;background:#1e7a6e;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px">See where to stand and what to fish</a></p>
            <p style="font-size:13px;color:#555">Check posted signs and the regulations where you fish.</p>
            ${emailFooter(links, "You asked for this email when you planned a trip at herefishyfishy.ca.")}
          </div>`
    });
    if (sent.ok) {
      trip.sentAt = (/* @__PURE__ */ new Date()).toISOString();
      await env.SUBSCRIBERS.put(k.name, JSON.stringify(trip), { expirationTtl: 3 * 86400 });
    }
  }
}
__name(sendTripEmails, "sendTripEmails");
async function alertToken(env, id) {
  return unsubToken(env, "alert:" + id);
}
__name(alertToken, "alertToken");
async function resendUnsubscribed(env) {
  const out = /* @__PURE__ */ new Set();
  let after = null;
  for (let i = 0; i < 20; i++) {
    const r = await resend(env, "/contacts?limit=100" + (after ? "&after=" + after : ""), "GET");
    if (!r.ok) break;
    const j = await r.json();
    const rows = j.data || [];
    rows.forEach((c) => {
      if (c.unsubscribed) out.add(String(c.email).toLowerCase());
    });
    if (!j.has_more || !rows.length) break;
    after = rows[rows.length - 1].id;
  }
  return out;
}
__name(resendUnsubscribed, "resendUnsubscribed");
var RUN_ALERT_GAP_DAYS = 6;
async function allRecords(env) {
  const out = [];
  let cursor;
  do {
    const listed = await env.SUBSCRIBERS.list({ prefix: "sub:", cursor });
    for (const k of listed.keys) {
      const rec = await env.SUBSCRIBERS.get(k.name, "json");
      if (rec && rec.email) out.push(rec);
    }
    cursor = listed.list_complete ? null : listed.cursor;
  } while (cursor);
  return out;
}
__name(allRecords, "allRecords");
function runAlertCapped(rec) {
  return !!(rec.lastRunAlertAt && Date.now() - Date.parse(rec.lastRunAlertAt) < RUN_ALERT_GAP_DAYS * 864e5);
}
__name(runAlertCapped, "runAlertCapped");
async function runAlertRecipients(env, river, withCapped) {
  let recs = (await allRecords(env)).filter((rec) => !rec.unsubscribed && (rec.runRivers || []).indexOf(river) !== -1);
  if (recs.length) {
    const gone = await resendUnsubscribed(env);
    recs = recs.filter((r) => !gone.has(r.email));
  }
  const send = recs.filter((r) => !runAlertCapped(r)).map((r) => r.email);
  if (!withCapped) return send;
  return { send, capped: recs.filter(runAlertCapped).map((r) => r.email) };
}
__name(runAlertRecipients, "runAlertRecipients");
async function notifyAlertDrafts(env) {
  if (!env.CACHE) return;
  const listed = await env.CACHE.list({ prefix: "alert:draft:" });
  for (const k of listed.keys) {
    const d = await env.CACHE.get(k.name, "json");
    if (!d || d.notifiedAt || d.sentAt) continue;
    const id = k.name.slice("alert:draft:".length);
    const url = PROXY_PUBLIC + "/alerts/approve?id=" + encodeURIComponent(id) + "&t=" + await alertToken(env, id);
    const rr = await runAlertRecipients(env, d.river, true);
    const n = rr.send.length;
    await resend(env, "/emails", "POST", {
      from: FROM,
      to: [OWNER_EMAIL],
      subject: "Approve run alert: " + d.river + " (" + n + " subscriber" + (n === 1 ? "" : "s") + ")",
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a2e3a">
            <p><strong>Draft run alert for the ${escapeHtml(d.river)}.</strong> Nothing has been sent. ${n} subscriber${n === 1 ? "" : "s"} would get it.${rr.capped.length ? ` ${rr.capped.length} more had a run alert in the last 6 days and will be skipped.` : ""}</p>
            <p><a href="${url}" style="display:inline-block;background:#1e7a6e;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px">Review and send</a></p>
            ${d.why ? `<p style="font-size:13px;color:#555"><strong>Why it was drafted:</strong> ${escapeHtml(d.why)}</p>` : ""}
            <hr><p style="color:#555">Subject: ${escapeHtml(d.subject)}</p>${d.html}
          </div>`
    });
    d.notifiedAt = (/* @__PURE__ */ new Date()).toISOString();
    await env.CACHE.put(k.name, JSON.stringify(d), { expirationTtl: 21 * 86400 });
  }
}
__name(notifyAlertDrafts, "notifyAlertDrafts");
function htmlPage(title, inner) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${escapeHtml(title)}</title>
<style>body{font:16px/1.5 -apple-system,Segoe UI,Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px 16px;color:#1a2e3a;background:#fbf9f5}
button{font:600 1rem/1 inherit;background:#1e7a6e;color:#fff;border:0;border-radius:8px;padding:.9rem 1.4rem}
.box{border:1px solid #e2ded6;background:#fff;padding:16px;border-radius:8px;margin:16px 0}</style></head><body>${inner}</body></html>`,
    { headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store" } }
  );
}
__name(htmlPage, "htmlPage");
async function handleAlertApprove(request, env, url) {
  const id = url.searchParams.get("id") || "";
  const t = url.searchParams.get("t") || "";
  if (!id || !sameString(t, await alertToken(env, id))) return htmlPage("Link not valid", "<h1>This link isn't valid</h1>");
  const key = "alert:draft:" + id;
  const d = await env.CACHE.get(key, "json");
  if (!d) return htmlPage("Not found", "<h1>That draft no longer exists</h1>");
  if (d.sentAt) return htmlPage("Already sent", `<h1>Already sent</h1><p>Sent to ${d.sentTo} subscriber(s) on ${escapeHtml(d.sentAt)}.</p>`);
  const recipients = await runAlertRecipients(env, d.river);
  if (request.method !== "POST") {
    return htmlPage("Review run alert", `<h1>Run alert: ${escapeHtml(d.river)}</h1>
      <p>${recipients.length} subscriber${recipients.length === 1 ? "" : "s"} will get this.</p>
      <div class="box"><p><strong>${escapeHtml(d.subject)}</strong></p>${d.html}</div>
      <form method="post"><button type="submit">Send to ${recipients.length} subscriber${recipients.length === 1 ? "" : "s"}</button></form>
      <p style="font-size:14px;color:#6b7d86">To change the wording, reply in the Claude project and ask for a new draft. Drafts expire after 3 weeks.</p>`);
  }
  let sentTo = 0;
  for (let i = 0; i < recipients.length; i += 100) {
    const batch = [];
    for (const e of recipients.slice(i, i + 100)) {
      const links = await unsubLinks(env, e);
      batch.push({
        from: FROM,
        to: [e],
        subject: d.subject,
        headers: listHeaders(links),
        topic_id: TOPIC_RUN,
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1a2e3a">${d.html}
          ${emailFooter(links, "You're getting this because you asked for run alerts for the " + d.river + " at herefishyfishy.ca.")}</div>`
      });
    }
    const r = await resend(env, "/emails/batch", "POST", batch);
    if (r.ok) {
      sentTo += batch.length;
      for (const e of recipients.slice(i, i + 100)) {
        const rec = await getRecord(env, e);
        if (rec) {
          rec.lastRunAlertAt = (/* @__PURE__ */ new Date()).toISOString();
          await env.SUBSCRIBERS.put("sub:" + e, JSON.stringify(rec));
        }
      }
    }
  }
  d.sentAt = (/* @__PURE__ */ new Date()).toISOString();
  d.sentTo = sentTo;
  await env.CACHE.put(key, JSON.stringify(d), { expirationTtl: 90 * 86400 });
  return htmlPage("Sent", `<h1>Sent</h1><p>The ${escapeHtml(d.river)} run alert went to ${sentTo} subscriber${sentTo === 1 ? "" : "s"}.</p>`);
}
__name(handleAlertApprove, "handleAlertApprove");
async function handleUnsubscribe(request, env, url) {
  if (request.method === "GET")
    return Response.redirect(SITE + "/unsubscribe/" + url.search, 302);
  if (request.method !== "POST")
    return jsonResponse({ error: "POST only" }, 405);
  let email = url.searchParams.get("e");
  let token = url.searchParams.get("t");
  if (!email || !token) {
    try {
      const body = await request.json();
      email = body.e;
      token = body.t;
    } catch (e) {
    }
  }
  if (!email || !token)
    return jsonResponse({ error: "missing" }, 400);
  const clean = String(email).toLowerCase().trim();
  if (!sameString(String(token), await unsubToken(env, clean)))
    return jsonResponse({ error: "invalid" }, 400);
  const key = "sub:" + clean;
  const existing = await env.SUBSCRIBERS.get(key);
  let record = { email: clean };
  if (existing) {
    try {
      record = JSON.parse(existing);
    } catch (e) {
    }
  }
  record.unsubscribed = true;
  record.outlook = false;
  record.runRivers = [];
  record.weekly = [];
  record.unsubscribedAt = (/* @__PURE__ */ new Date()).toISOString();
  await env.SUBSCRIBERS.put(key, JSON.stringify(record));
  const r = await resend(env, "/audiences/" + env.RESEND_AUDIENCE_ID + "/contacts/" + encodeURIComponent(clean), "PATCH", { unsubscribed: true });
  return jsonResponse({ ok: true, resend: r.status });
}
__name(handleUnsubscribe, "handleUnsubscribe");
var CVC_WQ_URL = "https://cvc.ca/water-quality-table/";
var CVC_STATIONS = {
  "Credit River at Mississaugua Golf and Country Club": { lat: 43.566, lng: -79.622 },
  "Credit River at Old Derry Road": { lat: 43.626, lng: -79.734 },
  "Credit River at Highway 10 N": { lat: 43.87, lng: -80.02 },
  "Credit River at Cataract Falls": { lat: 43.829, lng: -80.03 },
  "West Credit River at Belfountain Conservation Area": { lat: 43.795, lng: -80.01 }
};
function htmlText(s) {
  return String(s).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#0?39;|&rsquo;/g, "'").replace(/\s+/g, " ").trim();
}
__name(htmlText, "htmlText");
function parseCvcTable(html, label) {
  var re = new RegExp(label, "i");
  var tables = html.split(/<table/i).slice(1).map(function(t) {
    return t.split(/<\/table>/i)[0];
  });
  var body = tables.find(function(t) {
    return re.test(htmlText(t).slice(0, 300));
  });
  if (!body) return null;
  var out = {};
  (body.match(/<tr[\s\S]*?<\/tr>/gi) || []).forEach(function(row) {
    if (/<th[\s>]/i.test(row)) return;
    var cells = (row.match(/<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi) || []).map(htmlText);
    if (cells.length < 2 || !cells[0] || /^station$/i.test(cells[0])) return;
    var nums = cells.slice(1).map(function(c) {
      return parseFloat(c);
    }).filter(function(n) {
      return isFinite(n);
    });
    if (!nums.length) return;
    out[cells[0]] = { latest: nums[0], min: nums.length > 1 ? nums[1] : null, max: nums.length > 2 ? nums[2] : null };
  });
  return out;
}
__name(parseCvcTable, "parseCvcTable");
async function fetchCvcTemps() {
  var res = await fetch(CVC_WQ_URL, { headers: { "User-Agent": "HereFishyFishy/1.0 (herefishyfishy.ca)" } });
  if (!res.ok) throw new Error("CVC " + res.status);
  var html = await res.text();
  var water = parseCvcTable(html, "Water Temperature") || {};
  Object.keys(water).forEach(function(k) {
    var w = water[k];
    if (w.latest < -1 || w.latest > 35 || w.latest === 0 && w.min === 0 && w.max === 0) delete water[k];
  });
  return { updated: (/* @__PURE__ */ new Date()).toISOString(), source: "Credit Valley Conservation", water, air: parseCvcTable(html, "Air Temperature") || {}, html };
}
__name(fetchCvcTemps, "fetchCvcTemps");
async function handleWaterTemps(env) {
  var cached = env.CACHE ? await env.CACHE.get("wt:latest", "json") : null;
  if (cached && Date.now() - Date.parse(cached.updated) < 45 * 60 * 1e3) return jsonResponse(cached, 200, 900);
  try {
    var d = await fetchCvcTemps();
    delete d.html;
    if (env.CACHE) await env.CACHE.put("wt:latest", JSON.stringify(d));
    return jsonResponse(d, 200, 900);
  } catch (e) {
    if (cached) return jsonResponse(cached, 200, 300);
    return errorResponse("Water temperature unavailable: " + e.message, 502);
  }
}
__name(handleWaterTemps, "handleWaterTemps");
function torontoDate(d) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}
__name(torontoDate, "torontoDate");
async function logWaterTemps(env) {
  if (!env.CACHE) return;
  var d = await fetchCvcTemps();
  var html = d.html;
  delete d.html;
  await env.CACHE.put("wt:latest", JSON.stringify(d));
  var day = torontoDate(/* @__PURE__ */ new Date());
  var key = "wt:log:" + day;
  var log = await env.CACHE.get(key, "json") || { date: day, readings: [], airDaily: null };
  var pick = /* @__PURE__ */ __name(function(tbl) {
    var o = {};
    Object.keys(tbl || {}).forEach(function(k) {
      o[k] = tbl[k].latest;
    });
    return o;
  }, "pick");
  log.readings.push({ t: d.updated, water: pick(d.water), air: pick(d.air) });
  if (!log.airDaily) {
    log.airDaily = {};
    for (var name of Object.keys(CVC_STATIONS)) {
      var s = CVC_STATIONS[name];
      try {
        var r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + s.lat + "&longitude=" + s.lng + "&daily=temperature_2m_mean&past_days=60&forecast_days=1&timezone=America%2FToronto");
        var j = await r.json();
        if (j.daily) log.airDaily[name] = { time: j.daily.time, mean: j.daily.temperature_2m_mean };
      } catch (e) {
      }
    }
  }
  await env.CACHE.put(key, JSON.stringify(log), { expirationTtl: 400 * 86400 });
  if (!await env.CACHE.get("wt:debug")) {
    var i = html.search(/Water Temperature/i);
    await env.CACHE.put("wt:debug", html.slice(Math.max(0, i - 600), i + 3e3), { expirationTtl: 30 * 86400 });
  }
}
__name(logWaterTemps, "logWaterTemps");
function weeklyDeps(env, ctx) {
  return {
    FROM,
    SITE,
    torontoDate,
    listHeaders,
    emailFooter,
    listRecords: /* @__PURE__ */ __name(() => allRecords(env), "listRecords"),
    resendUnsubscribed: /* @__PURE__ */ __name(() => resendUnsubscribed(env), "resendUnsubscribed"),
    fetchJson: /* @__PURE__ */ __name(async (u) => {
      const r = await fetch(u);
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }, "fetchJson"),
    flow: /* @__PURE__ */ __name(async (gauge) => {
      const r = await handleFlow(new URL("https://x/flow?station=" + gauge), ctx);
      const j = await r.json();
      return j.flow != null ? j.flow : null;
    }, "flow"),
    lakeTemps: /* @__PURE__ */ __name(async () => {
      const r = await handleLakeTemps(new URL("https://x/lake-temps"), ctx);
      const j = await r.json();
      return j.temps || null;
    }, "lakeTemps"),
    liveWater: /* @__PURE__ */ __name(async () => env.CACHE ? env.CACHE.get("wt:latest", "json") : null, "liveWater"),
    unsubLinks: /* @__PURE__ */ __name((email) => unsubLinks(env, email), "unsubLinks"),
    sendBatch: /* @__PURE__ */ __name(async (batch, key) => (await resend(env, "/emails/batch", "POST", batch, { "Idempotency-Key": key })).ok, "sendBatch"),
    sendOwner: /* @__PURE__ */ __name((subject, html) => resend(env, "/emails", "POST", { from: FROM, to: [OWNER_EMAIL], subject, html }), "sendOwner"),
    putRecord: /* @__PURE__ */ __name((rec) => env.SUBSCRIBERS.put("sub:" + rec.email, JSON.stringify(rec)), "putRecord"),
    putLog: /* @__PURE__ */ __name((key, log) => env.CACHE ? env.CACHE.put(key, JSON.stringify(log), { expirationTtl: 120 * 86400 }) : null, "putLog")
  };
}
__name(weeklyDeps, "weeklyDeps");
async function maybeRunWeekly(env, ctx) {
  const now = /* @__PURE__ */ new Date();
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", weekday: "short", hour: "numeric", hourCycle: "h23" }).formatToParts(now);
  const wd = parts.find((p) => p.type === "weekday").value, hour = Number(parts.find((p) => p.type === "hour").value);
  if (wd !== "Thu" || hour !== 17 || !env.CACHE) return;
  const key = "alert:weekly:ran:" + torontoDate(now);
  if (await env.CACHE.get(key)) return;
  await env.CACHE.put(key, "1", { expirationTtl: 3 * 86400 });
  await runWeekly(env, weeklyDeps(env, ctx));
}
__name(maybeRunWeekly, "maybeRunWeekly");
var worker_default = {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(maybeRunWeekly(env, ctx));
    ctx.waitUntil(logWaterTemps(env));
    ctx.waitUntil(notifyAlertDrafts(env));
    const hour = Number(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", hour: "numeric", hourCycle: "h23" }).format(/* @__PURE__ */ new Date()));
    if (hour === 6) ctx.waitUntil(sendTripEmails(env, ctx));
  },
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }
    const url = new URL(request.url);
    const ssrResult = await handleSSR(request, env);
    if (ssrResult)
      return ssrResult;
    if (url.pathname === "/subscribe")
      return handleSubscribe(request, env);
    if (url.pathname === "/unsubscribe")
      return handleUnsubscribe(request, env, url);
    if (url.pathname === "/alerts/approve")
      return handleAlertApprove(request, env, url);
    const path = url.pathname;
    if (path === "/health")
      return jsonResponse({ status: "ok", version: "1.4.0", ts: (/* @__PURE__ */ new Date()).toISOString() });
    if (path === "/stocking")
      return handleStocking(url, ctx);
    if (path === "/flow")
      return handleFlow(url, ctx);
    if (path === "/fields")
      return handleFields();
    if (path === "/lake-temps")
      return handleLakeTemps(url, ctx);
    if (path === "/water-temps")
      return handleWaterTemps(env);
    return jsonResponse({ error: "Valid endpoints: /stocking, /flow, /health, /fields, /lake-temps, /water-temps, /subscribe, /unsubscribe, /alerts/approve" }, 404);
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
