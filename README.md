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
beside a poster-sized name, and the calendar as white day cards floating
straight on the artwork. All of that comes from four PNGs per theme
(`background`, `frame`, `cast`, `hero`), and every one of them is optional —
the CSS fallback paints a tinted ground with two soft blobs and a confetti
scatter, so the page prints as a finished poster before you generate a single
asset.

The visual language is deliberate. Radiating sunbursts, hard multi-shadow
keylines around text and ornamental gold borders are the vocabulary of party
supplies, and no amount of good typography rescues a page built on them. What
replaced them: soft organic blobs, one confident accent per theme, borderless
cards with gentle shadows, generously rounded corners, and type that carries
its weight by being chunky rather than outlined.

Two things the artwork forced. The cards sit directly on the backdrop with no
panel behind them — an opaque panel turned the page into one big table and hid
the picture it was sitting on. And row height is capped: a two-week chart
stretched to fill the sheet gives cells the size of postcards, so past the cap
the grid keeps its height and centres, weekday headers and all.

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

One prompt per theme, each producing a single `background.png` that carries
the whole decoration. Save the result as
`public/assets/<theme>/background.png` — once it loads, the other three
artwork slots stop drawing their placeholders, so one file per theme is a
complete set.

Three rules every prompt enforces, because breaking any one of them produces
an image the app cannot use:

- **No text and no grid.** The chart is computed — a generated calendar has
  the wrong dates, and generated Hebrew comes out garbled.
- **The centre stays empty.** The white panel covers 8%–92% of the width and
  20%–91% of the height. Anything drawn there is paid for and never seen.
- **No frame.** The page's own design has no border, and an ornamental edge
  fights it.

Some of these name characters from television. That is a decision for whoever
is printing the chart; image generators refuse or drift on them at their own
discretion, and the fallback that works is to edit an existing image of the
character rather than generate one from nothing.

### `fire-red` — fire brigade

```
A full-bleed decorative backdrop for a children's reward poster, in the style of the Fireman Sam animated series.
Landscape, 1.414:1 (A4 landscape proportion).

Feature Fireman Sam himself in the top right, in his yellow helmet with the
clear visor and his navy blue tunic with silver reflective bands, smiling and
pointing enthusiastically to the left. In the top left, Wallaby One, the red
rescue helicopter, in flight.
Behind them a soft, airy background: two or three large rounded organic blob
shapes in gentle tints of the palette, a few simple flat clouds, and a light
scatter of small confetti dots and stars. No sunburst, no radiating rays, no
starburst lines.

Down the left and right edges, within the outer 8% of the width on each side,
a vertical stack of the Pontypandy crew: Penny Morris, Station Officer Steele,
Elvis Cridlington, Norman Price, and Radar the dalmatian.

Along the bottom, within the lower 9% of the height and kept to the two
corners: Jupiter the red fire engine, a coiled fire hose, a yellow fire helmet,
and Neptune the rescue boat on water.

NO BORDER AND NO FRAME of any kind — no gold, no ornament, no ribbon edge, no
outline or rule around the page. The artwork runs clean to all four edges.

CRITICAL — THE CENTRE MUST BE EMPTY: the central rectangle from 8% to 92% of
the width and from 20% to 91% of the height must contain nothing but a plain,
smooth, softly graded pale peach. No characters, no objects, no blobs, no
clouds, no dots, no detail. A white calendar panel is placed over that exact
area by software and will permanently cover anything drawn there.

ABSOLUTELY NO TEXT AND NO CHART: no letters, no words, no numbers, no Hebrew,
no English, no title, no logo, no badge. No calendar, no grid, no table,
no rows, no columns, no boxes, no circles.

Style: modern children's illustration, exactly as in the series. Rounded chunky forms, soft
matte shading and gentle drop shadows rather than hard gloss, clean thick
silhouettes, generous empty space. Warm coral red and cream with a soft buttery accent. Light and airy, for ages 4-8.
Print quality, crisp edges, no watermark.
```

### `construction` — כלי עבודה

```
A full-bleed decorative backdrop for a children's reward poster, themed on a friendly construction site.
Landscape, 1.414:1 (A4 landscape proportion).

In the top right, a smiling yellow excavator with big expressive cartoon eyes
in its cab, its arm raised and pointing to the left. In the top left, a tall
crane lifting a girder through the air.
Behind them a soft, airy background: two or three large rounded organic blob
shapes in gentle tints of the palette, a few simple flat clouds, and a light
scatter of small confetti dots and stars. No sunburst, no radiating rays, no
starburst lines.

Down the left and right edges, within the outer 8% of the width on each side,
a vertical stack of characters: a cheerful builder in an orange vest and white
hard hat giving a thumbs up, an orange dump truck, a green bulldozer, a blue
cement mixer with a smiling face, and a small yellow forklift.

Along the bottom, within the lower 9% of the height and kept to the two
corners: orange and white traffic cones, a stack of bricks, a toolbox with a
wrench and a hammer, and a pile of sand.

NO BORDER AND NO FRAME of any kind — no gold, no ornament, no ribbon edge, no
outline or rule around the page. The artwork runs clean to all four edges.

CRITICAL — THE CENTRE MUST BE EMPTY: the central rectangle from 8% to 92% of
the width and from 20% to 91% of the height must contain nothing but a plain,
smooth, softly graded warm pale cream. No characters, no objects, no blobs, no
clouds, no dots, no detail. A white calendar panel is placed over that exact
area by software and will permanently cover anything drawn there.

ABSOLUTELY NO TEXT AND NO CHART: no letters, no words, no numbers, no Hebrew,
no English, no title, no logo, no badge. No calendar, no grid, no table,
no rows, no columns, no boxes, no circles.

Style: modern children's illustration, in the manner of a modern preschool TV series. Rounded chunky forms, soft
matte shading and gentle drop shadows rather than hard gloss, clean thick
silhouettes, generous empty space. Soft amber and warm sand with a calm sky-blue accent. Light and airy, for ages 4-8.
Print quality, crisp edges, no watermark.
```

### `football` — כדורגל

```
A full-bleed decorative backdrop for a children's reward poster, themed on football.
Landscape, 1.414:1 (A4 landscape proportion).

In the top right, a cheerful young football player in a green and white kit,
one arm raised in celebration and the other pointing to the left. In the top
left, a football flying through the air with a soft motion trail.
Behind them a soft, airy background: two or three large rounded organic blob
shapes in gentle tints of the palette, a few simple flat clouds, and a light
scatter of small confetti dots and stars. No sunburst, no radiating rays, no
starburst lines.

Down the left and right edges, within the outer 8% of the width on each side,
a vertical stack of characters: a goalkeeper in bright gloves diving sideways,
a friendly coach with a whistle, a young girl player doing keepie-uppies, a
smiling lion team mascot, and a stack of footballs.

Along the bottom, within the lower 9% of the height and kept to the two
corners: a white goal net, a pair of football boots, a trophy, and tufts of
bright grass.

NO BORDER AND NO FRAME of any kind — no gold, no ornament, no ribbon edge, no
outline or rule around the page. The artwork runs clean to all four edges.

CRITICAL — THE CENTRE MUST BE EMPTY: the central rectangle from 8% to 92% of
the width and from 20% to 91% of the height must contain nothing but a plain,
smooth, softly graded pale mint green. No characters, no objects, no blobs, no
clouds, no dots, no detail. A white calendar panel is placed over that exact
area by software and will permanently cover anything drawn there.

ABSOLUTELY NO TEXT AND NO CHART: no letters, no words, no numbers, no Hebrew,
no English, no title, no logo, no badge, no shirt numbers, no team crest. No calendar, no grid, no table,
no rows, no columns, no boxes, no circles.

Style: modern children's illustration, in the manner of a modern preschool TV series. Rounded chunky forms, soft
matte shading and gentle drop shadows rather than hard gloss, clean thick
silhouettes, generous empty space. Soft grass green and cream with a friendly blue accent. Light and airy, for ages 4-8.
Print quality, crisp edges, no watermark.
```

### `mickey` — מיקי מאוס

```
A full-bleed decorative backdrop for a children's reward poster, in the style of the Mickey Mouse Clubhouse animated series.
Landscape, 1.414:1 (A4 landscape proportion).

Feature Mickey Mouse himself in the top right, in his red shorts with two
white buttons, white gloves and yellow shoes, smiling widely and pointing
enthusiastically to the left. In the top left, Pluto bounding through the air
with his ears flying.
Behind them a soft, airy background: two or three large rounded organic blob
shapes in gentle tints of the palette, a few simple flat clouds, and a light
scatter of small confetti dots and stars. No sunburst, no radiating rays, no
starburst lines.

Down the left and right edges, within the outer 8% of the width on each side,
a vertical stack of the Clubhouse friends: Minnie Mouse in her polka-dot dress
and bow, Donald Duck in his sailor top, Goofy in his green hat and orange
sweater, Daisy Duck in purple, and Pluto sitting.

Along the bottom, within the lower 9% of the height and kept to the two
corners: red Mickey-ear balloons, Goofy's yellow car, and a picnic basket.

NO BORDER AND NO FRAME of any kind — no gold, no ornament, no ribbon edge, no
outline or rule around the page. The artwork runs clean to all four edges.

CRITICAL — THE CENTRE MUST BE EMPTY: the central rectangle from 8% to 92% of
the width and from 20% to 91% of the height must contain nothing but a plain,
smooth, softly graded pale rose pink. No characters, no objects, no blobs, no
clouds, no dots, no detail. A white calendar panel is placed over that exact
area by software and will permanently cover anything drawn there.

ABSOLUTELY NO TEXT AND NO CHART: no letters, no words, no numbers, no Hebrew,
no English, no title, no logo, no badge. No calendar, no grid, no table,
no rows, no columns, no boxes, no circles.

Style: modern children's illustration, exactly as in the series. Rounded chunky forms, soft
matte shading and gentle drop shadows rather than hard gloss, clean thick
silhouettes, generous empty space. Soft coral red and cream with a warm buttery yellow accent. Light and airy, for ages 4-8.
Print quality, crisp edges, no watermark.
```

### `underwater` — עולם תת-ימי

```
A full-bleed decorative backdrop for a children's reward poster, themed on a bright coral reef under the sea.
Landscape, 1.414:1 (A4 landscape proportion).

In the top right, a cheerful young diver in a mask and snorkel, hair drifting
in the water, pointing enthusiastically to the left. In the top left, a smiling
dolphin leaping through the water.
Behind them a soft, airy background: two or three large rounded organic blob
shapes in gentle tints of the palette, a few simple flat clouds, and a light
scatter of small confetti dots and stars. No sunburst, no radiating rays, no
starburst lines.

Down the left and right edges, within the outer 8% of the width on each side,
a vertical stack of sea creatures: a purple octopus waving a tentacle, a green
sea turtle, a yellow seahorse, an orange clownfish, and a pink starfish.

Along the bottom, within the lower 9% of the height and kept to the two
corners: colourful coral branches, seashells, a half-open treasure chest, and
swaying seaweed.

NO BORDER AND NO FRAME of any kind — no gold, no ornament, no ribbon edge, no
outline or rule around the page. The artwork runs clean to all four edges.

CRITICAL — THE CENTRE MUST BE EMPTY: the central rectangle from 8% to 92% of
the width and from 20% to 91% of the height must contain nothing but a plain,
smooth, softly graded pale aqua. No characters, no objects, no blobs, no
clouds, no dots, no detail. A white calendar panel is placed over that exact
area by software and will permanently cover anything drawn there.

ABSOLUTELY NO TEXT AND NO CHART: no letters, no words, no numbers, no Hebrew,
no English, no title, no logo, no badge. No calendar, no grid, no table,
no rows, no columns, no boxes, no circles.

Style: modern children's illustration, in the manner of a modern preschool TV series. Rounded chunky forms, soft
matte shading and gentle drop shadows rather than hard gloss, clean thick
silhouettes, generous empty space. Soft teal and aqua with a warm coral orange accent. Light and airy, for ages 4-8.
Print quality, crisp edges, no watermark.
```

### `space` — חלל

```
A full-bleed decorative backdrop for a children's reward poster, themed on outer space.
Landscape, 1.414:1 (A4 landscape proportion).

In the top right, a cheerful young astronaut in a white suit with a clear
helmet visor, floating weightlessly and pointing enthusiastically to the left.
In the top left, a rounded retro rocket rising with a soft trail.
Behind them a soft, airy background: two or three large rounded organic blob
shapes in gentle tints of the palette, a few simple flat clouds, and a light
scatter of small confetti dots and stars. No sunburst, no radiating rays, no
starburst lines.

Down the left and right edges, within the outer 8% of the width on each side,
a vertical stack of characters: a friendly white robot with glowing eyes, a
small green alien waving, a ringed planet, a smiling crescent moon, and a
satellite with solar panels.

Along the bottom, within the lower 9% of the height and kept to the two
corners: a soft lunar surface with gentle craters, a six-wheeled space rover,
and scattered moon rocks.

NO BORDER AND NO FRAME of any kind — no gold, no ornament, no ribbon edge, no
outline or rule around the page. The artwork runs clean to all four edges.

CRITICAL — THE CENTRE MUST BE EMPTY: the central rectangle from 8% to 92% of
the width and from 20% to 91% of the height must contain nothing but a plain,
smooth, softly graded pale lavender. No characters, no objects, no blobs, no
clouds, no dots, no detail. A white calendar panel is placed over that exact
area by software and will permanently cover anything drawn there.

ABSOLUTELY NO TEXT AND NO CHART: no letters, no words, no numbers, no Hebrew,
no English, no title, no logo, no badge. No calendar, no grid, no table,
no rows, no columns, no boxes, no circles.

Style: modern children's illustration, in the manner of a modern preschool TV series. Rounded chunky forms, soft
matte shading and gentle drop shadows rather than hard gloss, clean thick
silhouettes, generous empty space. Soft periwinkle and lilac with a bright aqua accent. Light and airy, for ages 4-8.
Print quality, crisp edges, no watermark.
```

### `cars` — מכוניות

```
A full-bleed decorative backdrop for a children's reward poster, in the style of the Disney Pixar Cars films.
Landscape, 1.414:1 (A4 landscape proportion).

Feature Lightning McQueen himself in the top right, the red race car with his
expressive eyes in the windshield, grinning and tilted as if pointing to the
left. In the top left, Mater the rusty brown tow truck bouncing along.
Behind them a soft, airy background: two or three large rounded organic blob
shapes in gentle tints of the palette, a few simple flat clouds, and a light
scatter of small confetti dots and stars. No sunburst, no radiating rays, no
starburst lines.

Down the left and right edges, within the outer 8% of the width on each side,
a vertical stack of the Radiator Springs characters: Sally the blue Porsche,
Doc Hudson the dark blue Hudson Hornet, Luigi the yellow Fiat, Guido the small
blue forklift, and Cruz Ramirez the yellow race car.

Along the bottom, within the lower 9% of the height and kept to the two
corners: orange traffic cones, a stack of tyres, a chequered flag, and a soft
strip of road.

NO BORDER AND NO FRAME of any kind — no gold, no ornament, no ribbon edge, no
outline or rule around the page. The artwork runs clean to all four edges.

CRITICAL — THE CENTRE MUST BE EMPTY: the central rectangle from 8% to 92% of
the width and from 20% to 91% of the height must contain nothing but a plain,
smooth, softly graded pale apricot. No characters, no objects, no blobs, no
clouds, no dots, no detail. A white calendar panel is placed over that exact
area by software and will permanently cover anything drawn there.

ABSOLUTELY NO TEXT AND NO CHART: no letters, no words, no numbers, no Hebrew,
no English, no title, no logo, no badge, no racing numbers, no sponsor decals. No calendar, no grid, no table,
no rows, no columns, no boxes, no circles.

Style: modern children's illustration, exactly as in the films. Rounded chunky forms, soft
matte shading and gentle drop shadows rather than hard gloss, clean thick
silhouettes, generous empty space. Soft coral red and warm sand with a warm amber accent. Light and airy, for ages 4-8.
Print quality, crisp edges, no watermark.
```

### `super-wings` — מטוסי על

```
A full-bleed decorative backdrop for a children's reward poster, in the style of the Super Wings animated series.
Landscape, 1.414:1 (A4 landscape proportion).

Feature Jett himself in the top right, the red and white transforming jet in
his robot form, smiling with his big round eyes and pointing enthusiastically
to the left. In the top left, Donnie the yellow plane flying past.
Behind them a soft, airy background: two or three large rounded organic blob
shapes in gentle tints of the palette, a few simple flat clouds, and a light
scatter of small confetti dots and stars. No sunburst, no radiating rays, no
starburst lines.

Down the left and right edges, within the outer 8% of the width on each side,
a vertical stack of the Super Wings team: Dizzy the pink rescue helicopter,
Jerome the blue aerobatic jet, Paul the white and blue police plane, Astra the
purple space shuttle, and Mira the aqua submarine plane.

Along the bottom, within the lower 9% of the height and kept to the two
corners: a soft runway strip, a stack of colourful parcels, a control tower,
and a windsock on a pole.

NO BORDER AND NO FRAME of any kind — no gold, no ornament, no ribbon edge, no
outline or rule around the page. The artwork runs clean to all four edges.

CRITICAL — THE CENTRE MUST BE EMPTY: the central rectangle from 8% to 92% of
the width and from 20% to 91% of the height must contain nothing but a plain,
smooth, softly graded pale sky blue. No characters, no objects, no blobs, no
clouds, no dots, no detail. A white calendar panel is placed over that exact
area by software and will permanently cover anything drawn there.

ABSOLUTELY NO TEXT AND NO CHART: no letters, no words, no numbers, no Hebrew,
no English, no title, no logo, no badge, no registration markings on the aircraft. No calendar, no grid, no table,
no rows, no columns, no boxes, no circles.

Style: modern children's illustration, exactly as in the series. Rounded chunky forms, soft
matte shading and gentle drop shadows rather than hard gloss, clean thick
silhouettes, generous empty space. Soft cornflower blue and cream with a warm coral accent. Light and airy, for ages 4-8.
Print quality, crisp edges, no watermark.
```
