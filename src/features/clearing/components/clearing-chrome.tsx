'use client'

import { useEffect } from 'react'

import { setInterfaceVisibility } from '@/hooks/use-hide-interface'

/**
 * The case page owns the whole viewport: it hides the host dock, sets the
 * anchor offset the specimen expects, and clears the theme attribute on the
 * way out so the next route is not left in a night surface.
 */
export function ClearingChrome() {
  useEffect(() => {
    setInterfaceVisibility('hidden')
    document.body.dataset.clCase = 'true'

    const root = document.documentElement
    const previousPadding = root.style.scrollPaddingTop
    const previousBehavior = root.style.scrollBehavior
    root.style.scrollPaddingTop = '88px'
    root.style.scrollBehavior = 'smooth'

    return () => {
      setInterfaceVisibility('visible')
      delete document.body.dataset.clCase
      root.style.scrollPaddingTop = previousPadding
      root.style.scrollBehavior = previousBehavior
      delete root.dataset.clearing
    }
  }, [])

  return null
}
