'use client'

import { useEffect } from 'react'

import { setInterfaceVisibility } from '@/hooks/use-hide-interface'

export function StrandChrome() {
  useEffect(() => {
    setInterfaceVisibility('hidden')
    document.body.dataset.stCase = 'true'
    return () => {
      setInterfaceVisibility('visible')
      delete document.body.dataset.stCase
    }
  }, [])

  return null
}
