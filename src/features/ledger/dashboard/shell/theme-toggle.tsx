'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/features/ledger/ui/button'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

/**
 * The site's ThemeProvider already owns the `.dark` class, so the case does not
 * need a second theme store — it needs a control that waits for the client
 * before it claims to know which theme is on. `useSyncExternalStore` gives the
 * server render a stable "light" answer without a mounted-state effect.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <Button
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="size-8 text-muted-foreground transition-colors duration-200 hover:text-foreground"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      size="icon"
      type="button"
      variant="ghost"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
