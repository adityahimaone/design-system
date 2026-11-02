'use client'

import { useEffect, useState } from 'react'

import styles from '../porphyry.module.css'

type Surface = 'stage' | 'vellum'

const KEY = 'porphyry-surface'

function applySurface(surface: Surface) {
  const root = document.documentElement
  if (surface === 'vellum') root.dataset.po = 'vellum'
  else delete root.dataset.po
}

/**
 * The vellum is a surface, not a second identity: the stone keeps its hex and
 * the paper becomes the ground. The choice is written to <html data-po> so the
 * token layer can swap without a re-render.
 */
export function PorphyryThemeToggle() {
  const [surface, setSurface] = useState<Surface>('stage')

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'stage' || saved === 'vellum') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSurface(saved)
      applySurface(saved)
    }
  }, [])

  const toggle = () => {
    const next: Surface = surface === 'vellum' ? 'stage' : 'vellum'
    setSurface(next)
    applySurface(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      /* storage unavailable */
    }
  }

  const vellum = surface === 'vellum'

  return (
    <button
      type="button"
      className={styles.themeBtn}
      aria-pressed={vellum}
      aria-label={vellum ? 'Switch to the stage' : 'Switch to vellum'}
      onClick={toggle}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M12 3.5v17" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 3.5h8.5v8.5H12z" fill="currentColor" />
      </svg>
      <span>{vellum ? 'Stage' : 'Vellum'}</span>
    </button>
  )
}
