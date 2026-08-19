// ---------------------------------------------------------------------------
// Confirms every URL printed on a sign has a page behind it.
//
//   node build/check-links.mjs
//
// render-sign.mjs proves the QR code *encodes* the right URL. This proves that
// URL *resolves* — same host as the deployed site, and a real file at the path.
// Together they close the loop that left millrivertrail.com/submarine printed on
// a comp pointing at a 404.
//
// Runs in CI before the site is published, and exits non-zero on any mismatch.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSign, signFiles } from './load-signs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'dist', 'site');

const exists = async (p) => { try { await fs.access(p); return true; } catch { return false; } };

const problems = [];
const ok = [];

const cname = (await fs.readFile(path.join(SITE, 'CNAME'), 'utf8').catch(() => '')).trim();
if (!cname) problems.push('dist/site/CNAME is missing — Pages will not serve the custom domain.');

const dir = path.join(ROOT, 'content');
const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.yml') && !f.startsWith('_')).sort();

for (const f of files) {
  const sign = await loadSign(path.join(dir, f));

  for (const lang of ['en', 'es']) {
    const full = sign.urls[`${lang}_full`];
    const label = sign.urls[lang];

    let url;
    try { url = new URL(full); }
    catch { problems.push(`${sign.id} [${lang}]: "${full}" is not a valid URL`); continue; }

    // The human-readable line printed beside the QR must match the QR target,
    // or a reader typing what they see lands somewhere else.
    if (label.toLowerCase().replace(/\/$/, '') !== (url.host + url.pathname).toLowerCase().replace(/\/$/, '')) {
      problems.push(`${sign.id} [${lang}]: printed label "${label}" does not match QR target "${url.host}${url.pathname}"`);
    }

    if (cname && url.host.toLowerCase() !== cname.toLowerCase()) {
      problems.push(`${sign.id} [${lang}]: points at ${url.host} but the site deploys to ${cname}`);
    }

    if (url.protocol !== 'https:') {
      problems.push(`${sign.id} [${lang}]: ${full} is not https`);
    }

    const page = path.join(SITE, url.pathname.replace(/^\/|\/$/g, ''), 'index.html');
    if (await exists(page)) ok.push(`${sign.id} [${lang}] → ${url.pathname}`);
    else problems.push(`${sign.id} [${lang}]: nothing built at ${url.pathname} (looked for ${path.relative(ROOT, page)})`);
  }
}

for (const line of ok) console.log(`  ✓ ${line}`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s) — these would be printed onto metal:\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}

console.log(`\nAll ${ok.length} printed URLs resolve to built pages on ${cname}.`);
