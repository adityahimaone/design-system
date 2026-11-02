'use client'

import { useEffect, useRef } from 'react'

import styles from '../huginn.module.css'

/** The same 4 × 4 Bayer matrix the surface band paints. */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

/**
 * The dissolve over the hero's painting.
 *
 * A canvas rather than a grid of elements: at 6px cells the painting needs about
 * 13,000 cells to read as a screen, and 13,000 `<span>`s is not a hero. This is
 * the footer's own rule — field colour where the picture is darker than the
 * Bayer threshold — painted at the top of the page.
 *
 * The grid is derived from the element's own width, so a phone gets the same
 * 6px screen as a desktop instead of a 1.6px moiré. The image underneath also
 * carries a CSS fade, so with scripts off the painting still thins into the
 * field rather than ending on a hard edge.
 */
export function DitherCanvas({
  cell = 6,
  from = 0.42,
  to = 0.98,
  field = '#e2281b',
}: {
  cell?: number
  from?: number
  to?: number
  field?: string
}) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rgb = [
      parseInt(field.slice(1, 3), 16),
      parseInt(field.slice(3, 5), 16),
      parseInt(field.slice(5, 7), 16),
    ]

    const paint = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (!width || !height) return

      const cols = Math.max(1, Math.round(width / cell))
      const rows = Math.max(1, Math.round(height / cell))
      canvas.width = cols
      canvas.height = rows

      const image = ctx.createImageData(cols, rows)
      for (let y = 0; y < rows; y += 1) {
        const coverage = Math.min(
          1,
          Math.max(0, (y / rows - from) / (to - from)),
        )
        for (let x = 0; x < cols; x += 1) {
          const on = (BAYER[y % 4][x % 4] + 0.5) / 16 < coverage
          const index = (y * cols + x) * 4
          image.data[index] = rgb[0]
          image.data[index + 1] = rgb[1]
          image.data[index + 2] = rgb[2]
          image.data[index + 3] = on ? 255 : 0
        }
      }

      ctx.putImageData(image, 0, 0)
    }

    paint()
    const observer = new ResizeObserver(paint)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [cell, from, to, field])

  return <canvas ref={ref} className={styles.ditherCanvas} aria-hidden="true" />
}
