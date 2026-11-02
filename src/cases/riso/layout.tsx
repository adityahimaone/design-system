import '@/features/riso/riso-tokens.css'

/**
 * The `rs-scope` class is where the Riso token layer lives. Scoping it to this
 * segment keeps `--rs-*` out of the rest of the site, the same way `cl-scope`
 * holds the Clearing tokens and `st-scope` the Strand ones.
 */
export default function RisoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="rs-scope">{children}</div>
}
