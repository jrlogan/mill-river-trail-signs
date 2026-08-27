// ---------------------------------------------------------------------------
// Draws the whole-trail overview map: every sign this project is making, and
// every sign already standing on the trail, on one picture.
//
//   node build/make-overview-map.mjs            # uses cached OSM data
//   node build/make-overview-map.mjs --force    # refetch from Overpass
//
// Writes assets/images/overview-map.svg, which the web pages embed.
//
// Data © OpenStreetMap contributors, ODbL. The attribution is drawn onto the
// map and must stay there.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { COLOR } from './theme.mjs';
import { loadSign, signFiles } from './load-signs.mjs';
import {
  fetchOSM, makeProjection, classify, geometriesOf, pathData, isClosed, t, escXML,
} from './osm.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');

// The trail runs north-south, so the map is tall. Padding keeps markers off the
// edge and gives the labels somewhere to sit.
const PAD_LAT = 0.004;
const PAD_LON = 0.006;

const files = await signFiles();
const signs = [];
for (const f of files) signs.push(await loadSign(f));

const existing = YAML.parse(
  await fs.readFile(path.join(ROOT, 'content', '_existing-signs.yml'), 'utf8')
);
const existingPoints = existing.groups.flatMap((g) =>
  g.signs.map((s) => ({ ...s, group: g.name.en }))
);

// --- frame ------------------------------------------------------------------

const lats = [...signs.map((s) => s.location.lat), ...existingPoints.map((s) => s.lat)];
const lons = [...signs.map((s) => s.location.lon), ...existingPoints.map((s) => s.lon)];
const bbox = [
  Math.min(...lats) - PAD_LAT,
  Math.min(...lons) - PAD_LON,
  Math.max(...lats) + PAD_LAT,
  Math.max(...lons) + PAD_LON,
];

const [s0, w0, n0, e0] = bbox;
const spanLat = n0 - s0;
const spanLon = (e0 - w0) * Math.cos((((n0 + s0) / 2) * Math.PI) / 180);
const size = { w: 1000, h: Math.round((1000 * spanLat) / spanLon) };
const p = makeProjection(bbox, size);

console.log(`▸ overview: ${signs.length} project signs, ${existingPoints.length} existing`);
console.log(`  frame ${spanLat.toFixed(4)}° x ${spanLon.toFixed(4)}° → ${size.w}x${size.h}`);

const data = await fetchOSM('overview', bbox, { force, redraw: !force });

// --- draw -------------------------------------------------------------------

const buckets = { green: [], wetland: [], waterArea: [], waterLine: [],
                  roadMinor: [], roadMajor: [], rail: [], path: [] };
const riverLabels = [];

for (const el of data.elements) {
  const cls = classify(el);
  if (!cls || !buckets[cls]) continue;
  const rings = geometriesOf(el);
  if (!rings.length) continue;
  const areaish = ['green', 'wetland', 'waterArea'].includes(cls);
  buckets[cls].push(
    rings.map((r) => pathData(r, p, areaish && (isClosed(r) || rings.length > 1))).join('')
  );
  if (cls === 'waterLine' && t(el).name === 'Mill River') riverLabels.push(rings[0]);
}

const group = (cls, attrs) =>
  buckets[cls].length
    ? `<g ${attrs}>${buckets[cls].map((d) => `<path d="${d}"/>`).join('')}</g>`
    : '';

// The ten get solid numbered markers, 1 at the dam down to 10 at the mouth, so
// the map reads as a walk. Signs held in reserve get a smaller hollow marker —
// visible, but plainly not part of the sequence. Existing signs are plain dots,
// so the eye can separate all three at a glance.
const projectMarkers = signs
  .map((s) => {
    const x = p.x(s.location.lon), y = p.y(s.location.lat);
    if (!s.walk) {
      return `
  <g class="mk mk-alt" data-sign="${escXML(s.id)}">
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="#fff" stroke="#E03127" stroke-width="3.5"/>
  </g>`;
    }
    return `
  <g class="mk" data-sign="${escXML(s.id)}">
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17" fill="#E03127" stroke="#fff" stroke-width="3.5"/>
    <text x="${x.toFixed(1)}" y="${(y + 6.5).toFixed(1)}" text-anchor="middle"
          font-family="Archivo, sans-serif" font-weight="800" font-size="18" fill="#fff">${s.walk}</text>
  </g>`;
  })
  .join('');

const existingMarkers = existingPoints
  .map((s, i) => {
    const x = p.x(s.lon), y = p.y(s.lat);
    return `  <circle class="ex" data-i="${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}"
          r="8" fill="#5E7A34" stroke="#fff" stroke-width="2.5"><title>${escXML(s.title)}</title></circle>`;
  })
  .join('\n');

const scaleM = 500;
const barPx = ((scaleM / 111320) / spanLat) * size.h;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.w} ${size.h}"
     role="img" aria-label="Map of the Mill River Trail showing thirteen planned signs and eighteen signs already standing">
  <rect width="${size.w}" height="${size.h}" fill="${COLOR.blueLight}"/>

  ${group('green',     `fill="${COLOR.green}" fill-opacity=".5" stroke="none" fill-rule="evenodd"`)}
  ${group('wetland',   `fill="${COLOR.green}" fill-opacity=".22" stroke="${COLOR.green}" stroke-width="1.2" stroke-dasharray="4 3"`)}
  ${group('waterArea', `fill="#1B6FA8" stroke="none" fill-rule="evenodd"`)}
  ${group('waterLine', `fill="none" stroke="#1B6FA8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"`)}
  ${group('roadMinor', `fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-opacity=".8" stroke-linecap="round"`)}
  ${group('roadMajor', `fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`)}
  ${group('rail',      `fill="none" stroke="#5A6068" stroke-width="2" stroke-dasharray="9 6"`)}
  ${group('path',      `fill="none" stroke="${COLOR.gold}" stroke-width="3" stroke-dasharray="8 5" stroke-linecap="round"`)}

${existingMarkers}
${projectMarkers}

  <g transform="translate(34 ${size.h - 54})">
    <line x1="0" y1="0" x2="${barPx.toFixed(1)}" y2="0" stroke="#15191C" stroke-width="3.5"/>
    <line x1="0" y1="-6" x2="0" y2="6" stroke="#15191C" stroke-width="3.5"/>
    <line x1="${barPx.toFixed(1)}" y1="-6" x2="${barPx.toFixed(1)}" y2="6" stroke="#15191C" stroke-width="3.5"/>
    <text x="0" y="20" font-family="Archivo, sans-serif" font-weight="700" font-size="15" fill="#15191C"
          stroke="${COLOR.blueLight}" stroke-width="4" paint-order="stroke">${scaleM} m</text>
  </g>
  <g transform="translate(${size.w - 46} 46)">
    <path d="M0 -24 L9 13 L0 6 L-9 13 Z" fill="#15191C" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
    <text x="0" y="32" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800"
          font-size="16" fill="#15191C" stroke="${COLOR.blueLight}" stroke-width="3.5" paint-order="stroke">N</text>
  </g>
  <text x="34" y="${size.h - 16}" font-family="Source Sans 3, sans-serif" font-size="14" fill="#2A3238"
        stroke="${COLOR.blueLight}" stroke-width="3.5" paint-order="stroke">© OpenStreetMap contributors</text>
</svg>
`;

const out = path.join(ROOT, 'assets', 'images', 'overview-map.svg');
await fs.writeFile(out, svg);
console.log(`  ✓ ${path.relative(ROOT, out)}  (${(svg.length / 1024).toFixed(0)} KB)`);
