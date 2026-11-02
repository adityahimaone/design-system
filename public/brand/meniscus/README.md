# Meniscus brand assets

Everything here is generated from `src/features/meniscus/tokens.json`. Do not hand-edit a colour.

## Inks

Every mark ships twice, because a mark baked to one colour cannot follow a scope swap:

| File | Ink | For |
| --- | --- | --- |
| `*.svg` | `#f3f2ef` + `#ffa768` | the smoked scope |
| `*-reverse.svg` | `#12151a` + `#8f4f12` | the board scope |

`src/features/meniscus/Ink.astro` renders both and CSS picks one, so switching scope never needs a
re-render or a second request. Never use a bare `<img src="mark.svg">` on a page that can go board.

## The family

- `mark.svg` / `mark-reverse.svg` — primary, 64 grid, 44 × 44 tile, 6 radius
- `mark-compact.svg` / `-reverse` — separate drawing for under 32px; the scoop drops 2 units
- `glyph.svg` / `-reverse` — the scoop alone, for favicons and avatar crops
- `icon.svg` — app icon, tile on a rounded plate
- `wordmark.svg` / `-reverse` — Bricolage Grotesque 800 at −0.03em, outlined to paths
- `lockup.svg` / `-reverse` — horizontal, cap height aligned
- `lockup-stacked.svg` / `-reverse` — stacked, for square and narrow placements

The wordmark is cut with `extract-wordmark.py` from the font file and baked to paths with the ink
filled in. Re-cut it; never re-type it. A `currentColor` wordmark resolves to black inside an
`<img>` and will disappear on the smoked ground.

## Plates

`plates/plate-1…4.svg` are the caustic plates that alternate with the case covers in the hero band:
a caustic arc, a dispersion fan, a ripple field, and a specular sweep. Each is a smoked pane with
edge hairlines and one light event, drawn to read at ~200px wide.

## Field

`field-glass.svg` is the atmospheric field behind the proof hero — graphite, a 3.5% pane grid, and
one amber caustic low-right. It is masked away before it can meet a paragraph, and it is not painted
at all in the board scope.
