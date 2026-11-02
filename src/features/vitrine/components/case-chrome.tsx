'use client'

import { useEffect } from 'react'

import { setInterfaceVisibility } from '@/hooks/use-hide-interface'

/**
 * The case owns its own header and footer. Retire the site dock and the
 * floating music widget for the duration of the route, the same way the
 * Sunnyside specimen does, so the material study is not competing with chrome.
 */
export function CaseChrome() {
  useEffect(() => {
    setInterfaceVisibility('hidden')
    document.body.dataset.vtCase = 'true'
    return () => {
      setInterfaceVisibility('visible')
      delete document.body.dataset.vtCase
    }
  }, [])

  return null
}
