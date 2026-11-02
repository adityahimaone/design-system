import localFont from 'next/font/local'

import '@/features/wildflower-wind/wildflower-wind-tokens.css'

/**
 * Two families, shipped with the case: Instrument Serif for the display voice —
 * roman and italic under one variable, so `em` in the wordmark is a real cut and
 * not a synthesised oblique — and IBM Plex Mono for every measurement.
 *
 * The reading face is the site's own Instrument Sans (`--font-instrument`), which
 * the token sheet aliases to `--font-reading`. It is not loaded twice.
 */
const display = localFont({
  src: [
    { path: '../../../features/wildflower-wind/fonts/InstrumentSerif-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../../features/wildflower-wind/fonts/InstrumentSerif-Italic.ttf', weight: '400', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
})

const mono = localFont({
  src: '../../../features/wildflower-wind/fonts/IBMPlexMono-Regular.ttf',
  variable: '--font-mono',
  weight: '400',
  display: 'swap',
})

export default function WildflowerWindLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${display.variable} ${mono.variable}`}>{children}</div>
}
