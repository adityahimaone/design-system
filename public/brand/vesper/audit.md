# Vesper — design system audit

Run `node vesper/scripts/audit.mjs` to reproduce everything in §1. This file
records what that command printed, what it cannot see, and what is deliberately
unfinished.

**Verdict** six static gates pass; the gates in the method that were not run are
named in §4 rather than implied to be green. The bake-off was scored after the
first draft of this file was written — §1a is the result, and it does not put the
shipped mark first. The Next.js route was built after this file's second draft;
§7 says where it lives and what was checked.

---

## 1 · What the gates prove

Output of `node vesper/scripts/audit.mjs`, 2 November 2026:

```
PASS  contrast  14 pairs recomputed, all match, 3 failing pair(s) published
PASS  palette   8 primitives declared once, at the same value
PASS  fonts     3 families (Fraunces, Archivo, DM Mono), all local, all declared
PASS  marks     26 SVGs, all outlines, no live text, no NaN
PASS  bakeoff   11 concepts scored, shipped mark ranks 4 of 11, its 1 failure(s) published
PASS  page      1440 and 390: 0px overflow, all faces loaded, no console errors
```

### contrast

Fourteen pairs, every ratio recomputed from the hex values in `tokens.json` and
compared against the stated figure to within 0.1. Three pairs fail and are
published with the job they may therefore not do:

| Pair | Ratio | Job it may not do |
| --- | --- | --- |
| cobalt on night | 1.46 | text — graphic only |
| dusk on chalk | 1.33 | text — graphic only |
| stock on chalk | 1.32 | text — surface only |

None of the three was nudged. A palette that only publishes its passes is a
brochure.

### palette

All eight primitives appear in `features/vesper/vesper-tokens.css` at the exact
value in `tokens.json`. The night scope overrides the semantic layer only, so a
theme flip cannot drift a primitive.

### fonts

`--vs-font-display`, `--vs-font-reading` and `--vs-font-mono` each name a family
that is declared as `@font-face` in the page and served from
`vesper/assets/fonts/`. No `@font-face` points at a network URL, so the page
renders identically offline. The gate checks only the first family in each stack:
the rest (`Iowan Old Style`, `Helvetica Neue`, `ui-monospace`) are host fallbacks,
not promises.

### marks

26 SVGs across the family and the cast. None contains `<text>`, a `NaN` in path
data, or an embedded raster. This gate exists because the first wordmark build
did contain `NaN` — opentype.js produced it from the instanced TTF, and a browser
silently drops the rest of a path at the first `NaN`. The page rendered "VES" and
stopped. `outline-wordmark.py` replaced it, and the gate now fails on the
character.

### page

At 1440 × 1000 and 390 × 844: zero horizontal overflow, every font face reported
`loaded`, no console error, no failed request.

### bakeoff

The gate re-reads `scores.json`, counts the concepts, and refuses the table if
the shipped mark is missing, if it scored a clean 100, or if its rank and its
first failure are not printed on the page. A scorer that only ever printed its
own winner would be decoration.

---

## 1a · The bake-off, scored

The first draft of this file said the scorer could not run because
`score-mark.py` needs `cairosvg` and `Pillow`, and neither is installed. That was
true of Python and not of the machine: `score-bakeoff.mjs` rasterises each SVG
into a canvas in Chrome and reads the pixels back, so the dependency is gone.

Every concept is rendered at 128, 40 and 16 and measured on eight pass-or-fail
checks — no weights, no model, no judgement calls in the arithmetic:

| Check | Threshold | Why |
| --- | --- | --- |
| holds at 16 | ink 8–32% of the canvas | below it the mark greys out at favicon size; above it the counters close |
| one piece | ≤ 3 connected components at 16 | six specks are six specks that will merge or vanish |
| keeps its ink | coverage@16 ÷ coverage@40 ≥ 0.75 | aliasing drops thin features first; this is the direct test of surviving a downscale |
| nothing merges | parts@128 − parts@16 ≤ 1 | separate elements collapsing into one is the other way a drawing dies at size |
| balanced | centroid within 6% of centre | |
| fills its grid | ink box ≥ 70% of the canvas | a mark using a third of its grid looks small beside its siblings |
| few parts | ≤ 3 subpaths | |
| distinct | max IoU ≤ 0.62, ancestors excluded | two concepts that overlap that much are one concept drawn twice |

```
  rank  concept         score  cover@16  parts  retain  merge  balance  IoU
  1     Horn            100    13.3%     1      100%    0      4.5%     0.33
  1     Post            100    18.8%     1      100%    0      3.1%     0.55
  3     Horizon         88     25.8%     2      100%    0      2.0%     0.44
  4     Horizon Star    88     15.6%     2      120%    -1     8.4%     0.39   ← shipped
  5     Lodestar        88     12.9%     2      105%    -1     1.4%     0.68
  6     Moonline        88     25.4%     2      110%    -1     10.4%    0.26
  7     Way             88     21.1%     1      113%    1      5.9%     0.41
  8     Halo            75     16.0%     7      124%    0      8.3%     0.36
  9     Rung            75     16.4%     1      107%    0      7.3%     0.55
  10    Lantern         63     17.2%     2      106%    0      6.3%     0.44
  11    Ray             63     18.4%     4      114%    -3     8.1%     0.42
```

**The shipped mark ranks 4 of 11, not 1.** Two concepts survive downscaling
better, and both lost the bake-off on a criterion that is not in the table:

- **Horn** and **Post** are clean at every size. Post is one primitive — a column
  with the light cut out of it — and it is the most robust drawing in the set. It
  lost because the notches read as a door or a keyhole until you are told what
  they are. The scorer can measure whether a shape holds at 16px; it cannot
  measure whether the shape says *lamp*.
- **Horizon Star** fails one check: its mass sits 8.4% below centre. Its ink box
  is centred on the grid exactly (x 9–55, y 8–56), so it seats correctly in a
  square slot, and the weight is low because the horizon is at the bottom of the
  drawing — which is the idea. The flag is published rather than waived, and the
  geometry was not changed to clear it.

Two things were changed in the scorer rather than in the mark. Both changes were
made *after* the first run put the shipped mark 9th, which is exactly the
situation in which a threshold gets moved to flatter a winner, so the reasoning
is set out in full:

1. The first version gated on **stroke** — how many 1px erosions the ink survives.
   A 4-unit rule on a 64 grid is 1px at 16px and can never contain a 3 × 3 solid
   block, so every fine cut-line mark scored 0 by arithmetic, not by defect. The
   number was measuring boldness, and boldness is not what the brief asked for.
   The gate was replaced with **retention** and **collapse**, which measure the
   thing the gate claimed to measure — whether ink is lost or merged between 40
   and 16. Stroke is still printed, and gates nothing.
2. Distinctness compared every concept against every other, including
   **Lodestar** — the round-one concept Horizon Star is a revision of. A mark's
   overlap with the version it replaced is a diff, not a duplicate. Round-two
   ancestors are now declared in `ANCESTORS` and skipped.

The test of whether that was tuning or repair: the repair has an argument
independent of the outcome (the arithmetic above), and after it the mark still
does not win. It moved from 9th to 4th and kept its one real failure. If the
changes had been tuning, the next move would have been to soften the balance
threshold too — that was not done, and the flag stays red.

---

## 2 · What was checked by eye, and how

| Check | Method | Result |
| --- | --- | --- |
| Mark at 16px | Rendered `mark-compact.svg` at 16/24/32/48/96 next to `glyph.svg` and read them at 1× | The compact holds: the bar stays 5 units, the star 38 wide. The primary at 16 loses the bar into the star. |
| Reduced motion | Chromium with `reducedMotion: 'reduce'`; headline opacity measured | `1` — the still frame is the design. The field is a still image in every mode. |
| Night scope | Toggled `data-vesper="night"` and read the mark, colour, type and kit sections | Two defects found and fixed: the "reverse" logo tile collapsed into the page, and a decision card still claimed the mark "never changes when the theme does" — the implementation swaps files, so the claim was rewritten to "never redrawn, only re-inked". |
| Mobile 390 | Full-page capture sliced into 12 frames | Three defects found and fixed: the usage-rules grid stayed 3-up and squeezed to ~70px columns; the swatch list ran 8 × 200px; the type scale capped at 9vw so `display-1` rendered at 35px. |

---

## 3 · Measured artefacts

| Artefact | Size | Note |
| --- | --- | --- |
| `design-system/vesper/index.html` | 105 KB | one file, no build step, no network request |
| `public/brand/vesper/field/stipple.png` | 883 KB | 1600 × 900, generated from seed `0x5eed1e` |
| `public/brand/vesper/field/dither.png` | 1.4 KB | 1600 × 140, 4 × 4 Bayer |
| brand SVGs | 26 files | 64-unit grid, fill-only, no `<text>` |
| `public/brand/vesper/bakeoff/scores.json` | 4 KB | 11 concepts × 8 checks, machine-readable |
| `brand/vesper-board.png` | 3000 × 2250 | the board at 2× |
| fonts | 5 woff2 + 2 ttf | 246 KB total, all SIL OFL 1.1 |

---

## 4 · Not verified, and why

| Gate | Status | Reason |
| --- | --- | --- |
| **Detach** against sibling cases | Not run | The method's `detach-check.mjs` scores OKLCH separation against `features/*` siblings. Vesper lives in `vesper/features/vesper/`, outside the script's default root, and was not run through it. The argument for separation — a display face (Fraunces) and a material (two-ink stipple) that no sibling uses — is an argument, not a score. |
| **Figma export** | Not built | `figma-forge.mjs` was not run. Nothing was exported, so nothing is claimed. The tokens are in the shape the emitter expects. |
| **Browser QA sweep** | Partial | Overflow and font loading were checked at two widths (§1). No automated section-by-section sweep, no 16px-mark assertion inside `qa.mjs`. |
| **Licence check on the cast** | Not run | The six companion marks are original drawings, free within this system. They have not been searched against existing trademarks. |
| **Next.js route** | Built, in the app repo | `/design-system/vesper` now resolves in the app (`~/Development/sunnyside`), not in this repo: `app/design-system/vesper/{page.tsx, layout.tsx, icon.svg, llms.txt/route.ts}`, `features/vesper/*`, `public/brand/vesper/*`. Verified 200 at 1440 and 390 with 0px overflow, no console or hydration error, a working night toggle, a passing production build, and — via `parity.mjs` — byte-identical rendering against this repo's page at both widths in day and night. The gates in this file cannot see it, so §7 records what was and was not checked there. |
| **Screen-reader pass** | Not run | Landmarks, headings and `alt` text are present and ordered; no assistive-technology session was performed. |

---

## 5 · Known gaps

1. **The field is a raster.** 1600 × 900 is enough for a 1440 hero at 1× and for
   the board at 2×, but a 5K hero would need a second render. `field.mjs` takes
   the size as constants at the top, so this is a re-run, not a redraw.
2. **There is no night field.** The night scope flips the page, not the artwork.
   A true night field needs the inks swapped and a second seed, which was not
   done — the page therefore keeps the cobalt field in both scopes, and the
   footer says so.
3. **One display weight is exercised.** Fraunces loads 300–700, but only 300 and
   400 appear at display size. The 600–700 end is untested where it would be used
   (posters, covers).
4. **The wordmark is a single optical size.** Outlined once at `opsz 144`. Below
   40px the reading face carries the name instead, which is stated in the mark
   section but not demonstrated on the page.
5. **The scorer cannot see meaning.** It measures whether a shape survives 16px,
   not whether it says *lamp*. Horn and Post top the table on survival and lost
   the bake-off on reading. That judgement is not in the table and is not
   pretended to be.
6. **The shipped mark carries one red flag.** Its mass sits 8.4% below centre
   (§1a). The ink box is centred on the grid, so it seats correctly in a slot, and
   the low weight is the drawing's intent — but the flag is published, not waived.
7. **The scorer's thresholds are this system's, not the method's.** Eight checks
   with stated cut-offs were chosen for a fine, fill-only, cut-line mark on a
   64-unit grid. A different track — a wordmark-led system, or a mark that is
   meant to be bold — would need different numbers, and none of them were
   validated against a second system.

---

## 6 · Files

```
vesper/brand/brief.md                        the six-line brief and the decisions
vesper/brand/vesper-board.png                the board, 3000 × 2250
vesper/public/brand/vesper/DESIGN.md         the agent-readable spec
vesper/docs/vesper-design-system-audit.md    this file
vesper/features/vesper/tokens.json           the source
vesper/scripts/audit.mjs                     the gates above
vesper/scripts/score-bakeoff.mjs             the scorer behind §1a
vesper/public/brand/vesper/bakeoff/          the contact sheet and scores.json
design-system/vesper/index.html              the proof page
```

---

## 7 · The app port

The page is also served by the Next app at `~/Development/sunnyside`, which is a
separate repo from this one. It is a port, not a copy of the HTML: the app has
twelve sibling cases under `app/design-system/`, each a React page with local
fonts, a data module and an `llms.txt` twin, and Vesper had to match that or be
the odd one out.

Two generators did the mechanical work, both in `vesper/scripts/`:

| Script | What it does | Why it is not a copy-paste |
| --- | --- | --- |
| `port-css.mjs` | takes the CSS out of the generated page, drops the token block and `@font-face`, strips comments, then prefixes every class with `vs-` and nests every element selector under `.vs-scope` | `.nav`, `.body`, `.wrap` and `footer` already mean something in the site shell. An unscoped port restyles the whole app. |
| `port-marks.mjs` | turns the 14 brand SVGs into React components that paint with `currentColor` | the page re-inks marks by inheriting colour; an `<img>` would lose that and the reverse tiles would go dark |
| `parity.mjs` | measures the two copies against each other and fails on any difference | "it looks the same" is how two copies drift apart. This is the only check that can tell you they have. |

What the port keeps identical: the copy, the numbers (read from `tokens.json`
and `scores.json` at build time), the nine sections, both breakpoints, and the
night scope — except the scope is now an attribute on the page container instead
of on `<html>`, so toggling it cannot repaint the site around the page.

### The parity gate

Class names do not survive a port (every one gets a `vs-` prefix) and neither
does DOM structure, so `parity.mjs` keys every leaf text node by `tag|text` and
compares it on four paint properties (colour, size, weight, background) and three
box properties (width, height, left offset). `y` is deliberately excluded — it is
only the running total of everything above it, so comparing it would turn one
real 37px difference into two hundred fake ones.

The box check doubles as the font check. `fontFamily` cannot be compared, because
Next emits `__Fraunces_abc123` where the static page emits `Fraunces` — different
strings, identical rendering. But a 112px heading in the wrong face measures a
different width, so comparing pixels settles it where comparing names cannot.

Three passes, because each one carries a different risk: **desktop day** (the
layout), **mobile day** (the two breakpoints), **desktop night** (the sixteen
token overrides).

| Pass | Document height | Sections | Leaf nodes |
| --- | --- | --- | --- |
| 1440 · day | 15,822 = 15,822 | 10 of 10 identical | 313 of 313 match |
| 390 · day | 23,287 = 23,287 | 10 of 10 identical | 299 of 299 match |
| 1440 · night | 15,822 = 15,822 | 10 of 10 identical | 313 of 313 match |

One difference is excused by name in the script rather than tolerated silently:
the skip link. The static page hid it with an inline `left:-9999px`, which a React
port cannot carry, so it became a real rule — and it now becomes visible on
focus, which the original never did. That is a repair, not a regression.

### Five bugs the gate found

The first run reported a 37px height difference and 13 of 13 nodes differing.
Both numbers were wrong in an instructive way, and chasing them turned up five
real defects — three in the port, and two in the design system itself:

1. **Buttons were rendering in Arial.** `.btn` never declared `font-family`, so
   every button in the static page fell back to the UA default. In a system whose
   entire argument is two typefaces, a third one was shipping on the most
   important control. Fixed in the source: `.btn` now names `--vs-font-reading`.

2. **`.btn` was two different sizes.** It never zeroed the UA `padding: 1px 6px`,
   so `<button class="btn">` rendered 12px wider and 2px taller than
   `<a class="btn">` — the same component, twice. Fixed in the source with
   `padding: 0`.

3. **The port inherited the host's letter-spacing.** The app's `<body>` carries
   Tailwind's `tracking-tight` (`-0.025em`), which resolves at the body's 16px to
   a *fixed* `-0.4px` — and every descendant inherits `-0.4px` as a length, so a
   20px paragraph and a 13.5px nav link were both being tightened by the same
   absolute amount. That single inherited value was the entire 43px height gap
   and the reason every nav link measured 1.6px narrow. Fixed by declaring
   `letter-spacing: normal` on `.vs-scope`, which stops the inheritance at the
   scope root.

4. **The port inherited the host's line box.** Tailwind's preflight writes
   `font: inherit` on form controls, which makes a button take the page's 1.62
   line height where Chrome's own stylesheet gives it `normal`. A 9.5px Copy
   button grew from 26px to 29.4px. Fixed with a reset on the scope's form
   controls — wrapped in `:where()` so it stays at element weight and cannot
   outrank `.vs-btn`'s own `line-height: 1`.

5. **Two class names were missing a space.** `vs-pair${c.pass ? '' : 'vs-fail'}`
   produced `vs-pairvs-fail`, and `vs-sc${s.rejected ? 'vs-rej' : ''}` produced
   `vs-scvs-rej`. Neither matches anything. The failed contrast pairs lost their
   styling (29 paint differences) and the two sections either side of the mistake
   drifted −71px and +77px — which is why the totals nearly cancelled and looked
   like noise. Both are now built with `['a', cond ? 'b' : ''].filter(Boolean)`.

The last one is the same mistake that produced the black-on-cobalt button: a
class name that does not match a rule. Both were found by measuring computed
style, not by reading the CSS.

### What was checked in the app

| Check | Result |
| --- | --- |
| Route returns 200 | yes, `/design-system/vesper`, and `/llms.txt` returns the markdown twin |
| Overflow at 1440 and 390 | 0px at both |
| Console and hydration | no error, no warning |
| Night toggle | round-trips, persists to `localStorage`, sets the attribute on `.vs-scope` only |
| Parity against the static page | identical at 1440 and 390, in day and night — see the table above |
| Button contrast, measured on the live route | filled 8.05:1, ghost 15.93:1; all six at or above 4.5:1 |
| Typecheck and lint | `tsc --noEmit` clean, `eslint` clean |
| `next build` | passes — `/design-system/vesper`, `/icon.svg` and `/llms.txt` all prerender as static |
| Screen reader | not run — same gap as §4 |

The build was verified in a throwaway copy of the repo so it could not clobber
the running dev server's `.next`, and that copy's symlinked `node_modules` trips
Turbopack's filesystem-root check — so the build ran with `--webpack`. The routes
and their prerender status are what that check was for; a Turbopack production
build has still not been run.

Two copies of the page now exist: this repo's generated HTML, and the app's React
port. They are kept in step by the three scripts above, not by hand — but they
are still two, and a change made only here will not reach the app until the
porters are run again. `parity.mjs` is what makes that risk visible instead of
theoretical: run it after any change to either side.
