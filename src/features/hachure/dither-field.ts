/**
 * The page's dither engine.
 *
 * The footer already contains this maths; the studies on the case page draw
 * from the same exports rather than re-deriving a second, slightly different
 * range. What is added here is the one thing a specimen needs and a footer does
 * not: a `develop` value, so the range can be stopped at any point between
 * paper and full tone and looked at.
 */
import {
  RDF_BAYER,
  rdfDither,
  rdfFbm,
  rdfHash,
  rdfHex,
  rdfPack,
  rdfRidgeline,
  rdfSmooth,
} from '@/components/ui/ridgeline-dither-footer'

export type RangeOptions = {
  /** Dither tones, mist first. The first tone should be the paper. */
  tones: string[]
  /** How many ridges recede into the mist, 2–9. */
  layers: number
  seed: number
  /** 0–1. How much mist sits over the far ridges. */
  mist: number
  /** Size of one dither cell in CSS px. */
  pixel: number
  /** 0–1. How far the range has developed, back to front. */
  develop?: number
  /** Seconds of drift, so the mist can be animated by the caller. */
  drift?: number
  /** How far down from the top the plate dissolves out of the paper, 0–1. */
  fadeFrom?: number
}

/**
 * Draw a range into `canvas`, sizing it from `host`. The canvas is absolutely
 * positioned by the stylesheet, so the host is what gets measured — measuring
 * the canvas after setting its CSS width would feed its own output back in.
 */
export function drawRange(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  opts: RangeOptions,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const pixel = Math.max(1, Math.round(opts.pixel))
  const rect = host.getBoundingClientRect()
  const cols = Math.max(8, Math.ceil((rect.width || 320) / pixel))
  const rows = Math.max(8, Math.ceil((rect.height || 200) / pixel))

  if (canvas.width !== cols || canvas.height !== rows) {
    canvas.width = cols
    canvas.height = rows
  }
  canvas.style.width = `${cols * pixel}px`
  canvas.style.height = `${rows * pixel}px`

  const tones = opts.tones.length >= 2 ? opts.tones : ['#f2f4ee', '#1b2e22']
  const pal = new Uint32Array(
    tones.map((tone) => rdfPack(rdfHex(tone) ?? [128, 128, 128])),
  )
  const layers = Math.max(2, Math.min(9, Math.round(opts.layers)))
  const margin = Math.ceil(cols * 0.05) + 3
  const ceil = rows * 0.16
  const reveal = Math.min(1, Math.max(0, opts.develop ?? 1))
  const fadeFrom = Math.max(0.08, Math.min(0.9, opts.fadeFrom ?? 0.42))

  // Each ridge, clamped clear of the band reserved for the line above it.
  const tops: Float32Array[] = []
  for (let i = 0; i < layers; i++) {
    const ridge = rdfRidgeline(cols, rows, i, layers, opts.seed, margin)
    for (let x = 0; x < ridge.length; x++) {
      if (ridge[x] < ceil) ridge[x] = ceil - (ceil - ridge[x]) * 0.2
    }
    tops.push(ridge)
  }

  // The mist, at half resolution: it is a wide, slow field, not a detail.
  const fw = (cols >> 1) + 2
  const fh = (rows >> 1) + 2
  const fog = new Float32Array(fw * fh)
  const t = opts.drift ?? 0
  const sx = 9 / cols
  const sy = 4.4 / rows
  for (let gy = 0; gy < fh; gy++) {
    const ny = gy * sy
    for (let gx = 0; gx < fw; gx++) {
      const nx = gx * sx + t
      const warp = rdfFbm(nx * 0.45 - t * 0.6, ny * 0.8, 77, 2) * 0.6
      const v = rdfFbm(nx + warp, ny + warp * 0.4, 31, 2)
      fog[gy * fw + gx] = rdfSmooth(0.32, 0.76, v)
    }
  }

  const img = ctx.createImageData(cols, rows)
  const buf = new Uint32Array(img.data.buffer)
  const mistK = Math.max(0, Math.min(1, opts.mist))

  // Per-layer reveal: back to front, each ridge developing a little later.
  const rev = new Float32Array(layers)
  const k = new Float32Array(layers)
  for (let i = 0; i < layers; i++) {
    k[i] = layers > 1 ? i / (layers - 1) : 1
    rev[i] = Math.min(1, Math.max(0, reveal * 1.35 - i * 0.09))
  }

  for (let y = 0; y < rows; y++) {
    // The range dissolves upward into the paper, not downward: the top of the
    // plate is where the sheet is allowed to win. This mirrors the footer,
    // where the fade band sits above the highest crest.
    const fade = rdfSmooth(0, rows * fadeFrom, y)
    const frow = (y >> 1) * fw
    const by = (y & 7) * 8
    for (let x = 0; x < cols; x++) {
      let L = -1
      for (let i = layers - 1; i >= 0; i--) {
        if (y >= tops[i][x + margin]) {
          L = i
          break
        }
      }

      let tone = 0
      if (L >= 0) {
        const kk = k[L]
        const depth = y - tops[L][x + margin]
        const pool = rows * (0.07 + 0.4 * kk)
        const crest = 1 - rdfSmooth(0, pool, depth) * (0.9 - 0.46 * kk)
        tone = (0.16 + 0.76 * Math.pow(kk, 1.6)) * crest
        const slope =
          tops[L][Math.min(tops[L].length - 1, x + margin + 2)] -
          tops[L][x + margin - 2]
        tone +=
          Math.max(-0.16, Math.min(0.16, slope * 0.055)) *
          (1 - rdfSmooth(0, pool * 0.5, depth))
        tone +=
          (rdfHash(x + Math.round(tops[L][x + margin] * 7), depth | 0, L) -
            0.5) *
          0.07 *
          kk
        tone *= rev[L]
      } else {
        tone = 0.05 * rdfSmooth(rows * 0.1, rows * 0.55, y)
      }

      let m = fog[frow + (x >> 1)] * mistK * (L >= 0 ? 0.95 - 0.5 * k[L] : 0.3)
      m += (1 - Math.min(1, reveal * 1.2)) * 0.5
      if (m > 1) m = 1
      tone = (tone * (1 - m) + 0.07 * m) * fade

      buf[y * cols + x] =
        pal[rdfDither(tone, pal.length, RDF_BAYER[by + (x & 7)])]
    }
  }

  ctx.putImageData(img, 0, 0)
}

/** The 8×8 Bayer matrix as values in (0, 1), for drawing the matrix itself. */
export const BAYER_CELLS = Array.from(RDF_BAYER)

/** Tone ramp for the sample counts: slice the palette so tone 1 is always paper. */
export function rampFor(tones: string[], count: number) {
  if (count >= tones.length) return tones
  if (count <= 1) return [tones[0]]
  return Array.from(
    { length: count },
    (_, i) => tones[Math.round((i / (count - 1)) * (tones.length - 1))],
  )
}
