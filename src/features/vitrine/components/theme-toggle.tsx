'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'

import styles from '../vitrine.module.css'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

/**
 * A two-state theme control with a stable server render. The page must be able
 * to show both themes in review, so the case owns a local toggle rather than
 * waiting for the site chrome.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <div
      className={cn(styles.themeToggle, className)}
      role="group"
      aria-label="Colour theme"
    >
      <button
        type="button"
        className={cn(styles.themeButton, !isDark && styles.themeButtonOn)}
        aria-pressed={!isDark}
        onClick={() => setTheme('light')}
      >
        Light
      </button>
      <button
        type="button"
        className={cn(styles.themeButton, isDark && styles.themeButtonOn)}
        aria-pressed={isDark}
        onClick={() => setTheme('dark')}
      >
        Dark
      </button>
    </div>
  )
}
