'use client'

import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * True below the `md` breakpoint. Starts `false` on the server and on the first
 * client render, so the rail never flashes a mobile sheet before hydration.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    query.addEventListener('change', onChange)
    onChange()
    return () => query.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
