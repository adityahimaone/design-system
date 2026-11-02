'use client'

import { useEffect, useState } from 'react'

import styles from '../riso.module.css'

/**
 * The footer's clock, brought up to the masthead.
 *
 * It renders `--:--` on the server and on the first client paint, then fills in,
 * so the markup the server sent and the markup React hydrates are identical.
 */
export function RisoClock({
  timeZone = 'Europe/Berlin',
  label = 'BER',
}: {
  timeZone?: string
  label?: string
}) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone,
          }).format(new Date()),
        )
      } catch {
        setTime('')
      }
    }

    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [timeZone])

  return (
    <span className={styles.chromeTime}>
      <b>{label}</b> {time || '--:--'}
    </span>
  )
}
