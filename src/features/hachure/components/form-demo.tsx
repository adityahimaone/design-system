'use client'

import * as React from 'react'

import styles from '../hachure.module.css'

type Field = 'station' | 'email' | 'height' | 'notes'
type Errors = Partial<Record<Field, string>>

const DRAFT_KEY = 'hachure-report-draft'

type Draft = {
  station: string
  email: string
  datum: string
  kind: string
  height: string
  notes: string
  quoted: boolean
}

const DATUMS = ['OSGB36', 'ETRS89', 'WGS 84', 'NAD83']
const KINDS = [
  { value: 'spot', label: 'Spot height' },
  { value: 'ridge', label: 'Ridge profile' },
  { value: 'weather', label: 'Weather' },
]

/**
 * The form kit, in the survey's own words: file a site report.
 *
 * Native elements only — a select, a fieldset of radios, a number field. A form
 * that cannot be finished with a keyboard and a screen reader is not a form,
 * and every error here names the recovery rather than the rule.
 */
export function HachureForm() {
  const [station, setStation] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [datum, setDatum] = React.useState(DATUMS[0])
  const [kind, setKind] = React.useState('spot')
  const [height, setHeight] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [quoted, setQuoted] = React.useState(false)
  const [errors, setErrors] = React.useState<Errors>({})
  const [filed, setFiled] = React.useState(false)
  const [draftSaved, setDraftSaved] = React.useState(false)

  const summary = React.useRef<HTMLDivElement>(null)

  // The draft is real, not a label on a dead button: it is written to this
  // browser and restored on the next visit.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw) as Partial<Draft>
      // A one-time, hydration-safe read from an external store: the server has
      // no draft, so this cannot run during render without a mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (draft.station) setStation(draft.station)
      if (draft.email) setEmail(draft.email)
      if (draft.datum && DATUMS.includes(draft.datum)) setDatum(draft.datum)
      if (draft.kind) setKind(draft.kind)
      if (draft.height) setHeight(draft.height)
      if (draft.notes) setNotes(draft.notes)
      if (typeof draft.quoted === 'boolean') setQuoted(draft.quoted)
    } catch {
      // A blocked storage API is not an error the reader needs to act on.
    }
  }, [])

  React.useEffect(() => {
    if (!draftSaved) return
    const timer = window.setTimeout(() => setDraftSaved(false), 4000)
    return () => window.clearTimeout(timer)
  }, [draftSaved])

  const saveDraft = () => {
    try {
      const draft: Draft = {
        station,
        email,
        datum,
        kind,
        height,
        notes,
        quoted,
      }
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      setDraftSaved(true)
    } catch {
      setDraftSaved(false)
    }
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const next: Errors = {}

    if (station.trim().length < 2)
      next.station = 'Name the station so the report can be found again.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter an address we can send the correction to.'
    }
    const metres = Number(height)
    if (!height.trim() || !Number.isFinite(metres)) {
      next.height = 'Enter the spot height in metres, as a number.'
    } else if (metres < 0 || metres > 8849) {
      next.height = 'Sea level to the summit: 0 to 8,849 m.'
    }
    if (notes.trim() && notes.trim().length < 12) {
      next.notes = 'Twelve characters or more, or leave the note empty.'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) {
      setFiled(false)
      requestAnimationFrame(() => summary.current?.focus())
      return
    }
    try {
      window.localStorage.removeItem(DRAFT_KEY)
    } catch {
      // Nothing to clear if storage is blocked.
    }
    setFiled(true)
  }

  const error = (field: Field) => errors[field]

  if (filed) {
    return (
      <div className={styles.formDone} role="status">
        <p className={styles.label}>
          Report{' '}
          {station
            .replace(/[^a-z]/gi, '')
            .slice(0, 3)
            .toUpperCase()}
          -{String(Number(height) || 0).padStart(4, '0')} / filed
        </p>
        <h4>Filed against {datum}.</h4>
        <p>
          The report goes into the next quadrangle revision. If the height is
          more than a metre out, a correction comes back to {email} before it
          prints.
        </p>
        <button
          type="button"
          className={styles.quietButton}
          onClick={() => {
            setFiled(false)
            setStation('')
            setEmail('')
            setHeight('')
            setNotes('')
            setQuoted(false)
          }}
        >
          File another
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {Object.keys(errors).length > 0 && (
        <div
          className={styles.formError}
          role="alert"
          tabIndex={-1}
          ref={summary}
        >
          <strong>
            {Object.keys(errors).length === 1
              ? 'One thing to fix before this is filed.'
              : `${Object.keys(errors).length} things to fix before this is filed.`}
          </strong>
          <ul>
            {(Object.keys(errors) as Field[]).map((field) => (
              <li key={field}>
                <a href={`#hx-${field}`}>{errors[field]}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor="hx-station">Station name</label>
          <input
            id="hx-station"
            name="station"
            type="text"
            autoComplete="organization"
            value={station}
            onChange={(event) => setStation(event.target.value)}
            aria-invalid={Boolean(error('station'))}
            aria-describedby={error('station') ? 'hx-station-error' : undefined}
            placeholder="Piz Badile, south ridge"
          />
          {error('station') && (
            <p id="hx-station-error" className={styles.fieldError}>
              {error('station')}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="hx-email">Correction address</label>
          <input
            id="hx-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(error('email'))}
            aria-describedby={error('email') ? 'hx-email-error' : undefined}
            placeholder="field@survey.example"
          />
          {error('email') && (
            <p id="hx-email-error" className={styles.fieldError}>
              {error('email')}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="hx-datum">Datum</label>
          <select
            id="hx-datum"
            name="datum"
            value={datum}
            onChange={(event) => setDatum(event.target.value)}
          >
            {DATUMS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="hx-height">Spot height (m)</label>
          <input
            id="hx-height"
            name="height"
            type="number"
            inputMode="numeric"
            min={0}
            max={8849}
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            aria-invalid={Boolean(error('height'))}
            aria-describedby={error('height') ? 'hx-height-error' : undefined}
            placeholder="2108"
          />
          {error('height') && (
            <p id="hx-height-error" className={styles.fieldError}>
              {error('height')}
            </p>
          )}
        </div>
      </div>

      <fieldset className={styles.radioSet}>
        <legend>What are you reporting?</legend>
        <div className={styles.radios}>
          {KINDS.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="kind"
                value={option.value}
                checked={kind === option.value}
                onChange={() => setKind(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="hx-notes">
          Field note <span className={styles.optional}>optional</span>
        </label>
        <textarea
          id="hx-notes"
          name="notes"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          aria-invalid={Boolean(error('notes'))}
          aria-describedby={error('notes') ? 'hx-notes-error' : undefined}
          placeholder="Cornice on the north face, wind from the west."
        />
        {error('notes') && (
          <p id="hx-notes-error" className={styles.fieldError}>
            {error('notes')}
          </p>
        )}
      </div>

      <label className={styles.check}>
        <input
          type="checkbox"
          checked={quoted}
          onChange={(event) => setQuoted(event.target.checked)}
        />
        You may quote this report in the field log
      </label>

      <div className={styles.formActions}>
        <button type="submit" className={styles.button}>
          File the report
        </button>
        <button
          type="button"
          className={styles.quietButton}
          onClick={saveDraft}
        >
          Save as draft
        </button>
      </div>

      {draftSaved ? (
        <p className={styles.formNote} role="status">
          Draft saved on this device.
        </p>
      ) : null}

      <p className={styles.formNote}>
        Drafts stay in this browser. A filed report is an entry in the log, not
        a message.
      </p>
    </form>
  )
}
