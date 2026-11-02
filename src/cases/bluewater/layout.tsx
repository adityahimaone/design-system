import type { Metadata } from 'next'

import '@/features/bluewater/bluewater-tokens.css'

export const metadata: Metadata = {
  title: 'Bluewater Freight — Case 12 | Design System',
  description:
    'Bluewater Freight is a design system: one near-black sea, one silver wake, one 1px chart rule, and a mark drawn as a waterline over a hull.',
  alternates: { canonical: '/design-system/bluewater' },
}

/**
 * `bw-scope` is where the Bluewater token layer lives. Scoping it to this
 * segment keeps `--bw-*` out of the rest of the site, the same way `cv-scope`
 * holds the Cove tokens. Deep is the base ramp; `html[data-bluewater='light']`
 * re-points the same semantic names at the fog primitives.
 *
 * The display face is registered in the root layout (`--font-archivo`) because
 * next/font families cannot be declared twice; Geist and Geist Mono already
 * reach this subtree through `--font-geist` and `--font-geist-mono`.
 */
export default function BluewaterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="bw-scope">{children}</div>
}
