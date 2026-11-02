'use client'

import * as React from 'react'

import RidgelineDitherFooter from '@/components/ui/ridgeline-dither-footer'

import styles from '../hachure.module.css'
import { HachureMark } from './brand'

type Theme = 'light' | 'dark'

const GROUND = {
  paper: '#F2F4EE',
  ink: '#16211B',
  muted: '#586759',
  line: '#CBD3C6',
  heart: '#A82A1C',
}

const NIGHT = {
  paper: '#0A110D',
  ink: '#E8EEE7',
  muted: '#93A398',
  line: '#1E2A22',
  heart: '#F0917F',
}

/**
 * The specimen, not a mock of it: the supplied component, fed the system's own
 * tones.
 *
 * The footer is the only surface allowed in the range band, so the demo is
 * full-bleed and nothing is placed below it. `preset` is left at evergreen and
 * every colour is passed in: the component then has no opinion that the token
 * layer has not already made.
 */
export function FooterDemo({
  tones,
}: {
  tones: { light: string[]; dark: string[] }
}) {
  const [theme, setTheme] = React.useState<Theme>('light')
  const [seed, setSeed] = React.useState(41)
  const [ridges, setRidges] = React.useState(6)
  const [mist, setMist] = React.useState(0.8)
  const [altimeter, setAltimeter] = React.useState(true)

  // The page root owns the theme; the specimen follows it rather than keeping a
  // second copy of the same state.
  React.useEffect(() => {
    const root = document.querySelector('[data-hachure-root]')
    if (!root) return
    const read = () =>
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])

  const colours = theme === 'dark' ? NIGHT : GROUND
  const ramp = theme === 'dark' ? tones.dark : tones.light

  return (
    <div className={styles.specimen}>
      <div className={styles.specimenBar}>
        <div className={styles.specimenGroup}>
          <span className={styles.label}>Seed</span>
          <b className={styles.seed}>{seed}</b>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => setSeed((value) => value + 1)}
          >
            New range ↻
          </button>
        </div>

        <div className={styles.specimenGroup}>
          <span className={styles.label}>Ridges</span>
          <div
            className={styles.segmented}
            role="group"
            aria-label="Ridge count"
          >
            {[4, 6, 8].map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={ridges === value}
                onClick={() => setRidges(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

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

        <label className={styles.check}>
          <input
            type="checkbox"
            checked={altimeter}
            onChange={(event) => setAltimeter(event.target.checked)}
          />
          Altimeter
        </label>

        <p className={styles.specimenNote}>
          Move across the range: the mist parts, the ridges tilt, and the crest
          under the pointer reads out its height. Click it for a gust.
        </p>
      </div>

      <div className={styles.specimenStage}>
        <RidgelineDitherFooter
          name="hachure"
          brandHref="#specimen"
          logo={<HachureMark size={26} />}
          tagline="Relief drawn by density, never by shadow. Six ridges from one seed, seven tones from one paper, and a footer you can read an altitude off."
          columns={[
            {
              title: 'Map',
              links: [
                { label: 'Ridge profiles' },
                { label: 'Quadrangle sheets' },
                { label: 'Spot heights', badge: 'New' },
              ],
            },
            {
              title: 'Field',
              links: [
                { label: 'Weather' },
                { label: 'Stations' },
                { label: 'Altimeter' },
              ],
            },
            {
              title: 'Survey',
              links: [
                { label: 'Method' },
                { label: 'Datum' },
                { label: 'Field log' },
              ],
            },
          ]}
          socials={[
            { icon: 'x', href: '#specimen', label: 'X' },
            { icon: 'github', href: '#specimen', label: 'GitHub' },
            { icon: 'youtube', href: '#specimen', label: 'YouTube' },
          ]}
          copyright="© 2026 hachure — a drawn specimen, not a company."
          credit={{ label: 'hand, not a library', href: '#audit' }}
          preset="evergreen"
          palette={{ ...colours, tones: ramp }}
          seed={seed}
          ridges={ridges}
          mist={mist}
          drift={1}
          altimeter={altimeter}
          interactive
          fontFamily="var(--font-geist), system-ui, sans-serif"
          monoFamily="var(--font-geist-mono), ui-monospace, monospace"
          height="720px"
          sceneMinHeight="300px"
          maxWidth="1120px"
        />
      </div>
    </div>
  )
}
