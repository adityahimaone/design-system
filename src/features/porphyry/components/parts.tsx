'use client'

import { useId, useState } from 'react'

import styles from '../porphyry.module.css'

/**
 * The form kit. Native controls wherever the platform already owns the
 * behaviour; the two custom surfaces (the switch and the radio well) keep the
 * native input underneath, so the keyboard and the accessibility tree survive.
 */
export function PorphyryParts() {
  const [on, setOn] = useState(true)
  const [saved, setSaved] = useState(false)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  return (
    <div className={styles.partsGrid}>
      <div className={styles.partPlate}>
        <p className={styles.plateLabel}>Actions</p>
        <div className={styles.buttonRow}>
          <button type="button" className={styles.btn}>
            Enter the stage
          </button>
          <button type="button" className={`${styles.btn} ${styles.btnQuiet}`}>
            View the cast
          </button>
          <button type="button" className={styles.btn} disabled>
            Locked
          </button>
        </div>
        <p className={styles.note}>
          Gold is the action. The quiet button keeps the same square edge and
          earns its emphasis from the rule, not a second colour.
        </p>
      </div>

      <form
        className={styles.partPlate}
        onSubmit={(e) => {
          e.preventDefault()
          setSaved(true)
        }}
        noValidate
      >
        <p className={styles.plateLabel}>Field</p>
        <div className={styles.field}>
          <label htmlFor={`${uid}-title`}>Plate title</label>
          <input
            id={`${uid}-title`}
            name="title"
            placeholder="Study in porphyry"
            aria-describedby={`${uid}-hint`}
          />
          <span id={`${uid}-hint`} className={styles.hint}>
            The label sits outside the slab, never inside it.
          </span>
        </div>

        <div className={`${styles.field} ${styles.fieldError}`}>
          <label htmlFor={`${uid}-path`}>Canonical path</label>
          <input
            id={`${uid}-path`}
            name="path"
            defaultValue="/design-system"
            aria-invalid="true"
            aria-describedby={`${uid}-error`}
          />
          <span id={`${uid}-error`} className={styles.error}>
            A path, not a URL. The scheme is set by the host.
          </span>
        </div>

        <div className={styles.field}>
          <label htmlFor={`${uid}-surface`}>Surface</label>
          <select id={`${uid}-surface`} name="surface" defaultValue="stage">
            <option value="stage">Stage — the dark ground</option>
            <option value="vellum">Vellum — the proof surface</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor={`${uid}-locked`}>Inscribed note</label>
          <input
            id={`${uid}-locked`}
            name="note"
            defaultValue="Locked by the plate"
            disabled
          />
        </div>

        <button type="submit" className={styles.btn}>
          {saved ? 'Plate saved' : 'Save the plate'}
        </button>
        <p className={styles.hint} aria-live="polite">
          {saved ? 'Saved. The cast did not move.' : ''}
        </p>
      </form>

      <div className={styles.partPlate}>
        <p className={styles.plateLabel}>Switch & choice</p>
        <label className={styles.switchRow} htmlFor={`${uid}-light`}>
          <input
            id={`${uid}-light`}
            type="checkbox"
            role="switch"
            checked={on}
            onChange={(e) => setOn(e.target.checked)}
          />
          <span className={styles.switchTrack} aria-hidden="true">
            <span />
          </span>
          <span className={styles.switchText}>
            {on ? 'Stage light on' : 'Stage light off'}
          </span>
        </label>

        <fieldset className={styles.radios}>
          <legend>Ground</legend>
          <label>
            <input type="radio" name="po-ground" defaultChecked /> Stone
          </label>
          <label>
            <input type="radio" name="po-ground" /> Vellum
          </label>
        </fieldset>

        <p className={styles.note}>
          State is never colour alone: the switch says on/off, the radios keep
          the native dot, and the error field carries text.
        </p>
      </div>

      <div className={styles.partPlate}>
        <p className={styles.plateLabel}>Chip & card</p>
        <div className={styles.chipRow}>
          <span className={styles.chip}>Porphyry</span>
          <span className={styles.chip}>Marble</span>
          <span className={`${styles.chip} ${styles.chipQuiet}`}>
            Gold leaf
          </span>
        </div>
        <div className={styles.miniCard}>
          <p className={styles.miniCardMeta}>Pl. X · 1.0000</p>
          <h4>A grounded plate</h4>
          <p>
            One rule, one label, no shadow. The card is a surface on the stage,
            not a floating panel.
          </p>
        </div>
      </div>
    </div>
  )
}
