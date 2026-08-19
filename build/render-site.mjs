// ---------------------------------------------------------------------------
// Builds the "learn more" pages that the QR codes on each sign point at.
//
//   node build/render-site.mjs
//
// Output: dist/site/  — plain static files. Drop the folder on Netlify, GitHub
// Pages, Cloudflare Pages, or any host; no server needed.
//
// Every page exists in English and Spanish at parallel URLs, and each links to
// the other, because a bilingual sign that leads to an English-only page is
// only half translated.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { COLOR } from './theme.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist', 'site');

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The body copy only uses "## heading" and blank-line-separated paragraphs, so
// a full Markdown dependency would be more machinery than the job needs.
function md(src = '') {
  return src
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const b = block.trim();
      if (b.startsWith('## ')) {
        const t = b.slice(3).trim();
        const id = t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
        return `<h2 id="${esc(id)}">${esc(t)}</h2>`;
      }
      return `<p>${esc(b.replace(/\s*\n\s*/g, ' '))}</p>`;
    })
    .join('\n');
}

const T = {
  en: {
    kicker: (n) => `Mill River Trail · Sign ${n}`,
    other: 'Español', otherLabel: 'Leer en español',
    galleryHead: 'Images',
    sourcesHead: 'Sources and further reading',
    locationHead: 'Where this sign stands',
    mapLink: 'Open in maps',
    backHome: 'All Mill River Trail signs',
    footer: 'Mill River Trail — a community project in New Haven, Connecticut.',
    indexTitle: 'Mill River Trail — Historic Signs',
    indexLead:
      'Interpretive signs along the Mill River Trail tell the story of the river ' +
      'that powered New Haven. Each sign stands at the place it describes. ' +
      'Scan its QR code, or start here.',
  },
  es: {
    kicker: (n) => `Mill River Trail · Letrero ${n}`,
    other: 'English', otherLabel: 'Read in English',
    galleryHead: 'Imágenes',
    sourcesHead: 'Fuentes y lecturas adicionales',
    locationHead: 'Dónde está este letrero',
    mapLink: 'Abrir en mapas',
    backHome: 'Todos los letreros del Mill River Trail',
    footer: 'Mill River Trail — un proyecto comunitario en New Haven, Connecticut.',
    indexTitle: 'Mill River Trail — Letreros Históricos',
    indexLead:
      'Los letreros interpretativos a lo largo del Mill River Trail cuentan la ' +
      'historia del río que impulsó a New Haven. Cada letrero está en el lugar ' +
      'que describe. Escanee su código QR, o empiece aquí.',
  },
};

function css() {
  return `
:root {
  --blue: ${COLOR.blue}; --blue-light: ${COLOR.blueLight};
  --gold: ${COLOR.gold}; --orange: ${COLOR.orange};
  --cream: ${COLOR.cream}; --green: ${COLOR.green};
  --bg: #FFFFFF; --fg: #16181C; --muted: #5A6068; --rule: #E2E6EA;
  --card: #F7F9FA;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #14171A; --fg: #ECEFF2; --muted: #9BA3AC; --rule: #2A3036;
    --card: #1C2126; --cream: #23262A;
  }
}
:root[data-theme="dark"] {
  --bg: #14171A; --fg: #ECEFF2; --muted: #9BA3AC; --rule: #2A3036;
  --card: #1C2126; --cream: #23262A;
}

* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--fg);
  font: 400 19px/1.65 "Source Sans 3", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  -webkit-text-size-adjust: 100%;
}
.wrap { max-width: 44rem; margin: 0 auto; padding: 0 1.25rem; }

header.top {
  background: var(--blue); color: #fff; padding: 1.5rem 0 1.75rem;
}
.kicker {
  font-size: 0.82rem; letter-spacing: 0.11em; text-transform: uppercase;
  font-weight: 700; opacity: 0.9; margin: 0 0 0.4rem;
}
h1 { font-size: clamp(2rem, 7vw, 3rem); line-height: 1.08; margin: 0 0 0.5rem; font-weight: 800; letter-spacing: -0.02em; }
.subtitle { font-size: 1.1rem; margin: 0; opacity: 0.95; max-width: 34rem; }

.langbar { display: flex; gap: 0.6rem; align-items: center; margin-top: 1.1rem; flex-wrap: wrap; }
.langbar a {
  display: inline-block; padding: 0.42rem 0.9rem; border-radius: 999px;
  background: rgba(255,255,255,0.16); color: #fff; text-decoration: none;
  font-weight: 700; font-size: 0.95rem; border: 1.5px solid rgba(255,255,255,0.4);
}
.langbar a:hover { background: rgba(255,255,255,0.28); }

main { padding: 2.25rem 0 3rem; }
main h2 {
  font-size: 1.5rem; line-height: 1.25; font-weight: 800; letter-spacing: -0.01em;
  margin: 2.4rem 0 0.75rem; padding-top: 1.4rem; border-top: 3px solid var(--gold);
}
main h2:first-of-type { margin-top: 0.5rem; }
main p { margin: 0 0 1.15rem; }
main > .wrap > p:first-child { font-size: 1.16rem; }

figure { margin: 2rem 0; }
figure img {
  width: 100%; height: auto; display: block; border-radius: 6px; background: var(--card);
}
figcaption { font-size: 0.94rem; color: var(--muted); margin-top: 0.55rem; line-height: 1.5; }

.info {
  background: var(--card); border-left: 5px solid var(--green);
  padding: 1.1rem 1.25rem; margin: 2.25rem 0; border-radius: 0 6px 6px 0;
}
.info h3 { margin: 0 0 0.35rem; font-size: 1.05rem; font-weight: 800; }
.info p { margin: 0 0 0.5rem; color: var(--muted); font-size: 0.98rem; }
.info a { color: var(--blue); font-weight: 700; }

ul.sources { list-style: none; padding: 0; margin: 0.5rem 0 0; }
ul.sources li { padding: 0.5rem 0; border-bottom: 1px solid var(--rule); }
ul.sources a { color: var(--blue); text-decoration: none; font-weight: 600; }
ul.sources a:hover { text-decoration: underline; }

footer {
  border-top: 1px solid var(--rule); padding: 1.75rem 0 3rem;
  color: var(--muted); font-size: 0.94rem;
}
footer a { color: var(--blue); font-weight: 600; }

.signlist { list-style: none; padding: 0; margin: 2rem 0 0; display: grid; gap: 1rem; }
.signlist a {
  display: block; text-decoration: none; color: inherit; background: var(--card);
  border: 1px solid var(--rule); border-radius: 8px; padding: 1.1rem 1.25rem;
  border-left: 6px solid var(--gold);
}
.signlist a:hover { border-left-color: var(--blue); }
.signlist .n { font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
.signlist h2 { font-size: 1.3rem; margin: 0.25rem 0 0.3rem; border: 0; padding: 0; }
.signlist p { margin: 0; color: var(--muted); font-size: 0.98rem; }
`;
}

function page({ lang, sign, otherHref }) {
  const t = T[lang];
  const w = sign.web;
  const hero = w.gallery?.[0];
  const imgDir = `../images/${sign.id.replace(/^sign-(\d+).*/, 'sign-$1')}`;

  const gallery = (w.gallery || []).slice(1).map((g) => `
      <figure>
        <img src="${imgDir}/${encodeURIComponent(g.file)}" alt="${esc(g.caption[lang])}" loading="lazy">
        <figcaption>${esc(g.caption[lang])}</figcaption>
      </figure>`).join('');

  const sources = (w.sources || []).map((s) =>
    `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.title)}</a></li>`).join('\n        ');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(sign.title[lang])} — Mill River Trail</title>
<meta name="description" content="${esc(w.subtitle[lang])}">
<link rel="alternate" hreflang="${lang === 'en' ? 'es' : 'en'}" href="${otherHref}">
<link rel="canonical" href="${esc(lang === 'en' ? sign.urls.en_full : sign.urls.es_full)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(sign.title[lang])}">
<meta property="og:description" content="${esc(w.subtitle[lang])}">
<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'es_US'}">
${hero ? `<meta property="og:image" content="${imgDir}/${encodeURIComponent(hero.file)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../style.css">
</head>
<body>

<header class="top">
  <div class="wrap">
    <p class="kicker">${esc(t.kicker(sign.number))}</p>
    <h1>${esc(sign.title[lang])}</h1>
    <p class="subtitle">${esc(w.subtitle[lang])}</p>
    <nav class="langbar">
      <a href="${otherHref}" hreflang="${lang === 'en' ? 'es' : 'en'}">${esc(t.otherLabel)}</a>
      <a href="../">${esc(t.backHome)}</a>
    </nav>
  </div>
</header>

<main>
  <div class="wrap">
    ${hero ? `<figure style="margin-top:0">
      <img src="${imgDir}/${encodeURIComponent(hero.file)}" alt="${esc(hero.caption[lang])}">
      <figcaption>${esc(hero.caption[lang])}</figcaption>
    </figure>` : ''}

    ${md(w.body[lang])}

    ${gallery}

    <div class="info">
      <h3>${esc(t.locationHead)}</h3>
      <p>${esc(sign.location.place)}</p>
      <p><a href="https://www.google.com/maps/search/?api=1&amp;query=${sign.location.lat},${sign.location.lon}"
            rel="noopener">${esc(t.mapLink)} →</a></p>
    </div>

    ${sources ? `<h2>${esc(t.sourcesHead)}</h2>
    <ul class="sources">
        ${sources}
    </ul>` : ''}
  </div>
</main>

<footer>
  <div class="wrap">
    <p>${esc(t.footer)} <a href="https://www.millrivertrail.com/">millrivertrail.com</a></p>
  </div>
</footer>

</body></html>`;
}

function indexPage(lang, signs) {
  const t = T[lang];
  const items = signs.map((s) => {
    const slug = lang === 'en' ? s.urls.en.split('/').pop() : s.urls.es.split('/').pop();
    return `<li><a href="${slug}/">
        <span class="n">${esc(t.kicker(s.number))}</span>
        <h2>${esc(s.title[lang])}</h2>
        <p>${esc(s.web.subtitle[lang])}</p>
      </a></li>`;
  }).join('\n      ');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.indexTitle)}</title>
<meta name="description" content="${esc(t.indexLead)}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="top">
  <div class="wrap">
    <p class="kicker">Mill River Trail</p>
    <h1>${esc(t.indexTitle)}</h1>
    <p class="subtitle">${esc(t.indexLead)}</p>
    <nav class="langbar">
      <a href="${lang === 'en' ? 'index.es.html' : 'index.html'}">${esc(t.otherLabel)}</a>
      <a href="https://www.millrivertrail.com/">millrivertrail.com</a>
    </nav>
  </div>
</header>
<main><div class="wrap">
  <ul class="signlist">
      ${items}
  </ul>
</div></main>
<footer><div class="wrap"><p>${esc(t.footer)}</p></div></footer>
</body></html>`;
}

// --- build ------------------------------------------------------------------

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const dir = path.join(ROOT, 'content');
const signs = [];
for (const f of (await fs.readdir(dir)).filter((f) => f.endsWith('.yml')).sort()) {
  signs.push(YAML.parse(await fs.readFile(path.join(dir, f), 'utf8')));
}

await fs.writeFile(path.join(OUT, 'style.css'), css());

for (const sign of signs) {
  const slugEn = sign.urls.en.split('/').pop();
  const slugEs = sign.urls.es.split('/').pop();

  for (const [lang, slug, other] of [
    ['en', slugEn, `../${slugEs}/`],
    ['es', slugEs, `../${slugEn}/`],
  ]) {
    const d = path.join(OUT, slug);
    await fs.mkdir(d, { recursive: true });
    await fs.writeFile(path.join(d, 'index.html'), page({ lang, sign, otherHref: other }));
    console.log(`  ✓ /${slug}/                 (${lang})`);
  }

  // Copy only the images the web pages actually reference.
  const sub = sign.id.replace(/^sign-(\d+).*/, 'sign-$1');
  const src = path.join(ROOT, 'assets', 'images', sub);
  const dst = path.join(OUT, 'images', sub);
  await fs.mkdir(dst, { recursive: true });
  for (const g of sign.web.gallery || []) {
    try {
      await fs.copyFile(path.join(src, g.file), path.join(dst, g.file));
    } catch {
      console.warn(`  ⚠ missing web image: ${sub}/${g.file}`);
    }
  }
}

await fs.writeFile(path.join(OUT, 'index.html'), indexPage('en', signs));
await fs.writeFile(path.join(OUT, 'index.es.html'), indexPage('es', signs));
console.log(`  ✓ /  and  /index.es.html`);

// The host the signs are printed with. Taken from the content rather than
// configured separately, so the QR codes and the deployed domain cannot
// disagree — that is the whole failure this project is trying to avoid.
const host = new URL(signs[0].urls.en_full).host;
await fs.writeFile(path.join(OUT, 'CNAME'), host + '\n');

// Trail logo mark, as a favicon.
await fs.writeFile(path.join(OUT, 'favicon.svg'),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${COLOR.blue}"/>
  <path d="M20 12c0 14 24 20 24 34 0 4-2 6-6 6" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
</svg>\n`);

await fs.writeFile(path.join(OUT, '404.html'),
`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found — Mill River Trail</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css"></head>
<body>
<header class="top"><div class="wrap">
  <p class="kicker">Mill River Trail</p>
  <h1>That page isn't here</h1>
  <p class="subtitle">If you scanned a sign and landed here, the page may have moved.
     Every sign is listed below. / Si escaneó un letrero y llegó aquí, la página pudo
     haberse movido. Todos los letreros están abajo.</p>
  <nav class="langbar"><a href="/">All signs / Todos los letreros</a></nav>
</div></header>
</body></html>\n`);

await fs.writeFile(path.join(OUT, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: https://${host}/sitemap.xml\n`);

const urls = ['/', ...signs.flatMap((s) => [
  `/${s.urls.en.split('/').pop()}/`,
  `/${s.urls.es.split('/').pop()}/`,
])];
await fs.writeFile(path.join(OUT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>https://${host}${u}</loc></url>`).join('\n')}
</urlset>\n`);

console.log(`  ✓ CNAME (${host}), 404, robots.txt, sitemap.xml, favicon`);
console.log(`\nSite built in dist/site/ — ${signs.length} sign(s), ${signs.length * 2} pages.`);
