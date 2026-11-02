'use client'

import { useId, useState } from 'react'

import styles from '../cove.module.css'

/**
 * The parts are shown working, not as a gallery of disabled samples: the range
 * control changes the caption, the field accepts a value, and the primary
 * action reports what it would have done. Nothing here writes anywhere — this
 * is a specimen, and the specimen says so.
 */
export function PartsDemo() {
  const fieldId = useId()
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h')
  const [station, setStation] = useState('Cove 04 · north arm')
  const [committed, setCommitted] = useState<string | null>(null)

  const ranges = [
    { id: '24h', label: '24 h', note: '24 points, one per hour.' },
    { id: '7d', label: '7 d', note: '168 points, daily mean shown.' },
    { id: '30d', label: '30 d', note: '720 points, weekly mean shown.' },
  ] as const

  const current = ranges.find((r) => r.id === range) ?? ranges[0]

  return (
    <div className={styles.partsGrid}>
      <div className={styles.partCard}>
        <h3>Actions</h3>
        <div className={styles.partRow}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setCommitted(`Logged ${current.label} at ${station}`)}
          >
            Log this reading
          </button>
          <button type="button" className={styles.btnSecondary}>
            Export
          </button>
          <button type="button" className={styles.btnGhost}>
            Discard
          </button>
        </div>
        <p className={styles.note} role="status">
          {committed ??
            'One primary action per view. Export and Discard are secondary by fill, not by colour.'}
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Fields</h3>
        <div className={styles.field}>
          <label htmlFor={fieldId}>Station</label>
          <input
            id={fieldId}
            value={station}
            onChange={(event) => setStation(event.target.value)}
            placeholder="Station id"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <p className={styles.note}>
          The field ground is the panel, not a lighter box. Only the edge changes
          on focus.
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Range</h3>
        <div className={styles.segmented} role="group" aria-label="Range">
          {ranges.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={range === item.id}
              onClick={() => setRange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={styles.note}>{current.note}</p>
      </div>

      <div className={styles.partCard}>
        <h3>State</h3>
        <div className={styles.tags}>
          <span className={`${styles.tag} ${styles.tagLive}`}>live</span>
          <span className={styles.tag}>slack</span>
          <span className={styles.tag}>threshold</span>
        </div>
        <p className={styles.note}>
          A state is a dot and a word, never a row colour. The tag keeps the same
          weight in all three states.
        </p>
      </div>
    </div>
  )
}
