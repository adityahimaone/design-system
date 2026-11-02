'use client'

import * as React from 'react'

import styles from '../hachure.module.css'

type Theme = 'light' | 'dark'

/**
 * Ground or night. Not a preference — the same range with the sun gone. The
 * page root carries the state so the token layer, not React, decides what each
 * role resolves to.
 */
export function HachureControls() {
  const [theme, setTheme] = React.useState<Theme>('light')

  React.useEffect(() => {
    const root = document.querySelector('[data-hachure-root]')
    if (!root) return
    root.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div
      className={styles.themeSwitch}
      role="group"
      aria-label="Ground or night"
    >
      <button
        type="button"
        aria-pressed={theme === 'light'}
        onClick={() => setTheme('light')}
        title="Survey paper"
      >
        <span
          className={styles.themeChip}
          data-theme-chip="ground"
          aria-hidden="true"
        />
        Ground
      </button>
      <button
        type="button"
        aria-pressed={theme === 'dark'}
        onClick={() => setTheme('dark')}
        title="Range at night"
      >
        <span
          className={styles.themeChip}
          data-theme-chip="night"
          aria-hidden="true"
        />
        Night
      </button>
    </div>
  )
}
