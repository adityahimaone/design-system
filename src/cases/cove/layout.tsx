import { JetBrains_Mono, Sora } from 'next/font/google'

import '@/features/cove/cove-tokens.css'

/**
 * Cove's display and label faces. Both are section-level: the hero line and
 * every number in the case. Geist — the body face — is already loaded by the
 * root layout and reaches this subtree through `--font-geist`, so the case does
 * not download a second reading face just to have its own name for it.
 *
 * `preload: false` on both: the case is not the first screen of the site, and
 * three preloads queued ahead of the CSS is exactly the regression the root
 * layout's font comment describes.
 */
const display = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
  preload: false,
})

const mono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
})

/**
 * `cv-scope` is where the Cove token layer lives. Scoping it to this segment
 * keeps `--cv-*` out of the rest of the site, the same way `st-scope` holds the
 * Strand tokens and `cl-scope` the Clearing ones. The night ramp is the base;
 * `html[data-cove='day']` overrides it.
 */
export default function CoveLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${display.variable} ${mono.variable} cv-scope`}>
      {children}
    </div>
  )
}
