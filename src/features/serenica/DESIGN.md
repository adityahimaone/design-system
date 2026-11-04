# Serenica — agent spec (Case 23)

**Surface:** Paper & ink · **Rail:** B (200px contents list) · **Hero:** C, relation `below` · **Physics:** 0px radius, 1px rules, no shadow at rest.
**Scope:** dual — daylight field (`:root`) and night field (`[data-sr='night']`) over shared primitives.
**Footer:** F3, frozen specimen — the same six ridges at seed 3, held still.

## Rules an agent must not break
1. One accent only: `--sr-marigold` appears on the primary action and nowhere else on the first screen.
2. No gradients except the footer scrim, drawn in the ground colour, and no shadow at rest. A printed sheet casts nothing.
3. No mono outside code, the rail number, tabular figures and the one data stamp on the field.
4. Petal cuts are the mark. Never outline the rosette in a thin stroke, never redraw it as eight ellipses.
5. Below 24px swap to `mark-compact.svg`; it is a separate drawing with four wide cuts.
6. The field is six ridges, back to front, from `sage` to `ground`. Fewer than six and it reads as a hill, not a range.
7. Failing pairs (see tokens.json) are graphic only. Never set type in `moss`, `sage`, `marigold` or `glow`.

## Tokens
Layer 1 `--sr-<material>` never flips. Layer 2 `--sr-bg-*`, `--sr-ink-*`, `--sr-line-*`, `--sr-accent` is the only scope that moves. Layer 3 `--sr-button-*`, `--sr-field-*`, `--sr-chip-*` is where a component learns its recipe.

## Cast
`ridge` `petal` `stem` `mist` `hour` `hold` — one cut line, one flat fill, one job each.
