import { cn } from '@/lib/utils'

import styles from '../strand.module.css'
import {
  WORDMARK_HEIGHT,
  WORDMARK_PATH,
  WORDMARK_WIDTH,
} from '../wordmark-path'

/**
 * The mark is two planes with a six-unit channel between them, drawn on the
 * 64 grid. It is inline SVG rather than a file on purpose: the two planes read
 * `--st-signal` and `--st-fg`, so the night surface is a token change, not a
 * second asset and not a `filter: invert()` on a flat drawing.
 */
const DUNE = 'M26 9H58L52 27H20Z'
const SEA = 'M12 33H52L46 55H6Z'
const COMPACT_DUNE = 'M24 8H58L53 28H19Z'
const COMPACT_SEA = 'M10 35H52L47 56H5Z'

type Variant = 'default' | 'reverse' | 'mono'

function fills(variant: Variant) {
  if (variant === 'reverse') return { dune: '#E9A469', sea: '#EFEDE6' }
  if (variant === 'mono') return { dune: 'currentColor', sea: 'currentColor' }
  return { dune: 'var(--st-signal)', sea: 'var(--st-fg)' }
}

export function StrandMark({
  size = 32,
  compact,
  variant = 'default',
  className,
  decorative = true,
}: {
  size?: number
  compact?: boolean
  variant?: Variant
  className?: string
  decorative?: boolean
}) {
  const useCompact = compact ?? size < 28
  const f = fills(variant)
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn(styles.brandMark, className)}
      style={{ width: size, height: size }}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : 'Strand'}
    >
      <path fill={f.dune} d={useCompact ? COMPACT_DUNE : DUNE} />
      <path fill={f.sea} d={useCompact ? COMPACT_SEA : SEA} />
    </svg>
  )
}

export function StrandWordmark({
  height = 26,
  className,
}: {
  height?: number
  className?: string
}) {
  const width = (WORDMARK_WIDTH / WORDMARK_HEIGHT) * height
  return (
    <svg
      viewBox={`0 0 ${WORDMARK_WIDTH} ${WORDMARK_HEIGHT}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="strand"
      style={{ height, width }}
    >
      <path fill="currentColor" d={WORDMARK_PATH} />
    </svg>
  )
}

export function StrandLockup({
  height = 30,
  variant = 'default',
  className,
}: {
  height?: number
  variant?: Variant
  className?: string
}) {
  const f = fills(variant)
  const mark = height
  const wmHeight = height * 0.32
  const wmWidth = (WORDMARK_WIDTH / WORDMARK_HEIGHT) * wmHeight
  const gap = height * 0.24
  const total = mark + gap + wmWidth
  const wmY = (mark - wmHeight) / 2
  return (
    <svg
      viewBox={`0 0 ${total} ${mark}`}
      width={total}
      height={mark}
      className={className}
      role="img"
      aria-label="strand"
      style={{ height, width: total }}
    >
      <g transform={`scale(${mark / 64})`}>
        <path fill={f.dune} d={DUNE} />
        <path fill={f.sea} d={SEA} />
      </g>
      <g transform={`translate(${mark + gap} ${wmY}) scale(${wmHeight / WORDMARK_HEIGHT})`}>
        <path fill="currentColor" d={WORDMARK_PATH} />
      </g>
    </svg>
  )
}

/** The cast: one cut line (45° on every right end), one fill, two shapes. */
export function CastGlyph({
  paths,
  size = 44,
  className,
}: {
  paths: readonly string[]
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn(styles.castMark, className)}
      role="presentation"
      aria-hidden
    >
      {paths.map((d) => (
        <path key={d} fill="currentColor" d={d} />
      ))}
    </svg>
  )
}
