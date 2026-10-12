// Renders the handout's two artboards into one 2-page Letter PDF for
// double-sided printing: page 1 front, page 2 back.
//
//   node build/make-handout-pdf.mjs <artifact.html> <out.pdf>
//
// Both pages come out of a single document rather than two PDFs stitched
// together, so no merge step (and no merge tool) is involved.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const [srcPath, outPath] = process.argv.slice(2);
const PAGES = ['Main.dc.html', 'HandoutBack.dc.html']; // front, then back

const html = fs.readFileSync(srcPath, 'utf8');
const open = html.indexOf('id="appifact-doc">') + 'id="appifact-doc">'.length;
const files = JSON.parse(html.slice(open, html.indexOf('</script', open))).content.files;

// Stage the assets so each artboard's relative src= resolves.
const stage = fs.mkdtempSync(path.join(process.cwd(), '.pdf-'));
for (const [k, v] of Object.entries(files)) {
  if (/\.(png|jpe?g)$/.test(k)) fs.writeFileSync(path.join(stage, k), Buffer.from(v, 'base64'));
}

const artboard = (src) => src.replace(/<helmet>[\s\S]*?<\/helmet>/, '').match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1];
// The two artboards ship identical <helmet> blocks, so one copy serves both.
const helmet = (files[PAGES[0]].match(/<helmet>([\s\S]*?)<\/helmet>/) || [, ''])[1];

const doc = `<!doctype html>
<html><head><meta charset="utf-8">
${helmet}
<style>
  /* 816x1056 CSS px is exactly 8.5x11in at the 96dpi Chrome prints at, so the
     artboard lands on the sheet 1:1 with no scaling. */
  @page { size: 8.5in 11in; margin: 0; }
  html, body { margin: 0; padding: 0; }
  .sheet { width: 816px; height: 1056px; overflow: hidden; break-inside: avoid; }
  /* Break between the sheets only — a trailing break emits a blank third page. */
  .sheet + .sheet { break-before: page; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head><body>
${PAGES.map((f) => `<div class="sheet">${artboard(files[f])}</div>`).join('\n')}
</body></html>`;

const docPath = path.join(stage, 'handout.html');
fs.writeFileSync(docPath, doc);

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--font-render-hinting=none'] });
const page = await browser.newPage();
await page.goto('file://' + docPath, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
const missing = await page.evaluate(() =>
  [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')));
if (missing.length) throw new Error('images did not load: ' + missing.join(', '));

await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
await page.pdf({ path: outPath, printBackground: true, preferCSSPageSize: true });

// Proof sheets of the same composed document the PDF came from, one per side,
// so the result can be eyeballed without a PDF rasteriser on the box.
if (process.argv.includes('--proof')) {
  await page.setViewport({ width: 816, height: 1056 });
  for (const [i, el] of (await page.$$('.sheet')).entries()) {
    await el.screenshot({ path: outPath.replace(/\.pdf$/, `-proof-${i + 1}.png`) });
  }
}
await browser.close();
fs.rmSync(stage, { recursive: true, force: true });

const bytes = fs.readFileSync(outPath);
const pages = (bytes.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
const box = (bytes.toString('latin1').match(/\/MediaBox\s*\[([^\]]+)\]/) || [, '?'])[1].trim();
console.log(`${outPath}  ${(bytes.length / 1024).toFixed(0)} KB  ${pages} pages  MediaBox [${box}] pt`);
