import styles from '../huginn.module.css'

/** The same 4 × 4 Bayer matrix the footer paints, in markup. */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

/**
 * The dissolve, as markup rather than canvas.
 *
 * The footer paints this on a `<canvas>`; the plate below is the same rule
 * evaluated at build time — a light source at the top left, falling off to the
 * bottom right, and a cell printed wherever the picture is darker than its
 * Bayer threshold. It needs no JavaScript, so the rule is readable with scripts
 * off and diffable in a screenshot.
 */
export function DitherPlate({
  rows = 22,
  field = false,
  label,
}: {
  rows?: number
  field?: boolean
  label: string
}) {
  const cells: { x: number; y: number; on: boolean }[] = []
  const cx = rows * 0.32
  const cy = rows * 0.34
  const reach = rows * 0.92

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < rows; x += 1) {
      const value = 1 - Math.hypot(x - cx, y - cy) / reach
      const threshold = (BAYER[y % 4][x % 4] + 0.5) / 16
      cells.push({ x, y, on: value > threshold })
    }
  }

  return (
    <div
      className={`${styles.plate} ${field ? styles.plateField : ''}`}
      role="img"
      aria-label={label}
      style={{ gridTemplateColumns: `repeat(${rows}, minmax(0, 1fr))` }}
    >
      {cells.map((cell) => (
        <span
          key={`${cell.x}-${cell.y}`}
          className={cell.on ? styles.plateOn : undefined}
        />
      ))}
    </div>
  )
}
