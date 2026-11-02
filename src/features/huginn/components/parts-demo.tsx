'use client'

import * as React from 'react'

import styles from '../huginn.module.css'

/**
 * The six primitives, live. The switch is two cells: the second one fills when
 * pressed, and the label changes with it, because a filled square on its own is
 * not an accessible state.
 */
export function HuginnParts() {
  const [printed, setPrinted] = React.useState(false)
  const [tab, setTab] = React.useState<'grid' | 'field'>('grid')

  return (
    <div className={styles.partsGrid}>
      <div className={styles.partCard}>
        <h3>Button</h3>
        <div className={styles.btnRow}>
          <button type="button" className={styles.btn}>
            Commission a print
          </button>
          <button type="button" className={`${styles.btn} ${styles.btnField}`}>
            Buy the sheet
          </button>
        </div>
        <div className={styles.btnRow}>
          <button type="button" className={`${styles.btn} ${styles.btnGhost}`}>
            Colophon
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
          Ink on chalk, or bone on the field. Two weights, never two loud
          buttons.
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Slip</h3>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="hg-email">
            Email for the next print
          </label>
          <input
            id="hg-email"
            className={styles.field}
            type="email"
            placeholder="your@email"
            autoComplete="email"
          />
          <span className={styles.fieldNote}>
            One note per edition. No forwarding.
          </span>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="hg-file">
            Artwork
          </label>
          <input
            id="hg-file"
            className={`${styles.field} ${styles.fieldInvalid}`}
            type="text"
            defaultValue="asgardsreien-final.tif"
            aria-invalid="true"
            aria-describedby="hg-file-error"
          />
          <span className={styles.fieldError} id="hg-file-error">
            84MB. This press takes 40MB — halve the resolution and send it
            again.
          </span>
        </div>
        <p>
          A field printed on a slip: 1px perimeter, label above, note below, no
          radius.
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Cell</h3>
        <button
          type="button"
          className={styles.cellSwitch}
          aria-pressed={printed}
          onClick={() => setPrinted((v) => !v)}
        >
          <svg viewBox="0 0 26 12" width="26" height="12" aria-hidden="true">
            <rect x="0" y="0" width="12" height="12" fill="currentColor" />
            <rect
              x="14"
              y="0"
              width="12"
              height="12"
              fill={printed ? 'var(--hg-escape, #e2281b)' : 'none'}
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          <span>{printed ? 'Printed' : 'Print this plate'}</span>
          <small>{printed ? 'on' : 'off'}</small>
        </button>
        <p>
          The only switch: two cells, the second one fills, and the words change
          with it.
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Plate</h3>
        <div className={styles.plateCard}>
          <b>Åsgårdsreien · plate 03</b>
          <span>
            Sixteen cells across, twenty-two down. The painting is the source,
            the grid is the print.
          </span>
        </div>
        <p>
          A plate carries one cut cell in its corner — the only ornament a card
          gets.
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Index</h3>
        <div className={styles.chips}>
          <span className={styles.chip}>1872</span>
          <span className={styles.chip}>22 rows</span>
          <span className={`${styles.chip} ${styles.chipHot}`}>plate 03</span>
          <span className={styles.chip}>public domain</span>
        </div>
        <p>
          Mono caps, one rule, no fill. An index entry is a fact and its source,
          never a badge.
        </p>
      </div>

      <div className={styles.partCard}>
        <h3>Tabs</h3>
        <div className={styles.tabs} role="tablist" aria-label="Surface">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'grid'}
            onClick={() => setTab('grid')}
          >
            The grid
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'field'}
            onClick={() => setTab('field')}
          >
            The field
          </button>
        </div>
        <p className={styles.tabsBody} role="tabpanel">
          {tab === 'grid'
            ? 'The grid: fourteen-unit cells on a three-unit gap. It draws the painting, the name and the mark.'
            : 'The field: one vermilion plate per page. It carries the mark, and nothing smaller than 24px.'}
        </p>
      </div>
    </div>
  )
}
