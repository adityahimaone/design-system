import { COMPACT, GLYPH, MARK, type CellGeometry } from '../brand-paths'

type HuginnMarkProps = {
  size?: number
  /** The 16px drawing — three cells at 8 units, a wider gap. */
  compact?: boolean
  /** Two cells: the glyph a favicon can hold. */
  glyph?: boolean
  /** One ink: the escapee keeps its off-grid position, not its colour. */
  mono?: boolean
  /** Printed on the vermilion field: the escapee switches to ink, because a
      knockout of the field would erase the one cell the mark is about. */
  onField?: boolean
  title?: string
  className?: string
}

/**
 * The mark, inline.
 *
 * Inline rather than `<img>` because the cells are painted from `currentColor`
 * and the escapee from the field token: on the vermilion plate the escapee has
 * to become the field itself, and an `<img>` cannot see the page's properties.
 */
export function HuginnMark({
  size = 32,
  compact = false,
  glyph = false,
  mono = false,
  onField = false,
  title,
  className,
}: HuginnMarkProps) {
  const geometry: CellGeometry = glyph ? GLYPH : compact ? COMPACT : MARK
  const label = title ?? 'Huginn'
  const escapeFill = mono
    ? 'currentColor'
    : onField
      ? 'var(--hg-ink, #100f0e)'
      : 'var(--hg-escape, #e2281b)'

  return (
    <svg
      viewBox={`0 0 ${geometry.box} ${geometry.box}`}
      width={size}
      height={size}
      role="img"
      aria-label={label}
      className={className}
      fill="currentColor"
    >
      {geometry.cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={cell.size}
          height={cell.size}
          fill={cell.escape ? escapeFill : 'currentColor'}
        />
      ))}
    </svg>
  )
}

/** The lockup as a file — outlined, cell-drawn wordmark, no live text. */
export function HuginnLockup({
  height = 40,
  mono = false,
  className,
}: {
  height?: number
  mono?: boolean
  className?: string
}) {
  const width = Math.round(height * (246.75 / 56))
  return (
    <img
      src={`/brand/huginn/${mono ? 'lockup-reverse' : 'lockup'}.svg`}
      width={width}
      height={height}
      alt="Huginn"
      className={className}
    />
  )
}
