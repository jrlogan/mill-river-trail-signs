// ---------------------------------------------------------------------------
// Makes web-resolution copies of the images the sign pages use.
//
//   node build/make-web-images.mjs            # only what's missing or stale
//   node build/make-web-images.mjs --force    # redo everything
//
// Reads the print masters in assets/images/ and writes downsized JPEGs to
// assets/web/. Only assets/web/ is committed.
//
// The masters are archival scans supplied for this signage project by the
// museums and collections credited in NOTICE.md. They stay out of the public
// repository; the web copies are the resolution the pages actually serve.
//
// Run this after adding images for a new sign, then commit assets/web/.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSign, signFiles } from './load-signs.mjs';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');

// Wide enough for a 2x phone screen and a desktop column; small enough that the
// page still opens quickly on trail-side cell signal.
const MAX_WIDTH = 1600;
const QUALITY = 82;

const stat = async (p) => { try { return await fs.stat(p); } catch { return null; } };

let made = 0, skipped = 0, missing = 0, pending = 0;

const dir = path.join(ROOT, 'content');
for (const f of (await fs.readdir(dir)).filter((f) => f.endsWith('.yml') && !f.startsWith('_')).sort()) {
  const sign = await loadSign(path.join(dir, f));
  const sub = sign.id.replace(/^sign-(\d+).*/, 'sign-$1');
  const src = path.join(ROOT, 'assets', 'images', sub);
  const dst = path.join(ROOT, 'assets', 'web', sub);
  await fs.mkdir(dst, { recursive: true });

  // Both the pictures printed on the sign and any extra web-only ones. The
  // sign's own images are the most relevant thing a page can show, and a reader
  // on a phone can look at them far more closely than at the sign itself.
  const wanted = [
    ...(sign.sign.images || []).map((i) => i.file),
    ...(sign.web.gallery || []).map((g) => g.file),
  ].filter((f, i, a) => a.indexOf(f) === i);

  for (const g of wanted.map((file) => ({ file }))) {
    const from = path.join(src, g.file);
    // Everything on the web is served as .jpg, whatever the master was.
    const to = path.join(dst, g.file.replace(/\.[^.]+$/, '.jpg'));

    const a = await stat(from);
    const b = await stat(to);

    if (!a) {
      if (b) { skipped++; continue; }           // master gone, derivative already committed
      // Artwork that has not been sourced yet is expected, not an error.
      if (/^TODO-/.test(path.basename(g.file))) { pending++; continue; }
      console.warn(`  ⚠ ${sub}/${g.file}: no master and no web copy`);
      missing++;
      continue;
    }
    if (b && !force && b.mtimeMs >= a.mtimeMs) { skipped++; continue; }

    const out = await sharp(from)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
      .toBuffer();
    await fs.writeFile(to, out);

    const kb = (n) => `${Math.round(n / 1024)} KB`;
    console.log(`  ✓ ${sub}/${path.basename(to)}  ${kb(a.size)} → ${kb(out.length)}`);
    made++;
  }
}

console.log(`\n${made} written, ${skipped} up to date` +
  `${pending ? `, ${pending} awaiting artwork` : ''}${missing ? `, ${missing} missing` : ''}.`);
if (missing) process.exitCode = 1;
