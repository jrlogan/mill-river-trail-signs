// ---------------------------------------------------------------------------
// Makes web copies of the printed sign artwork, so each sign's page can show
// the sign it belongs to.
//
//   node build/make-sign-images.mjs            # only what's missing or stale
//   node build/make-sign-images.mjs --force
//
// Reads the proofs in dist/print/ (produced by `npm run sign -- --proof`) and
// writes assets/web/signs/. Those are committed, because CI builds the site
// without Chromium and cannot render artwork itself.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { loadSign, signFiles } from './load-signs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRINT = path.join(ROOT, 'dist', 'print');
const OUT = path.join(ROOT, 'assets', 'web', 'signs');
const force = process.argv.includes('--force');

// Wide enough that a reader can zoom in and actually read the sign's own
// columns, which is the point of showing it at all.
const WIDTH = 2000;

const stat = async (p) => { try { return await fs.stat(p); } catch { return null; } };

await fs.mkdir(OUT, { recursive: true });
let made = 0, skipped = 0, missing = 0;

for (const f of await signFiles()) {
  const sign = await loadSign(f);
  const from = path.join(PRINT, `${sign.id}-proof.png`);
  const to = path.join(OUT, `${sign.id}.jpg`);

  const a = await stat(from);
  const b = await stat(to);

  if (!a) {
    if (b) { skipped++; continue; }
    console.warn(`  ⚠ ${sign.id}: no proof — run \`npm run sign -- --proof\` first`);
    missing++;
    continue;
  }
  if (b && !force && b.mtimeMs >= a.mtimeMs) { skipped++; continue; }

  const buf = await sharp(from)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toBuffer();
  await fs.writeFile(to, buf);
  console.log(`  ✓ ${sign.id}.jpg  ${Math.round(buf.length / 1024)} KB`);
  made++;
}

console.log(`\n${made} written, ${skipped} up to date${missing ? `, ${missing} missing` : ''}.`);
if (missing) process.exitCode = 1;
