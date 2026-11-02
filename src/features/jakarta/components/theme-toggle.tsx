'use client'

import { useEffect, useState } from 'react'

import styles from '../jakarta.module.css'

type Surface = 'day' | 'night'

const KEY = 'jakarta-surface'

function apply(surface: Surface) {
  const root = document.documentElement
  if (surface === 'night') {
    root.dataset.jk = 'night'
  } else {
    delete root.dataset.jk
  }
}

/**
 * Night is a scope, not a second palette: the primitives (the nine places) are
 * untouched and only the semantic layer swaps. Written to `<html data-jk>` so the
 * token layer can swap without a React re-render — the same mechanism the
 * specimen uses.
 */
export function JakartaThemeToggle() {
  const [surface, setSurface] = useState<Surface>('day')

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'day' || saved === 'night') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSurface(saved)
      apply(saved)
    }
    return () => {
      delete document.documentElement.dataset.jk
    }
  }, [])

  const toggle = () => {
    const next: Surface = surface === 'night' ? 'day' : 'night'
    setSurface(next)
    apply(next)
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
      aria-label={night ? 'Switch to the day scope' : 'Switch to the night scope'}
      onClick={toggle}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </svg>
      <span>{night ? 'Night' : 'Day'}</span>
    </button>
  )
}
