// ---------------------------------------------------------------------------
// Renders one sign's content object into print-ready HTML at true 36x24 inches.
//
// The layout below is a faithful rebuild of the Design Monsters comp
// (Mill RIver Comp_9-4-22.png). All positions are in inches, measured from the
// comp, and live in LAYOUT so a future sign can override any of them without
// touching markup.
// ---------------------------------------------------------------------------

import { PAGE, COLOR, GRID, BAND, TYPE, FONT } from './theme.mjs';

// Measured slot geometry, in inches.
export const LAYOUT = {
  hero:        { x: 9.14,  y: 5.519,  w: 8.42,  h: 8.24 },   // centre portrait
  heroCaption: { x: 9.14,  y: 13.95,  w: 8.42,  h: 1.85 },

  strip: {
    y: 15.92,
    h: 4.31,
    museum:   { x: 0.85,  w: 5.26 },   // photo, left column
    blueBox:  { x: 6.11,  w: 2.22 },   // caption box beside it
    greenBox: { x: 9.14,  w: 2.23 },   // caption box
    wide:     { x: 11.69, w: 7.82 },   // wide historic photo
    diagram:  { x: 19.60, w: 6.29 },   // technical diagram
  },

  panel: {
    logo:    { x: 5.85, y: 0.12, w: 3.00, h: 3.00 },   // relative to panel
    map:     { x: 0.00, y: 0.00, w: 9.02, h: 17.58 },
    species: { x: 6.30, y: 11.00, w: 2.52, itemH: 2.05, gap: 0.26 },
    fact:    { x: 0.22, y: 17.58, w: 8.58, h: 2.70 },
  },

  // Text columns stop here so body copy can never run under the photo strip.
  // 15.92 = top of the strip, 5.519 = top of the columns, 0.42 = column
  // padding-top, 0.14 = breathing room above the photos.
  colTextH: 15.92 - 5.519 - 0.42 - 0.14,
};

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Wrap the first letter of a paragraph in a drop cap, as the comp does.
const dropCap = (text) => {
  const t = String(text).trim();
  return `<span class="dropcap">${esc(t[0])}</span>${esc(t.slice(1))}`;
};

const box = ({ x, y, w, h }, extra = '') =>
  `left:${x}in; top:${y}in; width:${w}in;${h != null ? ` height:${h}in;` : ''} ${extra}`;

export function signCSS() {
  return `
@page { size: ${PAGE.width}in ${PAGE.height}in; margin: 0; }

@font-face { font-family: 'Archivo'; src: url('../../assets/fonts/Archivo.ttf') format('truetype');
             font-weight: 100 900; font-style: normal; }
@font-face { font-family: 'Archivo'; src: url('../../assets/fonts/Archivo-Italic.ttf') format('truetype');
             font-weight: 100 900; font-style: italic; }
@font-face { font-family: 'Source Sans 3'; src: url('../../assets/fonts/SourceSans3.ttf') format('truetype');
             font-weight: 200 900; font-style: normal; }
@font-face { font-family: 'Source Sans 3'; src: url('../../assets/fonts/SourceSans3-Italic.ttf') format('truetype');
             font-weight: 200 900; font-style: italic; }

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${PAGE.width}in; height: ${PAGE.height}in; }
body {
  font-family: '${FONT.body}', sans-serif;
  background: ${COLOR.white};
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}
.sign { position: relative; width: ${PAGE.width}in; height: ${PAGE.height}in; overflow: hidden; }
.abs  { position: absolute; }

/* ---- header ------------------------------------------------------------- */
.header {
  background: ${COLOR.blue};
  padding: 0.30in 0 0 0.52in;
  display: flex; flex-direction: column; justify-content: center;
}
.title-en, .title-es {
  font-family: '${FONT.display}', sans-serif;
  font-size: ${TYPE.headline.size}pt;
  line-height: ${TYPE.headline.leading}pt;
  font-weight: ${TYPE.headline.weight};
  letter-spacing: ${TYPE.headline.tracking}pt;
  white-space: nowrap;
}
.title-en { color: ${COLOR.white}; }
.title-es { color: ${COLOR.blueLight}; font-style: italic; }
.rulebar  { background: ${COLOR.black}; }

/* ---- language columns --------------------------------------------------- */
.col { padding: 0.42in 0.36in 0 0.34in; }
.col-en { background: ${COLOR.gold}; }
.col-es { background: ${COLOR.orange}; }
.col-center { background: ${COLOR.white}; }

.col-es .body-text { font-size: ${TYPE.bodyEs.size}pt; line-height: ${TYPE.bodyEs.leading}pt; }
.col-es .dropcap    { font-size: ${TYPE.bodyEs.size * 1.55}pt; }
.body-text {
  font-size: ${TYPE.body.size}pt;
  line-height: ${TYPE.body.leading}pt;
  font-weight: ${TYPE.body.weight};
  color: ${COLOR.ink};
  hyphens: auto;
}
.dropcap {
  font-weight: 800;
  font-size: ${TYPE.body.size * 1.55}pt;
  line-height: 0.72;
  float: left;
  padding: 0.055in 0.05in 0 0;
}
.col-rule { height: 3.2pt; background: ${COLOR.black}; margin: 0.34in 0 0.30in 0; }
.section-head {
  font-family: '${FONT.display}', sans-serif;
  font-size: ${TYPE.sectionHead.size}pt;
  line-height: ${TYPE.sectionHead.leading}pt;
  font-weight: ${TYPE.sectionHead.weight};
  color: ${COLOR.white};
  letter-spacing: -0.4pt;
  margin-bottom: 0.20in;
}

/* ---- images ------------------------------------------------------------- */
.photo { object-fit: cover; width: 100%; height: 100%; display: block; }
.photo-contain { object-fit: contain; background: ${COLOR.white}; }

.caption {
  font-size: ${TYPE.caption.size}pt;
  line-height: ${TYPE.caption.leading}pt;
  font-weight: ${TYPE.caption.weight};
  color: ${COLOR.ink};
}
.caption + .caption { margin-top: 0.13in; }
.caption-es { font-style: italic; }

.capbox { padding: 0.14in 0.13in; overflow: hidden; }
.capbox p {
  font-size: ${TYPE.capBox.size}pt;
  line-height: ${TYPE.capBox.leading}pt;
  font-weight: ${TYPE.capBox.weight};
}
.diagram-caption { overflow: hidden; text-align: center; }
.diagram-caption p {
  font-size: ${TYPE.capBox.size}pt;
  line-height: ${TYPE.capBox.leading}pt;
  font-weight: ${TYPE.capBox.weight};
  color: ${COLOR.ink};
}
.diagram-caption p.es { font-style: italic; margin-top: 0.06in; }

.capbox-blue  { background: ${COLOR.blue};  color: ${COLOR.white}; }
.capbox-green { background: ${COLOR.green}; color: ${COLOR.ink};   }
.capbox p + p { margin-top: 0.10in; font-style: italic; }

/* ---- side panel --------------------------------------------------------- */
.panel { background: ${COLOR.blueLight}; }
.panel-map { object-fit: fill; }   /* crop is cut to the exact slot aspect */
.species-item { background: ${COLOR.white}; border: 1.6pt solid ${COLOR.black}; padding: 0.10in; }
.species-item img { width: 100%; height: 1.02in; object-fit: contain; display: block; }
.species-label {
  font-size: ${TYPE.panelLabel.size}pt;
  line-height: ${TYPE.panelLabel.leading}pt;
  font-weight: ${TYPE.panelLabel.weight};
  text-align: center; margin-top: 0.05in;
}
.species-label .es { display: block; font-style: italic; font-weight: 400;
                     font-size: ${TYPE.panelLabel.size * 0.86}pt; color: ${COLOR.inkSoft}; }

.factbox {
  background: ${COLOR.cream};
  border: 2pt solid ${COLOR.black};
  display: flex; gap: 0.28in; padding: 0.20in 0.24in;
}
.factbox > div:not(.fact-divider) { flex: 1; min-width: 0; }
.fact-head {
  font-family: '${FONT.display}', sans-serif;
  font-size: ${TYPE.factHead.size}pt;
  line-height: ${TYPE.factHead.leading}pt;
  font-weight: ${TYPE.factHead.weight};
  margin-bottom: 0.07in;
}
.fact-head.es { color: ${COLOR.blue}; }
.fact-text { font-size: ${TYPE.fact.size}pt; line-height: ${TYPE.fact.leading}pt; }
.fact-divider { flex: 0 0 2.5pt; background: ${COLOR.green}; }

/* ---- credit bar --------------------------------------------------------- */
.creditbar {
  background: ${COLOR.cream};
  border: 2.4pt solid ${COLOR.black};
  display: flex; align-items: stretch;
}
.credit-qr { flex: 0 0 6.4in; display: flex; align-items: center; gap: 0.30in; padding: 0.26in 0 0.26in 0.34in; }
.qr-cell { display: flex; align-items: center; gap: 0.18in; }
.qr-cell img { width: 1.55in; height: 1.55in; display: block; }
.qr-text .lm {
  font-family: '${FONT.display}', sans-serif;
  font-size: ${TYPE.learnMore.size}pt;
  line-height: ${TYPE.learnMore.leading}pt;
  font-weight: ${TYPE.learnMore.weight};
}
.qr-text .url { font-size: ${TYPE.url.size}pt; line-height: ${TYPE.url.leading}pt; font-weight: 500; }

.credit-body { flex: 1; padding: 0.24in 0.34in 0.24in 0.20in; }
.dedication {
  font-family: '${FONT.display}', sans-serif;
  font-size: ${TYPE.dedication.size}pt;
  line-height: ${TYPE.dedication.leading}pt;
  font-weight: ${TYPE.dedication.weight};
  text-align: center;
}
.dedication .es { color: ${COLOR.blue}; }
.credits {
  font-size: ${TYPE.credits.size}pt;
  line-height: ${TYPE.credits.leading}pt;
  color: ${COLOR.inkSoft};
  margin-top: 0.10in;
}
.credits b { color: ${COLOR.ink}; font-weight: 700; }

.youarehere {
  font-family: '${FONT.display}', sans-serif;
  font-size: ${TYPE.youAreHere.size}pt;
  font-weight: 800;
  text-align: center;
}
.youarehere .es { display: block; font-size: ${TYPE.youAreHere.size * 0.8}pt; font-style: italic; font-weight: 600; }

/* Crop/bleed marks are added by the renderer only when --bleed is passed. */
.bleedmark { position: absolute; background: ${COLOR.black}; }
`;
}

export function signHTML(sign, { qrEn, qrEs, diagramAspect = null, assetBase = '../../assets' }) {
  const s = sign.sign;
  const img = (f) => `${assetBase}/images/${sign.id.replace(/^sign-(\d+).*/, 'sign-$1')}/${encodeURIComponent(f)}`;
  const pick = (o, l) => (o ? o[l] : '');

  const headerW =
    GRID.colEnglish + GRID.hairline + GRID.colCenter + GRID.hairline + GRID.colSpanish;

  const bySlot = Object.fromEntries(s.images.map((i) => [i.slot, i]));
  const hero = bySlot.center_top;
  const museum = bySlot.left_bottom;
  const wide = bySlot.center_bottom;
  const diagram = bySlot.right_bottom;

  const L = LAYOUT;
  const P = L.panel;

  // Species boxes are optional. Without them the map keeps the full panel and
  // the locator can breathe — better than reusing the wrong sign's wildlife.
  const speciesHTML = (s.panel.species || [])
    .map(
      (sp, i) => `
      <div class="abs species-item" style="${box({
        x: GRID.xPanel + P.species.x,
        y: P.species.y + i * (P.species.itemH + P.species.gap),
        w: P.species.w,
      })}">
        <img src="${img(sp.file)}" alt="">
        <div class="species-label">${esc(sp.label.en)}<span class="es">${esc(sp.label.es)}</span></div>
      </div>`
    )
    .join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(sign.title.en)} — Mill River Trail Sign ${sign.number}</title>
<style>${signCSS()}</style>
</head><body>
<div class="sign">

  <!-- HEADER -->
  <div class="abs header" style="${box({ x: GRID.marginLeft, y: BAND.top, w: headerW, h: BAND.headerH })}">
    <div class="title-en">${esc(sign.title.en)}</div>
    <div class="title-es">${esc(sign.title.es)}</div>
  </div>
  <div class="abs rulebar" style="${box({
    x: GRID.marginLeft, y: BAND.top + BAND.headerH + 0.021, w: headerW, h: BAND.ruleH,
  })}"></div>

  <!-- ENGLISH COLUMN -->
  <div class="abs col col-en" style="${box({
    x: GRID.xEnglish, y: BAND.contentTop, w: GRID.colEnglish, h: BAND.contentH,
  })}"><div class="fitbox" data-fit="en" style="height:${L.colTextH}in; overflow:hidden">
    <p class="body-text">${dropCap(s.lede.en)}</p>
    <div class="col-rule"></div>
    <h2 class="section-head">${esc(s.section.heading.en)}</h2>
    <p class="body-text">${esc(s.section.body.en)}</p>
  </div></div>

  <!-- CENTRE COLUMN -->
  <div class="abs col-center" style="${box({
    x: GRID.xCenter, y: BAND.contentTop, w: GRID.colCenter, h: BAND.contentH,
  })}"></div>

  <!-- SPANISH COLUMN -->
  <div class="abs col col-es" style="${box({
    x: GRID.xSpanish, y: BAND.contentTop, w: GRID.colSpanish, h: BAND.contentH,
  })}"><div class="fitbox" data-fit="es" style="height:${L.colTextH}in; overflow:hidden">
    <p class="body-text">${dropCap(s.lede.es)}</p>
    <div class="col-rule"></div>
    <h2 class="section-head">${esc(s.section.heading.es)}</h2>
    <p class="body-text">${esc(s.section.body.es)}</p>
  </div></div>

  <!-- HERO IMAGE + CAPTIONS -->
  <img class="abs photo" src="${img(hero.file)}"
       style="${box(L.hero)}${hero.focus ? ` object-position:${hero.focus};` : ''}" alt="">
  <div class="abs" style="${box(L.heroCaption)}">
    <p class="caption">${esc(pick(hero.caption, 'en'))}</p>
    <p class="caption caption-es">${esc(pick(hero.caption, 'es'))}</p>
  </div>

  <!-- BOTTOM IMAGE STRIP -->
  <img class="abs photo" src="${img(museum.file)}"
       style="${box({ x: L.strip.museum.x, y: L.strip.y, w: L.strip.museum.w, h: L.strip.h })}${museum.focus ? ` object-position:${museum.focus};` : ''}" alt="">
  <div class="abs capbox capbox-blue"
       style="${box({ x: L.strip.blueBox.x, y: L.strip.y, w: L.strip.blueBox.w, h: L.strip.h })}">
    <p>${esc(pick(museum.caption, 'en'))}</p>
    <p>${esc(pick(museum.caption, 'es'))}</p>
  </div>

  <div class="abs capbox capbox-green"
       style="${box({ x: L.strip.greenBox.x, y: L.strip.y, w: L.strip.greenBox.w, h: L.strip.h })}">
    <p>${esc(pick(wide.caption, 'en'))}</p>
    <p>${esc(pick(wide.caption, 'es'))}</p>
  </div>
  <img class="abs photo" src="${img(wide.file)}"
       style="${box({ x: L.strip.wide.x, y: L.strip.y, w: L.strip.wide.w, h: L.strip.h })}" alt="">

  ${(() => {
    // Never taller than the slot, but shrink to the drawing's own shape so a
    // wide elevation does not float in a column of white — then centre what is
    // left between the top of the strip and the caption.
    const avail = L.strip.h - 1.05;
    const h = Math.min(avail, diagramAspect ? L.strip.diagram.w / diagramAspect : avail);
    const y = L.strip.y + (avail - h) / 2;
    return `<img class="abs photo photo-contain" src="${img(diagram.file)}"
       style="${box({ x: L.strip.diagram.x, y, w: L.strip.diagram.w, h })}" alt="">`;
  })()}
  <div class="abs diagram-caption" style="${box({
    x: L.strip.diagram.x, y: L.strip.y + L.strip.h - 1.0, w: L.strip.diagram.w, h: 1.0,
  })}">
    <p>${esc(pick(diagram.caption, 'en'))}</p>
    <p class="es">${esc(pick(diagram.caption, 'es'))}</p>
  </div>

  <!-- SIDE PANEL -->
  <div class="abs panel" style="${box({
    x: GRID.xPanel, y: BAND.top, w: GRID.panel, h: BAND.contentTop + BAND.contentH - BAND.top,
  })}"></div>
  <img class="abs panel-map" src="${img(s.panel.map || 'panel-map.svg')}" style="${box({
    x: GRID.xPanel, y: BAND.top, w: GRID.panel, h: P.map.h,
  })}" alt="">
  ${s.panel.map_includes_logo ? '' : `<img class="abs" src="${assetBase}/images/logo-mill-river-trail.png" style="${box({
    x: GRID.xPanel + P.logo.x, y: BAND.top + P.logo.y, w: P.logo.w, h: P.logo.h,
  })}" alt="Mill River Trail">`}
  ${speciesHTML}

  <div class="abs factbox" style="${box({
    x: GRID.xPanel + P.fact.x, y: BAND.top + P.fact.y, w: P.fact.w, h: P.fact.h,
  })}">
    <div>
      <div class="fact-head">${esc(s.panel.river_fact.label.en)}</div>
      <div class="fact-text">${esc(s.panel.river_fact.text.en)}</div>
    </div>
    <div class="fact-divider"></div>
    <div>
      <div class="fact-head es">${esc(s.panel.river_fact.label.es)}</div>
      <div class="fact-text">${esc(s.panel.river_fact.text.es)}</div>
    </div>
  </div>

  <!-- CREDIT BAR -->
  <div class="abs creditbar" style="${box({
    x: BAND.creditX, y: BAND.creditTop, w: BAND.creditW, h: BAND.creditH,
  })}">
    <div class="credit-qr">
      <div class="qr-cell">
        <img src="${qrEn}" alt="" data-qr="en" data-qr-expect="${esc(sign.urls.en_full)}">
        <div class="qr-text">
          <div class="lm">${esc(s.learn_more.en)}</div>
          <div class="url">${esc(sign.urls.en)}</div>
        </div>
      </div>
      <div class="qr-cell">
        <img src="${qrEs}" alt="" data-qr="es" data-qr-expect="${esc(sign.urls.es_full)}">
        <div class="qr-text">
          <div class="lm">${esc(s.learn_more.es)}</div>
          <div class="url">${esc(sign.urls.es)}</div>
        </div>
      </div>
    </div>
    <div class="credit-body">
      <div class="dedication">
        ${esc(s.dedication.en)}<br>
        <span class="es">${esc(s.dedication.es)}</span>
      </div>
      <div class="credits">
        <b>${esc(s.credits.label.en)} / ${esc(s.credits.label.es)}:</b>
        ${esc(s.credits.funders)}
        <b>${esc(s.credits.produced_label.en)}:</b> ${esc(s.credits.produced)}
      </div>
    </div>
  </div>

</div>
</body></html>`;
}
