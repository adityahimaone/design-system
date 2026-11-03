#!/usr/bin/env node
/**
 * forge-arete.mjs — one-pass asset forge for Case 18 · Arête.
 * Paper-cut alpine: ivory stock, ultramarine ink, layered ridge sheets.
 *
 * Emits every mark, lockup, companion cast glyph, token file and doc
 * from a single source of geometry truth.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire('/tmp/qa-tools/')
const opentype = require('opentype.js')

const ROOT = process.cwd()
const BRAND = path.join(ROOT, 'public/brand/arete')
const FEATURE = path.join(ROOT, 'src/features/arete')
fs.mkdirSync(path.join(BRAND, 'cast'), { recursive: true })
fs.mkdirSync(FEATURE, { recursive: true })

const INK = '#1E3A8A'
const IVORY = '#F2EDE3'
const INDIGO = '#101229'

/* ── 1 · geometry ───────────────────────────────────────────────────────── */

// Master: a floating ridge ribbon (10u thick) over a grounded mass, one 5u seam.
const MARK = [
  'M8 30 L22 10 L32 22 L43 14 L56 28 L56 38 L43 24 L32 32 L22 20 L8 40 Z',
  'M8 45 L22 25 L32 37 L43 29 L56 43 L56 58 L8 58 Z',
].join(' ')

// 16px compact: one filled massif, cut by a single 4u sheet seam.
const MARK_C = 'M2 58 L20 10 L32 34 L42 18 L62 58 Z M2 40 H62 V44 H2 Z'

const svg = (vb, body, extra = '') => {
  const [, , w, h] = vb.split(' ')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}" fill="none" role="img"${extra}>${body}</svg>\n`
}

const write = (rel, content) => fs.writeFileSync(path.join(BRAND, rel), content)

write('mark.svg', svg('0 0 64 64', `<g fill="${INK}" fill-rule="evenodd"><path d="${MARK}"/></g>`))
write('mark-reverse.svg', svg('0 0 64 64', `<g fill="${IVORY}" fill-rule="evenodd"><path d="${MARK}"/></g>`))
write('glyph.svg', svg('0 0 64 64', `<g fill="${INK}" fill-rule="evenodd"><path d="${MARK}"/></g>`))
write('mark-compact.svg', svg('0 0 64 64', `<g fill="${INK}" fill-rule="evenodd"><path d="${MARK_C}"/></g>`))
write('mark-compact-reverse.svg', svg('0 0 64 64', `<g fill="${IVORY}" fill-rule="evenodd"><path d="${MARK_C}"/></g>`))

/* ── 2 · outlined wordmark (real vectors, ink baked) ────────────────────── */

function buildWordmark(fontPath, text, trackingEm, size = 1000) {
  const buf = fs.readFileSync(fontPath)
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
  const track = trackingEm * size
  let x = 0
  const ds = []
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const ch of text) {
    const glyph = font.charToGlyph(ch)
    const p = glyph.getPath(x, 0, size)
    ds.push(p.toPathData(2))
    if (ch !== ' ') {
      const b = p.getBoundingBox()
      minX = Math.min(minX, b.x1)
      maxX = Math.max(maxX, b.x2)
      minY = Math.min(minY, b.y1)
      maxY = Math.max(maxY, b.y2)
    }
    x += (glyph.advanceWidth / font.unitsPerEm) * size + track
  }
  return { d: ds.join(' '), bb: { x1: minX, y1: minY, x2: maxX, y2: maxY } }
}

const fonts = '/tmp/qa-tools/fonts/arete'
const wmMain = buildWordmark(path.join(fonts, 'bodoni-500.ttf'), 'ARÊTE', 0.18)
const wmDesc = buildWordmark(path.join(fonts, 'instrument-500.ttf'), 'ALPINE CARTOGRAPHY', 0.34)

const norm = (set, pad = 0) => ({
  d: set.d,
  x: set.bb.x1 - pad,
  y: set.bb.y1 - pad,
  w: set.bb.x2 - set.bb.x1 + pad * 2,
  h: set.bb.y2 - set.bb.y1 + pad * 2,
  capH: -set.bb.y1,
})
const M = norm(wmMain)
const D = norm(wmDesc)

write(
  'wordmark.svg',
  svg(
    `0 0 ${M.w.toFixed(0)} ${M.h.toFixed(0)}`,
    `<path fill="${INK}" d="${M.d}" transform="translate(${(-M.x).toFixed(2)} ${(-M.y).toFixed(2)})"/>`
  )
)
write(
  'wordmark-reverse.svg',
  svg(
    `0 0 ${M.w.toFixed(0)} ${M.h.toFixed(0)}`,
    `<path fill="${IVORY}" d="${M.d}" transform="translate(${(-M.x).toFixed(2)} ${(-M.y).toFixed(2)})"/>`
  )
)

/* ── 3 · lockups ────────────────────────────────────────────────────────── */

const placeWord = (inkH, tx, baseline, color) => {
  const s = inkH / M.capH
  return `<g transform="translate(${tx.toFixed(2)} ${(baseline - inkH).toFixed(2)}) scale(${s.toFixed(5)}) translate(${(-M.x).toFixed(2)} ${(-M.y).toFixed(2)})"><path fill="${color}" d="${M.d}"/></g>`
}
const placeDesc = (inkH, tx, baseline, color) => {
  const s = inkH / D.capH
  return `<g transform="translate(${tx.toFixed(2)} ${(baseline - inkH).toFixed(2)}) scale(${s.toFixed(5)}) translate(${(-D.x).toFixed(2)} ${(-D.y).toFixed(2)})"><path fill="${color}" d="${D.d}"/></g>`
}

// horizontal lockup: mark 64u, wordmark ink 30u, seam gap 22u, baseline 45
const H_INK = 30
const H_SCALE = H_INK / M.capH
const H_GAP = 22
const H_W = M.w * H_SCALE
const H_TOTAL = Math.ceil(64 + H_GAP + H_W + 2)

const lockupH = (color, mark) =>
  svg(
    `0 0 ${H_TOTAL} 64`,
    `<g fill="${color}" fill-rule="evenodd"><g>${mark}</g></g>${placeWord(H_INK, 64 + H_GAP, 45, color)}`
  )

write('lockup.svg', lockupH(INK, `<path d="${MARK}"/>`))
write('lockup-reverse.svg', lockupH(IVORY, `<path d="${MARK}"/>`))

// stacked lockup: mark centred, wordmark ink 44, descriptor ink 10
const S_INK = 44
const S_SCALE = S_INK / M.capH
const S_W = M.w * S_SCALE
const S_TOTAL = Math.ceil(S_W + 2)
const S_MARK_X = (S_TOTAL - 64) / 2
const S_BASE = 64 + 30 + S_INK
const D_INK = 10
const D_SCALE = D_INK / D.capH
const D_W = D.w * D_SCALE
const D_BASE = S_BASE + 30
const S_H = Math.ceil(D_BASE + 8)

const lockupS = (color, mark) =>
  svg(
    `0 0 ${S_TOTAL} ${S_H}`,
    `<g transform="translate(${S_MARK_X.toFixed(2)} 0)" fill="${color}" fill-rule="evenodd"><path d="${mark}"/></g>` +
      placeWord(S_INK, (S_TOTAL - S_W) / 2, S_BASE, color) +
      placeDesc(D_INK, (S_TOTAL - D_W) / 2, D_BASE, color)
  )

write('lockup-stacked.svg', lockupS(INK, MARK))
write('lockup-stacked-reverse.svg', lockupS(IVORY, MARK))

// favicon + icon: compact mark on chalk, knife-cut square (never a circular badge)
const icon = (size, radius) =>
  svg(
    `0 0 ${size} ${size}`,
    `<rect width="${size}" height="${size}" rx="${radius}" fill="${IVORY}"/>` +
      `<g transform="translate(${size * 0.15} ${size * 0.15}) scale(${(size * 0.7) / 64})" fill="${INK}" fill-rule="evenodd"><path d="${MARK_C}"/></g>`
  )
write('favicon.svg', icon(64, 8))
write('icon.svg', icon(512, 64))

/* ── 4 · six-mark companion cast (fill only, 6u cut weight) ─────────────── */

const CAST = {
  // summit massif with one sheet seam cut across it
  sommet: 'M4 56 L22 14 L32 36 L41 22 L60 56 Z M4 44 H60 V48 H4 Z',
  // compass rose: two crossing kites around a square cut
  boussole:
    'M32 4 L40 32 L32 60 L24 32 Z M4 32 L32 24 L60 32 L32 40 Z M27 27 H37 V37 H27 Z',
  // contour arch: three nested topographic rings
  courbe:
    'M6 58 V28 L22 12 H42 L58 28 V58 H50 V32 L40 22 H24 L14 32 V58 Z M18 58 V40 L28 30 H36 L46 40 V58 H40 V42 L35 37 H29 L24 42 V58 Z',
  // larch: three serrated canopy tiers over a trunk
  meleze:
    'M32 4 L44 24 H37 L48 40 H39 L50 54 H14 L25 40 H16 L27 24 H20 Z M29 54 H35 V61 H29 Z',
  // refuge hut: gable roof, chimney, one door cut
  refuge:
    'M6 30 L32 6 L58 30 Z M14 32 H50 V56 H14 Z M28 40 H36 V56 H28 Z M40 10 H47 V22 H40 Z',
  // cairn: four stones stacked with 3u seams
  cairn:
    'M17 47 H47 V56 H17 Z M21 36 H43 V44 H21 Z M25 25 H39 V33 H25 Z M28 15 H36 V22 H28 Z',
}

for (const [name, body] of Object.entries(CAST)) {
  write(`cast/${name}.svg`, svg('0 0 64 64', `<g fill="${INDIGO}" fill-rule="evenodd"><path d="${body}"/></g>`))
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
  ['paper', '#F2EDE3', 'The ivory stock in the collage. Page canvas and sky.'],
  ['vellum', '#E9E2D5', 'Tracing vellum. Secondary sheets and reading plates.'],
  ['deckle', '#D7D1C4', 'Torn deckle edge and hairlines. Never type.'],
  ['chalk', '#FBF8F0', 'The white paper mountain in raking light. Elevated plates.'],
  ['mist', '#C9D0EC', 'Pale ultramarine wash. Graphic tint only.'],
  ['glacier', '#8FA0D2', 'The farthest cobalt ridge. Graphic tint only.'],
  ['ridge', '#2E4CA6', 'Mid-ridge ultramarine. Secondary accent.'],
  ['ultramarine', '#1E3A8A', 'The cobalt band in the collage. Primary accent and mark fill.'],
  ['graphite', '#4A4E57', 'The grey torn-paper layer. Secondary copy and metadata.'],
  ['indigo', '#101229', 'The black torn-paper layer. Primary reading ink and night ground.'],
  ['oxide', '#C4462B', 'Survey blaze. Trail rule and graphic only.'],
  ['dusk', '#1A1F4A', 'Ultramarine at dusk. Night surface and poster ground.'],
]

const primitives = P.map(([name, value, role]) => ({ name, value, oklch: oklch(value), role }))
const H = Object.fromEntries(P.map(([n, v]) => [n, v]))

const PAIRS = [
  ['indigo', 'paper', 'AAA (>= 7:1)', 'Display headlines, body copy and the mark on stock'],
  ['indigo', 'vellum', 'AAA (>= 7:1)', 'Reading copy on the vellum plate'],
  ['graphite', 'paper', 'AAA (>= 7:1)', 'Secondary copy, captions and route metadata'],
  ['ultramarine', 'paper', 'AAA (>= 7:1)', 'Inline links, eyebrows and accent numerals'],
  ['ultramarine', 'vellum', 'AA (>= 4.5:1)', 'Accent labels on the vellum plate'],
  ['ridge', 'paper', 'AA (>= 4.5:1)', 'Secondary accent and status ink on stock'],
  ['indigo', 'chalk', 'AAA (>= 7:1)', 'Body copy on the top sheet'],
  ['paper', 'ultramarine', 'AAA (>= 7:1)', 'Reverse lockup and the ultramarine plate'],
  ['paper', 'indigo', 'AAA (>= 7:1)', 'Poster display type on the night ground'],
  ['mist', 'indigo', 'AAA (>= 7:1)', 'Reverse metadata and coordinates'],
  ['glacier', 'dusk', 'AA (>= 4.5:1)', 'Night-scope status ink and ridge labels'],
  ['oxide', 'paper', 'AA (>= 4.5:1)', 'Trail blaze rules and survey marks'],
  ['glacier', 'paper', 'GRAPHIC (>= 3:1)', 'Graphic only — far ridge fills and elevation bands'],
  ['mist', 'paper', 'GRAPHIC (>= 3:1)', 'Graphic only — paper wash and disabled fills'],
]

const contrast = PAIRS.map(([fg, bg, target, role]) => {
  const r = ratio(H[fg], H[bg])
  const min = parseFloat(target.match(/([\d.]+):1/)[1])
  return { fg, bg, ratio: Math.round(r * 10) / 10, pass: r >= min, target, role }
})

/* ── 7 · tokens.json ────────────────────────────────────────────────────── */

const tokens = {
  meta: {
    name: 'Arête',
    slug: 'arete',
    case: '18',
    namespace: '--ar-',
    version: '1.0.0',
    year: 2026,
    author: 'Sunnyside',
    archetype: 'paper-cut alpine / cartographic atelier',
    primaryAccent: 'ultramarine',
    essence: 'Alpine cartography · every layer is a cut',
    promise:
      'Guided ridge traverses and hand-cut topographic editions, made from two papers: ivory stock and ultramarine ink.',
    family: 'Two stacked ridge sheets — a floating ribbon over a grounded mass — separated by one 5-unit seam.',
    track: 'constructed',
    oneSentence:
      'Arête is an alpine cartography atelier whose surfaces are stacked paper cuts: ivory stock, ultramarine ink, knife-cut edges and 5-unit seams instead of gradients.',
    gate: 'v4.2',
    boardSwatches: ['paper', 'deckle', 'glacier', 'ridge', 'ultramarine', 'indigo', 'oxide'],
    contrastPairs: contrast.length,
    failingPairs: contrast.filter((c) => !c.pass).length,
  },
  theme: {
    family: 'constructed — Kuwayama parametric vector discipline, cut-paper material bias',
    material: 'ivory cartridge stock, tracing vellum, deckle edges, ultramarine ink, graphite annotation',
    edge: 'knife-cut — 0px outer / 2px inner, 2px rules, hard 4px paper-shadow offsets',
    offset: 'paper lift (4px 4px 0 rgba(16, 18, 41, 0.12))',
    stroke:
      'zero line icons; filled geometric vectors only, 5-unit seams as the single detail cut',
    tile: 'editorial cartography — 66ch reading measure, route ledgers, tabular elevation data',
    radius: '0 / 2 / 4 / 999',
    density: 'editorial balanced (96px section rhythm, 24px cell padding, 1.62 leading)',
    fieldRecipe:
      'torn-paper alpine collage — ivory stock, white paper peaks, a grey and a black layer, one cobalt seam, visible fibre',
    markForm:
      'a floating ridge ribbon (10u thick) over a grounded mass, parted by one 5u seam on a 64-unit sheet',
  },
  sections: [
    '01-hero',
    '02-thesis',
    '03-brandmark',
    '04-chromatic',
    '05-typography',
    '06-surfaces',
    '07-workbench',
    '08-tokens',
  ],
  surfaces: [
    {
      name: 'Cut sheet',
      token: '--ar-surface-cut',
      rule: 'Flat stock, 2u seams, no shadow. The base layer.',
      when: 'Long reading sections and token tables.',
    },
    {
      name: 'Lifted layer',
      token: '--ar-surface-lifted',
      rule: '4px hard offset shadow, zero blur. One sheet above another.',
      when: 'Cards, plates and anything that must read as stacked paper.',
    },
    {
      name: 'Vellum overlay',
      token: '--ar-surface-vellum',
      rule: '88% ivory tint, 18px fiber blur, deckle hairline.',
      when: 'Type over artwork, route profiles, the refraction stage.',
    },
    {
      name: 'Deckle edge',
      token: '--ar-surface-deckle',
      rule: 'Generated rough edge from one turbulence mask, used once per composition.',
      when: 'Section dividers and the closing poster only.',
    },
  ],
  primitives,
  contrast,
  type: {
    foundry: 'Google Fonts',
    display: "'Bodoni Moda', 'Didot', Georgia, serif",
    sans: "'Instrument Sans', system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
    scale: [
      {
        role: 'Display Hero',
        token: '--ar-t-hero',
        clamp: 'clamp(3rem, 5.4vw + 1rem, 5.4rem)',
        lh: '0.94',
        ls: '-0.03em',
        weight: '400',
        sample: 'The ridge is a line the mountain draws.',
      },
      {
        role: 'Section H1',
        token: '--ar-t-h1',
        clamp: 'clamp(2.1rem, 3.3vw + 0.5rem, 3.25rem)',
        lh: '1.02',
        ls: '-0.025em',
        weight: '400',
        sample: 'Two papers, one cut, and the altitude between.',
      },
      {
        role: 'Title H2',
        token: '--ar-t-h2',
        clamp: 'clamp(1.4rem, 1.9vw + 0.25rem, 1.95rem)',
        lh: '1.18',
        ls: '-0.02em',
        weight: '500',
        sample: 'Arête du Midi · 3,842 m · 11.4 km',
      },
      {
        role: 'Lead',
        token: '--ar-t-lead',
        clamp: 'clamp(1.12rem, 1.25vw, 1.32rem)',
        lh: '1.62',
        ls: '-0.012em',
        weight: '400',
        sample: 'Ivory above the tree line, ultramarine in the valley, and a knife that never wobbles.',
      },
      {
        role: 'Body',
        token: '--ar-t-body',
        clamp: '1rem (16px)',
        lh: '1.68',
        ls: '0',
        weight: '400',
        sample:
          'Four traverses leave from the same hut. Each map is cut in seven sheets and registered by hand, so no two editions share a seam.',
      },
      {
        role: 'Small',
        token: '--ar-t-small',
        clamp: '0.86rem (13.8px)',
        lh: '1.55',
        ls: '+0.01em',
        weight: '500',
        sample: 'Traverse 04 · UIAA III · 2 hut nights · permit required',
      },
      {
        role: 'Micro Spec',
        token: '--ar-t-micro',
        clamp: '0.6875rem (11px)',
        lh: '1.40',
        ls: '+0.16em',
        weight: '500',
        sample: 'CASE 18 · PAPER-CUT ALPINE · 46°12′N 07°04′E',
      },
    ],
  },
  night: {
    canvas: '#0C0E22',
    surface: '#141733',
    elevated: '#1D2144',
    inkPrimary: '#F3EEE3',
    inkSecondary: '#B9BFDD',
    accentPrimary: '#8C9CE0',
    accentSecondary: '#C6CDF1',
  },
}

fs.writeFileSync(path.join(FEATURE, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n')
fs.writeFileSync(path.join(BRAND, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n')

/* ── 8 · tokens.css ─────────────────────────────────────────────────────── */

const css = `/* ==========================================================================
   ARÊTE DESIGN SYSTEM · TOKENS (v1.0 · Case 18)
   Paper-cut alpine · every layer is a cut
   Layer 1 primitives never flip. Only the semantic scope moves at dusk.
   ========================================================================== */

:root {
  /* 1 · Primitives — the material, named once */
${primitives.map((p) => `  --ar-${p.name}: ${p.value};`).join('\n')}

  /* 1b · Perceptual strings (oklch) */
${primitives.map((p) => `  --ar-oklch-${p.name}: ${p.oklch};`).join('\n')}

  /* 2 · Semantic — ivory stock scope (default) */
  --ar-bg-canvas: var(--ar-paper);
  --ar-bg-surface: var(--ar-vellum);
  --ar-bg-elevated: var(--ar-chalk);
  --ar-bg-sunk: var(--ar-deckle);
  --ar-ink-primary: var(--ar-indigo);
  --ar-ink-secondary: var(--ar-graphite);
  --ar-ink-tertiary: var(--ar-deckle);
  --ar-ink-reverse: var(--ar-paper);
  --ar-border-subtle: rgba(16, 18, 41, 0.16);
  --ar-border-strong: rgba(16, 18, 41, 0.34);
  --ar-border-focus: var(--ar-ultramarine);
  --ar-accent-primary: var(--ar-ultramarine);
  --ar-accent-secondary: var(--ar-ridge);
  --ar-accent-light: var(--ar-glacier);
  --ar-blaze: var(--ar-oxide);

  /* 3 · Typography */
  --ar-font-display: 'Bodoni Moda', 'Didot', Georgia, serif;
  --ar-font-sans: 'Instrument Sans', system-ui, -apple-system, sans-serif;
  --ar-font-mono: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', monospace;

  /* 4 · Physics & tactility — knife-cut, never rounded */
  --ar-radius-0: 0px;
  --ar-radius-xs: 2px;
  --ar-radius-sm: 4px;
  --ar-radius-pill: 999px;
  --ar-seam: 5px;
  --ar-shadow-sheet: 4px 4px 0 rgba(16, 18, 41, 0.12);
  --ar-shadow-lift: 8px 8px 0 rgba(16, 18, 41, 0.14);
  --ar-shadow-plate: 0 1px 0 rgba(16, 18, 41, 0.08), 10px 14px 0 -6px rgba(16, 18, 41, 0.1);
  --ar-ease-cut: cubic-bezier(0.2, 0.9, 0.2, 1);
  --ar-transition: 260ms var(--ar-ease-cut);

  /* 5 · Paper surfaces (component layer) */
  --ar-vellum-tint: 88%;
  --ar-vellum-blur: 18px;
  --ar-sheet-offset: 5px;
  --ar-sheet-shadow: 4px;
}

/* 2 · Semantic — ultramarine dusk scope */
[data-ar='dusk'],
.ar[data-ar='dusk'] {
  --ar-bg-canvas: ${tokens.night.canvas};
  --ar-bg-surface: ${tokens.night.surface};
  --ar-bg-elevated: ${tokens.night.elevated};
  --ar-bg-sunk: #080A1A;
  --ar-ink-primary: ${tokens.night.inkPrimary};
  --ar-ink-secondary: ${tokens.night.inkSecondary};
  --ar-ink-tertiary: #59608C;
  --ar-ink-reverse: ${tokens.night.canvas};
  --ar-border-subtle: rgba(243, 238, 227, 0.18);
  --ar-border-strong: rgba(243, 238, 227, 0.36);
  --ar-accent-primary: ${tokens.night.accentPrimary};
  --ar-accent-secondary: ${tokens.night.accentSecondary};
  --ar-blaze: #E0664A;
  --ar-shadow-sheet: 4px 4px 0 rgba(0, 0, 0, 0.4);
  --ar-shadow-lift: 8px 8px 0 rgba(0, 0, 0, 0.48);
  --ar-shadow-plate: 0 1px 0 rgba(0, 0, 0, 0.4), 10px 14px 0 -6px rgba(0, 0, 0, 0.36);
}

/* 6 · Type scale */
:root {
${tokens.type.scale.map((s) => `  ${s.token}: ${s.clamp};`).join('\n')}
}
`
fs.writeFileSync(path.join(FEATURE, 'arete-tokens.css'), css)
fs.writeFileSync(path.join(BRAND, 'arete-tokens.css'), css)

/* ── 9 · DESIGN.md ──────────────────────────────────────────────────────── */

const fails = contrast.filter((c) => !c.pass)
const md = `# Arête — Design System (Case 18)

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

- \`mark.svg\` — 64-unit master, ultramarine ink baked in.
- \`mark-compact.svg\` — **a separate drawing**, not a scaled master. Below 24px the
  two layers merge into one filled massif and the 5u seam becomes a single 4u cut, so
  it survives anti-aliasing at 16×16.
- \`wordmark.svg\` — outlined Bodoni Moda 500 paths, +0.18em tracking, ink baked in.

## Companion cast

\`sommet\` (summit) · \`boussole\` (compass) · \`courbe\` (contour) · \`meleze\` (larch) ·
\`refuge\` (hut) · \`cairn\` (cairn). All six are fill-only, 6u cut weight, on the same
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

## Contrast ledger — ${contrast.length} pairs, ${fails.length} published failures

${contrast
  .map(
    (c) =>
      `- \`--ar-${c.fg}\` on \`--ar-${c.bg}\` — **${c.ratio}:1** ${c.pass ? 'PASS' : '**FAIL**'} (${c.target}) — ${c.role}`
  )
  .join('\n')}

Glacier (${contrast.find((c) => c.fg === 'glacier' && !c.pass)?.ratio}:1) and mist (${contrast.find((c) => c.fg === 'mist' && !c.pass)?.ratio}:1) are the
far-ridge tones; darkening either until it passed would turn the paper to mud. Oxide
(${contrast.find((c) => c.fg === 'oxide' && !c.pass)?.ratio}:1) is a survey blaze, not a label. All three are restricted to
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
`
fs.writeFileSync(path.join(FEATURE, 'DESIGN.md'), md)
fs.writeFileSync(path.join(BRAND, 'DESIGN.md'), md)

console.log('forge complete')
console.log(`lockup ${H_TOTAL}×64 · stacked ${S_TOTAL}×${S_H} · wordmark ${M.w.toFixed(0)}×${M.h.toFixed(0)}`)
console.log(`contrast: ${contrast.filter((c) => c.pass).length} pass / ${fails.length} fail`)
console.log(contrast.map((c) => `${c.fg}/${c.bg} ${c.ratio}`).join('\n'))
