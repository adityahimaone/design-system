# Gloaming — Case 25 · listed build

**3-Axis Synthesis:** Surface: *Optical glass* · Style: *#19 Liquid glass* · Rail: *A (176px per-section)* · Hero: *A · relation `below`* · Footer: *F1 · bench echo* · Physics: *22px squircle / 26px refraction / 1px mullions / 1px inset rim*.

**Mechanism:** A horizon cut through one pane of optical glass: above the cut the last light refracts, below it the land prints solid, and the cut itself is the 4-unit bar of the mark.

**DNA:** Archetype: *Blue-hour rangeland x optical instrument* · Mark: *horizon bar + two refracted hill panes + 6-cast* · Stack: *Gloock / Hanken Grotesk / Martian Mono* · Polarity: *Day + Night over shared primitives*.

**Essence.** The last light is a reading, not a mood.

**Promise.** Gloaming turns one hour of low light over a working meadow into a record a land steward can check: ridge, oak, lupine, herd, horizon. The pane refracts the sky; the plate holds the numbers.

## Why this surface

Q1 was an explicit named pick of #19 Liquid glass. The supplied plate is a photograph-like hazy gradient with a hard warm horizon, which is exactly the single ground #19 calls for. Mullion (22) already owns urban glass massing and Wildflower Wind (13) owns a frosted seed-house meadow, so this case takes the glass to a working landscape and keeps the accent apricot, not red or violet.

## One plate, nine derivatives

The entire material library comes from one supplied painting, `brand/gloaming/blue-hour-master.jpg · 1511x851 · one supplied painting`. `scripts/build-gloaming-plates.py` measures eleven horizontal strips, reduces the frame to fourteen dominant colours, samples 2436 violet pixels from the meadow, and derives:

- `blue-hour.jpg`
- `plate-horizon.jpg`
- `plate-ridge.jpg`
- `plate-oaks.jpg`
- `plate-meadow.jpg`
- `plate-meadow-detail.jpg`
- `plate-night.jpg`
- `field-lupine.svg`
- `horizon-ramp.svg`

`field-lupine.svg` is not a crop: it is 1,760 dots whose colour, radius and opacity are each sampled from the corresponding point of the meadow. `horizon-ramp.svg` is the eleven measured strips as one gradient. `plate-night.jpg` is the same frame graded forty minutes later, not a second photograph.

| Measured strip | Hex |
|---|---|
| zenith | `#3C527B` |
| sky high | `#465782` |
| sky mid | `#5B678F` |
| sky low | `#7A7796` |
| glow | `#8F8097` |
| warm band | `#A48796` |
| far ridge | `#75769C` |
| hills | `#6A635E` |
| herd line | `#A08571` |
| meadow | `#AC8A61` |
| foreground | `#5D513C` |

## The nine slots

- `ground` #2B3D69 → #D8A57C, ONE measured gradient, never stacked
- `plate` #F6F0E5 solid — every surface that carries type
- `text` #1B2030 near-black, on solid plates only
- `text2` ink at 72% on oat
- `rule` 1px oat at 26% on glass; 1px ink at 22% on plates
- `radius` 22px pane / 18px inner / 10px control (concentric, R_inner = R_outer − 4)
- `texture` one 26px refracting pane with 1px mullions and one lit top edge
- `type` Gloock display / Hanken Grotesk reading / Martian Mono figures
- `motion` 180ms cubic-bezier(.2,.7,.2,1), one physical response

## Scope

Q5 was **Light + dark**. Both scopes ship over the SAME twelve primitives: a day scope that keeps the warm apricot horizon, and a night scope that removes it. The printed oat plate does not change — a sheet of paper is still the same sheet after dark. The navbar toggle, the Night token sheet in Section 07 and the night audit rows are all present. The hero swaps `blue-hour.jpg` for `plate-night.jpg`.

## Hero and footer

Hero A, relation `below`: the full painting is a wide banner with a 1px mullion frame and one lit top edge. Five solid oat number cells overlap its bottom edge — adjacent, separated by 1px mullions, never by a gap — and the headline follows underneath. No eyebrow, no mono in the hero, no outlined chips, no styled accent word in the `<h1>`, one accent on the primary action only.

Footer F1 · bench echo: the night plate sits above a mirrored five-cell bench, and the reverse lockup closes it. The footer image is never the hero image.

## Mark and cast

A 4-unit horizon bar at y46-50 carrying two hill panes split by a 4-unit mullion at x29-33. The right crest sits 4 units higher than the left: that step is the refraction, and it is the one ownable cut carried into the wordmark.

The 16px compact is a separate, heavier drawing with an 8-unit channel; the glyph is a third drawing for favicons. The outlined wordmark is a 5×7 cell alphabet with zero `<text>` elements and two ownable cuts: a 7-unit horizon channel between rows 2 and 3, and a 2-unit lateral shift of everything above it — the refraction step, carried from the mark into the letters.

Cast nouns: `ridge`, `oak`, `lupine`, `herd`, `pane`, `horizon`. All on the 64-unit grid at one cut weight, drawn inside Section 02 under the scale strip, never above the footer.

## Honest contrast ledger

17 pairs computed from the same hex the CSS loads. 3 fail and are published rather than corrected:

- `oat` on `apricot` = 1.88:1 — Action fill only — never white type; the button uses ink on apricot at 7.60:1
- `lupine` on `oat` = 2.99:1 — Flower field / halftone dots / graphic only — never type
- `periwinkle` on `zenith` = 2.49:1 — Refracting pane fill and 1px mullion only — never type

The apricot accent is the one accent and appears on the primary action only. Oat on apricot is 1.88:1, so the button uses ink on apricot at 7.6:1. The pane tint periwinkle on zenith is 2.49:1, which is why a 1px mullion always separates it and type never sits on it.

## CVD safety gate

Deuteranopia and protanopia were simulated across 5 status/accent pairs with a Brettel/Viénot LMS transform and measured in Oklab. Minimum ΔE_OK = **0.056** against a threshold of 0.045: **PASS**. Tritanopia is not approximated — the common single-matrix shortcut clips to magenta and would report a false pass. Every status in the kit also ships a word and a shape, so no state is carried by colour alone.

## Dimensional anatomy

`anatomy-sheet.svg` is the monochrome S#/H#/R# redline: concentric radii with the closed chain `R_inner = R_outer − 4`, spacing `S_n = 8n`, heights `H_row = 48 + 8n`, and a four-plate exploded axonometric stack (photograph → refracting pane → mullion → solid reading plate).

## Audit & known gaps

- Browser frame measurements were skipped because **Skip browser tests** was selected. The 1440 / 1024 / 390 widths and `scrollWidth === clientWidth` were not checked in a headless browser; the contrast and CVD values above are computed statically from hex.
- **Export spec files** was not selected, so there is no separate export bundle. The page does ship `tokens.json`, `gloaming-tokens.css`, `DESIGN.md` and a generated Figma HTML sheet so the shelf link resolves.
- `backdrop-filter` is scoped to panes and nav chrome only. If the platform disables it, the 1px rim and the solid oat plates keep every reading surface legible.
- **Detach overlap (published, not corrected).** A detach check against eight sibling systems scores 91–75 for seven of them and 63/100 against Case 24 Setout: its hi-vis `#FF6B1A` and this plate's sampled apricot `#E2A38C` sit 2° apart in OKLCH hue. They differ in chroma (0.061 vs 0.113), in role (horizon light vs a safety vest) and in every material choice. The colour was kept because it was measured off the painting rather than chosen from a ramp; a hue-only heuristic cannot see that distinction.

## Registration

The page is a standalone static route at `/design-system/gloaming`. It is registered in `cases.ts` and `collections.ts` (Glass & light), appears on the landing shelf, the hero band and the Meniscus gallery, and ships generated 1200×900 / 560×420 thumbnails.
