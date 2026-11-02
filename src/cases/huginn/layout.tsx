import '@/features/huginn/huginn-tokens.css'

/**
 * The `hg-scope` class is where the Huginn token layer lives. Scoping it to this
 * segment keeps `--hg-*` out of the rest of the site, the same way `rs-scope`
 * holds the Riso tokens and `cl-scope` the Clearing ones.
 */
export default function HuginnLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="hg-scope">{children}</div>
}
