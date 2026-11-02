import '@/features/jakarta/jakarta-tokens.css'

/**
 * The `jk-scope` class lives on the page root, not here, because the night
 * surface is toggled by writing `data-jk` to `<html>` and the scope has to be
 * the element that owns the semantic layer. This segment only ships the token
 * file, so `--jk-*` never leaks into the rest of the site.
 */
export default function JakartaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
