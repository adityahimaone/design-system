'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from '../clearing.module.css'

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
      /* clipboard unavailable — the code is on screen and selectable */
    }
  }

  return (
    <button
      type="button"
      className={cn(styles.copy, className)}
      onClick={copy}
      aria-label={`${label} to clipboard`}
    >
      {copied ? copiedLabel : label}
      <span className={styles.srOnly} role="status">
        {copied ? `${label} copied` : ''}
      </span>
    </button>
  )
}
