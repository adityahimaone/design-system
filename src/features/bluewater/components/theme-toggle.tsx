'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from '../bluewater.module.css'

type Ramp = 'deep' | 'fog'

const KEY = 'bluewater-ramp'

/**
 * Deep is the default ramp; fog is the override. The switch writes
 * `data-bluewater` on `<html>` and nothing else, so the case can never repaint
 * the host site — the token layer is scoped to `.bw-scope` and the only global
 * selector is the one that re-points it.
 */
function applyRamp(ramp: Ramp) {
  if (ramp === 'fog') document.documentElement.dataset.bluewater = 'light'
  else delete document.documentElement.dataset.bluewater
}

export function BwRampToggle({ className }: { className?: string }) {
  const [ramp, setRamp] = useState<Ramp>('deep')

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'fog' || saved === 'deep') {
      // The server render is the deep ramp, so a stored choice has to be
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
    <div
      className={cn(styles.rampToggle, className)}
      role="group"
      aria-label="Ramp"
    >
      <button
        type="button"
        className={cn(
          styles.rampButton,
          ramp === 'deep' && styles.rampButtonOn,
        )}
        aria-pressed={ramp === 'deep'}
        onClick={() => choose('deep')}
      >
        Deep
      </button>
      <button
        type="button"
        className={cn(styles.rampButton, ramp === 'fog' && styles.rampButtonOn)}
        aria-pressed={ramp === 'fog'}
        onClick={() => choose('fog')}
      >
        Fog
      </button>
    </div>
  )
}
