"use client"

// Meadow Rise Footer — a closing statement set in a range of soft green hills.
// A serif-italic headline sits in a pale sky; below it six ridges of grass roll
// away into haze, and the nearest hill darkens into the ground the footer's
// links sit on.
//
// Storyboard. Before the footer is seen it is only pale fog over dark ground.
// When it arrives a pencil-thin horizon draws out from the centre, then the
// hills rise through it back to front, each on its own spring, while the fog
// lifts off them. The headline rises out of a mask word by word and its accent
// phrase is written in, in italic, a beat later. The call to action settles,
// the brand mark draws its petals, the link columns step up, and faint
// wildflowers sketch themselves into the ground behind the footer.
//
// Integration note (Serenica, Case 23). The component ships three presets:
// `print` is the brand's own surface — flat inks, no glow, no mist, a 1px
// horizon printed across the range, 0px corners, no shadow at rest. `meadow`
// and `moonlit` are the original atmospheric presets. The `print` preset is
// what the showcase page renders, because the page is a printed sheet.
//
// One file, React only. The hills are painted once per size into offscreen
// canvases (a per-pixel pass: slope lighting, mottled grass, grain and aerial
// haze) and composited each frame, so motion costs a few drawImage calls. The
// styles are a scoped <style> where every rule is .mrf- prefixed, and nothing
// is fetched: faces come from the host page or the fallback stacks.

import * as React from "react"

export interface MeadowPalette {
  /** Sky at the top, and at the horizon. */
  sky: [string, string]
  /** What distance fades into. Usually a touch darker than the horizon. */
  haze: string
  /** The light that follows the pointer. */
  glow: string
  /** Hills from farthest to nearest, each [lit, shadow]. */
  hills: [string, string][]
  /** The footer ground the nearest hill darkens into. */
  ground: string
  /** Headline colour, and the supporting line under it. */
  ink: string
  sub: string
  /** Call-to-action pill and its label. */
  pill: string
  pillInk: string
  /** Footer text, muted text, hairlines. */
  text: string
  muted: string
  line: string
  /** A sun-less sky with stars and a moon. */
  night?: boolean
}

export type MeadowTheme = "print" | "printNight" | "meadow" | "golden" | "moonlit"

export type MeadowPreset = "auto" | MeadowTheme

export interface MeadowLink {
  label: string
  href?: string
}

export interface MeadowColumn {
  title: string
  links: MeadowLink[]
}

export type MeadowSocialIcon = "linkedin" | "instagram" | "facebook" | "x" | "youtube"

export interface MeadowSocial {
  icon: MeadowSocialIcon
  href?: string
  /** Accessible name. Defaults to the network's name. */
  label?: string
}

export interface MeadowPaletteOverrides {
  sky?: [string, string]
  haze?: string
  glow?: string
  hills?: [string, string][]
  ground?: string
  ink?: string
  sub?: string
  pill?: string
  pillInk?: string
  text?: string
  muted?: string
  line?: string
  night?: boolean
}

export interface MeadowRiseFooterProps {
  /** Brand name beside the mark, and in the default headline and copyright. */
  name?: string
  /** Where the brand links to. */
  brandHref?: string
  /** Replace the built-in petal mark. */
  logo?: React.ReactNode
  /** Headline. Wrap words in *asterisks* for the serif italic accent; "\n" breaks the line. */
  heading?: string
  /** The line under the headline. "" hides it. */
  subheading?: string
  /** The pill under the headline. null hides it. */
  cta?: { label: string; href?: string } | null
  /** The line under the brand. "" hides it. */
  tagline?: string
  /** Show the email signup. Defaults to true. */
  newsletter?: boolean
  /** Placeholder for the email field. */
  placeholder?: string
  /** Called with a valid address. Return a promise to hold the sending state; throw to show an error. */
  onSubscribe?: (email: string) => void | Promise<void>
  /** Shown once subscribed. */
  successMessage?: string
  /** Link columns. */
  columns?: MeadowColumn[]
  /** Heading over the social icons. "" hides the heading. */
  socialTitle?: string
  /** Social icons. [] hides the column. */
  socials?: MeadowSocial[]
  /** Bottom-left line. Defaults to "© <year> <name>. All rights reserved." */
  copyright?: string
  /** Bottom-right links. */
  legal?: MeadowLink[]
  /** Colours. "auto" is meadow, or moonlit under a .dark ancestor. */
  preset?: MeadowPreset
  /** Colour overrides, merged over the preset. */
  palette?: MeadowPaletteOverrides
  /** Which range of hills to grow. Any integer. */
  seed?: number
  /** Thickness of the drifting mist, 0–1. Defaults to 0 in print, 0.55 otherwise. */
  mist?: number
  /** Mist speed. 0 holds it still and lets the canvas sleep. Defaults to 1. */
  drift?: number
  /** Pointer parallax and the light that follows the pointer. Defaults to true. */
  interactive?: boolean
  /** Hills settle into place as the page scrolls to the footer. Defaults to true. */
  scrollParallax?: boolean
  /** Wildflower line drawings in the footer ground. Defaults to true. */
  botanicals?: boolean
  /** Least height of the whole footer. A definite length. */
  height?: string
  /** Height of the sky-and-hills band. A definite length. */
  heroHeight?: string
  /** Widest the content gets. */
  maxWidth?: string
  /** Face for everything but the accent. */
  fontFamily?: string
  /** Face for the italic accent. */
  serifFamily?: string
  /** Extra root class names. */
  className?: string
}

/* ───────────────────────────── scene maths ─────────────────────────────
   Everything the scene and the form compute, kept free of the DOM so the
   page's hero field can import the exact same drawing. */

/** mulberry32 — small, fast, deterministic. Returns floats in [0, 1). */
export function mrfRng(seed: number) {
  let a = (seed | 0) ^ 0x9e3779b9
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** "#rgb" / "#rrggbb" to [r, g, b]; anything else is null so callers can fall back. */
export function mrfHex(c: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((c || "").trim())
  if (!m) return null
  let h = m[1]
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function mrfClamp(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x
}

export function mrfSmooth(e0: number, e1: number, x: number) {
  const t = mrfClamp((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}

/** Quartic ease-out: quick to leave, long soft landing. */
export function mrfEase(t: number) {
  const c = mrfClamp(t)
  return 1 - (1 - c) * (1 - c) * (1 - c) * (1 - c)
}

/** 256 × 256 value noise that tiles in both directions, lattice every 8 cells. Values in [0, 1). */
export function mrfNoiseTable(seed: number) {
  const rnd = mrfRng(seed * 7919 + 17)
  const G = 32
  const lat = new Float32Array(G * G)
  for (let i = 0; i < lat.length; i++) lat[i] = rnd()
  const out = new Float32Array(65536)
  for (let y = 0; y < 256; y++) {
    const gy = y / 8
    const y0 = Math.floor(gy)
    const fy = gy - y0
    const sy = fy * fy * (3 - 2 * fy)
    const r0 = (y0 % G) * G
    const r1 = ((y0 + 1) % G) * G
    for (let x = 0; x < 256; x++) {
      const gx = x / 8
      const x0 = Math.floor(gx)
      const fx = gx - x0
      const sx = fx * fx * (3 - 2 * fx)
      const c0 = x0 % G
      const c1 = (x0 + 1) % G
      const a = lat[r0 + c0] + (lat[r0 + c1] - lat[r0 + c0]) * sx
      const b = lat[r1 + c0] + (lat[r1 + c1] - lat[r1 + c0]) * sx
      out[(y << 8) | x] = a + (b - a) * sy
    }
  }
  return out
}

/** Bilinear read of a noise table at a non-negative coordinate, wrapping. */
export function mrfSample(t: Float32Array, x: number, y: number) {
  const x0 = x | 0
  const y0 = y | 0
  const fx = x - x0
  const fy = y - y0
  const xa = x0 & 255
  const xb = (x0 + 1) & 255
  const ya = (y0 & 255) << 8
  const yb = ((y0 + 1) & 255) << 8
  const a = t[ya | xa] + (t[ya | xb] - t[ya | xa]) * fx
  const b = t[yb | xa] + (t[yb | xb] - t[yb | xa]) * fx
  return a + (b - a) * fy
}

export interface MrfDome {
  c: number
  w: number
  h: number
}

export interface MrfLayerSpec {
  /** 0 for the farthest ridge, 1 for the nearest. */
  q: number
  /** Crest baseline, as a fraction of the hero height. */
  base: number
  /** How tall the domes stand, as a fraction of the hero height. */
  amp: number
  domes: MrfDome[]
  waves: { f: number; p: number; a: number }[]
  /** Depth of the hill face that the shading runs over, as a fraction of the hero height. */
  depth: number
  /** Aerial haze mixed into the whole ridge. */
  haze: number
}

/** The shape of ridge i of n: a soft union of grassy domes over a slow undulation. */
export function mrfLayerSpec(i: number, n: number, seed: number): MrfLayerSpec {
  const q = n > 1 ? i / (n - 1) : 1
  const rnd = mrfRng(seed * 977 + i * 131 + 7)
  const count = q > 0.9 ? 2 : 3 + Math.floor(rnd() * 1.6)
  const domes: MrfDome[] = []
  const span = 2.8 / count
  // Alternate the tall side layer to layer, so ridges overlap like real valleys.
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
    depth: 0.16 + q * 0.3,
    haze: 0.03 + 0.5 * Math.pow(1 - q, 1.7),
  }
}

/** Crest height (CSS px from the top) of a ridge at x, for a scene W wide whose hero band is H tall. */
export function mrfCrestAt(spec: MrfLayerSpec, x: number, W: number, H: number) {
  // World units are 1000 CSS px wide and centred, so a narrow screen sees a
  // crop of the same range instead of a squashed one.
  const u = (x - W / 2) / 1000
  let sum = 0
  for (let k = 0; k < spec.domes.length; k++) {
    const d = spec.domes[k]
    const z = (u - d.c) / d.w
    sum += Math.exp(14 * d.h * Math.exp(-z * z))
  }
  const top = Math.log(sum) / 14
  let wave = 0
  for (let k = 0; k < spec.waves.length; k++) {
    const o = spec.waves[k]
    wave += o.a * Math.sin(u * o.f * 6.2832 + o.p)
  }
  return H * (spec.base - spec.amp * (top + wave))
}

/** 0–1: how close x sits to a crease where two domes of a ridge meet. */
export function mrfSeamAt(spec: MrfLayerSpec, x: number, W: number) {
  const u = (x - W / 2) / 1000
  let a = 0
  let b = 0
  for (let k = 0; k < spec.domes.length; k++) {
    const d = spec.domes[k]
    const z = (u - d.c) / d.w
    const v = d.h * Math.exp(-z * z)
    if (v > a) {
      b = a
      a = v
    } else if (v > b) b = v
  }
  const g = (a - b) / 0.07
  return b > 0.12 ? Math.exp(-g * g) : 0
}

const MRF_L = (() => {
  const v = [0.42, 0.78, 0.46]
  const l = Math.hypot(v[0], v[1], v[2])
  return [v[0] / l, v[1] / l, v[2] / l]
})()

/**
 * Light on a hill face, 0–1. m is the crest slope (dy/dx, screen y down), t
 * runs from 0 at the crest to 1 deep in the face.
 */
export function mrfShade(m: number, t: number) {
  const f = Math.pow(mrfClamp(t), 0.6)
  const nx = m * 2.4 * (1 - f)
  const ny = 1 - f + 0.18
  const nz = 0.22 + f * 1.15
  const l = Math.hypot(nx, ny, nz)
  const d = (nx * MRF_L[0] + ny * MRF_L[1] + nz * MRF_L[2]) / l
  return mrfClamp(0.12 + 0.88 * d)
}

export interface MrfPaintOptions {
  /** Device px per CSS px. */
  s: number
  /** Horizontal bleed on each side, CSS px. */
  mx: number
  /** CSS y of the buffer's first row. */
  top: number
  /** CSS y below which the ridge is always covered by nearer ones: plain fill from there down. */
  detailTo: number
  W: number
  H: number
  spec: MrfLayerSpec
  lit: number[]
  shadow: number[]
  haze: number[]
  noise: Float32Array
  /** Flatten the shading toward the lit tone: printed ink, not atmosphere. */
  flat?: number
}

const MRF_STEPS = 64

/**
 * Paint columns c0…c1 of one ridge into an RGBA buffer w × h: clear sky above
 * the crest, shaded grass below.
 */
export function mrfPaintLayer(
  px: Uint8ClampedArray,
  w: number,
  h: number,
  o: MrfPaintOptions,
  c0 = 0,
  c1 = w,
) {
  const { s, mx, top, W, H, spec, lit, shadow, haze, noise } = o
  const out = new Uint32Array(px.buffer, px.byteOffset, w * h)
  const q = spec.q
  const flat = o.flat ?? 1
  const depthPx = Math.max(1, spec.depth * H)
  const A1 = (0.32 + 0.2 * q) * (0.4 + 0.6 * flat)
  const A2 = (0.08 + 0.2 * q) * (0.4 + 0.6 * flat)
  const A3 = 0.05 + 0.13 * q
  const lane = q * 97 + 4096
  const detailRows = Math.max(0, Math.min(h, Math.ceil((o.detailTo - top) * s)))
  const dn = Math.ceil(depthPx * s) + 2
  const hzL = new Float32Array(dn)
  const tL = new Uint8Array(dn)
  const darkL = new Float32Array(dn)
  const creaseL = new Float32Array(dn)
  for (let j = 0; j < dn; j++) {
    const d = j / s
    const t = mrfClamp(d / depthPx)
    hzL[j] = mrfClamp(spec.haze + 0.16 * (1 - q) * Math.exp(-d / 9) + 0.2 * (1 - q) * t * t) * flat
    tL[j] = Math.round(t * (MRF_STEPS - 1))
    darkL[j] = 1 - 0.3 * t * t * flat
    creaseL[j] = 0.38 * (1 - t * 0.7) * flat
  }
  const shadeT = new Float32Array(128 * MRF_STEPS)
  for (let mi = 0; mi < 128; mi++) {
    const mm = (mi / 127) * 4 - 2
    for (let k = 0; k < MRF_STEPS; k++) {
      const v = mrfShade(mm, k / (MRF_STEPS - 1))
      shadeT[mi * MRF_STEPS + k] = 1 - (1 - v) * flat
    }
  }
  const sR = shadow[0]
  const sG = shadow[1]
  const sB = shadow[2]
  const dR = lit[0] - sR
  const dG = lit[1] - sG
  const dB = lit[2] - sB
  const hR = haze[0]
  const hG = haze[1]
  const hB = haze[2]
  for (let c = Math.max(0, c0); c < Math.min(w, c1); c++) {
    const X = (c + 0.5) / s - mx
    const cy = mrfCrestAt(spec, X, W, H)
    const m = ((mrfCrestAt(spec, X + 1 / s, W, H) - mrfCrestAt(spec, X - 1 / s, W, H)) * s) / 2
    const seam = mrfSeamAt(spec, X, W)
    const row = Math.round((Math.max(-2, Math.min(2, m)) + 2) * 31.75) * MRF_STEPS
    const cyRow = (cy - top) * s
    const start = Math.max(0, Math.floor(cyRow) - 1)
    const pX = X * 0.045 + lane
    const cX = X * 0.3 + 4096
    const yBase = (start + 0.5) / s + top
    for (let r = start; r < h; r++) {
      const dd = r + 0.5 - cyRow
      const cov = dd + 0.5
      if (cov <= 0) continue
      const j = dd < 0 ? 0 : dd >= dn ? dn - 1 : dd | 0
      const sh = shadeT[row + tL[j]] * darkL[j] * (1 - seam * creaseL[j])
      let R = sR + dR * sh
      let G = sG + dG * sh
      let B = sB + dB * sh
      if (r < detailRows) {
        const d = dd / s
        const Y = yBase + (r - start) / s
        const patch = mrfSample(noise, pX, d * 0.09 + Y * 0.02 + lane) - 0.5
        const clump = mrfSample(noise, cX, d * 1.25 + lane) - 0.5
        let g = Math.imul(c + 7919, 374761393) ^ Math.imul(r + 104729, 668265263)
        g = Math.imul(g ^ (g >>> 13), 1274126177)
        const grain = ((g ^ (g >>> 16)) >>> 0) / 4294967296 - 0.5
        const tex = 1 + patch * A1 + clump * A2 + grain * A3
        R *= tex
        G *= tex
        B *= tex
      }
      const hz = hzL[j]
      R += (hR - R) * hz
      G += (hG - G) * hz
      B += (hB - B) * hz
      const A = cov >= 1 ? 255 : (cov * 255) | 0
      out[r * w + c] =
        ((A << 24) |
          ((B > 255 ? 255 : B < 0 ? 0 : B | 0) << 16) |
          ((G > 255 ? 255 : G < 0 ? 0 : G | 0) << 8) |
          (R > 255 ? 255 : R < 0 ? 0 : R | 0)) >>>
        0
    }
  }
}

/** A horizontally tiling band of mist alpha, w × h, values 0–1. */
export function mrfMistBand(noise: Float32Array, w: number, h: number) {
  const out = new Float32Array(w * h)
  for (let y = 0; y < h; y++) {
    const v = (y + 0.5) / h
    const bell = Math.exp(-Math.pow((v - 0.55) / 0.22, 2))
    for (let x = 0; x < w; x++) {
      const nx = (x * 256) / w
      const a = noise[(((y * 96) / h) | 0) << 8 | (nx | 0)]
      const b = noise[((((y * 40) / h) | 0) + 128) << 8 | (((nx * 2) | 0) & 255)]
      out[y * w + x] = mrfClamp((a * 0.65 + b * 0.35 - 0.36) * 2.6) * bell
    }
  }
  return out
}

/** Where the page is relative to the footer: 0 as it enters the viewport, 1 once it has fully arrived. */
export function mrfArrival(top: number, height: number, vh: number) {
  const end = Math.max(0, vh - height)
  return mrfClamp((vh - top) / Math.max(1, vh - end))
}

export function mrfIsEmail(v: string) {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(v.trim())
}

export interface MrfHeadingWord {
  text: string
  accent: boolean
}

/** "Take the *first step*\nwith X today." → lines of words, accent marked. */
export function mrfParseHeading(src: string) {
  return src.split("\n").map((line) => {
    const words: MrfHeadingWord[] = []
    line.split("*").forEach((seg, k) => {
      for (const w of seg.split(/\s+/)) if (w) words.push({ text: w, accent: k % 2 === 1 })
    })
    return words
  })
}

export interface MrfStem {
  stem: string
  parts: string[]
  x: number
  order: number
}

const f1 = (v: number) => (Math.round(v * 10) / 10).toString()

/** Wildflower line drawings in a 1200 × 420 box: stems, leaves, and a head on each. */
export function mrfBotany(seed: number, count: number) {
  const rnd = mrfRng(seed * 31 + 5)
  const out: MrfStem[] = []
  const B = 420
  for (let k = 0; k < count; k++) {
    const x = 70 + (k + 0.2 + rnd() * 0.6) * (1060 / count)
    const hgt = 150 + rnd() * 230
    const lean = (rnd() - 0.5) * 110
    const ax = x
    const ay = B
    const bx = x + lean
    const by = B - hgt
    const cx = x + lean * 0.1 + (rnd() - 0.5) * 40
    const cy = B - hgt * 0.55
    const at = (t: number) => [
      (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx,
      (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * by,
    ]
    const tan = (t: number) => {
      const dx = 2 * (1 - t) * (cx - ax) + 2 * t * (bx - cx)
      const dy = 2 * (1 - t) * (cy - ay) + 2 * t * (by - cy)
      const l = Math.hypot(dx, dy) || 1
      return [dx / l, dy / l]
    }
    const parts: string[] = []
    const leaves = 2 + Math.floor(rnd() * 3)
    for (let j = 0; j < leaves; j++) {
      const t = 0.14 + j * (0.55 / leaves) + rnd() * 0.05
      const [px, py] = at(t)
      const [tx, ty] = tan(t)
      const side = j % 2 ? 1 : -1
      const ang = 0.75 * side
      const dx = tx * Math.cos(ang) - ty * Math.sin(ang)
      const dy = tx * Math.sin(ang) + ty * Math.cos(ang)
      const len = 26 + rnd() * 30
      const ex = px + dx * len
      const ey = py + dy * len
      const nx = -dy * len * 0.28
      const ny = dx * len * 0.28
      const mx = (px + ex) / 2
      const my = (py + ey) / 2
      parts.push(
        "M" + f1(px) + " " + f1(py) + "Q" + f1(mx + nx) + " " + f1(my + ny) + " " + f1(ex) + " " + f1(ey) +
          "Q" + f1(mx - nx) + " " + f1(my - ny) + " " + f1(px) + " " + f1(py) +
          "M" + f1(px + dx * len * 0.15) + " " + f1(py + dy * len * 0.15) + "L" + f1(px + dx * len * 0.75) + " " + f1(py + dy * len * 0.75),
      )
    }
    const kind = Math.floor(rnd() * 4)
    if (kind === 0) {
      const r = 15 + rnd() * 9
      const rot = rnd() * 6.28
      for (let p = 0; p < 6; p++) {
        const a = rot + (p / 6) * 6.2832
        const ux = Math.cos(a)
        const uy = Math.sin(a)
        const sx = bx + ux * r * 0.22
        const sy = by + uy * r * 0.22
        const ex = bx + ux * r
        const ey = by + uy * r
        const w = r * 0.42
        parts.push(
          "M" + f1(sx) + " " + f1(sy) + "C" + f1(sx + ux * r * 0.3 - uy * w) + " " + f1(sy + uy * r * 0.3 + ux * w) + " " +
            f1(ex - uy * w * 0.6) + " " + f1(ey + ux * w * 0.6) + " " + f1(ex) + " " + f1(ey) +
            "C" + f1(ex + uy * w * 0.6) + " " + f1(ey - ux * w * 0.6) + " " + f1(sx + ux * r * 0.3 + uy * w) + " " +
            f1(sy + uy * r * 0.3 - ux * w) + " " + f1(sx) + " " + f1(sy),
        )
      }
      const e = r * 0.2
      parts.push("M" + f1(bx - e) + " " + f1(by) + "a" + f1(e) + " " + f1(e) + " 0 1 0 " + f1(e * 2) + " 0a" + f1(e) + " " + f1(e) + " 0 1 0 " + f1(-e * 2) + " 0")
    } else if (kind === 1) {
      const r = 16 + rnd() * 8
      const n = 16
      let d = ""
      for (let p = 0; p < n; p++) {
        const a = (p / n) * 6.2832 + rnd() * 0.15
        const ux = Math.cos(a)
        const uy = Math.sin(a)
        const ex = bx + ux * r
        const ey = by + uy * r
        d += "M" + f1(bx + ux * 2) + " " + f1(by + uy * 2) + "L" + f1(ex) + " " + f1(ey)
        d += "M" + f1(ex - uy * 2.6) + " " + f1(ey + ux * 2.6) + "L" + f1(ex + uy * 2.6) + " " + f1(ey - ux * 2.6)
      }
      parts.push(d)
    } else if (kind === 2) {
      const [tx, ty] = tan(1)
      for (let p = 0; p < 6; p++) {
        const along = p * 7
        const px = bx - tx * along
        const py = by - ty * along
        for (const side of [-1, 1]) {
          const ang = 0.5 * side
          const dx = tx * Math.cos(ang) - ty * Math.sin(ang)
          const dy = tx * Math.sin(ang) + ty * Math.cos(ang)
          const len = 10 - p * 0.6
          const ex = px + dx * len
          const ey = py + dy * len
          parts.push("M" + f1(px) + " " + f1(py) + "Q" + f1(px + dx * len * 0.5 - dy * 2.5 * side) + " " + f1(py + dy * len * 0.5 + dx * 2.5 * side) + " " + f1(ex) + " " + f1(ey))
        }
      }
    } else {
      const [tx, ty] = tan(1)
      const L = 18 + rnd() * 8
      const w = L * 0.42
      const ex = bx + tx * L
      const ey = by + ty * L
      parts.push(
        "M" + f1(bx) + " " + f1(by) + "C" + f1(bx - ty * w) + " " + f1(by + tx * w) + " " + f1(ex - ty * w * 0.5) + " " + f1(ey + tx * w * 0.5) + " " + f1(ex) + " " + f1(ey) +
          "C" + f1(ex + ty * w * 0.5) + " " + f1(ey - tx * w * 0.5) + " " + f1(bx + ty * w) + " " + f1(by - tx * w) + " " + f1(bx) + " " + f1(by),
        "M" + f1(bx - ty * 7) + " " + f1(by + tx * 7) + "Q" + f1(bx + tx * 4) + " " + f1(by + ty * 4) + " " + f1(bx + ty * 7) + " " + f1(by - tx * 7),
      )
    }
    out.push({ stem: "M" + f1(ax) + " " + f1(ay) + "Q" + f1(cx) + " " + f1(cy) + " " + f1(bx) + " " + f1(by), parts, x: ax, order: k / Math.max(1, count - 1) })
  }
  return out
}

/* ───────────────────────────── presets ───────────────────────────── */

const PRESETS: Record<MeadowTheme, MeadowPalette> = {
  // The brand's own surface: uncoated stock, six flat ridge inks, one marigold.
  print: {
    sky: ["#F4F2E9", "#E9ECE3"],
    haze: "#E9ECE3",
    glow: "#FFFBEF",
    hills: [
      ["#C4CDB8", "#B7C2AB"],
      ["#9DAE84", "#7D8F63"],
      ["#7D8F63", "#556A33"],
      ["#5E7440", "#415325"],
      ["#415325", "#2C3B1B"],
      ["#2C3B1B", "#1B2413"],
    ],
    ground: "#253019",
    ink: "#11140D",
    sub: "#3B4234",
    pill: "#D99A2B",
    pillInk: "#11140D",
    text: "#F4F2E9",
    muted: "#A9B49C",
    line: "rgba(244, 242, 233, 0.18)",
  },
  // The same sheet, after dark: the inks drop, the marigold stays.
  printNight: {
    sky: ["#0F1611", "#131C15"],
    haze: "#16211A",
    glow: "#16211A",
    hills: [
      ["#3A4A38", "#2E3D2D"],
      ["#2C3B2B", "#22301F"],
      ["#22301F", "#1A2618"],
      ["#1A2618", "#141E13"],
      ["#141E13", "#0F1710"],
      ["#0F1710", "#0A100B"],
    ],
    ground: "#0A100B",
    ink: "#E7EBE1",
    sub: "#A9B49C",
    pill: "#D99A2B",
    pillInk: "#0F1611",
    text: "#E7EBE1",
    muted: "#8D9A8A",
    line: "rgba(231, 235, 225, 0.16)",
  },
  meadow: {
    sky: ["#f4f4ef", "#e9ece3"],
    haze: "#e3e7dc",
    glow: "#fffbef",
    hills: [
      ["#b7c2ab", "#9fac95"],
      ["#a3b384", "#7d8f63"],
      ["#93a964", "#677c42"],
      ["#829a52", "#556a33"],
      ["#6c8240", "#415325"],
      ["#4d5d2c", "#283318"],
    ],
    ground: "#253019",
    ink: "#11140d",
    sub: "#3b4234",
    pill: "#ffffff",
    pillInk: "#11140d",
    text: "#eef1e6",
    muted: "#a9b49c",
    line: "rgba(238, 241, 230, 0.16)",
  },
  golden: {
    sky: ["#f7eee2", "#f1dcc0"],
    haze: "#ecd6b9",
    glow: "#ffe2b0",
    hills: [
      ["#cdb79d", "#b49f88"],
      ["#bba774", "#968653"],
      ["#a99f57", "#7c743a"],
      ["#94904a", "#64622c"],
      ["#767839", "#4a4c20"],
      ["#4f5126", "#2b2c14"],
    ],
    ground: "#272712",
    ink: "#1d140b",
    sub: "#4d3f2d",
    pill: "#fffaf2",
    pillInk: "#1d140b",
    text: "#f6efe0",
    muted: "#bdb294",
    line: "rgba(246, 239, 224, 0.16)",
  },
  moonlit: {
    sky: ["#121a26", "#27324a"],
    haze: "#2a3549",
    glow: "#c9d8ff",
    hills: [
      ["#3b4859", "#2e3a4a"],
      ["#33443f", "#253432"],
      ["#2d3f33", "#1f2d25"],
      ["#26382b", "#19281e"],
      ["#1e2e22", "#132017"],
      ["#162319", "#0c150f"],
    ],
    ground: "#0d1510",
    ink: "#eef0e8",
    sub: "#b4bdb0",
    pill: "#eef0e8",
    pillInk: "#0d1510",
    text: "#e7ebe1",
    muted: "#8d9a8a",
    line: "rgba(231, 235, 225, 0.13)",
    night: true,
  },
}

const DEFAULT_COLUMNS: MeadowColumn[] = [
  { title: "Navigate", links: [{ label: "Home" }, { label: "About" }, { label: "Stories" }, { label: "Services" }] },
  { title: "Company", links: [{ label: "Careers" }, { label: "Press" }, { label: "Partners" }] },
  { title: "Support", links: [{ label: "Contact" }, { label: "FAQs" }] },
]

const DEFAULT_SOCIALS: MeadowSocial[] = [
  { icon: "linkedin" },
  { icon: "instagram" },
  { icon: "facebook" },
  { icon: "x" },
]

const DEFAULT_LEGAL: MeadowLink[] = [{ label: "Privacy Policy" }, { label: "Terms of Use" }]

const SOCIAL_NAMES: Record<MeadowSocialIcon, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X",
  youtube: "YouTube",
}

const SANS_STACK = '"Inter Tight", "Instrument Sans", "Geist", "Helvetica Neue", Arial, system-ui, sans-serif'
const SERIF_STACK = '"Instrument Serif", "Cormorant Garamond", "Playfair Display", "Iowan Old Style", Georgia, serif'

const SOCIAL_ICONS: Record<MeadowSocialIcon, React.ReactNode> = {
  linkedin: (
    <path
      fill="currentColor"
      d="M5 3.6a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.2 9.4h3.6V20.6H3.2V9.4Zm5.9 0h3.45v1.53h.05c.48-.9 1.66-1.85 3.41-1.85 3.65 0 4.32 2.4 4.32 5.52v6H16.7v-5.32c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81v5.41H9.1V9.4Z"
    />
  ),
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.8" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.2" cy="6.8" r="0.4" fill="currentColor" />
    </g>
  ),
  facebook: (
    <path
      fill="currentColor"
      d="M13.6 21v-7.6h2.55l.4-3h-2.95V8.5c0-.86.25-1.45 1.48-1.45h1.57V4.36A21 21 0 0 0 14.36 4.2c-2.27 0-3.82 1.39-3.82 3.93v2.27H8v3h2.54V21h3.06Z"
    />
  ),
  x: (
    <path
      fill="currentColor"
      d="M17.2 3.75h2.9l-6.34 7.25 7.46 9.25h-5.84l-4.57-5.66-5.23 5.66H2.68l6.78-7.75L2.3 3.75h5.99l4.13 5.2 4.78-5.2Zm-1.02 14.84h1.6L7.39 5.32H5.66l10.52 13.27Z"
    />
  ),
  youtube: (
    <path
      fill="currentColor"
      d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"
    />
  ),
}

/** The rosette: a ring, a disc, eight petals cut out of it — the brand's own path. */
const MARK_PATH =
  "M2 32A30 30 0 1 0 62 32A30 30 0 1 0 2 32ZM6.6 32A25.4 25.4 0 1 0 57.4 32A25.4 25.4 0 1 0 6.6 32ZM10.6 32A21.4 21.4 0 1 0 53.4 32A21.4 21.4 0 1 0 10.6 32ZM32 26.4C36.4 22.2 36.09 14.08 32 12.4C27.91 14.08 27.6 22.2 32 26.4ZM35.96 28.04C42.04 28.18 47.56 22.22 45.86 18.14C41.78 16.44 35.82 21.96 35.96 28.04ZM37.6 32C41.8 36.4 49.92 36.09 51.6 32C49.92 27.91 41.8 27.6 37.6 32ZM35.96 35.96C35.82 42.04 41.78 47.56 45.86 45.86C47.56 41.78 42.04 35.82 35.96 35.96ZM32 37.6C27.6 41.8 27.91 49.92 32 51.6C36.09 49.92 36.4 41.8 32 37.6ZM28.04 35.96C21.96 35.82 16.44 41.78 18.14 45.86C22.22 47.56 28.18 42.04 28.04 35.96ZM26.4 32C22.2 27.6 14.08 27.91 12.4 32C14.08 36.09 22.2 36.4 26.4 32ZM28.04 28.04C28.18 21.96 22.22 16.44 18.14 18.14C16.44 22.22 21.96 28.18 28.04 28.04ZM29.8 32A2.2 2.2 0 1 0 34.2 32A2.2 2.2 0 1 0 29.8 32Z"

function PetalMark() {
  return (
    <svg className="mrf-mark" viewBox="0 0 64 64" width="30" height="30" aria-hidden="true">
      <path className="mrf-markpath" fill="currentColor" fillRule="evenodd" d={MARK_PATH} />
    </svg>
  )
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const MRF_CSS = `
.mrf-root {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  background: var(--mrf-ground);
  color: var(--mrf-text);
  font-family: var(--mrf-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
.mrf-root *, .mrf-root *::before, .mrf-root *::after { box-sizing: border-box; }
.mrf-scene { position: absolute; inset: 0 0 auto 0; height: var(--mrf-hero); z-index: 0; pointer-events: none; background: linear-gradient(to bottom, var(--mrf-sky-0), var(--mrf-sky-1)); }
.mrf-scene canvas { display: block; width: 100%; height: 100%; max-width: none; }
.mrf-hero {
  position: relative;
  z-index: 2;
  height: var(--mrf-hero);
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(44px, 7%, 92px) 20px 0;
  text-align: center;
  transform: translate3d(0, calc((1 - var(--mrf-k, 1)) * 44px), 0);
}
.mrf-h {
  margin: 0;
  max-width: 18ch;
  font-family: var(--mrf-sans);
  font-weight: 500;
  font-size: clamp(34px, 5.2vw, 74px);
  line-height: 1.0;
  letter-spacing: -0.04em;
  color: var(--mrf-ink);
  text-wrap: balance;
}
.mrf-line { display: block; white-space: normal; }
.mrf-w {
  display: inline-block;
  overflow: hidden;
  padding: 0.04em 0.06em 0.16em;
  margin: -0.04em -0.06em -0.16em;
  vertical-align: top;
}
.mrf-wi {
  display: inline-block;
  transform: translate3d(0, 108%, 0) rotate(4deg);
  transform-origin: 0 100%;
  transition: transform 1150ms cubic-bezier(.16, 1, .3, 1);
  transition-delay: calc(var(--d, 0) * 1ms);
}
.mrf-acc .mrf-wi {
  font-family: var(--mrf-serif);
  font-style: italic;
  font-weight: 400;
  font-size: 1.08em;
  letter-spacing: -0.02em;
  padding-right: 0.04em;
  transform: translate3d(-0.08em, 0, 0) skewX(-10deg);
  clip-path: inset(-20% 100% -30% -5%);
  filter: blur(6px);
  opacity: 0.2;
  transition: clip-path 1400ms cubic-bezier(.65, 0, .25, 1), transform 1600ms cubic-bezier(.16, 1, .3, 1), filter 1100ms ease, opacity 900ms ease;
  transition-delay: calc(var(--d, 0) * 1ms);
}
.mrf-in .mrf-wi { transform: none; }
.mrf-in .mrf-acc .mrf-wi { clip-path: inset(-20% -10% -30% -5%); filter: blur(0); opacity: 1; }
.mrf-sub {
  margin: clamp(14px, 2vw, 24px) 0 0;
  max-width: 46ch;
  font-size: clamp(13.5px, 1.05vw, 15.5px);
  line-height: 1.58;
  letter-spacing: -0.006em;
  color: var(--mrf-sub);
}
.mrf-r {
  opacity: 0;
  transform: translate3d(0, 12px, 0);
  transition: opacity 900ms ease, transform 1100ms cubic-bezier(.16, 1, .3, 1);
  transition-delay: calc(var(--d, 0) * 1ms);
}
.mrf-in .mrf-r { opacity: 1; transform: none; }
.mrf-cta-wrap { margin-top: clamp(18px, 2.4vw, 28px); }
.mrf-cta {
  --mx: 0px;
  --my: 0px;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  height: 46px;
  padding: 0 8px 0 20px;
  border-radius: 999px;
  background: var(--mrf-pill);
  color: var(--mrf-pill-ink);
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-decoration: none;
  overflow: hidden;
  box-shadow: 0 10px 30px -14px rgba(20, 30, 10, 0.5);
  transform: translate3d(var(--mx), var(--my), 0);
  transition: transform 500ms cubic-bezier(.2, .9, .3, 1.2), color 450ms ease, box-shadow 450ms ease;
}
.mrf-cta::before {
  content: "";
  position: absolute;
  left: var(--fx, 50%);
  top: var(--fy, 50%);
  width: 260px;
  height: 260px;
  margin: -130px 0 0 -130px;
  border-radius: 50%;
  background: var(--mrf-ground);
  transform: scale(0);
  transition: transform 650ms cubic-bezier(.16, 1, .3, 1);
}
.mrf-cta > * { position: relative; }
.mrf-cta-arrow {
  position: relative;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--mrf-ground);
  color: var(--mrf-pill);
  overflow: hidden;
  transition: background 450ms ease, color 450ms ease;
}
.mrf-cta-arrow svg { grid-area: 1 / 1; transition: transform 520ms cubic-bezier(.65, 0, .25, 1); }
.mrf-cta-arrow .mrf-a2 { transform: translate(-150%, 150%); }
.mrf-cta:hover, .mrf-cta:focus-visible { color: var(--mrf-text); }
.mrf-cta:hover::before, .mrf-cta:focus-visible::before { transform: scale(1); }
.mrf-cta:hover .mrf-cta-arrow, .mrf-cta:focus-visible .mrf-cta-arrow { background: var(--mrf-pill); color: var(--mrf-ground); }
.mrf-cta:hover .mrf-a1, .mrf-cta:focus-visible .mrf-a1 { transform: translate(150%, -150%); }
.mrf-cta:hover .mrf-a2, .mrf-cta:focus-visible .mrf-a2 { transform: none; }
.mrf-cta:focus-visible { outline: 2px solid var(--mrf-ink); outline-offset: 3px; }

/* print preset — a printed sheet casts nothing and cuts no corners */
.mrf-root.mrf-print .mrf-cta { border-radius: 0; box-shadow: none; padding: 0 6px 0 20px; }
.mrf-root.mrf-print .mrf-cta::before { border-radius: 0; }
.mrf-root.mrf-print .mrf-cta-arrow { border-radius: 0; }
.mrf-root.mrf-print .mrf-h {
  font-family: var(--mrf-serif);
  font-weight: 400;
  font-size: clamp(34px, 4.6vw, 60px);
  line-height: 0.98;
  letter-spacing: -0.024em;
  max-width: 22ch;
}
.mrf-root.mrf-print .mrf-wi { filter: none; }
.mrf-root.mrf-print .mrf-acc .mrf-wi { filter: none; }
.mrf-root.mrf-print .mrf-r { transform: none; opacity: 1; }
/* printed: nothing types itself in. the only motion is the range settling,
   so a static capture is already the finished footer. */
.mrf-root.mrf-print .mrf-hero { transform: none; }
.mrf-root.mrf-print .mrf-wi { transform: none; }
.mrf-root.mrf-print .mrf-acc .mrf-wi { clip-path: none; opacity: 1; transform: none; }
.mrf-root.mrf-print .mrf-draw { stroke-dashoffset: 0; }
.mrf-root.mrf-print .mrf-stem { animation: none; }
.mrf-root.mrf-print .mrf-rule { transform: none; }
.mrf-root.mrf-print .mrf-rule { transition: transform 1200ms cubic-bezier(.65, 0, .25, 1) 400ms; }

.mrf-body { position: relative; z-index: 1; flex: 1 0 auto; display: flex; flex-direction: column; }
.mrf-botany {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: max(100%, 1100px);
  height: 92%;
  transform: translateX(-50%);
  max-width: none;
  color: var(--mrf-text);
  opacity: 0.09;
  pointer-events: none;
  z-index: 0;
}
.mrf-stem { transform-box: view-box; animation: mrf-sway 9s ease-in-out infinite alternate; animation-delay: calc(var(--sd, 0) * -1s); }
@keyframes mrf-sway { from { transform: rotate(-0.9deg); } to { transform: rotate(1.1deg); } }
.mrf-draw {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 2400ms cubic-bezier(.45, 0, .2, 1);
  transition-delay: calc(var(--d, 0) * 1ms);
}
.mrf-botany .mrf-draw { vector-effect: non-scaling-stroke; stroke-width: 1.15; }
.mrf-in .mrf-draw { stroke-dashoffset: 0; }

.mrf-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--mrf-max);
  margin: 0 auto;
  padding: clamp(26px, 4vw, 50px) clamp(20px, 3.4vw, 44px) 26px;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
}
.mrf-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 40px; }
@media (min-width: 860px) {
  .mrf-grid { grid-template-columns: minmax(260px, 1.1fr) minmax(0, 1.9fr); gap: 56px; }
}
.mrf-brand { max-width: 340px; }
.mrf-logo {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: var(--mrf-text);
  text-decoration: none;
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.025em;
}
.mrf-logo:focus-visible { outline: 2px solid var(--mrf-text); outline-offset: 4px; }
.mrf-mark { flex: none; overflow: visible; }
.mrf-markpath { opacity: 0; transition: opacity 900ms ease 1100ms; }
.mrf-in .mrf-markpath { opacity: 1; }
.mrf-petals { transform-origin: 32px 32px; transition: transform 1100ms cubic-bezier(.16, 1, .3, 1); }
.mrf-logo:hover .mrf-markpath { opacity: 1; }
.mrf-tag { margin: 18px 0 0; font-size: 13px; line-height: 1.55; color: var(--mrf-muted); max-width: 30ch; }
.mrf-form { position: relative; margin-top: 26px; display: flex; align-items: center; gap: 10px; height: 46px; max-width: 330px; }
.mrf-form::before, .mrf-form::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; }
.mrf-form::before { background: var(--mrf-line); }
.mrf-form::after { background: var(--mrf-text); transform: scaleX(0); transform-origin: 0 50%; transition: transform 700ms cubic-bezier(.16, 1, .3, 1); }
.mrf-form:focus-within::after { transform: scaleX(1); }
.mrf-form[data-state="error"]::after { background: #e8a48f; transform: scaleX(1); }
.mrf-form > svg { flex: none; color: var(--mrf-muted); }
.mrf-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: 0;
  padding: 0;
  background: transparent;
  color: var(--mrf-text);
  font: inherit;
  font-size: 13px;
}
.mrf-input::placeholder { color: var(--mrf-muted); opacity: 0.75; }
.mrf-send {
  flex: none;
  position: relative;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--mrf-text);
  color: var(--mrf-ground);
  cursor: pointer;
  overflow: hidden;
  transition: transform 450ms cubic-bezier(.2, .9, .3, 1.3);
}
.mrf-send:hover { transform: scale(1.1); }
.mrf-send:focus-visible { outline: 2px solid var(--mrf-text); outline-offset: 3px; }
.mrf-send > * { grid-area: 1 / 1; transition: transform 500ms cubic-bezier(.65, 0, .25, 1), opacity 300ms ease; }
.mrf-send .mrf-a2 { transform: translate(-150%, 150%); }
.mrf-send:hover .mrf-a1 { transform: translate(150%, -150%); }
.mrf-send:hover .mrf-a2 { transform: none; }
.mrf-spin, .mrf-check { opacity: 0; transform: scale(0.4); }
.mrf-spin { animation: mrf-rot 800ms linear infinite; }
@keyframes mrf-rot { to { rotate: 360deg; } }
.mrf-form[data-state="sending"] .mrf-a1, .mrf-form[data-state="sending"] .mrf-a2,
.mrf-form[data-state="done"] .mrf-a1, .mrf-form[data-state="done"] .mrf-a2 { opacity: 0; transform: scale(0.4); }
.mrf-form[data-state="sending"] .mrf-spin { opacity: 1; transform: none; }
.mrf-form[data-state="done"] .mrf-check { opacity: 1; transform: none; }
.mrf-check path { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 500ms 150ms ease; }
.mrf-form[data-state="done"] .mrf-check path { stroke-dashoffset: 0; }
.mrf-msg { position: absolute; left: 0; top: calc(100% + 9px); margin: 0; font-size: 12px; line-height: 1.4; color: var(--mrf-muted); opacity: 0; transform: translateY(-4px); transition: opacity 400ms ease, transform 500ms cubic-bezier(.16, 1, .3, 1); }
.mrf-msg[data-show="true"] { opacity: 1; transform: none; }
.mrf-form[data-state="error"] .mrf-msg { color: #e8a48f; }
.mrf-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

.mrf-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 34px 24px; }
@media (min-width: 640px) { .mrf-cols { grid-template-columns: repeat(var(--mrf-n), minmax(0, 1fr)); } }
.mrf-col h3 { margin: 0 0 18px; font-size: 13px; font-weight: 500; letter-spacing: -0.01em; color: var(--mrf-text); }
.mrf-col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 11px; }
.mrf-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  line-height: 1.35;
  color: var(--mrf-muted);
  text-decoration: none;
  transition: color 350ms ease, transform 500ms cubic-bezier(.16, 1, .3, 1);
}
.mrf-link::before {
  content: "";
  position: absolute;
  left: -13px;
  top: 50%;
  width: 6px;
  height: 6px;
  margin-top: -3px;
  background: var(--mrf-text);
  opacity: 0;
  transform: scale(0.2) rotate(-45deg);
  transition: opacity 300ms ease, transform 500ms cubic-bezier(.16, 1, .3, 1);
}
.mrf-link:hover, .mrf-link:focus-visible { color: var(--mrf-text); transform: translateX(8px); }
.mrf-link:hover::before, .mrf-link:focus-visible::before { opacity: 1; transform: none; }
.mrf-link:focus-visible { outline: 2px solid var(--mrf-text); outline-offset: 3px; }
.mrf-social { display: flex; flex-wrap: wrap; gap: 6px; margin: -7px 0 0 -7px; list-style: none; padding: 0; }
.mrf-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--mrf-muted);
  transition: color 300ms ease, background 300ms ease, transform 450ms cubic-bezier(.2, .9, .3, 1.4);
}
.mrf-icon:hover, .mrf-icon:focus-visible { color: var(--mrf-text); background: var(--mrf-line); transform: translateY(-3px); }
.mrf-root.mrf-print .mrf-icon { border-radius: 0; }

.mrf-bottom {
  position: relative;
  margin-top: auto;
  padding-top: 22px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  font-size: 12px;
  color: var(--mrf-muted);
}
.mrf-rule { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: var(--mrf-line); transform: scaleX(0); transform-origin: 0 50%; transition: transform 1800ms cubic-bezier(.65, 0, .25, 1) 900ms; }
.mrf-in .mrf-rule { transform: none; }
.mrf-bottom p { margin: 0; }
.mrf-legal { list-style: none; margin: 0; padding: 0; display: flex; gap: 28px; }
.mrf-legal .mrf-link { font-size: 12px; }
.mrf-spacer { flex: 1 0 clamp(40px, 8vw, 96px); }

@media (prefers-reduced-motion: reduce) {
  .mrf-hero { transform: none; }
  .mrf-wi, .mrf-acc .mrf-wi, .mrf-r, .mrf-draw, .mrf-rule, .mrf-cta, .mrf-link, .mrf-petals { transition: none !important; }
  .mrf-stem { animation: none; }
  .mrf-acc .mrf-wi { clip-path: none; opacity: 1; filter: none; transform: none; }
  .mrf-r { opacity: 1; transform: none; }
  .mrf-draw { stroke-dashoffset: 0; }
}
`

export default function MeadowRiseFooter({
  name = "Serenica",
  brandHref = "#",
  logo,
  heading,
  subheading = "Confidential, compassionate support is just one click away.",
  cta = { label: "Contact Support", href: "#" },
  tagline = "Join our community for mindful insights and gentle guidance.",
  newsletter = true,
  placeholder = "Enter your email",
  onSubscribe,
  successMessage = "Welcome in. Your first note arrives Sunday.",
  columns = DEFAULT_COLUMNS,
  socialTitle = "Social",
  socials = DEFAULT_SOCIALS,
  copyright,
  legal = DEFAULT_LEGAL,
  preset = "auto",
  palette,
  seed = 3,
  mist,
  drift = 1,
  interactive = true,
  scrollParallax = true,
  botanicals = true,
  height = "1040px",
  heroHeight = "clamp(460px, 64svh, 680px)",
  maxWidth = "1240px",
  fontFamily = SANS_STACK,
  serifFamily = SERIF_STACK,
  className = "",
}: MeadowRiseFooterProps) {
  const rootRef = React.useRef<HTMLElement | null>(null)
  const heroRef = React.useRef<HTMLDivElement | null>(null)
  const sceneRef = React.useRef<HTMLDivElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const revealAt = React.useRef<number | null>(null)
  const [inView, setInView] = React.useState(false)
  const [dark, setDark] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [formState, setFormState] = React.useState("idle")
  const [message, setMessage] = React.useState("")
  const uid = React.useId().replace(/:/g, "")
  const inputId = "mrf-email-" + uid

  const resolved: MeadowTheme = preset === "auto" ? (dark ? "printNight" : "print") : (preset as MeadowTheme)
  const base = PRESETS[resolved] || PRESETS.print
  const colors: MeadowPalette = { ...base, ...(palette || {}) }
  const hills = colors.hills && colors.hills.length >= 2 ? colors.hills : base.hills
  const isPrint = resolved === "print" || resolved === "printNight"
  const mistAmt = mist ?? (isPrint ? 0 : 0.55)
  const flat = isPrint ? 0.55 : 1

  const opts = React.useRef({ mist: mistAmt, drift, interactive, scrollParallax })
  opts.current = { mist: mistAmt, drift, interactive, scrollParallax }
  const key = [
    seed,
    colors.sky.join(),
    colors.haze,
    colors.glow,
    colors.ground,
    colors.night ? 1 : 0,
    flat,
    hills.map((h) => h.join()).join(),
  ].join("|")

  // "auto" follows a .dark class on the page, the way 21st and shadcn theme.
  React.useEffect(() => {
    if (preset !== "auto") return
    const read = () => {
      const root = rootRef.current
      setDark(
        document.documentElement.classList.contains("dark") ||
          !!(root && (root.closest(".dark") || root.closest("[data-sr='night']"))),
      )
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => mo.disconnect()
  }, [preset])

  React.useEffect(() => {
    const root = rootRef.current
    const hero = heroRef.current
    const scene = sceneRef.current
    const canvas = canvasRef.current
    if (!root || !hero || !scene || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const rgb = (c: string, fb: number[]) => mrfHex(c) || fb
    const sky0 = rgb(colors.sky[0], [244, 242, 233])
    const sky1 = rgb(colors.sky[1], [233, 236, 227])
    const hazeC = rgb(colors.haze, sky1)
    const glowC = rgb(colors.glow, [255, 251, 239])
    const groundC = rgb(colors.ground, [37, 48, 25])
    const inkC = rgb(colors.ink, [17, 20, 13])
    const css = (c: number[], a: number) => "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"
    const hillC = hills.map((h) => [rgb(h[0], [120, 140, 80]), rgb(h[1], [80, 100, 50])])
    const night = !!colors.night && !isPrint
    const n = hillC.length
    const noise = mrfNoiseTable(seed)
    const specs = hillC.map((_, i) => mrfLayerSpec(i, n, seed))
    const MX = 40

    let W = 1
    let H = 1
    let SH = 1
    let overlap = 1
    let cs = 1
    type Layer = { c: HTMLCanvasElement; top: number; w: number; h: number }
    const layers: (Layer | null)[] = specs.map(() => null)
    let building = n
    let builtFor = ""
    let mistC: HTMLCanvasElement | null = null
    let rebuildTimer = 0

    let tx = 0
    let ty = 0
    let px = 0
    let py = 0
    let kT = 1
    let k = 1
    let kSet = -1
    let visible = true
    let seenAt: number | null = null
    let raf = 0
    let last = 0

    const measure = () => {
      W = Math.max(1, scene.clientWidth)
      H = Math.max(1, hero.offsetHeight)
      const bodyH = Math.max(0, root.offsetHeight - H)
      overlap = Math.round(Math.min(340, Math.max(160, bodyH * 0.6)))
      SH = H + overlap
      scene.style.height = SH + "px"
      cs = Math.min(window.devicePixelRatio || 1, 2)
      const cw = Math.round(W * cs)
      const ch = Math.round(SH * cs)
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw
        canvas.height = ch
      }
      const sig = W + "x" + H + "x" + SH
      if (sig !== builtFor) {
        window.clearTimeout(rebuildTimer)
        const first = builtFor === ""
        builtFor = sig
        const go = () => {
          building = 0
          job = null
          makeMist()
          wake()
        }
        if (first) go()
        else rebuildTimer = window.setTimeout(go, 140)
      }
    }

    type Job = {
      i: number
      c: HTMLCanvasElement
      g: CanvasRenderingContext2D
      img: ImageData
      o: MrfPaintOptions
      w: number
      h: number
      col: number
    }
    let job: Job | null = null
    const startJob = (i: number) => {
      const spec = specs[i]
      let minC = Infinity
      for (let x = -MX; x <= W + MX; x += 3) minC = Math.min(minC, mrfCrestAt(spec, x, W, H))
      const top = Math.floor(minC - 4)
      const s = Math.min(window.devicePixelRatio || 1, spec.q > 0.5 ? 1.25 : 1)
      const w = Math.ceil((W + MX * 2) * s)
      const h = Math.ceil((SH - top) * s)
      const c = document.createElement("canvas")
      const g = h > 0 ? c.getContext("2d") : null
      if (!g) {
        layers[i] = null
        return null
      }
      c.width = w
      c.height = h
      let detailTo = H + overlap * 0.8
      if (i + 1 < n) {
        let maxC = -Infinity
        for (let x = -MX; x <= W + MX; x += 3) maxC = Math.max(maxC, mrfCrestAt(specs[i + 1], x, W, H))
        detailTo = Math.min(detailTo, maxC + 70)
      }
      const o: MrfPaintOptions = {
        s,
        mx: MX,
        top,
        W,
        H,
        spec,
        lit: hillC[i][0],
        shadow: hillC[i][1],
        haze: hazeC,
        noise,
        flat,
        detailTo,
      }
      return { i, c, g, img: g.createImageData(w, h), o, w, h, col: 0 }
    }
    const work = (budget: number) => {
      const t0 = performance.now()
      while (building < n && performance.now() - t0 < budget) {
        if (!job) job = startJob(building)
        if (!job) {
          building++
          continue
        }
        const next = Math.min(job.w, job.col + 40)
        mrfPaintLayer(job.img.data, job.w, job.h, job.o, job.col, next)
        job.col = next
        if (job.col >= job.w) {
          job.g.putImageData(job.img, 0, 0)
          layers[job.i] = { c: job.c, top: job.o.top, w: job.w / job.o.s, h: job.h / job.o.s }
          job = null
          building++
        }
      }
    }
    const progress = () => (building >= n ? 1 : (building + (job ? job.col / job.w : 0)) / n)

    const makeMist = () => {
      if (!opts.current.mist) return
      const w = 320
      const h = 64
      const a = mrfMistBand(noise, w, h)
      const c = document.createElement("canvas")
      c.width = w
      c.height = h
      const g = c.getContext("2d")
      if (!g) return
      const img = g.createImageData(w, h)
      for (let i = 0; i < a.length; i++) {
        img.data[i * 4] = hazeC[0]
        img.data[i * 4 + 1] = hazeC[1]
        img.data[i * 4 + 2] = hazeC[2]
        img.data[i * 4 + 3] = a[i] * 255
      }
      g.putImageData(img, 0, 0)
      mistC = c
    }

    const draw = (now: number) => {
      const o = opts.current
      const dt = revealAt.current === null ? -1 : now - revealAt.current
      ctx.setTransform(cs, 0, 0, cs, 0, 0)

      if (isPrint) {
        // flat stock, edge to edge: no sky gradient, no glow
        ctx.fillStyle = css(sky0, 1)
        ctx.fillRect(0, 0, W, SH)
      } else {
        const sky = ctx.createLinearGradient(0, 0, 0, H * 0.8)
        sky.addColorStop(0, css(sky0, 1))
        sky.addColorStop(1, css(sky1, 1))
        ctx.fillStyle = sky
        ctx.fillRect(0, 0, W, SH)
        const ox = W * ((night ? 0.84 : 0.7) + px * 0.3)
        const oy = H * (night ? 0.1 : 0.14) + py * H * 0.08
        const dawn = dt < 0 ? 0 : mrfSmooth(0, 1600, dt)
        const R = Math.max(W, H) * 0.62
        const glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, R)
        glow.addColorStop(0, css(glowC, (night ? 0.24 : 0.85) * dawn))
        glow.addColorStop(0.35, css(glowC, (night ? 0.08 : 0.32) * dawn))
        glow.addColorStop(1, css(glowC, 0))
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, W, SH)
      }

      // A pencil horizon draws out from the centre while the ridges paint, then
      // the hills rise through it. In print it stays: one printed rule.
      if (!isPrint && dt < 1400 && (dt >= 0 || seenAt !== null)) {
        const p = dt >= 0 ? 1 : Math.min(progress(), mrfEase((now - (seenAt || now)) / 900))
        const lw = mrfEase(p) * W * 0.78
        const la = (1 - (dt < 0 ? 0 : mrfSmooth(150, 1100, dt))) * 0.42
        if (la > 0 && lw > 0.5) {
          const y = Math.round(H * specs[0].base)
          const lg = ctx.createLinearGradient(W / 2 - lw / 2, 0, W / 2 + lw / 2, 0)
          lg.addColorStop(0, css(inkC, 0))
          lg.addColorStop(0.5, css(inkC, la))
          lg.addColorStop(1, css(inkC, 0))
          ctx.fillStyle = lg
          ctx.fillRect(W / 2 - lw / 2, y, lw, 1)
        }
      }

      const par = o.scrollParallax && !reduced ? 1 - k : 0
      const mistOn = o.mist > 0 && !!mistC
      for (let i = 0; i < (dt < 0 ? 0 : n); i++) {
        const L = layers[i]
        if (!L) continue
        const e = dt < 0 ? 0 : mrfEase((dt - 150 - i * 120) / 1700)
        const rise = (1 - e) * H * (0.2 + 0.07 * i)
        const sy = par * (10 + i * 22)
        const lx = -px * (2 + i * 5)
        const ly = -py * (1 + i * 2)
        // print compresses the range toward the ground, so the sky keeps its
        // room for the statement instead of the hills climbing into it
        const comp = isPrint ? (H - L.top) * (1 - 0.88) : 0
        ctx.drawImage(L.c, -MX + lx, L.top + rise + sy + ly + comp, L.w, L.h)
        if (mistOn && mistC && (i === 1 || i === 3) && i + 1 < n) {
          const bw = W * 1.7
          const bh = H * (i === 1 ? 0.26 : 0.2)
          const speed = (i === 1 ? 7 : 11) * o.drift
          const off = reduced ? 0 : ((now * speed) / 1000) % bw
          const y = H * specs[i + 1].base - bh * 0.62 + rise * 0.6 + sy
          ctx.globalAlpha = o.mist * (i === 1 ? 0.9 : 0.65) * (dt < 0 ? 0 : mrfSmooth(900, 2600, dt))
          ctx.drawImage(mistC, -off + lx * 1.4, y, bw, bh)
          ctx.drawImage(mistC, bw - off + lx * 1.4, y, bw, bh)
          ctx.globalAlpha = 1
        }
      }

      if (!isPrint) {
        const ox = W * ((night ? 0.84 : 0.7) + px * 0.3)
        ctx.globalCompositeOperation = "soft-light"
        const pool = ctx.createRadialGradient(ox, H * 0.7, 0, ox, H * 0.7, W * 0.5)
        pool.addColorStop(0, css(glowC, (night ? 0.3 : 0.45) * (dt < 0 ? 0 : mrfSmooth(0, 1600, dt))))
        pool.addColorStop(1, css(glowC, 0))
        ctx.fillStyle = pool
        ctx.fillRect(0, 0, W, SH)
        ctx.globalCompositeOperation = "source-over"

        const fog = dt < 0 ? 1 : 1 - mrfSmooth(100, 2100, dt)
        if (fog > 0) {
          const f = ctx.createLinearGradient(0, 0, 0, SH)
          f.addColorStop(0, css(sky0, fog))
          f.addColorStop(1, css(sky1, fog))
          ctx.fillStyle = f
          ctx.fillRect(0, 0, W, SH)
        }

        const g = ctx.createLinearGradient(0, H - overlap * 0.05, 0, SH)
        g.addColorStop(0, css(groundC, 0))
        g.addColorStop(0.55, css(groundC, 0.72))
        g.addColorStop(1, css(groundC, 1))
        ctx.fillStyle = g
        ctx.fillRect(0, H - overlap * 0.05, W, SH - H + overlap * 0.05 + 1)
      } else {
        // printed: the range stops dead at the band edge, and the ground begins
        ctx.fillStyle = css(groundC, 1)
        ctx.fillRect(0, H - 1, W, SH - H + 1)
      }
    }

    const tick = (now: number) => {
      raf = 0
      const o = opts.current
      const busy = building < n
      if (busy) work(revealAt.current === null ? 14 : visible ? 8 : 6)
      if (revealAt.current === null && seenAt !== null && building >= n && (reduced || now - seenAt > 650)) {
        revealAt.current = reduced ? -1e9 : now
        setInView(true)
      }
      if (!visible) {
        if (busy) raf = requestAnimationFrame(tick)
        return
      }
      if (o.scrollParallax && !reduced) {
        const r = root.getBoundingClientRect()
        kT = mrfArrival(r.top, r.height, window.innerHeight)
      } else kT = 1
      const live = o.interactive && !reduced
      px += ((live ? tx : 0) - px) * 0.06
      py += ((live ? ty : 0) - py) * 0.06
      k += (kT - k) * 0.1
      if (Math.abs(k - kSet) > 0.0008) {
        kSet = k
        root.style.setProperty("--mrf-k", k.toFixed(4))
      }
      const easing =
        Math.abs((live ? tx : 0) - px) > 0.001 || Math.abs((live ? ty : 0) - py) > 0.001 || Math.abs(kT - k) > 0.001
      const intro = (revealAt.current === null && seenAt !== null) || (revealAt.current !== null && now - revealAt.current < 3000)
      const ambient = !reduced && ((o.mist > 0 && o.drift > 0) || night)
      if (busy || intro || easing || now - last > 33) {
        draw(now)
        last = now
      }
      if (busy || intro || easing || ambient) raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!raf && (visible || building < n)) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const r = scene.getBoundingClientRect()
      tx = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / Math.max(1, r.width) - 0.5))
      ty = Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / Math.max(1, r.height) - 0.5))
      wake()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      wake()
    }
    const onScroll = () => wake()

    measure()
    draw(performance.now())

    root.addEventListener("pointermove", onMove)
    root.addEventListener("pointerleave", onLeave)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    const ro = new ResizeObserver(() => {
      measure()
      draw(performance.now())
      wake()
    })
    ro.observe(root)
    ro.observe(hero)
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (!e) return
        visible = e.isIntersecting
        if (e.isIntersecting && e.intersectionRatio >= 0.12 && seenAt === null) seenAt = performance.now()
        if (visible) wake()
      },
      { threshold: [0, 0.12, 0.3] },
    )
    io.observe(root)
    wake()

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(rebuildTimer)
      ro.disconnect()
      io.disconnect()
      root.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // Draw the eye along to the pill: it leans toward the pointer a little.
  const onCtaMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const fx = e.clientX - r.left
    const fy = e.clientY - r.top
    el.style.setProperty("--fx", fx + "px")
    el.style.setProperty("--fy", fy + "px")
    if (!interactive || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    el.style.setProperty("--mx", ((fx / r.width - 0.5) * 10).toFixed(2) + "px")
    el.style.setProperty("--my", ((fy / r.height - 0.5) * 8).toFixed(2) + "px")
  }
  const onCtaLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty("--mx", "0px")
    e.currentTarget.style.setProperty("--my", "0px")
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formState === "sending" || formState === "done") return
    if (!mrfIsEmail(email)) {
      setFormState("idle")
      requestAnimationFrame(() => {
        setFormState("error")
        setMessage(email.trim() ? "That address looks incomplete." : "Add your email to join.")
      })
      return
    }
    setFormState("sending")
    setMessage("")
    try {
      if (onSubscribe) await onSubscribe(email.trim())
      else await new Promise((r) => setTimeout(r, 900))
      setFormState("done")
      setMessage(successMessage)
    } catch {
      setFormState("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  const year = new Date().getFullYear()
  const line = copyright ?? "© " + year + " " + name + ". All rights reserved."
  const lines = mrfParseHeading(heading ?? "Take the *first step*\nwith " + name + " today.")
  let wordIndex = 0
  const flowers = React.useMemo(() => (botanicals ? mrfBotany(seed, 9) : []), [botanicals, seed])
  const navCount = columns.length + (socials.length ? 1 : 0)

  return (
    <footer
      ref={rootRef}
      className={"mrf-root" + (isPrint ? " mrf-print" : "") + (inView ? " mrf-in" : "") + (className ? " " + className : "")}
      style={
        {
          minHeight: height,
          "--mrf-hero": heroHeight,
          "--mrf-sky-0": colors.sky[0],
          "--mrf-sky-1": colors.sky[1],
          "--mrf-ground": colors.ground,
          "--mrf-ink": colors.ink,
          "--mrf-sub": colors.sub,
          "--mrf-pill": colors.pill,
          "--mrf-pill-ink": colors.pillInk,
          "--mrf-text": colors.text,
          "--mrf-muted": colors.muted,
          "--mrf-line": colors.line,
          "--mrf-n": Math.max(1, navCount),
          "--mrf-max": maxWidth,
          "--mrf-sans": fontFamily,
          "--mrf-serif": serifFamily,
        } as React.CSSProperties
      }
    >
      <style>{MRF_CSS}</style>
      <div ref={sceneRef} className="mrf-scene">
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>

      <div ref={heroRef} className="mrf-hero">
        <h2 className="mrf-h">
          {lines.map((words, li) => (
            <span className="mrf-line" key={li}>
              {words.map((w, wi) => {
                const d = (w.accent ? 900 : 520) + wordIndex++ * 75
                return (
                  <React.Fragment key={wi}>
                    {wi > 0 ? " " : null}
                    <span className={"mrf-w" + (w.accent ? " mrf-acc" : "")}>
                      <span className="mrf-wi" style={{ "--d": d } as React.CSSProperties}>
                        {w.text}
                      </span>
                    </span>
                  </React.Fragment>
                )
              })}
            </span>
          ))}
        </h2>
        {subheading ? (
          <p className="mrf-sub mrf-r" style={{ "--d": 1150 } as React.CSSProperties}>
            {subheading}
          </p>
        ) : null}
        {cta ? (
          <div className="mrf-cta-wrap mrf-r" style={{ "--d": 1300 } as React.CSSProperties}>
            <a className="mrf-cta" href={cta.href || "#"} onPointerMove={onCtaMove} onPointerLeave={onCtaLeave}>
              <span>{cta.label}</span>
              <span className="mrf-cta-arrow">
                <Arrow className="mrf-a1" />
                <Arrow className="mrf-a2" />
              </span>
            </a>
          </div>
        ) : null}
      </div>

      <div className="mrf-body">
        {flowers.length ? (
          <svg className="mrf-botany" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            {flowers.map((f, i) => (
              <g key={i} className="mrf-stem" style={{ transformOrigin: f.x + "px 420px", "--sd": i * 1.7 } as React.CSSProperties}>
                <path className="mrf-draw" d={f.stem} pathLength={1} style={{ "--d": 1400 + f.order * 900 } as React.CSSProperties} />
                {f.parts.map((d, j) => (
                  <path key={j} className="mrf-draw" d={d} pathLength={1} style={{ "--d": 2100 + f.order * 900 + j * 90 } as React.CSSProperties} />
                ))}
              </g>
            ))}
          </svg>
        ) : null}

        <div className="mrf-wrap">
          <div className="mrf-grid">
            <div className="mrf-brand">
              <a className="mrf-logo mrf-r" href={brandHref} style={{ "--d": 1250 } as React.CSSProperties}>
                {logo ?? <PetalMark />}
                <span>{name}</span>
              </a>
              {tagline ? (
                <p className="mrf-tag mrf-r" style={{ "--d": 1380 } as React.CSSProperties}>
                  {tagline}
                </p>
              ) : null}
              {newsletter ? (
                <form className="mrf-form mrf-r" style={{ "--d": 1500 } as React.CSSProperties} data-state={formState} onSubmit={submit} noValidate>
                  <label className="mrf-sr" htmlFor={inputId}>
                    Email address
                  </label>
                  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4.5 7.5l7.5 5.5 7.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  <input
                    id={inputId}
                    className="mrf-input"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={placeholder}
                    value={email}
                    disabled={formState === "sending" || formState === "done"}
                    aria-invalid={formState === "error"}
                    aria-describedby={inputId + "-msg"}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (formState === "error") {
                        setFormState("idle")
                        setMessage("")
                      }
                    }}
                  />
                  <button className="mrf-send" type="submit" aria-label={formState === "done" ? "Subscribed" : "Subscribe"}>
                    <Arrow className="mrf-a1" />
                    <Arrow className="mrf-a2" />
                    <svg className="mrf-spin" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                      <path d="M8 2.2a5.8 5.8 0 1 1-5.6 4.3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    <svg className="mrf-check" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                      <path d="M3.5 8.4l3 3 6-6.6" pathLength={1} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <p id={inputId + "-msg"} className="mrf-msg" data-show={message ? "true" : "false"} aria-live="polite">
                    {message}
                  </p>
                </form>
              ) : null}
            </div>

            <nav className="mrf-cols" aria-label="Footer">
              {columns.map((col, ci) => (
                <div className="mrf-col" key={col.title + ci}>
                  <h3 className="mrf-r" style={{ "--d": 1300 + ci * 90 } as React.CSSProperties}>
                    {col.title}
                  </h3>
                  <ul>
                    {col.links.map((l, li) => (
                      <li key={l.label + li} className="mrf-r" style={{ "--d": 1380 + ci * 90 + li * 55 } as React.CSSProperties}>
                        <a className="mrf-link" href={l.href || "#"}>
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {socials.length ? (
                <div className="mrf-col">
                  {socialTitle ? (
                    <h3 className="mrf-r" style={{ "--d": 1300 + columns.length * 90 } as React.CSSProperties}>
                      {socialTitle}
                    </h3>
                  ) : null}
                  <ul className="mrf-social">
                    {socials.map((s, i) => (
                      <li key={s.icon + i} className="mrf-r" style={{ "--d": 1400 + columns.length * 90 + i * 60 } as React.CSSProperties}>
                        <a className="mrf-icon" href={s.href || "#"} aria-label={s.label || SOCIAL_NAMES[s.icon]}>
                          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                            {SOCIAL_ICONS[s.icon]}
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </nav>
          </div>

          <div className="mrf-spacer" />

          <div className="mrf-bottom">
            <span className="mrf-rule" aria-hidden="true" />
            <p className="mrf-r" style={{ "--d": 1700 } as React.CSSProperties}>
              {line}
            </p>
            {legal.length ? (
              <ul className="mrf-legal mrf-r" style={{ "--d": 1800 } as React.CSSProperties}>
                {legal.map((l, i) => (
                  <li key={l.label + i}>
                    <a className="mrf-link" href={l.href || "#"}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
