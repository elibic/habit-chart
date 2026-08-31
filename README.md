# מחולל טבלאות הרגלים לילדים

A single-page app that generates a printable sticker chart on the **Hebrew**
calendar. A parent types the child's name and the habit, picks the stretch of
days to cover, a paper size and a theme, and prints one landscape page with an
empty white circle for every day — one circle, or two labelled בוקר and ערב.

Two ways to set the range:

- **חודש שלם** — one Hebrew month, א׳ to its last day.
- **מתאריך** — a chosen number of weeks from a chosen day. A chart gets
  started on the day the parent decides, not on the 1st, so a run of four
  weeks from י״ז אלול simply carries on into תשרי. Where it crosses, the 1st
  wears its new month's name, because a bare א׳ mid-chart says nothing.

Built with React + Vite + Tailwind CSS v4. The Hebrew calendar comes from
[`@hebcal/core`](https://github.com/hebcal/hebcal-es6), so month lengths,
leap years and the weekday the 1st falls on are computed, never hardcoded.

---

## Setup

```bash
npm create vite@latest habit-chart -- --template react
cd habit-chart
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install @hebcal/core
```

Then, in this repository:

```bash
npm install     # everything above is already in package.json
npm run dev     # http://localhost:5173
npm run build   # production bundle in dist/
npm run lint    # oxlint
```

Tailwind v4 needs no config file: `@tailwindcss/vite` is registered in
`vite.config.js` and `src/index.css` starts with `@import 'tailwindcss'`.

---

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which lints, builds,
and force-pushes `dist/` to the `gh-pages` branch. GitHub Pages serves that
branch, so the live site is one push behind `main` and nothing is deployed by
hand.

Two things make the build survive being served from a project subpath rather
than a domain root:

- `base: './'` in `vite.config.js`, and `assetPath()` builds its URLs from
  `import.meta.env.BASE_URL` — a leading `/` would point outside the
  subdirectory and every piece of artwork would 404.
- The bundler writes to `dist/build/` (`build.assetsDir`), so its output cannot
  collide with `public/assets/`, which has to keep its name because the artwork
  is addressed by hand.

The fonts are bundled from `@fontsource` rather than fetched from a CDN, and
only in the Hebrew and Latin subsets and the three weights the design uses. A
chart is meant to be printed, sometimes on a school network with no outside
access; a webfont that fails to arrive silently changes the whole layout.

---

## How it is put together

```
src/
  App.jsx                    state, and the dynamic @page rule
  index.css                  Tailwind, the sheet's own CSS, and @media print
  lib/
    hebrewCalendar.js        everything built on @hebcal/core
    layout.js                page geometry, in millimetres
    themes.js                palettes + artwork paths
  components/
    ControlPanel.jsx         the form (hidden at print time)
    ChartPreview.jsx         scales the sheet to fit the screen
    ChartSheet.jsx           the printable sheet itself
    AssetImage.jsx           an image that is allowed to 404
    Icons.jsx                the sun and moon, inline SVG
public/assets/<theme>/       your generated PNGs — see public/assets/README.md
.github/workflows/deploy.yml  build + publish to GitHub Pages on push to main
```

The sheet is laid out as a poster, not a worksheet: a full-bleed illustrated
background, a strip of characters down each side gutter, a hero character
beside a poster-sized name, a gold frame over everything, and the calendar as a
white panel floating in the middle. All of that comes from four PNGs per theme
(`background`, `frame`, `cast`, `hero`), and every one of them is optional —
the CSS fallbacks draw a ray-burst background, a gold frame and dashed
character panels, so the page prints as a finished poster before you generate a
single asset.

Four decisions worth knowing about:

**The sheet is built in millimetres, not pixels.** `.chart-sheet` is literally
`297mm × 210mm` (or `420mm × 297mm`), and the preview is that same element
under a `transform: scale()` sized by a `ResizeObserver`. The transform is
dropped in `@media print`, so the preview cannot drift from the printout.

**A3 is A4 × √2, exactly.** Every measurement in `lib/layout.js` is written
once for A4 and multiplied by `k = paper.width / 297`, so the two paper sizes
are the same design at two sizes rather than two designs that drifted apart.

**`@page` can't read a CSS variable.** The `size: <paper> landscape` rule is
rewritten from `App.jsx` whenever the paper size changes.

**Keylines belong at display size only.** The topic used to be outlined like
the name, at 6mm, where a hard multi-shadow stroke turns to mud. It sits on a
solid ribbon now, and the outline is reserved for the name at 18mm. The dates
moved out of that line into a chip of their own, which also balances the hero
character on the other side of the title.

**The name's outline is text-shadow, not `-webkit-text-stroke`.** A stroke is
drawn centred over the glyph and eats into the fill, which at poster size looks
thin and muddy. Two rings of hard-offset shadows — white, then dark — give the
crisp keyline the reference art has, and they print cleanly.

## Printing

`@media print` hides the control panel (`.no-print`), drops the preview
transform, and sets `print-color-adjust: exact` so the themed backgrounds
reach the paper. In the browser's print dialog the user still needs
**Background graphics** ticked — the control panel says so.

## Hebrew calendar notes

- Day numbers are rendered with `gematriya()` — **letters only**, never Arabic
  numerals: `א׳`, `ט״ו`, `ט״ז`, `כ״ז`, `ל׳`.
- Columns run Sunday → Shabbat, and `dir="rtl"` puts יום ראשון on the right
  with no manual reordering.
- Leading cells before the 1st are rendered as dashed empties.
- Leap years get thirteen months, with אדר א׳ and אדר ב׳. Month 12 is plain
  אדר in a common year, so switching from a leap year while אדר ב׳ is selected
  resolves to אדר rather than leaving hebcal with no month to describe.
- Cheshvan and Kislev change length year to year; `HDate.daysInMonth()` is the
  authority, so the grid is 29, 30, or a short month without special-casing.
- A range walks forward with `HDate.add(1, 'd')` rather than counting days
  itself, so crossing into the next month — and into the next year, where the
  date chip then reads תשפ״ו–תשפ״ז — needs no arithmetic of our own.

## Verified

Checked in Chromium against a real print run:

- Elul תשפ״ו — 29 days, 1st on Friday, five leading empties, no Arabic numerals.
- Kislev תשפ״ו — 30 days, 1st on Friday, ends on ל׳.
- תשפ״ז lists thirteen months including אדר א׳ / אדר ב׳.
- Visual column order right-to-left is ראשון → שבת.
- Tishrei תשפ״ו — 30 days, 1st on Tuesday, two leading empties.
- Four weeks from י״ז אלול תשפ״ו — 28 days ending ט״ו תשרי תשפ״ז, with the
  month badge landing on א׳.
- Two to six weeks, A4 and A3, one and two stickers: right row count, nothing
  overflowing the sheet, one page every time.
- Two-sticker mode: בוקר on the right, ערב on the left, 2 slots per day.
- Print: control panel `display: none`, transform removed,
  `print-color-adjust: exact`, and **one** page at 297×210 mm (A4) and
  420×297 mm (A3).
- Every artwork slot missing: the page still renders and prints complete, on
  its CSS fallbacks.

---

## Image generation prompts

Four prompts, one per artwork slot. Run each one four times — once per theme —
swapping in the theme line, and save the results as
`public/assets/<theme>/<slot>.png`.

Theme lines to substitute for **[THEME]**:

| theme id | theme line |
| --- | --- |
| `rescue-blue` | *rescue services — ambulance and police, cobalt and sky blue with a golden yellow accent* |
| `fire-red` | *fire brigade — fire engine and hydrants, fire-engine red and cream with a warm orange accent* |
| `nature` | *woodland meadow — forest animals and leaves, leaf green and moss with a honey yellow accent* |
| `space` | *outer space — rockets and planets, deep violet and indigo with a bright cyan accent* |

Two rules that matter more than the wording: keep the characters **original**
(don't prompt for a named character from a show — it isn't yours to print), and
respect the empty zones each prompt asks for. The centre of the page belongs to
the calendar grid.

### 1. `background.png` — the full-bleed scene

> A vivid full-bleed illustrated backdrop for a children's reward poster,
> **landscape** 1.414:1. A bright **[THEME]** world: a radiant sun-ray burst
> spreading from the upper centre, soft cumulus clouds, sparkling stars, and a
> band of themed scenery along the very bottom edge. In the **top-left corner
> only**, a cheerful supporting scene — a themed vehicle in mid-action with a
> small friendly animal sidekick.
> **The entire middle of the image must stay calm, plain and uncluttered** —
> just sky, rays and gentle gradient — because a white calendar panel is laid
> over it and nothing there will ever be seen.
> Glossy 3D-rendered cartoon style, like a modern preschool TV show: rounded
> forms, saturated colours, soft rim lighting, clean and joyful, aimed at ages
> 4–8. No text, no letters, no numbers, no frame, no border, no grid, no
> watermark. 2480×1754 PNG.

*Midjourney:* `--ar 7:5 --style raw --v 6.1`

### 2. `frame.png` — the ornamental border

> An ornate golden border frame for a children's poster, **landscape** 1.414:1.
> A polished gold band with a beaded inner edge and rounded corners runs around
> all four sides, decorated with small repeating **[THEME]** motifs and a larger
> emblem flourish at each corner. Glossy 3D-rendered look with metallic
> highlights and a crisp dark outline, playful rather than formal.
> **The whole centre of the image must be completely empty and fully
> transparent.** The band occupies only the outer 7% of each side and never
> crosses inward — this frame is drawn *on top of* a calendar grid, and anything
> in the middle will cover it. No text, no numbers, no drop shadow spreading
> inward, no background fill. Transparent PNG, 2480×1754.

*Midjourney:* `--ar 7:5 --style raw --v 6.1` — then check the middle really is
transparent before saving.

### 3. `cast.png` — the side gutter characters

> A tall vertical strip of three original cartoon characters stacked one above
> another, **1:4 portrait** proportion. Top: a friendly **[THEME]** crew member
> standing with hands on hips. Middle: a small cute animal companion. Bottom: a
> themed vehicle or object seen three-quarter front.
> All three face slightly to the **left**, are evenly spaced with clear gaps
> between them, and are horizontally centred in the strip — this artwork is
> mirrored to dress the opposite side of the page, so nothing may be
> asymmetric in a way that reads wrong when flipped.
> Glossy 3D-rendered cartoon style, thick clean silhouettes, saturated
> **[THEME]** palette, warm rim lighting, ages 4–8. Fully transparent
> background, no ground plane, no cast shadows, no text, no badges with
> lettering. Transparent PNG, 512×2048.

*Midjourney:* `--ar 1:4 --style raw --v 6.1`

### 4. `hero.png` — the character beside the name

> A single original **[THEME]** hero character for a children's chart, standing
> full-body and **pointing enthusiastically to the left** with a big open smile,
> the other hand raised in a thumbs-up. Three-quarter view, feet planted, heroic
> and welcoming posture, uniform and gear in the **[THEME]** colours.
> Glossy 3D-rendered cartoon style like a modern preschool TV show: large
> expressive eyes, rounded friendly proportions, soft rim lighting, saturated
> colours, crisp edges. Aimed at ages 4–8.
> Composed **bottom-aligned** — the feet sit on the very bottom edge of the
> canvas with a little headroom above — on a fully transparent background. No
> ground, no shadow, no text, no logo, no frame. Transparent PNG, 1024×1280.

*Midjourney:* `--ar 4:5 --style raw --v 6.1`

---

### Getting clean transparency

Midjourney has no true alpha channel. Generate on a flat chroma background
(`on a solid magenta background` for `hero` and `cast`) and key it out
afterwards, or use DALL·E / Nano Banana, which return transparent PNGs
directly. For `frame.png`, the reliable route is to generate the band on white,
then delete the centre and the white by hand — an image generator will almost
always try to fill the middle.
