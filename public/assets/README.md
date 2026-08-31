# Artwork

Four transparent PNGs per theme. Until you add them, every slot falls back to
CSS — a ray-burst background, a gold frame, dashed character panels — so the
app runs and prints as a finished poster from the first load.

```
public/assets/
  rescue-blue/  fire-red/  nature/  space/  construction/
  football/  mickey/  underwater/  cars/  super-wings/
    background.png   full-bleed illustrated scene, printed at full strength
    frame.png        gold ornamental border, drawn over everything, hollow centre
    cast.png         a vertical strip of characters for the side gutters
    hero.png         the big character that stands beside the child's name
```

Filenames are fixed — the theme id is the folder name, the four slot names are
the filenames. Adding another theme means adding a folder here and an entry in
`src/lib/themes.js`.

A single `background.png` can carry the whole decoration — characters, frame
and all — which is what an image generator returns when you ask it for one
poster. Once it loads, the other three slots stop drawing their placeholders,
so one file per theme is a complete set.

## Sizes and safe areas

| slot | canvas | notes |
| --- | --- | --- |
| `background.png` | 2480×1754 (A4 landscape @ 210 dpi) | opaque. The middle ~70% is covered by the white calendar panel — put the scenery in the **top-left corner** and along the edges, where it will actually be seen. |
| `frame.png` | 2480×1754 | transparent; the band may occupy only the outer ~7% on each side. The centre must be empty — it is drawn *over* the grid. |
| `cast.png` | 512×2048 (tall 1:4) | transparent. Used on the right gutter and **mirrored** on the left, so avoid text and asymmetric logos. Shown ~20–23 mm wide, full body height. |
| `hero.png` | 1024×1280 | transparent, bottom-aligned. Shown ~38–44 mm tall in the header band. |

The prompts that generate these are at the end of the project README.

## A note on characters

The prompts describe **original** characters. Don't prompt for a named
character from a TV show or film — that artwork is not yours to print, and
image generators will refuse or produce an off-model copy either way.
