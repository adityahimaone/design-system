#!/usr/bin/env node
/**
 * build-quieta.mjs — one-pass asset forge for Case 17 · Quieta.
 * Emits every mark, lockup, companion cast glyph, token file and doc
 * from a single source of geometry truth.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const BRAND = path.join(ROOT, 'public/brand/quieta')
const FEATURE = path.join(ROOT, 'src/features/quieta')
fs.mkdirSync(path.join(BRAND, 'cast'), { recursive: true })
fs.mkdirSync(FEATURE, { recursive: true })

const INK = '#211C17'
const CHALK = '#F4EEE4'
const CLAY = '#9A4A26'

/* ── 1 · geometry ───────────────────────────────────────────────────────── */

// Master mark: a cantilevered roof slab floating 5u above a stone wall mass,
// with a single threshold notch cut through the wall to the ground line.
const MARK = `<path fill-rule="evenodd" d="M5 8h54v8H5Z"/><path fill-rule="evenodd" d="M10 21h44v35H10Z M26 31h12v25H26Z"/>`
// 16px compact: the shadow gap closes, roof thickens, notch widens to 16u.
const MARK_C = `<path fill-rule="evenodd" d="M4 6h56v12H4Z"/><path fill-rule="evenodd" d="M8 18h48v38H8Z M24 30h16v26H24Z"/>`

const svg = (vb, body, extra = '', sized = true) => {
  const [, , w, h] = vb.split(/\s+/)
  const dims = sized ? ` width="${Math.round(w)}" height="${Math.round(h)}"` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${dims} fill="none"${extra}>${body}</svg>\n`
}

const write = (rel, content) => fs.writeFileSync(path.join(BRAND, rel), content)

write('mark.svg', svg('0 0 64 64', `<g fill="${INK}">${MARK}</g>`))
write('mark-reverse.svg', svg('0 0 64 64', `<g fill="${CHALK}">${MARK}</g>`))
write('glyph.svg', svg('0 0 64 64', `<g fill="${INK}">${MARK}</g>`))
write('mark-compact.svg', svg('0 0 64 64', `<g fill="${INK}">${MARK_C}</g>`))
write('mark-compact-reverse.svg', svg('0 0 64 64', `<g fill="${CHALK}">${MARK_C}</g>`))

/* ── 2 · outlined wordmark (real vectors, ink baked) ────────────────────── */

const wm = JSON.parse(fs.readFileSync('/tmp/qa-tools/wordmark.json', 'utf8'))
const M = wm.main
const D = wm.desc

// normalise each set to its own bounding box so placement is exact
const norm = (set, pad = 0) => ({
  d: set.d,
  x: set.bb.x1 - pad,
  y: set.bb.y1 - pad,
  w: set.bb.x2 - set.bb.x1 + pad * 2,
  h: set.bb.y2 - set.bb.y1 + pad * 2,
  capH: -set.bb.y1,
})

const MWN = norm(M)
const DWN = norm(D)

// wordmark.svg — the logotype alone, baseline-corrected
write(
  'wordmark.svg',
  svg(
    `0 0 ${MWN.w.toFixed(0)} ${MWN.h.toFixed(0)}`,
    `<path fill="${INK}" d="${MWN.d}" transform="translate(${(-MWN.x).toFixed(2)} ${(-MWN.y).toFixed(2)})"/>`
  )
)
write(
  'wordmark-reverse.svg',
  svg(
    `0 0 ${MWN.w.toFixed(0)} ${MWN.h.toFixed(0)}`,
    `<path fill="${CHALK}" d="${MWN.d}" transform="translate(${(-MWN.x).toFixed(2)} ${(-MWN.y).toFixed(2)})"/>`
  )
)

/* ── 3 · lockups ────────────────────────────────────────────────────────── */

const placeWord = (inkH, tx, baseline, color) => {
  const s = inkH / MWN.capH
  return `<g transform="translate(${tx.toFixed(2)} ${(baseline - inkH).toFixed(2)}) scale(${s.toFixed(5)}) translate(${(-MWN.x).toFixed(2)} ${(-MWN.y).toFixed(2)})"><path fill="${color}" d="${MWN.d}"/></g>`
}
const placeDesc = (inkH, tx, baseline, color) => {
  const s = inkH / DWN.capH
  return `<g transform="translate(${tx.toFixed(2)} ${(baseline - inkH).toFixed(2)}) scale(${s.toFixed(5)}) translate(${(-DWN.x).toFixed(2)} ${(-DWN.y).toFixed(2)})"><path fill="${color}" d="${DWN.d}"/></g>`
}

// horizontal lockup: mark 64 tall, wordmark ink height 36, baseline at y 48
const H_INK = 33
const H_S = H_INK / MWN.capH
const H_W = MWN.w * H_S
const H_GAP = 24
const H_W_TOTAL = Math.ceil(64 + H_GAP + H_W + 2)

const lockupH = (color, mark) =>
  svg(
    `0 0 ${H_W_TOTAL} 64`,
    `<g fill="${color}">${mark}</g>${placeWord(H_INK, 64 + H_GAP, 48, color)}`
  )

write('lockup.svg', lockupH(INK, MARK))
write('lockup-reverse.svg', lockupH(CHALK, MARK))

// stacked lockup: mark centred, wordmark ink 46, descriptor ink 10
const S_INK = 44
const S_S = S_INK / MWN.capH
const S_W = MWN.w * S_S
const S_W_TOTAL = Math.ceil(S_W + 2)
const S_MARK = 76
const S_MARK_X = (S_W_TOTAL - S_MARK) / 2
const S_BASE = S_MARK + 28 + S_INK
const D_INK = 11
const D_S = D_INK / DWN.capH
const D_W = DWN.w * D_S
const D_BASE = S_BASE + 34
const S_H = Math.ceil(D_BASE + 12)

const lockupS = (color, mark) =>
  svg(
    `0 0 ${S_W_TOTAL} ${S_H}`,
    `<g transform="translate(${S_MARK_X.toFixed(2)} 0) scale(${(S_MARK / 64).toFixed(4)})" fill="${color}">${mark}</g>` +
      placeWord(S_INK, (S_W_TOTAL - S_W) / 2, S_BASE, color) +
      placeDesc(D_INK, (S_W_TOTAL - D_W) / 2, D_BASE, color)
  )

write('lockup-stacked.svg', lockupS(INK, MARK))
write('lockup-stacked-reverse.svg', lockupS(CHALK, MARK))

// favicon + icon: compact mark on a chalk squircle (never a circular badge)
const icon = (size, radius) =>
  svg(
    `0 0 ${size} ${size}`,
    `<rect width="${size}" height="${size}" rx="${radius}" fill="${CHALK}"/>` +
      `<g transform="translate(${size * 0.16} ${size * 0.16}) scale(${(size * 0.68) / 64})" fill="${INK}">${MARK_C}</g>`
  )
write('favicon.svg', icon(64, 12))
write('icon.svg', icon(512, 96))

/* ── 4 · six-mark companion cast (fill only, 6u cut weight) ─────────────── */

const CAST = {
  // olive tree: an asymmetric four-disc canopy over a trunk
  olivo: `<circle cx="32" cy="20" r="9"/><circle cx="22" cy="29" r="8"/><circle cx="42" cy="28" r="9"/><circle cx="30" cy="34" r="7"/><path d="M29 30h6v26h-6Z"/><path d="M19 54h26v4H19Z"/>`,
  // window aperture: 6u frame with a cross mullion
  finestra: `<path fill-rule="evenodd" d="M12 12h40v40H12Zm6 6v28h28V18Z"/><path d="M29 12h6v40h-6Z"/><path d="M12 29h40v6H12Z"/>`,
  // sculptural stair, rising left to right
  scala: `<path d="M8 56v-8h12v-8h12v-8h12v-8h12v32Z"/>`,
  // terracotta amphora
  anfora: `<path d="M20 14h24v6H20Z"/><path d="M27 20h10v6H27Z"/><path d="M27 26c-9 4-15 10-15 18 0 8 8 14 20 14s20-6 20-14c0-8-6-14-15-18Z"/>`,
  // garden light: half-disc above a horizon slab
  sole: `<path d="M16 38a16 16 0 0 1 32 0Z"/><path d="M8 46h48v6H8Z"/>`,
  // pool: three reflected water bars, tapering
  piscina: `<path d="M8 22h48v6H8Z"/><path d="M16 34h32v6H16Z"/><path d="M24 46h16v6H24Z"/>`,
}

for (const [name, body] of Object.entries(CAST)) {
  write(`cast/${name}.svg`, svg('0 0 64 64', `<g fill="${INK}">${body}</g>`, '', false))
}

/* ── 5 · OKLCH + honest contrast maths ──────────────────────────────────── */

const srgb = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)

function oklch(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgb)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.hypot(A, B)
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`
}

const lum = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(srgb)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/* ── 6 · primitives ─────────────────────────────────────────────────────── */

const P = [
  ['chalk', '#F4EEE4', 'Lime-plastered garden wall. Page canvas in daylight.'],
  ['limestone', '#E7DDCD', 'Honed travertine floor. Secondary surfaces and card plates.'],
  ['travertine', '#D3C5AF', 'Stone band course. Hairlines, dividers and quiet rules.'],
  ['oak', '#B98A5C', 'Oiled oak door leaf. Warm wood accent, never type.'],
  ['clay', '#9A4A26', 'Terracotta urn. Primary accent for links, labels and fills.'],
  ['olive', '#5A6844', 'Olive canopy in shade. Secondary accent and status ink.'],
  ['sage', '#A9B197', 'Sunlit foliage. Graphic tint only, never text.'],
  ['ink', '#211C17', 'Shadowed stone. Primary reading ink and mark fill.'],
  ['umber', '#6A5A4A', 'Dry earth. Secondary copy, metadata and captions.'],
  ['dusk', '#2E2822', 'Evening terrace. Night canvas and poster ground.'],
  ['gold', '#C99A5B', 'Low garden light. Graphic highlight only.'],
  ['mist', '#B7AE9F', 'Dust on stone. Disabled ink and quiet borders.'],
]

const primitives = P.map(([name, value, role]) => ({ name, value, oklch: oklch(value), role }))
const H = Object.fromEntries(P.map(([n, v]) => [n, v]))

const PAIRS = [
  ['ink', 'chalk', 'AAA (>= 7:1)', 'Display headlines, body copy and the mark fill'],
  ['ink', 'limestone', 'AAA (>= 7:1)', 'Card body copy on honed travertine plates'],
  ['ink', 'travertine', 'AAA (>= 7:1)', 'Reading copy on stone band surfaces'],
  ['umber', 'chalk', 'AA (>= 4.5:1)', 'Secondary labels, captions and metadata'],
  ['umber', 'limestone', 'AA (>= 4.5:1)', 'Metadata inside surface cards'],
  ['clay', 'chalk', 'AA (>= 4.5:1)', 'Inline links, eyebrow labels and accent numerals'],
  ['clay', 'limestone', 'AA (>= 4.5:1)', 'Accent labels on surface plates'],
  ['olive', 'chalk', 'AA (>= 4.5:1)', 'Available-status ink and garden metadata'],
  ['chalk', 'ink', 'AAA (>= 7:1)', 'Reverse lockup and poster display type'],
  ['chalk', 'dusk', 'AAA (>= 7:1)', 'Night-scope body copy and footer pane'],
  ['travertine', 'ink', 'AA (>= 4.5:1)', 'Reverse secondary labels on dark plates'],
  ['ink', 'gold', 'AA (>= 4.5:1)', 'Ink on garden-light chips and price flags'],
  ['gold', 'chalk', 'GRAPHIC (>= 3:1)', 'Graphic only — light pools, hairline glows, chart fills'],
  ['sage', 'chalk', 'GRAPHIC (>= 3:1)', 'Graphic only — foliage tints and map hatching'],
  ['oak', 'chalk', 'GRAPHIC (>= 3:1)', 'Graphic only — wood swatches and floor-plan fills'],
]

const contrast = PAIRS.map(([fg, bg, target, role]) => {
  const r = ratio(H[fg], H[bg])
  const min = parseFloat(target.match(/([\d.]+):1/)[1])
  return { fg, bg, ratio: Math.round(r * 10) / 10, pass: r >= min, target, role }
})

/* ── 7 · tokens.json ────────────────────────────────────────────────────── */

const tokens = {
  meta: {
    name: 'Quieta',
    slug: 'quieta',
    namespace: '--qa-',
    version: '1.0.0',
    year: 2026,
    author: 'Sunnyside',
    archetype: 'warm-stone / editorial atelier',
    primaryAccent: 'clay',
    essence: 'Quiet residences · Detail image beside content',
    promise:
      'Warm stone homes, sculptural interiors and soft garden light — a property brand for houses that are sold and let by being looked at closely.',
    family: 'One house in elevation: a floating roof slab, a wall mass, a threshold cut.',
    track: 'constructed',
    oneSentence:
      'Quieta is a property identity built from lime-plastered walls, honed travertine, terracotta and olive shade, with an arched-threshold Kuwayama mark and a 6-mark architectural cast.',
    gate: 'v4.2',
    contrastPairs: contrast.length,
    failingPairs: contrast.filter((c) => !c.pass).length,
  },
  theme: {
    family: 'constructed — Kuwayama parametric vector discipline, warm-stone material bias',
    material:
      'lime-plastered garden walls, honed travertine, oiled oak, terracotta urns, olive canopy and low garden light',
    edge: 'precision organic — 10px inner / 18px outer concentric radii, 1px stone hairlines',
    offset: 'low garden sun shadow (0 14px 34px -10px rgba(33, 28, 23, 0.14))',
    stroke: 'zero line icons; filled geometric vectors only, one 2-unit reveal seam as the single detail cut',
    tile: 'gallery-airy asymmetric rhythm, 66ch reading measure, detail image always paired beside content',
    radius: '0 / 8 / 12 / 18 / 999',
    density: 'gallery airy (104px section padding, 28px cell padding, wide leading)',
    fieldRecipe: 'soft garden light raking across a plastered stone wall with dappled olive shadow',
    markForm: 'a 54x8u cantilevered roof slab floating 5u above a 44x35u wall mass, with a 12x25u threshold notch cut through the wall to the ground line',
  },
  sections: [
    '01-hero',
    '02-thesis',
    '03-brandmark',
    '04-chromatic',
    '05-typography',
    '06-physics',
    '07-workbench',
    '08-tokens',
  ],
  primitives,
  contrast,
  type: {
    foundry: 'Google Fonts',
    display: 'Newsreader, serif',
    sans: "'Schibsted Grotesk', system-ui, sans-serif",
    mono: "'DM Mono', monospace",
    scale: [
      {
        role: 'Display Hero',
        token: '--qa-t-hero',
        clamp: 'clamp(2.9rem, 5.2vw + 1rem, 5.1rem)',
        lh: '0.94',
        ls: '-0.035em',
        weight: '400',
        sample: 'Quiet houses, held in stone.',
      },
      {
        role: 'Section H1',
        token: '--qa-t-h1',
        clamp: 'clamp(2.05rem, 3.2vw + 0.5rem, 3.15rem)',
        lh: '1.02',
        ls: '-0.028em',
        weight: '400',
        sample: 'A wall, a door, and the light between them.',
      },
      {
        role: 'Title H2',
        token: '--qa-t-h2',
        clamp: 'clamp(1.4rem, 1.9vw + 0.25rem, 1.95rem)',
        lh: '1.18',
        ls: '-0.02em',
        weight: '500',
        sample: 'Casa Olivo · 214 m² · olives to the west',
      },
      {
        role: 'Lead',
        token: '--qa-t-lead',
        clamp: 'clamp(1.12rem, 1.25vw, 1.32rem)',
        lh: '1.62',
        ls: '-0.012em',
        weight: '400',
        sample: 'Travertine underfoot, oak at the threshold, and a garden that keeps its own hours.',
      },
      {
        role: 'Body',
        token: '--qa-t-body',
        clamp: '1rem (16px)',
        lh: '1.72',
        ls: '0',
        weight: '400',
        sample: 'Six houses on a south-facing slope, each cut into the hillside so the roof line never rises above the olive canopy.',
      },
      {
        role: 'Small',
        token: '--qa-t-small',
        clamp: '0.86rem (13.8px)',
        lh: '1.55',
        ls: '+0.01em',
        weight: '500',
        sample: 'Plot 04 · Sold · Completion spring 2027 · 3 bedrooms',
      },
      {
        role: 'Micro Spec',
        token: '--qa-t-micro',
        clamp: '0.6875rem (11px)',
        lh: '1.40',
        ls: '+0.16em',
        weight: '600',
        sample: 'CASE 17 · WARM STONE ARCHETYPE · OKLCH 4.2',
      },
    ],
  },
  night: {
    canvas: '#191512',
    surface: '#221D18',
    elevated: '#2C2620',
    inkPrimary: '#F2ECE1',
    inkSecondary: '#BAAF9F',
    accentPrimary: '#E08048',
    accentSecondary: '#9CAA85',
  },
}

fs.writeFileSync(path.join(FEATURE, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n')
fs.writeFileSync(path.join(BRAND, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n')

/* ── 8 · tokens.css ─────────────────────────────────────────────────────── */

const css = `/* ==========================================================================
   QUIETA DESIGN SYSTEM · TOKENS (v1.0 · Case 17)
   Quiet residences · Detail image beside content
   Layer 1 primitives never flip. Only the semantic scope moves at dusk.
   ========================================================================== */

:root {
  /* 1 · Primitives — the material, named once */
${primitives.map((p) => `  --qa-${p.name}: ${p.value};`).join('\n')}

  /* 1b · Perceptual strings (oklch) */
${primitives.map((p) => `  --qa-oklch-${p.name}: ${p.oklch};`).join('\n')}

  /* 2 · Semantic — daylight garden scope (default) */
  --qa-bg-canvas: var(--qa-chalk);
  --qa-bg-surface: var(--qa-limestone);
  --qa-bg-elevated: #FBF7F0;
  --qa-bg-sunk: var(--qa-travertine);
  --qa-ink-primary: var(--qa-ink);
  --qa-ink-secondary: var(--qa-umber);
  --qa-ink-tertiary: var(--qa-mist);
  --qa-ink-reverse: var(--qa-chalk);
  --qa-border-subtle: rgba(33, 28, 23, 0.13);
  --qa-border-strong: rgba(33, 28, 23, 0.26);
  --qa-border-focus: var(--qa-clay);
  --qa-accent-primary: var(--qa-clay);
  --qa-accent-secondary: var(--qa-olive);
  --qa-accent-light: var(--qa-gold);
  --qa-status-available: var(--qa-olive);
  --qa-status-reserved: var(--qa-gold);
  --qa-status-sold: var(--qa-umber);

  /* 3 · Typography */
  --qa-font-display: 'Newsreader', 'Iowan Old Style', Georgia, serif;
  --qa-font-sans: 'Schibsted Grotesk', system-ui, -apple-system, sans-serif;
  --qa-font-mono: 'DM Mono', ui-monospace, 'SFMono-Regular', monospace;

  /* 4 · Physics & tactility */
  --qa-radius-xs: 4px;
  --qa-radius-sm: 8px;
  --qa-radius-md: 12px;
  --qa-radius-lg: 18px;
  --qa-radius-pill: 999px;
  --qa-shadow-plate: 0 2px 6px rgba(33, 28, 23, 0.04), 0 18px 44px -14px rgba(33, 28, 23, 0.16);
  --qa-shadow-lift: 0 1px 2px rgba(33, 28, 23, 0.05), 0 8px 22px -8px rgba(33, 28, 23, 0.12);
  --qa-ease-stone: cubic-bezier(0.22, 1, 0.36, 1);
  --qa-transition: 340ms var(--qa-ease-stone);

  /* 5 · Plate recipe (component layer) */
  --qa-plate-tint: 91%;
  --qa-plate-blur: 22px;
  --qa-plate-saturate: 145%;
}

/* 2 · Semantic — evening terrace scope */
[data-qa='dusk'],
.qa[data-qa='dusk'] {
  --qa-bg-canvas: ${tokens.night.canvas};
  --qa-bg-surface: ${tokens.night.surface};
  --qa-bg-elevated: ${tokens.night.elevated};
  --qa-bg-sunk: #14100E;
  --qa-ink-primary: ${tokens.night.inkPrimary};
  --qa-ink-secondary: ${tokens.night.inkSecondary};
  --qa-ink-tertiary: #7C7264;
  --qa-ink-reverse: ${tokens.night.canvas};
  --qa-border-subtle: rgba(242, 236, 225, 0.14);
  --qa-border-strong: rgba(242, 236, 225, 0.28);
  --qa-accent-primary: ${tokens.night.accentPrimary};
  --qa-accent-secondary: ${tokens.night.accentSecondary};
  --qa-status-available: ${tokens.night.accentSecondary};
  --qa-shadow-plate: 0 2px 6px rgba(0, 0, 0, 0.5), 0 22px 50px -18px rgba(0, 0, 0, 0.72);
  --qa-shadow-lift: 0 1px 2px rgba(0, 0, 0, 0.4), 0 10px 26px -10px rgba(0, 0, 0, 0.6);
}
`
fs.writeFileSync(path.join(FEATURE, 'quieta-tokens.css'), css)
fs.writeFileSync(path.join(BRAND, 'quieta-tokens.css'), css)

/* ── 9 · DESIGN.md ──────────────────────────────────────────────────────── */

const fails = contrast.filter((c) => !c.pass)
const md = `# Quieta — Design System (Case 17)

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

- \`mark.svg\` — 64-unit master, 8u clearspace on all sides.
- \`mark-compact.svg\` — **a separate drawing**, not a scaled master. Below 24px the
  shadow gap closes (roof and wall become one silhouette), the roof thickens to 12u
  and the notch widens to 16u, because a 5u gap resolves to 1.25px at 16×16 and greys
  into a smudge.
- \`wordmark.svg\` — outlined Newsreader paths, +0.17em tracking, ink baked in.

## Companion cast

\`olivo\` (olive canopy) · \`finestra\` (window aperture) · \`scala\` (sculptural stair) ·
\`anfora\` (terracotta urn) · \`sole\` (garden light) · \`piscina\` (reflected water).
All six are fill-only, 6u cut weight, on the same 64-unit grid.

## Type

- **Display** — Newsreader 400/500. Optical-size serif; the house voice.
- **UI** — Schibsted Grotesk 400/500. Precise, slightly wide, never shouty.
- **Mono** — DM Mono 300/400/500. Plans, prices, plot numbers, tabular.

## Contrast ledger — ${contrast.length} pairs, ${fails.length} published failures

${contrast
  .map(
    (c) =>
      `- \`--qa-${c.fg}\` on \`--qa-${c.bg}\` — **${c.ratio}:1** ${c.pass ? 'PASS' : '**FAIL**'} (${c.target}) — ${c.role}`
  )
  .join('\n')}

The three failures are brand colours kept at brand strength. Gold at ${contrast.find((c) => c.fg === 'gold').ratio}:1 on chalk is
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
`
fs.writeFileSync(path.join(FEATURE, 'DESIGN.md'), md)
fs.writeFileSync(path.join(BRAND, 'DESIGN.md'), md)

console.log('forge complete')
console.log(`lockup ${H_W_TOTAL}×64 · stacked ${S_W_TOTAL}×${S_H} · wordmark ${MWN.w.toFixed(0)}×${MWN.h.toFixed(0)}`)
console.log(`contrast: ${contrast.filter((c) => c.pass).length} pass / ${fails.length} fail`)
console.log(contrast.map((c) => `${c.fg}/${c.bg} ${c.ratio}`).join('\n'))
