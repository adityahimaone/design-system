'use client'

import { useEffect } from 'react'

import { setInterfaceVisibility } from '@/hooks/use-hide-interface'

/**
 * The case owns its chrome. Retire the site dock and the floating music player
 * for the duration of the route, the same way every other case does, so the
 * dashboard is not competing with a second navigation.
 */
export function CaseChrome() {
  useEffect(() => {
    setInterfaceVisibility('hidden')
    return () => setInterfaceVisibility('visible')
  }, [])

  return null
}
