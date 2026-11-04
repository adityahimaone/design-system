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

const BAND = DESIGN_CASES.map((c) => ({ src: c.cover, alt: c.coverAlt }))

const INSTALL_CMD =
  'npx skills add adityahimaone/sunnyside --skill sunnyside-brand-system --full-depth'

/* The published skill ships six capabilities. The page no longer enumerates
   them one by one — the install panel does that — but the count is real and it
   is stated in the figures. */
const SKILL_COUNT = 6

const SORTS = [
  { id: 'shelf', label: 'Shelf order' },
  { id: 'name', label: 'Name A–Z' },
  { id: 'collection', label: 'Collection' },
] as const

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
        <img src={c.cover} alt={c.coverAlt} loading="lazy" />
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
          {col && <span className="kn-case__col">{col.label}</span>}
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
    return list
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
    { n: SKILL_COUNT, l: 'Skills', pad: true },
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
                The canon in shelf order. Every board on the band is the case's own cover —{' '}
                <b>nothing restyled</b> to match the shelf.
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
              tileHeight={66}
              aspectRatio={4 / 3}
              gap={5}
              axis={50}
              curve={62}
              fade={14}
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
              <h2 id="kn-install-title">Six skills, one command.</h2>
              <p className="kn-head__note">
                Every case on this page was made by the same published skill. Install it and the
                next one is made the same way — marks on one grid, tokens in three layers, and a
                ledger that <b>names what it fails</b>.
              </p>
            </div>

            <div className="kn-install__panel">
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

              <div className="kn-parts">
                {[
                  {
                    name: 'references',
                    count: 9,
                    blurb:
                      'The rules the build is held to: the craft bar, the gates, the mark and cast system, the three-layer tokens, immersive surfaces, form theming, research, Figma export — and the case evidence every claim on this page is traced back to.',
                  },
                  {
                    name: 'templates',
                    count: 10,
                    blurb:
                      'The files that get written: the case page, the brandkit board, the design-system page, the single-page proof, the Figma plugin, the OpenPencil board and build, the guidelines, and the audit schema.',
                  },
                  {
                    name: 'scripts',
                    count: 25,
                    blurb:
                      'The forge — marks, casts, boards, fields, glyphs, outlined wordmarks, tokens, DESIGN.md, Figma export, the audit and the gates. Deterministic: no API calls, no placeholder output.',
                  },
                  {
                    name: 'examples',
                    count: 3,
                    blurb:
                      'Three worked briefs with their configs, so the intake reads as a shape you can copy rather than a paragraph you have to interpret.',
                  },
                ].map((part, i) => (
                  <details className="kn-part" key={part.name} open={i === 0}>
                    <summary>
                      <span className="kn-part__name">{part.name}</span>
                      <span className="kn-part__n">{String(part.count).padStart(2, '0')}</span>
                    </summary>
                    <p>{part.blurb}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 · shelf ──────────────────────────────────────────────────── */}
        <section className="kn-sec" id="shelf" aria-labelledby="kn-shelf-title">
          <div className="kn-wrap">
            <div className="kn-head">
              <span className="kn-head__num">02 · The canon</span>
              <h2 id="kn-shelf-title">Twenty-three systems, one method.</h2>
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
                Three constraints hold every case on this page to the same bar.
              </p>
            </div>

            <div className="kn-method">
              <div className="kn-method__col">
                <span className="kn-method__num">01</span>
                <h3>One grid, six marks</h3>
                <p>
                  Every mark is drawn on the same 64-unit grid in the real palette. Six are cast,
                  one survives — the test is 16px, not the presentation render.
                </p>
              </div>
              <div className="kn-method__col">
                <span className="kn-method__num">02</span>
                <h3>Three layers, two scopes</h3>
                <p>
                  Primitive, semantic, component. Daylight and night are the same primitives with a
                  different semantic sheet — never a second palette mixed by eye.
                </p>
              </div>
              <div className="kn-method__col">
                <span className="kn-method__num">03</span>
                <h3>Publish the fail</h3>
                <p>
                  Every contrast pair is recomputed from hex and the failures are printed with the
                  job they may not do. A system that hides its worst pair is a mood board.
                </p>
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
            {DESIGN_CASES.map((c) => (
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
