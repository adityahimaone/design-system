'use client'

import { useEffect, useState } from 'react'

import styles from '../huginn.module.css'

type Surface = 'day' | 'night'

const KEY = 'huginn-surface'

function applySurface(surface: Surface) {
  const root = document.documentElement
  if (surface === 'night') {
    root.dataset.huginn = 'night'
  } else {
    delete root.dataset.huginn
  }
}

/**
 * Night is a surface, not a theme: the field keeps its vermilion and the paper
 * inverts, the way a print reads under a lamp. The choice is written to
 * <html data-huginn> so the token layer can swap without a re-render.
 */
export function HuginnThemeToggle() {
  const [surface, setSurface] = useState<Surface>('day')

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'day' || saved === 'night') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSurface(saved)
      applySurface(saved)
    }
  }, [])

  const toggle = () => {
    const next: Surface = surface === 'night' ? 'day' : 'night'
    setSurface(next)
    applySurface(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      /* storage unavailable */
    }
  }

  const night = surface === 'night'

  return (
    <button
      type="button"
      className={styles.themeBtn}
      aria-pressed={night}
      aria-label={
        night ? 'Switch to the chalk surface' : 'Switch to the night surface'
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
        <rect x="4" y="4" width="7" height="7" />
        <rect x="13" y="4" width="7" height="7" />
        <rect x="4" y="13" width="7" height="7" />
        <rect
          x="13"
          y="13"
          width="7"
          height="7"
          fill="currentColor"
          stroke="none"
        />
      </svg>
      <span>{night ? 'Night' : 'Day'}</span>
    </button>
  )
}
