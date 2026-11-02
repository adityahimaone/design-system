import { WORDMARK_BOX, WORDMARK_PATHS } from '../wordmark-paths'

/**
 * The mark family, drawn from the same geometry as the source files.
 *
 * One unit S = 100. Outer corner 2S, inner corner 1S, stop 1,38S, gap 0,62S.
 * The compact is a *separate* drawing (0,78S stop, flush right, no clear space),
 * and the glyph is a single knocked-out contour — that is why they are three
 * components and not one component with a scale prop.
 */

const PRIMARY = {
  path: 'M250 100L350 100L350 275.6A200 200 0 0 1 150 475.6L100 475.6L100 375.6L150 375.6A100 100 0 0 0 250 275.6Z',
  stop: { cx: 481, cy: 406.6, r: 69 },
  box: { w: 650, h: 576 },
} as const

/** The primary drawing, shared with the drawn applications so the card and the
 *  lockup cannot drift into two different marks. */
export const JAKARTA_PRIMARY = PRIMARY

const COMPACT = {
  path: 'M150 0L250 0L250 175.6A200 200 0 0 1 50 375.6L0 375.6L0 275.6L50 275.6A100 100 0 0 0 150 175.6Z',
  stop: { cx: 372, cy: 297.6, r: 78 },
  box: { w: 450, h: 376 },
} as const

const GLYPH = {
  path: 'M17 4L25 4L25 12A16 16 0 0 1 9 28L7 28L7 20L9 20A8 8 0 0 0 17 12Z',
  box: { w: 32, h: 32 },
} as const

type MarkProps = {
  /** Rendered height in px. Width follows the drawing's own ratio. */
  size?: number
  /** Wordmark and lockup are sized by height; the marks are sized by `size`. */
  height?: number
  className?: string
  /** Decorative marks announce nothing; the label is for standalone marks. */
  decorative?: boolean
  label?: string
}

export function JakartaMark({
  size = 48,
  className,
  decorative = false,
  label = 'Jakarta',
}: MarkProps) {
  const { w, h } = PRIMARY.box
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={(size * w) / h}
      height={size}
      fill="currentColor"
      className={className}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      {!decorative && <title>{label}</title>}
      <path d={PRIMARY.path} />
      <circle cx={PRIMARY.stop.cx} cy={PRIMARY.stop.cy} r={PRIMARY.stop.r} />
    </svg>
  )
}

export function JakartaMarkCompact({
  size = 16,
  className,
  decorative = true,
}: MarkProps) {
  const { w, h } = COMPACT.box
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={(size * w) / h}
      height={size}
      fill="currentColor"
      className={className}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      <path d={COMPACT.path} />
      <circle cx={COMPACT.stop.cx} cy={COMPACT.stop.cy} r={COMPACT.stop.r} />
    </svg>
  )
}

export function JakartaGlyph({
  size = 32,
  className,
  decorative = true,
}: MarkProps) {
  const { w, h } = GLYPH.box
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={(size * h) / w}
      className={className}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      <rect width={w} height={h} fill="var(--jk-accent, #F7481B)" />
      <path d={GLYPH.path} fill="var(--jk-kertas, #F7F4EE)" />
    </svg>
  )
}

export function JakartaWordmark({
  height = 32,
  className,
  decorative = true,
}: MarkProps) {
  const { w, h } = WORDMARK_BOX
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={(height * w) / h}
      height={height}
      fill="currentColor"
      className={className}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      {WORDMARK_PATHS.map((glyph) => (
        <path key={glyph.t} transform={glyph.t} d={glyph.d} />
      ))}
    </svg>
  )
}

/**
 * Mark and wordmark on one baseline: the wordmark cap height is 0,72 of the
 * mark's height and the gap is 1,6S. Composed from the same two drawings so a
 * change to either propagates — the file `lockup.svg` is generated, not drawn.
 */
export function JakartaLockup({
  height = 40,
  className,
  decorative = true,
}: MarkProps) {
  const cap = height * 0.72
  const scale = cap / WORDMARK_BOX.h
  const gap = height * 1.6 * (100 / PRIMARY.box.h)
  const x = (PRIMARY.box.w * height) / PRIMARY.box.h + gap
  const width = x + (WORDMARK_BOX.w * cap) / WORDMARK_BOX.h

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="currentColor"
      className={className}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      <g transform={`scale(${height / PRIMARY.box.h})`}>
        <path d={PRIMARY.path} />
        <circle cx={PRIMARY.stop.cx} cy={PRIMARY.stop.cy} r={PRIMARY.stop.r} />
      </g>
      <g transform={`translate(${x} ${height - cap}) scale(${scale})`}>
        {WORDMARK_PATHS.map((glyph) => (
          <path key={glyph.t} transform={glyph.t} d={glyph.d} />
        ))}
      </g>
    </svg>
  )
}
