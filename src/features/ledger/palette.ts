import tokens from './tokens.json'

/**
 * The display mirror of `ledger-tokens.css`.
 *
 * This file exists because the first build of this page drew its swatches with
 * `var(--zinc-050)` while the stylesheet declared `--lg-zinc-050`. Every square
 * resolved to nothing and the ramp rendered as ten empty outlines — a silent
 * failure that looked like a design choice.
 *
 * So the page no longer reads a CSS custom property to decide a colour. It
 * reads a token name out of `tokens.json`, and a name that does not exist is a
 * thrown error during render, not a white rectangle. `scripts/check-palette.mjs`
 * then proves that every one of those names is declared in the stylesheet with
 * the same value.
 */

export type Swatch = {
  token: string
  hex: string
  value: string
}

type PrimitiveEntry = { value: string; hex: string }

const PRIMITIVES = tokens.primitive as Record<string, PrimitiveEntry>

export function swatch(token: string): Swatch {
  const key = token.replace(/^--/, '')
  const entry = PRIMITIVES[key]

  if (!entry) {
    throw new Error(
      `[ledger/palette] ${token} is not a primitive in tokens.json. ` +
        'A swatch without a value is a build error, not a white rectangle.',
    )
  }

  return { token, hex: entry.hex, value: entry.value }
}

export const HARBOR_RAMP = tokens.ramp.map((step) => ({
  ...swatch(step.token),
  l: step.l,
  role: step.role,
}))

export const SIGNAL_STEPS = tokens.signal.steps.map((step) => ({
  ...swatch(step.token),
  l: step.l,
  role: step.role,
}))

export const SIGNAL_WATER = swatch(tokens.signal.water.token)
export const SIGNAL_REMAINDER = swatch(tokens.signal.remainder.token)
export const SIGNAL_ERROR = swatch(tokens.signal.error.token)

export const ROLES = tokens.roles.map((role) => {
  const { hex, value } = swatch(role.from)
  return { token: role.token, job: role.job, from: role.from, hex, value }
})

export const CHART_RAMP = tokens.chart.light
export const MATERIAL = tokens.material
