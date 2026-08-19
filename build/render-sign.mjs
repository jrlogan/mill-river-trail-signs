// ---------------------------------------------------------------------------
// Renders a sign's YAML content to press-ready artwork.
//
//   node build/render-sign.mjs                 # all signs in content/
//   node build/render-sign.mjs sign-01         # one sign
//   node build/render-sign.mjs sign-01 --proof # also write a PNG proof
//
// Output lands in dist/print/.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadSign, signFiles } from './load-signs.mjs';
import QRCode from 'qrcode';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import { signHTML } from './sign-template.mjs';
import { PAGE } from './theme.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist', 'print');

const args = process.argv.slice(2);
const filter = args.find((a) => !a.startsWith('--'));
const wantProof = args.includes('--proof');

async function renderSign(file) {
  const sign = await loadSign(file);
  console.log(`\n▸ ${sign.id} — ${sign.title.en}  [${sign.status}]`);

  const qrOpts = { margin: 0, width: 600, errorCorrectionLevel: 'M',
                   color: { dark: '#000000', light: '#FAF7E1' } };
  const qrEn = await QRCode.toDataURL(sign.urls.en_full, qrOpts);
  const qrEs = await QRCode.toDataURL(sign.urls.es_full, qrOpts);

  // Signs 4-12 are being drafted before their artwork is sourced. Mark any
  // image that has no file yet so the template can show the layout with an
  // obvious gap, instead of a silently broken image.
  const subdir = sign.id.replace(/^sign-(\d+).*/, 'sign-$1');
  let missingArt = 0;
  for (const im of sign.sign.images) {
    try {
      await fs.access(path.join(ROOT, 'assets', 'images', subdir, im.file));
    } catch {
      im.missing = true;
      missingArt++;
    }
  }
  if (missingArt) {
    console.log(`  ◻ ${missingArt} image(s) not sourced yet — drawn as placeholders`);
    if (sign.status !== 'draft') {
      console.error(`  ✗ status is "${sign.status}" but artwork is incomplete; keep it at "draft"`);
      process.exitCode = 1;
    }
  }

  // Technical drawings vary wildly in shape — an arch elevation can be 4:1
  // where a plan sheet is 3:2. Measure it so the slot can size itself instead
  // of stranding the drawing in a tall white box.
  const diagram = sign.sign.images.find((i) => i.slot === 'right_bottom');
  let diagramAspect = null;
  if (diagram && !diagram.missing) {
    try {
      const m = await sharp(path.join(ROOT, 'assets', 'images', subdir, diagram.file)).metadata();
      diagramAspect = m.width / m.height;
    } catch {
      console.warn(`  ⚠ could not measure ${diagram.file}; using the default slot height`);
    }
  }

  const html = signHTML(sign, { qrEn, qrEs, diagramAspect });
  await fs.mkdir(OUT, { recursive: true });
  const htmlPath = path.join(OUT, `${sign.id}.html`);
  await fs.writeFile(htmlPath, html);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--font-render-hinting=none', '--disable-lcd-text'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 3600, height: 2400, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    // Copy-fit: shrink a language column's body type just enough to fit its
    // box. Bilingual signs need this because Spanish runs longer than English
    // for the same content, and silently clipped text on a metal sign is not
    // recoverable. Anything shrunk is reported so it can be edited instead.
    const fitted = await page.evaluate(() => {
      const out = [];
      for (const box of document.querySelectorAll('.fitbox')) {
        const paras = box.querySelectorAll('.body-text');
        if (!paras.length) continue;
        let size = parseFloat(getComputedStyle(paras[0]).fontSize);
        const ratio = parseFloat(getComputedStyle(paras[0]).lineHeight) / size;
        const start = size;
        let guard = 60;
        while (box.scrollHeight > box.clientHeight && guard-- > 0 && size > 20 / 72 * 96) {
          size -= 0.25 / 72 * 96;
          for (const p of paras) {
            p.style.fontSize = size + 'px';
            p.style.lineHeight = size * ratio + 'px';
          }
        }
        if (size < start) {
          out.push({ lang: box.dataset.fit,
                     from: +(start / 96 * 72).toFixed(2),
                     to:   +(size  / 96 * 72).toFixed(2),
                     clipped: box.scrollHeight > box.clientHeight });
        }
      }
      return out;
    });
    for (const f of fitted) {
      const tag = f.clipped ? '✗ STILL CLIPPED' : '↓ auto-fit';
      console.log(`  ${tag}  ${f.lang.toUpperCase()} column ${f.from}pt → ${f.to}pt`);
      if (f.clipped) process.exitCode = 1;
    }

    // Scan the QR codes back out of the rendered artwork and confirm they
    // resolve to the URLs printed beside them. A QR that points somewhere wrong
    // is not fixable once the sign is fabricated.
    const qrBoxes = await page.evaluate(() =>
      [...document.querySelectorAll('[data-qr]')].map((el) => {
        const r = el.getBoundingClientRect();
        return { lang: el.dataset.qr, expect: el.dataset.qrExpect,
                 x: r.x, y: r.y, w: r.width, h: r.height };
      })
    );
    for (const q of qrBoxes) {
      const pad = 12;
      const buf = await page.screenshot({
        clip: { x: q.x - pad, y: q.y - pad, width: q.w + pad * 2, height: q.h + pad * 2 },
      });
      const png = PNG.sync.read(Buffer.from(buf));
      const got = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data;
      if (got === q.expect) {
        console.log(`  ✓ QR ${q.lang} scans to ${got}`);
      } else {
        console.error(`  ✗ QR ${q.lang} scanned "${got ?? 'unreadable'}", expected "${q.expect}"`);
        process.exitCode = 1;
      }
    }

    const pdfPath = path.join(OUT, `${sign.id}.pdf`);
    await page.pdf({
      path: pdfPath,
      width: `${PAGE.width}in`,
      height: `${PAGE.height}in`,
      printBackground: true,
      preferCSSPageSize: true,
    });
    const kb = ((await fs.stat(pdfPath)).size / 1024).toFixed(0);
    console.log(`  ✓ ${path.relative(ROOT, pdfPath)}  (${kb} KB, vector, ${PAGE.width}x${PAGE.height}in)`);

    if (wantProof) {
      const pngPath = path.join(OUT, `${sign.id}-proof.png`);
      await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 3600, height: 2400 } });
      console.log(`  ✓ ${path.relative(ROOT, pngPath)}  (100 dpi review proof)`);
    }
  } finally {
    await browser.close();
  }
}

const dir = path.join(ROOT, 'content');
const files = (await fs.readdir(dir))
  .filter((f) => f.endsWith('.yml') && !f.startsWith('_'))
  .filter((f) => !filter || f.includes(filter))
  .map((f) => path.join(dir, f));

if (!files.length) { console.error('No matching content files.'); process.exit(1); }
for (const f of files) await renderSign(f);
console.log('\nDone.');
