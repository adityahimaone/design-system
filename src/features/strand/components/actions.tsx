'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from '../strand.module.css'

export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  className,
}: {
  text: string
  label?: string
  copiedLabel?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard fallback */
    }
  }

  return (
    <button
      type="button"
      className={cn(styles.copyButton, className)}
      onClick={copy}
      aria-label={label}
    >
      {copied ? copiedLabel : label}
      <span className={styles.copyDot} aria-hidden />
      <span className={styles.srOnly} role="status">
        {copied ? `${label} copied` : ''}
      </span>
    </button>
  )
}
