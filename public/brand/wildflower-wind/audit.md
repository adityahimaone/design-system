# Wildflower Wind — design system audit

What is proved, by which command, and what is not. Every number below was produced
by a script in this folder; none was typed by hand.

The system is v2.0: **glass**, not paper. The idea survived the change — a meadow is
not arranged, it is scattered — but the material did not. A pane laid over the field
replaced two-pass riso on uncoated stock, and the accent moved from the photograph's
pink to the violet the glass refracts it into.

```bash
node scripts/build-tokens.mjs     # 15 pairs recomputed, 2 published as failing
node scripts/mark.mjs             # 15 SVGs + the drift, from the placement table
node scripts/build-specimen.mjs   # index.html, built from the app's own module CSS
node scripts/figma-export.mjs     # plugin, tokens.figma.json, manifest
node scripts/qa.mjs               # 17 browser checks, 1440 / 390 / dusk / reduced motion
```

## The gates

| Gate | Result | Evidence |
| --- | --- | --- |
| **Detach** | **82 / 100**, weakest against Huginn (min 70, 2 compared) | `gates.mjs --refs refs/` |
| **Display face** | Pass — Instrument Serif differs from every compared system | `gates.mjs` |
| **Palette is one source** | Pass — 9 primitives in `tokens.json` match `wildflower-wind-tokens.css` at the same value | `gates.mjs` |
| **Font registered** | Pass — `--font-display`, `--font-reading`, `--font-mono` declared in the layout | `gates.mjs` |
| **Contrast** | Pass — 15 pairs recomputed from hex, all stated ratios match, 2 failing pairs published | `gates.mjs` |
| **Assets licensed** | Skip — the three plates were supplied with the brief and carry no licence record | `gates.mjs` |
| **Export builds** | Pass — `figma-smoke` exit 0: 10 pages, 43 variables, 11 text styles | `figma-smoke.mjs design/figma/wildflower-wind/code.js` |
| **Mark at 16px** | Pass — the compact differs on 33% of pixels at 16px; four placements, not five | `qa.mjs` |
| **Reduced motion** | Pass — surfaces still to `1e-06s` | `qa.mjs` |

## Contrast, as computed

| Pair | Ratio | Job |
| --- | --- | --- |
| ink on the pane | 15.09:1 | text and icons |
| ink on haze | 12.48:1 | text and icons |
| muted on the pane | 5.75:1 | text and icons |
| muted on haze | 4.76:1 | text and icons |
| signal on the pane | 6.93:1 | text and icons |
| signal on haze | 5.73:1 | text and icons |
| glass on signal | 6.93:1 | button label |
| ink on petal | 11.97:1 | text on the tinted pane |
| haze on ink | 12.48:1 | type on the night field |
| leaf on haze | 4.68:1 | text and icons |
| **gold on haze** | **2.19:1** | **shape only — never text** |
| **sky on haze** | **1.47:1** | **surface only — never text** |
| ink on haze, dusk | 16.23:1 | text and icons |
| muted on the pane, dusk | 6.89:1 | text and icons |
| signal on haze, dusk | 7.67:1 | text and icons |

Two failures are published because a palette that only publishes its passes is a
brochure. Neither is nudged: gold and sky are assigned the job they can do.

## What the re-concept changed, and what it did not

**Kept.** The belief, the enemy, the rejection test, the placement table, the mark's
five petals and the 134° gap, the type trio, the mono label voice.

**Changed.** The material (glass, not stock), the ground (`haze` #e7e3ee, not paper
#f7f0e4), the accent (`signal` #8f2a90 — the cosmos refracted — not the photograph's
pink), every radius (6 / 12 / 20 / 28 / 40, nested), the surface treatment (a
translucent pane with one lit edge and a long shadow), and the mark's construction:
petals are now translucent lenses whose crossings multiply, so the flower has no
outline and no ink of its own.

**Why the accent moved twice.** The first version used the photograph's own cosmos
pink, `#b42a5e`. Detach scored it 64/100 against Jakarta — 2° from its *Doger* ramp.
It became plum `#7c2a76` (29° away). In glass it moved again, to violet `#8f2a90`,
because a translucent magenta over a warm field reads as dried blood, and because
the pane is a lens: what you see through glass is refracted, and refraction is what
turns that pink violet. The violet sits 32° from Jakarta and holds 5.73:1 on haze.

## What the page proves

Six jobs, in the order this case needed them:

1. **Premise** — belief, enemy, material, a rejection test, and four decisions as
   *Decision / Because / Not when / Breaks next*.
2. **Calyx** — primary, compact, glyph, one-ink, reverse; the placement table the
   family is generated from; the fill column now reads `glass` or `signal`.
3. **Light** — nine swatches, every pair computed with its allowed job, the two
   failures named.
4. **Setting** — the display face at 108px with tracking stated, a 64ch reading
   paragraph with leading stated, and a live type scale rendered from the tokens.
5. **Season** — a tin, a card, a tag and a plate, all built from panes and tokens.
6. **Ledger** — *Proved*, *Not verified*, *Known gaps*.

## Not verified

- **Backdrop blur parity.** `backdrop-filter` is GPU- and browser-dependent. The pane
  is designed to hold at 0% blur — it carries a solid fallback tint — but that fallback
  has not been measured on a machine without compositing.
- **The meadow photograph.** Supplied for this system, no licence record.
- **Print.** A translucent mark on coated stock is a different problem from a
  translucent mark on a screen, and nothing here has been proofed.
- **Figma parity.** The plugin carries variables, paint styles and text styles. It does
  not carry `mix-blend-mode`, so the exported mark is a flat approximation of the glass.
- **The route is a port, not the specimen.** `/design-system/wildflower-wind` is a React
  page in the app; `index.html` is generated from the same module CSS and the same
  tokens. They share every colour, radius and ratio — the risk is a *word*, not a value.

## Known gaps

- **gold on haze, 2.19:1** — graphic only. It may never carry a label, including a
  tin's variety name.
- **sky on haze, 1.47:1** — surface only. Never a rule, never an icon that must be read.
- **The cast has four members.** A fifth — a petal that cracks — was drawn and dropped:
  at 24px it read as damage, not as glass.
- **The one-ink mark is a compromise.** With no blend modes the crossings have to be
  cut out by hand, so `mark-mono.svg` is a different drawing again.
- **No dark-mode photograph.** The closing plate is not re-graded at dusk; it is the
  same file under a heavier scrim.
