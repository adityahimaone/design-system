'use client'

import { useState } from 'react'

import styles from '../porphyry.module.css'

export function CopyButton({
  text,
  label = 'Copy',
}: {
  text: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — the code is selectable anyway */
    }
  }

  return (
    <button
      type="button"
      className={styles.copyBtn}
      onClick={copy}
      aria-live="polite"
    >
      {copied ? 'Copied' : label}
    </button>
  )
}
