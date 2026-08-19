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

10. **"Doug Houslauden" → "Doug Hausladen"** in the credit line. Confirmed with
    the project.

## Decisions made

### 1. QR codes point at a subdomain — settled

Signs print **`signs.MillRiverTrail.com/submarine`** and
**`signs.MillRiverTrail.com/submarino`**. The generated site in `dist/site/` is
plain static files; host it on Netlify, GitHub Pages or Cloudflare Pages and
point a CNAME at it. Google Sites keeps the main site untouched.

**Built and deployed.** The site is live, published by GitHub Actions on every
push to `main`:

- Repository: <https://github.com/jrlogan/mill-river-trail-signs>
- Currently serving at <https://jrlogan.github.io/mill-river-trail-signs/>

**Live at <https://signs.millrivertrail.com/>.** The `signs` CNAME is in place at
Hover pointing to `jrlogan.github.io`, the custom domain is set on the repo, and
Let's Encrypt has issued a certificate (`CN = signs.millrivertrail.com`, valid to
17 Nov 2026 and auto-renewing).

The apex `A` record and the `www` CNAME to Google Sites were not touched — the
main site is unaffected.

Verified end to end: the QR codes were scanned back out of the finished artwork
and fetched over the network.

```
▸ sign-01-submarine — Famous Stolen Submarine
  ✓ en  https://signs.millrivertrail.com/submarine
      → HTTP 200  "Famous Stolen Submarine — Mill River Trail"  lang=en
  ✓ es  https://signs.millrivertrail.com/submarino
      → HTTP 200  "Famoso Submarino Robado — Mill River Trail"  lang=es
```

Re-run that any time with `npm run check:live`.

### Two small follow-ups

- **HTTP-to-HTTPS redirect.** `https_enforced` is set on the repo, but the Pages
  edge is still answering plain `http://` with a 200 instead of redirecting.
  This lag is normal and usually settles within a day. It is not a functional
  problem — the QR codes encode `https://` explicitly, so a scan never touches
  HTTP. Worth re-checking before fabrication.
- **Scan the printed proof with an actual phone** anyway, once it comes back from
  the fabricator. Everything above tests the digital chain; only a phone tests
  ink on metal at the size and contrast it was actually printed.

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

### Image resolution on sign 2

`Grand-MillRiver(1915c).jpg` is 1200 × 996 — the lowest-resolution image in the
set. It is placed in the smaller bottom-left slot at 5.26 in wide, which works
out to about 228 dpi. Fine where it sits; do not promote it to the hero slot.

### Species artwork for signs 2 and 3

Sign 2 has no species boxes. The chickadee, sumac and warbler drawn for the
submarine sign are upland species and would be wrong beside a marsh sign, so the
locator map takes the full panel instead — the template treats species as
optional.

Sign 3 has none either. A marsh sign wants **salt marsh cordgrass, ribbed
mussel, fiddler crab, great egret**; sign 3's river fact is about the spring
run, so a **river herring** would suit it. Illustrations in the same style would
finish both panels. Note the Noun Project licence question above before
commissioning or sourcing more.

### Kickapoo Indian Medicine Company — how it is described

The 2021 draft described the company's products as "specifically derived from a
Texas band of the Kickapoo Nation." That repeats the company's own marketing as
fact. Healy and Bigelow were white promoters out of the travelling-show
business; the Kickapoo name and imagery were borrowed to sell bottled alcohol
and vegetable extract. The sign copy now stays with what is documented, and the
web page states plainly that the claim was marketing while recording that Native
performers were employed and lived in the neighbourhood.

Worth a read by someone from the project before this goes to print.

## Artwork: what the walk-images folder closed

The `Mill River Trail Images for Walks` folder supplied **54 images**, and it
changed the picture substantially. Images still to source dropped from 36 to 26,
and four signs went to zero placeholders.

### What it resolved

- **Sign 1.** Two better images than anything previously available: the Fenian
  Ram *inside the shed on the Mill River*, photographed by Simon Lake — the most
  relevant photograph in the whole project — and the sub on its teal cradle at
  the Paterson Museum, which is the shot the 2022 comp used and which was
  missing from the handoff. That open question is closed.
- **Sign 2.** English Station lit up at night, and again in colour today.
- **Sign 4.** All four slots: the Whitney Arms Company engraving with East Rock
  behind it, a plan of the armory village, a painting of Lake Whitney, and a
  Lewis Osterweis trade card.
- **Sign 5.** Three of four: a swimming-bath interior engraving, a crowded
  municipal bath, and a period map with the bath house at Mill River Street and
  Beach Street. Exactly the material you thought might exist.
- **Sign 9.** Plate 46 from the 1910 plan — *"Mill River from State Street
  Bridge. This view may be preserved and the marsh reclaimed as park land"* —
  which is the 1910 argument in one caption.
- **Sign 10.** An aerial of the highway construction.
- **Sign 12.** The 1928 oyster ground map of the Mill and Quinnipiac.

### The species panels are now photographs

The `nature/` folder holds **17 species photographed along the trail**, already
named with common and scientific names. Those have replaced the guesses. Each is
classified native, invasive or introduced and distributed across the signs by
habitat, so the boxes now show real local observations rather than plausible
ones. Poison ivy appears on two signs, which is useful information for a walker.

This also removes the Noun Project licence question for most panels — these are
the project's own photographs.

## Sign 13: William Lanson

Not in the original KMZ. Added because the research notes ask *"what stories are
we systematically overlooking because of culture and records?"* and then answer
themselves with Lanson, in his own words, describing this river.

Sited on the trail south of Grand Avenue, sighted across the filled ground
toward the end of Greene Street. **Confirm this on the ground** — the sightline
is the whole point of the sign.

Research beyond the notes established:

- The Liberian Hotel was Ebenezer Peck's converted slaughterhouse, at the end of
  **Greene Street**, opened July 1830 as a boarding house for people of colour,
  furnished to about $1,000.
- The neighbourhood was **New Liberia**, inside **New Township** — the ground
  between Olive Street and the Mill River. Next to it was **Slineyville**, the
  Irish district. Lanson had earlier held **New Guinea**, east of Wooster Square.
  **Barnesville** was the Grand Avenue and East Street corner. Of these, only
  Barnesville and Fair Haven stayed on maps.
- **In 1831 the hotel was raided.** By one account the white patrons were
  arrested and the Black residents "were allowed to run."
- Prosecutions ran for years. In the mid-1840s Lanson was held under a newly
  passed adultery law on a $500 bond, and across roughly six years was
  imprisoned about 450 days in total. He maintained his innocence. He lost the
  property, fell into poverty, and died in 1851.

The quoted passage about working the scows at night comes from the 1845 pamphlet
carrying his own statement. **Check it against the printed source before print.**

## Images still to source: 26

Every one carries a written brief in its sign's YAML that prints inside the
placeholder on the proof. The ones most worth chasing:

- **Sign 11: the boat on top of East Rock.** Still the best single image on the
  trail if it exists.
- **Sign 8: the 29th Connecticut.** The most consequential story in the series.
- **Sign 13: New Liberia or the Liberian Hotel.** If any view survives, it would
  be significant well beyond this trail.
- **Signs 6 and 7** are largely natural history — river herring, a fishway, a
  fiddler crab, an egret, low tide. NOAA and USFWS hold public domain images,
  and several could simply be photographed on a good low tide.


## Sources on every page

Every sign's web page now carries a sourced reading list — 66 links across the
thirteen signs — plus a credits block naming Colin M. Caplan, Jason
Bischoff-Wurstle and Steve Hamm, and the OpenStreetMap attribution.

Where a link goes to a scanned original it is the actual document: the New Haven
newspapers on the Beach Street bath house from May 1880 and October 1881, the
1888 Library of Congress maps showing the bath house, Mill River Island and the
Whitney site, the 1910 Gilbert and Olmsted report, the 1934 aerial survey at the
Connecticut State Library, and the Yale Teachers Institute PDF that carries
Lanson's own words.

Those URLs came out of the Google Doc. The `.docx` in the original handoff had
the same text but the extraction stripped every hyperlink, so the live document
was worth reading even though the prose matched.

## The three learn pages already on millrivertrail.com

`/learn/famous-stolen-submarine`, `/learn/ball-island` and `/learn/barnsville`
are now linked as sources from the corresponding signs, so the two bodies of
work point at each other rather than competing.

**One discrepancy to settle.** The submarine page says the Fenian Ram sat in the
shed for "approximately four decades." It was seized in November 1883 and hauled
out in 1916 — **33 years**. The signs and the new pages say 33. Worth correcting
on the Google Sites page so the two do not disagree in public.

## Still needed from you

### The two Google Photos albums

The notes link two albums — scouting photographs of possible sign locations, and
your documentation of the signage already on the trail. Neither can be read
programmatically; Google Photos share links need a signed-in browser.

**Download them to a folder** the way you did with the walk images and they can
be used. The existing-signage album is the more useful of the two: it would show
what the trail already says, so these signs do not repeat it or contradict it.

### Indigenous history has no sign

The notes' own overview opens with *"Indigenous peoples hunted and fished along
the river for centuries before English colonists established the first mill in
1642"* — and then there is no sign about it. Thirteen signs cover mills,
factories, bridges, plans, a submarine and an oyster town, and the first several
thousand years are a subordinate clause.

The notes already point at native-land.ca for Quinnipiac and Wappinger
territory, and link a separate Quinnipiac River overview document.

This is not a sign to draft from web sources. It needs the Quinnipiac
Dawnland Council or comparable, involved from the start and credited. Worth
raising with the committee before the series is considered complete.

### Research leads in the notes worth chasing

- **The quarry scows to Trinity Church.** The notes ask about this directly, and
  it connects to sign 13 — the same East Rock stone, the same river, the same
  boats. If Lanson's crew supplied Trinity's stone that belongs on the sign.
- **Talmadge Bros.** Steve Hamm's walk notes place the oyster company south of
  English Station on the east bank, with shell piles and equipment still visible.
  That is a concrete, findable thing for sign 12.
- **The trolley turntable near the District**, the cardboard plant at 370 James,
  the Lake Whitney ice house, the linseed oil mill, and the thirteen mills north.


## Signage already on the trail

39 photographs from 1 and 15 April 2021, **34 of them carrying GPS**, so the
positions are the camera's rather than an estimate. 18 signs are catalogued in
`content/_existing-signs.yml` and published at `/on-the-trail` and
`/en-el-sendero`, each linking to its coordinates and to the new sign that
carries the story further.

The page carries **a map of the whole trail** — every planned sign numbered,
every existing sign a green dot — **a photograph of each existing sign**, and,
where the text is worth keeping, **a transcript**.

The photographs matter beyond illustration. Interpretive signs get removed,
vandalised and replaced; a legible photograph with a coordinate and a date is a
record that outlives the sign. The 2000px copies in `assets/web/existing/` are
committed for that reason — the sign text is readable in them. The
full-resolution originals stay out of the repository and live in the zip.

### It corrected our own sign

The Dam sign at the museum gives figures that **conflict with
millrivertrail.com's history**, and the conflict has to be settled before print:

| | Museum's sign at the dam | millrivertrail.com history |
|---|---|---|
| Dimensions | 38 ft tall, 500 ft long | raised 6 ft → 27 ft, then 31 ft |
| Dates | opened 1862, expanded twice since | 1860, 1866, plus 19 in. in 1916 |

Sign 4 now follows the museum, on the grounds that it is their dam and their
sign stands at it, and drops the intermediate heights rather than print a
contested number. **Someone should settle this properly.**

It also supplied detail nothing else had: the dam's stone was quarried in place
from Mill Rock and the northern ridge of East Rock; the reservoir stretched two
miles north; three mills were submerged; three bridges and twenty other
buildings were relocated, and oxen dragged the Town Bridge north to the crossing
now called Davis Street.

### It answered a question in the notes

The notes ask about *"the quarry scows that took the stone from here to
Trinity."* **The Barn sign at the Eli Whitney Museum answers it.** While Whitney
was quarrying the stone for the barn's foundation, he supplied Ithiel Town with
the stone for Trinity Church on the Green — Town being the architect who
patented the truss used on the covered bridge here. That belongs on sign 4.

The Coal Shed sign adds the mechanism: charcoal for the armory forges came *up*
the Mill River on a flat-bottomed scow and was carried up the hill. Scow traffic
on this river is now attested from two directions — Whitney's charcoal coming
up, Lanson's stone going down.

The Dam sign gives detail worth folding into sign 4: the public wells had become
untenable as the city doubled in size, the factories had made fire constant, and
eighteen miles of pipe carried Lake Whitney into New Haven.

### It also flagged a duplication risk

There are already three good natural history signs on this river — **The Salt
Marsh Wall** at Criscuolo, **Mill River Watershed** in East Rock Park, and
**Songbirds: Neotropical Migrants**. The new species panels deliberately pick
different plants, and no more bird illustrations should be commissioned without
looking at the Songbirds sign first.

### And it strengthens sign 8

The 29th Connecticut monument at Criscuolo carries a narrative worth quoting:
after the Colored Ladies of New Haven presented the regiment its flag, it
marched aboard the transport *Warrior* on 19 March 1864 and sailed for
Annapolis.

## New story leads, checked

### Bigelow Boiler — real, and a Mill River story

Hobart B. Bigelow took over a division of the Wilcox foundry in 1860 and in
**1869 moved his steam engine and boiler works east of the Mill River to River
Street** — onto the abandoned oyster fields of Fair Haven's first industrial
boom. It became one of the largest steam boiler makers in the United States.
Bigelow was mayor of New Haven from 1879 and then the 50th governor of
Connecticut; he died in 1891. Manufacturing ended in the mid-1980s after about
150 years, and most of the complex has now been demolished — the eastern 1884
block survived as of 2023.

That is a sign in itself, and it connects the industrial story to the oyster one.

### The oyster stories — partly confirmed

- **Watch houses are real.** By the mid-18th century small huts were put up on
  the shoreline so men could guard the beds at night, backed by Oyster Laws that
  banned raking from May to August on a penalty of twenty shillings a bushel.
  **The "on stilts" detail is not confirmed** in what I could find.
- **The burning is not confirmed.** What is documented is the 1924-25 typhoid
  epidemic: about 1,500 sickened and roughly 150 dead across Chicago, New York
  and Washington, traced to raw oysters, which produced the National Shellfish
  Sanitation Program. The oysters in that outbreak were traced to **West
  Sayville, Long Island**, not New Haven. The collapse of the Connecticut
  industry is real and the typhoid scare is part of it, but a government burning
  of New Haven oyster houses needs a source before it goes on a sign.

### The Fair Haven steamboat — not yet found

Connecticut's steamboat era ran roughly 1820 to 1940, and sidewheel steamers
worked the New York-New Haven route. Fair Haven grew around a ferry crossing at
what is now the Grand Avenue bridge. But nothing specific about a paddlewheel
steamer at the end of Fair Haven surfaced. Needs a name or a date to chase.

### The tide gate deserves more than it has

Sign 6 covers it, but the freshwater tidal reach between the gate and the
Whitney dam is genuinely unusual and the sign only glances at it. Worth
expanding, along with the gate's construction date — "appeared around 1930" is
the best the notes do, and that is not good enough for print.

### Lake Whitney recreation and the East Rock retaining ponds

Not covered anywhere yet. The notes list Lake Whitney recreational use and the
ice house among things to learn more about. This is a good candidate for a
future sign.

## Sign inventory

Thirteen signs. All twelve KMZ locations plus William Lanson. Signs 1-4 have
complete artwork; the rest are drafted in both languages with layout, locator
maps, species panels and live web pages.

| # | Sign | Title | EN | ES | Images | Print | Web |
|---|---|---|---|---|---|---|---|
| 1 | Fenian Ram | Famous Stolen Submarine | ✅ | ✅ | ✅ | **proof** | ✅ |
| 2 | Ball Island | Marsh, Mud and Meadow | ✅ | ✅ | ✅ | draft | ✅ |
| 3 | Railway Bridge | Three Bridges North | ✅ | ✅ | ✅ | draft | ✅ |
| 4 | Lake Whitney | The Dam That Fought Fires | ✅ | ✅ | ✅ | draft | ✅ |
| 5 | Bath House | Where the City Bathed | ✅ | ✅ | ⬜ 1 | draft | ✅ |
| 6 | Tide Gate | The Gate in the River | ✅ | ✅ | ⬜ 4 | draft | ✅ |
| 7 | Tides | Twice a Day, the Sea | ✅ | ✅ | ⬜ 4 | draft | ✅ |
| 8 | Criscuolo Park | Camp at Grapevine Point | ✅ | ✅ | ⬜ 4 | draft | ✅ |
| 9 | Planning | A Century of Plans | ✅ | ✅ | ⬜ 2 | draft | ✅ |
| 10 | I-91 / East Rock | The Highway That Wasn't | ✅ | ✅ | ⬜ 3 | draft | ✅ |
| 11 | East Rock Park | A Boat on the Rock | ✅ | ✅ | ⬜ 4 | draft | ✅ |
| 12 | Dragon Point | Dragon Point | ✅ | ✅ | ⬜ 3 | draft | ✅ |
| 13 | William Lanson | King Lanson's River | ✅ | ✅ | ⬜ 1 | draft | ✅ |

**26 images to source.** Every one carries a written brief in its sign's YAML,
which also prints inside the placeholder on the proof. A great many of them are
public domain — anything published before 1930 — and the Library of Congress,
NOAA, USFWS and the Smithsonian cover a surprising share of what is needed.

### The ones most worth chasing

- **Sign 11: the boat on East Rock.** A showman built a full-size wooden boat on
  the summit and charged admission. If a photograph or engraving exists, it is
  the best single image on the trail.
- **Sign 8: the 29th Connecticut.** The regiment trained on the ground that is
  now Criscuolo Park. This is the most consequential story in the series and
  deserves the strongest picture available.
- **Sign 5: the bath house.** You mentioned there may be a map, a bath house
  view and a newspaper clipping. Nothing bath-related is in the handoff folder,
  so those would fill three of the four slots on that sign directly.

### Notes for review before print

- **Sign 5** is written at the level the sources support. The national public
  bath movement and the absence of plumbing in New Haven tenements are well
  documented; the specific opening date, operator and exact site of the Mill
  River bath house still need confirming from the 1880-81 newspaper coverage.
- **Sign 8** should be read carefully by the project for tone and local detail.
- **Species picks across signs 2-12 are educated guesses.** They are chosen to
  be plausible for each location and to mix natives with invasives, since
  knowing which is which is the useful part. Walk the sites and swap them.

