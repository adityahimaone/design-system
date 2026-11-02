import localFont from 'next/font/local'

import '@/features/vesper/vesper-tokens.css'
import '@/features/vesper/vesper-page.css'

/**
 * Three voices, all shipped with the case.
 *
 * Fraunces carries the display line: a variable old-style with an optical size
 * axis, so the 66px statement and the 26px section head are the same file drawn
 * at two sizes rather than two weights pretending. Archivo carries every
 * interface string, and DM Mono carries every number a developer will copy.
 *
 * Each family is exposed as the variable the token sheet already reads
 * (`--vs-font-display: var(--font-display, 'Fraunces')`), so the stylesheet is
 * identical to the one the static specimen uses and the literal family name
 * stays as the fallback.
 */
const display = localFont({
  src: [
    {
      path: '../../../features/vesper/fonts/Fraunces-Variable.woff2',
      weight: '300 700',
      style: 'normal',
    },
    {
      path: '../../../features/vesper/fonts/Fraunces-Variable-Italic.woff2',
      weight: '300 700',
      style: 'italic',
    },
  ],
  variable: '--font-display',
  display: 'swap',
})

const reading = localFont({
  src: [
    {
      path: '../../../features/vesper/fonts/Archivo-Variable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-reading',
  display: 'swap',
})

const mono = localFont({
  src: [
    {
      path: '../../../features/vesper/fonts/DMMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../features/vesper/fonts/DMMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
})

export default function VesperLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${display.variable} ${reading.variable} ${mono.variable}`}>
      {children}
    </div>
  )
}
