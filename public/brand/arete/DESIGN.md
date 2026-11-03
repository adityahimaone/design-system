# Arête — Design System (Case 18)

**Alpine cartography · every layer is a cut.** Guided ridge traverses and hand-cut
topographic editions, made from two papers: ivory cartridge stock and ultramarine ink.

## 3-Axis Synthesis

| Axis | Position |
| --- | --- |
| Surface | Tactile cut-paper — flat ivory stock, 2u seams, hard 4px sheet shadows. No gradients inside a layer; one vellum overlay where type crosses artwork. |
| Density | Editorial cartography. 96px section rhythm, 66ch measure, route ledgers with tabular elevation data. |
| Physics | Knife-cut — 0px outer / 2px inner radii, 2px rules, hard shadow offsets instead of blur. |

## The mark

A floating ridge ribbon (10u thick) above a grounded mass, parted by one 5u seam, on
a 64-unit sheet. The 5u gap is the only detail: it is the width of the knife, and it
is the same value used for card seams and the type baseline offset.

- `mark.svg` — 64-unit master, ultramarine ink baked in.
- `mark-compact.svg` — **a separate drawing**, not a scaled master. Below 24px the
  two layers merge into one filled massif and the 5u seam becomes a single 4u cut, so
  it survives anti-aliasing at 16×16.
- `wordmark.svg` — outlined Bodoni Moda 500 paths, +0.18em tracking, ink baked in.

## Companion cast

`sommet` (summit) · `boussole` (compass) · `courbe` (contour) · `meleze` (larch) ·
`refuge` (hut) · `cairn` (cairn). All six are fill-only, 6u cut weight, on the same
64-unit grid.

## Surfaces — the paper recipe

1. **Cut sheet** — flat stock, 2u seams, no shadow. Base layer for long reading. The supplied
   collage is the field: ivory stock, white peaks, a grey layer, a black layer and one cobalt seam.
2. **Lifted layer** — 4px hard offset shadow, zero blur. Reads as one sheet above another.
3. **Vellum overlay** — 88% ivory tint, 18px fiber blur, deckle hairline. Type over artwork.
4. **Deckle edge** — one generated rough edge per composition; dividers and closing poster.

## Type

- **Display** — Bodoni Moda 400/500. Hairline serifs that read as knife cuts.
- **UI** — Instrument Sans 400/500. Precise, slightly narrow, never shouty.
- **Mono** — IBM Plex Mono 400/500. Coordinates, elevations, permit references.

## Contrast ledger — 14 pairs, 3 published failures

- `--ar-indigo` on `--ar-paper` — **15.8:1** PASS (AAA (>= 7:1)) — Display headlines, body copy and the mark on stock
- `--ar-indigo` on `--ar-vellum` — **14.3:1** PASS (AAA (>= 7:1)) — Reading copy on the vellum plate
- `--ar-graphite` on `--ar-paper` — **7.1:1** PASS (AAA (>= 7:1)) — Secondary copy, captions and route metadata
- `--ar-ultramarine` on `--ar-paper` — **8.9:1** PASS (AAA (>= 7:1)) — Inline links, eyebrows and accent numerals
- `--ar-ultramarine` on `--ar-vellum` — **8:1** PASS (AA (>= 4.5:1)) — Accent labels on the vellum plate
- `--ar-ridge` on `--ar-paper` — **6.7:1** PASS (AA (>= 4.5:1)) — Secondary accent and status ink on stock
- `--ar-indigo` on `--ar-chalk` — **17.3:1** PASS (AAA (>= 7:1)) — Body copy on the top sheet
- `--ar-paper` on `--ar-ultramarine` — **8.9:1** PASS (AAA (>= 7:1)) — Reverse lockup and the ultramarine plate
- `--ar-paper` on `--ar-indigo` — **15.8:1** PASS (AAA (>= 7:1)) — Poster display type on the night ground
- `--ar-mist` on `--ar-indigo` — **12:1** PASS (AAA (>= 7:1)) — Reverse metadata and coordinates
- `--ar-glacier` on `--ar-dusk` — **6.1:1** PASS (AA (>= 4.5:1)) — Night-scope status ink and ridge labels
- `--ar-oxide` on `--ar-paper` — **4.2:1** **FAIL** (AA (>= 4.5:1)) — Trail blaze rules and survey marks
- `--ar-glacier` on `--ar-paper` — **2.2:1** **FAIL** (GRAPHIC (>= 3:1)) — Graphic only — far ridge fills and elevation bands
- `--ar-mist` on `--ar-paper` — **1.3:1** **FAIL** (GRAPHIC (>= 3:1)) — Graphic only — paper wash and disabled fills

Glacier (2.2:1) and mist (1.3:1) are the
far-ridge tones; darkening either until it passed would turn the paper to mud. Oxide
(4.2:1) is a survey blaze, not a label. All three are restricted to
fills, rules and graphic marks, and are never set as text.

## Laws

1. **One knife width.** The 5u seam is the only decorative measure in the system:
   card gaps, mark aperture, and baseline offset all quote it.
2. **No blur inside a layer.** Paper has an edge. Shadows are hard offsets; the only
   blur belongs to the vellum overlay that sits above the artwork.
3. **Field + vellum.** Body copy never sits raw on the collage. It sits on a solid
   stock plate or an 88% vellum sheet with an 18px fiber blur.
4. **Hero, stage and footer are one range.** The supplied collage opens the page, its
   valley carries the surface stage, and the same valley closes as a printed poster.
