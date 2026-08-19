// ---------------------------------------------------------------------------
// Scans the QR codes out of the rendered sign artwork and fetches what they
// point at, over the network, the way a phone would.
//
//   node build/check-live.mjs             # every sign
//   node build/check-live.mjs sign-01     # one sign
//
// This is the last link in the chain:
//
//   render-sign.mjs   the QR encodes the URL printed beside it
//   check-links.mjs   that URL matches a page the build produced
//   check-live.mjs    that URL is actually served, and serves the right page
//
// Run it before releasing artwork to the fabricator. Requires the print HTML in
// dist/print/, so run `npm run sign` first.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import YAML from 'yaml';
import puppeteer from 'puppeteer';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const filter = process.argv.slice(2).find((a) => !a.startsWith('--'));

const problems = [];
const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

try {
  const dir = path.join(ROOT, 'content');
  const files = (await fs.readdir(dir))
    .filter((f) => f.endsWith('.yml'))
    .filter((f) => !filter || f.includes(filter))
    .sort();

  for (const f of files) {
    const sign = YAML.parse(await fs.readFile(path.join(dir, f), 'utf8'));
    const artwork = path.join(ROOT, 'dist', 'print', `${sign.id}.html`);

    try { await fs.access(artwork); }
    catch {
      problems.push(`${sign.id}: no rendered artwork — run \`npm run sign\` first`);
      continue;
    }

    console.log(`\n▸ ${sign.id} — ${sign.title.en}`);

    const page = await browser.newPage();
    await page.setViewport({ width: 3600, height: 2400 });
    await page.goto(pathToFileURL(artwork).href, { waitUntil: 'networkidle0' });

    const codes = await page.evaluate(() =>
      [...document.querySelectorAll('[data-qr]')].map((el) => {
        const r = el.getBoundingClientRect();
        return { lang: el.dataset.qr, x: r.x, y: r.y, w: r.width, h: r.height };
      })
    );

    for (const c of codes) {
      const pad = 12;
      const shot = await page.screenshot({
        clip: { x: c.x - pad, y: c.y - pad, width: c.w + pad * 2, height: c.h + pad * 2 },
      });
      const png = PNG.sync.read(Buffer.from(shot));
      const url = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data;

      if (!url) { problems.push(`${sign.id} [${c.lang}]: QR code did not scan`); continue; }

      // Follow it the way a phone would, redirects and all.
      let res;
      try {
        res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'mill-river-trail-signage/1.0' } });
      } catch (e) {
        problems.push(`${sign.id} [${c.lang}]: ${url} could not be reached — ${e.message}`);
        continue;
      }

      if (!res.ok) {
        problems.push(`${sign.id} [${c.lang}]: ${url} returned HTTP ${res.status}`);
        continue;
      }
      if (!res.url.startsWith('https://')) {
        problems.push(`${sign.id} [${c.lang}]: ${url} ended up on ${res.url} — not HTTPS`);
        continue;
      }

      // The right page, in the right language — not just any 200.
      const html = await res.text();
      const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '';
      const expect = sign.title[c.lang];
      const langAttr = html.match(/<html[^>]*\blang="([^"]+)"/i)?.[1] ?? '';

      if (!title.includes(expect)) {
        problems.push(`${sign.id} [${c.lang}]: ${url} served "${title}", expected a page titled "${expect}"`);
        continue;
      }
      if (langAttr !== c.lang) {
        problems.push(`${sign.id} [${c.lang}]: ${url} served a page marked lang="${langAttr}"`);
        continue;
      }

      console.log(`  ✓ ${c.lang}  ${url}`);
      console.log(`      → HTTP ${res.status}  “${title}”  lang=${langAttr}`);
    }

    await page.close();
  }
} finally {
  await browser.close();
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log('\nEvery QR code on the artwork resolves to its live page over HTTPS.');
