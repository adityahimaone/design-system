'use client'

import * as React from 'react'

import styles from '../hachure.module.css'
import { drawRange } from '../dither-field'

/**
 * The range band's specimen: a strip of the same plate, at the same 2px cell,
 * so the foundation section shows the material rather than a drawing of a
 * mountain. Flat silhouettes would contradict the rule the section states.
 */
export function RangeThumb({ tones }: { tones: string[] }) {
  const host = React.useRef<HTMLDivElement>(null)
  const canvas = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const paint = () => {
      if (!host.current || !canvas.current) return
      drawRange(canvas.current, host.current, {
        tones,
        layers: 6,
        seed: 12,
        mist: 0.5,
        pixel: 2,
        develop: 1,
        fadeFrom: 0.55,
      })
    }
    paint()
    const node = host.current
    if (!node) return
    const ro = new ResizeObserver(paint)
    ro.observe(node)
    return () => ro.disconnect()
  }, [tones])

  return (
    <div ref={host} className={styles.bandDither}>
      <canvas ref={canvas} aria-hidden="true" />
    </div>
  )
}
