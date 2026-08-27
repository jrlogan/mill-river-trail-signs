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

This is not a sign to draft from web sources. **But it is a sign to draft
something for**, because a gap nobody can see is a gap nobody answers. Sign 14
now exists as a deliberate placeholder — see *Sign 14 is a blank panel on
purpose* below.

**Correction to these notes:** they name a "Quinnipiac Dawnland Council" as the
body to consult. No such council appears to exist. The name in circulation
belongs to the **Quinnipiac Dawnland Museum/Collection**, now held at the Dudley
Farm Museum in Guilford, which is a collection rather than a governing body.

### Research leads in the notes worth chasing

- **The quarry scows to Trinity Church.** **Closed, and it was two stories, not
  one** — see *Lanson did not quarry at East Rock* below. Trinity's stone was
  Whitney's, from East Rock. Lanson's stone was his own, from East Haven.
- **Talmadge Bros.** **REFUTED** — see *The last research round* below. There was
  no Mill River shore plant. Do not put one on a sign.
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

Sign 4 follows the museum. **The conflict is probably not a conflict at all** —
see *The dam figures reconcile* below. And the survey that would prove it exists:
**HAER CT-186-C**.

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

- **Watch houses are real, and now proven from the newspapers.** See *The
  oyster questions are closed* below. The **"on stilts"** detail is half right
  and now on sign 12 with the correction.
- **The burning did not happen, and there is a far better story underneath it.**
  See *The oyster questions are closed* below. Sign 12 now carries both.

### The Fair Haven steamboat — found, and it was never a paddlewheeler

**Closed.** See *The Fair Haven steamboat was an oyster dredge* below. The reason
nothing surfaced is that the search was for the wrong kind of vessel, and the
photographs that do turn up under "steamer at Fair Haven" are **New Jersey**.

### The tide gate deserves more than it has

Sign 6 covers it, but the freshwater tidal reach between the gate and the
Whitney dam is genuinely unusual and the sign only glances at it. Worth
expanding, along with the gate's construction date — "appeared around 1930" is
the best the notes do, and that is not good enough for print.

### Lake Whitney recreation and the East Rock retaining ponds

Not covered anywhere yet. The notes list Lake Whitney recreational use and the
ice house among things to learn more about. This is a good candidate for a
future sign.


## Sign 5 is now sourced from the newspapers

The Library of Congress blocks direct fetches of Chronicling America page
images, but its item API exposes the underlying IIIF service and the ALTO OCR
XML, which are not blocked. That gave both the text of the two bath house
reports and coordinates precise enough to crop the clippings out of the page
scans. Both are on the sign's page.

**New Haven Morning Journal and Courier, 25 May 1880, "The Bath Houses":** the
bath house committee had decided a deep water tank at the Beach Street bath
house was impracticable that season — to build one they would have to "move the
present bath house further out into the stream and then fill in Beach street out
to it," and neither the appropriation nor the lateness of the season allowed it.
A deep water tank at the West bridge bath house was still under consideration.
"It is thought that both bath houses will be opened to the public on the first of
June."

**The same paper, 4 October 1881,** reporting the committee's account of the
season: it recommended the Beach Street bath house be removed to Neck Bridge and
made a floating tank, and "that a floating bath be built on the east side of
Chapel street bridge on Mill river, or at such point thereabouts as will be
found most suitable."

So the following are now established rather than assumed: New Haven had **two**
municipal bath houses by 1880, at Beach Street and the West bridge; a standing
**committee on bath houses** managed them and reported each season; they opened
to the public on **1 June**; and a **floating bath on the Mill River at the
Chapel Street bridge** was formally recommended in the autumn of 1881.

### Two things this raises

- **The sign may be in the wrong place.** Its KMZ point is below Humphrey Street,
  but the documented Mill River locations are the **Chapel Street bridge** and
  **Neck Bridge** at State Street. The Chapel Street bridge is beside Criscuolo
  Park, which is sign 8's ground. Worth deciding whether sign 5 moves, or whether
  its copy simply describes both sites.
- **Still open:** whether the Chapel Street floating bath was ever built, how
  long any of them lasted, and whether they were free. The reports read as
  though they were, but they do not say so.

### The method is reusable

`https://www.loc.gov/item/{lccn}/{date}/ed-1/?fo=json` returns, per page, the
ALTO XML and the IIIF image base. Search the ALTO for a phrase, take the
TextLine coordinates, scale by the ratio of the jp2 pixel size to the ALTO page
size, and request that region from IIIF. That is how to get any other clipping
this project wants — the Fenian Ram pages from 1881, 1885 and 1887 are all in
the notes and all reachable this way.

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
| 14 | First People | The Sign Not Yet Written | ✅ | ✅ | ⬜ 4 | **placeholder** | ✅ |
| 15 | 370 James St | The Box and the Jacket | ✅ | ✅ | ⬜ 4 | draft | ✅ |

**26 images to source.** Every one carries a written brief in its sign's YAML,
which also prints inside the placeholder on the proof. A great many of them are
public domain — anything published before 1930 — and the Library of Congress,
NOAA, USFWS and the Smithsonian cover a surprising share of what is needed.

### The ones most worth chasing

- **Sign 11: Stewart's boat on East Rock.** Not a showman and not an ark — see
  *The East Rock boat is real, and better than the version we had* below.
  "Many hundreds of people" saw it up there, so a photograph or engraving may
  well exist. Still the best single image on the trail if it turns up.
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
- **Species picks were educated guesses. They are not any more** — most of them
  turned out to be right, and the rest have been swapped for species actually
  recorded on the trail. See *The 2024 bioblitz* below.



## Research, 26 August 2026

Five questions were put to the archives: the East Rock boat, the bath house
clippings, the tide gate, the Indigenous gap, and an image of the scows. Four
came back with something. Here is all of it.

### The East Rock boat is real, and better than the version we had

Sign 11 said a showman built a boat on the summit, called it Noah's Ark, and
charged admission. **All three of those details are wrong**, and the true story
is stronger.

The top of East Rock belonged to **Milton J. Stewart**, a former sailor who
lived up there in a stone house he built himself. He built **eight-to-ten-ton
oyster boats on the summit** — real working craft, fitted with a five or six
horse-power steam boiler once they reached the water — and got them down by
waiting for heavy snow, loading the hull on an ox-sled with bolsters under it,
and walking a pair of horses down the old Rock road to tide water at Neck
Bridge. He did it at least twice, about twenty years apart. One boat was sold to
a Bridgeport firm and was still working oyster beds there in 1887.

The source is **"An Oyster Craft — Mr. Stewart's Shipbuilding on Top of East
Rock," Morning Journal and Courier, 22 February 1887, page 4**, and *the project
already had the clipping*. It was pulled for sign 1, because the same article
ends by placing the Fenian Ram in a shed near Neck Bridge, in use as a chicken
coop. Nobody noticed that the front two-thirds of it was sign 11's missing
story. The clipping is now on both signs.

A second Journal and Courier piece — an East Rock Park guide printed **8 July
1884, page 2** — corroborates Stewart's ownership from another direction,
routing visitors past "the old Stewart road" near the quarry sites.

**Leads found but not yet verified**, all via a compilation on the Roger Sherman
House blog, which cites papers that are not in Chronicling America and so could
not be checked directly:

- A 35-foot schooner Stewart began on the summit, which could not be got down
  and was broken up for firewood (*Boston Sunday Globe*, 12 June 1887).
- Counterfeiters' workings found under the Stewart house when the park
  commissioners demolished it (*Boston Daily Globe*, 11 October 1884).
- Stewart's refusal to vacate, the condemnation, roughly $40,000 paid, the
  houses he then built at the foot of Mill Rock, and his death a pauper
  (*Hartford Daily Courant*, 20 November 1886; *Daily Standard Union*, Brooklyn,
  4 September 1899).
- **The flood prophecy.** The 1899 Brooklyn account is the only source for the
  story that Stewart predicted Long Island Sound would drown Connecticut and
  built the boat as an ark. It is twelve years after the fact and a long way
  from New Haven. The sign now carries it explicitly labelled as folklore. If
  somebody finds it in a New Haven paper, it can be promoted.

That blog is worth reading in full: <https://rogershermanhouse.com/2019/09/05/new-havens-great-park/>

### The bath houses: an elected office, ten ballots, and an anonymous smear

The recollection was right on every count. New Haven's Court of Common Council
**balloted for the office of bath house keeper**, and it was contested.

- **1882, 2 May.** Beach street: Timothy Crowley 18, Walter Mitchell 2. West
  bridge: Daniel Lovejoy 12, Patrick McDermott 6, Bernard Oberkehr 2.
- **1883, 2 May.** West bridge deadlocked 4-4 for Owen Kelly and Patrick
  McDermott through **ten consecutive ballots** and had to be reported back.
- **1886, 13 April.** A motion to substitute Richard Ward's name for Daniel F.
  Brennan's, for the West river house, was lost.
- **1887, 10 May.** Committee members received **anonymous letters**,
  "disgraceful in the extreme," smearing the candidate Reynolds. The aldermen
  appointed him anyway; the council voted to recommit. The letter-writer was
  never found.

Petitions to be appointed keeper run through the council minutes for a decade —
Lovejoy, Crowley, Michael Keys, Stephen Blakeslee, Edward Ward, James Noonan,
Bernard Oberker, William Cummings, James Tiernan, Peter Sweeney, L. F. Cone.
The pay was **$2.50 a day**, and in June 1881 the committee had to reconsider
even that, because the whole appropriation was **$500** and would have run out
before the hot season closed.

**The tub is real too.** It was called a *tank*. Sealed proposals were advertised
on **24 June 1880** for "constructing a floating bath house at West Bridge," and
on **4 August 1881** the paper reported that "the new floating bath tank at West
bridge will be in readiness for use to-day." The 1880 report already discussed a
**deep water tank** at Beach street and rejected it as impracticable that season.

**Two Mill River locations — and more than two bath houses.** The city ran a
network: Beach street, West bridge (later called the West river house), a
proposal at the foot of English street in Fair Haven (referred back repeatedly
from 1883 to 1886, and remonstrated against by neighbours), one at the Cedars,
and by 1892 proposals at the foot of Blatchley avenue and the south end of
Hamilton street. In **April 1889** the council handled petitions for a "keeper of
bath house on **Mill river**" and a keeper "on Beach street" as two separate
posts. In **August 1882** two sons of Margaret English drowned "in Mill river,
near the Beach street bath house."

**Were they free?** Not settled, but there is now a strong hint: on **24 October
1892** the Committee on Bath Houses advertised a meeting at which "the matter of
establishing **free** public bath houses will be considered." Which suggests the
1880s houses were not.

**The keepers were lifeguards.** Timothy Crowley recovered a drowned boy near
the Grand street bridge in May 1883 and another at Mill river in July 1886, the
second with grappling hooks. In **March 1889** the paper described a "well known
Mill river bath house keeper" who "has probably saved about fifteen lives during
his services."

**One more, for sign 2.** On **20 July 1892**, under the headline "Need of a Bath
House," two boys from Haven street drowned at the common bathing place behind
the Adamant Plaster company's shop **at Barnesville bridge**.

None of this is on sign 5 yet. It is more than enough to rewrite it, and it
changes the sign from a public-health essay into a story about a city arguing
over a $2.50-a-day job on a river people kept drowning in.

**The method:** `node work/chrongrep.mjs '<query>' sn82015483 <y1> <y2> <rows>`.
It searches Chronicling America and prints the matched snippet from LoC's
word-coordinates service, which is far cheaper than downloading page OCR. Left
in `work/` deliberately.

### The tide gate: still not pinned down

The honest answer is that **nobody has produced the document**. What is now
established:

- The **1910 Gilbert and Olmsted plan** recommended a tide gate. Already on the
  sign.
- **Mosquitoes, not just floods.** In the 1910s New Haven ran a marsh campaign —
  ditching, oiling standing water and, in the words of the account of the 1912
  season, "looking after the tide gates" (*The New Haven Union*, 30 June 1912,
  page 18, LCCN sn92051126).
- The **West River** gates went in **1919**, explicitly for mosquito control, and
  the city fitted three self-regulating gates there in **2012**. **This is a
  different river** — an early search conflated the two, and it should not
  happen again on a sign.
- The **Mill River** gates are at the **Interstate 91 crossing**, near State
  Street. Save the Sound's watershed plan lists them among the barriers to fish
  passage. Yale's water-management summary says "installed in the 1930s" without
  a citation.

Sign 6 now says "early in the last century," gives the mosquito motive, and
states on the web page that the year is unresolved and invites anyone who knows
where the paper is. **Where to look next:** New Haven Board of Public Works and
City Engineer annual reports, and the Court of Common Council journals, which
recorded exactly this kind of contract — the same series that produced the bath
house record above.

A usable photograph exists: *The tide gates on the Mill River seen at slack
tide*, Wikimedia Commons, 2018, by Envchemprof, **CC BY-SA 4.0**. Share-alike on
a printed plate is worth a thought; shooting our own at slack tide is simpler.

### Sign 14 is a blank panel on purpose

`content/sign-14-first-people.yml`, status `placeholder`. Title: **The Sign Not
Yet Written**. It says there are thirteen other signs covering four hundred
years, that people were here for thousands before that, that this project has
not earned the right to describe it, and that the panel is therefore an
invitation. The four image slots are not image briefs — they carry the three
open questions (who should write it, where it goes, what it even is) and one
slot reserved for whoever does.

It renders, it has a locator map, and its QR codes resolve to
`/first-people` and `/primeros-pueblos`, slugs chosen to survive the sign being
properly written later.

**The uncomfortable finding.** The obvious step — ask the tribe — is not
available in the usual form:

- The Quinnipiac hold **neither federal nor state recognition**. Connecticut
  recognises five tribes — Mohegan, Mashantucket Pequot, Eastern Pequot,
  Schaghticoke and Golden Hill Paugussett — and none of them is Quinnipiac.
- The organisation that carries the Quinnipiac name most visibly online, the
  **Algonquian Confederacy of the Quinnipiac Tribal Council**, is an
  unrecognised heritage nonprofit headquartered in **Indiana**. Its founder,
  Iron Thunderhorse, has been imprisoned in Texas since 1977 for rape, kidnapping
  and robbery, and its registered agent was never able to establish descent from
  the historic Quinnipiac. **Do not put that name on a sign.**
- The "Quinnipiac Dawnland Council" in our own notes does not appear to exist.

The routes that are real:

- **CT Humanities, "Working with Indigenous Communities"** —
  <https://cthumanities.org/indigenous/> — a published protocol for precisely
  this situation. Start here.
- The state's **Indian Affairs Council**, the **Native American Heritage Advisory
  Council**, and the **State Archaeologist**.
- The **Native Northeast Research Collaborative**, formerly the Yale Indian
  Papers Project — <https://www.thenativenortheast.org/> — two decades of
  primary sources digitised, transcribed and reviewed with the relevant
  communities, a mile from this river. Its Quinnipiac page notes that the 1638
  New Haven settlement reserved a bounded tract, described as the first Indian
  reservation in the country.

This is a decision for the committee, not for the build. The placeholder exists
so the committee has to make it.

### The scows: no period image found

Nothing was found showing a scow on the Mill River, or a New Haven stone or
charcoal scow of any date. What is available, all public domain:

- *Planting Oyster Shells in Long Island Sound in Order to Catch Set* — US
  Bureau of Fisheries, 1919. Scow loads of shell under tow, in this water. Right
  region, right craft, wrong cargo. **Only 580 × 476 on Commons**; the original
  report scan would give print resolution.
- *"The Creek" at Keyport, N.J., with oyster-boats, skiffs, and scows* — Goode,
  *Fisheries and Fishery Industries of the United States*, 1887.
- Goode (1887) and Ingersoll's *The Oyster Industry* (1881) both have New Haven
  chapters and plates and have not been searched properly. That is the next
  place to look.

Also surfaced and worth someone's afternoon: *Historical Sketch of Old Fair
Haven*, on Internet Archive via Commons.

### Sign 8 and the 29th Connecticut

Noted as project direction: the regiment already has its monument at Criscuolo,
so sign 8 is not being rewritten to duplicate it. The image brief still stands.

### Sign inventory is now fourteen

Sign 14 is a placeholder and will never carry a `printed` status in its current
form. The build learned a new status word for it: `placeholder` is accepted by
`render-sign.mjs` alongside `draft` for signs whose artwork is incomplete, and
`render-site.mjs` prints a different note for it — that the sign is deliberately
unwritten rather than merely unfinished.


## The oyster questions are closed

Both of the oyster questions this file has been carrying since the start are now
answered. The prompt was a Gemini deep-research report supplied by JR; the
answers below are the parts of it that survived independent checking, plus what
the newspapers added.

**Read the caution at the end of this section before trusting the report for
anything else.**

### There was no government burning — and the real story is world-class

No health authority burned New Haven's oyster houses. There is no record of it,
and the epidemic usually attached to the story (1924-25, about 1,500 sick and
roughly 150 dead) traces to **West Sayville, Long Island**, as this file already
noted.

What actually connects New Haven to oyster typhoid is **October 1894**, and it
is much more important than the legend.

Typhoid broke out at **Wesleyan University** in Middletown, and it struck only
the fraternities that had served **raw oysters at their initiation banquets**.
**Herbert W. Conn**, a Wesleyan biologist, traced the supply back to a **Fair
Haven dealer**. The oysters had been dredged from clean deep water, but — as the
trade routinely did — they had been shifted to **floats in the brackish river to
fatten** before packing, and the floats sat downstream of a sewer outlet from a
house where somebody was convalescing from typhoid.

The case tightened on a detail worth keeping: two students from non-oyster
fraternities also fell ill, and it emerged that they had gone along to the fish
house and been given oysters on the half shell by the obliging owner.

**This was the first clear demonstration in the United States that oysters
transmit typhoid.** The state began condemning beds near New Haven. Independent
confirmation is in the public-health literature, not just the report; Charles J.
Foote at Yale ran supporting bacteriology at the request of C. A. Lindsley,
Secretary of the Connecticut State Board of Health, which is a second New Haven
thread worth pulling.

Sign 12's generic "overfishing and pollution" collapse section is now rewritten
around this, plus the 1924-25 aftermath and the 1925 National Shellfish
Sanitation Program.

**Where the fire in the legend probably comes from:** City Point oystermen
remembered condemned shipments being **pulled off freight trains at the rail
yards and burned in the barrel**, so they could not be resold. This comes from
Tim Visel's oral histories with George McNeil, son of J. P. McNeil of the McNeil
Oyster Company. **I could not verify the barrel-burning passage in the two Visel
papers I checked**, so sign 12 attributes it to what the oystermen remembered
rather than stating it as fact. Somebody with access to the full Visel corpus at
sound.school should nail it down.

### The watch houses were real, were on the water, and were armed

Three primary hits in the *Morning Journal and Courier*, all new:

- **9 September 1886.** Three boys aged twelve to seventeen stole a rowboat and
  **rowed out to the watch house at Oyster Point**, where **J. B. Ludington** was
  employed as watchman, and stole **a double barrelled shotgun, a revolver and a
  jack-knife**. Ludington was away and returned just as they rowed off. Clipping
  pulled to `assets/images/sign-12/clipping-watch-house-1886.jpg` and now in
  sign 12's gallery.
- **23 May 1885.** "Watchman Bradley of the watch house on the east side of the
  harbor recently caught sixty-five pounds of eels in one day."
- **11 May 1881.** A want-ad: "Apply at the **WATCH HOUSE, Long Wharf**,
  immediately." They were fixed, known addresses.

**On the stilts question.** The open-water cabin on driven pilings, standing
miles offshore, is a **Chesapeake and Virginia Eastern Shore** type — roughly 150
of them once stood over the bars down there. Long Island Sound ice and wave
action would have sheared those off. New Haven's watch houses sat on wharf
heads, on low barrier spits such as Sandy Point, and on pilings close inshore.
Close enough that you had to row to them, which the 1886 robbery proves. Sign 12
now says exactly this, including the correction, because the wrong picture is
already in circulation.

Caution when searching: **"watch house" in 17th and 18th century New Haven
records means the town's civic and militia watch house on the Green**, built in
the 1640s. Different thing entirely, a century earlier.

### New leads worth an afternoon

- **"Plan of ye lotts in the oyster shell field so called," 1750.** Verified in
  the New Haven Museum's Whitney Library map guide — **Map G3784.N4P527 1750g**,
  from the Town of New Haven Proprietors records, v.2, 1749-1771. Colonial New
  Haven had a district officially called the **Oyster Shell Field**, on the
  ground between the nine squares and the Mill River, named for the sheer depth
  of shell in the soil — Indigenous middens and colonial dumping together. That
  is a Mill River story with a **surviving 1750 map to print**, and nothing in
  this project uses it yet. Best single new lead here.
- **Max Dellfant (1867-1943)**, German-born maritime painter, lived on
  Quinnipiac Avenue with a studio in the loft of the **Mansfield Oyster
  Company**. Painted the working waterfront — schooners, steam dredges,
  processing lofts and **watch houses**. The New Haven Museum holds **MSS #276,
  the Dellfant-Ross correspondence**. If a Dellfant watch house painting exists,
  it is sign 12's hero image.
- **Doris B. Townshend, *Fair Haven: A Journey Through Time* (1976)** — said to
  document the watch houses and reproduce 19th-century paintings of them.
- **Shell lime-kilns.** Oyster shell was burned on the shoreline at Dragon and
  Fair Haven to make lime for masonry mortar. New Haven's early buildings were
  literally held together with the river. Unverified, and a good sign paragraph
  if it holds.
- **The midnight oyster derby** — hundreds of skiffs lined up on the flats,
  racing out when the church bells struck twelve on opening night. **Unverified**
  and it has the shape of something embellished. `work/chrongrep.mjs` on the
  September issues would settle it either way.
- **Yale crews trained on the Mill River tidal reach and Lake Whitney** in the
  mid-1800s. Unverified here, but the Fair Haven news columns mention the Yale
  crew and its launch repeatedly in 1892, so the newspapers will confirm or kill
  it quickly.

### A caution about the report itself

Most of it held up, and the 1894 lead alone was worth the exercise. But it is an
AI research report, and it has the failure modes of one:

- **Its bibliography is not tied to its claims.** Forty-odd links at the bottom,
  none footnoted to a sentence. Everything load-bearing has to be re-verified,
  which is what happened above.
- **At least one citation is a name collision.** It cites Smithsonian Archives of
  American Art oral histories with "George McNeil" — that George McNeil is an
  **abstract expressionist painter**, not the City Point oysterman.
- **It repeats our own unsourced claims back to us.** It gives the tide gates as
  "around 1930," which is the number this project already could not source, so
  it is not independent confirmation of anything.

Treat it the way the newspaper clippings get treated: as a very good list of
places to look.


## Second research set, 26 August 2026 — industry, transit and the waterfront

A second Gemini report, on the leads this file listed as worth chasing: Talmadge
Bros, the Fair Haven steamboat, the trolley turntable, 370 James Street, the
linseed oil mill and the thirteen mills north. Verified below, with the same
caution as before — check before you print.

### 370 James Street is the best untold story on this river

**Verified against the New Haven Museum's own micro-history**, which is about as
local and as citable as it gets: <https://www.newhavenmuseum.org/museum-collections/online-exhibitions/micro-histories/370-james-st/>

One building on the Mill River, two world-beating industries.

**National Folding Box Company.** Formed in New York in the early 1890s from a
group of smaller carton makers; chose **New Haven as its production centre in
1905** and bought a whole block on the Mill River for the shipping and the rail
spurs. The four-storey plant went up in **1914**. By **1927 it was the largest
and most prestigious folding box company in the world**. It printed the cartons
for **Budweiser, Hershey's, General Electric** and the cigarette brands — and it
made the boxes for **Mounds and Almond Joy**, having **helped start Peter Paul
as an outside investment**. Southern paper mills undercut it; Federal Paper Board
bought it in **1953**; the plant closed in **1974**.

**Starter.** Founded **1971** by **David Beckerman**, a Hamden Hall coach — named
for being on the starting team rather than the bench. Moved into the vacated
plant in **1976** and took its **first Major League Baseball licence the same
year**, inventing the modern licensed sports apparel business. The satin jackets
and the **"S" logo became a defining status symbol of the late 1980s and early
1990s**. Public in **1993**. Then the **1994 MLB players' strike**, high costs,
and press coverage of people being robbed for the jackets. Bankrupt **1999**.

**Now:** offices for ACES, United Way of Greater New Haven and Workforce
Alliance. The *New Haven Independent* reported in **May 2026** that ACES bought
the building for **$14.6 million**.

**The images are already within reach.** The museum's four photographs on that
page are credited to **Jason Bischoff-Wurstle, Director of Photo-Archives** —
who is already acknowledged as a contributor to this project. That is one email.

### The Fair Haven steamboat was an oyster dredge

The question in the notes assumed a passenger paddlewheeler. There wasn't one at
Fair Haven. Two things were being conflated:

**1. The wrong Fair Haven.** The steamers photographed and postcarded at "Fair
Haven" — the **Albertina** (1882, Lawrence & Foulks) and the **Seabird** — ran the
**Navesink River in New Jersey**, on the New York run, 1850-1926. They are all
over the ephemera market catalogued next to New Haven items. **Do not put either
on a sign.**

**2. Fair Haven's own "steamboats" were the steam oyster dredges**, and one of
them is fully documented with a photograph in the public domain.

**The *F. Mansfield and Sons Co.*** — verified in detail:

- Built by **William G. Abbott Shipbuilding, Milford, Delaware**; launched
  **12 October 1912**; entered service at **Fair Haven, 21 January 1913**.
- **107 feet** overall, 29-foot beam, **214 gross tons**, single vertical
  compound steam engine of **250 ihp**, coal-fired, 9.5 knots.
- **Harvested 5,000 bushels of oysters in a single trip in 1913.**
- Taken by the **US Navy on 25 May 1917** as **SP-691** and used as a
  **minesweeper** through 1919.
- Transferred to the **US Lighthouse Service** on 28 October 1919, renamed
  **USLHT *Shrub***, and spent the rest of her life tending buoys out of Chelsea,
  Massachusetts.
- **Photograph: "USLHT *Shrub*, November 1929," National Archives RG 26** — US
  government work, public domain, and print resolution should be obtainable.

A Fair Haven oyster boat that went to war and then spent thirty years keeping the
New England coast lit is a sign in its own right, and it solves an image slot.

Also: **H. C. Rowe & Co.** pioneered large steam dredges from the 1880s;
*Charles Hoyt* (1880s), *Isaac E. Brown* (c. 1901) and *Amanda Lincroft* (1908)
are named as local steam workboats. Not independently checked, but the *Journal
and Courier* Fair Haven columns mention the *C. W. Hoyt* and B. N. Rowe
repeatedly, so `work/chrongrep.mjs` will confirm them quickly.

### Talmadge Bros — still not placed on the Mill River

The report puts Talmadge Bros in Norwalk and New Haven generally and does not
substantiate Steve Hamm's walk-note placing them **south of English Station on
the east bank**, with shell piles and equipment still visible. The New Haven
Museum's own River Street micro-history names **Bigelow Boilers (1869), National
Pipe Bending (1883), the Dutee Wilcox Flint Ford plant (1920), an A&P warehouse
(1925) and the Quinnipiac Brewery (1872-1920)** — and **no oyster firm by name**,
though it does say River Street was "built on the abandoned oyster fields of Fair
Haven's first industrial boom," which corroborates what this file already had for
Bigelow. **Talmadge on the Mill River remains unverified.** Ask Steve Hamm where
he got it.

### Trolleys: the buildings are real, the turntable is not yet

- **Fair Haven and Westville Railroad**, chartered 1860, horse cars on Grand
  Avenue from **July 1861**; electrified and consolidated in the 1890s; absorbed
  into **The Connecticut Company**, the NYNH&H's traction arm; streetcars
  retired **1948-50**.
- **James Street Car Barn**, State and James, built **c. 1920** — the Connecticut
  Company's largest in New Haven, reported as holding 138 cars on two levels.
  Confirmed independently via Walk New Haven.
- **Power Station A, 458 Grand Avenue** (c. 1901, engine room addition 1924) and
  a **Grand Avenue repair barn (1925)**. Walk New Haven confirms the trolley
  company's power plant and maintenance shops sat at the midpoint of Grand
  Avenue; the specific names and addresses come from youraudiotour.com and were
  **not independently verified**.
- **The turntable is still unverified.** The report only offers a generic account
  of small "Armstrong" turntables at stub-end terminals. Nothing New Haven
  specific. The lead in the notes — a turntable near the District — has not been
  confirmed and should not go on metal yet.

### The mills, and why they matter less to this trail

- **The 1642 town grist mill named the river.** New Haven Colony authorised a
  communal water-powered corn mill at the lower falls at the base of East Rock —
  the site that became the Whitney armory and is now the Eli Whitney Museum. In
  the town records it was simply "the Mill," and the water became "the Mill
  River." **This belongs on sign 4** and is a one-line addition.
- **The 1718 linseed oil mill.** The Connecticut General Assembly is said to have
  granted a twenty-year monopoly for a water-powered linseed oil mill in New
  Haven County, built at the middle falls in what is now Hamden, dormant by the
  time Whitney arrived in 1798. Plausible and checkable in the Assembly records
  and in *The History of Hamden, Connecticut, 1786-1959* (Internet Archive).
  **Not verified here.**
- **"Thirteen mills north"** resolves to the chain of mill seats up the river's
  17.4 miles through Hamden to Cheshire. Real, but **off this trail** — the
  named seats are Whitneyville, Hamden Middle Falls, Centerville/Augur, Mount
  Carmel Gorge and the Cheshire headwaters. Worth a sentence on sign 4, not a
  sign.

### Ball Island: the report agrees with sign 2

English Station built **1924-29** on the eight-acre Ball Island footprint for the
New Haven Electric Light Company, later United Illuminating; coal and oil; the
thermal and chemical discharge finished off the surrounding oyster grounds. Sign
2 already carries this. The oyster-to-power-station sequence is a good framing
and is worth strengthening there.

### Second report, same caution

Better sourced than the first, and the 370 James and Mansfield findings are
excellent. But the same pattern holds: the bibliography is a pile of links, not
footnotes; several load-bearing citations are to a single audio-tour website; and
the Talmadge claim dissolves on contact. The two things it got most valuably
right were both **negative** findings — there is no Fair Haven paddlewheeler, and
the Albertina is in New Jersey. Negative findings are worth as much as positive
ones here, because they stop us printing something wrong.


## What this all means for priorities

Two rounds of research have changed what the strongest signs are. This section is
the argument for reordering the work. It is a recommendation, not a decision.

### The bottleneck is images, not words

Every sign is written in both languages. **Twenty-six image slots are empty**,
and that is the only thing standing between this series and print. So the useful
question is not "what else should we write" but "what unlocks pictures."

### One appointment unlocks most of it

Nearly everything found in these two rounds points at the same building. **The
New Haven Museum's Whitney Library** holds, or is the obvious first stop for:

- The four **370 James Street** photographs, credited to **Jason
  Bischoff-Wurstle** — who is already acknowledged as a contributor to this
  project.
- **"Plan of ye lotts in the oyster shell field so called," 1750**, Map
  G3784.N4P527 1750g.
- **MSS #276, the Dellfant-Ross correspondence**, and any **Max Dellfant**
  painting of a waterfront watch house.
- The **Milton J. Stewart / East Rock summit boat** photograph, if one exists —
  the museum's photograph collection is the first place to ask.
- The **quarry, Rice Field and Soldiers and Sailors** views for sign 11.

**One scheduled session with a written shopping list is worth more than another
month of drafting.** That is the single highest-leverage action available.

### Free, immediate, no permission needed

- **USLHT *Shrub* / *F. Mansfield and Sons Co.*** — National Archives RG 26, US
  government work, public domain. Download it.
- **Oyster scow and fishery plates** — Goode 1887 and Ingersoll 1881, both public
  domain, both with New Haven chapters not yet searched.
- **A camera and one afternoon** — the tide gate at slack tide, and any site
  photographs the species panels need. Free, and better than licensing somebody
  else's picture.

### Cheapest content wins, in order

1. **Sign 5, the bath house.** Text only. Both clippings are already in the
   repository, and the council record now gives it ten contested ballots, an
   anonymous smear campaign, a $2.50-a-day job, a floating tank and a keeper who
   saved fifteen lives. **Biggest improvement per hour of work in the whole
   series.**
2. **Sign 4, Whitney.** Three one-line additions already established: the 1642
   town mill that gave the river its name, the Trinity Church stone, and the
   charcoal scows coming up the river.
3. **Sign 2, Ball Island.** Sharpen the oyster-grounds-to-power-station sequence.
4. **Sign 12** is now in good shape and has a verified clipping plus a free
   public-domain photograph available. It is the closest of the unfinished signs
   to proof.

### The case for a 370 James Street sign

There is no sign for it, and it may be the most publicly magnetic story on the
river. One building, on the Mill River, that was **the largest folding box plant
in the world in 1927** — printing Budweiser, Hershey's and the Almond Joy
wrapper — and then **the birthplace of the licensed sports apparel industry**,
where Starter jackets were designed and shipped.

It is the only story in the series that a fourteen-year-old will stop and read,
and the photographs are the easiest to obtain of anything outstanding. It sits
in the James/Humphrey/State stretch, which now also carries the tide gate and
possibly the bath house — a cluster worth planning as a group rather than
one at a time.

**If something has to give way**, signs **9 (A Century of Plans)** and **10 (The
Highway That Wasn't)** are the candidates to defer. They are the most abstract in
the series, they carry **five empty image slots between them**, and no leads have
surfaced for any of those five in two rounds of research. Deferring one of them
does not weaken the trail the way leaving 370 James out would.

### Where the trail's centre of gravity has moved

Reading the two rounds together, the material that came back strongest is not the
planning and infrastructure history. It is **people doing specific things on this
water**: a sailor building oyster boats on a clifftop and sledging them down over
snow; a city balloting ten times over who gets to mind the bathers; a watchman
robbed of his shotgun by three boys in a stolen rowboat; a dealer's fattening
floats parked below a sewer that changed public health worldwide; a coach in a
disused box factory inventing the replica jersey.

That is the register the strongest signs are already in — sign 1 is at proof
because the Fenian Ram is a story about people. Worth keeping in mind when
choosing what to chase next.


## Two signs written, 26 August 2026

**Sign 5 is now artwork-complete.** The council record replaced the review notes.
Its lede is no longer the national bath movement — it is that the keeper of a
bath house was **elected by ballot in the Court of Common Council**, and men
campaigned for the job. The panel section is the contest: $2.50 a day out of a
$500 appropriation, ten deadlocked ballots for the West bridge in May 1883,
anonymous letters "disgraceful in the extreme" in May 1887. The web page adds
the other half — the keepers were the lifeguards, and one of them was credited
with about fifteen lives saved.

The fourth image slot is filled by a new clipping, **`clipping-ballot-1882.jpg`**
— the actual tally from 2 May 1882, tellers and all: Crowley 18, Mitchell 2;
Lovejoy 12, McDermott 6, Oberkehr 2. **Sign 5 now has zero TODO images and is a
candidate to move to `proof`.**

Two corrections went in with it. The old text called the baths free; that is
softened, because in October 1892 the committee was still advertising a meeting
on "establishing **free** public bath houses." And the site question is settled
in passing — the sign's own 1888 map puts the Beach Street bath house at **Mill
River Street and Beach Street**, so Beach Street *is* the Mill River location and
the sign is in roughly the right place after all.

**Sign 15, `content/sign-15-james-street.yml`** — *The Box and the Jacket*, at
370 James Street in Barnesville, 41.3132619 / -72.9042581. The National Folding
Box Company and Starter, as set out above. Slugs `/james-street` and
`/calle-james`. Four image slots, all with briefs pointing at the New Haven
Museum.

**On not adding a sixteenth.** The *F. Mansfield and Sons Co.* is a wonderful
story with a free National Archives photograph, and it was tempting. But it is a
**Quinnipiac** firm and a Quinnipiac vessel, and sign 12 is already the trail's
one Fair Haven sign. Adding a sign adds four more empty slots to a series that
is already short twenty-six pictures. **The Mansfield belongs in sign 12 as a
paragraph and a photograph, not as sign 16.** That work is not done yet.


## "Clean rivers and dirty rivers" — true, and we have the paperwork

JR was told that regulators used to designate some rivers clean and some dirty,
and that dirty ones were allowed more pollution. **It is true**, and the Mill
River is a documented case. This is now on sign 5.

### How it worked

For most of the twentieth century American water law did not set one standard
for every river. It **classified** waters by the use they were meant to serve and
applied the criteria for that class. The numbers were literally different: the
dissolved-oxygen minimum, the coliform limit, the allowable temperature rise.
A river in a low class was not in violation for being dirty. It was dirty as
designated.

### The Mill River was Class SC

From the transcript of the federal **Conference in the Matter of Pollution of the
Interstate Waters of Long Island Sound and its Tributaries**, held in **New
Haven, 13-14 April 1971** — a primary source, 419 pages, free from EPA's NEPIS:
<https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=94004HGY.txt>

Connecticut's coastal classes as printed in that transcript:

| Class | Suitable for |
|---|---|
| **SA** | all sea water uses including shellfish for direct human consumption, bathing, water contact sports |
| **SB** | bathing, recreation, industrial cooling, shellfish after depuration; excellent fish and wildlife habitat |
| **SC** | fish, shellfish and wildlife habitat; recreational boating and industrial cooling; good aesthetic value |

And the classification table in the same document:

> New Haven Harbor **SC, SB** — **Mill River SC** — Quinnipiac River **SC**

**Class SC does not include bathing.** The river on which the city ran a bath
house had been formally designated for boating and industrial cooling.

The freshwater notes add the bottom rung: *"Class D waters will be assigned only
where a higher water use Class cannot be attained after all appropriate waste
treatment methods are utilized."* A class for water that had been given up on.

### The rule that proves the practice

The clinching evidence is a sentence in the current federal regulations,
40 CFR 131.10(a):

> **"In no case shall a State adopt waste transport or waste assimilation as a
> designated use for any waters of the United States."**

Nobody writes that unless it was being done. Verified at
<https://www.law.cornell.edu/cfr/text/40/131.10>

### The quote of the project

Also from the 1971 New Haven transcript, testimony about this river:

> "The New Haven Harbor is the terminal for three rivers: the West River, the
> Mill River and the Quinnipiac River. All of these streams are polluted in
> varying degrees and **the Mill River is the classic example of our stream
> pollution problem. Its putrid grey green waters can only be appreciated by
> sight and smell.** Pulp plants are the major contributors to this pollution and
> action by many local groups to correct the flagrant violation of pollution
> laws and common sense is defeated by political expediency and a negative
> attitude on the part of enforcement officials. **The law is being compromised
> for jobs and our public waters have become their private sewer.**"

Sign 5 now carries this, and the classification, at the foot of the web page —
which is the right home, because the sign is about a city that once invited
people to swim here.

### Two more things in the same document, for other signs

- **Table B-3, industrial waste sources.** One entry is *"New Haven Board &
  Carton, New Haven, 500 employees, Folding Boxboard, receiving waters: **Mill
  River**"*, on a federally approved abatement schedule running 7/68 to 3/70.
  A folding boxboard plant discharging into this river. **Sign 15 is about the
  folding box industry on this river and does not mention this.** Note the care
  needed: New Haven Board & Carton is a different company from National Folding
  Box, and the sign must not merge them. But the industry that gave sign 15 its
  first half was also on the 1971 federal list of polluters, and an honest sign
  should probably say so.
- **Table A-1, steam electric plants on Long Island Sound**, lists *"United
  Illuminating Company, **English, Mill River**, New Haven."* English Station,
  named in a federal inventory of thermal dischargers. **Sign 2** could use that.

### This document deserves a proper read

419 pages of sworn testimony, tables of every industrial discharger on the Sound
with employee counts and abatement deadlines, and the state's own water quality
criteria reprinted in full. It was found by accident while checking something
else. **Somebody should read all of it.** Vol. 1 is the link above; there is at
least one more volume.


## The tide gate report — one real answer, one number that did not hold

JR ran the tide-gate prompt. The report came back in the shape the preamble
asked for — graded findings, negative findings, disambiguation, and archival
access protocols — which is a marked improvement on the first two rounds. Its
headline claim is that the permanent structure was built in **1935** by WPA and
CAES crews for mosquito control, graded VERIFIED.

**I could not verify 1935, and the citation offered for it does not hold up.**
But two other things in the report are excellent, and one of them is now the
hardest fact on sign 6.

### VERIFIED — the gates are where the sea legally ends

**Conn. Agencies Regs. § 26-108-1**, "Inland waters and marine district
defined." Checked directly:

> **Mill River, New Haven** — marine district: *up to and including below tide
> gates at State Street Bridge*. Inland district: *all waters above.*

Connecticut divides its waters stream by stream into a marine district and an
inland district, and on this river **the line is drawn at these gates**. Which
fish you may take, in what season, under what licence, changes at this
structure. An engineering decision made for mosquitoes became a boundary in
state law.

Compare the neighbouring entry, which is also the trap this project already fell
into once: **West River, West Haven** — marine district *below the tide gates at
Orange Avenue Bridge (sometimes called Congress Avenue Bridge)*. Different river,
different gates, different bridge.

This also **settles the location**. Sign 6 said "upstream of Humphrey Street";
it now says "at the State Street bridge," which is what the regulation names and
what Save the Sound and Wikipedia both independently describe.

### VERIFIED — the era and the reason

Through the 1930s, federal work-relief crews ditched and diked salt marshes the
length of the Connecticut shore; by the 1940s nearly every marsh in the state
had been cut about, and tidal flow at many sites was restricted with tide gates,
causeways and dikes for flood protection and mosquito control. That is
independently attested in the tidal-wetlands restoration literature. The
mechanism, the motive and the decade are solid.

### NOT VERIFIED — the year 1935

The report grades 1935 as VERIFIED and cites "CIRCA / UConn Infrastructure
Inventory (Appendix D)." I could not locate any such inventory. Worse, the
regional literature says the opposite of what that citation implies: **"a
comprehensive, regional inventory and assessment of tide gates has not been
conducted"** in New England. A document that does not appear to exist cannot
carry a VERIFIED grade.

**1935 is not going on the sign.** Sign 6 now states the decade, the relief-work
context and the mosquito motive as established, names 1935 as a reported figure,
and says plainly that we could not confirm it.

### Also unverified, and worth knowing before anyone repeats them

- **Olmsted Brothers Job #05313**, a plan titled *"East Rock Pk. / Mill River Dam
  / With Tide Gate, Sluices and High Level Spillway."* If this exists it is a
  **public-domain drawing of a tide gate designed for our river**, and it would
  be a superb image for sign 6. I could not find it, and the report's own table
  is internally inconsistent about the number — one row gives Job #05313, the
  next gives "Job #03352 / Plan #05313." **Olmsted Online is a real, searchable
  archive and somebody should search it properly.** This is the highest-value
  unchecked lead in the report.
- **"Fourteen individual timber and metal flap gates."** Very specific,
  unsourced, and checkable by walking down there with a camera.
- **A "State Board of Mosquito Control."** Named as an authorising body. Not
  confirmed to have existed under that name.
- The **1970-75 flap gate modernisation** is graded REPORTED in the report
  itself, sourced to a consultant's historical survey. Treat accordingly.

### The genuinely useful part: where to go in person

The report's access protocols are the best thing in it after the regulation, and
they are worth keeping whether or not 1935 survives:

**Whitney Library, New Haven Museum**, 114 Whitney Avenue — ask the reading room
desk for the **City Year Book for the City of New Haven, fiscal years 1933-1938**
(these carry the annual reports of the City Engineer and the Department of Public
Works), the **New Haven Board of Health annual reports 1912-1936**, and the Dana
Collection volumes filed under *Rivers, Waterways and Bridges — Mill River*.

**Manuscripts and Archives, Sterling Memorial Library, Yale** — **MS 1373**, New
Haven Civic Improvement Commission Records, for the Gilbert/Olmsted
correspondence about estuarine tide gates; **MS 604**, New Haven Park Commission
Records, for the lower East Rock Park boundary.

**Connecticut State Library and State Archives**, Hartford — **RG 099**,
Connecticut Agricultural Experiment Station Records, **Series 3: Mosquito Control
and Marsh Reclamation Files, 1915-1945**, and specifically the New Haven and
Hamden town inspection folders and ditching ledger maps. **RG 089**, Highway
Department layout records, for the I-91 channel relocation plans, 1958-1968.

If 1935 is right, RG 099 Series 3 is where it will be written down. That is one
day in Hartford.

### The preamble worked

Worth recording, because it changes how to use these tools: the third report
graded its own findings, stated negative findings, disambiguated the rivers we
keep confusing, and told us which desk to stand at. It still overclaimed on its
single most important number. **The grades are a claim, not a guarantee** — but
having them made the overclaim findable in twenty minutes instead of being
buried in confident prose.


## The Olmsted file — the tide gate question is half solved, from primary sources

The follow-up report was mostly a search plan rather than findings, and it
**re-graded 1935 as VERIFIED on the same unlocatable citation** ("state
infrastructure inventories and CIRCA engineering audits"). That is circular and
should not be treated as confirmation.

But it gave one checkable identifier, and that identifier was right, and chasing
it produced the best primary evidence this project has found on the gates.

### Job 5313 is real, and it is digitised

**Olmsted Associates Records, Job Files, 1863-1971; File 5313; East Rock Park;
New Haven, Conn.** — Library of Congress, Manuscript Division. Three units, all
scanned at high resolution, free, no login:

| Unit | Dates | Pages | Item |
|---|---|---|---|
| 1 | 1914 Jan - 1916 Feb | 109 | <https://www.loc.gov/item/mss5257103166/> |
| 2 | 1916 Mar - Dec | 126 | <https://www.loc.gov/item/mss5257103167/> |
| 3 | 1917 - 1931 | 116 | <https://www.loc.gov/item/mss5257103168/> |

**351 pages of correspondence about East Rock Park and the Mill River, and
nobody on this project had looked at it.** There is no OCR — it has to be read
page by page — but the scans are clean and mostly typescript.

### What two pages already proved

Sampling the third unit, essentially at random:

**3 January 1917.** Olmsted Brothers to **Mr. F. L. Ford, City Hall, New Haven**:

> "We acknowledge the receipt of your plans for the **proposed Mill River Dam**,
> and they seem to us to be satisfactory. We have the following suggestions for
> minor changes.
> 1. **The platform leading over the gates**, from one side of the river to the
> other, we would suggest should be kept closed to the public by means of gates
> at either end… a lighter protecting railing on either side would be quite
> sufficient… This will make the railing much lighter and less obtrusive in the
> landscape.
> 2. The fence on **the spillway** we believe would be adequate if made three
> feet instead of six feet high. A similar fence… should also be built on top of
> **the river walls**."

**13 March 1917.** Olmsted Brothers to **Mr. Frederick L. Ford, Room 18, City
Hall**, asking for the original drawing of the Mill River section of East Rock
Park, and noting they had received a blueprint of it on **2 November 1915**.

### What that establishes

- **The designer was the City of New Haven**, in the person of city engineer
  **Frederick L. Ford** — not the Olmsted firm, who were reviewing, and not a
  state agency.
- **A dam with gates, a spillway and river walls was fully designed by January
  1917**, to the level of railing materials and fence heights, with a blueprint
  in circulation since November 1915.
- The report's plan title — *"East Rock Pk. / Mill River Dam / With Tide Gate,
  Sluices and High Level Spillway"* — is **consistent with this correspondence**
  and is now credible, though the drawing itself is at Fairsted (NPS) and still
  unseen. Note the report gave two conflicting job numbers for it; **5313 is the
  correct one**, confirmed against the LoC catalogue.

### What it does not establish

**When the concrete was poured.** The design finished in 1917; the city put
gates across the West River in 1919; the report says the Mill River structure is
1935. Those can all be true — designed 1917, built later, or built twice — but
somebody has to find the contract. Sign 6 now lays the question out in exactly
those terms rather than picking a year.

### The letter is now on the sign

`assets/images/sign-06/clipping-olmsted-1917.jpg` — the 3 January 1917 letter,
cropped from the LoC scan, public domain. It replaces the TODO placeholder that
was going to be the 1910 Gilbert-Olmsted plan. **Sign 6 is down to three empty
image slots**, and the one it filled is far better than what was planned: not a
generic city plan, but the actual page on which somebody agreed to build this
thing and asked for a lighter railing.

Sign 6's web page now carries the quotation, names Ford, and states plainly what
is still unknown.

### The lesson, again

The report's VERIFIED grade on 1935 was wrong twice in a row. Its **identifiers**
were right. That is the useful pattern: treat these reports as a supply of
catalogue numbers and finding aids, chase them yourself, and never take the
grade. One job number was worth 351 pages of primary source.

### Next, and it is a big one

**Somebody should read job file 5313 end to end** — 351 pages, free, from a
laptop. It will contain the correspondence around the design of the dam, the
Mill River section of the park, and very possibly the construction. It may also
answer the Rice Field question for sign 11 and the Olmsted riverside plan for
sign 10. This is the single richest unread source the project has.


## The Whitney dam and the mills — one great verification, one plausible fix

Third report run against prompt 2. Two of its claims were checked directly and
one of those is a gift.

### VERIFIED, verbatim — the 1642 mill case

The report quoted a 1642 New Haven General Court entry about shoddy work at the
town mill. **I downloaded Hoadly's *Records of the Colony and Plantation of New
Haven, from 1638 to 1649* from the Internet Archive and found it.** The
transcription is accurate:

> "Richard Beach for nott perfor[m]ing covenant in the worke w[hi]ch he
> undertooke to doe att the mill, w[hi]ch he was to doe strongly and
> substantially, butt did itt **weakely and sleightly** as was proved by the
> testimony of **John Wakefield the miller**, himselfe allso nott denying itt;
> Itt was ordered that he should make good the damage, butt because the damage
> is not justly known what itt is, **Mr. Goodyeare and Mr. Gregson** are to
> [v]eiw the worke, and consider off and sett downe the damage by his [defec]tive
> workmanship."

Full text: <https://archive.org/details/recordsofcolonyp00newh>

A contractor who cut corners, the miller who testified against him, a contractor
who did not deny it, and two men sent out to price the damage. **It is the
earliest human voice we have from this spot, and it is a building dispute.**
It is now on sign 4, in both languages, alongside the point that the colony
records call the place simply "the mill," which is where the river's name comes
from.

### VERIFIED — HAER CT-186-C exists, with the exact call number given

**Lake Whitney Water Filtration Plant, Lake Whitney Dam**, Historic American
Engineering Record, Library of Congress Prints and Photographs Division.
<https://www.loc.gov/pictures/item/ct0684/>

Eight large-format photographs, **public domain** as US government work:

| Call number | Subject |
|---|---|
| CT-186-C-1 | View west from East Rock of the dam; spillway at right, abutment centre |
| CT-186-C-2, -3 | Spillway and abutment |
| CT-186-C-4 | The dam, with the shed housing the 1932 turbine |
| CT-186-C-5 | The 1932 turbine shed and power transmission shafting |
| CT-186-C-6, -7, -8 | The treatment house / Whitney Water Center |

And from the adjacent Eli Whitney Armory survey, **HAER CONN,5-HAM,3--22:
"Lake Whitney Dam, 1895,"** photocopied from an original photograph at the New
Haven Colony Historical Society — a **historic view**, not a modern one.

Sign 4's artwork is already complete, so these are not needed to unblock it. But
they are free, print-resolution and public domain, and the 1895 view is a
candidate for the sign's gallery. Correction to the report: the survey is dated
**1998**, not 1985-87.

### REPORTED, and probably right — the dam figures reconcile

The report's explanation for the museum-versus-trail contradiction is that the
two sets of numbers measure **different things**:

- **38 feet tall by 500 feet long** = the masonry structure, foundation bedrock
  to the top of the non-overflow crest, across the full span including abutments
  and gatehouse. That is the museum's figure.
- **27 ft (1860) → 31.4 ft (1866) → +19 inches to 33 ft (1916-17)** = the
  elevation of the **overflow spillway weir crest**, which was raised repeatedly
  as the city's water demand grew. That is millrivertrail.com's sequence.

Both can be true of the same dam. **This is the right shape of explanation and I
believe it, but it is not proven** — the report grades two of the three spillway
elevations REPORTED itself, and I have not seen a document stating that 38 ft is
foundation-to-crest. **HAER CT-186-C includes a written historical narrative and
measured drawings. That is what will settle it, and it is free.**

Sign 4 now keeps the museum's structural figures, adds that the spillway was
raised more than once and last in 1916, and no longer attaches contested numbers
to the raisings. The REVIEW comment in the file has been rewritten accordingly.

Also named and worth chasing: **Orson H. Marchant**, "Raising and Lengthening of
the Spillway of Lake Whitney Dam and the Drainage of Pine Swamp," *Papers and
Transactions of the Connecticut Society of Civil Engineers*, 1916. Unchecked.
And **New Haven Water Company Records, MS 585**, Manuscripts and Archives, Yale.

### UNVERIFIED — the thirteen mills, and a good warning

The report's most interesting negative finding: **"thirteen mills north" may not
be about our river at all.** It says colonial deeds record exactly thirteen mills
built between 1676 and 1740 on the **Far Mill River**, which runs between Shelton
and Stratford into the Housatonic — and that the Konkapot/Mill River in Berkshire
County, Massachusetts, also had thirteen mill privileges. On our Mill River it
says the number is a retrospective tally by later local historians (Blake 1888,
Hartley 1943/1959).

**Unchecked, but it is exactly the kind of collision that has already caught this
project twice.** Its thirteen-seat table for Hamden and Cheshire grades six of
thirteen entries REPORTED, and all of it is upstream and off this trail. Sign 4
now says the spillway was raised more than once and leaves the mill chain alone.

### Pattern, third time

Same as before: **the identifiers are good, the grades are not.** HAER CT-186-C
was exactly right. The Hoadly citation was exactly right and the transcription
was faithful. The reconciliation graded VERIFIED is the part still resting on
nothing I can see. Chase the numbers; ignore the confidence.


## Signs 9 and 10 are no longer the weakest signs

Fourth report, run against prompt 3. This one earned its keep: it produced a
**hard legal fact that I verified in the statute book**, and an honest negative
finding that corrects something this project has been printing.

### VERIFIED in the statute book — the law the fight produced

Sign 10 used to end on a sentiment: people organised, they won, I-91 took ten
acres anyway. It now ends on a law.

**Conn. Gen. Stat. § 7-131j, "Taking of land by state or public service
company."** Fetched and read directly from the General Assembly's own site. Where
the state wants municipal land held for conservation or recreation and means to
put a highway on it, the statute requires comparable replacement land or payment,
an **extra public hearing beyond the one already required**, at which the state
must state its *"reasons for the proposed taking of the open space land rather
than other land"* — and then this:

> "the state shall not take, for highway or other purposes, any such land unless
> the governing body of the municipality in which the land is located has, **by
> majority vote of all its members, approved the proposed taking**."

A town could say no. New Haven's Board of Aldermen did.

Two independent sources — the report, and kurumi.com, which this project already
cited — agree it was passed by the **1965** General Assembly in response to the
East Rock fight. I read the operative text; I have not seen the enactment
parenthetical, so **1965 rests on those two sources rather than on the statute
book**. The substance is beyond doubt.

**The federal Section 4(f) parkland protections came in 1966.** Connecticut got
there a year earlier, and a neighbourhood argument about this river bank is why.
That is now the spine of sign 10 in both languages.

*Note on an early false lead:* a search summary reported § 7-131j as being about
public art in municipal buildings. It is not — that is a different section.
Always read the statute, not the summary of it.

### VERIFIED — what the road would actually have done to the river

The detail that makes the sign land, and it was in the report:

Four lanes, a little over a mile, from **I-91 Exit 6 (Willow Street / Blatchley
Avenue)** north to **Whitney Avenue at Armory Street** in Hamden. Connecticut
Highway Department sponsor, federal Bureau of Public Roads paying half. **$5
million in 1964, about $10 million by 1968.**

And the design: to save right-of-way, the two carriageways were to run on
**opposite banks of the Mill River**, with the river between them **straightened,
narrowed and encased in a concrete channel to serve as the highway's median.**

The river was not an obstacle to be bridged. It was to be the gap between the
lanes. Corroborated by kurumi.com.

Also now on the sign: **State Representative Lawrence O'Brien** leading the
legislative opposition in 1964; the *New Haven Register* opposing this road while
supporting highways generally; and the **ramp stubs still standing at Exit 6** —
oversized structures and viaducts built to feed a road that was never built, the
clearest physical evidence on the trail of something that did not happen.

### NEGATIVE FINDING — and we were printing it wrong

The report searched Yale Manuscripts and Archives, the Whitney Library and the
Connecticut State Archives and found **no archival collection for a "Save Our
Park Committee."** It concludes the name is a moniker later applied to the
loose citizen coalitions, ward leaders and conservation groups active 1961-65,
and that the actual documentation sits in:

- the **Richard C. Lee Papers, Yale MS 318**
- the **New Haven Board of Aldermen records**, New Haven City Archives
- the microfilmed **New Haven Register**

**Signs 10 and 11 both asserted that residents "formed a Save Our Park
Committee."** Both have been corrected to say residents organised, and to name
the mechanism that actually stopped it. If the committee turns out to be a real
named body, it can go back in — but not on the strength of a moniker.

### Sign 9 — material gathered, not yet written

The planning sequence is now clear enough to rewrite sign 9 around, though I have
not done it:

- **1910, Gilbert and Olmsted** — reclaim the Mill River banks, dredge, and run
  continuous public open space from East Rock to the harbour. Shelved by **Mayor
  Frank J. Rice**, who preferred paving and sewers. *(The report says Rice Field
  is named after that same mayor. Unverified, and a very tidy irony if true.)*
- **1941-42 and 1951-55, Maurice Rotival** — Yale architecture professor,
  "organic planning." Reclassified the Mill River lowlands from parkway buffer to
  **industry, freight rail and limited-access highway**, and was first to propose
  a high-speed arterial down the valley at the foot of East Rock. His papers are
  **Yale MS 898** — but note, in copyright, permission needed.
- **1954-69, Richard C. Lee and Edward Logue** — built Rotival's theory. The Mill
  River Redevelopment Area cleared 19th-century blocks in the Wooster Square and
  Fair Haven borderlands for single-storey plants and truck distribution.

The through-line for sign 9 is a good one: **the same river valley read three
ways in fifty years** — as a park buffer, as a freight corridor, and as
clearance. Sign 10 is what happened when the third reading met the people who
lived there.

### Image leads for both signs, with rights

- **1910 Civic Improvement report** — public domain, and already digitised on
  **HathiTrust**. Its general plan drawing is the obvious sign 9 image and costs
  nothing.
- **Olmsted job 5313** at the Library of Congress — already in hand, see above.
- **I-91 construction photographs**, Connecticut State Library **RG 089**,
  photographic files of highway construction, box: Interstate 91 New Haven,
  c. 1963-65 — **state government work, public domain**, some via the Connecticut
  Digital Archive.
- **East Rock Connector alignment maps**, RG 089, and ConnDOT's own engineering
  records at Newington via a public records request.
- **Rotival drawings**, Yale MS 898 — **in copyright**, permission required.
- **New Haven Register protest photographs** — **in copyright, Hearst**. Licensing
  required. Do not assume.

The two free, public-domain sources — HathiTrust for 1910 and RG 089 for the
I-91 construction photographs — could between them fill most of the five empty
slots that made these the candidates for deferral.

### Fourth round, same verdict

Identifiers good, grades unreliable, negative findings genuinely useful. This one
was the strongest of the four, and the reason is that the prompt asked for
specific things — a route, a sponsoring agency, who the opponents were — instead
of asking for a story.


## Regenerating the newspaper and archive clippings

The clippings added in August 2026 are **not in the repository**. Like the museum
scans, `assets/images/sign-*/*.jpg` is gitignored, so the print-resolution files
live only on whoever's laptop made them. Unlike the museum scans, **these are
public domain and fully reproducible from the internet in about a minute**, so
nothing is lost. The commands are:

```bash
# Sign 5 — the Court of Common Council elects bath house keepers, 2 May 1882
node build/get-clipping.mjs sn82015483 1882-05-02 3 "bath house keeper" sign-05 ballot-1882

# Sign 11 — "An Oyster Craft," Stewart's boats on East Rock, 22 February 1887
#   (the same article already lives on sign 1 as clipping-1887.jpg;
#    sign 11's copy was made by copying that file across)
node build/get-clipping.mjs sn82015483 1887-02-22 4 "OYSTER CRAET" sign-11 1887

# Sign 12 — the Oyster Point watch house robbery, 9 September 1886
node build/get-clipping.mjs sn82015483 1886-09-09 4 "the watch house at Oyster Point" sign-12 watch-house-1886
```

Note the OCR spellings in the search phrases — "OYSTER CRAET" is what the
scanner made of "OYSTER CRAFT," and the tool matches the OCR, not the ink.

**Sign 6's Olmsted letter** is not from Chronicling America and needs a different
route. It is page 0243 of Library of Congress item `mss5257103168`:

```bash
curl "https://tile.loc.gov/image-services/iiif/service:mss:mss52571:mss52571-02-250:0243/full/pct:100/0/default.jpg" \
  -o /tmp/olm.jpg
# then crop the left leaf (the 3 January 1917 letter) and convert to greyscale:
#   left 2%, top 2%, right 50%, bottom 99% of the full 5037 x 3295 scan
#   → assets/images/sign-06/clipping-olmsted-1917.jpg
```

Two helper scripts used to find these live in `work/`, which is also gitignored,
so they are reproduced here in case they are wanted again:

- `work/chrongrep.mjs` — searches Chronicling America and prints the matched
  snippet from LoC's word-coordinates service. Much cheaper than downloading
  page OCR. Usage: `node work/chrongrep.mjs '<query>' <lccn|-> <y1> <y2> <rows>`.
- `work/findpage.mjs` / `work/dumplines.mjs` — find which page of an issue holds
  a phrase, and dump ALTO line coordinates so a crop can be aimed by hand.

**If somebody decides these should be committed after all**, they are small — the
four together are under 1.2 MB — and unlike the museum masters there is no
licensing reason to keep them out. That is a judgement call for whoever owns the
repository, not something to change quietly.


## Lanson did not quarry at East Rock, and sign 13 was wrong

The fifth report claimed sign 13's central image — Lanson quarrying at East Rock
and floating stone down the Mill River — is a modern conflation of two separate
operations. **I checked, and it is right.** Sign 13 has been corrected.

### The authority

**Long Wharf Pier, National Register of Historic Places nomination, 2024**,
prepared for the Connecticut SHPO and citing Harris and Hinks. 44 pages, free:
<https://portal.ct.gov/-/media/decd/historic-preservation/06_about_shpo/state-review-board/2024-meetings/june-14/long-wharf-pier-nr.pdf>

> "In 1810, William Lanson began the expansion of Long Wharf at the behest of the
> Contractors. **Lanson owned a rock quarry in East Haven** where he and his crew
> quarried the stone, consisting predominantly of reddish basalt from Blue
> Mountain… The stones were loaded onto **specially-built scows — flat-bottomed
> boats — that were capable of hauling 25-ton stones**, from a wharf designed by
> Lanson to accommodate the load of the stones. **From East Haven, the stones for
> the Long Wharf extension were carried by scow and unloaded in New Haven** where
> they were set in place and backed by fill."

East Haven. Across the harbour. Not down this river.

*(One wrinkle: the nomination glosses Blue Mountain as "also called East Rock,"
which is where the confusion probably starts. The operative facts — quarry in
East Haven, stone carried by scow from East Haven to New Haven — are unambiguous
either way.)*

### What this does to Lanson's own quotation

Sign 13 quotes Lanson on scow work: *"The tide in this river rises about six
feet, and it is considered very dangerous going under the bridge. A scow must go
up on the flood tide and come down on the ebb tide…"* It is a wonderful passage
and there is no reason to doubt it.

**But he says "this river" and does not name it, and we assumed he meant the
Mill.** With the quarry in East Haven, the dangerous bridge is far more likely on
the Quinnipiac side. The quotation stays on the sign, with a paragraph saying
plainly that we got the river wrong and why.

### The real Mill River story is better

The nomination hands us a genuine and much stronger connection to this water:

- **2 March 1807** — Lanson bought land on the **west bank of the Mill River**, on
  the far edge of the New Township, now Wooster Square. It had belonged to **Mary
  Wooster** and had been used for **ploughing contests**.
- That ground became **New Guinea** and then **New Liberia** — the neighbourhood
  across the water from the sign, with his boarding house in it, sheltering Black
  workers and people moving north out of slavery.
- Owning land **made him a voter**. Then in **1814 Connecticut disenfranchised
  Black voters**, and Lanson petitioned the General Assembly with another Black
  landowner, **Bias Stanley**: restore our vote, or stop taxing us. **The Assembly
  granted neither.**

He built the longest wharf in the United States and could not vote in the town it
served. That is now the middle of sign 13.

Also added from the nomination: **two contractors had already failed** at the
Long Wharf job before him; he took it on, in his own words, to *"show what a
black man was capable of doing"*; his son Isaiah credited him with the **East
Haven bridge**; and the **1827 Farmington Canal basin** used the same Blue
Mountain stone and the same methods.

### Negative findings worth having

- **No portrait, daguerreotype or silhouette of Lanson is known to exist.** Dana
  King's 2020 bronze on the Farmington Canal Trail used West African models as
  conjecture. If we ever photograph the statue for a sign it must be labelled as
  a 21st-century commemoration, not a likeness — **and it is in copyright**,
  permission required from the artist and the city.
- **The stone scow image does not exist.** The report searched Ingersoll's *Oyster
  Industry* (1881) plates and the New Haven chapter, and Goode's *Fisheries*
  (1887) — the two sources this file told it to search — and reports both
  entirely negative for stone scows or quarry lighters, as are Mystic Seaport,
  the Whitney Library and the Library of Congress. **That closes a lead this
  project has chased three times.** Any illustration will have to be a generic
  period gundalow or a technical line drawing, honestly captioned.

### Image leads that are real and free

- **Amos Doolittle's 1824 plan of New Haven** — reproduced as Figure 4 in the
  nomination itself, showing Long Wharf and the east side development. Public
  domain, and the nomination's own scan is downloadable.
- **The 1815 General Assembly petition** of Bias Stanley and William Lanson,
  Connecticut State Library, RG 001 Early General Assembly Papers — **bearing
  Lanson's signature**. Public domain state record. A man's own hand on the
  document asking for his vote back would be the strongest image on this sign.
  *(The report gives the citation as 2nd Ser., Vol. 17, pp. 544-546. Unverified.)*
- **Book of Satisfaction Addressed to the Public** (1848), Lanson's own pamphlet,
  Yale Law School's Lillian Goldman Law Library. Unverified, and worth a look —
  it is his voice.

### Fifth round

The pattern held one more time, and this was the most valuable instance of it:
the report's *conclusion* was correct and its grade was over-confident in the
details (it attributed the East Haven quarry to Long Wharf as VERIFIED when
Wikipedia attributes it to the canal, and only the National Register nomination
actually ties it to Long Wharf). Chasing its citation found the document that
settles it — and corrected a claim this project had been making on a sign about
the most consequential person on the trail.


### Postscript: the two rivers do meet, and it still is not enough

JR pointed out that the Mill and the Quinnipiac join before the harbour, so
Lanson's stone boats probably touched the mouth of the Mill — "but that is not
as strong a story as going down it."

Both halves of that are right, and the second half is the important one.

The confluence is confirmed twice over: Wikipedia has the Mill River joining "the
Quinnipiac River at the mouth of New Haven Harbor," and **this project's own sign
8 already says it** — its location line reads "Criscuolo Park, where the Mill
River meets the Quinnipiac," and its panel caption reads "Grapevine Point, where
the two rivers meet."

**One geographic caution before anyone leans on this.** A crossing from a loading
wharf on the East Haven shore to the head of Long Wharf runs across the *lower*
harbour. The Mill/Quinnipiac confluence is at the harbour's northern head, above
that line. Whether a given scow passed the Mill's mouth depends on where in East
Haven the quarry wharf stood, which the nomination does not say. So even
"probably touched the mouth" is a little generous.

Sign 13 now states it at exactly the strength the evidence supports: the scows
and this river shared a harbour, the two rivers meet a mile downstream — **"but a
boat that passes the mouth of a river has not worked its way up one, and we would
rather say so than stretch a connection."**

That sentence is the standard this project should hold to generally. The
temptation on an interpretive sign is always to pull a good story onto your own
patch of ground. The reason sign 13 is still worth its place on the Mill River
Trail is the 1807 land purchase and New Liberia, which happened here — not the
stone, which did not.


## The last research round: one gem, two corrections, one disappointment

### VERIFIED, verbatim, and now on sign 12 — the midnight race

The "midnight oyster derby" is real, and I read it in the primary source.
**Ernest Ingersoll, *The Oyster-Industry*, Tenth Census of the United States
(1881)**, full text free at <https://archive.org/details/oysterindustry00inge>.

The law came "off" on **1 November**. Ingersoll:

> "On the day preceding, farmers flocked into Fair Haven from all the surrounding
> country, and brought with them boats and canoes of antique pattern and ruinous
> aspect. These rustics always met with a riotous welcome from the town-boys, who
> hated rural competition. They were very likely to find their boats, if not
> carefully watched, stolen and hidden before they had a chance to launch them,
> or even temporarily disabled…
>
> As midnight approached, men dressed in oilskin, and carrying oars, paddles,
> rakes, and tongs, collected all along the shore, where a crowd of women and
> children assembled to see the fun… There were sharpies, square-enders, skiffs,
> and canoes, and they lined the whole margin of the river and harbor on each
> side in thick array…
>
> No eye could see the great face of the church-clock on the hill, but lanterns
> glimmered upon a hundred watch-dials… There was a hush in the merriment along
> the shore, an instant's calm, and then the great bell struck a deep-toned peal.
> **It was like an electric shock.** Backs bent to oars, and paddles churned the
> water. From opposite banks navies of boats leaped out and advanced toward one
> another through the darkness, as though bent upon mutual annihilation."

**Three corrections to the report, from the text itself:**
- The passage is at **pp. 63-64**, not pp. 31-45.
- The signal was **one bell** — the church clock on the hill — not "church bells,
  town tower bells, or signal guns."
- **Ingersoll places this on the Quinnipiac at Fair Haven and never mentions the
  Mill River.** The report's finding table claims "Quinnipiac River estuary, Fair
  Haven flats, **and lower Mill River tidal reach**" as VERIFIED. That last part
  is not in the source. This is the same over-reach as the Lanson stone: pulling
  a good story onto our own patch of ground.

Sign 12 now carries the quotation at length and says explicitly that Ingersoll
places it on the Quinnipiac and does not mention the Mill.

### REFUTED, and it closes a lead we have carried since the start

**Talmadge (properly Tallmadge) Brothers had no Mill River shore plant.** Founded
Norwalk 1875; processing houses, boatyards and offices at **132 Water Street,
East Norwalk**; secondary points at Port Norris NJ and Bridgeport. They did hold
franchised beds in outer New Haven Harbor — that part stands — but the shucking
and the wharves were in Norwalk. Sanborn sheets for River Street and the Mill
River waterfront (1886, 1901, 1923, 1950) show heavy industry and no shellfish
plant.

Steve Hamm's walk note placing them south of English Station is a misattribution,
almost certainly from the harbour leases. **Do not put a Talmadge plant on a
sign.**

### CORRECTED — it was a transfer table, not a turntable

The trolley turntable this project has been chasing was a **transfer table** — a
lateral traverse table in a transverse pit inside the **James Street car barn**,
shifting cars sideways between parallel maintenance bays. Sanborn sheets show no
circular streetcar turntable anywhere in the district.

The real turntables were **steam locomotive** turntables, at **Belle Dock** and
in the **Cedar Hill yards**. That is where the folk memory comes from.

If this ever goes on a sign, the words are "electric transfer table."

### The Dellfant painting is real, and the picture of it is not

**"Austin's Boats, New Haven," Max Dellfant, 1912, oil on canvas, Yale University
Art Gallery, accession 1945.355**, gift of George H. Langzettel. Verified via
Wikidata and YUAG's own catalogue, which marks it **"No Copyright — United
States," open access**, with an IIIF manifest.

**But the largest image YUAG serves is 386 × 480 pixels**, and it is an old
storage record shot: the canvas in its frame, propped in a rack, with the
accession card visible at the bottom. Useless for a 36 × 24 inch panel and poor
even on the web. I downloaded it, looked at it, and deleted it.

**The lead is still good — the asset is not.** The move is to ask the Yale
University Art Gallery for a proper reproduction; the object is open access, so
there should be no rights obstacle, only a photography request. Dellfant kept a
studio in the loft of the **Mansfield Oyster Company** on the Quinnipiac and
painted this waterfront for thirty years. If YUAG or the New Haven Museum
(**MSS #276, the Dellfant-Ross papers**, Boxes 1-2, reportedly no donor
restrictions) can produce a good scan of a watch house or a working wharf, that
is sign 12's hero image.

### Also reported, not yet checked, and worth checking

- **Yale rowing.** The Yale Boat Club (1843, the four-oared *Pioneer*) is said to
  be the oldest collegiate athletic club in the United States, to have trained on
  the sheltered lower Mill River when the harbour was rough, and to have used
  **Lake Whitney** for spring trials and scratch regattas through the 1860s and
  1870s. A boathouse near the mouth of the Mill River in 1875. **If this holds it
  belongs on sign 4**, which is the Lake Whitney sign and currently says nothing
  about anyone enjoying the reservoir.
- **Milton Stewart, revised.** The report says the condemnation award was
  **$13,000, not $40,000**; that he put it into twelve brick tenements on State
  Street beside the Mill River known as **"Stewart's Dirty Dozen"**, with a
  **tidal sewage system that used the rise and fall of the Mill River and
  failed**, producing rent strikes and litigation; and that he died **27 July
  1897, aged 74**, in a basement room on Warren Place. It also says Stewart
  **publicly repudiated the ark story in 1883**, telling reporters he was
  building a 100-passenger steamboat for travel to Europe.

  If the Dirty Dozen holds up it is a genuine Mill River story and belongs on a
  sign. **None of it is verified here** — a ChronAm search for Stewart's own
  account died on a network error and was not retried. Sign 11 states no dollar
  figure, so nothing on the metal is wrong; it simply does not yet have this.
- **The counterfeiting vault** under the summit house is reported VERIFIED from
  three 1884 papers, with the workings attributed to Elizur Hubbell's Mountain
  House era (1843-48) rather than to Stewart. Also unchecked here.

### And a lead formally closed

**No photograph or engraving of Stewart's boat on the summit exists.** The report
searched the Whitney Library, Yale Manuscripts and Archives, the Connecticut
State Library and Chronicling America. This project has chased that picture three
times. It is time to stop and let the placeholder brief stand as a description.


## The site now sorts itself by readiness

`/` and `/index.es.html` no longer list the signs by number. They list them by
**how close each one is to finished**, in four groups — *Artwork complete, ready
to proof* / *Nearly there* / *Still gathering pictures* / *Deliberately
unwritten* — with a dot bar and a count on each card ("3 of 4 photographs
sourced").

**The readiness is computed at build time from the actual files on disk**
(`readiness()` in `build/render-site.mjs`), so the index cannot drift from
reality. Nobody has to remember to update a status list. Add the missing picture
and the sign moves up the page by itself.

This exists so the state of the project can be handed to someone in one link.

### Where things stand, August 2026

| | Sign | Photographs |
|---|---|---|
| ✅ | 1 Fenian Ram, 2 Ball Island, 3 Bridges, 4 Whitney, 5 Bath House | 4 of 4 |
| 🟡 | 13 Lanson | 3 of 4 |
| 🟡 | 9 Plans | 2 of 4 |
| ⬜ | 6 Tide Gate, 10 Highway, 12 Dragon Point | 1 of 4 |
| ⬜ | 7 Tides, 8 Grapevine Point, 11 East Rock, 15 James Street | 0 of 4 |
| — | 14 First People | placeholder, never prints |

**Signs 2, 3, 4 and 5 moved from `draft` to `proof`.** Their artwork is complete,
so the "this sign is still a draft, the hatched boxes are photographs not yet
sourced" note was actively wrong on them — there are no hatched boxes left. They
now say what sign 1 says: ready for someone to proof. That is a review state, not
an approval; nobody has signed them off.

### Two images sourced this round

- **Phragmites australis** — `assets/images/species/common-reed-phragmites-australis.jpg`,
  from **USFWS Mountain-Prairie via Wikimedia Commons, public domain**, cropped
  4:3 and resized to 1024 x 768 to match the other species plates. It was the
  last gap on **sign 2**, which is now complete, and it also fills the slot on
  **signs 6 and 7**. Note the source description makes exactly the sign's point:
  it "can create monotypic (solid) stands that choke out" the natives.
- **Sign 13's last slot is now a one-phone-call brief rather than a search.** See
  below.

### Sign 13's last image: ask the New Haven Preservation Trust

The 2024 Long Wharf Pier National Register nomination contains, as **Figure 11**,
a 2021 photograph captioned *"Long Wharf Pier structure, showing stone walls laid
by Lanson,"* credited to the **New Haven Preservation Trust**. I pulled it out of
the PDF to look at it: it is his dry-laid wall, still standing at low tide,
mossed and barnacled, with the harbour behind.

**For a man of whom no portrait exists, a photograph of the thing his hands built
is the right picture.** It is in copyright. The Trust is a local nonprofit and
this is a community trail sign — that is one email.

The fallback is **Amos Doolittle's 1824 plan of New Haven**, Figure 4 of the same
nomination, showing Long Wharf and the east side where New Liberia stood. Public
domain — but the copy embedded in the PDF is only 899 x 697, too small to print.
A full-resolution scan should come from the Yale Map Collection or the Whitney
Library.

Both are now written into the sign's `source_note`, with the rights status
spelled out, along with a warning not to substitute a stone scow because no
pre-1850 New Haven example survives anywhere.


## The 2024 bioblitz closes the oldest caveat in this file

From the first draft, every species panel carried the same warning: the picks
were plausible guesses made at a desk, and somebody should walk the sites and
swap them. JR has now produced **the trail's own 2024 bioblitz** — 49 taxa
recorded along the Mill River Trail.

**Most of the guesses were right.** Eleven of the species already on the signs
appear in the record:

American Pokeweed · Great Mullein · Black-eyed Susan · Common Evening-Primrose ·
Common Toadflax · Eastern Poison Ivy · Rugosa Rose · Firewheel *(Gaillardia
pulchella)* · Bull Thistle · Lesser Burdock · Hedge Bindweed

Each of those now carries **`recorded: 2024 bioblitz`** in its YAML entry. That
field is not printed. It exists so that a future editor can tell at a glance
which species are evidence and which are still inference — the distinction this
file spent two years asking for.

### Three genus-level entries became species

The blitz identified to species what the signs had only to genus, so the signs
now say what was actually found:

| Was | Now |
|---|---|
| Thistles, *Cirsium* | **Bull Thistle**, *Cirsium vulgare* (2 obs) |
| Burdock, *Arctium* | **Lesser Burdock**, *Arctium minus* |
| American Bindweed, *C. sepium* ssp. *americana* | **Hedge Bindweed**, *Calystegia sepium* |
| Indian Blanket | **Firewheel** — the name the recorders used |

### Three swaps, one of which pays off a sign's own name

- **Sign 8, Grapevine Point → Riverbank Grape, *Vitis riparia*, recorded twice.**
  The park is named Grapevine Point. Nobody had checked whether the grapes were
  still there. They are. The web page now says so: *"Whatever else has been done
  to this place in four hundred years, the plant it was named for is still
  climbing the banks."* Replaces Common Peppergrass, which was a guess and is not
  in the record.
- **Sign 7, Tides → Swamp Rose Mallow, *Hibiscus moscheutos*, recorded twice.** A
  native tidal-marsh hibiscus, and a far better indicator for a sign about the
  tidal reach than the Carolina sea lavender it replaces.
- **Sign 15, 370 James Street → Tree-of-Heaven, *Ailanthus altissima*, recorded
  twice.** The tree that grows out of factory walls, on the sign about a factory.
  Replaces Autumn Olive, which is not in the record.

Three new species plates were sourced for these, all **public domain**, cropped
4:3 and sized 1024 x 768 to match the existing set:
`riverbank-grape-vitis-riparia.jpg`, `swamp-rose-mallow-hibiscus-moscheutos.jpg`,
`tree-of-heaven-ailanthus-altissima.jpg`.

### An important limit on how this is used

**A one-day blitz records what people photographed, not everything present.**
Absence from the list is not evidence of absence — Phragmites is not in it, and
Phragmites is unmistakably all over this river. So the rule applied here was:
*prefer a recorded species where a swap is equally apt; do not delete a plausible
unrecorded one just because nobody photographed it that day.* Seaside goldenrod,
sea lavender and flatsedges stay on the genuinely salt and tidal signs on that
basis, unmarked, which is the honest signal.

### Still unused, and worth a second look

The blitz recorded things no sign uses yet, several of them better than what is
there:

- **Buttonbush** *(Cephalanthus occidentalis)*, **Groundsel Tree** *(Baccharis
  halimifolia)*, **Northern Bayberry** *(Morella pensylvanica)*, **Climbing
  Hempvine** *(Mikania scandens)* — natives of exactly this kind of shoreline.
- **Common Milkweed**, **Eastern Redcedar**, **Tall Goldenrod** *(Solidago
  altissima* — note, not the seaside goldenrod the signs assume).
- **Invasives** we do not name: Asian Bittersweet, Wineberry, Spotted Knapweed,
  Purple Crownvetch, Orange Day-Lily, White Sweetclover.
- **Animals**, and there are almost none on the signs: **Eastern Pondhawk**
  (dragonfly), **Two-spotted Bumble Bee**, **Wild Indigo Duskywing** (butterfly),
  and three *Catocala* underwing moths — Ilia, Ultronia and Connubial. A sign
  panel with an underwing moth on it would be unlike anything else on the trail.

### And a standing invitation

The blitz is the single most useful thing anyone has handed this project, because
it is the only body of evidence in the whole file that was gathered **on the
trail itself** rather than out of an archive. **Do it again, and record the
location of each observation**, and every species panel on the trail could be
specific to the ground the sign stands on rather than to the river in general.

## Sinye Tang's thesis

`docs/*.pdf` is now gitignored. Sinye Tang's *The Bed In Which They Lie* was
shared with the project to read while writing, not to redistribute — this
repository is public, and NOTICE.md is careful about exactly this. It stays on
the working copy, out of the commit. **If anything from it reaches a sign, credit
it and ask her first.**


## The ecology round: one live error caught, one sign improved

The last research pass covered the corridor's ecology. Two things in it were
worth acting on immediately.

### CORRECTED — peregrines do not nest on East Rock

Sign 11 said *"Peregrine falcons nest on the trap rock cliffs of the Connecticut
ridges."* That sentence is literally true and **misleading where it stands**,
because a reader at the foot of East Rock will take "the Connecticut ridges" to
mean this one.

Verified independently: the Connecticut cliff eyrie is on **West Rock**. **Steve
Broker** found a pair holding territory there in **1999**, and in the 2000
breeding season they produced **the first peregrine egg laid on a Connecticut
cliff in sixty years** — after DDT had eliminated the species as a breeding bird
east of the Rockies. Their descendants are still there.

East Rock is foraging and roosting habitat: updraughts off the face, and a city
full of pigeons underneath.

Sign 11 now says exactly that, and the correction is a *better* fact than the
claim it replaces — "if you see a falcon over East Rock, it very likely nests on
the other rock" is more interesting than a vague statement about ridges. The
species panel entry carries a YAML comment so nobody re-introduces the error.

**This is the third time popular local lore has been found on one of our signs**
after Stewart's ark, Lanson's stone and the Save Our Park Committee. The pattern
is worth naming: the claims that fail are always the ones that sound like they
were repeated rather than read.

### Sign 4 gains the best "go and look" fact on the trail

Sign 4 ended on the museum and the industrial landscape. It now ends on
something a visitor can act on in April:

River herring come in from the sea every spring — alewives from late March,
bluebacks from May — up the Mill River, past the tide gates, through the city.
**And then they stop, at this dam.** There is no fish ladder. The alewives gather
in the plunge pool at the foot of the spillway behind the museum, and that is as
far up their own river as they get; **Lake Whitney and roughly fourteen miles of
watershed above it have been closed to them since 1860.**

The birds know — cormorants, great blue herons, black-crowned night-herons and
osprey collect below the dam for exactly this reason.

And **river herring are under a statewide closure in Connecticut**, fresh and
salt water alike, because the coastwide population collapsed. Watching is all
that is permitted.

This connects sign 4 to sign 6, which already carried the Whitney dam as the
thing that closed the upper river in 1860. The two now tell one story from
opposite ends.

### Not acted on, but recorded

- **Corridor zoning.** The report divides the river into four ecological reaches
  — dam tailrace, floodplain, tidal reach below the State Street gates, and
  harbour confluence — and proposes a four-species panel for each. That is a
  sound structure and roughly what the signs already do by accident. If the
  species panels are ever reworked wholesale, this is the framework.
- **eBird hotspots**, named with IDs: East Rock Park (L207438, an Important Bird
  Area with 200+ species and 25+ warbler species in May), Rice Field (L1091465),
  Criscuolo Park (L872412). **These are the free, ongoing, location-specific
  data this file asked for** when the bioblitz came in. Anyone reworking species
  panels should start here.
- **The invasive suite** the report names for specific reaches — Japanese
  knotweed on the scoured banks, garlic mustard and Japanese barberry on the
  East Rock talus, mugwort on the fill, Phragmites below the tide gates. Signs
  11 and 6 already name most of these in the right places. The barberry-and-tick
  connection is now on sign 11.
- **More HAER images, all public domain**, found while checking: **CONN,5-HAM,3B--7**
  ("Whitney Arms Company, East Rock in Background, c. 1870"), **CONN,5-HAM,3--12**
  ("Mill River and Lake Whitney Dam, c. 1900"), **CONN,5-HAM,3--20** ("Mill River
  and rear of the 1860 armory building, c. 1930"). Sign 4's artwork is already
  complete, but these are free and better than nothing for signs still short.
- **Ezra Stiles, "A Plan of New Haven and Harbour," 27 September 1775**, Yale
  Manuscripts and Archives — public domain, and it shows the estuary *before*
  the filling and the tide gates. That is a strong candidate for **sign 2 or
  sign 7**, both of which are about what the marsh used to be.
- **Unchecked claims** worth a look before use: that smooth and saltmeadow
  cordgrass are "largely extirpated" from the upper tidal reach and survive only
  near Criscuolo Park; the mummichog and common carp suggestions; and the
  Arnold Guyot Dana scrapbooks, **Volume 96 (New Haven water supply and rivers)**,
  at the Whitney Library, said to hold albumen prints of the dam and lower river
  1860-1920. That last one is another reason to book the Whitney Library day.


## The Exchange Street park is built, and the sign said "proposed"

JR spotted this: sign 9's fourth image was captioned *"Proposed green
infrastructure for the school grounds at Exchange Street and the Mill River
Trail — the current version of the argument."* The pocket park has been there
since 2022.

The drawing itself is fine — it is **Figure 11 of Save the Sound's 2018 Mill
River Watershed Based Plan**, and it genuinely is a proposal drawing. The fault
was the caption's tense. *"The current version of the argument"* says the
argument is still going. It is not; somebody won it.

### Verified

Save the Sound's own project page: built and open. Construction ran
**January-May 2022**, opened in 2022 during the International Festival of Arts
and Ideas, planted in June and September. Nearly **12,000 square feet of asphalt
removed**, **300+ native plants**, bioretention gardens and swales to catch
runoff before it reaches the river, a walkway joining the trail, interpretive
signage about the bioretention, and a mural, *Born to Explore*, by the artist
Frenemy. A collaboration between Save the Sound, the City, Biohabitats, Schumack
Engineered Construction, the John S. Martinez School, Cold Spring School and
Mill River Trail Advocates.

### It made the sign better

Sign 9 is a catalogue of plans that did not happen — Gilbert and Olmsted shelved,
Rotival stopped, the connector killed in the statute book. It ended on a
sentiment: *"It took until now to build it."*

It now ends on a fact. There is a new section, **"One of them got built,"** which
points at the drawing in the corner of the sign and says that one is real, and
what was actually done, and closes:

> A hundred and twelve years after Gilbert and Olmsted told the city to leave
> the river some ground, somebody left it some ground.

That is a far stronger ending than the one it replaces, and it is standing a few
hundred yards from the sign where anyone can go and check it.

### The general lesson: present tense ages

**These signs are supposed to last twenty years outdoors.** Any sentence written
in the present tense about a live process — "proposed", "the current version",
"is planned", "coming soon" — is a dated claim that will quietly become false
without anyone noticing, and it cannot be edited once it is in metal.

I swept the other signs for the same fault. Every remaining use of "proposed"
refers to something historical — the 1917 Mill River Dam, the 1881 floating bath,
the 1960s connector, the 1910 plan — and is correctly past tense. Nothing else
needs changing today.

**The rule for future edits:** if a sentence would need rewriting when something
finishes being built, either date it ("the 2018 plan") or say what happened. Do
not leave a sign describing an argument that is still in progress, because it
will not be for long, and the sign will be.
