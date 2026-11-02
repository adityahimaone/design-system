import '@/features/strand/strand-tokens.css'

/**
 * `st-scope` is where the Strand token layer lives. Scoping it to this segment
 * keeps `--st-*` out of the rest of the site, the same way `cl-scope` holds the
 * Clearing tokens. Metadata lives in the page so the two cannot drift.
 */
export default function StrandLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="st-scope">{children}</div>
}
