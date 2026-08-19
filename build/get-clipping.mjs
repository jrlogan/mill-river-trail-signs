// ---------------------------------------------------------------------------
// Cuts a newspaper clipping out of a Library of Congress page scan.
//
//   node build/get-clipping.mjs <lccn> <date> <page> "<phrase>" <sign> <name>
//
//   node build/get-clipping.mjs sn82015483 1885-05-07 2 "Fenian" sign-01 ram-1885
//
// The Library of Congress blocks direct fetches of Chronicling America page
// images, but its item API exposes the IIIF image service and the ALTO OCR XML,
// and neither of those is blocked. So: search the OCR for your phrase, take the
// coordinates of the lines that matched, scale them from ALTO units to image
// pixels, and ask IIIF for that region.
//
// Writes assets/images/<sign>/clipping-<name>.jpg and prints the OCR text of
// the matching lines so you can write a caption from it.
//
// Chronicling America content of this age is in the public domain, but cite it:
// paper, date and page.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'mill-river-trail-signage/1.0 (interpretive signage research)';

const [lccn, date, pageArg, phrase, sign, name] = process.argv.slice(2);
if (!lccn || !date || !pageArg || !phrase || !sign || !name) {
  console.error('usage: get-clipping.mjs <lccn> <date> <page> "<phrase>" <sign> <name>');
  process.exit(1);
}
const pageNo = Number(pageArg);

async function get(url, { json = false, tries = 5 } = {}) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return json ? res.json() : Buffer.from(await res.arrayBuffer());
    } catch (e) {
      // The LoC image service rate-limits; backing off is normal, not a failure.
      if (i >= tries) throw e;
      const wait = i * 8000;
      console.log(`    ${e.message}; retrying in ${wait / 1000}s`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

const item = await get(`https://www.loc.gov/item/${lccn}/${date}/ed-1/?fo=json`, { json: true });
const pages = item.resources?.[0]?.files || [];
if (pages.length < pageNo) {
  console.error(`page ${pageNo} not in this issue (it has ${pages.length})`);
  process.exit(1);
}
const files = pages[pageNo - 1];
const xmlUrl = files.find((f) => f.mimetype === 'text/xml')?.url;
const jp2 = files.find((f) => f.mimetype === 'image/jp2');
const iiif = files.find((f) => f.mimetype === 'image/jpeg')?.url.split('/full/')[0];
if (!xmlUrl || !jp2 || !iiif) { console.error('page is missing OCR or image services'); process.exit(1); }

const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@' })
  .parse((await get(xmlUrl)).toString('utf8'));

// Walk the ALTO tree collecting every TextLine with its text and box.
const lines = [];
(function walk(node) {
  if (!node || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    for (const el of Array.isArray(v) ? v : [v]) {
      if (k === 'TextLine' && el?.['@HPOS'] != null) {
        const words = [];
        (function strings(n) {
          if (!n || typeof n !== 'object') return;
          for (const [kk, vv] of Object.entries(n)) {
            for (const e of Array.isArray(vv) ? vv : [vv]) {
              if (kk === 'String' && e?.['@CONTENT'] != null) words.push(e['@CONTENT']);
              else strings(e);
            }
          }
        })(el);
        lines.push({
          x: +el['@HPOS'], y: +el['@VPOS'], w: +el['@WIDTH'], h: +el['@HEIGHT'],
          text: words.join(' '),
        });
      }
      walk(el);
    }
  }
})(xml);

const page = (function find(n) {
  if (!n || typeof n !== 'object') return null;
  for (const [k, v] of Object.entries(n)) {
    for (const el of Array.isArray(v) ? v : [v]) {
      if (k === 'Page' && el?.['@WIDTH']) return el;
      const r = find(el);
      if (r) return r;
    }
  }
  return null;
})(xml);

const aw = +page['@WIDTH'], ah = +page['@HEIGHT'];
const re = new RegExp(phrase, 'i');
let hits = lines.filter((l) => re.test(l.text));
if (!hits.length) { console.error(`"${phrase}" not found on page ${pageNo}`); process.exit(1); }

// Advertisements repeat a word all over a page. Keep the densest cluster so the
// crop is the article, not the whole sheet.
hits.sort((a, b) => a.y - b.y);
const median = hits[Math.floor(hits.length / 2)].y;
hits = hits.filter((l) => Math.abs(l.y - median) < 9000);

// A phrase usually lands near the top of the item it belongs to, so pad much
// harder below than above. When only a line or two matched there is more of the
// article still to come, so widen further.
const PADX = 220;
const PAD_UP = 600;
const PAD_DOWN = hits.length < 3 ? 4200 : 1400;
const x0 = Math.max(0, Math.min(...hits.map((l) => l.x)) - PADX);
const x1 = Math.min(aw, Math.max(...hits.map((l) => l.x + l.w)) + PADX);
const y0 = Math.max(0, Math.min(...hits.map((l) => l.y)) - PAD_UP);
const y1 = Math.min(ah, Math.max(...hits.map((l) => l.y + l.h)) + PAD_DOWN);

const sx = jp2.width / aw, sy = jp2.height / ah;
const region = [x0 * sx, y0 * sy, (x1 - x0) * sx, (y1 - y0) * sy].map(Math.round);

console.log(`\n▸ ${lccn} ${date} page ${pageNo} — ${hits.length} matching lines`);
console.log(`  crop ${region.join(',')} of ${jp2.width}x${jp2.height}\n`);
for (const l of hits) console.log(`  | ${l.text}`);

const out = path.join(ROOT, 'assets', 'images', sign, `clipping-${name}.jpg`);
await fs.mkdir(path.dirname(out), { recursive: true });
await fs.writeFile(out, await get(`${iiif}/${region.join(',')}/pct:85/0/default.jpg`));
console.log(`\n  ✓ ${path.relative(ROOT, out)}`);
console.log(`  cite: ${item.item?.title || lccn}, ${date}, page ${pageNo}`);
