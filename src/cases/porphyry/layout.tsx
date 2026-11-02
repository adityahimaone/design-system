import '@/features/porphyry/porphyry-tokens.css'

/**
 * The `po-scope` class is where the Porphyry token layer lives. Scoping it to
 * this segment keeps `--po-*` out of the rest of the site, the same way
 * `rs-scope` holds the Riso tokens and `cl-scope` the Clearing ones.
 */
export default function PorphyryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="po-scope">{children}</div>
}
