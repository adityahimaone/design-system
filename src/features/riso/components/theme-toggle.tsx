'use client'

import { useEffect, useState } from 'react'

import styles from '../riso.module.css'

type Surface = 'light' | 'safelight'

const KEY = 'riso-surface'

function applySurface(surface: Surface) {
  const root = document.documentElement
  if (surface === 'safelight') {
    root.dataset.riso = 'safelight'
  } else {
    delete root.dataset.riso
  }
}

/**
 * The safelight is a surface, not a theme: the two drums keep their hex and the
 * paper inverts, the way ink behaves under a red lamp. The choice is written to
 * <html data-riso> so the token layer can swap without a re-render.
 */
export function RisoThemeToggle() {
  const [surface, setSurface] = useState<Surface>('light')

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'safelight') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSurface(saved)
      applySurface(saved)
    }
  }, [])

  const toggle = () => {
    const next: Surface = surface === 'safelight' ? 'light' : 'safelight'
    setSurface(next)
    applySurface(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      /* storage unavailable */
    }
  }

  const safelight = surface === 'safelight'

  return (
    <button
      type="button"
      className={styles.themeBtn}
      aria-pressed={safelight}
      aria-label={
        safelight ? 'Switch to the vellum surface' : 'Switch to the safelight'
      }
      onClick={toggle}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        aria-hidden="true"
      >
        <rect x="3.5" y="3.5" width="17" height="17" />
        <path d="M3.5 20.5 20.5 3.5" strokeDasharray="2 2" />
      </svg>
      <span>{safelight ? 'Safelight' : 'Vellum'}</span>
    </button>
  )
}
