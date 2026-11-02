import Link from 'next/link'

import styles from '../hachure.module.css'

import {
  MARK,
  WORDMARK_D,
  WORDMARK_RATIO,
  WORDMARK_VIEWBOX,
} from '../brand-paths'

/**
 * The mark: a section through rising ground.
 *
 * One solid mass, one lit crest. The mass is bounded by a flat bottom, two
 * vertical sides and a top edge that climbs left to right; the crest is a band
 * of constant thickness cut from that edge, so the highest surface of the
 * silhouette is the lichen. Nothing is hatched inside the mass — internal
 * hatching is what fails at 16px — so density is carried by the slope of the
 * top edge instead of by a stroke count.
 *
 * There is deliberately no compact variant. The previous seven-stroke drawing
 * needed a 32-grid redraw because its 2.2-unit channels closed into a block
 * below 24px; this one has no channel to close, so the same geometry is used at
 * every size from 16 to 512.
 */
export function HachureMark({
  size = 32,
  mono = false,
  title,
  className,
}: {
  size?: number
  mono?: boolean
  title?: string
  className?: string
}) {
  return (
    <svg
      viewBox={`0 0 ${MARK.box} ${MARK.box}`}
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={MARK.body} fill="var(--hx-mark-ink, #16211B)" />
      <path
        d={MARK.cap}
        fill={mono ? 'currentColor' : 'var(--hx-sheet, #C9D94E)'}
      />
    </svg>
  )
}

/** The name, outlined once from Geist Mono 700. Never live text. */
export function HachureWordmark({
  height = 26,
  className,
}: {
  height?: number
  className?: string
}) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      height={height}
      width={Math.round(height * WORDMARK_RATIO)}
      className={className}
      role="img"
      aria-label="hachure"
      focusable="false"
    >
      <path d={WORDMARK_D} fill="currentColor" />
    </svg>
  )
}

/**
 * Mark and name. The mark is drawn at 0.95 of the lockup size: its ink is
 * 58 × 52 of its 64 units, so at equal sizes it would stand well over the
 * wordmark's cap height and swamp the name. 0.95 puts the ink at 1.4 × the
 * wordmark height, which is where the drawn lockup SVG has it.
 */
export function HachureLockup({ size = 30 }: { size?: number }) {
  const markSize = Math.round(size * 0.95)

  return (
    <Link
      href="/design-system/hachure"
      className={styles.lockup}
      aria-label="Hachure — design system"
    >
      <HachureMark size={markSize} />
      <span className={styles.lockupWord} aria-hidden="true">
        <HachureWordmark height={Math.round(size * 0.58)} />
        <span className={styles.lockupSub}>terrain / weather / field data</span>
      </span>
    </Link>
  )
}
