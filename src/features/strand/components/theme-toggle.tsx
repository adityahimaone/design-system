'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from '../strand.module.css'

type Surface = 'dune' | 'night'

const KEY = 'strand-surface'

function applySurface(surface: Surface) {
  const root = document.documentElement
  root.dataset.strand = surface
  root.dataset.theme = surface === 'night' ? 'dark' : 'light'
}

/**
 * One control, two surfaces. The attribute lives on <html> because the pane's
 * backdrop-filter samples the page ground, and the ground is painted by the
 * root — a toggle scoped to the case div would leave the wash light.
 */
export function StrandThemeToggle({ className }: { className?: string }) {
  const [surface, setSurface] = useState<Surface>('dune')

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'dune' || saved === 'night') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSurface(saved)
      applySurface(saved)
    }
  }, [])

  const night = surface === 'night'

  const toggle = () => {
    const next: Surface = night ? 'dune' : 'night'
    setSurface(next)
    applySurface(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <button
      type="button"
      className={cn(styles.themeBtn, className)}
      aria-pressed={night}
      aria-label={night ? 'Switch to the dune surface' : 'Switch to the night surface'}
      onClick={toggle}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        aria-hidden="true"
      >
        {night ? (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
          </>
        )}
      </svg>
      <span>{night ? 'Night' : 'Dune'}</span>
    </button>
  )
}
