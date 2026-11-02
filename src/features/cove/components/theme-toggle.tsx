'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from '../cove.module.css'

type Ramp = 'night' | 'day'

const KEY = 'cove-ramp'

/**
 * Cove is night-first: the base ramp is the abyss and daylight is the override.
 * The switch writes `data-cove` on `<html>` and nothing else, so the case can
 * never repaint the host site — the token layer is scoped to `.cv-scope` and
 * only the selector for the override is global.
 */
function applyRamp(ramp: Ramp) {
  document.documentElement.dataset.cove = ramp
}

export function CoveThemeToggle({ className }: { className?: string }) {
  const [ramp, setRamp] = useState<Ramp>('night')

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'day' || saved === 'night') {
      // The server render is the night ramp, so the stored choice has to be
      // applied after hydration rather than during it.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRamp(saved)
      applyRamp(saved)
    }
  }, [])

  const choose = (next: Ramp) => {
    setRamp(next)
    applyRamp(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      /* storage can be unavailable */
    }
  }

  return (
    <div className={cn(styles.themeToggle, className)} role="group" aria-label="Ramp">
      <button
        type="button"
        className={cn(styles.themeButton, ramp === 'night' && styles.themeButtonOn)}
        aria-pressed={ramp === 'night'}
        aria-label="Night ramp — the default"
        onClick={() => choose('night')}
      >
        <span className={styles.themeDot} aria-hidden />
        Night
      </button>
      <button
        type="button"
        className={cn(styles.themeButton, ramp === 'day' && styles.themeButtonOn)}
        aria-pressed={ramp === 'day'}
        aria-label="Day ramp — the daylight override"
        onClick={() => choose('day')}
      >
        <span className={styles.themeDot} aria-hidden />
        Day
      </button>
    </div>
  )
}
