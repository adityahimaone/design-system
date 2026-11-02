import '@/features/clearing/clearing-tokens.css'

/**
 * The `cl-scope` class is where the Clearing token layer lives. Scoping it to
 * this segment keeps `--cl-*` out of the rest of the site, the same way
 * `st-scope` holds the Strand tokens.
 */
export default function ClearingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="cl-scope">{children}</div>
}
