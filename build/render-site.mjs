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
import { loadSign, signFiles } from './load-signs.mjs';
import { COLOR } from './theme.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist', 'site');

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The body copy only uses "## heading" and blank-line-separated paragraphs, so
// a full Markdown dependency would be more machinery than the job needs.
// Inline formatting. Escaping happens first, so this only ever sees safe text.
const inline = (t) =>
  esc(t)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>');

// Renders the article, dropping one figure in ahead of each section heading
// after the first. Pictures belong beside the passage they illustrate, not
// stacked in a gallery at the bottom where nobody scrolls.
function md(src = '', figures = []) {
  const queue = [...figures];
  let seenHeading = false;
  const out = [];

  for (const block of src.trim().split(/\n\s*\n/)) {
    const b = block.trim();
    if (b.startsWith('## ')) {
      const t = b.slice(3).trim();
      const id = t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
      if (seenHeading && queue.length) out.push(queue.shift());
      seenHeading = true;
      out.push(`<h2 id="${esc(id)}">${esc(t)}</h2>`);
      continue;
    }
    if (b.startsWith('> ')) {
      out.push(`<blockquote><p>${inline(b.replace(/^>\s?/gm, '').replace(/\s*\n\s*/g, ' '))}</p></blockquote>`);
      continue;
    }
    out.push(`<p>${inline(b.replace(/\s*\n\s*/g, ' '))}</p>`);
  }

  // Anything left over follows the article rather than being dropped.
  out.push(...queue);
  return out.join('\n');
}

const T = {
  en: {
    kicker: (n) => `Mill River Trail · Sign ${n}`,
    other: 'Español', otherLabel: 'Leer en español',
    galleryHead: 'Images',
    sourcesHead: 'Sources and further reading',
    ackHead: 'Research and credits',
    signHead: 'The sign at this spot',
    signNote: 'The full sign, in English and Spanish. Zoom in to read it.',
    signDraft: 'This sign is still a draft. The hatched boxes are photographs that have not been sourced yet.',
    locationHead: 'Where this sign stands',
    mapLink: 'Open in maps',
    backHome: 'All Mill River Trail signs',
    existingTitle: 'Already on the Trail',
    existingLink: 'Signs already on the trail',
    extendsLabel: 'This project adds to it at',
    mapHead: 'Where they are',
    mapNote: 'Numbered markers are the signs this project is making. Green dots are signs already standing.',
    transcriptHead: 'What it says',
    photoNote: 'Photographed April 2021',
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
    ackHead: 'Investigación y créditos',
    signHead: 'El letrero en este punto',
    signNote: 'El letrero completo, en inglés y español. Amplíe para leerlo.',
    signDraft: 'Este letrero es todavía un borrador. Los recuadros rayados son fotografías que aún no se han conseguido.',
    locationHead: 'Dónde está este letrero',
    mapLink: 'Abrir en mapas',
    backHome: 'Todos los letreros del Mill River Trail',
    existingTitle: 'Ya en el Sendero',
    existingLink: 'Letreros que ya están en el sendero',
    extendsLabel: 'Este proyecto lo amplía en',
    mapHead: 'Dónde están',
    mapNote: 'Los marcadores numerados son los letreros de este proyecto. Los puntos verdes son letreros que ya existen.',
    transcriptHead: 'Lo que dice',
    photoNote: 'Fotografiado en abril de 2021',
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

.group { margin-bottom: 2.5rem; }
.group h2 { border-top-color: var(--green); }
ul.existing-list { list-style: none; padding: 0; margin: 1rem 0 0; display: grid; gap: 0.9rem; }
li.existing {
  background: var(--card); border: 1px solid var(--rule); border-left: 5px solid var(--green);
  border-radius: 0 7px 7px 0; padding: 0.9rem 1.1rem;
}
li.existing h3 { margin: 0 0 0.3rem; font-size: 1.08rem; font-weight: 800; }
li.existing p { margin: 0 0 0.45rem; font-size: 0.98rem; color: var(--muted); }
li.existing .meta { font-size: 0.88rem; margin: 0; }
li.existing .meta a { color: var(--blue); font-weight: 700; text-decoration: none; }
li.existing .meta a:hover { text-decoration: underline; }
figure.ex-photo { margin: 0 0 0.8rem; }
figure.ex-photo img {
  width: 100%; height: auto; display: block; border-radius: 5px;
  background: var(--bg); border: 1px solid var(--rule);
}
figure.ex-photo figcaption { font-size: 0.8rem; color: var(--muted); margin-top: 0.3rem; }
details.transcript { margin: 0 0 0.6rem; }
details.transcript summary {
  cursor: pointer; font-weight: 700; font-size: 0.92rem; color: var(--blue);
  padding: 0.2rem 0;
}
details.transcript p {
  margin: 0.5rem 0 0; padding-left: 0.9rem; border-left: 3px solid var(--gold);
  font-size: 0.95rem; color: var(--fg);
}
figure.overview {
  margin: 1rem 0 2.5rem; background: var(--card); border: 1px solid var(--rule);
  border-radius: 8px; padding: 10px;
}
figure.overview img { width: 100%; height: auto; display: block; border-radius: 4px; }

figure.signart {
  margin: 1rem 0 2rem; background: var(--card); border: 1px solid var(--rule);
  border-radius: 8px; padding: 10px;
}
figure.signart img { width: 100%; height: auto; display: block; border-radius: 4px; }
figure.signart a { display: block; }
.draft-note {
  font-size: 0.93rem; color: var(--muted); background: var(--card);
  border-left: 4px solid var(--gold); padding: 0.6rem 0.9rem; border-radius: 0 5px 5px 0;
  margin: 0 0 0.9rem;
}
.sources-note { font-size: 0.95rem; color: var(--muted); margin: 0.2rem 0 0.6rem; }
.ack { font-size: 0.95rem; color: var(--muted); line-height: 1.6; }

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
  const imgDir = `../images/${sign.id.replace(/^sign-(\d+).*/, 'sign-$1')}`;
  const webFile = (f) => f.replace(/\.[^.]+$/, '.jpg');

  // The pictures printed on the sign come first — a reader on a phone can study
  // them far more closely than they can the sign — then any web-only extras.
  // Anything still awaiting artwork is skipped.
  const seen = new Set();
  const figures = [...(sign.sign.images || []), ...(w.gallery || [])]
    .filter((im) => im.file && !/^TODO-/.test(im.file))
    .filter((im) => (seen.has(im.file) ? false : seen.add(im.file)))
    .map((im) => ({ file: webFile(im.file), caption: im.caption[lang] }));

  const hero = figures.shift();

  const figureHTML = (f) => `
      <figure>
        <img src="${imgDir}/${encodeURIComponent(f.file)}" alt="${esc(f.caption)}" loading="lazy">
        <figcaption>${esc(f.caption)}</figcaption>
      </figure>`;

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
      <img src="${imgDir}/${encodeURIComponent(hero.file)}" alt="${esc(hero.caption)}">
      <figcaption>${esc(hero.caption)}</figcaption>
    </figure>` : ''}

    ${md(w.body[lang], figures.map(figureHTML))}

    <div class="info">
      <h3>${esc(t.locationHead)}</h3>
      <p>${esc(sign.location.place)}</p>
      <p><a href="https://www.google.com/maps/search/?api=1&amp;query=${sign.location.lat},${sign.location.lon}"
            rel="noopener">${esc(t.mapLink)} →</a></p>
    </div>

    <h2>${esc(t.signHead)}</h2>
    <p class="lede">${esc(t.signNote)}</p>
    ${sign.status === 'draft' ? `<p class="draft-note">${esc(t.signDraft)}</p>` : ''}
    <figure class="signart">
      <a href="../signs/${esc(sign.id)}.jpg">
        <img src="../signs/${esc(sign.id)}.jpg"
             alt="${esc(lang === 'en'
               ? `The full ${sign.title.en} sign, with English and Spanish columns, photographs and a locator map`
               : `El letrero completo ${sign.title.es}, con columnas en inglés y español, fotografías y un mapa de localización`)}"
             loading="lazy">
      </a>
    </figure>

    ${sources ? `<h2>${esc(t.sourcesHead)}</h2>
    <p class="sources-note">${esc(
      lang === 'en'
        ? 'Where a link goes to a scanned original — a newspaper page, a map, an engineering journal — it is the actual document, not a summary of it.'
        : 'Cuando un enlace lleva a un original escaneado — una página de periódico, un mapa, una revista de ingeniería — es el documento en sí, no un resumen.'
    )}</p>
    <ul class="sources">
        ${sources}
    </ul>` : ''}

    ${w.acknowledgements ? `<h2>${esc(t.ackHead)}</h2>
    <p class="ack">${esc(w.acknowledgements[lang])}</p>` : ''}
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
      <a href="${lang === 'en' ? 'on-the-trail/' : 'en-el-sendero/'}">${esc(t.existingLink)}</a>
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

function existingPage(lang, data, signs, otherHref) {
  const t = T[lang];
  const bySlug = Object.fromEntries(signs.map((s) => [s.id, s]));

  const groups = data.groups.map((g) => {
    const rows = g.signs.map((sn) => {
      const target = sn.extends ? bySlug[sn.extends] : null;
      const slug = target
        ? (lang === 'en' ? target.urls.en : target.urls.es).split('/').pop()
        : null;
      return `
        <li class="existing">
          ${sn.photo ? `<figure class="ex-photo">
            <img src="../images/existing/${encodeURIComponent(sn.photo)}"
                 alt="${esc(sn.title)}, photographed on the trail" loading="lazy">
            <figcaption>${esc(t.photoNote)}</figcaption>
          </figure>` : ''}
          <h3>${esc(sn.title)}</h3>
          ${sn.note ? `<p>${esc(sn.note)}</p>` : ''}
          ${sn.transcript ? `<details class="transcript">
            <summary>${esc(t.transcriptHead)}</summary>
            <p>${esc(sn.transcript)}</p>
          </details>` : ''}
          <p class="meta">
            <a href="https://www.google.com/maps/search/?api=1&amp;query=${sn.lat},${sn.lon}"
               rel="noopener">${sn.lat.toFixed(5)}, ${sn.lon.toFixed(5)}</a>
            ${target ? ` · ${esc(t.extendsLabel)}
               <a href="../${slug}/">${esc(target.title[lang])}</a>` : ''}
          </p>
        </li>`;
    }).join('');
    return `
      <section class="group">
        <h2>${esc(g.name[lang])}</h2>
        ${g.note ? `<p class="lede">${esc(g.note[lang])}</p>` : ''}
        <ul class="existing-list">${rows}</ul>
      </section>`;
  }).join('');

  const count = data.groups.reduce((a, g) => a + g.signs.length, 0);

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(data.title[lang])} — Mill River Trail</title>
<meta name="description" content="${esc(data.intro[lang])}">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../style.css">
</head>
<body>
<header class="top"><div class="wrap">
  <p class="kicker">Mill River Trail</p>
  <h1>${esc(data.title[lang])}</h1>
  <p class="subtitle">${esc(data.intro[lang])}</p>
  <nav class="langbar">
    <a href="${otherHref}">${esc(t.otherLabel)}</a>
    <a href="../">${esc(t.backHome)}</a>
  </nav>
</div></header>
<main><div class="wrap">
  <h2>${esc(t.mapHead)}</h2>
  <p class="lede">${esc(t.mapNote)}</p>
  <figure class="overview">
    <img src="../images/overview-map.svg" alt="Map of the Mill River from Lake Whitney down to the harbour, with numbered markers for the thirteen planned signs and green dots for the eighteen already standing.">
  </figure>

  ${groups}
  <p class="ack">${esc(lang === 'en'
    ? `${count} signs catalogued from photographs taken along the trail in April 2021. Positions come from the camera. If one has gone, or a new one has appeared, it should be corrected here.`
    : `${count} letreros catalogados a partir de fotografías tomadas a lo largo del sendero en abril de 2021. Las posiciones proceden de la cámara. Si alguno ha desaparecido, o ha aparecido uno nuevo, debería corregirse aquí.`)}</p>
</div></main>
<footer><div class="wrap"><p>${esc(t.footer)}</p></div></footer>
</body></html>`;
}

// --- build ------------------------------------------------------------------

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const dir = path.join(ROOT, 'content');
const signs = [];
for (const f of (await fs.readdir(dir)).filter((f) => f.endsWith('.yml') && !f.startsWith('_')).sort()) {
  signs.push(await loadSign(path.join(dir, f)));
}

await fs.writeFile(path.join(OUT, 'style.css'), css());

// Shared imagery: the trail overview map and the existing-signage photographs.
await fs.mkdir(path.join(OUT, 'images', 'existing'), { recursive: true });
await fs.copyFile(
  path.join(ROOT, 'assets', 'images', 'overview-map.svg'),
  path.join(OUT, 'images', 'overview-map.svg')
).catch(() => console.warn('  ⚠ no overview map — run: node build/make-overview-map.mjs'));
await fs.mkdir(path.join(OUT, 'signs'), { recursive: true });
for (const f of await fs.readdir(path.join(ROOT, 'assets', 'web', 'signs')).catch(() => [])) {
  await fs.copyFile(
    path.join(ROOT, 'assets', 'web', 'signs', f),
    path.join(OUT, 'signs', f)
  );
}
for (const f of await fs.readdir(path.join(ROOT, 'assets', 'web', 'existing')).catch(() => [])) {
  await fs.copyFile(
    path.join(ROOT, 'assets', 'web', 'existing', f),
    path.join(OUT, 'images', 'existing', f)
  );
}

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

  // Web-resolution derivatives only — see build/make-web-images.mjs. The print
  // masters are not in the repository and are not needed to build the site.
  const sub = sign.id.replace(/^sign-(\d+).*/, 'sign-$1');
  const src = path.join(ROOT, 'assets', 'web', sub);
  const dst = path.join(OUT, 'images', sub);
  await fs.mkdir(dst, { recursive: true });
  // Everything a page can reference: the sign's own pictures and any web-only
  // extras. Artwork still to be sourced is skipped rather than warned about.
  const referenced = [
    ...(sign.sign.images || []).map((i) => i.file),
    ...(sign.web.gallery || []).map((g) => g.file),
  ]
    .filter((f) => f && !/^TODO-/.test(f))
    .map((f) => f.replace(/\.[^.]+$/, '.jpg'))
    .filter((f, i, a) => a.indexOf(f) === i);

  for (const f of referenced) {
    try {
      await fs.copyFile(path.join(src, f), path.join(dst, f));
    } catch {
      console.warn(`  ⚠ missing web image: assets/web/${sub}/${f} — run: node build/make-web-images.mjs`);
    }
  }
}

// Inventory of signage already standing on the trail.
{
  const raw = await fs.readFile(path.join(dir, '_existing-signs.yml'), 'utf8').catch(() => null);
  if (raw) {
    const YAMLmod = await import('yaml');
    const data = YAMLmod.default.parse(raw);
    for (const [lang, slug, other] of [
      ['en', 'on-the-trail', '../en-el-sendero/'],
      ['es', 'en-el-sendero', '../on-the-trail/'],
    ]) {
      const d = path.join(OUT, slug);
      await fs.mkdir(d, { recursive: true });
      await fs.writeFile(path.join(d, 'index.html'), existingPage(lang, data, signs, other));
      console.log(`  ✓ /${slug}/               (${lang})`);
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

const urls = ['/', '/on-the-trail/', '/en-el-sendero/', ...signs.flatMap((s) => [
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
