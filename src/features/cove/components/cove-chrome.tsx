'use client'

import { useEffect } from 'react'

import { setInterfaceVisibility } from '@/hooks/use-hide-interface'

/**
 * The case owns its own header and footer. Retire the site dock and the
 * floating music widget for the duration of the route.
 */
export function CoveChrome() {
  useEffect(() => {
    setInterfaceVisibility('hidden')
    document.body.dataset.cvCase = 'true'
    return () => {
      setInterfaceVisibility('visible')
      delete document.body.dataset.cvCase
    }
  }, [])

  return null
}
