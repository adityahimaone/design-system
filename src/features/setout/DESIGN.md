# Setout — Case 24 · test build

**3-Axis Synthesis:** Surface: Blueprint grid · Style: `#4 Blueprint grid` · Rail: A (176px per-section) · Hero: the drawing sheet (grid 24, major 120) · Footer: F2 · Physics: 0px radius, 1px rules, 24px grid, 160ms linear.

**Essence.** The drawing becomes a line on the ground.

**Promise.** Setout turns a construction drawing into measured points, grids and levels on a live site, so the building starts from a datum everyone can check rather than from a render nobody can.

## The nine slots

- `ground` `#071E46` deep blueprint blue
- `plate` `#0D2C5C` one step lighter, derived from the ground
- `text` `#F4F7FF` paper white
- `text2` chalk at 72% on the blue ground
- `rule` 1px white at 22%
- `radius` 0px, one value everywhere
- `texture` a 24px white SVG grid, never a CSS gradient
- `type` Space Grotesk display / Archivo reading / IBM Plex Mono figures
- `motion` 160ms linear, one physical response

## Scope

Q5 was **Light only / one scope**. A blueprint is a daylight document; a dark one is a different product. The deep blue is the paper. There is no theme toggle, no night token block, no second token sheet and no second set of audit rows.

## Hero and footer

Hero E, relation `on`, recipe R8: plate 01 (`plate-scaffold.jpg`) bleeds to the viewport edge at `object-position 68% 56%`, one 90° blueprint scrim runs .97 → .06 left to right with a short bottom fall for the stamp rule, and the page's own 24px / 120px grid is printed over the photograph at 70% opacity. Type sits on the scrim at 78% measure; no panel, no card, no eyebrow.

Section 01 closes with plate 02 (`hero-roof-setout.jpg`) in `.so-plate`, a `clamp(240px, 34vw, 420px)` band at `object-position 50% 30%` under a 1px rule, captioned in mono. The photographs are matched to their clauses: the lattice is the grid made physical, the nailing is the check.

Footer F2: the blueprint photograph sits on the left in a 38/62 split, the statement on the right, with a top scrim and a 26px reverse lockup at the upper-right of the plate. Cases 21 and 22 used bottom/left lockups and bottom scrims; this variation does not repeat them. The footer image is never the hero image.

## Mark and cast

Two offset blocks on a 64-unit grid: a 22×26 mass at x8/y10 and a 22×28 mass at x36/y28, with a 6-unit channel between them. Fill only. The 16px compact and glyph are separate, heavier drawings.

Cast nouns: `datum`, `grid`, `level`, `formwork`, `pin`, `survey`. All share the same cut weight and sit inside Section 02, not at the end of the page.

## Honest contrast ledger

13 pairs computed from the same hex the CSS loads. 3 fail and are published rather than corrected:

- `chalk` on `hivis` = 2.66:1 — Wash / fill / graphic only — never type
- `signal` on `blueprint` = 3.63:1 — Grid / dimension tick only — never body text
- `plate` on `blueprint` = 1.19:1 — Plate separation only — never type; rules carry it

The hi-vis orange is the one accent and appears on the primary action only. `chalk on hivis` cannot carry type, so the button uses `ink on hivis` at 6.38:1.

## Assets

- `hero-roof-setout.jpg` — worker kneeling on a green roof deck, blue hard hat, hammer and nail — now the section 01 field band, not the hero

The top bar carries `lockup-reverse.svg` at 32px tall (mark 28, letters 16.8): the bar uses the drawn lockup, never a mark beside typeset text.
- `plate-blueprint.jpg` — worker holding a printed plan against pink insulation
- `plate-scaffold.jpg` — worker under a lattice of steel scaffolding

The page is a standalone static route at `/design-system/setout`. Because "List it on the site" was not selected, `cases.ts`, `collections.ts`, the landing shelf and the thumbnails are untouched. Because "Export spec files" was not selected, no separate export bundle is produced; the core `DESIGN.md`, `tokens.json` and `setout-tokens.css` above are the feature files the page needs.
