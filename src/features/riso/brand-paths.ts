/**
 * Riso Co. — mark geometry, v4.0.
 *
 * Mirrors the drawings in `public/brand/riso/*.svg`. The SVGs are the source
 * of truth (they are hand-cut on the 64 grid); this file only re-states the
 * same paths so the React mark can inherit `currentColor` and the drum vars.
 * If you nudge a point, nudge it in both places — `scripts/check-riso-mark.mjs`
 * fails the build when they disagree.
 *
 * The construction: one sheet, pinned at the top, torn from the pin. Drum A
 * holds the left flap; drum B holds the right one slid 4,3 out of register.
 * The pin is the only element that crosses the tear.
 */

export type MarkGeometry = {
  box: number
  /** Drum A — the first pass. */
  a: string
  /** Drum B — the second pass, out of register. */
  b: string
  /** The pin. Absent on the compact, which is a separate drawing. */
  pin?: string
  /** One-ink stamp: the pin becomes a punched hole (fill-rule evenodd). */
  mono?: { a: string; b: string }
}

export const MARK: MarkGeometry = {
  box: 64,
  a: 'M8 9H30L35 20L27 27L36 36L30 44L38 55H17L8 47Z',
  b: 'M34 12L39 23L31 30L40 39L34 47L42 58H47L55 50V16L50 12Z',
  pin: 'M32.5 6L38 11L32.5 16L27 11Z',
  mono: {
    a: 'M8 9H30L35 20L27 27L36 36L30 44L38 55H17L8 47ZM32.5 6L38 11L32.5 16L27 11Z',
    b: 'M34 12L39 23L31 30L40 39L34 47L42 58H47L55 50V16L50 12ZM32.5 6L38 11L32.5 16L27 11Z',
  },
}

export const COMPACT: MarkGeometry = {
  box: 32,
  a: 'M4 5H15L17.5 10.5L13.5 14L18 19L15 23L19 27H8.5L4 23.5Z',
  b: 'M17 6.5L19.5 12L15.5 15.5L20 20.5L17 24.5L21 28H23.5L28 24V9.5L25.5 6.5Z',
}

/** The outlined wordmark's box, so a lockup can be measured without the file. */
export const WORDMARK_VIEWBOX = { width: 965.38, height: 200 }
