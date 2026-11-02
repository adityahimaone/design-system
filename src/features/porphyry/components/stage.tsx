'use client'

import * as React from 'react'

// Porphyry Stage — adapted from the supplied Old Masters preloader.
//
// A stage cut from one stone. The wordmark is the loader: it stands in the
// middle of a dark auditorium as hairline outlines and fills with marble from
// the bottom as the load climbs, inside a slowly turning Greek meander. At 100
// the stage floods with porphyry, the word settles to the floor, and a cast of
// statues rises out of the dark in front of it, each on its own depth. The
// photographs are keyed off their black grounds by their own luminance (an SVG
// mask, no cut-outs), graded as a two-ink print, lit by volumetric shafts and
// drifting dust.
//
// Changes from the source component:
//   · the random uid is now React.useId(), so SSR and hydration agree;
//   · the src-list template literal is repaired (it arrived with raw newlines);
//   · fonts are self-hosted and Cinzel is a first-class face;
//   · prefers-reduced-motion opens on the landing instead of counting up;
//   · the wordmark is an h2, because this is an embedded specimen.

export interface PorphyryLink {
  label: string
  href?: string
}

export interface PorphyryAside {
  title: string
  text: string
}

export interface PorphyryAnnotation {
  /** Left edge, percent of the stage width. */
  x: number
  /** Top edge, percent of the stage height. */
  y: number
  label: string
}

export interface PorphyryFigure {
  /** A statue photographed on a black (or, with subject "dark", a white) ground. */
  src: string
  alt?: string
  /** Horizontal centre, percent of the stage width. */
  x: number
  /** Where the feet stand, percent of the stage height. 100 is the floor. */
  y?: number
  /** Height, percent of the stage height. */
  h: number
  /** Parallax and entrance depth. 1 is the stage; more is nearer. */
  depth?: number
  /** Mirror the photograph. */
  flip?: boolean
  /** "light": lit marble on a dark ground. "dark": ink on paper. */
  subject?: 'light' | 'dark'
  /** Luminance, 0–1, where the ground becomes the figure. */
  threshold?: number
  /** Width of the soft edge round that threshold, 0–1. */
  softness?: number
  /** Keep this figure on narrow stages. */
  phone?: boolean
}

export interface PorphyryPalette {
  /** Stage colour once it has flooded. */
  stage: string
  /** The dark of the stage before the flood, and the deepest shadow of the print. */
  ground: string
  /** Interface text. */
  text: string
  /** Secondary text. */
  muted: string
  /** The meander, the stars, the script initial, the tags. */
  accent: string
  /** The wordmark. */
  word: string
  /** Hairlines and outlines. */
  rule: string
  /** The light: shafts, the flash. */
  glow: string
  /** The lit marble of the two-ink print. */
  highlight: string
}

export type PorphyryTone = 'noir' | 'carmine' | 'vellum'
export type PorphyryFace = 'cinzel' | 'didone' | 'condensed' | 'grotesk'

export interface PorphyryStageProps {
  /** Real progress, 0–100. Leave it out to run a simulated load. */
  progress?: number
  /** Length of the simulated load. */
  durationMs?: number
  /** The word is shown filling at least this long, however fast the load. */
  minLoadMs?: number
  /** A click, Enter, Space or the Skip control rushes the load to 100. */
  skippable?: boolean
  /** Open straight on the landing, for repeat visits. */
  skipIntro?: boolean
  /** The cast. Each one is keyed off its own ground and stands on the floor. */
  figures?: readonly PorphyryFigure[]
  /** A photograph behind everything, darkened and softened. null for none. */
  backdrop?: string | null
  /** Figures nearer than this stand in front of the word; the rest stand behind it. */
  wordDepth?: number
  /** Brightness multiplier for the figures once they are up. */
  exposure?: number
  /** Grade the figures as a two-ink print between ground and glow. Defaults on for carmine. */
  duotone?: boolean
  /** Volumetric light from above. */
  rays?: boolean
  /** Dust drifting in the light. */
  dust?: boolean
  /** How far the scene tilts under the pointer, in degrees. 0 for none. */
  tilt?: number
  /** The large word. Fitted to the width of the stage. */
  wordmark?: string
  face?: PorphyryFace
  /** Set the first letter in a script face, overlapping the rest. */
  scriptInitial?: boolean
  tagline?: string
  /** Small line set into the top rule. */
  eyebrow?: string
  /** The mark in the middle of the nav. */
  brand?: React.ReactNode
  /** Split left and right of the brand. Hidden on narrow screens. */
  nav?: readonly PorphyryLink[]
  /** Two outlined labels under the nav, left and right. */
  labels?: readonly string[]
  /** Two short columns beside the cast, left and right. Wide screens only. */
  asides?: readonly PorphyryAside[]
  /** Bracketed measurement tags drawn over the scene after the unveil. */
  annotations?: readonly PorphyryAnnotation[]
  /** Plate number, bottom right. */
  plate?: string
  /** Beside the counter while it loads. */
  loadingLabel?: string
  cta?: PorphyryLink
  /** Fired when the call to action is pressed. */
  onEnter?: () => void
  /** Fired once the landing is up. */
  onLoaded?: () => void
  /** With children: fired once the stage has lifted off them. */
  onComplete?: () => void
  /** The page behind the stage. The stage lifts off it after holdMs, on a scroll, or on the call to action. */
  children?: React.ReactNode
  /** With children: how long the landing holds before lifting on its own. 0 waits for a scroll or the call to action. */
  holdMs?: number
  /** With children: a wheel or a swipe lifts the stage. */
  scrollToEnter?: boolean
  tone?: PorphyryTone
  /** Partial overrides of the tone's palette. */
  palette?: PorphyryPaletteOverride
  /** Stylesheet for the faces. null loads nothing (the faces are self-hosted). */
  fontHref?: string | null
  /** Root height. A definite length, never a percentage. */
  height?: string
  className?: string
}

const FONT_PROBES = [
  '400 1em "Cinzel"',
  '400 1em "Jost"',
  '400 1em "Pinyon Script"',
  '500 1em "Jost"',
]

const FACES = {
  cinzel: {
    family: '"Cinzel", "Trajan Pro", "Times New Roman", serif',
    weight: 400,
    tracking: 0.035,
  },
  didone: {
    family:
      '"Bodoni Moda", "Didot", "Bodoni 72", "Playfair Display", "Times New Roman", serif',
    weight: 400,
    tracking: -0.01,
  },
  condensed: {
    family: '"Bebas Neue", "Oswald", "Impact", "Arial Narrow", sans-serif',
    weight: 400,
    tracking: 0.02,
  },
  grotesk: {
    family: '"Jost", "Futura", "Helvetica Neue", Arial, sans-serif',
    weight: 500,
    tracking: -0.035,
  },
}

const SCRIPT_FAMILY =
  '"Pinyon Script", "Snell Roundhand", "Apple Chancery", "Brush Script MT", cursive'
const UI_FAMILY = '"Jost", "Futura", "Helvetica Neue", Arial, sans-serif'
const SERIF_FAMILY = '"Cinzel", "Trajan Pro", "Times New Roman", serif'

const TONES = {
  noir: {
    stage: '#2a0d1a',
    ground: '#140a0e',
    text: '#f2ead9',
    muted: '#b7a99b',
    accent: '#c9a45c',
    word: '#f2ead9',
    rule: '#4a3238',
    glow: '#ffd9a0',
    highlight: '#f0d7a4',
  },
  carmine: {
    stage: '#5e1731',
    ground: '#1a070c',
    text: '#f6ead6',
    muted: '#d3a9ad',
    accent: '#e3c98e',
    word: '#f8eedc',
    rule: '#8c3350',
    glow: '#ffdcb0',
    highlight: '#f0b08f',
  },
  vellum: {
    stage: '#e8ddc6',
    ground: '#d9ccb0',
    text: '#241017',
    muted: '#6f5f57',
    accent: '#7a1f3d',
    word: '#241017',
    rule: '#c7b58f',
    glow: '#fff6e0',
    highlight: '#ffffff',
  },
}

const CAST = '/brand/porphyry/cast'

const DEFAULT_FIGURES: readonly PorphyryFigure[] = [
  {
    src: `${CAST}/apollo.jpg`,
    alt: 'The Apollo Belvedere, photographed against black',
    x: 20,
    y: 101,
    h: 58,
    depth: 1.25,
    flip: true,
    phone: false,
  },
  {
    src: `${CAST}/hercules.jpg`,
    alt: 'The torso of a marble Hercules',
    x: 82,
    y: 102,
    h: 66,
    depth: 1.15,
    phone: false,
  },
  {
    src: `${CAST}/flowers.jpg`,
    alt: 'A marble figure holding flowers, on a pedestal',
    x: 52,
    y: 101,
    h: 96,
    depth: 0.8,
  },
]

const DEFAULT_BACKDROP = `${CAST}/david.jpg`

const DEFAULT_NAV: readonly PorphyryLink[] = [
  { label: 'Stage' },
  { label: 'Cast' },
  { label: 'Stone' },
  { label: 'Type' },
]
const DEFAULT_LABELS = ['Ars longa', 'Vita brevis']
const DEFAULT_ASIDES: readonly PorphyryAside[] = [
  {
    title: 'The stage',
    text: 'A screen composed like a diorama: one ground, one light, and figures that stand on their own depth. The word is the back wall.',
  },
  {
    title: 'The cast',
    text: 'Photographs of marble, keyed off their black ground by luminance and graded as a two-ink print. No cut-outs, no alpha edges.',
  },
]
const DEFAULT_ANNOTATIONS: readonly PorphyryAnnotation[] = [
  { x: 34, y: 42, label: '0.7324' },
  { x: 67, y: 34, label: '1.1429' },
  { x: 49, y: 57, label: '1.0000' },
]

const UNVEIL_MS = 3000
const EXIT_MS = 1250

// #region timeline
// Pure helpers. They are deterministic, so the grain, the dust and the plate
// barcode are the same on every mount.

const OM_CURVE = [
  [0, 0],
  [0.1, 0.14],
  [0.26, 0.2],
  [0.4, 0.52],
  [0.5, 0.56],
  [0.72, 0.84],
  [0.82, 0.88],
  [1, 1],
]

/** A simulated load that surges and stalls, 0–1 in, 0–1 out, never backwards. */
export function omSimulated(t: number) {
  if (!(t > 0)) return 0
  if (t >= 1) return 1
  for (let i = 1; i < OM_CURVE.length; i++) {
    const [t0, p0] = OM_CURVE[i - 1]
    const [t1, p1] = OM_CURVE[i]
    if (t <= t1) {
      const u = (t - t0) / (t1 - t0)
      const s = u * u * (3 - 2 * u)
      return p0 + (p1 - p0) * s
    }
  }
  return 1
}

/** Progress as the ratio read-out: 0.4700. */
export function omRatio(p: number) {
  const v = Math.min(1, Math.max(0, p))
  return v.toFixed(4)
}

const round2 = (v: number) => Math.round(v * 100) / 100 + 0

/**
 * A Greek meander (key) engraved round a circle, as one continuous path. Each
 * unit is a hook drawn in band coordinates (u along the ring, v across it) and
 * bent onto the circle: tangential strokes become arcs, radial strokes lines.
 */
export function omMeander(
  cx: number,
  cy: number,
  r: number,
  depth: number,
  units: number,
) {
  const n = Math.max(4, Math.floor(units))
  const unit = (Math.PI * 2) / n
  const hook = [
    [0, 0],
    [0, 3],
    [4, 3],
    [4, 2],
    [2, 2],
    [2, 0],
    [6, 0],
  ]
  const at = (u: number, v: number) => {
    const a = -Math.PI / 2 + (u / 6) * unit
    const rr = r + (v / 3 - 0.5) * depth
    return [
      round2(cx + Math.cos(a) * rr),
      round2(cy + Math.sin(a) * rr),
      round2(rr),
    ]
  }
  let d = ''
  let prevV = 0
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < hook.length; k++) {
      if (i > 0 && k === 0) continue
      const [hu, hv] = hook[k]
      const [x, y, rr] = at(i * 6 + hu, hv)
      if (i === 0 && k === 0) d = 'M' + x + ' ' + y
      else if (hv === prevV) d += ' A' + rr + ' ' + rr + ' 0 0 1 ' + x + ' ' + y
      else d += ' L' + x + ' ' + y
      prevV = hv
    }
  }
  return d
}

/** The rect an image takes when it covers w × h, anchored at focal [fx, fy]. */
export function omCover(
  iw: number,
  ih: number,
  w: number,
  h: number,
  fx: number,
  fy: number,
) {
  if (!(iw > 0) || !(ih > 0) || !(w > 0) || !(h > 0))
    return { x: 0, y: 0, w: Math.max(0, w), h: Math.max(0, h) }
  const s = Math.max(w / iw, h / ih)
  const cw = iw * s
  const ch = ih * s
  const cx = Math.min(1, Math.max(0, fx))
  const cy = Math.min(1, Math.max(0, fy))
  return {
    x: round2((w - cw) * cx),
    y: round2((h - ch) * cy),
    w: round2(cw),
    h: round2(ch),
  }
}

/** Where a figure stands: its box in px from the stage size and its natural aspect. */
export function omFigureBox(
  x: number,
  y: number,
  h: number,
  aspect: number,
  stageW: number,
  stageH: number,
) {
  if (!(stageW > 0) || !(stageH > 0)) return { left: 0, top: 0, w: 0, h: 0 }
  const a = aspect > 0 ? aspect : 0.6
  const ph = (h / 100) * stageH
  const pw = ph * a
  return {
    left: round2((x / 100) * stageW - pw / 2),
    top: round2((y / 100) * stageH - ph),
    w: round2(pw),
    h: round2(ph),
  }
}

/** Font size that sets a word measured at w100 (px at 100px) into avail, capped. */
export function omFit(
  w100: number,
  avail: number,
  maxFs: number,
  minFs: number,
) {
  if (!(w100 > 0) || !(avail > 0)) return minFs
  const fs = (avail / w100) * 100
  return Math.max(minFs, Math.min(maxFs, fs))
}

/** A linear transfer that turns luminance into mask coverage round a threshold. */
export function omTransfer(
  threshold: number,
  softness: number,
  subject: 'light' | 'dark',
) {
  const soft = Math.max(0.02, Math.min(1, softness))
  const th = Math.min(1, Math.max(0, threshold))
  if (subject === 'light')
    return {
      slope: round2(1 / soft),
      intercept: round2(-(th - soft / 2) / soft),
    }
  return {
    slope: round2(-1 / soft),
    intercept: round2((th + soft / 2) / soft),
  }
}

/** A small seeded generator so the grain, the dust and the barcode are the same on every mount. */
export function omRng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s >>>= 0
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return s / 4294967296
  }
}

export function omHash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h || 1
}

/** Bars of a plate barcode across width: [{ x, w }]. */
export function omBars(seed: number, count: number, width: number) {
  const rnd = omRng(seed)
  const bars: { x: number; w: number }[] = []
  const pitch = width / Math.max(1, count)
  for (let i = 0; i < count; i++) {
    const w = Math.max(1, Math.round(pitch * (0.25 + rnd() * 0.55)))
    bars.push({ x: round2(i * pitch), w })
  }
  return bars
}

/** The wordmark split into its script initial and the rest. */
export function omSplit(word: string, script: boolean) {
  const chars = Array.from(word)
  if (!script || chars.length === 0) return { initial: '', rest: chars }
  return { initial: chars[0], rest: chars.slice(1) }
}

/**
 * Where the baseline sits in a line-height: 1 box, as a fraction of the font
 * size from the bottom, given the face's ascent and descent in em.
 */
export function omBaseline(ascent: number, descent: number) {
  if (!(ascent > 0) || !(descent >= 0)) return 0.2
  return round2(((1 + descent - ascent) / 2) * 100) / 100
}

/** Which figure the pointer is nearest, by horizontal centre; -1 when none is close. */
export function omNearest(px: number, centres: number[], reach: number) {
  let best = -1
  let bestD = reach
  for (let i = 0; i < centres.length; i++) {
    const d = Math.abs(centres[i] - px)
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return best
}
// #endregion

const STAGE_CSS = `
.po-om-root { position: relative; width: 100%; overflow: hidden; background: var(--po-om-ground); color: var(--po-om-text); font-family: var(--po-om-ui); -webkit-font-smoothing: antialiased; --po-om-px: 0; --po-om-py: 0; --po-om-sx: 50%; --po-om-sy: 40%; --po-om-gap: 90px; --po-om-fill: 0%; --po-om-lift: 0px; }
.po-om-root svg, .po-om-root canvas, .po-om-root img { max-width: none; }
.po-om-root a { color: inherit; text-decoration: none; }
.po-om-root button { font: inherit; color: inherit; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; }
.po-om-root :focus-visible { outline: 1px solid var(--po-om-accent); outline-offset: 4px; }
.po-om-defs { position: absolute; width: 0; height: 0; overflow: hidden; }
.po-om-page { position: absolute; inset: 0; overflow: auto; }
.po-om-stage { position: absolute; inset: 0; overflow: hidden; background: var(--po-om-ground); clip-path: inset(0 0 0 0); }
.po-om-root[data-phase="exit"] .po-om-stage { clip-path: inset(0 0 100% 0); transition: clip-path 1.2s cubic-bezier(0.76, 0, 0.24, 1); }
.po-om-root[data-phase="exit"] .po-om-cast { transform: translate3d(0, -12%, 0); transition: transform 1.2s cubic-bezier(0.76, 0, 0.24, 1); }
.po-om-root[data-phase="exit"] .po-om-chrome { opacity: 0; transition: opacity 0.5s ease; }

/* ---- the flood, the backdrop, the light ---------------------------------- */
.po-om-flood { position: absolute; inset: 0; background: radial-gradient(ellipse 90% 80% at 50% 110%, var(--po-om-stage-l) 0%, var(--po-om-stage) 55%, var(--po-om-stage-d) 100%); clip-path: circle(0% at 50% 56%); }
.po-om-root[data-phase="unveil"] .po-om-flood, .po-om-root[data-phase="landing"] .po-om-flood, .po-om-root[data-phase="exit"] .po-om-flood { clip-path: circle(120% at 50% 56%); transition: clip-path 1.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s; }
.po-om-backdrop { position: absolute; display: block; opacity: 0; filter: grayscale(1) contrast(1.15) brightness(0.55) blur(3px); transform: translate3d(calc(var(--po-om-px) * 4px), calc(var(--po-om-py) * 3px), 0) scale(1.06); }
.po-om-root[data-phase="landing"] .po-om-backdrop, .po-om-root[data-phase="exit"] .po-om-backdrop, .po-om-root[data-phase="unveil"] .po-om-backdrop { opacity: 0.42; transition: opacity 2.4s ease 0.9s; }
.po-om-root[data-tone="vellum"] .po-om-backdrop { filter: grayscale(1) contrast(1.1) brightness(1.15) blur(3px); mix-blend-mode: multiply; }
.po-om-light { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; mix-blend-mode: screen; opacity: 0; filter: blur(4px); }
.po-om-root[data-tone="vellum"] .po-om-light { mix-blend-mode: multiply; }
.po-om-root[data-phase="landing"] .po-om-light, .po-om-root[data-phase="exit"] .po-om-light, .po-om-root[data-phase="unveil"] .po-om-light { opacity: 1; transition: opacity 2.6s ease 1.1s; }
.po-om-spot { position: absolute; inset: -20%; pointer-events: none; mix-blend-mode: screen; opacity: 0; background: radial-gradient(circle 30vmax at var(--po-om-sx) var(--po-om-sy), var(--po-om-glow-a) 0%, transparent 62%); transition: opacity 1.2s ease 1.6s; }
.po-om-root[data-tone="vellum"] .po-om-spot { mix-blend-mode: soft-light; }
.po-om-root[data-phase="landing"] .po-om-spot, .po-om-root[data-phase="exit"] .po-om-spot { opacity: 1; }
.po-om-flash { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at 50% 50%, var(--po-om-glow-b) 0%, transparent 50%); opacity: 0; }
.po-om-root[data-phase="unveil"] .po-om-flash { animation: po-om-flash 1.2s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
@keyframes po-om-flash { 0% { opacity: 0; } 10% { opacity: 1; } 100% { opacity: 0; } }
.po-om-grain { position: absolute; inset: -32px; pointer-events: none; background-repeat: repeat; background-size: 160px 160px; opacity: var(--po-om-grain); mix-blend-mode: overlay; animation: po-om-grain 0.5s steps(1) infinite; }
@keyframes po-om-grain { 0% { transform: translate(0, 0); } 25% { transform: translate(-16px, 9px); } 50% { transform: translate(11px, -14px); } 75% { transform: translate(-7px, -19px); } }
.po-om-vignette { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 80% 70% at 50% 45%, transparent 55%, var(--po-om-ground-a) 100%); opacity: 0; }
.po-om-root[data-phase="landing"] .po-om-vignette, .po-om-root[data-phase="exit"] .po-om-vignette { opacity: 1; transition: opacity 2s ease 1s; }

/* ---- the meander ---------------------------------------------------------- */
.po-om-ring { position: absolute; left: 50%; top: 50%; width: var(--po-om-ring); height: var(--po-om-ring); transform: translate(-50%, -50%); overflow: visible; }
.po-om-ring-spin { transform-origin: 200px 200px; animation: po-om-spin 90s linear infinite; }
@keyframes po-om-spin { to { transform: rotate(360deg); } }
.po-om-ring-hair { fill: none; stroke: var(--po-om-rule); stroke-width: 1; vector-effect: non-scaling-stroke; opacity: 0; transition: opacity 1.4s ease 0.4s; }
.po-om-ring-key { fill: none; stroke: var(--po-om-accent); stroke-width: 1.3; vector-effect: non-scaling-stroke; stroke-linejoin: miter; stroke-linecap: butt; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: opacity 0.6s ease 0.4s, stroke-dashoffset 2.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s; }
.po-om-root[data-up="true"] .po-om-ring-hair { opacity: 0.8; }
.po-om-root[data-up="true"] .po-om-ring-key { opacity: 0.55; stroke-dashoffset: 0; }
.po-om-root[data-phase="unveil"] .po-om-ring, .po-om-root[data-phase="landing"] .po-om-ring, .po-om-root[data-phase="exit"] .po-om-ring { transform: translate(-50%, -50%) scale(2.6); opacity: 0; transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, opacity 1s ease 0.25s; pointer-events: none; }
.po-om-root[data-phase="unveil"] .po-om-ring-key { stroke: var(--po-om-glow); opacity: 1; filter: drop-shadow(0 0 6px var(--po-om-glow)); transition: stroke 0.25s ease, opacity 0.25s ease; }

/* ---- the word ------------------------------------------------------------ */
.po-om-wordlayer { position: absolute; inset: 0; pointer-events: none; z-index: 3; }
.po-om-wordclip { position: absolute; left: 0; right: 0; bottom: 0; height: calc(var(--po-om-fs) * (var(--po-om-cap) + 0.2) + 1.4vh); overflow: visible; }
.po-om-word { position: absolute; left: 0; right: 0; bottom: calc(var(--po-om-fs) * var(--po-om-base) * -1 + 1.4vh); margin: 0; text-align: center; white-space: nowrap; font-family: var(--po-om-face); font-weight: var(--po-om-weight); font-size: var(--po-om-fs); line-height: 1; letter-spacing: calc(var(--po-om-tracking) * 1em); text-transform: uppercase; transform: translate3d(calc(var(--po-om-px) * 8px), calc(var(--po-om-lift) + var(--po-om-py) * 5px), 0); transition: transform 1.6s cubic-bezier(0.7, 0, 0.18, 1) 0.35s; }
.po-om-root[data-phase="load"] .po-om-wordlayer { z-index: 5; }
.po-om-root[data-phase="load"] .po-om-word { transition: none; }
.po-om-l, .po-om-init { display: inline-block; pointer-events: auto; color: transparent; -webkit-text-stroke: 1px var(--po-om-word-a); background-image: linear-gradient(to top, var(--po-om-word) 0%, var(--po-om-word) calc(var(--po-om-fill) - 1.2%), var(--po-om-glow) calc(var(--po-om-fill) - 0.4%), var(--po-om-glow) calc(var(--po-om-fill) + 0.3%), transparent calc(var(--po-om-fill) + 1.4%)); -webkit-background-clip: text; background-clip: text; opacity: 0; transform: translate3d(0, 10px, 0); transition: opacity 0.9s ease calc(0.5s + var(--i) * 55ms), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) calc(0.5s + var(--i) * 55ms), -webkit-text-stroke-color 0.4s ease, background-image 0.4s ease; }
.po-om-root[data-up="true"] .po-om-l, .po-om-root[data-up="true"] .po-om-init { opacity: 1; transform: none; }
.po-om-root[data-phase="landing"] .po-om-l, .po-om-root[data-phase="exit"] .po-om-l, .po-om-root[data-phase="unveil"] .po-om-l, .po-om-root[data-phase="landing"] .po-om-init, .po-om-root[data-phase="exit"] .po-om-init, .po-om-root[data-phase="unveil"] .po-om-init { background-image: linear-gradient(to top, var(--po-om-word), var(--po-om-word)); -webkit-text-stroke-color: transparent; }
.po-om-root[data-phase="landing"] .po-om-l:hover { background-image: linear-gradient(to top, transparent, transparent); -webkit-text-stroke-color: var(--po-om-word); transition: background-image 0.25s ease, -webkit-text-stroke-color 0.25s ease; }
.po-om-root[data-phase="landing"] .po-om-init, .po-om-root[data-phase="exit"] .po-om-init, .po-om-root[data-phase="unveil"] .po-om-init { background-image: linear-gradient(to top, var(--po-om-accent), var(--po-om-accent)); }
.po-om-sheen { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(115deg, transparent 30%, var(--po-om-glow-c) 48%, var(--po-om-glow-d) 50%, var(--po-om-glow-c) 52%, transparent 70%); background-size: 260% 100%; background-position: 120% 0; opacity: 0; mix-blend-mode: screen; }
.po-om-root[data-phase="unveil"] .po-om-sheen { animation: po-om-sheen 1.1s cubic-bezier(0.4, 0, 0.2, 1) both; }
@keyframes po-om-sheen { 0% { opacity: 1; background-position: 120% 0; } 100% { opacity: 1; background-position: -40% 0; } }
.po-om-sp { display: inline-block; width: 0.26em; }
.po-om-init { font-family: var(--po-om-script); font-weight: 400; font-size: 1.32em; line-height: 1; letter-spacing: 0; text-transform: none; margin-right: -0.14em; position: relative; z-index: 1; vertical-align: baseline; -webkit-text-stroke-color: var(--po-om-accent-a); background-image: linear-gradient(to top, var(--po-om-accent) 0%, var(--po-om-accent) calc(var(--po-om-fill) - 1.2%), var(--po-om-glow) calc(var(--po-om-fill) - 0.4%), var(--po-om-glow) calc(var(--po-om-fill) + 0.3%), transparent calc(var(--po-om-fill) + 1.4%)); }

/* ---- the cast ------------------------------------------------------------ */
.po-om-cast { position: absolute; inset: 0; pointer-events: none; perspective: 1400px; perspective-origin: 50% 40%; z-index: 2; }
.po-om-cast-front { z-index: 4; }
.po-om-root[data-narrow="true"] .po-om-wordlayer { z-index: 5; }
.po-om-tilt { position: absolute; inset: 0; transform-style: preserve-3d; transform: rotateX(calc(var(--po-om-py) * var(--po-om-tilt) * -1deg)) rotateY(calc(var(--po-om-px) * var(--po-om-tilt) * 1deg)); }
.po-om-fig { position: absolute; transform-origin: 50% 100%; transform: translate3d(calc(var(--po-om-px) * var(--po-om-depth) * 22px), calc(28% + var(--po-om-py) * var(--po-om-depth) * 10px), 0); opacity: 0; filter: brightness(0.6); will-change: transform, opacity; }
.po-om-root[data-phase="unveil"] .po-om-fig, .po-om-root[data-phase="landing"] .po-om-fig, .po-om-root[data-phase="exit"] .po-om-fig { opacity: 1; filter: brightness(var(--po-om-exposure)); transform: translate3d(calc(var(--po-om-px) * var(--po-om-depth) * 22px), calc(var(--po-om-py) * var(--po-om-depth) * 10px + var(--po-om-bob)), 0); transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1) calc(0.65s + var(--i) * 0.24s), opacity 1.2s ease calc(0.65s + var(--i) * 0.24s), filter 2s ease calc(0.65s + var(--i) * 0.24s); }
.po-om-root[data-phase="landing"] .po-om-fig { transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s ease; }
.po-om-root[data-phase="landing"] .po-om-fig[data-near="true"] { filter: brightness(calc(var(--po-om-exposure) * 1.08)); transform: translate3d(calc(var(--po-om-px) * var(--po-om-depth) * 22px), calc(var(--po-om-py) * var(--po-om-depth) * 10px - 10px), 0) scale(1.018); }
.po-om-fig-in { position: absolute; inset: 0; animation: po-om-bob 9s ease-in-out infinite; animation-delay: calc(var(--i) * -3s); }
@keyframes po-om-bob { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -0.6%, 0); } }
.po-om-fig img { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: fill; }
.po-om-fig[data-flip="true"] img { transform: scaleX(-1); }
.po-om-root[data-duotone="true"] .po-om-fig img { filter: grayscale(1) contrast(1.12); }
.po-om-duo { position: absolute; inset: 0; pointer-events: none; display: none; }
.po-om-root[data-duotone="true"] .po-om-duo { display: block; }
.po-om-duo-a { background: var(--po-om-ground); mix-blend-mode: lighten; }
.po-om-duo-b { background: var(--po-om-highlight); mix-blend-mode: multiply; }
.po-om-fig-shadow { position: absolute; left: 10%; right: 10%; bottom: -1.5%; height: 6%; border-radius: 50%; background: radial-gradient(ellipse at 50% 50%, var(--po-om-ground-b) 0%, transparent 70%); filter: blur(6px); }

/* ---- interface ------------------------------------------------------------ */
.po-om-chrome { position: absolute; inset: 0; pointer-events: none; z-index: 6; }
.po-om-chrome > * { pointer-events: auto; }
.po-om-ui { font-family: var(--po-om-ui); font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 500; }
.po-om-top { position: absolute; left: 0; right: 0; top: 0; height: 64px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 0 clamp(18px, 3.2vw, 48px); }
.po-om-rule { position: absolute; left: clamp(18px, 3.2vw, 48px); right: clamp(18px, 3.2vw, 48px); top: 64px; height: 1px; background: var(--po-om-rule); transform: scaleX(0); transform-origin: 50% 50%; transition: transform 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.2s; }
.po-om-rule[data-gap="true"] { -webkit-mask-image: linear-gradient(to right, #000 calc(50% - var(--po-om-gap)), transparent calc(50% - var(--po-om-gap)), transparent calc(50% + var(--po-om-gap)), #000 calc(50% + var(--po-om-gap))); mask-image: linear-gradient(to right, #000 calc(50% - var(--po-om-gap)), transparent calc(50% - var(--po-om-gap)), transparent calc(50% + var(--po-om-gap)), #000 calc(50% + var(--po-om-gap))); }
.po-om-root[data-up="true"] .po-om-rule { transform: scaleX(1); }
.po-om-eyebrow { position: absolute; left: 50%; top: 64px; transform: translate(-50%, -50%); color: var(--po-om-muted); font-size: 10.5px; letter-spacing: 0.3em; white-space: nowrap; opacity: 0; transition: opacity 0.9s ease 0.9s; }
.po-om-root[data-up="true"] .po-om-eyebrow { opacity: 1; }
.po-om-navl, .po-om-navr { display: flex; gap: clamp(18px, 2.4vw, 36px); margin: 0; padding: 0; list-style: none; }
.po-om-navr { justify-content: flex-end; }
.po-om-navl li, .po-om-navr li { opacity: 0; transform: translateY(6px); transition: opacity 0.7s ease calc(0.5s + var(--i) * 70ms), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) calc(0.5s + var(--i) * 70ms); }
.po-om-root[data-up="true"] .po-om-navl li, .po-om-root[data-up="true"] .po-om-navr li { opacity: 1; transform: none; }
.po-om-navl a, .po-om-navl button, .po-om-navr a, .po-om-navr button { position: relative; display: inline-block; padding: 6px 0; color: var(--po-om-text); opacity: 0.8; transition: opacity 0.3s ease; }
.po-om-navl a:hover, .po-om-navl button:hover, .po-om-navr a:hover, .po-om-navr button:hover { opacity: 1; }
.po-om-navl a::after, .po-om-navl button::after, .po-om-navr a::after, .po-om-navr button::after { content: ""; position: absolute; left: 0; right: 0; bottom: 2px; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: 0 50%; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.po-om-navl a:hover::after, .po-om-navl button:hover::after, .po-om-navr a:hover::after, .po-om-navr button:hover::after { transform: scaleX(1); }
.po-om-brand { display: flex; align-items: center; justify-content: center; font-family: var(--po-om-serif); font-size: 20px; font-style: normal; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 400; color: var(--po-om-text); opacity: 0; transition: opacity 0.9s ease 0.4s; }
.po-om-brand svg { display: block; width: 24px; height: 24px; }
.po-om-root[data-up="true"] .po-om-brand { opacity: 1; }
.po-om-pill { position: absolute; top: 96px; padding: 7px 15px 6px; border: 1px solid var(--po-om-rule); border-radius: 999px; color: var(--po-om-text); font-size: 10.5px; letter-spacing: 0.24em; white-space: nowrap; opacity: 0; transform: translateY(4px); transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.po-om-pill-l { left: clamp(18px, 7vw, 120px); }
.po-om-pill-r { right: clamp(18px, 7vw, 120px); }
.po-om-root[data-pills="1"] .po-om-pill-l, .po-om-root[data-pills="2"] .po-om-pill { opacity: 1; transform: none; }
.po-om-star { position: absolute; width: 18px; height: 18px; color: var(--po-om-accent); opacity: 0; transform: scale(0.4) rotate(-30deg); transition: opacity 0.9s ease calc(0.6s + var(--i) * 140ms), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) calc(0.6s + var(--i) * 140ms), left 1.6s cubic-bezier(0.16, 1, 0.3, 1), top 1.6s cubic-bezier(0.16, 1, 0.3, 1); }
.po-om-root[data-up="true"] .po-om-star { opacity: 1; transform: none; }
.po-om-star svg { display: block; width: 100%; height: 100%; animation: po-om-twinkle 3.6s ease-in-out infinite; animation-delay: calc(var(--i) * -0.9s); transform-origin: 50% 50%; }
.po-om-star-s { width: 10px; height: 10px; }
.po-om-root[data-phase="landing"] .po-om-star-c, .po-om-root[data-phase="exit"] .po-om-star-c { opacity: 0; transition: opacity 0.8s ease 0.8s; }
@keyframes po-om-twinkle { 0%, 100% { transform: scale(0.72) rotate(0deg); opacity: 0.55; } 50% { transform: scale(1) rotate(12deg); opacity: 1; } }
.po-om-aside { position: absolute; top: 40%; width: 200px; font-size: 11.5px; line-height: 1.65; letter-spacing: 0.01em; color: var(--po-om-muted); text-shadow: 0 1px 14px var(--po-om-ground-c), 0 0 2px var(--po-om-ground-c); opacity: 0; transform: translateY(10px); transition: opacity 1s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1); }
.po-om-aside-l { left: clamp(18px, 7vw, 120px); }
.po-om-aside-r { right: clamp(18px, 7vw, 120px); text-align: right; }
.po-om-aside b { display: block; margin-bottom: 8px; font-weight: 500; font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--po-om-accent); }
.po-om-aside p { margin: 0; }
.po-om-root[data-phase="landing"] .po-om-aside, .po-om-root[data-phase="exit"] .po-om-aside { opacity: 1; transform: none; }
.po-om-root[data-phase="landing"] .po-om-aside-l { transition-delay: 2.1s; }
.po-om-root[data-phase="landing"] .po-om-aside-r { transition-delay: 2.25s; }

/* ---- the counter ---------------------------------------------------------- */
.po-om-counter { position: absolute; right: clamp(18px, 3.2vw, 48px); bottom: clamp(18px, 3.2vw, 44px); text-align: right; opacity: 0; transform: translateY(8px); transition: opacity 0.9s ease 0.7s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s; }
.po-om-root[data-up="true"] .po-om-counter { opacity: 1; transform: none; }
.po-om-num { margin: 0; font-family: var(--po-om-serif); font-weight: 400; font-size: clamp(64px, 11vh, 120px); line-height: 0.9; letter-spacing: -0.02em; color: var(--po-om-text); font-variant-numeric: tabular-nums lining-nums; }
.po-om-ratio { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 10px; color: var(--po-om-muted); font-size: 10.5px; letter-spacing: 0.26em; white-space: nowrap; font-variant-numeric: tabular-nums; }
.po-om-ratio i { display: block; width: 22px; height: 1px; background: var(--po-om-rule); }
.po-om-root[data-phase="unveil"] .po-om-counter, .po-om-root[data-phase="landing"] .po-om-counter, .po-om-root[data-phase="exit"] .po-om-counter { opacity: 0; filter: blur(6px); transition: opacity 0.5s ease 0.1s, filter 0.5s ease 0.1s; pointer-events: none; }

/* ---- the copy ------------------------------------------------------------- */
.po-om-copy { position: absolute; left: 50%; top: 16.5%; transform: translateX(-50%); width: min(88vw, 760px); text-align: center; }
.po-om-tagline { margin: 0; font-family: var(--po-om-serif); font-style: normal; font-weight: 400; font-size: clamp(1.15rem, 2.4vw, 2.15rem); line-height: 1.15; letter-spacing: 0.02em; color: var(--po-om-text); text-shadow: 0 1px 24px var(--po-om-ground-c), 0 0 2px var(--po-om-ground-c); }
.po-om-tagline span { display: inline-block; opacity: 0; transform: translateY(14px); transition: opacity 0.8s ease calc(1.7s + var(--i) * 55ms), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) calc(1.7s + var(--i) * 55ms); }
.po-om-root[data-phase="landing"] .po-om-tagline span, .po-om-root[data-phase="exit"] .po-om-tagline span, .po-om-root[data-phase="unveil"] .po-om-tagline span { opacity: 1; transform: none; }
.po-om-root .po-om-cta { display: inline-block; margin-top: 26px; padding: 13px 30px 12px; border: 1px solid var(--po-om-text); color: var(--po-om-text); background: var(--po-om-ground-d); font-family: var(--po-om-ui); font-size: 11.5px; letter-spacing: 0.26em; text-transform: uppercase; font-weight: 500; opacity: 0; transform: translateY(10px) scale(0.98); transition: opacity 0.8s ease 2.2s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 2.2s, background-color 0.35s ease, color 0.35s ease; }
.po-om-root[data-phase="landing"] .po-om-cta, .po-om-root[data-phase="exit"] .po-om-cta, .po-om-root[data-phase="unveil"] .po-om-cta { opacity: 1; transform: none; }
.po-om-root .po-om-cta:hover { background: var(--po-om-text); color: var(--po-om-stage); }
.po-om-ann { position: absolute; width: 58px; height: 30px; color: var(--po-om-text); opacity: 0; transform: scale(0.7); transform-origin: 0 0; transition: opacity 0.6s ease calc(2.3s + var(--i) * 160ms), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(2.3s + var(--i) * 160ms); }
.po-om-root[data-phase="landing"] .po-om-ann, .po-om-root[data-phase="exit"] .po-om-ann { opacity: 1; transform: none; }
.po-om-ann svg { display: block; width: 58px; height: 30px; overflow: visible; }
.po-om-ann span { position: absolute; left: 62px; top: 11px; font-size: 10px; letter-spacing: 0.16em; font-variant-numeric: tabular-nums; white-space: nowrap; text-shadow: 0 1px 10px var(--po-om-ground-c); }
.po-om-root[data-tone="vellum"] .po-om-ann { color: var(--po-om-accent); }
.po-om-foot { position: absolute; left: clamp(18px, 3.2vw, 48px); right: clamp(18px, 3.2vw, 48px); bottom: clamp(16px, 2.6vw, 30px); display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; transition: bottom 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s; }
.po-om-root[data-phase="unveil"] .po-om-foot, .po-om-root[data-phase="landing"] .po-om-foot, .po-om-root[data-phase="exit"] .po-om-foot { bottom: calc(var(--po-om-fs) * (var(--po-om-cap) + 0.03) + 1.4vh + 18px); }
.po-om-bars { display: block; width: 92px; height: 22px; color: var(--po-om-text); opacity: 0; transition: opacity 1s ease 1s; }
.po-om-root[data-up="true"] .po-om-bars { opacity: 0.75; }
.po-om-plate { color: var(--po-om-muted); font-size: 10.5px; letter-spacing: 0.26em; opacity: 0; text-shadow: 0 1px 12px var(--po-om-ground-c); transition: opacity 1s ease 1.1s; }
.po-om-root[data-up="true"] .po-om-plate { opacity: 1; }
.po-om-root[data-phase="load"] .po-om-plate { display: none; }
.po-om-skip { position: absolute; left: 50%; bottom: clamp(16px, 2.6vw, 30px); transform: translateX(-50%); color: var(--po-om-muted); font-size: 10.5px; letter-spacing: 0.3em; padding: 6px 10px; opacity: 0; transition: opacity 0.8s ease 1.6s, color 0.3s ease; }
.po-om-root[data-up="true"][data-phase="load"] .po-om-skip { opacity: 1; }
.po-om-skip:hover { color: var(--po-om-text); }
.po-om-hint { position: absolute; left: 50%; bottom: clamp(14px, 2vw, 24px); transform: translateX(-50%); display: flex; align-items: center; gap: 10px; color: var(--po-om-muted); font-size: 9.5px; letter-spacing: 0.3em; opacity: 0; transition: opacity 1s ease 3s; }
.po-om-hint i { display: block; width: 1px; height: 26px; background: linear-gradient(to bottom, transparent, var(--po-om-text)); animation: po-om-hint 2.2s ease-in-out infinite; }
@keyframes po-om-hint { 0% { transform: scaleY(0); transform-origin: 0 0; } 50% { transform: scaleY(1); transform-origin: 0 0; } 51% { transform-origin: 0 100%; } 100% { transform: scaleY(0); transform-origin: 0 100%; } }
.po-om-root[data-phase="landing"][data-gate="true"] .po-om-hint { opacity: 1; }
.po-om-root[data-phase="load"] .po-om-copy, .po-om-root[data-phase="load"] .po-om-ann, .po-om-root[data-phase="load"] .po-om-aside { visibility: hidden; }
.po-om-live { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* ---- responsive ------------------------------------------------------------ */
@media (max-width: 1023px) { .po-om-aside { display: none; } }
@media (max-width: 639px) {
  .po-om-navl, .po-om-navr { display: none; }
  .po-om-top { grid-template-columns: 1fr; justify-items: center; }
  .po-om-pill { top: 86px; }
  .po-om-pill-l { left: 18px; }
  .po-om-pill-r { right: 18px; }
  .po-om-copy { top: 19%; width: 88vw; }
  .po-om-star { top: 15.5% !important; }
  .po-om-star-s { top: 72% !important; }
  .po-om-tagline { font-size: clamp(19px, 6vw, 26px); }
  .po-om-root .po-om-cta { margin-top: 18px; padding: 11px 22px 10px; }
  .po-om-ann { display: none; }
  .po-om-num { font-size: 56px; }
  .po-om-foot { bottom: 14px; }
  .po-om-skip { bottom: 17%; }
  .po-om-hint { left: 18px; transform: none; }
}

/* ---- instant and reduced -------------------------------------------------- */
.po-om-root[data-instant="true"] *, .po-om-root[data-instant="true"] *::before, .po-om-root[data-instant="true"] *::after { transition-duration: 0s !important; transition-delay: 0s !important; animation-duration: 0s !important; }
@media (prefers-reduced-motion: reduce) {
  .po-om-root { --po-om-px: 0 !important; --po-om-py: 0 !important; --po-om-tilt: 0 !important; --po-om-bob: 0px !important; }
  .po-om-star svg, .po-om-grain, .po-om-ring-spin, .po-om-fig-in, .po-om-hint i { animation: none; }
  .po-om-word { transition: transform 0.01s linear 0.35s; }
  .po-om-fig { transition-duration: 0.9s !important; }
  .po-om-root[data-phase="unveil"] .po-om-ring, .po-om-root[data-phase="landing"] .po-om-ring { transform: translate(-50%, -50%); transition: opacity 0.6s ease; }
  .po-om-root[data-phase="unveil"] .po-om-flood, .po-om-root[data-phase="landing"] .po-om-flood { transition-duration: 0.6s; }
  .po-om-root[data-phase="unveil"] .po-om-sheen { animation: none; }
  .po-om-root[data-phase="exit"] .po-om-stage { transition-duration: 0.6s; }
  .po-om-root[data-phase="exit"] .po-om-cast { transform: none; }
  .po-om-ring-key { transition: opacity 0.6s ease 0.4s; }
}
`

const STAR_PATH =
  'M12 0C12.6 6.8 17.2 11.4 24 12C17.2 12.6 12.6 17.2 12 24C11.4 17.2 6.8 12.6 0 12C6.8 11.4 11.4 6.8 12 0Z'
const STARS = [
  { x: '4.4%', y: '15%', small: false, under: false },
  { x: '95%', y: '15%', small: false, under: false },
  { x: '7.5%', y: '72%', small: true, under: false },
  { x: '92.5%', y: '70%', small: true, under: false },
  { x: '50%', y: '84%', small: true, under: true },
]

function hexAlpha(hex: string, alpha: number) {
  const m = hex.replace('#', '')
  const n =
    m.length === 3
      ? m
          .split('')
          .map((c) => c + c)
          .join('')
      : m
  const r = parseInt(n.slice(0, 2), 16)
  const g = parseInt(n.slice(2, 4), 16)
  const b = parseInt(n.slice(4, 6), 16)
  if ([r, g, b].some((v) => Number.isNaN(v))) return hex
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
}

function hexMix(a: string, b: string, t: number) {
  const p = (h: string) => {
    const m = h.replace('#', '')
    const n =
      m.length === 3
        ? m
            .split('')
            .map((c) => c + c)
            .join('')
        : m
    return [
      parseInt(n.slice(0, 2), 16),
      parseInt(n.slice(2, 4), 16),
      parseInt(n.slice(4, 6), 16),
    ]
  }
  const x = p(a)
  const y = p(b)
  if (x.some((v) => Number.isNaN(v)) || y.some((v) => Number.isNaN(v))) return a
  const c = x.map((v, i) => Math.round(v + (y[i] - v) * t))
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('')
}

function paintGrain(seed: number) {
  if (typeof document === 'undefined') return ''
  const c = document.createElement('canvas')
  c.width = 160
  c.height = 160
  const ctx = c.getContext('2d')
  if (!ctx) return ''
  const img = ctx.createImageData(160, 160)
  const rnd = omRng(seed)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 96 + Math.floor(rnd() * 96)
    img.data[i] = v
    img.data[i + 1] = v
    img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return c.toDataURL('image/png')
}

export default function PorphyryStage({
  progress,
  durationMs = 3200,
  minLoadMs = 1800,
  skippable = true,
  skipIntro = false,
  figures = DEFAULT_FIGURES,
  backdrop = DEFAULT_BACKDROP,
  wordDepth = 0.9,
  exposure = 1,
  duotone,
  rays = true,
  dust = true,
  tilt = 2.5,
  wordmark = 'Porphyry',
  face = 'cinzel',
  scriptInitial = false,
  tagline = 'A page composed like a stage.',
  eyebrow = 'Case 10 · MMXXVI',
  brand = 'P.',
  nav = DEFAULT_NAV,
  labels = DEFAULT_LABELS,
  asides = DEFAULT_ASIDES,
  annotations = DEFAULT_ANNOTATIONS,
  plate = 'Pl. X',
  loadingLabel = 'Marble',
  cta = { label: 'Enter the stage' },
  onEnter,
  onLoaded,
  onComplete,
  children,
  holdMs = 0,
  scrollToEnter = true,
  tone = 'noir',
  palette,
  fontHref = null,
  height = '100svh',
  className = '',
}: PorphyryStageProps) {
  const pal = { ...TONES[tone], ...(palette || {}) }
  const faceDef = FACES[face]
  const isDuotone = duotone === undefined ? tone === 'carmine' : duotone

  const rootRef = React.useRef(null as HTMLDivElement | null)
  const stageRef = React.useRef(null as HTMLDivElement | null)
  const numRef = React.useRef(null as HTMLSpanElement | null)
  const ratioRef = React.useRef(null as HTMLSpanElement | null)
  const wordRef = React.useRef(null as HTMLHeadingElement | null)
  const liveRef = React.useRef(null as HTMLDivElement | null)
  const eyebrowRef = React.useRef(null as HTMLDivElement | null)
  const lightRef = React.useRef(null as HTMLCanvasElement | null)

  const rawId = React.useId()
  const uid = React.useMemo(
    () => 'om' + rawId.replace(/[^a-zA-Z0-9]/g, ''),
    [rawId],
  )

  const [phase, setPhase] = React.useState(skipIntro ? 'landing' : 'load')
  const [up, setUp] = React.useState(false)
  const [instant, setInstant] = React.useState(skipIntro)
  const [pct, setPct] = React.useState(skipIntro ? 100 : 0)
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  const [naturals, setNaturals] = React.useState(
    {} as { [src: string]: { w: number; h: number } },
  )
  const [fontsReady, setFontsReady] = React.useState(0)
  const [grain, setGrain] = React.useState('')
  const [fs, setFs] = React.useState(120)
  const [metrics, setMetrics] = React.useState({ base: 0.16, cap: 0.7 })

  const phaseRef = React.useRef(phase)
  const progressRef = React.useRef(progress)
  const rushRef = React.useRef(false)
  const shownRef = React.useRef(skipIntro ? 1 : 0)
  const pctRef = React.useRef(skipIntro ? 100 : 0)
  const pointerRef = React.useRef({
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
    sx: 50,
    sy: 40,
    near: -1,
    inside: false,
  })
  const centresRef = React.useRef([] as number[])
  const onLoadedRef = React.useRef(onLoaded)
  const onCompleteRef = React.useRef(onComplete)
  const onEnterRef = React.useRef(onEnter)

  React.useEffect(() => {
    phaseRef.current = phase
  }, [phase])
  React.useEffect(() => {
    progressRef.current = progress
  }, [progress])
  React.useEffect(() => {
    onLoadedRef.current = onLoaded
  }, [onLoaded])
  React.useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])
  React.useEffect(() => {
    onEnterRef.current = onEnter
  }, [onEnter])

  const chars = React.useMemo(
    () => omSplit(wordmark, scriptInitial),
    [wordmark, scriptInitial],
  )
  const hasChildren = children !== undefined && children !== null
  const keyPath = React.useMemo(() => omMeander(200, 200, 176, 22, 32), [])
  const bars = React.useMemo(() => omBars(omHash(wordmark), 34, 92), [wordmark])
  const narrow = size.w > 0 && size.w < 640
  const cast = React.useMemo(
    () => figures.filter((f) => !narrow || f.phone !== false),
    [figures, narrow],
  )

  React.useEffect(() => {
    centresRef.current = cast.map((f) => f.x / 100)
  }, [cast])

  // Fonts: optionally inject one stylesheet, then wait for the faces (or a
  // short timeout). The faces can be self-hosted, so fontHref defaults to null.
  React.useEffect(() => {
    if (fontHref) {
      if (
        !document.querySelector('link[data-po-om-fonts="' + fontHref + '"]')
      ) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = fontHref
        link.setAttribute('data-po-om-fonts', fontHref)
        document.head.appendChild(link)
      }
    }
    let live = true
    const go = () => {
      if (live) setFontsReady((n) => n + 1)
    }
    const timer = setTimeout(go, 2500)
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (fonts && fonts.load) {
      Promise.all(FONT_PROBES.map((f) => fonts.load(f).catch(() => null))).then(
        go,
        go,
      )
      fonts.addEventListener('loadingdone', go)
    } else go()
    return () => {
      live = false
      clearTimeout(timer)
      if (fonts && fonts.removeEventListener)
        fonts.removeEventListener('loadingdone', go)
    }
  }, [fontHref])

  // The stage's size, for the cast, the masks and the fit.
  React.useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const read = () => {
      const r = el.getBoundingClientRect()
      setSize((s) =>
        Math.abs(s.w - r.width) < 0.5 && Math.abs(s.h - r.height) < 0.5
          ? s
          : { w: r.width, h: r.height },
      )
    }
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Every photograph's natural size, for its box and its mask.
  const srcKey = figures.map((f) => f.src).join('\n') + '\n' + (backdrop || '')
  React.useEffect(() => {
    if (typeof Image === 'undefined') return
    let live = true
    const list = srcKey.split('\n').filter(Boolean)
    for (const src of list) {
      const img = new Image()
      img.onload = () => {
        if (live)
          setNaturals((n) =>
            n[src]
              ? n
              : { ...n, [src]: { w: img.naturalWidth, h: img.naturalHeight } },
          )
      }
      img.src = src
    }
    return () => {
      live = false
    }
  }, [srcKey])

  // Grain is painted once, on mount.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGrain(paintGrain(omHash(wordmark) ^ 0x9e3779b9))
  }, [wordmark])

  // Fit the wordmark to the stage width and read the face's metrics.
  React.useEffect(() => {
    if (!size.w || !size.h || typeof document === 'undefined') return
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    if (!ctx) return
    const rest = chars.rest.join('').toUpperCase()
    ctx.font = faceDef.weight + ' 100px ' + faceDef.family
    const h = ctx.measureText('H')
    const cap =
      h.actualBoundingBoxAscent > 0 ? h.actualBoundingBoxAscent / 100 : 0.7
    const base = omBaseline(
      h.fontBoundingBoxAscent / 100,
      h.fontBoundingBoxDescent / 100,
    )
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMetrics({ base, cap: Math.round(cap * 100) / 100 })
    let w100 =
      ctx.measureText(rest).width +
      Math.max(1, chars.rest.length) * faceDef.tracking * 100
    if (chars.initial) {
      ctx.font = '400 132px ' + SCRIPT_FAMILY
      w100 += ctx.measureText(chars.initial).width - 14
    }
    const pad = Math.max(10, size.w * 0.025)
    const maxFs = (size.h * 0.34) / cap
    setFs(Math.round(omFit(w100, size.w - pad * 2 - size.w * 0.02, maxFs, 36)))
  }, [size, chars, faceDef, fontsReady])

  // The rule leaves a gap round the eyebrow.
  React.useEffect(() => {
    const el = eyebrowRef.current
    const root = rootRef.current
    if (!el || !root) return
    const read = () =>
      root.style.setProperty(
        '--po-om-gap',
        Math.round(el.offsetWidth / 2 + 14) + 'px',
      )
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [eyebrow, fontsReady])

  // Curtain up. Under reduced motion, open on the landing instead of counting.
  React.useEffect(() => {
    const reduced =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      shownRef.current = 1
      pctRef.current = 100
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPct(100)
      setPhase((p) => (p === 'load' ? 'landing' : p))
      setUp(true)
      return
    }
    const t = setTimeout(() => setUp(true), 60)
    return () => clearTimeout(t)
  }, [])

  // skipIntro: first paint without transitions.
  React.useEffect(() => {
    if (!instant) return
    const t = setTimeout(() => setInstant(false), 80)
    return () => clearTimeout(t)
  }, [instant])

  // The load, the parallax, the nearest figure and the read-outs, on one frame loop.
  React.useEffect(() => {
    const reduced =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = performance.now()
    const start = last
    let done = phaseRef.current !== 'load' || reduced
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      const root = rootRef.current
      // the load
      if (!done) {
        const elapsed = now - start
        const external = progressRef.current
        let target =
          external === undefined
            ? omSimulated(elapsed / Math.max(400, durationMs))
            : Math.min(1, Math.max(0, external / 100))
        if (rushRef.current) target = 1
        const k = 1 - Math.exp(-dt / (rushRef.current ? 90 : 170))
        let shown = shownRef.current + (target - shownRef.current) * k
        if (target >= 1 && shown > 0.995) shown = 1
        shownRef.current = Math.max(shownRef.current, shown)
        const s = shownRef.current
        if (wordRef.current)
          wordRef.current.style.setProperty(
            '--po-om-fill',
            (s * 100).toFixed(2) + '%',
          )
        const p = Math.round(s * 100)
        if (p !== pctRef.current) {
          pctRef.current = p
          if (numRef.current) numRef.current.textContent = String(p)
          if (ratioRef.current) ratioRef.current.textContent = omRatio(s)
          if (p % 10 === 0 || p === 100) setPct(p)
        }
        if (s >= 1 && (elapsed >= minLoadMs || rushRef.current)) {
          done = true
          setPct(100)
          if (wordRef.current)
            wordRef.current.style.setProperty('--po-om-fill', '102%')
          setPhase('unveil')
        }
      }
      // the parallax, the spotlight, the nearest figure
      const pt = pointerRef.current
      if (root && !reduced) {
        const ease = 1 - Math.exp(-dt / 240)
        pt.x += (pt.tx - pt.x) * ease
        pt.y += (pt.ty - pt.y) * ease
        const sx = 50 + pt.tx * 24
        const sy = 40 + pt.ty * 22
        pt.sx += (sx - pt.sx) * ease
        pt.sy += (sy - pt.sy) * ease
        root.style.setProperty('--po-om-px', pt.x.toFixed(3))
        root.style.setProperty('--po-om-py', pt.y.toFixed(3))
        root.style.setProperty('--po-om-sx', pt.sx.toFixed(2) + '%')
        root.style.setProperty('--po-om-sy', pt.sy.toFixed(2) + '%')
        const near =
          pt.inside && phaseRef.current === 'landing'
            ? omNearest((pt.tx + 1) / 2, centresRef.current, 0.22)
            : -1
        if (near !== pt.near) {
          pt.near = near
          const figs = root.querySelectorAll('.po-om-fig')
          figs.forEach((f) =>
            f.setAttribute(
              'data-near',
              f.getAttribute('data-index') === String(near) ? 'true' : 'false',
            ),
          )
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [durationMs, minLoadMs])

  // The light: shafts from above and dust in them, on a canvas.
  React.useEffect(() => {
    const canvas = lightRef.current
    if (!canvas || (!rays && !dust)) return
    const ctx = canvas.getContext('2d')
    if (!ctx || !size.w || !size.h) return
    const reduced =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(
      1.5,
      typeof devicePixelRatio === 'number' ? devicePixelRatio : 1,
    )
    const w = Math.round(size.w)
    const h = Math.round(size.h)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    const rnd = omRng(omHash(wordmark) ^ 0x51ed27)
    const motes = Array.from(
      { length: dust ? Math.round(Math.min(140, (w * h) / 11000)) : 0 },
      () => ({
        x: rnd() * w,
        y: rnd() * h,
        r: 0.5 + rnd() * 1.3,
        vx: (rnd() - 0.5) * 6,
        vy: -4 - rnd() * 9,
        a: rnd() * Math.PI * 2,
        s: 0.6 + rnd() * 1.2,
      }),
    )
    const shafts = Array.from({ length: rays ? 7 : 0 }, (_, i) => ({
      a: -0.46 + (i / 6) * 0.92 + (rnd() - 0.5) * 0.08,
      w: 0.035 + rnd() * 0.05,
      k: 0.6 + rnd() * 0.8,
      o: rnd() * Math.PI * 2,
    }))
    const glow = pal.glow
    const ink = tone === 'vellum'
    let raf = 0
    let last = performance.now()
    const draw = (now: number) => {
      const dt = Math.min(64, now - last) / 1000
      last = now
      const t = now / 1000
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = ink ? 'source-over' : 'lighter'
      const ox = w * 0.5
      const oy = -h * 0.55
      const len = h * 1.9
      for (const s of shafts) {
        const a = Math.PI / 2 + s.a + Math.sin(t * 0.11 * s.k + s.o) * 0.05
        const alpha =
          (ink ? 0.06 : 0.055) * (0.7 + 0.3 * Math.sin(t * 0.23 * s.k + s.o))
        const g = ctx.createLinearGradient(
          ox,
          oy,
          ox + Math.cos(a) * len,
          oy + Math.sin(a) * len,
        )
        g.addColorStop(0, hexAlpha(ink ? pal.accent : glow, alpha))
        g.addColorStop(0.55, hexAlpha(ink ? pal.accent : glow, alpha * 0.5))
        g.addColorStop(1, hexAlpha(ink ? pal.accent : glow, 0))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.moveTo(ox, oy)
        ctx.lineTo(ox + Math.cos(a - s.w) * len, oy + Math.sin(a - s.w) * len)
        ctx.lineTo(ox + Math.cos(a + s.w) * len, oy + Math.sin(a + s.w) * len)
        ctx.closePath()
        ctx.fill()
      }
      for (const m of motes) {
        if (!reduced) {
          m.x += (m.vx + Math.sin(t * m.s + m.a) * 4) * dt
          m.y += m.vy * dt
          if (m.y < -4) {
            m.y = h + 4
            m.x = rnd() * w
          }
          if (m.x < -4) m.x = w + 4
          if (m.x > w + 4) m.x = -4
        }
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.7 * m.s + m.a))
        ctx.fillStyle = hexAlpha(
          ink ? pal.accent : glow,
          (ink ? 0.35 : 0.55) * tw,
        )
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [size, rays, dust, pal.glow, pal.accent, tone, wordmark])

  // Unveil → landing → (with children) exit → done.
  React.useEffect(() => {
    if (phase === 'unveil') {
      const t = setTimeout(() => setPhase('landing'), UNVEIL_MS)
      return () => clearTimeout(t)
    }
    if (phase === 'landing') {
      if (liveRef.current)
        liveRef.current.textContent = wordmark + '. ' + (tagline || '')
      onLoadedRef.current?.()
      if (hasChildren && holdMs > 0) {
        const t = setTimeout(() => setPhase('exit'), holdMs)
        return () => clearTimeout(t)
      }
      return
    }
    if (phase === 'exit') {
      const t = setTimeout(() => {
        setPhase('done')
        onCompleteRef.current?.()
      }, EXIT_MS)
      return () => clearTimeout(t)
    }
  }, [phase, hasChildren, holdMs, wordmark, tagline])

  // With children: a wheel or a swipe lifts the stage.
  React.useEffect(() => {
    const el = rootRef.current
    if (!el || !hasChildren || !scrollToEnter || phase !== 'landing') return
    let y0 = -1
    const lift = () => setPhase((p) => (p === 'landing' ? 'exit' : p))
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 12) lift()
    }
    const onTouchStart = (e: TouchEvent) => {
      y0 = e.touches[0]?.clientY ?? -1
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY
      if (y0 >= 0 && y !== undefined && y0 - y > 40) lift()
    }
    el.addEventListener('wheel', onWheel, { passive: true })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [hasChildren, scrollToEnter, phase])

  const rush = React.useCallback(() => {
    if (!skippable || phaseRef.current !== 'load') return
    rushRef.current = true
  }, [skippable])

  const onKey = (e: React.KeyboardEvent) => {
    if (phase !== 'load') return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      rush()
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const el = stageRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const pt = pointerRef.current
    pt.tx = Math.max(
      -1,
      Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2),
    )
    pt.ty = Math.max(
      -1,
      Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2),
    )
    pt.inside = true
  }

  const onPointerLeave = () => {
    pointerRef.current.tx = 0
    pointerRef.current.ty = 0
    pointerRef.current.inside = false
  }

  const enter = (e: React.MouseEvent) => {
    onEnterRef.current?.()
    if (hasChildren) {
      e.preventDefault()
      if (phaseRef.current === 'landing') setPhase('exit')
    }
  }

  if (phase === 'done') return <>{children}</>

  const boxes = cast.map((f) => {
    const nat = naturals[f.src]
    const aspect = nat ? nat.w / nat.h : 0.62
    return omFigureBox(f.x, f.y ?? 100, f.h, aspect, size.w, size.h)
  })
  const backNat = backdrop ? naturals[backdrop] : undefined
  const backBox = backdrop
    ? omCover(backNat?.w ?? 0, backNat?.h ?? 0, size.w, size.h, 0.5, 0.4)
    : null
  const ringPx = Math.round(
    Math.max(260, Math.min(760, Math.min(size.w || 900, size.h || 700) * 0.78)),
  )
  const pills = phase === 'load' ? (pct >= 50 ? 2 : pct >= 20 ? 1 : 0) : 2
  const leftNav = nav.slice(0, Math.ceil(nav.length / 2))
  const rightNav = nav.slice(Math.ceil(nav.length / 2))
  const taglineWords = (tagline || '').split(/\s+/).filter(Boolean)
  // During the load the word stands in the middle of the stage; at the unveil it settles to the floor.
  const wordBottomPx = fs * metrics.base * -1 + size.h * 0.014
  const wordMid = wordBottomPx + (fs * metrics.cap) / 2
  const lift = phase === 'load' && size.h ? -(size.h / 2 - wordMid) : 0

  const vars = {
    '--po-om-stage': pal.stage,
    '--po-om-stage-l': hexMix(
      pal.stage,
      pal.glow,
      tone === 'vellum' ? 0.35 : 0.14,
    ),
    '--po-om-stage-d': hexMix(pal.stage, pal.ground, 0.55),
    '--po-om-ground': pal.ground,
    '--po-om-ground-a': hexAlpha(pal.ground, tone === 'vellum' ? 0.35 : 0.85),
    '--po-om-ground-b': hexAlpha(pal.ground, 0.7),
    '--po-om-ground-c': hexAlpha(pal.ground, 0.6),
    '--po-om-ground-d': hexAlpha(pal.ground, 0.9),
    '--po-om-text': pal.text,
    '--po-om-muted': pal.muted,
    '--po-om-accent': pal.accent,
    '--po-om-accent-a': hexAlpha(pal.accent, 0.75),
    '--po-om-word': pal.word,
    '--po-om-word-a': hexAlpha(pal.word, 0.7),
    '--po-om-rule': pal.rule,
    '--po-om-glow': pal.glow,
    '--po-om-highlight': pal.highlight,
    '--po-om-glow-a': hexAlpha(pal.glow, tone === 'vellum' ? 0.5 : 0.22),
    '--po-om-glow-b': hexAlpha(pal.glow, 0.55),
    '--po-om-glow-c': hexAlpha(pal.glow, 0.25),
    '--po-om-glow-d': hexAlpha(pal.glow, 0.75),
    '--po-om-face': faceDef.family,
    '--po-om-weight': String(faceDef.weight),
    '--po-om-tracking': String(faceDef.tracking),
    '--po-om-base': String(metrics.base + (chars.initial ? 0.1 : 0)),
    '--po-om-cap': String(metrics.cap),
    '--po-om-script': SCRIPT_FAMILY,
    '--po-om-ui': UI_FAMILY,
    '--po-om-serif': SERIF_FAMILY,
    '--po-om-fs': fs + 'px',
    '--po-om-lift': Math.round(lift) + 'px',
    '--po-om-exposure': String(Math.max(0.2, exposure)),
    '--po-om-tilt': String(Math.max(0, tilt)),
    '--po-om-bob': '0px',
    '--po-om-ring': ringPx + 'px',
    '--po-om-grain':
      tone === 'vellum' ? 0.16 : tone === 'carmine' ? 0.11 : 0.09,
    height,
  } as React.CSSProperties

  return (
    <div
      ref={rootRef}
      className={'po-om-root ' + className}
      style={vars}
      data-phase={phase}
      data-tone={tone}
      data-face={face}
      data-up={up ? 'true' : 'false'}
      data-pills={pills}
      data-duotone={isDuotone ? 'true' : 'false'}
      data-instant={instant ? 'true' : 'false'}
      data-gate={hasChildren && scrollToEnter ? 'true' : 'false'}
      data-narrow={narrow ? 'true' : 'false'}
      onClick={rush}
      onKeyDown={onKey}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      tabIndex={phase === 'load' && skippable ? 0 : -1}
      aria-busy={phase === 'load'}
    >
      <style dangerouslySetInnerHTML={{ __html: STAGE_CSS }} />
      <svg className="po-om-defs" aria-hidden="true" focusable="false">
        <defs>
          {cast.map((f, i) => {
            const tr = omTransfer(
              f.threshold ?? (f.subject === 'dark' ? 0.72 : 0.2),
              f.softness ?? 0.16,
              f.subject ?? 'light',
            )
            const box = boxes[i]
            return (
              <React.Fragment key={i}>
                <filter
                  id={uid + '-k' + i}
                  colorInterpolationFilters="sRGB"
                  x="0"
                  y="0"
                  width="1"
                  height="1"
                >
                  <feColorMatrix
                    type="matrix"
                    values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0"
                  />
                  <feComponentTransfer>
                    <feFuncR
                      type="linear"
                      slope={tr.slope}
                      intercept={tr.intercept}
                    />
                    <feFuncG
                      type="linear"
                      slope={tr.slope}
                      intercept={tr.intercept}
                    />
                    <feFuncB
                      type="linear"
                      slope={tr.slope}
                      intercept={tr.intercept}
                    />
                  </feComponentTransfer>
                </filter>
                {box.w > 0 && (
                  <mask
                    id={uid + '-m' + i}
                    maskUnits="userSpaceOnUse"
                    maskContentUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width={box.w}
                    height={box.h}
                    style={{ maskType: 'luminance' } as React.CSSProperties}
                  >
                    <image
                      href={f.src}
                      x="0"
                      y="0"
                      width={box.w}
                      height={box.h}
                      preserveAspectRatio="none"
                      filter={'url(#' + uid + '-k' + i + ')'}
                      transform={
                        f.flip
                          ? 'translate(' + box.w + ' 0) scale(-1 1)'
                          : undefined
                      }
                    />
                  </mask>
                )}
              </React.Fragment>
            )
          })}
        </defs>
      </svg>

      {hasChildren && <div className="po-om-page">{children}</div>}

      <div ref={stageRef} className="po-om-stage">
        <div className="po-om-flood" />
        {backdrop && backBox && (
          <img
            className="po-om-backdrop"
            src={backdrop}
            alt=""
            draggable={false}
            decoding="async"
            style={{
              left: backBox.x,
              top: backBox.y,
              width: backBox.w || '100%',
              height: backBox.h || '100%',
              maxWidth: 'none',
            }}
          />
        )}

        <svg className="po-om-ring" viewBox="0 0 400 400" aria-hidden="true">
          <g className="po-om-ring-spin">
            <circle className="po-om-ring-hair" cx="200" cy="200" r="198" />
            <circle className="po-om-ring-hair" cx="200" cy="200" r="154" />
            <path className="po-om-ring-key" d={keyPath} pathLength={1} />
          </g>
        </svg>

        <div className="po-om-wordlayer">
          <div className="po-om-wordclip">
            <h2
              ref={wordRef}
              className="po-om-word"
              aria-label={wordmark}
              style={
                {
                  '--po-om-fill': skipIntro ? '102%' : '0%',
                } as React.CSSProperties
              }
            >
              {chars.initial && (
                <span
                  className="po-om-init"
                  style={{ '--i': 0 } as React.CSSProperties}
                  aria-hidden="true"
                >
                  {chars.initial}
                </span>
              )}
              {chars.rest.map((ch, k) =>
                ch === ' ' ? (
                  <span key={k} className="po-om-sp" aria-hidden="true" />
                ) : (
                  <span
                    key={k}
                    className="po-om-l"
                    style={
                      {
                        '--i': k + (chars.initial ? 1 : 0),
                      } as React.CSSProperties
                    }
                    aria-hidden="true"
                  >
                    {ch}
                  </span>
                ),
              )}
            </h2>
          </div>
          <div className="po-om-sheen" aria-hidden="true" />
        </div>

        {[false, true].map((front) => (
          <div
            key={front ? 'front' : 'back'}
            className={'po-om-cast' + (front ? ' po-om-cast-front' : '')}
            aria-hidden="true"
          >
            <div className="po-om-tilt">
              {cast.map((f, i) => {
                const box = boxes[i]
                // Depth is distance from the stage floor: 1 is the stage, more is
                // nearer. Figures at or beyond wordDepth stand in front of the
                // word; the rest stand behind it.
                if (!(box.w > 0) || (f.depth ?? 1) < wordDepth !== front)
                  return null
                return (
                  <div
                    key={i}
                    className="po-om-fig"
                    data-index={i}
                    data-flip={f.flip ? 'true' : 'false'}
                    data-near="false"
                    style={
                      {
                        left: box.left,
                        top: box.top,
                        width: box.w,
                        height: box.h,
                        '--i': i,
                        '--po-om-depth': f.depth ?? 1,
                        zIndex: Math.round((f.depth ?? 1) * 100),
                      } as React.CSSProperties
                    }
                  >
                    <div className="po-om-fig-shadow" />
                    <div
                      className="po-om-fig-in"
                      style={
                        {
                          WebkitMask: 'url(#' + uid + '-m' + i + ')',
                          mask: 'url(#' + uid + '-m' + i + ')',
                        } as React.CSSProperties
                      }
                    >
                      <img
                        src={f.src}
                        alt={f.alt || ''}
                        draggable={false}
                        decoding="async"
                        style={{ maxWidth: 'none' }}
                      />
                      <div className="po-om-duo po-om-duo-a" />
                      <div className="po-om-duo po-om-duo-b" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <canvas ref={lightRef} className="po-om-light" aria-hidden="true" />
        <div className="po-om-spot" />
        <div className="po-om-vignette" />
        {grain && (
          <div
            className="po-om-grain"
            style={{ backgroundImage: 'url(' + grain + ')' }}
            aria-hidden="true"
          />
        )}
        <div className="po-om-flash" aria-hidden="true" />

        <div className="po-om-chrome">
          <header className="po-om-top po-om-ui">
            <nav aria-label="Stage, left">
              <ul className="po-om-navl">
                {leftNav.map((l, k) => (
                  <li key={k} style={{ '--i': k } as React.CSSProperties}>
                    {l.href ? (
                      <a href={l.href}>{l.label}</a>
                    ) : (
                      <button type="button">{l.label}</button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="po-om-brand">{brand}</div>
            <nav aria-label="Stage, right">
              <ul className="po-om-navr">
                {rightNav.map((l, k) => (
                  <li
                    key={k}
                    style={{ '--i': k + leftNav.length } as React.CSSProperties}
                  >
                    {l.href ? (
                      <a href={l.href}>{l.label}</a>
                    ) : (
                      <button type="button">{l.label}</button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </header>
          <div
            className="po-om-rule"
            data-gap={eyebrow ? 'true' : 'false'}
            aria-hidden="true"
          />
          {eyebrow && (
            <div ref={eyebrowRef} className="po-om-eyebrow po-om-ui">
              {eyebrow}
            </div>
          )}

          {labels[0] && (
            <div className="po-om-pill po-om-pill-l po-om-ui">{labels[0]}</div>
          )}
          {labels[1] && (
            <div className="po-om-pill po-om-pill-r po-om-ui">{labels[1]}</div>
          )}

          {STARS.map((s, k) => (
            <div
              key={k}
              className={
                'po-om-star' +
                (s.small ? ' po-om-star-s' : '') +
                (s.under ? ' po-om-star-c' : '')
              }
              style={{ left: s.x, top: s.y, '--i': k } as React.CSSProperties}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24">
                <path d={STAR_PATH} fill="currentColor" />
              </svg>
            </div>
          ))}

          {asides[0] && (
            <aside className="po-om-aside po-om-aside-l">
              <b>{asides[0].title}</b>
              <p>{asides[0].text}</p>
            </aside>
          )}
          {asides[1] && (
            <aside className="po-om-aside po-om-aside-r">
              <b>{asides[1].title}</b>
              <p>{asides[1].text}</p>
            </aside>
          )}

          <div
            className="po-om-counter"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label={loadingLabel}
          >
            <p className="po-om-num" aria-hidden="true">
              <span ref={numRef}>{skipIntro ? 100 : 0}</span>
            </p>
            <div className="po-om-ratio po-om-ui" aria-hidden="true">
              <span ref={ratioRef}>{skipIntro ? '1.0000' : '0.0000'}</span>
              <i />
              <span>{loadingLabel}</span>
            </div>
          </div>

          <div className="po-om-copy">
            {taglineWords.length > 0 && (
              <p className="po-om-tagline">
                {taglineWords.map((w, k) => (
                  <React.Fragment key={k}>
                    <span style={{ '--i': k } as React.CSSProperties}>{w}</span>
                    {k < taglineWords.length - 1 ? ' ' : null}
                  </React.Fragment>
                ))}
              </p>
            )}
            {cta &&
              (cta.href ? (
                <a className="po-om-cta" href={cta.href} onClick={enter}>
                  {cta.label}
                </a>
              ) : (
                <button type="button" className="po-om-cta" onClick={enter}>
                  {cta.label}
                </button>
              ))}
          </div>

          {annotations.map((a, k) => (
            <div
              key={k}
              className="po-om-ann"
              style={
                {
                  left: a.x + '%',
                  top: a.y + '%',
                  '--i': k,
                } as React.CSSProperties
              }
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 58 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M0.5 8V0.5H8M50 0.5H57.5V8M57.5 22V29.5H50M8 29.5H0.5V22" />
              </svg>
              <span className="po-om-ui">{a.label}</span>
            </div>
          ))}

          <div className="po-om-foot">
            <svg className="po-om-bars" viewBox="0 0 92 22" aria-hidden="true">
              {bars.map((b, k) => (
                <rect
                  key={k}
                  x={b.x}
                  y="0"
                  width={b.w}
                  height="22"
                  fill="currentColor"
                />
              ))}
            </svg>
            <div className="po-om-plate po-om-ui">
              {plate}
              {plate ? ' · ' : ''}
              <span>1.0000</span>
            </div>
          </div>
          {skippable && phase === 'load' && (
            <button
              type="button"
              className="po-om-skip po-om-ui"
              onClick={rush}
            >
              Skip
            </button>
          )}
          <div className="po-om-hint po-om-ui" aria-hidden="true">
            <i />
            <span>Scroll</span>
          </div>
          <div ref={liveRef} className="po-om-live" aria-live="polite" />
        </div>
      </div>
    </div>
  )
}

export type PorphyryPaletteOverride = Partial<PorphyryPalette>
