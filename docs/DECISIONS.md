# Open decisions and corrections log

## Corrections made to the 9/4/22 comp

These are already applied in `content/sign-01-submarine.yml`. Each is worth a
second pair of eyes before the sign is fabricated.

### Factual

1. **"launching Fenian Ram in 1875" → 1881.** The comp's opening sentence gave
   1875 as both the year Holland began designing and the year the Fenian Ram
   launched. The Ram launched in May 1881; 1875 is when he started designing.
   The correct dates are in your own `Trail Sign #1 - Submarine.docx`.
2. **"designed submarines for the US Navy… launching Fenian Ram."** The comp's
   compression conflated two things. The Fenian Ram was funded by the Fenian
   Skirmishing Fund, not the Navy — the Navy had rejected Holland's plans. The
   Navy commission came later.

### The honoree's name

3. **"Tom Halahan" → "Tom Holahan"**, in both languages. The comp misspells it in
   the dedication line while spelling it correctly as "Susan B. Holahan" in the
   credit line three inches below. Confirmed by the
   [Tom Holahan Fund for the Mill River Trail](https://www.cfgnh.org/funds/tom-holahan-fund-for-the-mill-river-trail)
   at the Community Foundation. Alder Tom Holahan championed the trail and died
   in 2007; this is the sign that honors him.

### Spanish

4. **Two caption boxes read "Spanish version to come."** The Spanish existed in
   the .docx and simply never made it into the layout. Restored.
5. **"En honor al blazer de trail Tom Halahan"** — "trail blazer" rendered
   word-for-word with the English words left in place. Now
   "En honor al pionero del sendero Tom Holahan".
6. **"Mas en Linea" → "Más en línea".** The accents were dropped in the comp;
   your own earlier SVG had them right.
7. **"Submarino del John Holland" → "El submarino de John Holland."** "del"
   before a personal name is ungrammatical in Spanish.
8. **The Spanish body flowed across a section heading.** On the comp the
   paragraph beginning in the top-right block continues *underneath* the
   "Submarino del John Holland" heading, so a Spanish reader hits a heading
   mid-sentence. The English side does not do this. Fixed by the copy-fit system.
9. Errors carried in the draft translations, now fixed:
   - "el viejo carnero feniano" — *Fenian Ram* machine-translated into "carnero",
     a male sheep.
   - "el fondo financiero de Holanda" — *Holland* the surname translated into
     *Holanda*, the country.
   - "el jardín de Madison Square" — *Madison Square Garden* translated literally.
   - `Traducción realizada con la versión gratuita del traductor www.DeepL.com`
     left in the body text of signs 2 and 3.
   - "El terrenoLa tierra que pisas" — an un-deleted edit at the top of sign 2.
   - Bird names left in English inside quotation marks in the nature fact.

### To verify with the committee

10. **"Doug Houslauden"** in the credit line. New Haven's transportation director
    is Doug **Hausladen**. Currently set to Hausladen — confirm against the
    donor list before printing.

## Decisions made

### 1. QR codes point at a subdomain — settled

Signs print **`signs.MillRiverTrail.com/submarine`** and
**`signs.MillRiverTrail.com/submarino`**. The generated site in `dist/site/` is
plain static files; host it on Netlify, GitHub Pages or Cloudflare Pages and
point a CNAME at it. Google Sites keeps the main site untouched.

**Still to do before fabrication:** create the DNS record and deploy
`dist/site/`, then scan the printed proof with a phone. The build verifies the
QR codes *encode* the right URL; it cannot verify the URL *resolves*.

Because the subdomain is under your control, the destination can be redirected
later without touching any sign already in the ground.

### 2. Fonts — settled

Archivo (display) and Source Sans 3 (body). Both open source, both close in feel
to the comp, chosen on their merits rather than kept as placeholders. No need to
chase Design Monsters for the originals.

### 3. Locator maps — generated from OpenStreetMap

`build/make-map.mjs` draws each panel from live OSM data: the river, water
bodies, parks and wetland, railways, streets and trails, plus the marker, a
north arrow, a scale bar, and street labels. It works from the coordinates
already in the KMZ, so all twelve panels come free with the sign.

One licence obligation: OSM data is ODbL, and **the "© OpenStreetMap
contributors" credit printed in the corner of each map must stay on the sign.**

Two things worth a look before printing:

- Check the marker sits exactly where the sign will physically stand. The
  coordinate comes from the KMZ, which was scouting-accurate, not survey-accurate.
- OSM is community-maintained. Have someone who knows the neighbourhood glance
  at each map for anything missing or out of date.

### 4. The missing museum photograph — settled

Keeping `FenianRam(1980-06-14)SubmarineForceMuseum.jpg`, a colour shot of the
submarine on outdoor display, in place of the comp's interior shot. Same caption,
no chase required.

## Decisions still open

### Doug Hausladen's name

The credit line is currently set to **Hausladen**. Confirm against the donor list
before printing — see the corrections above.

### Image resolution on sign 2

`Grand-MillRiver(1915c).jpg` is 1200 × 996, about 4 in wide at 300 dpi.
Large-format signage is usually specified at 150 dpi at final size, so it is
workable — just do not plan on running it large.

## Sign inventory

Twelve locations are planned in `Mill River Signage Plan.kmz`.

| # | Sign | English | Spanish | Images | Layout | Web page |
|---|---|---|---|---|---|---|
| 1 | Submarine (Fenian Ram) | done | done | done | **built** | **built** |
| 2 | Ball Island & Marshes | done | needs edit | done | — | not written |
| 3 | Rail & Industry | done | needs edit | done | — | not written |
| 4 | River Industry | — | — | — | — | — |
| 5 | Bath Houses | — | — | — | — | — |
| 6–12 | Tide Gate, English Station, Chapel St / Criscuolo, Tides & Urban Oasis, Planning History, Highway-over-River, Historic Spring, Dragon Point | research notes only | — | — | — | — |

Signs 4–12 have sourced raw material in
`Mill River Historic And Natural Story Points for Signage Rough Notes.docx`
(38,000 words, with citations) — enough to draft from without new archival work.
