import { COMPACT, MARK, type MarkGeometry } from '../brand-paths'

type RisoMarkProps = {
  size?: number
  /** The 16px drawing — two shapes, no pin, a wider channel. */
  compact?: boolean
  /** One ink: the pin is punched through both flaps. */
  mono?: boolean
  /** Printed on drum A: the second drum becomes carbon, because blue on
      orange is 1.24:1 and the tear stops reading. */
  onDrum?: boolean
  title?: string
  className?: string
}

/**
 * The mark, inline.
 *
 * Inline rather than `<img>` because the flaps are painted from the drum
 * tokens: on the orange sheet the second drum has to become carbon (blue on
 * orange is 1.24:1 and the tear stops reading), and an `<img>` cannot see the
 * page's custom properties.
 */
export function RisoMark({
  size = 32,
  compact = false,
  mono = false,
  onDrum = false,
  title,
  className,
}: RisoMarkProps) {
  const geometry: MarkGeometry = compact ? COMPACT : MARK
  const label = title ?? 'Riso Co.'

  if (mono) {
    const paths = MARK.mono ?? { a: MARK.a, b: MARK.b }
    return (
      <svg
        viewBox={`0 0 ${MARK.box} ${MARK.box}`}
        width={size}
        height={size}
        role="img"
        aria-label={label}
        className={className}
        fill="currentColor"
      >
        <path fillRule="evenodd" d={paths.a} />
        <path fillRule="evenodd" d={paths.b} />
      </svg>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${geometry.box} ${geometry.box}`}
      width={size}
      height={size}
      role="img"
      aria-label={label}
      className={className}
    >
      <path
        d={geometry.a}
        fill={onDrum ? 'var(--rs-paper, #f1ede4)' : 'var(--rs-drum-a, #f2542d)'}
      />
      <path
        d={geometry.b}
        fill={
          onDrum ? 'var(--rs-carbon, #1b1712)' : 'var(--rs-drum-b, #1d63ff)'
        }
      />
      {geometry.pin ? (
        <path d={geometry.pin} fill="var(--rs-pin, #1b1712)" />
      ) : null}
    </svg>
  )
}

/**
 * The pushpin, as a flat silhouette.
 *
 * The footer's pin is a shaded object — a domed cap with a steel needle. This is
 * the same drawing reduced to one ink, because the hero is printed and a
 * gradient would be the only soft thing on the sheet. It sits on the stage at
 * the top of the sheet, which is where the tear starts.
 */
export function RisoPin({
  size = 56,
  className,
}: {
  size?: number
  className?: string
}) {
  const height = Math.round((size * 200) / 100)
  return (
    <svg
      viewBox="0 0 100 200"
      width={size}
      height={height}
      role="img"
      aria-label="Pushpin"
      className={className}
      fill="currentColor"
    >
      <path d="M24 36V17Q24 2 50 2Q76 2 76 17V36Z" />
      <path d="M36 36H64L60 98H40Z" />
      <path d="M20 98H80V116H20Z" />
      <path d="M47.2 116H52.8L51.4 193H48.6Z" />
    </svg>
  )
}

/** The lockup as a file — outlined wordmark, no live text. */
export function RisoLockup({
  height = 40,
  reverse = false,
  className,
}: {
  height?: number
  reverse?: boolean
  className?: string
}) {
  const width = Math.round(height * (224.46 / 56))
  return (
    <img
      src={`/brand/riso/${reverse ? 'lockup-mono' : 'lockup'}.svg`}
      width={width}
      height={height}
      alt="Riso Co."
      className={className}
    />
  )
}
