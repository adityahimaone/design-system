'use client'

import * as React from 'react'

import styles from '../riso.module.css'

/**
 * The six primitives, live. The pin is the only switch in the system: it is a
 * diamond that fills when pressed and says its state in words, because a shape
 * change on its own is not an accessible state.
 */
export function RisoParts() {
  const [pinned, setPinned] = React.useState(false)
  const [pass, setPass] = React.useState<'a' | 'b'>('a')

  return (
    <div className={styles.partsGrid}>
      <div className={styles.partCard}>
        <h3>Button</h3>
        <div className={styles.btnRow}>
          <button type="button" className={styles.btn}>
            Order a run
          </button>
          <button type="button" className={`${styles.btn} ${styles.btnSecond}`}>
            Shop
          </button>
        </div>
        <div className={styles.btnRow}>
          <button type="button" className={`${styles.btn} ${styles.btnGhost}`}>
            Spec sheet
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDisabled}`}
            disabled
          >
            Sold out
          </button>
        </div>
        <p>
          Primary is carbon. The second drum is a field, not a second primary —
          two loud buttons cancel each other out.
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Field</h3>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="rs-email">
            Email for the next run
          </label>
          <input
            id="rs-email"
            className={styles.field}
            type="email"
            placeholder="your@email"
            autoComplete="email"
          />
          <span className={styles.fieldNote}>
            One note every other Friday. No forwarding.
          </span>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="rs-file">
            Artwork
          </label>
          <input
            id="rs-file"
            className={`${styles.field} ${styles.fieldInvalid}`}
            type="text"
            defaultValue="poster-final-FINAL.pdf"
            aria-invalid="true"
            aria-describedby="rs-file-error"
          />
          <span className={styles.fieldError} id="rs-file-error">
            84MB. This press takes 40MB — halve the resolution and send it
            again.
          </span>
        </div>
        <p>
          Cut sheet: one 1px perimeter, no radius, label above, note below. The
          error keeps the sentence a person can act on.
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Pin</h3>
        <button
          type="button"
          className={styles.pinSwitch}
          aria-pressed={pinned}
          onClick={() => setPinned((v) => !v)}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path
              d="M8 1.5 14.5 8 8 14.5 1.5 8Z"
              fill={pinned ? 'var(--rs-pin)' : 'none'}
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
          <span>{pinned ? 'Pinned to the board' : 'Pin this sheet'}</span>
          <small>{pinned ? 'on' : 'off'}</small>
        </button>
        <p>
          The only switch. Pressed fills the diamond and changes the words;
          colour is never the only signal.
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Sheet</h3>
        <div className={styles.sheetCard}>
          <b>Run 0412 · broadside</b>
          <span>
            Two drums on 270gsm vellum, torn to size. Forty sheets, numbered.
          </span>
        </div>
        <p>
          A card gets one torn edge and nothing else — the tear is the ornament.
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Chip</h3>
        <div className={styles.chips}>
          <span className={styles.chip}>270gsm</span>
          <span className={styles.chip}>A3</span>
          <span className={`${styles.chip} ${styles.chipHot}`}>run 0412</span>
          <span className={styles.chip}>2 drums</span>
        </div>
        <p>
          Mono caps, one rule, no fill. A chip is a fact about the sheet, never
          a status badge.
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Tabs</h3>
        <div className={styles.tabs} role="tablist" aria-label="Pass">
          <button
            type="button"
            role="tab"
            aria-selected={pass === 'a'}
            onClick={() => setPass('a')}
          >
            Pass A
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={pass === 'b'}
            onClick={() => setPass('b')}
          >
            Pass B
          </button>
        </div>
        <p className={styles.tabsBody} role="tabpanel">
          {pass === 'a'
            ? 'Pass A: fluorescent orange, laid first. It carries the field and the loud half of the mark.'
            : 'Pass B: federal blue, laid second and 4,3 out of register. It carries the tear and the ghost.'}
        </p>
      </div>
    </div>
  )
}
