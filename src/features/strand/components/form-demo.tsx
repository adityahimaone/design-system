'use client'

import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from '../strand.module.css'

type FieldErrors = Partial<Record<'name' | 'email' | 'height', string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const STATIONS = [
  { value: 'north-strand', label: 'North strand · marker 04' },
  { value: 'ebb-flat', label: 'Ebb flat · marker 11' },
  { value: 'old-groyne', label: 'Old groyne · marker 19' },
  { value: 'quiet-divider', label: 'Quiet divider · marker 27' },
]

export function FormDemo() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [station, setStation] = useState(STATIONS[0].value)
  const [height, setHeight] = useState('')
  const [message, setMessage] = useState('')
  const [reports, setReports] = useState(true)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const summaryRef = useRef<HTMLDivElement>(null)

  const clearError = (field: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!name.trim()) next.name = 'Add the observer’s name to the log.'
    if (!email.trim()) next.email = 'An email address is required.'
    else if (!EMAIL.test(email)) next.email = 'Use a valid address, like name@strand.space.'
    const value = Number(height)
    if (height.trim() === '') next.height = 'A height is required.'
    else if (Number.isNaN(value) || value < 0 || value > 4.2)
      next.height = 'Use a height between 0 and 4.2 m.'
    return next
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      summaryRef.current?.focus()
      return
    }
    setSubmitted(true)
  }

  return (
    <form className={cn(styles.formCard, styles.pane)} onSubmit={onSubmit} noValidate>
      {Object.keys(errors).length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-label="Form validation error summary"
          className={styles.errorSummary}
        >
          <div className={styles.errorTitle}>Check two fields</div>
          <ul className={styles.errorList}>
            {Object.entries(errors).map(([field, msg]) => (
              <li key={field}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {submitted ? (
        <div className={styles.successCard} role="status">
          <div className={styles.successTitle}>Reading saved</div>
          <p className={styles.successMsg}>
            {height} m at {STATIONS.find((s) => s.value === station)?.label}. Logged to
            the 29 October sheet for {name}.
          </p>
          <button
            type="button"
            className={cn(styles.btn, styles.btnSecondary)}
            onClick={() => {
              setSubmitted(false)
              setName('')
              setEmail('')
              setHeight('')
              setMessage('')
            }}
          >
            Log another
          </button>
        </div>
      ) : (
        <div className={styles.formFields}>
          <div className={styles.fieldRow}>
            <div className={styles.fieldCol}>
              <label className={styles.fieldLabel} htmlFor="st-name">
                <span>Observer</span>
                <span className={styles.fieldHint}>Required</span>
              </label>
              <input
                id="st-name"
                type="text"
                className={cn(styles.input, errors.name && styles.inputInvalid)}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  clearError('name')
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'st-name-error' : undefined}
                placeholder="Aditya Himawan"
                required
              />
              {errors.name && (
                <span id="st-name-error" className={styles.fieldError}>
                  {errors.name}
                </span>
              )}
            </div>

            <div className={styles.fieldCol}>
              <label className={styles.fieldLabel} htmlFor="st-email">
                <span>Email</span>
                <span className={styles.fieldHint}>Required</span>
              </label>
              <input
                id="st-email"
                type="email"
                className={cn(styles.input, errors.email && styles.inputInvalid)}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearError('email')
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'st-email-error' : undefined}
                placeholder="name@strand.space"
                required
              />
              {errors.email && (
                <span id="st-email-error" className={styles.fieldError}>
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldCol}>
              <label className={styles.fieldLabel} htmlFor="st-station">
                <span>Station</span>
              </label>
              <select
                id="st-station"
                className={styles.select}
                value={station}
                onChange={(e) => setStation(e.target.value)}
              >
                {STATIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldCol}>
              <label className={styles.fieldLabel} htmlFor="st-height">
                <span>Height (m)</span>
                <span className={styles.fieldHint}>0 – 4.2</span>
              </label>
              <input
                id="st-height"
                type="number"
                step="0.1"
                min="0"
                max="4.2"
                inputMode="decimal"
                className={cn(styles.input, errors.height && styles.inputInvalid)}
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value)
                  clearError('height')
                }}
                aria-invalid={!!errors.height}
                aria-describedby={errors.height ? 'st-height-error' : undefined}
                placeholder="1.8"
                required
              />
              {errors.height && (
                <span id="st-height-error" className={styles.fieldError}>
                  {errors.height}
                </span>
              )}
            </div>
          </div>

          <div className={styles.fieldCol}>
            <label className={styles.fieldLabel} htmlFor="st-msg">
              <span>Notes</span>
              <span className={styles.fieldHint}>Optional</span>
            </label>
            <textarea
              id="st-msg"
              className={styles.textarea}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Wind from the west, surface flat, no weed at the marker."
            />
          </div>

          <div className={styles.checkRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={reports}
                onChange={(e) => setReports(e.target.checked)}
              />
              <span>Send the monthly tide sheet</span>
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={cn(styles.btn, styles.btnPrimary)}>
              Save reading
            </button>
            <button
              type="button"
              className={cn(styles.btn, styles.btnSecondary)}
              onClick={() => {
                setName('')
                setEmail('')
                setHeight('')
                setMessage('')
                setErrors({})
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
