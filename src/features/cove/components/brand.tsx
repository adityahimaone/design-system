import { cn } from '@/lib/utils'

import styles from '../cove.module.css'

/**
 * The shipped SVGs are the logo. Two drawings, not one: `mark.svg` is the ink
 * block for the night ground, `mark-reverse.svg` is the abyss block for the day
 * ground. Swapping files instead of filtering keeps the reading's lumen
 * identical in both ramps — a `filter: invert()` would have turned the signal
 * magenta.
 *
 * The reading is the same width in every size, so the mark is never nudged by
 * a viewBox.
 */
const LOCKUP_ASPECT = 165.4 / 64
const STACKED_ASPECT = 64 / 91.85
const WORDMARK_ASPECT = 2372 / 611

export function CoveLockup({
  className,
  height = 22,
  label = 'Cove',
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
      <img
        src="/brand/cove/lockup.svg"
        alt=""
        width={width}
        height={height}
        className={styles.onlyNight}
      />
      <img
        src="/brand/cove/lockup-reverse.svg"
        alt=""
        width={width}
        height={height}
        className={styles.onlyDay}
      />
    </span>
  )
}

export function CoveStacked({
  className,
  height = 92,
}: {
  className?: string
  height?: number
}) {
  const width = Math.round(height * STACKED_ASPECT * 100) / 100

  return (
    <span
      className={cn(styles.stacked, className)}
      style={{ height, width }}
      role="img"
      aria-label="Cove"
    >
      <img
        src="/brand/cove/lockup-stacked.svg"
        alt=""
        width={width}
        height={height}
        className={styles.onlyNight}
      />
      <img
        src="/brand/cove/lockup-stacked-reverse.svg"
        alt=""
        width={width}
        height={height}
        className={styles.onlyDay}
      />
    </span>
  )
}

export function CoveMark({
  className,
  size = 28,
  decorative = false,
  compact = false,
}: {
  className?: string
  size?: number
  decorative?: boolean
  compact?: boolean
}) {
  // Under 32px the reading closes up and would fill in, so the compact drawing
  // drops it and thickens the arms instead of downscaling the full mark.
  const useCompact = compact || size < 32

  return (
    <span
      className={cn(styles.mark, className)}
      style={{ width: size, height: size }}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img' })}
      aria-label={decorative ? undefined : 'Cove'}
    >
      <img
        src={
          useCompact
            ? '/brand/cove/mark-compact.svg'
            : '/brand/cove/mark.svg'
        }
        alt=""
        width={64}
        height={64}
        className={styles.onlyNight}
      />
      <img
        src={
          useCompact
            ? '/brand/cove/mark-compact-reverse.svg'
            : '/brand/cove/mark-reverse.svg'
        }
        alt=""
        width={64}
        height={64}
        className={styles.onlyDay}
      />
    </span>
  )
}

export function CoveWordmark({
  className,
  height = 24,
}: {
  className?: string
  height?: number
}) {
  const width = Math.round(height * WORDMARK_ASPECT * 100) / 100

  return (
    <span
      className={cn(styles.wordmark, className)}
      style={{ height, width }}
      role="img"
      aria-label="Cove"
    >
      <img
        src="/brand/cove/wordmark.svg"
        alt=""
        width={width}
        height={height}
        className={styles.onlyNight}
      />
      <img
        src="/brand/cove/wordmark-reverse.svg"
        alt=""
        width={width}
        height={height}
        className={styles.onlyDay}
      />
    </span>
  )
}
