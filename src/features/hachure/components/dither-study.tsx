'use client'

import * as React from 'react'

import styles from '../hachure.module.css'
import { BAYER_CELLS, drawRange, rampFor } from '../dither-field'

const COUNTS = [3, 5, 7]
const RIDGES = [3, 6, 9]
const PIXELS = [2, 3, 4]

/**
 * The material, dissected. Every control changes a number the footer also uses:
 * how many tones the range is allowed, how many ridges recede into the mist,
 * how large one printed cell is, and how far the whole plate has developed.
 *
 * `develop` is the interesting one. The footer plays it once, on scroll; here it
 * is a scrub, so the sentence "depth is density" can be demonstrated backwards.
 */
export function DitherStudy({ tones }: { tones: string[] }) {
  const [count, setCount] = React.useState(7)
  const [layers, setLayers] = React.useState(6)
  const [pixel, setPixel] = React.useState(2)
  const [mist, setMist] = React.useState(0.8)
  const [develop, setDevelop] = React.useState(1)
  const [seed, setSeed] = React.useState(31)

  const host = React.useRef<HTMLDivElement>(null)
  const canvas = React.useRef<HTMLCanvasElement>(null)
  const ramp = React.useMemo(() => rampFor(tones, count), [tones, count])

  const draw = React.useCallback(() => {
    if (!host.current || !canvas.current) return
    drawRange(canvas.current, host.current, {
      tones: ramp,
      layers,
      seed,
      mist,
      pixel,
      develop,
    })
  }, [ramp, layers, seed, mist, pixel, develop])

  React.useEffect(() => {
    draw()
    const node = host.current
    if (!node) return
    const ro = new ResizeObserver(draw)
    ro.observe(node)
    return () => ro.disconnect()
  }, [draw])

  const used = Math.max(2, ramp.length)

  return (
    <div className={styles.study}>
      <div className={styles.studyStage}>
        <div ref={host} className={styles.studyHost}>
          <canvas ref={canvas} aria-hidden="true" />
        </div>
        <p className={styles.studyCaption}>
          <span>
            {used} tones · {layers} ridges · 1 cell = {pixel}px
          </span>
          <span>
            seed {seed} / reveal {(develop * 100).toFixed(0)}%
          </span>
        </p>
      </div>

      <div className={styles.studyPanel}>
        <fieldset className={styles.controlSet}>
          <legend className={styles.label}>Tones</legend>
          <div className={styles.segmented}>
            {COUNTS.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={count === value}
                onClick={() => setCount(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className={styles.ramp} aria-hidden="true">
            {ramp.map((tone) => (
              <i key={tone} style={{ background: tone }} />
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.controlSet}>
          <legend className={styles.label}>Ridges</legend>
          <div className={styles.segmented}>
            {RIDGES.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={layers === value}
                onClick={() => setLayers(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.controlSet}>
          <legend className={styles.label}>Cell</legend>
          <div className={styles.segmented}>
            {PIXELS.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={pixel === value}
                onClick={() => setPixel(value)}
              >
                {value}px
              </button>
            ))}
          </div>
        </fieldset>

        <label className={styles.range}>
          <span className={styles.label}>
            Mist <b>{mist.toFixed(2)}</b>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={mist}
            onChange={(event) => setMist(Number(event.target.value))}
            aria-valuetext={`${mist.toFixed(2)} of full mist`}
          />
        </label>

        <label className={styles.range}>
          <span className={styles.label}>
            Develop <b>{develop.toFixed(2)}</b>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={develop}
            onChange={(event) => setDevelop(Number(event.target.value))}
            aria-valuetext={`${(develop * 100).toFixed(0)} percent developed`}
          />
        </label>

        <div className={styles.studyActions}>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => setSeed((s) => s + 1)}
          >
            New range ↻
          </button>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => {
              setDevelop(1)
              setMist(0.8)
              setCount(7)
              setLayers(6)
              setPixel(2)
            }}
          >
            Reset
          </button>
        </div>

        <div className={styles.bayer}>
          <p className={styles.label}>8 × 8 Bayer</p>
          <div className={styles.bayerGrid} aria-hidden="true">
            {BAYER_CELLS.map((value, index) => (
              <i key={index} style={{ opacity: 0.08 + value * 0.92 }} />
            ))}
          </div>
          <p className={styles.bayerNote}>
            Threshold, not opacity. A cell is the ink or it is the paper.
          </p>
        </div>
      </div>

      <ul className={styles.recipe}>
        <li>
          <b>01</b>
          <div>
            <h4>Tone is an index</h4>
            <p>
              Seven steps from paper to pine. There is no gradient and no alpha:
              the range is printed in {used} inks, so every value on the plate
              is one of them.
            </p>
          </div>
        </li>
        <li>
          <b>02</b>
          <div>
            <h4>Mist hides, it does not blur</h4>
            <p>
              A half-resolution noise field lifts the far ridges toward the
              paper tone. Nothing is filtered; the dots simply stop.
            </p>
          </div>
        </li>
        <li>
          <b>03</b>
          <div>
            <h4>The reveal is the storyboard</h4>
            <p>
              Back to front, 170ms apart. Scrub <em>Develop</em> to zero and the
              plate is paper — which is how the footer begins, and why it never
              fades in.
            </p>
          </div>
        </li>
      </ul>
    </div>
  )
}
