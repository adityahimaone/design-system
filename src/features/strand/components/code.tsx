import { Fragment } from 'react'

import styles from '../strand.module.css'

/**
 * The specimen shows its own tokens with the comments dimmed and the token
 * names lit. The plain string stays the source of truth — the same value is
 * what `CopyButton` writes to the clipboard — so the display cannot drift from
 * what gets copied.
 */
function highlightCss(line: string, key: number) {
  if (line.trim().startsWith('/*')) {
    return (
      <span key={key} className={styles.c}>
        {line}
      </span>
    )
  }

  const declaration = line.match(/^(\s*)(--[\w-]+:)(.*)$/)
  if (declaration) {
    return (
      <span key={key}>
        {declaration[1]}
        <span className={styles.k}>{declaration[2]}</span>
        {declaration[3]}
      </span>
    )
  }

  return <span key={key}>{line}</span>
}

function highlightJson(line: string, key: number) {
  const pair = line.match(/^(\s*)("[^"]+")(:.*)$/)
  if (pair) {
    return (
      <span key={key}>
        {pair[1]}
        <span className={styles.k}>{pair[2]}</span>
        {pair[3]}
      </span>
    )
  }

  return <span key={key}>{line}</span>
}

export function Code({
  source,
  language = 'css',
}: {
  source: string
  language?: 'css' | 'json'
}) {
  const lines = source.split('\n')
  const highlight = language === 'json' ? highlightJson : highlightCss

  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {highlight(line, index)}
          {index < lines.length - 1 ? '\n' : null}
        </Fragment>
      ))}
    </>
  )
}
