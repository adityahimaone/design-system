'use client'

import { useEffect, useState } from 'react'

import { NAV } from '../strand-data'
import styles from '../strand.module.css'

/**
 * The rail marks the section you are reading. It measures the real viewport
 * position of each section rather than `offsetTop`, because the sections sit
 * inside a shell with a sticky topbar above them.
 */
export function StrandContents() {
  const [active, setActive] = useState<string>(NAV[0].id)

  useEffect(() => {
    const ids = NAV.map((item) => item.id)
    let frame = 0

    const measure = () => {
      frame = 0
      const line = 150
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
