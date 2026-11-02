'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from '../clearing.module.css'

type Surface = 'light' | 'night'

const KEY = 'clearing-surface'

function applySurface(surface: Surface) {
  const root = document.documentElement
  if (surface === 'night') {
    root.dataset.clearing = 'night'
  } else {
    delete root.dataset.clearing
  }
}

export function ClearingThemeToggle({ className }: { className?: string }) {
  const [surface, setSurface] = useState<Surface>('light')

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'night') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSurface(saved)
      applySurface(saved)
    }
  }, [])

  const toggle = () => {
    const next: Surface = surface === 'night' ? 'light' : 'night'
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
      className={cn(styles.themeBtn, className)}
      aria-pressed={night}
      aria-label={
        night ? 'Switch to the cream surface' : 'Switch to the night surface'
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
        <circle cx="12" cy="12" r="4.2" />
        <path
          d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"
          strokeLinecap="round"
        />
      </svg>
      <span>{night ? 'Night' : 'Light'}</span>
    </button>
  )
}
