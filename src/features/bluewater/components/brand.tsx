import { cn } from '@/lib/utils'

import styles from '../bluewater.module.css'

const BASE = '/brand/bluewater'

/**
 * The mark family.
 *
 * Every component renders both inks and lets CSS pick, so the ramp toggle never
 * needs a JS re-render to swap a logo. The reverse files are redrawn, not
 * filtered: `filter: invert()` would turn the silver wake into a muddy amber.
 *
 * Below 32px the compact drawing is used — a different mark, not a smaller one.
 */

const LOCKUP_ASPECT = 415.76 / 64
const STACKED_ASPECT = 337.76 / 106
const WORDMARK_ASPECT = 337.76 / 24

type Size = { className?: string; size?: number }
type Height = { className?: string; height?: number }

export function BwMark({ className, size = 32 }: Size) {
  const compact = size < 32
  const file = compact ? 'mark-compact' : 'mark'
  const reverse = compact ? 'mark-compact-reverse' : 'mark-reverse'

  return (
    <span
      className={cn(styles.mark, className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Bluewater Freight"
    >
      {}
      <img src={`${BASE}/${file}.svg`} alt="" width={size} height={size} />
      {}
      <img src={`${BASE}/${reverse}.svg`} alt="" width={size} height={size} />
    </span>
  )
}

export function BwLockup({
  className,
  height = 26,
  label = 'Bluewater Freight',
}: {
  className?: string
  height?: number
  label?: string
}) {
  const width = Math.round(height * LOCKUP_ASPECT * 100) / 100

  return (
    <span
      className={cn(styles.lockup, className)}
      style={{ height, width }}
      role="img"
      aria-label={label}
    >
      {}
      <img src={`${BASE}/lockup.svg`} alt="" width={width} height={height} />
      {}
      <img
        src={`${BASE}/lockup-reverse.svg`}
        alt=""
        width={width}
        height={height}
      />
    </span>
  )
}

export function BwStacked({ className, height = 106 }: Height) {
  const width = Math.round(height * STACKED_ASPECT * 100) / 100

  return (
    <span
      className={cn(styles.lockup, className)}
      style={{ height, width }}
      role="img"
      aria-label="Bluewater Freight"
    >
      {}
      <img
        src={`${BASE}/lockup-stacked.svg`}
        alt=""
        width={width}
        height={height}
      />
      {}
      <img
        src={`${BASE}/lockup-stacked-reverse.svg`}
        alt=""
        width={width}
        height={height}
      />
    </span>
  )
}

export function BwWordmark({ className, height = 24 }: Height) {
  const width = Math.round(height * WORDMARK_ASPECT * 100) / 100

  return (
    <span
      className={cn(styles.lockup, className)}
      style={{ height, width }}
      role="img"
      aria-label="Bluewater Freight"
    >
      {}
      <img src={`${BASE}/wordmark.svg`} alt="" width={width} height={height} />
      {}
      <img
        src={`${BASE}/wordmark-reverse.svg`}
        alt=""
        width={width}
        height={height}
      />
    </span>
  )
}
