'use client'

import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from '../vitrine.module.css'

type FieldErrors = Partial<Record<'name' | 'email' | 'password', string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ROLES = [
  { value: 'design-engineer', label: 'Design engineer' },
  { value: 'product-designer', label: 'Product designer' },
  { value: 'frontend-engineer', label: 'Frontend engineer' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'other', label: 'Something else' },
]

const TEAMS = [
  { value: '1-5', label: '1–5', note: 'A studio' },
  { value: '6-20', label: '6–20', note: 'A product team' },
  { value: '21+', label: '21+', note: 'A platform group' },
]

export function FormDemo() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState(ROLES[0].value)
  const [team, setTeam] = useState(TEAMS[0].value)
  const [message, setMessage] = useState('')
  const [updates, setUpdates] = useState(true)
  const [notify, setNotify] = useState(false)
  const [intensity, setIntensity] = useState(64)
  const [reference, setReference] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const summaryRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const clearError = (field: keyof FieldErrors) => {
    setErrors((previous) => {
      if (!previous[field]) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!name.trim()) next.name = 'Add a name so the case has a file.'
    if (!email.trim()) next.email = 'Add an email address.'
    else if (!EMAIL.test(email)) next.email = 'Use a complete email address.'
    if (password.length < 8) next.password = 'Use at least 8 characters.'
    return next
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    setSubmitted(true)
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus())
    }
  }

  const handleReset = () => {
    setName('')
    setEmail('')
    setPassword('')
    setShowPassword(false)
    setRole(ROLES[0].value)
    setTeam(TEAMS[0].value)
    setMessage('')
    setUpdates(true)
    setNotify(false)
    setIntensity(64)
    setReference(null)
    setErrors({})
    setSubmitted(false)
    nameRef.current?.focus()
  }

  const errorCount = Object.keys(errors).length

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {submitted && errorCount > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className={styles.errorSummary}
        >
          <p className={styles.errorSummaryTitle}>
            {errorCount === 1
              ? 'One field needs attention'
              : `${errorCount} fields need attention`}
          </p>
          <ul>
            {errors.name ? (
              <li>
                <a href="#vt-name">{errors.name}</a>
              </li>
            ) : null}
            {errors.email ? (
              <li>
                <a href="#vt-email">{errors.email}</a>
              </li>
            ) : null}
            {errors.password ? (
              <li>
                <a href="#vt-password">{errors.password}</a>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="vt-name">
            Name <span className={styles.required}>Required</span>
          </label>
          <input
            ref={nameRef}
            id="vt-name"
            name="name"
            type="text"
            className={cn(styles.input, errors.name && styles.inputInvalid)}
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              clearError('name')
            }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'vt-name-error' : undefined}
            autoComplete="name"
            placeholder="e.g. Ada Lovelace"
            required
          />
          {errors.name ? (
            <p id="vt-name-error" className={styles.fieldError}>
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="vt-email">
            Email <span className={styles.required}>Required</span>
          </label>
          <input
            id="vt-email"
            name="email"
            type="email"
            inputMode="email"
            className={cn(styles.input, errors.email && styles.inputInvalid)}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              clearError('email')
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'vt-email-error' : undefined}
            autoComplete="email"
            placeholder="you@studio.com"
            required
          />
          {errors.email ? (
            <p id="vt-email-error" className={styles.fieldError}>
              {errors.email}
            </p>
          ) : (
            <p className={styles.fieldHint}>We use this only to reply.</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="vt-password">
            Password <span className={styles.required}>8+ characters</span>
          </label>
          <div className={styles.passwordWrap}>
            <input
              id="vt-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={cn(
                styles.input,
                styles.passwordInput,
                errors.password && styles.inputInvalid,
              )}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                clearError('password')
              }}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? 'vt-password-error' : 'vt-password-hint'
              }
              autoComplete="new-password"
              placeholder="e.g. a phrase you can keep"
              required
              minLength={8}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((value) => !value)}
              aria-pressed={showPassword}
              aria-controls="vt-password"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password ? (
            <p id="vt-password-error" className={styles.fieldError}>
              {errors.password}
            </p>
          ) : (
            <p id="vt-password-hint" className={styles.fieldHint}>
              A case is only as private as its key.
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="vt-role">
            Role
          </label>
          <div className={styles.selectWrap}>
            <select
              id="vt-role"
              name="role"
              className={styles.select}
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {ROLES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <svg
              className={styles.selectChevron}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M3 6l5 5 5-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className={styles.fieldHint}>Used for the routing note.</p>
        </div>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.fieldLabel}>Team size</legend>
        <div className={styles.radioRow}>
          {TEAMS.map((option) => (
            <label key={option.value} className={styles.radio}>
              <input
                type="radio"
                name="team"
                value={option.value}
                checked={team === option.value}
                onChange={() => setTeam(option.value)}
                className={styles.choiceInput}
              />
              <span className={styles.radioDot} aria-hidden />
              <span className={styles.radioText}>
                <strong>{option.label}</strong>
                <small>{option.note}</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="vt-message">
          What are you building?
        </label>
        <textarea
          id="vt-message"
          name="message"
          className={styles.textarea}
          value={message}
          onChange={(event) => setMessage(event.target.value.slice(0, 280))}
          rows={3}
          maxLength={280}
          placeholder="e.g. a dashboard with a lot of glass and a little grain."
        />
        <p className={styles.fieldHint}>
          <span aria-hidden>{message.length}</span> / 280
        </p>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="vt-reference">
          Reference
        </label>
        <label className={styles.fileDrop}>
          <input
            id="vt-reference"
            name="reference"
            type="file"
            className={styles.fileInput}
            accept=".png,.jpg,.jpeg,.webp,.svg,.pdf"
            onChange={(event) =>
              setReference(event.target.files?.[0]?.name ?? null)
            }
          />
          <span className={styles.fileIcon} aria-hidden>
            +
          </span>
          <span>
            {reference ?? 'Drop a screenshot, or choose a file'}
            <small>PNG, JPG, WEBP, SVG or PDF</small>
          </span>
        </label>
      </div>

      <div className={styles.choiceStack}>
        <label className={styles.check}>
          <input
            type="checkbox"
            name="updates"
            checked={updates}
            onChange={(event) => setUpdates(event.target.checked)}
            className={styles.choiceInput}
          />
          <span className={styles.checkBox} aria-hidden>
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M2.4 6.2 5 8.7l4.6-5.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>
            Send the field notes
            <small>One short letter when the system changes.</small>
          </span>
        </label>

        <div className={styles.switchRow}>
          <span className={styles.switchCopy}>
            Live status
            <small>Show the case light when the office is open.</small>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={notify}
            onClick={() => setNotify((value) => !value)}
            className={cn(styles.switch, notify && styles.switchOn)}
          >
            <span className={styles.switchThumb} aria-hidden />
            <span className={styles.srOnly}>Live status</span>
          </button>
        </div>
      </div>

      <div className={styles.rangeRow}>
        <label className={styles.fieldLabel} htmlFor="vt-intensity">
          Dither intensity
        </label>
        <output className={styles.rangeValue} htmlFor="vt-intensity">
          {intensity}%
        </output>
        <input
          id="vt-intensity"
          name="intensity"
          type="range"
          min={0}
          max={100}
          step={1}
          value={intensity}
          onChange={(event) => setIntensity(Number(event.target.value))}
          className={styles.range}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="vt-disabled">
          Workspace
        </label>
        <input
          id="vt-disabled"
          type="text"
          className={styles.input}
          value="Assigned by invite"
          disabled
          aria-describedby="vt-disabled-hint"
        />
        <p id="vt-disabled-hint" className={styles.fieldHint}>
          Disabled fields keep their label and value; they never lose contrast.
        </p>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryButton}>
          Request a key
          <span aria-hidden>↗</span>
        </button>
        <button
          type="button"
          className={styles.ghostButton}
          onClick={handleReset}
        >
          Reset
        </button>
        <p className={styles.formNote}>A specimen form. Nothing is sent.</p>
      </div>

      <div className={styles.formStatus} role="status" aria-live="polite">
        {submitted && errorCount === 0
          ? 'Request staged. This specimen does not call a server.'
          : ''}
      </div>
    </form>
  )
}
