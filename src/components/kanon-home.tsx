'use client'

import * as React from 'react'
import { ArrowRight, ArrowUpRight, Check, Copy, Search } from 'lucide-react'

import { TiltedGridHero } from './tilted-grid-hero'
import SerenicaField from './ui/serenica-field'
import { Button } from './ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from './ui/command'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { DESIGN_CASES, type DesignCase } from '../data/cases'
import { COLLECTIONS, collectionOf } from '../data/collections'

/* ============================================================================
   KANON · the studio's front page
   ----------------------------------------------------------------------------
   The page argues one thing: a brandkit and a design system are *written*, and
   the shelf underneath is the proof that they repeat.

   The hero is a full-bleed painted range — the same six ridges that close the
   page — with the title in its sky and the rotating band laid across its
   crests. The install section follows immediately, because that is the thing
   you can take away; the canon below it is the evidence that it works.

   shadcn/ui is the field layer: Input, Label, Select, Button and the Command
   palette are installed components, themed only through tokens.
   ========================================================================== */

/* Thumbnails: the shelf paints a ≤420px card, a band tile is a 190px facet, and
   neither ever needs the 3000×2250 board behind it. Two sizes, from
   `node scripts/build-covers.mjs`: 1200×900 for the shelf and 560×420 for the
   band — two WebPs per case instead of the full PNG boards. */
const thumbOf = (c: DesignCase) => `/brand/thumbs/${c.slug}.webp`
const bandThumbOf = (c: DesignCase) => `/brand/thumbs/${c.slug}-sm.webp`

/* All 24 boards ride the band, one per tile. It is the canon itself going past,
   which is the one thing the hero can say that the shelf below cannot. */
const BAND = DESIGN_CASES.map((c) => ({ src: bandThumbOf(c), alt: '' }))

const INSTALL_CMD =
  'npx skills add adityahimaone/sunnyside --skill sunnyside-brand-system --full-depth'

/* One skill, not a catalogue. `sunnyside-brand-system` is what every board on
   this page came out of, so the section states its six returns and stops. The
   counts below are read off the published skill tree. */
const BRAND_SKILL = 'sunnyside-brand-system'

const RETURNS = [
  { n: '01', name: 'Mark', file: 'mark.svg', says: 'One evenodd path, legible at 16px.' },
  { n: '02', name: 'Cast', file: 'cast/1–6.svg', says: 'Six companions from that same geometry.' },
  { n: '03', name: 'Board', file: '1500×1125', says: 'Six panels: field, mark, type, palette, specimen, rules.' },
  { n: '04', name: 'Surfaces', file: 'surface.html', says: 'The material grid it chose from, kept as evidence.' },
  { n: '05', name: 'Tokens', file: 'tokens.css', says: 'OKLCH, one or two scopes, every pair checked.' },
  { n: '06', name: 'Page', file: '<slug>.astro', says: 'Unnumbered hero and sections, from those tokens.' },
  { n: '07', name: 'Figma HTML', file: '<slug>-figma.html', says: 'Eight white-background sheets, ready for HTML-to-Design.' },
] as const

/* What one `skills add` unpacks, counted from the published tree. */
const SKILL_LOAD = [
  ['references', 10],
  ['templates', 10],
  ['scripts', 30],
  ['examples', 6],
] as const

const SORTS = [
  { id: 'shelf', label: 'Shelf order' },
  { id: 'name', label: 'Name A–Z' },
  { id: 'collection', label: 'Collection' },
] as const

/* Sunnyside is the case the studio was built on, so it holds index 0: the
   filters narrow the list and the sorts reorder it, and neither moves this one. */
const PINNED_SLUG = 'sunnyside'

const withPinned = (list: DesignCase[]): DesignCase[] => {
  const i = list.findIndex((c) => c.slug === PINNED_SLUG)
  if (i <= 0) return list
  const next = [...list]
  next.unshift(...next.splice(i, 1))
  return next
}

const haystack = (c: DesignCase) =>
  [
    c.name,
    c.tagline,
    c.description,
    c.material,
    c.status,
    c.role,
    collectionOf(c)?.label ?? '',
    ...c.tags,
  ]
    .join(' ')
    .toLowerCase()

const SECTIONS = [
  { id: 'install', label: 'Install' },
  { id: 'shelf', label: 'The canon' },
  { id: 'method', label: 'Method' },
]

export interface SystemFacts {
  primitives: number
  pairs: number
  fails: number
}

/* ── one case, as a shelf entry ─────────────────────────────────────────── */
function CaseCard({ c }: { c: DesignCase }) {
  const col = collectionOf(c)
  const external = c.href.startsWith('http')
  return (
    <article className="kn-case">
      <a
        className="kn-case__cover"
        href={c.href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        aria-label={`Open ${c.name}`}
      >
        <img
          src={thumbOf(c)}
          srcSet={`${bandThumbOf(c)} 560w, ${thumbOf(c)} 1200w`}
          sizes="(min-width:1080px) 33vw, (min-width:640px) 50vw, 100vw"
          alt={c.coverAlt}
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
        />
        <span className="kn-case__badges">
          <span className="kn-case__badge">Case {c.number}</span>
          {external && <span className="kn-case__badge kn-case__badge--ext">Studio ↗</span>}
        </span>
      </a>

      <div className="kn-case__body">
        <h3 className="kn-case__name">
          <a
            href={c.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
          >
            {c.name}
            {external ? <ArrowUpRight size={15} /> : <ArrowRight size={15} />}
          </a>
        </h3>
        <p className="kn-case__tag">{c.tagline}</p>
        <p className="kn-case__desc">{c.description}</p>
        <div className="kn-case__foot">
          <span className="kn-case__mat">{c.material}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <a
              href={`/brand/${c.slug}/${c.slug}-figma.html`}
              className="kn-case__col"
              style={{ textDecoration: 'none' }}
              title={`Open ${c.name} Convertible Figma HTML Sheet`}
            >
              Figma HTML ↗
            </a>
            {col && <span className="kn-case__col">{col.label}</span>}
          </span>
        </div>
      </div>
    </article>
  )
}

export function KanonHome({ facts }: { facts: SystemFacts }) {
  const [scope, setScope] = React.useState<'day' | 'night'>('day')
  const [active, setActive] = React.useState('all')
  const [query, setQuery] = React.useState('')
  const [sort, setSort] = React.useState<string>('shelf')
  const [copied, setCopied] = React.useState(false)
  const [palette, setPalette] = React.useState(false)
  const copyTimer = React.useRef<number | undefined>(undefined)

  /* Scope lives on <html>, not on a wrapper: the field, the footer and every
     token resolve from the same element, so one attribute flips the sheet. */
  React.useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-sr', scope)
    root.classList.toggle('dark', scope === 'night')
    try {
      localStorage.setItem('kn-scope', scope)
    } catch {}
  }, [scope])

  React.useEffect(() => {
    try {
      if (localStorage.getItem('kn-scope') === 'night') setScope('night')
    } catch {}
  }, [])

  React.useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = INSTALL_CMD
      ta.setAttribute('readonly', '')
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {}
      ta.remove()
    }
    setCopied(true)
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  const shown = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = DESIGN_CASES.filter((c) => active === 'all' || collectionOf(c)?.name === active)
    if (q) list = list.filter((c) => haystack(c).includes(q))
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'collection')
      list = [...list].sort(
        (a, b) =>
          (collectionOf(a)?.label ?? '').localeCompare(collectionOf(b)?.label ?? '') ||
          a.number.localeCompare(b.number),
      )
    return withPinned(list)
  }, [active, query, sort])

  const filtered = active !== 'all' || query.trim() !== ''
  const clear = () => {
    setActive('all')
    setQuery('')
  }

  const go = (href: string) => {
    setPalette(false)
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.location.href = href
    }
  }

  const figures = [
    { n: DESIGN_CASES.length, l: 'Cases held' },
    { n: RETURNS.length, l: 'Artefacts', pad: true },
    { n: facts.primitives, l: 'Primitives' },
    { n: facts.pairs, l: 'Pairs measured' },
    { n: facts.fails, l: 'Published fails', pad: true, accent: true },
  ]

  return (
    <div className="kn">
      {/* ── bar ─────────────────────────────────────────────────────────── */}
      <header className="kn-bar">
        <div className="kn-wrap kn-bar__in">
          <a className="kn-bar__brand" href="#top" aria-label="Kanon, back to top">
            <img src="/brand/kanon/mark.svg" width="22" height="22" alt="" />
            <span className="kn-bar__name">Kanon</span>
            <span className="kn-bar__sub">Design systems, written</span>
          </a>

          <nav className="kn-bar__nav" aria-label="Sections">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.label}
              </a>
            ))}
          </nav>

          <div className="kn-bar__end">
            <button
              className="kn-kbd"
              type="button"
              onClick={() => setPalette(true)}
              aria-label="Search the canon"
            >
              <Search size={12} aria-hidden="true" />
              Search
              <kbd>⌘K</kbd>
            </button>
            <button
              className="kn-theme"
              type="button"
              onClick={() => setScope(scope === 'day' ? 'night' : 'day')}
              aria-pressed={scope === 'night'}
            >
              <span className="kn-theme__dot" aria-hidden="true" />
              {scope === 'day' ? 'Daylight' : 'Night'}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ── hero · the range runs the full width of the sheet, the type
               sits in its sky, and the band lies across its crests ─────── */}
        <section className="kn-hero" aria-labelledby="kn-title">
          <div className="kn-hero__field" aria-hidden="true">
            <SerenicaField theme="auto" seed={3} height="100%" />
          </div>

          <div className="kn-wrap kn-hero__top">
            <div className="kn-hero__lead">
              <p className="kn-eyebrow">
                <i aria-hidden="true" />
                Kanon · the canon of {DESIGN_CASES.length} cases
              </p>
              <h1 className="kn-display kn-hero__title" id="kn-title">
                Every brand is a <em>rule</em> before it is a look.
              </h1>
              <p className="kn-hero__lede">
                Kanon is a studio of six skills. Each reads a brief and writes what a brand actually
                needs: a mark cut on one grid, a six-panel board, tokens in three layers, and a
                contrast ledger honest enough to <b>publish its own failures</b>.
              </p>
              <div className="kn-acts">
                <Button asChild variant="accent" size="lg">
                  <a href="#install">
                    Install the skill
                    <span className="kn-arw" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#shelf">Open the canon</a>
                </Button>
              </div>
            </div>

            {/* The band's own plate note sits in the sky at its right, where it
                closes the void above the crests and frees the page from a
                caption strip that only repeated it below the fold. */}
            <aside className="kn-hero__note" aria-label="Plate 01">
              <span className="kn-hero__plate">Plate 01</span>
              <p>
                All {DESIGN_CASES.length} boards are on the band, one per facet —{' '}
                <b>no case restyled</b> to match the shelf. What turns past you is the canon
                itself.
              </p>
              <span className="kn-hero__spec">
                {DESIGN_CASES.length} boards · 4:3 · rotating
              </span>
            </aside>
          </div>

          <div className="kn-hero__band">
            <TiltedGridHero
              images={BAND}
              speed={6}
              tileHeight={82}
              aspectRatio={4 / 3}
              gap={8}
              axis={50}
              curve={26}
              fade={18}
            />
          </div>
        </section>

        <div className="kn-wrap">
          <div className="kn-figures">
            <div className="kn-figures__in">
              {figures.map((f) => (
                <div className={`kn-figure${f.accent ? ' kn-figure--accent' : ''}`} key={f.l}>
                  <span className="kn-figure__n">
                    {f.pad ? String(f.n).padStart(2, '0') : f.n}
                  </span>
                  <span className="kn-figure__l">{f.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 01 · install ────────────────────────────────────────────────── */}
        <section className="kn-sec" id="install" aria-labelledby="kn-install-title">
          <div className="kn-wrap">
            <div className="kn-head">
              <span className="kn-head__num">01 · Install</span>
              <h2 id="kn-install-title">One skill writes the brand.</h2>
              <p className="kn-head__note">
                Every board on this page came out of <code>{BRAND_SKILL}</code> — a brief in, six
                artefacts out, one pass. The other five skills build on what it writes; this is
                the one you install first.
              </p>
            </div>

            <div className="kn-install">
              {/* What to run. One line, wrapping, never scrolled. */}
              <div className="kn-cmd">
                <span className="kn-cmd__shell" aria-hidden="true">
                  $
                </span>
                <code className="kn-cmd__code">{INSTALL_CMD}</code>
                <button
                  type="button"
                  className="kn-copy"
                  onClick={copyInstall}
                  data-copied={copied}
                  aria-label={copied ? 'Install command copied' : 'Copy the install command'}
                >
                  {copied ? (
                    <Check size={12} aria-hidden="true" />
                  ) : (
                    <Copy size={12} aria-hidden="true" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <span className="kn-sr" role="status">
                  {copied ? 'Install command copied to the clipboard' : ''}
                </span>
              </div>

              {/* Two columns: the six things one run returns, and the receipt
                  for the run — what lands on disk plus what a brief looks like
                  going in. No skill catalogue: the section is about this skill. */}
              <div className="kn-once">
                <ol className="kn-returns">
                  {RETURNS.map((r) => (
                    <li className="kn-return" key={r.n}>
                      <span className="kn-return__n" aria-hidden="true">
                        {r.n}
                      </span>
                      <span className="kn-return__name">{r.name}</span>
                      <code className="kn-return__file">{r.file}</code>
                      <p className="kn-return__says">{r.says}</p>
                    </li>
                  ))}
                </ol>

                <aside className="kn-once__side" aria-label="What one run unpacks">
                  <p className="kn-once__load">
                    <span className="kn-once__k">Unpacks</span>
                    {SKILL_LOAD.map(([name, n]) => (
                      <span key={name}>
                        <b>{String(n).padStart(2, '0')}</b> {name}
                      </span>
                    ))}
                  </p>
                  <p className="kn-once__brief">
                    Hand it one line — <i>“a dental studio in Bandung, warm, no blue”</i> — and the
                    six above come back in that order, no loops, no second pass.
                  </p>
                  <a className="kn-once__go" href="/design-system/serenica">
                    Read one run end to end
                    <ArrowRight size={13} aria-hidden="true" />
                  </a>
                  <a
                    className="kn-once__go"
                    href="/brand/setout/setout-figma.html"
                    style={{ marginTop: 6 }}
                  >
                    Open 8-sheet Figma HTML template
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 · shelf ──────────────────────────────────────────────────── */}
        <section className="kn-sec" id="shelf" aria-labelledby="kn-shelf-title">
          <div className="kn-wrap">
            <div className="kn-head">
              <span className="kn-head__num">02 · The canon</span>
              <h2 id="kn-shelf-title">Twenty-five systems, one method.</h2>
              <p className="kn-head__note">
                Search a material or a hue, or narrow by what the brand is made of. Every cover is
                the case's own board — <b>nothing is restyled</b> to match the shelf.
              </p>
            </div>

            <div className="kn-tools">
              <div className="kn-field">
                <Label htmlFor="kn-search">Search the canon</Label>
                <div className="kn-search">
                  <Search size={15} aria-hidden="true" className="kn-search__icon" />
                  <Input
                    id="kn-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="A material, a hue, a case name…"
                    autoComplete="off"
                    className="kn-search__input"
                  />
                </div>
              </div>

              <div className="kn-field kn-field--sort">
                <Label htmlFor="kn-sort">Sort</Label>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger id="kn-sort" aria-label="Sort the canon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORTS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="kn-tools__end">
                <span className="kn-count">
                  <b>{String(shown.length).padStart(2, '0')}</b> of {DESIGN_CASES.length} shown
                </span>
                {filtered && (
                  <Button variant="outline" size="sm" onClick={clear}>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="kn-tabs" role="group" aria-label="Filter by collection">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  { id: 'all', label: 'All', count: DESIGN_CASES.length },
                  ...COLLECTIONS.map((col) => ({
                    id: col.name,
                    label: col.label,
                    count: col.cases.length,
                  })),
                ].map((t) => (
                  <Button
                    key={t.id}
                    variant={active === t.id ? 'default' : 'ghost'}
                    size="sm"
                    aria-pressed={active === t.id}
                    onClick={() => setActive(t.id)}
                  >
                    {t.label}
                    <span style={{ opacity: 0.55, fontVariantNumeric: 'tabular-nums' }}>
                      {String(t.count).padStart(2, '0')}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="kn-grid">
              {shown.length === 0 ? (
                <div className="kn-empty">
                  <h3>Nothing on the shelf answers that</h3>
                  <p>
                    No case matches “{query}”. Try a material — paper, glass, stone, kraft — or a
                    hue, or clear the filter and browse by collection.
                  </p>
                  <Button variant="accent" size="sm" onClick={clear}>
                    Clear the filter
                  </Button>
                </div>
              ) : (
                shown.map((c) => <CaseCard c={c} key={c.slug} />)
              )}
            </div>
          </div>
        </section>

        {/* ── 03 · method ─────────────────────────────────────────────────── */}
        <section className="kn-sec" id="method" aria-labelledby="kn-method-title">
          <div className="kn-wrap">
            <div className="kn-head">
              <span className="kn-head__num">03 · Method</span>
              <h2 id="kn-method-title">A rule is only real if it repeats.</h2>
              <p className="kn-head__note">
                The canon is worth reading only if the work under it was made the same way twice.
                These three hold every case here — and each one is checkable on this site.
              </p>
            </div>

            <div className="kn-method">
              <div className="kn-method__col">
                <span className="kn-method__num">01</span>
                <h3>The shelf is 25 runs, not 25 drawings</h3>
                <p>
                  Every cover on this page is the case&rsquo;s own 1500×1125 board — the panel the
                  brand skill prints. Nothing was drawn for the shelf, which is why the band can
                  carry all {DESIGN_CASES.length} of them without one being dressed for the
                  occasion.
                </p>
                <code className="kn-method__ref">
                  sunnyside-brand-system · public/brand/&lt;slug&gt;/&lt;slug&gt;-brandkit.png
                </code>
              </div>

              <div className="kn-method__col">
                <span className="kn-method__num">02</span>
                <h3>Every case is a live route</h3>
                <p>
                  The build skill writes the page, and it is on this site: all{' '}
                  {DESIGN_CASES.length} resolve at <b>/design-system/&lt;slug&gt;</b>, and thirteen
                  also ship a built page at <b>/&lt;slug&gt;</b>. Both read one token sheet in two
                  scopes, so a case cannot be a mood board with a screenshot stapled on.
                </p>
                <code className="kn-method__ref">
                  implement-brand-system · /design-system/serenica
                </code>
              </div>

              <div className="kn-method__col">
                <span className="kn-method__num">03</span>
                <h3>The counts here are computed</h3>
                <p>
                  {facts.primitives} primitives, {facts.pairs} pairs and {facts.fails} published
                  fails are read out of the case-23 token file when this page builds — no number
                  was typed. The index at <b>/api/cases.json</b> is the same array that paints the
                  shelf and the band, so the count in the nav cannot drift from the cards.
                </p>
                <code className="kn-method__ref">
                  src/features/serenica/tokens.json · src/data/cases.ts
                </code>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── the palette ─────────────────────────────────────────────────── */}
      <CommandDialog
        open={palette}
        onOpenChange={setPalette}
        title="Search the canon"
        description="Jump to a case or a section"
      >
        <CommandInput placeholder="Search cases, sections…" />
        <CommandList>
          <CommandEmpty>Nothing matches that. Try a material, a hue, or a case name.</CommandEmpty>

          <CommandGroup heading="Sections">
            {SECTIONS.map((s) => (
              <CommandItem key={s.id} value={`${s.label} ${s.id}`} onSelect={() => go(`#${s.id}`)}>
                {s.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading={`Cases · ${DESIGN_CASES.length}`}>
            {withPinned([...DESIGN_CASES]).map((c) => (
              <CommandItem
                key={c.slug}
                value={`${c.name} ${c.number} ${c.material} ${c.tags.join(' ')}`}
                onSelect={() => go(c.href)}
              >
                {c.name}
                <CommandShortcut>Case {c.number}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}

export default KanonHome
