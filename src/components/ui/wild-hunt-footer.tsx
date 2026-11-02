'use client'

import * as React from 'react'

export interface WildHuntImage {
  src: string
  alt?: string
  position?: string
  cutout?: string
}

export interface FooterLink {
  label: string
  href?: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export type WildHuntPreset = 'vermilion' | 'ink' | 'cobalt' | 'bone'

export interface WildHuntFooterProps {
  wordmark?: string
  image?: WildHuntImage
  imageHeight?: number
  dissolve?: number
  tagline?: string
  sideNote?: string
  columns?: FooterColumn[]
  colophon?: string
  legal?: string
  backToTop?: boolean
  sigils?: boolean
  preset?: WildHuntPreset
  palette?: { background?: string; ink?: string }
  tracking?: number
  grain?: number
  interactive?: boolean
  fontFamily?: string
  monoFamily?: string
  height?: string
  className?: string
}

const PRESETS: Record<WildHuntPreset, { background: string; ink: string }> = {
  vermilion: { background: '#e2281b', ink: '#f4efe5' },
  ink: { background: '#100f0e', ink: '#ebe5d7' },
  cobalt: { background: '#1b2db0', ink: '#eef0ff' },
  bone: { background: '#ebe5d8', ink: '#17130f' },
}

const DEFAULT_IMAGE: WildHuntImage = {
  src: 'https://cdn.21st.dev/assets/mirror/67/671b69b8614847816a300a1d11ee5704a7b2f5c51b8b50d45f17dfc49af09b68.jpg',
  alt: 'Åsgårdsreien, the Wild Hunt of Odin, by Peter Nicolai Arbo, 1872',
  position: '50% 26%',
  cutout:
    'https://cdn.21st.dev/assets/mirror/69/692fb74acc74e0097901ca85075b1efbfdeebcb4d5edfe99874e9ec7e4847e0a.webp',
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: 'Work',
    links: [
      { label: 'Case', href: '#case' },
      { label: 'Material', href: '#material' },
      { label: 'Tokens', href: '#tokens' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'The idea', href: '#case' },
      { label: 'The rules', href: '#system' },
      { label: 'Audit', href: '#audit' },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { label: 'Case library', href: '/design-system' },
      { label: 'Practice', href: '/design-engineering' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'hello@huginn.studio', href: 'mailto:hello@huginn.studio' },
    ],
  },
]

const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23,
  61, 29, 53, 21,
]

export const WHF_ROWS = 22

const BITMAP_GLYPHS: Record<string, string[]> = {
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  N: ['10001', '11001', '11001', '10101', '10011', '10011', '10001'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00110', '00110'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  "'": ['00100', '00100', '00010', '00000', '00000', '00000', '00000'],
  '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100'],
}

export function whfDissolve(y: number, start: number, span: number) {
  const amount = Math.min(1, Math.max(0, (y - start) / Math.max(0.02, span)))
  const eased = amount * amount * (3 - 2 * amount)
  return eased * eased * (3 - 2 * eased)
}

export function whfCoord(x: number, y: number, width: number, height: number) {
  const column = Math.min(
    15,
    Math.max(0, Math.floor((x / Math.max(1, width)) * 16)),
  )
  const row = Math.min(
    8,
    Math.max(0, Math.floor((y / Math.max(1, height)) * 9)),
  )
  return `${String.fromCharCode(65 + column)}${row + 1}`
}

function hexRgb(value: string) {
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(value.trim())
  if (!match) return [226, 40, 27]
  const full =
    match[1].length === 3
      ? match[1].replace(/./g, (char) => char + char)
      : match[1]
  return [0, 2, 4].map((index) =>
    Number.parseInt(full.slice(index, index + 2), 16),
  )
}

const CSS = `
.whf-root{position:relative;isolation:isolate;container-type:inline-size;width:100%;overflow:hidden;background:var(--whf-bg);color:var(--whf-ink);font-family:var(--whf-font);-webkit-font-smoothing:antialiased;--whf-pad:clamp(18px,3.2vw,48px);--whf-ease:cubic-bezier(.65,0,.2,1)}
.whf-root,.whf-root *{box-sizing:border-box}.whf-picture{position:absolute;inset:0 0 auto;height:var(--whf-picture-height);overflow:hidden;z-index:0}.whf-picture img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block;filter:saturate(.92) contrast(1.04)}.whf-tint{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,color-mix(in srgb,var(--whf-bg) 55%,transparent) 70%)}.whf-cutout{z-index:1;pointer-events:none;clip-path:inset(0 0 100% 0);transition:clip-path 1.1s linear .1s}.whf-root.is-in .whf-cutout{clip-path:inset(0)}.whf-dither{position:absolute;left:0;top:0;image-rendering:pixelated;display:block;max-width:none}.whf-grain{position:absolute;inset:0;width:100%;height:100%;display:block;max-width:none;z-index:2;pointer-events:none;mix-blend-mode:soft-light}.whf-marks{position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;overflow:visible;display:block}.whf-marks text{font-family:var(--whf-mono);font-size:9px;letter-spacing:.14em;fill:var(--whf-ink)}.whf-marks .whf-fade{opacity:0;transition:opacity .6s var(--whf-ease);transition-delay:var(--d,0s)}.whf-root.is-in .whf-marks .whf-fade{opacity:1}.whf-word{position:absolute;left:0;top:0;display:block;max-width:none;z-index:4}.whf-swash{position:absolute;left:0;top:0;overflow:visible;z-index:5;pointer-events:none;display:block}.whf-swash path{fill:none;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1}.whf-swash .whf-cut{stroke:var(--whf-bg);stroke-width:5.5}.whf-swash .whf-pen{stroke:var(--whf-ink);stroke-width:1.35}.whf-root.is-in .whf-swash path{stroke-dashoffset:0;transition:stroke-dashoffset 1.25s var(--whf-ease) .95s}.whf-vert,.whf-foot{font-size:10px;line-height:1.55;letter-spacing:.16em;text-transform:uppercase}.whf-vert{position:absolute;top:38%;height:35%;z-index:6;margin:0;max-width:8em;display:flex;gap:.7em;writing-mode:vertical-rl;overflow:hidden;opacity:.9}.whf-vert.whf-l{left:var(--whf-pad);transform:rotate(180deg)}.whf-vert.whf-r{right:var(--whf-pad)}.whf-wipe{clip-path:inset(0 100% 0 0);transition:clip-path .7s var(--whf-ease);transition-delay:var(--d,0s)}.whf-vert.whf-wipe{clip-path:inset(100% 0 0 0)}.whf-root.is-in .whf-wipe{clip-path:inset(0)}.whf-foot{position:absolute;left:0;right:0;bottom:0;z-index:6;padding:0 var(--whf-pad) 18px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr)) auto;column-gap:20px;row-gap:0;align-items:start}.whf-col h3{margin:0 0 .25em;font:inherit;opacity:.65}.whf-col ul{list-style:none;margin:0;padding:0}.whf-col a,.whf-up{color:inherit;text-decoration:none;opacity:.92;background:none;border:0;padding:0;cursor:pointer;font:inherit;letter-spacing:inherit;text-transform:inherit;background-image:linear-gradient(currentColor,currentColor);background-size:0% 1px;background-repeat:no-repeat;background-position:0 100%;transition:opacity .25s ease,background-size .35s var(--whf-ease)}.whf-col a:hover,.whf-up:hover{opacity:1;background-size:100% 1px}.whf-col a:focus-visible,.whf-up:focus-visible{outline:2px solid currentColor;outline-offset:4px;opacity:1}.whf-up{justify-self:end;white-space:nowrap}.whf-up::before{content:'↑';display:inline-block;margin-right:.6em;transition:transform .35s var(--whf-ease)}.whf-up:hover::before{transform:translateY(-2px)}.whf-legal{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:20px;align-items:end;margin-top:18px;padding-top:11px;border-top:1px dotted color-mix(in srgb,var(--whf-ink) 45%,transparent);font-size:12px;letter-spacing:.08em;text-transform:none;line-height:1.55}.whf-legal p{margin:0;opacity:.82}.whf-sig{display:flex;align-items:center;gap:12px}.whf-sig svg{width:14px;height:14px;display:block;fill:none;stroke:currentColor;stroke-width:1;opacity:.85}.whf-sig span{opacity:.82}.whf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}@container(max-width:960px){.whf-foot{grid-template-columns:repeat(4,minmax(0,1fr));row-gap:14px}.whf-up{grid-column:1/-1;justify-self:start}}@container(max-width:720px){.whf-vert{display:none}.whf-foot{grid-template-columns:repeat(2,minmax(0,1fr));padding-bottom:14px}.whf-legal{grid-template-columns:minmax(0,1fr);margin-top:10px}.whf-marks .whf-tick text{display:none}}@media(prefers-reduced-motion:reduce){.whf-marks .whf-fade,.whf-wipe,.whf-swash path,.whf-col a,.whf-up,.whf-up::before,.whf-picture .whf-cutout{transition:none!important}}
`

export default function WildHuntFooter({
  wordmark = 'HUGINN',
  image = DEFAULT_IMAGE,
  imageHeight = 0.62,
  dissolve = 0.4,
  tagline = 'Thought flies out at dawn · over the whole of the world · and is back by supper',
  sideNote = 'Founded 2019 · Oslo & Reykjavík · a studio for slow software',
  columns = DEFAULT_COLUMNS,
  colophon = 'Painting: Peter Nicolai Arbo, Åsgårdsreien (The Wild Hunt of Odin), 1872. Nasjonalmuseet, Oslo. Public domain via Wikimedia Commons.',
  legal = '© 2026 Huginn Studio',
  backToTop = true,
  sigils = true,
  preset = 'vermilion',
  palette,
  tracking = 2,
  grain = 0.6,
  interactive = true,
  fontFamily = 'Georgia, "Times New Roman", serif',
  monoFamily = '"SFMono-Regular", Consolas, monospace',
  height = 'min(100svh, 920px)',
  className = '',
}: WildHuntFooterProps) {
  const colors = { ...PRESETS[preset], ...palette }
  const rootRef = React.useRef<HTMLElement | null>(null)
  const ditherRef = React.useRef<HTMLCanvasElement | null>(null)
  const wordRef = React.useRef<HTMLCanvasElement | null>(null)
  const grainRef = React.useRef<HTMLCanvasElement | null>(null)
  const marksRef = React.useRef<SVGSVGElement | null>(null)
  const swashRef = React.useRef<SVGSVGElement | null>(null)
  const footRef = React.useRef<HTMLDivElement | null>(null)
  const enteredRef = React.useRef(false)
  const opts = React.useRef({
    colors,
    wordmark,
    imageHeight,
    dissolve,
    tracking,
    grain,
    interactive,
    fontFamily,
    hasCutout: Boolean(image.cutout),
  })
  opts.current = {
    colors,
    wordmark,
    imageHeight,
    dissolve,
    tracking,
    grain,
    interactive,
    fontFamily,
    hasCutout: Boolean(image.cutout),
  }
  const key = [
    wordmark,
    imageHeight,
    dissolve,
    tracking,
    grain,
    colors.background,
    colors.ink,
    fontFamily,
    Boolean(image.cutout),
  ].join('|')

  React.useEffect(() => {
    const root = rootRef.current
    const dcv = ditherRef.current
    const wcv = wordRef.current
    const gcv = grainRef.current
    const marks = marksRef.current
    const swash = swashRef.current
    const dctx = dcv?.getContext('2d')
    const wctx = wcv?.getContext('2d')
    const gctx = gcv?.getContext('2d')
    if (
      !root ||
      !dcv ||
      !wcv ||
      !gcv ||
      !marks ||
      !swash ||
      !dctx ||
      !wctx ||
      !gctx
    )
      return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    let width = 1
    let heightPx = 1
    let bandHeight = 1
    let pixel = 4
    let cols = 1
    let rows = 1
    let ditherImage: ImageData | null = null
    let pointerX = -10000
    let pointerY = -10000
    let pointerInside = false
    let startAt = -1
    let sweepAt = -1e9
    let frame = 0
    let visible = true
    let alive = true
    const background = hexRgb(opts.current.colors.background)

    const layout = () => {
      const options = opts.current
      const rect = root.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      heightPx = Math.max(1, Math.round(rect.height))
      const narrow = width < 720
      const pad = Math.round(Math.max(18, Math.min(48, width * 0.032)))
      bandHeight = Math.round(
        heightPx *
          Math.min(
            0.8,
            Math.max(
              0.3,
              narrow ? Math.min(options.imageHeight, 0.5) : options.imageHeight,
            ),
          ),
      )
      const footHeight = footRef.current?.offsetHeight ?? 180
      const wordBox = {
        x: 0,
        y: Math.round(bandHeight * 0.48),
        w: width,
        h: Math.round(Math.max(72, heightPx - footHeight - bandHeight * 0.48)),
      }
      root.style.setProperty('--whf-picture-height', `${bandHeight}px`)
      pixel = 4
      cols = Math.ceil(width / pixel)
      rows = Math.ceil(bandHeight / pixel)
      dcv.width = cols
      dcv.height = rows
      dcv.style.width = `${cols * pixel}px`
      dcv.style.height = `${rows * pixel}px`
      ditherImage = dctx.createImageData(cols, rows)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const letters = Array.from(options.wordmark.toLocaleUpperCase())
      const glyphGap = Math.max(0, Math.round(options.tracking))
      const totalCells = letters.reduce((total, letter, index) => {
        const glyphWidth =
          letter === ' ' ? 6 : (BITMAP_GLYPHS[letter]?.[0].length ?? 0)
        return total + glyphWidth + (index < letters.length - 1 ? glyphGap : 0)
      }, 0)
      const cell = Math.max(
        2,
        Math.floor(
          Math.min(
            (width - pad * 2) / Math.max(1, totalCells),
            wordBox.h / WHF_ROWS,
          ),
        ),
      )
      const glyphCanvasWidth = totalCells * cell
      const glyphCanvasHeight = WHF_ROWS * cell
      const offsetX = Math.round((width - glyphCanvasWidth) / 2)
      const offsetY = Math.round((wordBox.h - glyphCanvasHeight) / 2)
      wcv.width = Math.round(width * dpr)
      wcv.height = Math.round(wordBox.h * dpr)
      wcv.style.width = `${width}px`
      wcv.style.height = `${wordBox.h}px`
      wcv.style.transform = `translate(0,${wordBox.y}px)`
      wctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      wctx.clearRect(0, 0, width, wordBox.h)
      wctx.fillStyle = options.colors.ink
      wctx.imageSmoothingEnabled = false
      let cursor = offsetX
      for (const letter of letters) {
        if (letter === ' ') {
          cursor += (6 + glyphGap) * cell
          continue
        }
        const glyph = BITMAP_GLYPHS[letter]
        if (!glyph) continue
        for (let row = 0; row < glyph.length; row++) {
          for (let column = 0; column < glyph[row].length; column++) {
            if (glyph[row][column] === '1') {
              wctx.fillRect(
                cursor + column * cell,
                offsetY + (row + 7) * cell,
                cell,
                cell,
              )
            }
          }
        }
        cursor += (glyph[0].length + glyphGap) * cell
      }
      wctx.setTransform(1, 0, 0, 1, 0, 0)

      const grainDpr = Math.min(window.devicePixelRatio || 1, 2)
      gcv.width = Math.round(width * grainDpr)
      gcv.height = Math.round(heightPx * grainDpr)
      gctx.setTransform(grainDpr, 0, 0, grainDpr, 0, 0)
      gctx.clearRect(0, 0, width, heightPx)
      if (options.grain > 0) {
        const tile = document.createElement('canvas')
        tile.width = 96
        tile.height = 96
        const tileContext = tile.getContext('2d')
        if (tileContext) {
          const data = tileContext.createImageData(96, 96)
          for (let index = 0; index < data.data.length; index += 4) {
            const noise = Math.random() < 0.5 ? 20 : 240
            data.data[index] =
              data.data[index + 1] =
              data.data[index + 2] =
                noise
            data.data[index + 3] = 28
          }
          tileContext.putImageData(data, 0, 0)
          const pattern = gctx.createPattern(tile, 'repeat')
          if (pattern) {
            gctx.globalAlpha = Math.min(1, options.grain) * 0.45
            gctx.fillStyle = pattern
            gctx.fillRect(0, 0, width, heightPx)
            gctx.globalAlpha = 1
          }
        }
      }

      marks.setAttribute('viewBox', `0 0 ${width} ${heightPx}`)
      marks.querySelector('.whf-ca')?.setAttribute('cx', String(width * 0.085))
      marks
        .querySelector('.whf-ca')
        ?.setAttribute('cy', String(heightPx * 0.48))
      marks.querySelector('.whf-ca')?.setAttribute('r', String(heightPx * 0.36))
      marks.querySelector('.whf-cb')?.setAttribute('cx', String(width * 0.87))
      marks
        .querySelector('.whf-cb')
        ?.setAttribute('cy', String(heightPx * 0.76))
      marks.querySelector('.whf-cb')?.setAttribute('r', String(heightPx * 0.23))
      const guide = marks.querySelector('.whf-guide')
      guide?.setAttribute('x2', String(width - pad))
      marks.querySelector('.whf-reticle-h')?.setAttribute('x2', String(width))
      marks
        .querySelector('.whf-reticle-v')
        ?.setAttribute('y2', String(heightPx))
      swash.style.width = `${Math.min(width, 760)}px`
      swash.style.height = `${Math.min(width, 760) * 0.3}px`
      swash.style.left = `${(width - Math.min(width, 760)) / 2}px`
      swash.style.top = `${wordBox.y + wordBox.h * 0.44}px`
      const path = swash.querySelector('path')
      path?.setAttribute(
        'd',
        `M 0 ${wordBox.h * 0.14} C ${width * 0.18} ${wordBox.h * 0.58}, ${width * 0.28} ${wordBox.h * -0.1}, ${width * 0.48} ${wordBox.h * 0.28} S ${width * 0.82} ${wordBox.h * 0.62}, ${width} ${wordBox.h * 0.12}`,
      )
      wake()
    }

    const smooth = (value: number) =>
      value <= 0 ? 0 : value >= 1 ? 1 : value * value * (3 - 2 * value)
    const draw = (now: number) => {
      const elapsed = startAt < 0 ? -1 : reduced ? 1e9 : now - startAt
      const data = ditherImage?.data
      if (data) {
        const start = Math.min(0.7, Math.max(0.1, opts.current.dissolve))
        const scanY = ((elapsed - 60) / 820) * rows * 1.3
        const sweepAge = now - sweepAt
        const sweepY = sweepAge < 760 ? (sweepAge / 760) * heightPx : -1e4
        let index = 0
        for (let y = 0; y < rows; y++) {
          const yFraction = (y + 0.5) / rows
          const base = whfDissolve(yFraction, start, 0.28)
          let fraction =
            elapsed < 0
              ? 1
              : Math.max(base, 1 - smooth((scanY - y) / (rows * 0.32)))
          const pointY = (y + 0.5) * pixel
          if (sweepY > -1e3 && sweepY - pointY > 0 && sweepY - pointY < 72)
            fraction = Math.max(fraction, 1 - (sweepY - pointY) / 72)
          for (let x = 0; x < cols; x++, index += 4) {
            let thresholdFraction = fraction
            if (elapsed >= 0 && fraction === base)
              thresholdFraction = whfDissolve(
                yFraction +
                  0.04 * Math.sin(x * 0.11) +
                  0.025 * Math.sin(x * 0.037),
                start,
                0.28,
              )
            if (opts.current.interactive && pointerInside) {
              const dx = (x + 0.5) * pixel - pointerX
              const dy = pointY - pointerY
              const distance = Math.hypot(dx, dy)
              const radius = Math.max(90, Math.min(220, width * 0.15))
              if (distance < radius)
                thresholdFraction -= smooth(1 - distance / radius) * 0.9
            }
            const on =
              (BAYER[(x & 7) | ((y & 7) << 3)] + 0.5) * 0.78 <
              thresholdFraction * 64
            data[index] = background[0]
            data[index + 1] = background[1]
            data[index + 2] = background[2]
            data[index + 3] = on ? 255 : 0
          }
        }
        dctx.putImageData(ditherImage!, 0, 0)
      }
      const sweepAge = now - sweepAt
      const line = marks.querySelector('.whf-sweep')
      if (sweepAge < 760) {
        const y = (sweepAge / 760) * heightPx
        line?.setAttribute('y1', String(y))
        line?.setAttribute('y2', String(y))
        line?.setAttribute('opacity', String(0.8 * (1 - sweepAge / 760)))
      } else line?.setAttribute('opacity', '0')
      const reticle = marks.querySelector('.whf-reticle')
      reticle?.setAttribute(
        'opacity',
        pointerInside && opts.current.interactive ? '1' : '0',
      )
      reticle?.setAttribute('transform', `translate(${pointerX} ${pointerY})`)
      const label = marks.querySelector('.whf-coord')
      if (label) {
        label.textContent = `${whfCoord(pointerX, pointerY, width, heightPx)} · ${Math.round(pointerX)},${Math.round(pointerY)}`
        label.setAttribute('x', String(pointerX > width - 120 ? -12 : 12))
        label.setAttribute(
          'text-anchor',
          pointerX > width - 120 ? 'end' : 'start',
        )
      }
      const animating = elapsed >= 0 && elapsed < 1200
      if (animating || pointerInside || sweepAge < 760) {
        frame = requestAnimationFrame((timestamp) => {
          frame = 0
          draw(timestamp)
        })
      }
    }
    const wake = () => {
      if (!alive || !visible || frame) return
      frame = requestAnimationFrame((now) => {
        frame = 0
        draw(now)
      })
    }
    const localPoint = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      pointerX = event.clientX - rect.left
      pointerY = event.clientY - rect.top
    }
    const onMove = (event: PointerEvent) => {
      if (!opts.current.interactive) return
      localPoint(event)
      pointerInside = true
      wake()
    }
    const onLeave = () => {
      pointerInside = false
      wake()
    }
    const onDown = (event: PointerEvent) => {
      if (
        !opts.current.interactive ||
        reduced ||
        (event.target as HTMLElement).closest('a,button')
      )
        return
      sweepAt = performance.now()
      wake()
    }
    const resize = new ResizeObserver(layout)
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) {
          if (!enteredRef.current && entry.intersectionRatio >= 0.28) {
            enteredRef.current = true
            startAt = performance.now()
            root.classList.add('is-in')
          }
          wake()
        } else if (frame) {
          cancelAnimationFrame(frame)
          frame = 0
        }
      },
      { threshold: [0, 0.28, 0.6] },
    )

    layout()
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('pointerdown', onDown)
    resize.observe(root)
    intersection.observe(root)
    if (reduced) {
      enteredRef.current = true
      root.classList.add('is-in')
      startAt = 0
      draw(performance.now())
    } else {
      wake()
    }
    return () => {
      alive = false
      if (frame) cancelAnimationFrame(frame)
      resize.disconnect()
      intersection.disconnect()
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointerdown', onDown)
      root.classList.remove('is-in')
    }
  }, [key])

  const toTop = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  const labels = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6']

  return (
    <footer
      ref={rootRef}
      className={`whf-root ${className}`}
      style={
        {
          height,
          '--whf-bg': colors.background,
          '--whf-ink': colors.ink,
          '--whf-font': fontFamily,
          '--whf-mono': monoFamily,
        } as React.CSSProperties
      }
      aria-label="Huginn Studio footer specimen"
    >
      <style>{CSS}</style>
      <div className="whf-picture" aria-hidden="true">
        <img
          src={image.src}
          alt=""
          draggable={false}
          style={{ objectPosition: image.position || '50% 26%' }}
        />
        <div className="whf-tint" />
        <canvas className="whf-dither" ref={ditherRef} />
        {image.cutout ? (
          <img
            className="whf-cutout"
            src={image.cutout}
            alt=""
            draggable={false}
            style={{ objectPosition: image.position || '50% 26%' }}
          />
        ) : null}
      </div>
      <canvas className="whf-grain" ref={grainRef} aria-hidden="true" />
      <svg
        className="whf-marks"
        ref={marksRef}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <circle
          className="whf-ca whf-fade"
          strokeDasharray="1.5 5"
          opacity=".5"
          style={{ '--d': '.2s' } as React.CSSProperties}
        />
        <circle
          className="whf-cb whf-fade"
          strokeDasharray="1.5 5"
          opacity=".5"
          style={{ '--d': '.5s' } as React.CSSProperties}
        />
        <g
          className="whf-fade whf-guide"
          style={{ '--d': '.7s' } as React.CSSProperties}
        >
          <line x1="48" y1="0" x2="48" y2="0" strokeDasharray="1 3" />
          <rect
            x="46.5"
            y="-1.5"
            width="3"
            height="3"
            fill="currentColor"
            stroke="none"
          />
        </g>
        <g
          className="whf-tick whf-fade"
          style={{ '--d': '1s' } as React.CSSProperties}
        >
          {labels.map((label, index) => (
            <g key={label} transform={`translate(${index * 45 + 60} 0)`}>
              <line y1="-4" y2="0" />
              <text x="5" y="-1">
                {label}
              </text>
            </g>
          ))}
        </g>
        <line className="whf-sweep" x1="0" x2="100%" opacity="0" />
        <g className="whf-reticle" opacity="0">
          <line
            className="whf-reticle-h"
            x1="0"
            x2="100%"
            strokeDasharray="1 4"
            opacity=".45"
          />
          <line
            className="whf-reticle-v"
            y1="0"
            y2="100%"
            strokeDasharray="1 4"
            opacity=".45"
          />
          <circle r="7" />
          <path d="M-11 0h4m14 0h4M0-11v4m0 14v4" />
          <text className="whf-coord" y="-10" />
        </g>
      </svg>
      <canvas className="whf-word" ref={wordRef} aria-hidden="true" />
      <svg
        className="whf-swash"
        ref={swashRef}
        aria-hidden="true"
        viewBox="0 0 760 228"
        preserveAspectRatio="none"
      >
        <path
          className="whf-cut"
          pathLength="1"
          d="M0 42 C140 120 220 2 366 68 S620 145 760 36"
        />
        <path
          className="whf-pen"
          pathLength="1"
          d="M0 42 C140 120 220 2 366 68 S620 145 760 36"
        />
      </svg>
      <span className="whf-sr">{wordmark}</span>
      {tagline ? (
        <p
          className="whf-vert whf-l whf-wipe"
          style={{ '--d': '.6s' } as React.CSSProperties}
        >
          <span>{tagline}</span>
        </p>
      ) : null}
      {sideNote ? (
        <p
          className="whf-vert whf-r whf-wipe"
          style={{ '--d': '.8s' } as React.CSSProperties}
        >
          <span>{sideNote}</span>
        </p>
      ) : null}
      <div className="whf-foot" ref={footRef}>
        {columns.map((column, index) => (
          <nav
            className="whf-col whf-wipe"
            key={column.title}
            aria-label={column.title}
            style={{ '--d': `${0.5 + index * 0.08}s` } as React.CSSProperties}
          >
            <h3>{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href || '#'}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        {backToTop ? (
          <button
            type="button"
            className="whf-up whf-wipe"
            onClick={toTop}
            style={{ '--d': '.9s' } as React.CSSProperties}
          >
            Back to top
          </button>
        ) : (
          <span />
        )}
        <div
          className="whf-legal whf-wipe"
          style={{ '--d': '1s' } as React.CSSProperties}
        >
          <div className="whf-sig">
            {sigils ? (
              <>
                <svg viewBox="-8 -8 16 16" aria-hidden="true">
                  {Array.from({ length: 12 }, (_, index) => {
                    const angle = (index / 12) * Math.PI * 2
                    return (
                      <line
                        key={index}
                        x1={(Math.cos(angle) * 2.2).toFixed(2)}
                        y1={(Math.sin(angle) * 2.2).toFixed(2)}
                        x2={(Math.cos(angle) * 7).toFixed(2)}
                        y2={(Math.sin(angle) * 7).toFixed(2)}
                      />
                    )
                  })}
                </svg>
                <svg viewBox="-8 -8 16 16" aria-hidden="true">
                  <circle r="6.8" strokeDasharray="1 2.2" />
                  <path d="M0-4.6A4.6 4.6 0 1 1-4.6 0A2.6 2.6 0 1 0 0-2.6A1.2 1.2 0 1 1-1.2 0" />
                </svg>
              </>
            ) : null}
            <span>{legal}</span>
          </div>
          <p>{colophon}</p>
        </div>
      </div>
    </footer>
  )
}
