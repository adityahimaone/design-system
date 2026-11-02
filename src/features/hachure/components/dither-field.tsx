'use client'

import * as React from 'react'

import styles from '../hachure.module.css'
import { drawRange } from '../dither-field'

const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/** One develop step every 33ms. The full-bleed field is roughly three times
 *  the cells of the framed plate it replaced, and redrawing on every animation
 *  frame cost more than the extra smoothness was worth. */
const STEP_MS = 33

export type DitherFieldProps = {
  tones: string[]
  /** The night ramp. When given, the field follows the page's data-theme. */
  tonesDark?: string[]
  seed: number
  /** Ridges receding into the mist, 2–9. */
  layers?: number
  /** 0–1, how much mist sits over the far ridges. */
  mist?: number
  /** One dither cell, CSS px. Keeps the field on the same ruling as the mark. */
  pixel?: number
  /** How long the range takes to develop, ms. */
  duration?: number
  /** 0–1. Where the sheet wins at the top of the field. */
  fadeFrom?: number
  /** Class for the positioned host. The canvas is anchored to its bottom. */
  className?: string
}

/**
 * The dither as a background, not a picture.
 *
 * This is the same engine the supplied footer uses, with one addition a footer
 * does not need: `develop`, so a range can be stopped anywhere between paper
 * and full tone. The hero and the footer are the same field seen twice — the
 * range rises at the top of the page and returns at the bottom — which is why
 * they share this component instead of each growing a slightly different copy
 * of the maths.
 *
 * The host is what gets measured, not the canvas: the canvas is absolutely
 * positioned by the stylesheet, so measuring it after setting its CSS width
 * would feed its own output back in.
 *
 * Theme: the page carries `data-theme` on `[data-hachure-root]` and the token
 * layer does the rest, but a canvas is not a stylesheet — it cannot inherit.
 * So the field watches that attribute and swaps ramp. Painting the paper ramp
 * at night would put a bright sheet across the top of a dark page.
 */
export function DitherField({
  tones,
  tonesDark,
  seed,
  layers = 7,
  mist = 0.92,
  pixel = 2,
  duration = 1600,
  fadeFrom,
  className,
}: DitherFieldProps) {
  const host = React.useRef<HTMLDivElement>(null)
  const canvas = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const stage = host.current
    const node = canvas.current
    if (!stage || !node) return

    const root = stage.closest('[data-hachure-root]')
    const ramp = () =>
      tonesDark && root?.getAttribute('data-theme') === 'dark'
        ? tonesDark
        : tones

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    let raf = 0
    let last = 0
    let done = false
    const start = performance.now()

    const paint = (develop: number) => {
      drawRange(node, stage, {
        tones: ramp(),
        layers,
        seed,
        mist,
        pixel,
        develop,
        fadeFrom,
      })
    }

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      if (now - last >= STEP_MS || t >= 1) {
        last = now
        paint(ease(t))
      }
      if (t < 1) raf = requestAnimationFrame(tick)
      else done = true
    }

    paint(reduced ? 1 : 0)
    done = reduced
    if (!reduced) raf = requestAnimationFrame(tick)

    // A resize must land on the finished range, never on a partial one.
    const ro = new ResizeObserver(() => paint(done ? 1 : ease(1)))
    ro.observe(stage)

    // A theme change must repaint immediately, at full development.
    const mo = new MutationObserver(() => {
      if (done) paint(1)
    })
    if (root)
      mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
    }
  }, [tones, tonesDark, seed, layers, mist, pixel, duration, fadeFrom])

  return (
    <div ref={host} className={className ?? styles.field} aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  )
}
