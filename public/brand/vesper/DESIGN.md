# DESIGN.md — Vesper

> A two-ink print system for the evening. Cobalt and cream, one horizon, one star.
> This file is written for agents: every rule is stated as an instruction, and
> every number is the number in `features/vesper/tokens.json`.

- **Slug** `vesper` · **Namespace** `--vs-` · **Version** 1.0.0 · **Year** 2026
- **Archetype** minimal (5 + 1, one published failing pair per job)
- **Track** drawn (one subject, one cut line, one flat fill)
- **Source of truth** `features/vesper/tokens.json` → `vesper-tokens.css` → this file
- **Page** `design-system/vesper/index.html` (route `/design-system/vesper`)

## 1 · Non-negotiables

1. **Two inks.** Cobalt and cream, plus a pale blue second impression. Never a
   gradient, never a glow, never `backdrop-filter` on a surface.
2. **The horizon is a bar.** 4 units at the 64 grid. Never a stroke, never a
   border, never `1px`.
3. **The mark is never redrawn.** Geometry is fixed; a theme swaps the file
   (`mark.svg` ↔ `mark-reverse.svg`), never the drawing.
4. **Square plates.** `--vs-radius-none: 0` is the default. The only curve is the
   navigation pill.
5. **The failing pairs stay failing.** `stock on chalk` (1.32) and `dusk on chalk`
   (1.33) are surfaces and graphics. Do not nudge them until they pass.

## 2 · Colour

### Primitives — the material, named once

| Token | Value | Job |
| --- | --- | --- |
| `--vs-chalk` | `#f6efe1` | Unprinted stock. The page in daylight. |
| `--vs-plate` | `#fcf8ef` | A plate laid on the stock. Surfaces only. |
| `--vs-stock` | `#e6cfa8` | The cream ink itself. Fields, not text. |
| `--vs-dusk` | `#c9d2e4` | The pale blue second impression. |
| `--vs-cobalt` | `#1b3fa2` | The one accent. ≤ 10% of a viewport. |
| `--vs-night` | `#0a2a6b` | The sky at its deepest. Night-scope ground. |
| `--vs-lampblack` | `#0d1526` | The silhouette. All text on light. |
| `--vs-muted` | `#565d73` | The third voice. Captions, metadata. |

### Semantic — day

| Token | Value | Job |
| --- | --- | --- |
| `--vs-surface-page` | `var(--vs-chalk)` | The page |
| `--vs-surface-plate` | `var(--vs-plate)` | Cards, rows, forms |
| `--vs-surface-wash` | `var(--vs-stock)` | Quiet field behind a specimen |
| `--vs-surface-loud` | `var(--vs-cobalt)` | The one loud field. Two per page max |
| `--vs-text-primary` | `var(--vs-lampblack)` | Body and display |
| `--vs-text-secondary` | `var(--vs-muted)` | Captions |
| `--vs-text-accent` | `var(--vs-cobalt)` | One emphasis per view |
| `--vs-text-on-loud` | `var(--vs-chalk)` | Type on cobalt |
| `--vs-focus-ring` | `var(--vs-cobalt)` | 2px, 2px offset, never removed |

### Semantic — night (`html[data-vesper="night"]`)

Only the semantic layer moves. The primitives never change name or value.

| Token | Value |
| --- | --- |
| `--vs-surface-page` | `var(--vs-night)` |
| `--vs-surface-plate` | `#0e327a` |
| `--vs-surface-loud` | `var(--vs-stock)` |
| `--vs-text-primary` | `var(--vs-chalk)` |
| `--vs-text-secondary` | `var(--vs-dusk)` |
| `--vs-text-accent` | `var(--vs-stock)` |
| `--vs-focus-ring` | `var(--vs-stock)` |

### Computed contrast — 14 pairs, 3 published failures

| Pair | Ratio | Allowed job |
| --- | --- | --- |
| lampblack / chalk | 15.93 | text |
| lampblack / stock | 12.02 | text |
| chalk / night | 11.79 | text |
| stock / night | 8.90 | text |
| dusk / night | 8.88 | text |
| cobalt / plate | 8.69 | text |
| cobalt / chalk | 8.05 | text |
| chalk / cobalt | 8.05 | text |
| muted / plate | 6.17 | text |
| cobalt / stock | 6.08 | text |
| muted / chalk | 5.72 | text |
| **cobalt / night** | **1.46** | graphic only — never text |
| **dusk / chalk** | **1.33** | graphic only — never text |
| **stock / chalk** | **1.32** | surface only — never text |

## 3 · Type

| Role | Family | Size / leading / tracking | Weight |
| --- | --- | --- | --- |
| `display-1` | Fraunces | 108 / 0.92 / −0.035em | 300 |
| `display-2` | Fraunces | 66 / 0.98 / −0.03em | 300 |
| `display-3` | Fraunces | 42 / 1.06 / −0.022em | 400 |
| `title-1` | Archivo | 27 / 1.18 / −0.018em | 600 |
| `title-2` | Archivo | 20 / 1.3 / −0.012em | 600 |
| `body-1` | Archivo | 18 / 1.62 / −0.003em | 400 |
| `body-2` | Archivo | 16 / 1.6 / 0 | 400 |
| `caption` | Archivo | 13.5 / 1.45 / 0.002em | 400 |
| `label` | Archivo | 11.5 / 1.2 / 0.16em | 600, uppercase |
| `mono` | DM Mono | 12.5 / 1.5 / 0.02em | 400 |
| `figure` | Archivo | 54 / 1 / −0.03em | 500, tabular |

Rules:

- Reading copy stops at **66ch**. Labels always sit **above** what they name.
- Display type may carry the **register ghost**: `text-shadow: 2.2px 2.2px 0
  var(--vs-stock)`. Below 40px it reads as a mistake — do not use it.
- The wordmark is **outlined**, never live text. It is Fraunces 400 / opsz 144 /
  SOFT 30, cap height 26 units, tracking 0.012em.

## 4 · Space, radius, motion

- Space: `4 8 12 16 24 32 48 64 96 128 160`
- Radius: `none 0` · `hair 2` · `chip 4` · `pill 999`. Nothing else.
- Motion: `strike 90ms cubic-bezier(.2,0,0,1)` for anything the user caused;
  `settle 520ms cubic-bezier(.22,.61,.24,1)` for a plate arriving;
  `impress 1100ms` for the field. All collapse to 1ms under
  `prefers-reduced-motion`.

## 5 · Components

- **Button** 47px tall; label left, a 46px arrow tile right, divided by
  `rgb(246 239 225 / .28)`. Hover darkens to `--vs-night`. Ghost variant: 1px
  `--vs-line-strong`, cobalt arrow tile.
- **Chip** 34px, 1px `--vs-line-strong`, mono 10.5px uppercase 0.1em, optional
  7px cobalt square. No fill except the "shipped" state (cobalt + chalk).
- **Input** 46px, `--vs-input-bg` plate, 1px border, focus = 1px cobalt + 2px
  ring. Invalid = cobalt border + 3px inset left bar. **An error always appears
  twice**: in the summary and on the field.
- **Row** grid `1fr auto auto`, 12px block padding, `--vs-table-rule` divider,
  4px more padding above than below. The number never sits on the rule.

## 6 · Files

```
features/vesper/tokens.json              the source
features/vesper/vesper-tokens.css        generated: primitives, semantic, component
public/brand/vesper/mark.svg             the mark, ink
public/brand/vesper/mark-reverse.svg     the mark, cream
public/brand/vesper/mark-compact.svg     16–24px drawing
public/brand/vesper/glyph.svg            star alone, 16px inline
public/brand/vesper/wordmark.svg         outlined VESPER
public/brand/vesper/lockup*.svg          horizontal and stacked
public/brand/vesper/icon.svg             app icon, cobalt tile
public/brand/vesper/cast/*.svg           six companion marks
public/brand/vesper/field/stipple.png    the hero field, 1600 × 900
public/brand/vesper/field/dither.png     the section divider, 1600 × 140
public/brand/vesper/bakeoff/sheet.html   the ten that lost, with measured scores
public/brand/vesper/bakeoff/scores.json  the scorer's output, 11 concepts × 8 checks
```

## 7 · Do not

- Do not add a third ink. If a state needs a colour, it is `--vs-cobalt`.
- Do not put type on `--vs-stock` below 16px (1.32 against chalk is a surface,
  not a ground for text — on stock, text must be `lampblack` at 12.02).
- Do not round a card. Do not add a shadow. Do not blur a surface.
- Do not scale the primary mark below 24px — switch to `mark-compact.svg`.
- Do not use the cast marks as logos.
