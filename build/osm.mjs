// ---------------------------------------------------------------------------
// Shared OpenStreetMap machinery: fetching, caching, projecting and
// classifying. Used by the per-sign locator panels (make-map.mjs) and by the
// trail overview map (make-overview-map.mjs), so the two cannot drift apart in
// what they consider a river or a road.
//
// Data © OpenStreetMap contributors, ODbL.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const CACHE = path.join(ROOT, '.cache', 'osm');
const OVERPASS = 'https://overpass-api.de/api/interpreter';

// --- geometry ---------------------------------------------------------------

export const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 180 / 2));

export function makeProjection(bbox, size) {
  const [s, w, n, e] = bbox;
  const y0 = merc(n), y1 = merc(s);
  return {
    x: (lon) => ((lon - w) / (e - w)) * size.w,
    y: (lat) => ((merc(lat) - y0) / (y1 - y0)) * size.h,
  };
}

export function bboxFor(lat, lon, span, aspect) {
  const half = span / 2;
  // Longitude degrees shrink with latitude, so widen by 1/cos(lat) to keep the
  // drawn map square-on rather than stretched.
  const spanLon = (span * aspect) / Math.cos((lat * Math.PI) / 180);
  return [lat - half, lon - spanLon / 2, lat + half, lon + spanLon / 2];
}

export function query(bbox) {
  const b = bbox.join(',');
  return `[out:json][timeout:90];
(
  way["natural"="water"](${b});
  way["waterway"="riverbank"](${b});
  relation["natural"="water"](${b});
  way["waterway"~"^(river|stream|tidal_channel|canal)$"](${b});
  way["natural"~"^(wetland|wood|scrub)$"](${b});
  way["leisure"~"^(park|nature_reserve|pitch|garden)$"](${b});
  way["landuse"~"^(grass|forest|recreation_ground|cemetery|meadow)$"](${b});
  way["railway"~"^(rail|light_rail|disused|abandoned)$"](${b});
  way["highway"~"^(motorway|motorway_link|trunk|trunk_link|primary|secondary|tertiary|residential|unclassified)$"](${b});
  way["highway"~"^(path|cycleway)$"](${b});
  way["highway"="footway"]["name"](${b});
);
out geom;`;
}

export async function fetchOSM(id, bbox, opts = {}) {
  await fs.mkdir(CACHE, { recursive: true });
  const file = path.join(CACHE, `${id}.json`);
  if (!opts.force || opts.redraw) {
    try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch {
      if (opts.redraw) throw new Error(`no cached OSM data for ${id}; run without --redraw first`);
    }
  }
  process.stdout.write(`  … querying Overpass for ${id} `);

  // Overpass is a shared public service and rate-limits or times out under
  // load. Twelve signs is twelve chances to hit that, so back off and retry
  // rather than failing the build on someone else's busy minute.
  let json;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(OVERPASS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'mill-river-trail-signage/1.0 (interpretive signage build)',
        },
        body: new URLSearchParams({ data: query(bbox) }),
      });
      if (!res.ok) throw new Error(`Overpass ${res.status} ${res.statusText}`);
      json = await res.json();
      break;
    } catch (e) {
      if (attempt >= 4) throw e;
      const wait = attempt * 5000;
      process.stdout.write(`\n    ${e.message}; retrying in ${wait / 1000}s `);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  await fs.writeFile(file, JSON.stringify(json));
  console.log(`(${json.elements.length} features)`);
  return json;
}

export const t = (e = {}) => e.tags || {};

export const escXML = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function classify(el) {
  const g = t(el);
  if (g.natural === 'water' || g.waterway === 'riverbank') return 'waterArea';
  if (g.waterway) return 'waterLine';
  if (g.natural === 'wetland') return 'wetland';
  if (['wood', 'scrub'].includes(g.natural)) return 'green';
  if (['park', 'nature_reserve', 'garden', 'pitch'].includes(g.leisure)) return 'green';
  if (['grass', 'forest', 'recreation_ground', 'cemetery', 'meadow'].includes(g.landuse)) return 'green';
  if (g.railway) return 'rail';
  // Sidewalks are tagged footway too, and drawing them all buries the river.
  // Keep cycleways, paths, and anything actually named as a trail.
  if (g.highway === 'cycleway' || g.highway === 'path') return 'path';
  if (g.highway === 'footway') return /trail|greenway|walk/i.test(g.name || '') ? 'path' : null;
  if (g.highway) return ['motorway', 'trunk', 'primary', 'secondary'].includes(g.highway.replace('_link', ''))
    ? 'roadMajor' : 'roadMinor';
  return null;
}

export const isClosed = (geom) =>
  geom.length > 3 &&
  geom[0].lat === geom.at(-1).lat &&
  geom[0].lon === geom.at(-1).lon;

// A relation's member ways are separate rings — outer boundaries and holes.
// Concatenating them into one polyline draws a shape that never existed.
export function geometriesOf(el) {
  if (el.geometry?.length) return [el.geometry];
  return (el.members || []).map((m) => m.geometry).filter((g) => g?.length);
}

export function pathData(geom, p, close) {
  let d = '';
  for (let i = 0; i < geom.length; i++) {
    const g = geom[i];
    d += `${i ? 'L' : 'M'}${p.x(g.lon).toFixed(1)} ${p.y(g.lat).toFixed(1)}`;
  }
  return close ? d + 'Z' : d;
}

