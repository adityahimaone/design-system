'use client'

/**
 * The two things on the Vesper page that need the browser.
 *
 * The static page ran these from one inline script. Here they are two small
 * islands, so the page itself stays a server component: the night scope is an
 * attribute on the page container rather than on <html>, which is what keeps it
 * from leaking into the rest of the site, and the copy buttons never touch the
 * document outside their own block.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'vesper-scope'
const SCOPE_EVENT = 'vesper-scope-change'

/**
 * The stored scope is external state, so it is read as external state. Reading
 * localStorage into useState inside an effect would render twice on every mount
 * and is exactly what `set-state-in-effect` exists to stop.
 */
const subscribe = (onChange: () => void) => {
  window.addEventListener(SCOPE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(SCOPE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

const isNight = () => window.localStorage.getItem(STORAGE_KEY) === 'night'
const isNightOnServer = () => false

export function NightToggle() {
  const ref = useRef<HTMLButtonElement>(null)
  const night = useSyncExternalStore(subscribe, isNight, isNightOnServer)

  // The scope is an attribute on the page container, not on <html>: writing it
  // to the document would repaint the site around the page.
  useEffect(() => {
    ref.current
      ?.closest('.vs-scope')
      ?.setAttribute('data-vesper', night ? 'night' : 'day')
  }, [night])

  const toggle = () => {
    window.localStorage.setItem(STORAGE_KEY, night ? 'day' : 'night')
    window.dispatchEvent(new Event(SCOPE_EVENT))
  }

  return (
    <button
      ref={ref}
      type="button"
      className="vs-toggle"
      aria-pressed={night}
      onClick={toggle}
    >
      <i />
      <span>{night ? 'Day' : 'Night'}</span>
    </button>
  )
}

export function CopyButton({
  target,
  label = 'Copy',
}: {
  target: string
  label?: string
}) {
  const [state, setState] = useState(label)

  const copy = async () => {
    const text = document.getElementById(target)?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setState('Copied')
    } catch {
      setState('Select it')
    }
    window.setTimeout(() => setState(label), 1400)
  }

  return (
    <button type="button" className="vs-copy" onClick={copy}>
      {state}
    </button>
  )
}
