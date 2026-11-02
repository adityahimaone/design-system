import React from 'react'
import clsx from 'clsx'
import { Search, X, ChevronDown } from 'lucide-react'

/* ── Button ─────────────────────────────────────────────────────────── */
type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'me-btn',
        `me-btn--${variant}`,
        size !== 'md' && `me-btn--${size}`,
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="me-btn__spinner" aria-hidden="true" /> : icon}
      {children}
    </button>
  )
}

/* ── Field shell ────────────────────────────────────────────────────── */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  meta,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  error?: string
  meta?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="me-field">
      <label className="me-field__label" htmlFor={htmlFor}>
        <b>{label}</b>
        {meta}
      </label>
      {children}
      {error ? (
        <span className="me-field__error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="me-field__hint">{hint}</span>
      ) : null}
    </div>
  )
}

/* ── Inputs ─────────────────────────────────────────────────────────── */
type InputProps = React.ComponentProps<'input'> & { invalid?: boolean }

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={clsx('me-input', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}

export function Textarea({ className, invalid, ...props }: React.ComponentProps<'textarea'> & { invalid?: boolean }) {
  return (
    <textarea
      className={clsx('me-textarea', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: React.ComponentProps<'select'> & { invalid?: boolean }) {
  return (
    <span className="me-select" data-invalid={invalid || undefined}>
      <select className={className} {...props}>
        {children}
      </select>
      <ChevronDown size={14} aria-hidden="true" />
    </span>
  )
}

/* ── Search ─────────────────────────────────────────────────────────── */
export function SearchField({
  value,
  onValueChange,
  placeholder = 'Search',
  label,
  id = 'me-search',
}: {
  value: string
  onValueChange: (v: string) => void
  placeholder?: string
  label?: string
  id?: string
}) {
  return (
    <div className="me-search">
      <Search size={15} aria-hidden="true" />
      {label && (
        <label className="sr-only" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        className="me-input me-input--search"
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={label ? undefined : placeholder}
        onChange={(e) => onValueChange(e.target.value)}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="me-search__clear"
          onClick={() => onValueChange('')}
          aria-label="Clear search"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}

/* ── Check / radio / switch ─────────────────────────────────────────── */
export function Checkbox({
  label,
  description,
  className,
  ...props
}: React.ComponentProps<'input'> & { label: string; description?: string }) {
  return (
    <label className={clsx('me-check', className)}>
      <input type="checkbox" {...props} />
      <span className="me-check__text">
        {label}
        {description && <small>{description}</small>}
      </span>
    </label>
  )
}

export function Radio({
  label,
  description,
  className,
  ...props
}: React.ComponentProps<'input'> & { label: string; description?: string }) {
  return (
    <label className={clsx('me-check', className)}>
      <input type="radio" {...props} />
      <span className="me-check__text">
        {label}
        {description && <small>{description}</small>}
      </span>
    </label>
  )
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  disabled,
}: {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      className="me-switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
    >
      <span className="me-switch__track" aria-hidden="true" />
      {label}
    </button>
  )
}

/* ── Badge / tag ────────────────────────────────────────────────────── */
export function Badge({
  children,
  tone = 'default',
  dot = false,
  color,
}: {
  children: React.ReactNode
  tone?: 'default' | 'signal' | 'outline' | 'danger'
  dot?: boolean
  color?: string
}) {
  return (
    <span className={clsx('me-badge', tone !== 'default' && `me-badge--${tone}`)}>
      {dot && <i style={color ? { background: color } : undefined} aria-hidden="true" />}
      {children}
    </span>
  )
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="me-tag">{children}</span>
}

/* ── Surface / card ─────────────────────────────────────────────────── */
export function Surface({
  title,
  meta,
  children,
  className,
  flush = false,
}: {
  title?: string
  meta?: React.ReactNode
  children: React.ReactNode
  className?: string
  flush?: boolean
}) {
  return (
    <div className={clsx('me-surface', flush && 'me-surface--flush', className)}>
      {title && (
        <div className="me-surface__head">
          <h3>{title}</h3>
          {meta && <span>{meta}</span>}
        </div>
      )}
      <div className={flush ? undefined : 'me-surface__body'}>{children}</div>
    </div>
  )
}

/* ── Tabs ───────────────────────────────────────────────────────────── */
export type TabItem = { id: string; label: string; count?: number; color?: string }

export function Tabs({
  items,
  value,
  onChange,
  label,
}: {
  items: readonly TabItem[]
  value: string
  onChange: (id: string) => void
  label: string
}) {
  return (
    <div className="me-tabs" role="tablist" aria-label={label}>
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          className="me-tab"
          onClick={() => onChange(t.id)}
        >
          {t.color && <i style={{ background: t.color }} aria-hidden="true" />}
          {t.label}
          {typeof t.count === 'number' && <span>{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

/* ── Empty state ────────────────────────────────────────────────────── */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: React.ReactNode
}) {
  return (
    <div className="me-empty">
      <img src="/brand/meniscus/glyph.svg" alt="" />
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  )
}
