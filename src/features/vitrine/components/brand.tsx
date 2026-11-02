import Image from 'next/image'

import { cn } from '@/lib/utils'

import styles from '../vitrine.module.css'

/**
 * The shipped SVGs are the logo. Two copies swap on the `.dark` class because
 * the mark is an opaque two-colour drawing, not a currentColor glyph: a favicon
 * that inherits `currentColor` would be invisible in browser chrome.
 */
export function VitrineLockup({
  className,
  priority = false,
  label = 'Vitrine',
}: {
  className?: string
  priority?: boolean
  label?: string
}) {
  return (
    <span
      className={cn(styles.lockup, className)}
      role="img"
      aria-label={label}
    >
      <Image
        src="/brand/vitrine/lockup.svg"
        alt=""
        width={139}
        height={34}
        priority={priority}
        className={styles.onlyLight}
      />
      <Image
        src="/brand/vitrine/lockup-reverse.svg"
        alt=""
        width={139}
        height={34}
        priority={priority}
        className={styles.onlyDark}
      />
    </span>
  )
}

export function VitrineStacked({
  className,
  height = 88,
  priority = false,
}: {
  className?: string
  height?: number
  priority?: boolean
}) {
  return (
    <span
      className={cn(styles.stacked, className)}
      style={{ height }}
      role="img"
      aria-label="Vitrine"
    >
      <Image
        src="/brand/vitrine/lockup-stacked.svg"
        alt=""
        width={106}
        height={88}
        priority={priority}
        className={styles.onlyLight}
      />
      <Image
        src="/brand/vitrine/lockup-stacked-reverse.svg"
        alt=""
        width={106}
        height={88}
        priority={priority}
        className={styles.onlyDark}
      />
    </span>
  )
}

export function VitrineMark({
  className,
  size = 32,
  decorative = false,
  compact = false,
}: {
  className?: string
  size?: number
  decorative?: boolean
  compact?: boolean
}) {
  const useCompact = compact || size < 32
  const light = useCompact
    ? '/brand/vitrine/mark-compact.svg'
    : '/brand/vitrine/mark.svg'
  const dark = useCompact
    ? '/brand/vitrine/mark-compact-reverse.svg'
    : '/brand/vitrine/mark-reverse.svg'

  return (
    <span
      className={cn(styles.mark, className)}
      style={{ width: size, height: size }}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img' })}
      aria-label={decorative ? undefined : 'Vitrine'}
    >
      <Image
        src={light}
        alt=""
        width={64}
        height={64}
        className={styles.onlyLight}
      />
      <Image
        src={dark}
        alt=""
        width={64}
        height={64}
        className={styles.onlyDark}
      />
    </span>
  )
}

export function VitrineWordmark({
  className,
  height = 26,
}: {
  className?: string
  height?: number
}) {
  return (
    <span
      className={cn(styles.wordmark, className)}
      style={{ height }}
      role="img"
      aria-label="Vitrine"
    >
      <Image
        src="/brand/vitrine/wordmark.svg"
        alt=""
        width={287}
        height={76}
        className={styles.onlyLight}
      />
      <Image
        src="/brand/vitrine/wordmark-reverse.svg"
        alt=""
        width={287}
        height={76}
        className={styles.onlyDark}
      />
    </span>
  )
}
