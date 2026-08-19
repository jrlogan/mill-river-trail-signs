# Handover

For whoever runs this next. You do not need to be a programmer to keep it going.

## What this is

Thirteen interpretive signs for the Mill River Trail. Each one lives in a single
text file under `content/`. Everything else — the printed artwork, the two web
pages, the locator map, the QR codes — is generated from that file. You edit the
text; a robot does the layout.

The signs are bilingual, the pages are bilingual, and they cannot drift apart,
because they come from the same source.

## The three things that must not be lost

Everything else is replaceable. These are not.

1. **The domain.** `signs.millrivertrail.com` is printed on every sign, in metal.
   It is a CNAME at Hover pointing to GitHub Pages. If that record lapses, every
   QR code on the trail goes dead. **Keep the domain registration paid and the
   CNAME in place**, whatever else changes.
2. **The repository.** <https://github.com/jrlogan/mill-river-trail-signs> holds
   the content, the build and the history. See *Transferring ownership* below —
   this is the single biggest succession risk, because it currently sits on a
   personal account.
3. **The archive.** The full-resolution historic images and the original
   research are **not** in the repository — they are too large. They live in the
   project's Drive folder and the handoff zips. Keep a second copy somewhere
   that is not one person's laptop.

## The four things you will actually do

### Fix a typo

Open the sign's file in `content/`, fix the text, save, and push. The site
rebuilds itself within a minute. If the sign is already printed, note the change
and let it accumulate — see *Reprinting* below.

### Answer feedback

If a public feedback form is set up (`feedback:` in `content/_shared.yml`), every
page carries an invitation and replies land wherever that form sends them. Good
ones become edits to a sign's file. That is the whole loop.

### Add a sign

1. Copy an existing file in `content/` and change the id, number, title, text,
   coordinates and URL slug.
2. Put its images in `assets/images/sign-NN/`.
3. Run `npm run all`.
4. Commit and push.

The locator map draws itself from the coordinates. If an image does not exist
yet, point at a filename starting `TODO-` and add a `source_note`; the sign will
print a labelled placeholder and refuse to leave draft status until the real
picture arrives.

### Reprint a sign

`dist/print/sign-NN-*.pdf` is press-ready at 36 × 24 inches. Before sending it:

```bash
npm run all          # rebuild everything
npm run check:live   # scan the QR codes and fetch what they point at
```

Then scan the printed proof with an actual phone. The build proves a lot; only a
phone proves the whole chain.

## Reprinting is cheap. Use that.

This is the part worth understanding. Historically an interpretive sign was
written once, argued over for two years, printed, and then was wrong forever.
Here, changing a sign is editing a paragraph and running one command. A reprint
costs the metal, not the process.

So treat the signs as **revisable**. When somebody tells you the bath house was
somewhere else, or sends a photograph of their grandfather on the oyster boats,
that is not an annoyance — it is the point. Fix the file, let the web page
update immediately, and reprint when there are enough corrections to justify a
plate.

Record what is actually in the ground with `status:` and, when you print, add:

```yaml
status: printed
printed: 2026-09-14      # the date this plate went up
```

so a future reader can tell which text is on the metal and which is only online.

## What not to do

- **Do not add a content management system.** Plain text files in git are the
  reason this is still legible. A CMS adds an account, a subscription, a vendor
  and a migration.
- **Do not move the QR destinations.** The subdomain is under your control and
  can be redirected; the printed URL cannot. If pages move, redirect — do not
  renumber.
- **Do not delete the `docs/DECISIONS.md` corrections log.** It records what was
  wrong on the 2022 comp and why each change was made. Without it somebody will
  helpfully restore an error.
- **Do not commit the print-resolution archival images.** They are gitignored
  deliberately. The readable web copies are the record.

## Transferring ownership

Do this before it is urgent.

1. Create a GitHub organisation for the trail and transfer the repository into
   it. Add at least two people as owners.
2. In the new repo's Settings → Pages, set the custom domain to
   `signs.millrivertrail.com` again and re-enable Enforce HTTPS.
3. Confirm the Hover CNAME still points at the new Pages host.
4. Run `npm run check:live`. If all the QR codes resolve, the transfer worked.
5. Hand over the Drive archive and the domain registrar login at the same time.

## If you are stuck

`README.md` explains the build. `docs/DECISIONS.md` explains why the content is
the way it is, what is still unresolved, and which claims still need a source.
Read that one before changing any historical text.
