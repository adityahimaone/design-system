# Quieta — Design System (Case 17)

**Quiet residences · Detail image beside content.** Warm stone homes, sculptural
interiors and soft garden light, for a property brand that sells and lets houses
by letting people look at them closely.

## 3-Axis Synthesis

| Axis | Position |
| --- | --- |
| Surface | Tactile warm stone — lime plaster, honed travertine, matte throughout. No glass except one deliberate reading plate. |
| Density | Gallery airy. 104px section rhythm, 66ch measure, wide leading. |
| Physics | Precision organic — 10px inner / 18px outer concentric radii, 1px stone hairlines, one 5-unit shadow gap. |

## The mark

A house in elevation, cut down to three moves: a 54 × 8u roof slab cantilevered
past both walls, floating 5u above a 44 × 35u wall mass, with a 12 × 25u threshold
notch cut through the wall to the ground line. The 5u gap is the shadow reveal that
a real roof leaves over a wall. Nothing else — no window, no door handle, no roof pitch.

- `mark.svg` — 64-unit master, 8u clearspace on all sides.
- `mark-compact.svg` — **a separate drawing**, not a scaled master. Below 24px the
  shadow gap closes (roof and wall become one silhouette), the roof thickens to 12u
  and the notch widens to 16u, because a 5u gap resolves to 1.25px at 16×16 and greys
  into a smudge.
- `wordmark.svg` — outlined Newsreader paths, +0.17em tracking, ink baked in.

## Companion cast

`olivo` (olive canopy) · `finestra` (window aperture) · `scala` (sculptural stair) ·
`anfora` (terracotta urn) · `sole` (garden light) · `piscina` (reflected water).
All six are fill-only, 6u cut weight, on the same 64-unit grid.

## Type

- **Display** — Newsreader 400/500. Optical-size serif; the house voice.
- **UI** — Schibsted Grotesk 400/500. Precise, slightly wide, never shouty.
- **Mono** — DM Mono 300/400/500. Plans, prices, plot numbers, tabular.

## Contrast ledger — 15 pairs, 3 published failures

- `--qa-ink` on `--qa-chalk` — **14.6:1** PASS (AAA (>= 7:1)) — Display headlines, body copy and the mark fill
- `--qa-ink` on `--qa-limestone` — **12.6:1** PASS (AAA (>= 7:1)) — Card body copy on honed travertine plates
- `--qa-ink` on `--qa-travertine` — **10:1** PASS (AAA (>= 7:1)) — Reading copy on stone band surfaces
- `--qa-umber` on `--qa-chalk` — **5.7:1** PASS (AA (>= 4.5:1)) — Secondary labels, captions and metadata
- `--qa-umber` on `--qa-limestone` — **4.9:1** PASS (AA (>= 4.5:1)) — Metadata inside surface cards
- `--qa-clay` on `--qa-chalk` — **5.4:1** PASS (AA (>= 4.5:1)) — Inline links, eyebrow labels and accent numerals
- `--qa-clay` on `--qa-limestone` — **4.6:1** PASS (AA (>= 4.5:1)) — Accent labels on surface plates
- `--qa-olive` on `--qa-chalk` — **5.2:1** PASS (AA (>= 4.5:1)) — Available-status ink and garden metadata
- `--qa-chalk` on `--qa-ink` — **14.6:1** PASS (AAA (>= 7:1)) — Reverse lockup and poster display type
- `--qa-chalk` on `--qa-dusk` — **12.6:1** PASS (AAA (>= 7:1)) — Night-scope body copy and footer pane
- `--qa-travertine` on `--qa-ink` — **10:1** PASS (AA (>= 4.5:1)) — Reverse secondary labels on dark plates
- `--qa-ink` on `--qa-gold` — **6.6:1** PASS (AA (>= 4.5:1)) — Ink on garden-light chips and price flags
- `--qa-gold` on `--qa-chalk` — **2.2:1** **FAIL** (GRAPHIC (>= 3:1)) — Graphic only — light pools, hairline glows, chart fills
- `--qa-sage` on `--qa-chalk` — **1.9:1** **FAIL** (GRAPHIC (>= 3:1)) — Graphic only — foliage tints and map hatching
- `--qa-oak` on `--qa-chalk` — **2.7:1** **FAIL** (GRAPHIC (>= 3:1)) — Graphic only — wood swatches and floor-plan fills

The three failures are brand colours kept at brand strength. Gold at 2.2:1 on chalk is
garden light; darkening it to pass turns it into mud. It is restricted to fills,
light pools and chart marks, and is never set as text.

## Laws

1. **Detail image beside content.** Every claim about a house is made twice: once in
   a 66ch column, once in an adjacent photograph. Never stacked, never a hero-only
   decoration.
2. **Field + plate.** Body copy never sits raw on a photograph. It sits on a solid or
   91%-tinted, 22px-blurred reading plate.
3. **The shadow gap is the only detail.** One 5u reveal between roof and wall in the
   mark, one 1px hairline in the interface. No second decorative motif.
4. **Hero, stage and footer are one material.** The threshold elevation opens the page,
   the hillside vista carries the refraction stage, the travertine stair closes it.
