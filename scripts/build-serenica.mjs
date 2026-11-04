#!/usr/bin/env node
/**
 * SERENICA · one-pass brand asset build (Case 23)
 * Paper & ink surface · petal rosette mark · six-ridge field
 *
 *   node scripts/build-serenica.mjs
 *
 * Writes public/brand/serenica/{mark,mark-reverse,glyph,mark-compact,...}.svg,
 * cast/*.svg, serenica-field.svg, src/features/serenica/{tokens.json,
 * serenica-tokens.css,DESIGN.md}
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const BRAND = path.join(ROOT, 'public/brand/serenica')
const FEAT = path.join(ROOT, 'src/features/serenica')
fs.mkdirSync(path.join(BRAND, 'cast'), { recursive: true })
fs.mkdirSync(FEAT, { recursive: true })

const SLUG = 'serenica'
const NAME = 'Serenica'
const NS = 'sr'
const CASE_NO = '23'

/* ─────────────────────────── palette ─────────────────────────── */
const P = {
  paper: '#F4F2E9',
  chalk: '#E9ECE3',
  haze: '#DCE2D3',
  sage: '#B7C2AB',
  moss: '#7D8F63',
  clover: '#556A33',
  deep: '#415325',
  ground: '#253019',
  ink: '#11140D',
  umber: '#3B4234',
  marigold: '#D99A2B',
  glow: '#FFFBEF',
}

/* ─────────────────────────── colour maths ─────────────────────────── */
const hex2rgb = (h) => {
  const s = h.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16))
}
const lin = (c) => {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}
const lum = (hex) => {
  const [r, g, b] = hex2rgb(hex).map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const la = lum(a)
  const lb = lum(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}
const toOklch = (hex) => {
  const [r, g, b] = hex2rgb(hex).map(lin)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.sqrt(A * A + B * B)
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`
}
const f2 = (n) => n.toFixed(2)

/* ─────────────────────────── mark geometry ─────────────────────────── */
const N = (n) => Math.round(n * 100) / 100
const circle = (cx, cy, r) =>
  `M${N(cx - r)} ${N(cy)}A${r} ${r} 0 1 0 ${N(cx + r)} ${N(cy)}A${r} ${r} 0 1 0 ${N(cx - r)} ${N(cy)}Z`

/** One petal, pointing up from (cx,cy), from r0 to r1, half-width w. */
const petal = (cx, cy, r0, r1, w, deg) => {
  const a = (deg * Math.PI) / 180
  const rot = (x, y) => [N(cx + x * Math.cos(a) - y * Math.sin(a)), N(cy + x * Math.sin(a) + y * Math.cos(a))]
  const span = r1 - r0
  const p0 = rot(0, -r0)
  const c1 = rot(w, -(r0 + span * 0.3))
  const c2 = rot(w * 0.93, -(r0 + span * 0.88))
  const tip = rot(0, -r1)
  const c3 = rot(-w * 0.93, -(r0 + span * 0.88))
  const c4 = rot(-w, -(r0 + span * 0.3))
  return `M${p0[0]} ${p0[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${tip[0]} ${tip[1]}C${c3[0]} ${c3[1]} ${c4[0]} ${c4[1]} ${p0[0]} ${p0[1]}Z`
}

const petals = (n, r0, r1, w, cx = 32, cy = 32) =>
  Array.from({ length: n }, (_, i) => petal(cx, cy, r0, r1, w, (360 / n) * i)).join('')

const svg = (body, label, size = 64) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="${label}">${body}</svg>\n`

// Primary: annulus ring + disc, eight petal cuts and one eye cut (evenodd).
const markPath =
  circle(32, 32, 30) +
  circle(32, 32, 25.4) +
  circle(32, 32, 21.4) +
  petals(8, 5.6, 19.6, 4.4) +
  circle(32, 32, 2.2)

const markInk = svg(`<path fill="${P.ink}" fill-rule="evenodd" d="${markPath}"/>`, 'Serenica mark')
const markPaper = svg(`<path fill="${P.paper}" fill-rule="evenodd" d="${markPath}"/>`, 'Serenica mark')

// Compact: a separate 16px drawing — thicker ring, four wide cuts, no eye.
const compactPath = circle(32, 32, 30) + circle(32, 32, 23.2) + circle(32, 32, 18.6) + petals(4, 5, 17.4, 5.9)
const compactInk = svg(`<path fill="${P.ink}" fill-rule="evenodd" d="${compactPath}"/>`, 'Serenica compact mark', 16)
const compactPaper = svg(`<path fill="${P.paper}" fill-rule="evenodd" d="${compactPath}"/>`, 'Serenica compact mark', 16)

// Glyph: the rosette alone, no ring, for pattern and watermark.
const glyphPath = circle(32, 32, 22.4) + petals(8, 5, 20.6, 4.7) + circle(32, 32, 2.2)
const glyph = svg(`<path fill="${P.ink}" fill-rule="evenodd" d="${glyphPath}"/>`, 'Serenica glyph')

/* ─────────────────────────── wordmark + lockups ─────────────────────────── */
const wmRaw = fs.readFileSync(path.join(BRAND, 'wordmark.svg'), 'utf8')
const wmVb = /viewBox="([^"]+)"/.exec(wmRaw)[1].split(/\s+/).map(Number)
const wmInner = wmRaw
  .replace(/<svg[^>]*>/, '')
  .replace('</svg>', '')
  .replace(/<g fill="currentColor">/, '<g>')
  .trim()
const wmPaths = wmInner.replace(/<\/?g[^>]*>/g, '')
const wmRatio = wmVb[3] / wmVb[2]

const wordmark = (fill, w = 260) => {
  const h = Math.round(w * wmRatio * 100) / 100
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wmVb[2]} ${wmVb[3]}" width="${w}" height="${h}" role="img" aria-label="Serenica"><g fill="${fill}">${wmPaths}</g></svg>\n`
}
fs.writeFileSync(path.join(BRAND, 'wordmark.svg'), wordmark(P.ink))
fs.writeFileSync(path.join(BRAND, 'wordmark-reverse.svg'), wordmark(P.paper))

// Horizontal lockup: mark 64, wordmark scaled to 40u cap, 16u gap, optical baseline.
const LOCK_H = 64
const WM_H = 40
const WM_W = Math.round((WM_H / wmRatio) * 100) / 100
const LOCK_W = 64 + 16 + WM_W
const lockup = (markFill, textFill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${N(LOCK_W)} ${LOCK_H}" width="${N(LOCK_W * 1.6)}" height="${LOCK_H * 1.6}" role="img" aria-label="Serenica">
  <g transform="translate(0 0)"><path fill="${markFill}" fill-rule="evenodd" d="${markPath}"/></g>
  <g transform="translate(80 ${N((LOCK_H - WM_H) / 2)}) scale(${N(WM_H / wmVb[3])})"><g fill="${textFill}">${wmPaths}</g></g>
</svg>\n`
fs.writeFileSync(path.join(BRAND, 'lockup.svg'), lockup(P.ink, P.ink))
fs.writeFileSync(path.join(BRAND, 'lockup-reverse.svg'), lockup(P.paper, P.paper))

// Stacked lockup: mark above, wordmark beneath, centred.
const SW_W = 300
const SW_WM = 250
const SW_H = Math.round(SW_WM * wmRatio)
const stacked = (markFill, textFill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SW_W} ${64 + 18 + SW_H}" width="${SW_W}" height="${64 + 18 + SW_H}" role="img" aria-label="Serenica">
  <g transform="translate(${N((SW_W - 64) / 2)} 0)"><path fill="${markFill}" fill-rule="evenodd" d="${markPath}"/></g>
  <g transform="translate(${N((SW_W - SW_WM) / 2)} ${64 + 18}) scale(${N(SW_WM / wmVb[2])})"><g fill="${textFill}">${wmPaths}</g></g>
</svg>\n`
fs.writeFileSync(path.join(BRAND, 'lockup-stacked.svg'), stacked(P.ink, P.ink))
fs.writeFileSync(path.join(BRAND, 'lockup-stacked-reverse.svg'), stacked(P.paper, P.paper))

fs.writeFileSync(path.join(BRAND, 'mark.svg'), markInk)
fs.writeFileSync(path.join(BRAND, 'mark-reverse.svg'), markPaper)
fs.writeFileSync(path.join(BRAND, 'mark-compact.svg'), compactInk)
fs.writeFileSync(path.join(BRAND, 'mark-compact-reverse.svg'), compactPaper)
fs.writeFileSync(path.join(BRAND, 'glyph.svg'), glyph)

/* ─────────────────────────── six-mark cast ─────────────────────────── */
const bar = (x, y, w, h) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`
const dome = (cx, y, r) => `M${N(cx - r)} ${y}A${r} ${r} 0 0 1 ${N(cx + r)} ${y}Z`

const CAST = [
  {
    id: 'ridge',
    name: 'Ridge',
    note: 'Six bands of depth, read front to back',
    d: bar(8, 46, 48, 6) + dome(19, 46, 9) + dome(33, 46, 13) + dome(47, 46, 7),
  },
  {
    id: 'petal',
    name: 'Petal',
    note: 'The unit the mark is counted in',
    d: petal(32, 52, 6, 46, 11, 0) + bar(14, 52, 36, 6),
  },
  {
    id: 'stem',
    name: 'Stem',
    note: 'One line up, two leaves off it',
    d: bar(30, 8, 4, 48) + `M30 38C22 36 17 31 16 24L24 27Z` + `M34 30C42 28 47 23 48 16L40 19Z`,
  },
  {
    id: 'mist',
    name: 'Mist',
    note: 'Haze between two ridges',
    d: bar(8, 20, 34, 6) + bar(22, 32, 34, 6) + bar(8, 44, 22, 6),
  },
  {
    id: 'hour',
    name: 'Hour',
    note: 'A session, cut out of the day',
    d: circle(32, 32, 22) + `M32 32L32 10A22 22 0 0 1 51.05 43Z`,
  },
  {
    id: 'hold',
    name: 'Hold',
    note: 'Two sides keeping a space open',
    d: bar(8, 14, 8, 36) + bar(8, 14, 18, 6) + bar(8, 44, 18, 6) + bar(48, 14, 8, 36) + bar(38, 14, 18, 6) + bar(38, 44, 18, 6),
  },
]
for (const c of CAST) {
  fs.writeFileSync(
    path.join(BRAND, 'cast', `${c.id}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="${c.name}"><path fill="${P.ink}" fill-rule="evenodd" d="${c.d}"/></svg>\n`,
  )
}

/* ─────────────────────────── six-ridge field plate ─────────────────────────── */
const rng = (seed) => {
  let a = (seed | 0) ^ 0x9e3779b9
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const layerSpec = (i, n, seed) => {
  const q = n > 1 ? i / (n - 1) : 1
  const rnd = rng(seed * 977 + i * 131 + 7)
  const count = q > 0.9 ? 2 : 3 + Math.floor(rnd() * 1.6)
  const domes = []
  const span = 2.8 / count
  const lean = i % 2 ? 1 : -1
  for (let k = 0; k < count; k++) {
    const c = -1.4 + (k + 0.15 + rnd() * 0.7) * span
    domes.push({
      c,
      w: (0.3 + rnd() * 0.32) * (1 + q * 0.7),
      h: 0.42 + rnd() * 0.42 + 0.16 * Math.max(0, Math.min(1, 0.5 + c * lean * 0.6)),
    })
  }
  return {
    q,
    base: 0.68 + q * 0.29,
    amp: 0.27 - q * 0.17,
    domes,
    waves: [
      { f: 1.6 + rnd() * 1.4, p: rnd() * 6.2832, a: 0.07 },
      { f: 4.5 + rnd() * 3, p: rnd() * 6.2832, a: 0.025 },
    ],
  }
}
const crestAt = (spec, x, W, H) => {
  const u = (x - W / 2) / 1000
  let sum = 0
  for (const d of spec.domes) {
    const z = (u - d.c) / d.w
    sum += Math.exp(14 * d.h * Math.exp(-z * z))
  }
  const top = Math.log(sum) / 14
  let wave = 0
  for (const o of spec.waves) wave += o.a * Math.sin(u * o.f * 6.2832 + o.p)
  return H * (spec.base - spec.amp * (top + wave))
}

const fieldSvg = (w = 1600, h = 900, seed = 3) => {
  const hills = [
    [P.sage, P.haze],
    [P.moss, P.sage],
    [P.clover, P.moss],
    [P.deep, P.clover],
    [P.ground, P.deep],
    ['#1B2413', P.ground],
  ]
  const n = hills.length
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Six ridges of printed grass under a pale sky">
  <rect width="${w}" height="${h}" fill="${P.chalk}"/>`
  // horizon rule, drawn once, above the range
  out += `<rect x="0" y="${Math.round(h * 0.46)}" width="${w}" height="1" fill="${P.ink}" opacity="0.16"/>`
  for (let i = 0; i < n; i++) {
    const spec = layerSpec(i, n, seed)
    const step = 4
    let d = `M0 ${h}`
    for (let x = 0; x <= w; x += step) d += `L${x} ${crestAt(spec, x, w, h).toFixed(1)}`
    d += `L${w} ${h}Z`
    out += `<path d="${d}" fill="${hills[i][1]}"/>`
    // a lit crest band: the same silhouette lifted a few units and clipped
    const lift = 6 + i * 2
    let d2 = `M0 ${h}`
    for (let x = 0; x <= w; x += step) d2 += `L${x} ${(crestAt(spec, x, w, h) - lift).toFixed(1)}`
    d2 += `L${w} ${h}Z`
    out += `<clipPath id="c${i}"><path d="${d}"/></clipPath><path d="${d2}" fill="${hills[i][0]}" clip-path="url(#c${i})"/>`
  }
  out += `<rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.16"/></svg>`
  out = out.replace(
    '</svg>',
    `<defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs></svg>`,
  )
  return out
}
fs.writeFileSync(path.join(BRAND, 'serenica-field.svg'), fieldSvg())

/* ─────────────────────────── contrast ledger ─────────────────────────── */
const PAIRS = [
  ['ink', 'paper', 'Body copy, headlines, every word on the page', 'text'],
  ['umber', 'paper', 'Secondary copy, captions, ledger labels', 'text'],
  ['ink', 'chalk', 'Type on the pale sky plate', 'text'],
  ['ink', 'haze', 'Type in the mist band', 'text'],
  ['ink', 'marigold', 'Label on the primary action', 'text'],
  ['paper', 'ground', 'Footer type on the darkened ground', 'text'],
  ['chalk', 'ground', 'Muted footer links on the ground', 'text'],
  ['marigold', 'ground', 'The action, on the closing band', 'text'],
  ['ink', 'sage', 'Type on the far ridge', 'text'],
  ['paper', 'clover', 'Type on the near ridge', 'text'],
  ['moss', 'paper', 'Ridge ink on stock — never a label', 'graphic'],
  ['sage', 'paper', 'Far ridge on stock — band fill only', 'graphic'],
  ['marigold', 'paper', 'The accent on stock — rule and dot only', 'graphic'],
  ['ink', 'glow', 'Type on the sky wash', 'text'],
]
const contrast = PAIRS.map(([a, b, job, kind]) => {
  const r = ratio(P[a], P[b])
  const pass = r >= 4.5
  return {
    fg: a,
    bg: b,
    fgHex: P[a],
    bgHex: P[b],
    ratio: Number(f2(r)),
    pass,
    job: pass ? job : `${job.split('—')[0].trim()} — graphic only, never type`,
    kind,
  }
})

const primitives = [
  { name: 'paper', value: P.paper, role: 'Uncoated stock — the page ground' },
  { name: 'chalk', value: P.chalk, role: 'Pale sky — plates, bands, cards' },
  { name: 'haze', value: P.haze, role: 'Mist between two ridges' },
  { name: 'sage', value: P.sage, role: 'Farthest ridge, seen through air' },
  { name: 'moss', value: P.moss, role: 'Mid ridge — rules, graphic fill' },
  { name: 'clover', value: P.clover, role: 'Near ridge — the loud green' },
  { name: 'deep', value: P.deep, role: 'Deep band, before the ground' },
  { name: 'ground', value: P.ground, role: 'The footer ground' },
  { name: 'ink', value: P.ink, role: 'Every word, the mark, the rules' },
  { name: 'umber', value: P.umber, role: 'Second ink — captions, labels' },
  { name: 'marigold', value: P.marigold, role: 'The one accent — the action only' },
  { name: 'glow', value: P.glow, role: 'Sky wash — graphic fill only' },
].map((p) => ({ ...p, oklch: toOklch(p.value) }))

/* ─────────────────────────── tokens.json ─────────────────────────── */
const TYPE = [
  { role: 'Display', face: 'Instrument Serif', weight: 400, size: 'clamp(46px, 6.4vw, 88px)', leading: '0.94', tracking: '-0.032em', sample: 'Heavier hours' },
  { role: 'Headline', face: 'Instrument Serif', weight: 400, size: 'clamp(30px, 3.6vw, 46px)', leading: '1.02', tracking: '-0.022em', sample: 'A field you can walk into' },
  { role: 'Subhead', face: 'Inter Tight', weight: 500, size: '20px', leading: '1.32', tracking: '-0.014em', sample: 'One conversation, nothing kept' },
  { role: 'Reading', face: 'Inter Tight', weight: 400, size: '17px', leading: '1.62', tracking: '-0.006em', sample: 'The hills are painted once per size, then composited.' },
  { role: 'Caption', face: 'Inter Tight', weight: 500, size: '13.5px', leading: '1.45', tracking: '0', sample: 'Plate 01 · six ridges, seed 3' },
  { role: 'Data', face: 'Geist Mono', weight: 400, size: '12px', leading: '1.4', tracking: '0.02em', sample: '01 / 07 · 4.83:1 · seed 3' },
]

const tokens = {
  meta: {
    name: NAME,
    slug: SLUG,
    namespace: `--${NS}-`,
    version: '1.0.0',
    case: CASE_NO,
    year: 2026,
    author: 'Sunnyside',
    archetype: 'printed meadow / field journal',
    primaryAccent: 'marigold',
    essence: 'Confidential support, one conversation away',
    promise:
      'Serenica is a listening service for the hours that will not lift on their own — soft, unhurried, and built so that nothing you say is kept after you close the tab.',
    family: 'One rosette: a ring, a disc, eight petals cut out of it.',
    track: 'constructed',
    oneSentence:
      'Serenica is a support identity printed like a field journal: uncoated stock, six flat inks for six ridges, a petal rosette cut from a single disc, and one marigold accent that only ever appears on the action.',
    gate: 'v4.8',
    contrastPairs: contrast.length,
    failingPairs: contrast.filter((c) => !c.pass).length,
    hero: 'C · live specimen stage first · relation below',
    rail: 'B · one 200px contents list for the page',
    footer: 'F3 · frozen specimen — the field at seed 3, held',
  },
  theme: {
    family: 'constructed — Kuwayama parametric vector, printed-matter material bias',
    material: 'uncoated stock, flat screen-print inks, six ridge greens, one marigold',
    edge: 'razor printed — 0px radius, 1px exposed hairlines, no shadow at rest',
    offset: 'none — a printed sheet casts nothing',
    stroke: 'zero line icons; filled geometry only, 4u minimum weight on the 64 grid',
    motion: 'one completion, never an entrance: the field rises once, then holds',
  },
  sections: [
    { n: '01', label: 'Premise', title: 'A support brand should feel like weather, not a form.' },
    { n: '02', label: 'Mark', title: 'A ring, a disc, eight petals cut out of it.' },
    { n: '03', label: 'Ink', title: 'Six greens, one marigold, and the pairs that fail.' },
    { n: '04', label: 'Surfaces', title: 'Six surfaces were tried. Four survived.' },
    { n: '05', label: 'Type', title: 'A serif that breathes, a grotesque that files.' },
    { n: '06', label: 'Kit', title: 'Controls printed, not rendered.' },
    { n: '07', label: 'Tokens', title: 'Five sheets and the audit that goes with them.' },
  ],
  primitives,
  contrast,
  type: TYPE,
  night: {
    scope: "[data-sr='night']",
    ground: '#0F1611',
    plate: '#18211A',
    raised: '#1F2A20',
    text: '#E7EBE1',
    text2: '#A9B49C',
    line: 'rgba(231, 235, 225, 0.16)',
  },
}
fs.writeFileSync(path.join(FEAT, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n')

/* ─────────────────────────── token CSS ─────────────────────────── */
const primCss = primitives.map((p) => `  --${NS}-${p.name}: ${p.value};`).join('\n')
const oklchCss = primitives.map((p) => `  --${NS}-oklch-${p.name}: ${p.oklch};`).join('\n')
const css = `/* ==========================================================================
   SERENICA · TOKENS (v1.0 · Case 23)
   Confidential support · Paper & ink · Rail B · Hero C
   Layer 1 primitives never flip. Only the semantic scope moves at night.
   ========================================================================== */

@font-face {
  font-family: 'Instrument Serif';
  src: url('/brand/serenica/fonts/InstrumentSerif-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Instrument Serif';
  src: url('/brand/serenica/fonts/InstrumentSerif-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'Inter Tight';
  src: url('/brand/serenica/fonts/InterTight-400.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Inter Tight';
  src: url('/brand/serenica/fonts/InterTight-500.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: 'Inter Tight';
  src: url('/brand/serenica/fonts/InterTight-600.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}

:root {
  /* 1 · primitives — the material, named once */
${primCss}

  /* 1b · perceptual strings (oklch) */
${oklchCss}

  /* 2 · semantic — daylight field (default scope) */
  --${NS}-bg-canvas: var(--${NS}-paper);
  --${NS}-bg-plate: var(--${NS}-chalk);
  --${NS}-bg-band: var(--${NS}-haze);
  --${NS}-bg-loud: var(--${NS}-ground);
  --${NS}-ink-primary: var(--${NS}-ink);
  --${NS}-ink-secondary: var(--${NS}-umber);
  --${NS}-ink-reverse: var(--${NS}-paper);
  --${NS}-line-strong: rgba(17, 20, 13, 0.28);
  --${NS}-line-subtle: rgba(17, 20, 13, 0.12);
  --${NS}-accent: var(--${NS}-marigold);
  --${NS}-accent-ink: var(--${NS}-ink);
  --${NS}-graphic-wash: var(--${NS}-glow);

  /* 3 · typography */
  --${NS}-font-display: 'Instrument Serif', 'Iowan Old Style', Georgia, serif;
  --${NS}-font-reading: 'Inter Tight', 'Instrument Sans', system-ui, sans-serif;
  --${NS}-font-mono: 'Geist Mono', ui-monospace, 'SFMono-Regular', monospace;

  /* 4 · physics — printed matter */
  --${NS}-radius: 0px;
  --${NS}-rule: 1px;
  --${NS}-wrap: 1200px;
  --${NS}-gutter: clamp(20px, 4vw, 56px);
  --${NS}-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --${NS}-transition: 260ms var(--${NS}-ease);

  /* 5 · component recipes */
  --${NS}-button-bg: var(--${NS}-accent);
  --${NS}-button-ink: var(--${NS}-accent-ink);
  --${NS}-button-ghost-ink: var(--${NS}-ink);
  --${NS}-field-rule: var(--${NS}-line-strong);
  --${NS}-chip-bg: transparent;
  --${NS}-chip-ink: var(--${NS}-umber);
  --${NS}-focus-ring: var(--${NS}-ink);
}

/* 2 · semantic — night scope (the moonlit preset the component already carries) */
[data-${NS}='night'] {
  --${NS}-bg-canvas: ${tokens.night.ground};
  --${NS}-bg-plate: ${tokens.night.plate};
  --${NS}-bg-band: ${tokens.night.raised};
  --${NS}-bg-loud: var(--${NS}-paper);
  --${NS}-ink-primary: ${tokens.night.text};
  --${NS}-ink-secondary: ${tokens.night.text2};
  --${NS}-ink-reverse: var(--${NS}-ground);
  --${NS}-line-strong: ${tokens.night.line};
  --${NS}-line-subtle: rgba(231, 235, 225, 0.09);
  --${NS}-accent: var(--${NS}-marigold);
  --${NS}-accent-ink: ${tokens.night.ground};
  --${NS}-graphic-wash: ${tokens.night.plate};
  --${NS}-field-rule: ${tokens.night.line};
  --${NS}-chip-ink: ${tokens.night.text2};
  --${NS}-focus-ring: ${tokens.night.text};
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --${NS}-transition: 0ms linear;
  }
}
`
fs.writeFileSync(path.join(FEAT, `${SLUG}-tokens.css`), css)

/* ─────────────────────────── DESIGN.md ─────────────────────────── */
const md = `# ${NAME} — agent spec (Case ${CASE_NO})

**Surface:** Paper & ink · **Rail:** B (200px contents list) · **Hero:** C, relation \`below\` · **Physics:** 0px radius, 1px rules, no shadow at rest.
**Scope:** dual — daylight field (\`:root\`) and night field (\`[data-${NS}='night']\`) over shared primitives.
**Footer:** F3, frozen specimen — the same six ridges at seed 3, held still.

## Rules an agent must not break
1. One accent only: \`--${NS}-marigold\` appears on the primary action and nowhere else on the first screen.
2. No gradients except the footer scrim, drawn in the ground colour, and no shadow at rest. A printed sheet casts nothing.
3. No mono outside code, the rail number, tabular figures and the one data stamp on the field.
4. Petal cuts are the mark. Never outline the rosette in a thin stroke, never redraw it as eight ellipses.
5. Below 24px swap to \`mark-compact.svg\`; it is a separate drawing with four wide cuts.
6. The field is six ridges, back to front, from \`sage\` to \`ground\`. Fewer than six and it reads as a hill, not a range.
7. Failing pairs (see tokens.json) are graphic only. Never set type in \`moss\`, \`sage\`, \`marigold\` or \`glow\`.

## Tokens
Layer 1 \`--${NS}-<material>\` never flips. Layer 2 \`--${NS}-bg-*\`, \`--${NS}-ink-*\`, \`--${NS}-line-*\`, \`--${NS}-accent\` is the only scope that moves. Layer 3 \`--${NS}-button-*\`, \`--${NS}-field-*\`, \`--${NS}-chip-*\` is where a component learns its recipe.

## Cast
\`ridge\` \`petal\` \`stem\` \`mist\` \`hour\` \`hold\` — one cut line, one flat fill, one job each.
`
fs.writeFileSync(path.join(FEAT, 'DESIGN.md'), md)

const failList = contrast.filter((c) => !c.pass)
console.log(`mark family + cast + field written → public/brand/${SLUG}`)
console.log(`tokens.json: ${primitives.length} primitives, ${contrast.length} pairs, ${failList.length} published fails`)
console.log(failList.map((c) => `  FAIL ${c.fg} on ${c.bg} = ${c.ratio}:1`).join('\n'))
