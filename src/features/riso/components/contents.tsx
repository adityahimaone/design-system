'use client'

import { useEffect, useState } from 'react'

import { NAV } from '../riso-data'
import styles from '../riso.module.css'

/**
 * The contents rail marks the section you are reading by measuring real
 * viewport position, not `offsetTop`: the sections sit inside a shell under a
 * sticky topbar, so the two disagree by exactly the topbar height.
 */
export function RisoContents() {
  const [active, setActive] = useState<string>(NAV[0].id)

  useEffect(() => {
    const ids = NAV.map((item) => item.id)
    let frame = 0

    const measure = () => {
      frame = 0
      const line = 140
      let current = ids[0]

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= line) current = id
      }

      setActive(current)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <nav className={styles.contents} aria-label="Contents">
      <p>Contents</p>
      <ol>
        {NAV.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
            >
              <b>{String(index + 1).padStart(2, '0')}</b>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
