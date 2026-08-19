# Mill River Trail — Interpretive Signage

Bilingual (English / Spanish) interpretive signs for the Mill River Trail in
New Haven, plus the "learn more" web pages their QR codes point to.

**One content file per sign drives both outputs.** Edit the YAML, run the build,
and the printed sign and both web pages update together. They cannot drift apart,
which is how the 2022 comp ended up with two caption boxes reading
"Spanish version to come."

## Quick start

```bash
npm install
npm run all           # build every sign's print PDF + the web site
```

Individual targets:

```bash
node build/render-sign.mjs sign-01 --proof   # one sign, PDF + PNG proof
node build/render-site.mjs                   # just the web pages
```

Output:

| Path | What it is |
|---|---|
| `dist/print/sign-01-submarine.pdf` | Press-ready artwork, true 36 × 24 in, vector text |
| `dist/print/sign-01-submarine-proof.png` | 100 dpi proof for review by email |
| `dist/site/` | Static site, deployed to `signs.millrivertrail.com` by GitHub Actions on every push to `main` |

## Images: two resolutions

The historic photographs exist at two sizes, and only one of them is in this
repository.

| | Where | In git? |
|---|---|---|
| Print masters | `assets/images/sign-NN/` | **No** — archival scans, see [NOTICE.md](NOTICE.md) |
| Web copies | `assets/web/sign-NN/` | Yes — 1600 px, ~100 KB each |

`node build/make-web-images.mjs` derives the second from the first. Run it after
adding images for a new sign, then commit `assets/web/`.

This means **the site builds from a fresh clone, the print PDFs do not.** For
those you need the masters from the project's Drive folder. That is deliberate:
the museums supplied high-resolution scans for this signage project, not for
open redistribution.

## What the build checks for you

Sign fabrication is one-way, so the build refuses to be quiet about the two
failure modes that actually bite:

- **Copy-fit.** Spanish runs 15–20% longer than English for the same content. The
  renderer measures each language column in the browser and shrinks its body type
  just enough to fit, then tells you it did. If it still cannot fit, the build
  exits non-zero rather than shipping clipped text.
- **QR targets.** After rendering, the build scans the QR codes back out of the
  finished artwork and checks each one encodes the URL printed beside it.
- **Built destinations.** `build/check-links.mjs` proves every printed URL points
  at a page that actually got built, on the domain the site deploys to. It runs
  in CI before publishing and fails the deploy on any mismatch — this is the
  check that would have caught `millrivertrail.com/submarine` being printed on a
  comp while returning a 404.
- **Live destinations.** `npm run check:live` scans the QR codes out of the
  finished artwork and fetches them over the network, the way a phone would,
  then confirms each one serves the right page in the right language. Run it
  before releasing artwork to the fabricator.

Together:

```
render-sign    the QR encodes the URL printed beside it
check-links    that URL matches a page the build produced
check-live     that URL is served, over HTTPS, and serves the right page
```

Both appear in the build log:

```
▸ sign-01-submarine — Famous Stolen Submarine  [proof]
  ↓ auto-fit  ES column 24pt → 23.25pt
  ✓ QR en scans to https://www.millrivertrail.com/submarine
  ✓ QR es scans to https://www.millrivertrail.com/submarino
```

## Layout

`build/theme.mjs` holds the grid, palette, and type scale. Every number in it was
measured off the designer's comp (`Mill RIver Comp_9-4-22.png`, 1685 × 1122 px at
36 × 24 in = 46.81 px/in), so the rebuilt sign sets to the same rhythm as the
printed proof. `build/sign-template.mjs` holds the slot geometry.

Change a value in `theme.mjs` and all twelve signs move together.

### Fonts

The comp's faces are a Helvetica-class grotesque for display and a
Myriad/Frutiger-class humanist for body. The system uses Archivo and Source Sans 3 — both
open source, both close in feel to the comp, and settled on deliberately rather
than as placeholders. To swap in different faces, drop them in `assets/fonts/`
and change the two names in `theme.mjs`; nothing else needs to change.

### Locator maps

`build/make-map.mjs` draws each sign's "You Are Here" panel from OpenStreetMap:

```bash
npm run map                       # any sign missing a map
node build/make-map.mjs --force   # redraw everything
```

It queries Overpass for the river, water bodies, parks and wetland, railways,
streets and trails around the sign's coordinates, projects them to the panel's
aspect, and draws an SVG in the sign palette — with the marker, a north arrow, a
scale bar, and street labels placed to avoid both the marker and the areas where
the sign lays the logo and species boxes over the map.

OSM responses are cached in `.cache/osm/`, so redrawing is free. Map data is
© OpenStreetMap contributors under the ODbL; **the attribution printed in the
corner of each map has to stay there.**

To reframe a map, change `SPAN_LAT` at the top of `make-map.mjs` — it is how much
ground the panel covers north to south, in degrees of latitude.

## Adding a sign

1. Copy `content/sign-01-submarine.yml` to `content/sign-02-ball-island.yml`.
2. Fill in the text, captions, image filenames, slug, and coordinates.
3. Put its images in `assets/images/sign-02/`.
4. `npm run all` — the locator map draws itself from the coordinates, the web
   images are derived, both outputs build, and the links are checked.
5. Commit `assets/web/sign-NN/`; pushing to `main` deploys the pages.

## Deploying

Pushing to `main` builds the site and publishes it to GitHub Pages. The workflow
runs `check-links.mjs` first, so a sign whose printed URL has no page behind it
fails the deploy instead of shipping.

The site is served at **signs.millrivertrail.com** — the host comes from the
sign content itself (`urls.en_full`), which is also what gets encoded into the
QR codes, so the printed address and the deployed domain cannot disagree.

See [docs/DECISIONS.md](docs/DECISIONS.md) for the DNS record this needs.

## Layout of the repo

```
content/     one YAML per sign — the single source of truth
assets/      fonts, icons, print masters (ignored), web images (committed)
build/       theme, template, renderers, map generator, link checker
docs/        decisions and the corrections log
dist/        generated output (not committed)
.github/     builds and deploys the site on push to main
```

## Source material

The original research and design handoff lives in
`Mill River Sign Project -History and design-*.zip`: five sign drafts as .docx,
a 38,000-word research notes document with sourced material for roughly a dozen
more signs, historic images, and `Mill River Signage Plan.kmz` with the twelve
planned sign locations.
