// ---------------------------------------------------------------------------
// Generates the "You Are Here" locator panel for a sign from OpenStreetMap.
//
//   node build/make-map.mjs                # every sign missing a map
//   node build/make-map.mjs sign-01        # one sign
//   node build/make-map.mjs --redraw       # restyle from cached data, no network
//   node build/make-map.mjs --force        # refetch from Overpass
//
// Writes assets/images/sign-NN/panel-map.svg, drawn in the sign system's
// palette and framed to the panel's aspect ratio. OSM data is cached under
// .cache/osm/ so rebuilds don't re-hit the Overpass API.
//
// Data © OpenStreetMap contributors, ODbL. The attribution is printed on the
// map itself — the licence requires it and it must stay there.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSign, signFiles } from './load-signs.mjs';
import { COLOR, GRID } from './theme.mjs';
import { LAYOUT, speciesTop } from './sign-template.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.cache', 'osm');
const OVERPASS = 'https://overpass-api.de/api/interpreter';

const args = process.argv.slice(2);
const filter = args.find((a) => !a.startsWith('--'));
const force = args.includes('--force');
// Redraw the SVGs from cached OSM data without touching the network. Use this
// after a styling change — refetching would hammer a shared public service for
// data that has not changed.
const redraw = args.includes('--redraw');

// Panel slot, in inches. Taken from the sign template so the map is always cut
// to the shape of the hole it goes into.
const PANEL = { w: GRID.panel, h: LAYOUT.panel.map.h };
const ASPECT = PANEL.w / PANEL.h;

// How much ground the panel covers, north to south, in degrees of latitude.
// ~0.018 deg is a little under 2 km — enough to place the sign in the city
// without losing the river to hairlines.
const SPAN_LAT = 0.018;

// --- geometry ---------------------------------------------------------------

const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 180 / 2));

function makeProjection(bbox, size) {
  const [s, w, n, e] = bbox;
  const y0 = merc(n), y1 = merc(s);
  return {
    x: (lon) => ((lon - w) / (e - w)) * size.w,
    y: (lat) => ((merc(lat) - y0) / (y1 - y0)) * size.h,
  };
}

function bboxFor(lat, lon) {
  const half = SPAN_LAT / 2;
  // Longitude degrees shrink with latitude, so widen by 1/cos(lat) to keep the
  // drawn map square-on rather than stretched.
  const spanLon = (SPAN_LAT * ASPECT) / Math.cos((lat * Math.PI) / 180);
  return [lat - half, lon - spanLon / 2, lat + half, lon + spanLon / 2];
}

// --- data -------------------------------------------------------------------

function query(bbox) {
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

async function fetchOSM(id, bbox) {
  await fs.mkdir(CACHE, { recursive: true });
  const file = path.join(CACHE, `${id}.json`);
  if (!force || redraw) {
    try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch {
      if (redraw) throw new Error(`no cached OSM data for ${id}; run without --redraw first`);
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

// --- drawing ----------------------------------------------------------------

const t = (e = {}) => e.tags || {};

const escXML = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function classify(el) {
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

const isClosed = (geom) =>
  geom.length > 3 &&
  geom[0].lat === geom.at(-1).lat &&
  geom[0].lon === geom.at(-1).lon;

// A relation's member ways are separate rings — outer boundaries and holes.
// Concatenating them into one polyline draws a shape that never existed.
function geometriesOf(el) {
  if (el.geometry?.length) return [el.geometry];
  return (el.members || []).map((m) => m.geometry).filter((g) => g?.length);
}

function pathData(geom, p, close) {
  let d = '';
  for (let i = 0; i < geom.length; i++) {
    const g = geom[i];
    d += `${i ? 'L' : 'M'}${p.x(g.lon).toFixed(1)} ${p.y(g.lat).toFixed(1)}`;
  }
  return close ? d + 'Z' : d;
}

function buildSVG(sign, data, bbox) {
  const size = { w: 1000, h: Math.round(1000 / ASPECT) };
  const p = makeProjection(bbox, size);

  const buckets = {
    green: [], wetland: [], waterArea: [], waterLine: [],
    roadMinor: [], roadMajor: [], rail: [], path: [],
  };

  const me = { x: p.x(sign.location.lon), y: p.y(sign.location.lat) };

  const labels = [];
  for (const el of data.elements) {
    const geom = el.geometry || (el.members || [])[0]?.geometry;
    if (!geom?.length) continue;
    const cls = classify(el);
    if (!cls || !buckets[cls]) continue;
    const areaish = ['green', 'wetland', 'waterArea'].includes(cls);
    const rings = geometriesOf(el);
    // Rings of one area go into a single path so even-odd fill cuts the holes.
    buckets[cls].push(
      rings.map((r) => pathData(r, p, areaish && (isClosed(r) || rings.length > 1))).join('')
    );

    const name = t(el).name;
    if (name && (cls === 'roadMajor' || cls === 'waterLine' || cls === 'path')) {
      labels.push({ name, kind: cls, geom });
    }
  }

  // Street labels. A locator map that names nothing cannot orient anyone, but
  // one that names everything is unreadable at arm's length — so: longest
  // visible run per name, angled to the road, capped, and spaced apart.
  const placed = [];
  const labelSVG = [];

  // The sign lays the logo and the species boxes over the top of the map, so
  // those areas are dead space — a label placed there is a label nobody reads.
  // Fractions of the panel, matching LAYOUT.panel in sign-template.mjs.
  // Derived from the sign template rather than restated, so moving a box in the
  // layout moves the exclusion with it. Padded a little on each side.
  const P = LAYOUT.panel;
  const pad = 0.02;
  const rect = (x, y, w, h) => ({
    x0: x / PANEL.w - pad, y0: y / PANEL.h - pad,
    x1: (x + w) / PANEL.w + pad, y1: (y + h) / PANEL.h + pad,
  });
  const speciesCount = sign.sign.panel.species?.length ?? 0;
  const RESERVED = [
    rect(P.logo.x, P.logo.y, P.logo.w, P.logo.h),
    // Only reserved when the sign actually shows species boxes.
    ...(speciesCount
      ? [rect(P.species.x, speciesTop(P, speciesCount), P.species.w,
              speciesCount * P.species.itemH + (speciesCount - 1) * P.species.gap)]
      : []),
  ];
  // Test the whole run of the label, not just its anchor — a centred string
  // clears the box at its midpoint and still slides underneath it.
  const reserved = (q, halfW = 0) =>
    RESERVED.some((r) =>
      q.x + halfW > r.x0 * size.w && q.x - halfW < r.x1 * size.w &&
      q.y > r.y0 * size.h && q.y < r.y1 * size.h);

  // The marker carries two lines of type above it. A street label that clears
  // the marker itself can still land straight on "You Are Here".
  const markerBlock = { x0: me.x - 190, y0: me.y - 165, x1: me.x + 190, y1: me.y + 45 };
  const hitsMarker = (q, halfW) =>
    q.x + halfW > markerBlock.x0 && q.x - halfW < markerBlock.x1 &&
    q.y > markerBlock.y0 && q.y < markerBlock.y1;

  const inView = (q) => q.x > 70 && q.x < size.w - 70 && q.y > 90 && q.y < size.h - 90;

  const byName = new Map();
  for (const l of labels) {
    const pts = l.geom.map((g) => ({ x: p.x(g.lon), y: p.y(g.lat) })).filter(inView);
    if (pts.length < 2) continue;
    const a = pts[0], b = pts.at(-1);
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const prev = byName.get(l.name);
    if (!prev || len > prev.len) byName.set(l.name, { ...l, pts, len });
  }

  for (const l of [...byName.values()].sort((a, b) => b.len - a.len)) {
    if (placed.length >= 7) break;
    if (l.len < 140) continue;
    const mid = l.pts[Math.floor(l.pts.length / 2)];
    const a = l.pts[0], b = l.pts.at(-1);
    const halfW = l.name.length * (l.kind === 'waterLine' ? 24 : 20) * 0.29;
    if (hitsMarker(mid, halfW)) continue;      // keep clear of the marker and its label
    if (reserved(mid, halfW)) continue;        // keep clear of overlaid panel art
    if (placed.some((q) => Math.hypot(q.x - mid.x, q.y - mid.y) < 210)) continue;
    placed.push(mid);

    let deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    if (deg > 90) deg -= 180;
    if (deg < -90) deg += 180;

    const river = l.kind === 'waterLine';
    const trail = l.kind === 'path';
    // River names sit on the dark water fill, everything else on pale land, so
    // each needs the halo that contrasts with what is behind it.
    const style = river
      ? { face: 'Archivo', weight: 800, size: 24, italic: true,  fill: '#FFFFFF', halo: '#0F5A8A' }
      : trail
      ? { face: 'Archivo', weight: 800, size: 20, italic: false, fill: '#6B5A12', halo: '#FFFFFF' }
      : { face: 'Source Sans 3', weight: 600, size: 19, italic: false, fill: '#3D464D', halo: COLOR.blueLight };
    labelSVG.push(
      `<text transform="translate(${mid.x.toFixed(1)} ${mid.y.toFixed(1)}) rotate(${deg.toFixed(1)})" ` +
      `text-anchor="middle" dy="-7" font-family="${style.face}, sans-serif" ` +
      `font-weight="${style.weight}" font-size="${style.size}" ` +
      `${style.italic ? 'font-style="italic" ' : ''}fill="${style.fill}" ` +
      `stroke="${style.halo}" stroke-width="5" paint-order="stroke">` +
      `${escXML(l.name)}</text>`
    );
  }

  const group = (cls, attrs) =>
    buckets[cls].length
      ? `<g ${attrs}>${buckets[cls].map((d) => `<path d="${d}"/>`).join('')}</g>`
      : '';

  const yah = sign.sign.panel.you_are_here;

  // Scale bar: a clean 400 m, measured on the map's own projection.
  const metresPerDeg = 111320;
  const barDeg = 400 / metresPerDeg;
  const barPx = (barDeg / (bbox[2] - bbox[0])) * size.h;
  const barY = size.h - 64;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.w} ${size.h}"
     width="${PANEL.w}in" height="${PANEL.h}in" role="img"
     aria-label="Locator map of the Mill River showing the position of this sign">
  <rect width="${size.w}" height="${size.h}" fill="${COLOR.blueLight}"/>

  ${group('green',     `fill="${COLOR.green}" fill-opacity=".55" stroke="none" fill-rule="evenodd"`)}
  ${group('wetland',   `fill="${COLOR.green}" fill-opacity=".22" stroke="${COLOR.green}" stroke-width="1.5" stroke-dasharray="5 4"`)}
  ${group('waterArea', `fill="#1B6FA8" stroke="none" fill-rule="evenodd"`)}
  ${group('waterLine', `fill="none" stroke="#1B6FA8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"`)}

  ${group('roadMinor', `fill="none" stroke="#FFFFFF" stroke-width="3.4" stroke-opacity=".85" stroke-linecap="round"`)}
  ${group('roadMajor', `fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`)}
  ${group('rail',      `fill="none" stroke="#5A6068" stroke-width="2.6" stroke-dasharray="11 7"`)}
  ${group('path',      `fill="none" stroke="${COLOR.gold}" stroke-width="3.2" stroke-dasharray="9 6" stroke-linecap="round"`)}

  ${labelSVG.join('\n  ')}

  <!-- You Are Here -->
  <circle cx="${me.x.toFixed(1)}" cy="${me.y.toFixed(1)}" r="78" fill="#FFFFFF" fill-opacity=".62"/>
  <circle cx="${me.x.toFixed(1)}" cy="${me.y.toFixed(1)}" r="9" fill="#E03127" stroke="#FFFFFF" stroke-width="3"/>
  <g transform="translate(${me.x.toFixed(1)} ${(me.y - 22).toFixed(1)})">
    <path d="M0 0 L-24 -40 L-9 -40 L-9 -74 L9 -74 L9 -40 L24 -40 Z"
          fill="#E03127" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round"/>
  </g>
  <text x="${me.x.toFixed(1)}" y="${(me.y - 138).toFixed(1)}" text-anchor="middle"
        font-family="Archivo, sans-serif" font-weight="800" font-size="30" fill="#15191C"
        stroke="#FFFFFF" stroke-width="6" paint-order="stroke">${yah.en}</text>
  <text x="${me.x.toFixed(1)}" y="${(me.y - 108).toFixed(1)}" text-anchor="middle"
        font-family="Archivo, sans-serif" font-weight="600" font-style="italic" font-size="24" fill="#155C88"
        stroke="#FFFFFF" stroke-width="6" paint-order="stroke">${yah.es}</text>

  <!-- north arrow -->
  <g transform="translate(${size.w - 62} 62)">
    <path d="M0 -30 L11 16 L0 8 L-11 16 Z" fill="#15191C" stroke="#FFFFFF" stroke-width="2.5" stroke-linejoin="round"/>
    <text x="0" y="40" text-anchor="middle" font-family="Archivo, sans-serif"
          font-weight="800" font-size="20" fill="#15191C"
          stroke="#FFFFFF" stroke-width="4" paint-order="stroke">N</text>
  </g>

  <!-- scale -->
  <g transform="translate(40 ${barY})">
    <line x1="0" y1="0" x2="${barPx.toFixed(1)}" y2="0" stroke="#15191C" stroke-width="4"/>
    <line x1="0" y1="-7" x2="0" y2="7" stroke="#15191C" stroke-width="4"/>
    <line x1="${barPx.toFixed(1)}" y1="-7" x2="${barPx.toFixed(1)}" y2="7" stroke="#15191C" stroke-width="4"/>
    <text x="0" y="24" font-family="Archivo, sans-serif" font-weight="700" font-size="18" fill="#15191C"
          stroke="#FFFFFF" stroke-width="4" paint-order="stroke">400 m</text>
  </g>

  <!-- ODbL attribution. Bottom left, because the sign lays species boxes over
       the bottom right of the map and this credit must stay visible. -->
  <text x="40" y="${size.h - 16}" text-anchor="start"
        font-family="Source Sans 3, sans-serif" font-size="16" fill="#2A3238"
        stroke="${COLOR.blueLight}" stroke-width="4" paint-order="stroke">© OpenStreetMap contributors</text>
</svg>`;
}

// --- run --------------------------------------------------------------------

const dir = path.join(ROOT, 'content');
const files = (await fs.readdir(dir))
  .filter((f) => f.endsWith('.yml') && !f.startsWith('_'))
  .filter((f) => !filter || f.includes(filter));

for (const f of files) {
  const sign = await loadSign(path.join(dir, f));
  const sub = sign.id.replace(/^sign-(\d+).*/, 'sign-$1');
  const out = path.join(ROOT, 'assets', 'images', sub, 'panel-map.svg');

  if (!force && !redraw) {
    try { await fs.access(out); console.log(`▸ ${sign.id}: map exists, skipping (--redraw to restyle, --force to refetch)`); continue; } catch {}
  }

  console.log(`▸ ${sign.id} — ${sign.location.name}`);
  const bbox = bboxFor(sign.location.lat, sign.location.lon);
  const data = await fetchOSM(sign.id, bbox);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, buildSVG(sign, data, bbox));
  console.log(`  ✓ ${path.relative(ROOT, out)}`);
}
