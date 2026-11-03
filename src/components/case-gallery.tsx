import React, { useEffect, useMemo, useState } from 'react'
import { DESIGN_CASES, type DesignCase } from '../data/cases'
import { COLLECTIONS, collectionOf } from '../data/collections'
import { ArrowUpRight, ArrowRight, Search } from 'lucide-react'
import { TiltedGridHero } from './tilted-grid-hero'

/* The band is the shelf itself: every cover in shelf order, so the hero never
   shows a case that isn't also in the index below it. */
const BAND = DESIGN_CASES.map((c) => ({ src: c.cover, alt: c.coverAlt }))

const haystack = (c: DesignCase) =>
  [c.name, c.tagline, c.description, c.material, c.status, c.role, collectionOf(c)?.label ?? '', ...c.tags]
    .join(' ')
    .toLowerCase()

const SORTS = [
  { id: 'shelf', label: 'Shelf order' },
  { id: 'name', label: 'Name A–Z' },
  { id: 'collection', label: 'Collection' },
] as const

export interface SystemFacts {
  primitives: number
  pairs: number
  fails: number
}

export function CaseGallery({ facts }: { facts: SystemFacts }) {
  /* The page ships in day scope and remembers a flip. The tokens do the rest:
     every surface, pane and rule resolves again in night without a second sheet. */
  const [scope, setScope] = useState<'day' | 'night'>('day')
  const [active, setActive] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<string>('shelf')

  useEffect(() => {
    try {
      if (localStorage.getItem('ha-scope') === 'night') setScope('night')
    } catch {}
  }, [])

  const flip = () =>
    setScope((s) => {
      const next = s === 'day' ? 'night' : 'day'
      try {
        localStorage.setItem('ha-scope', next)
      } catch {}
      return next
    })

  const tabs = useMemo(
    () => [
      { id: 'all', label: 'All', count: DESIGN_CASES.length },
      ...COLLECTIONS.map((col) => ({ id: col.name, label: col.label, count: col.cases.length })),
    ],
    []
  )

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = DESIGN_CASES.filter((c) => active === 'all' || collectionOf(c)?.name === active)
    if (q) list = list.filter((c) => haystack(c).includes(q))
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'collection')
      list = [...list].sort(
        (a, b) =>
          (collectionOf(a)?.label ?? '').localeCompare(collectionOf(b)?.label ?? '') ||
          a.number.localeCompare(b.number)
      )
    return list
  }, [active, query, sort])

  const filtered = active !== 'all' || query.trim() !== ''
  const clear = () => {
    setActive('all')
    setQuery('')
  }

  return (
    <div className="ha ha-land" data-ha={scope}>
      <header className="lg-nav">
        <div className="ha-wrap lg-nav__in">
          <a className="lg-brand" href="/">
            <img
              className="lg-brand__mark lg-brand__mark--day"
              src="/brand/halation/mark.svg"
              alt=""
              width="26"
              height="26"
            />
            <img
              className="lg-brand__mark lg-brand__mark--night"
              src="/brand/halation/mark-reverse.svg"
              alt=""
              width="26"
              height="26"
            />
            <span className="lg-brand__name">Halation</span>
            <span className="lg-brand__sub">Design system library</span>
          </a>

          <nav className="lg-nav__links">
            <a href="/design-system/halation">Brand system</a>
            <a href="/api/cases.json" target="_blank" rel="noreferrer">
              API
            </a>
            <a href="https://adityahimaone.space" target="_blank" rel="noreferrer">
              Studio
            </a>
            <button
              className="lg-scope"
              onClick={flip}
              aria-pressed={scope === 'night'}
              aria-label={`Switch to ${scope === 'day' ? 'night' : 'day'} scope`}
            >
              <i aria-hidden="true" />
              {scope === 'day' ? 'Night' : 'Day'}
            </button>
          </nav>
        </div>
      </header>

      <TiltedGridHero
        className="lg-hero"
        images={BAND}
        speed={6}
        tileHeight={58}
        aspectRatio={4 / 3}
        gap={3}
        axis={55}
        curve={64}
        fade={22}
      >
        <div className="lg-hero__veil" aria-hidden="true" />

        <div className="ha-wrap lg-hero__in">
          <div className="lg-hero__copy">
            <p className="ha-label lg-hero__eyebrow">
              <i aria-hidden="true" />
              Case 00 · the shelf
            </p>

            <h1 className="ha-display lg-hero__title">
              Eighteen systems, held in <em>glass</em>.
            </h1>

            <p className="lg-hero__lead">
              Every case states its own primitives, its mark family, and{' '}
              <b>the contrast pair it fails</b>. The shelf does not compete with them — it only
              frames them.
            </p>

            <div className="lg-hero__cta">
              <a className="ha-btn ha-btn--glass" href="#shelf">
                Open the shelf
              </a>
              <a className="ha-btn ha-btn--glass-quiet" href="/design-system/halation">
                Read the system
              </a>
            </div>
          </div>
        </div>
      </TiltedGridHero>

      <section className="lg-figures" aria-label="The shelf in numbers">
        <div className="ha-wrap">
          <div className="lg-figures__in">
            <div className="lg-figure">
              <span className="lg-figure__n">{DESIGN_CASES.length}</span>
              <span className="lg-figure__l">Cases held</span>
            </div>
            <div className="lg-figure">
              <span className="lg-figure__n">{String(COLLECTIONS.length).padStart(2, '0')}</span>
              <span className="lg-figure__l">Collections</span>
            </div>
            <div className="lg-figure">
              <span className="lg-figure__n">{facts.primitives}</span>
              <span className="lg-figure__l">Primitives</span>
            </div>
            <div className="lg-figure">
              <span className="lg-figure__n">{facts.pairs}</span>
              <span className="lg-figure__l">Pairs measured</span>
            </div>
            <div className="lg-figure lg-figure--accent">
              <span className="lg-figure__n">{String(facts.fails).padStart(2, '0')}</span>
              <span className="lg-figure__l">Published fails</span>
            </div>
          </div>
        </div>
      </section>

      <main className="ha-wrap lg-shelf" id="shelf">
        <div className="lg-shelf__head">
          <span className="lg-shelf__num">01 · Index</span>
          <h2 className="lg-shelf__title">The shelf</h2>
          <p className="lg-shelf__note">
            Eighteen cases, five collections. Search a material or a hue, or narrow by collection.
            Every cover is the case's own board — nothing is restyled to match the shelf.
          </p>
        </div>

        <div className="lg-tools">
          <div className="lg-field">
            <label htmlFor="lg-search">Search the shelf</label>
            <div className="lg-search">
              <Search size={15} aria-hidden="true" />
              <input
                id="lg-search"
                className="lg-input lg-input--search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="A material, a hue, a case name…"
              />
            </div>
          </div>

          <div className="lg-field">
            <label htmlFor="lg-sort">Sort</label>
            <select id="lg-sort" className="lg-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="lg-tools__end">
            <span className="lg-count">
              <b>{String(shown.length).padStart(2, '0')}</b> of {DESIGN_CASES.length} shown
            </span>
            {filtered && (
              <button className="ha-btn ha-btn--ghost ha-btn--sm" onClick={clear}>
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="lg-tabs" role="group" aria-label="Filter by collection">
          {tabs.map((t) => (
            <button
              key={t.id}
              className="lg-tab"
              aria-pressed={active === t.id}
              onClick={() => setActive(t.id)}
            >
              {t.label} <b>{String(t.count).padStart(2, '0')}</b>
            </button>
          ))}
        </div>

        <div className="lg-grid">
          {shown.length === 0 ? (
            <div className="lg-empty">
              <h3>No case matches that</h3>
              <p>
                Nothing on the shelf answers “{query}”. Eighteen cases, five collections — try a
                material like paper, glass, stone or emerald, or clear the filter.
              </p>
              <button className="ha-btn ha-btn--sm" onClick={clear}>
                Clear filters
              </button>
            </div>
          ) : (
            shown.map((c) => {
              const col = collectionOf(c)
              const external = c.href.startsWith('http')
              return (
                <article className="lg-case" key={c.slug}>
                  <a
                    className="lg-case__cover"
                    href={c.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                    aria-label={`Open ${c.name}`}
                  >
                    <img src={c.cover} alt={c.coverAlt} loading="lazy" />
                    <span className="lg-case__badges">
                      <span className="lg-badge">Case {c.number}</span>
                      {external && <span className="lg-badge lg-badge--signal">Studio ↗</span>}
                    </span>
                  </a>

                  <div className="lg-case__body">
                    <h3 className="lg-case__name">
                      <a
                        href={c.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noreferrer' : undefined}
                      >
                        {c.name}
                        {external ? <ArrowUpRight size={15} /> : <ArrowRight size={15} />}
                      </a>
                    </h3>
                    <p className="lg-case__tag">{c.tagline}</p>
                    <p className="lg-case__desc">{c.description}</p>
                    <div className="lg-case__foot">
                      <span className="lg-case__mat">{c.material}</span>
                      {col && <span className="lg-chip">{col.label}</span>}
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>

        <section className="lg-method">
          <div className="lg-shelf__head">
            <span className="lg-shelf__num">02 · Method</span>
            <h2 className="lg-shelf__title">Three rules every case complies with</h2>
            <p className="lg-shelf__note">
              The shelf is only worth reading if the work under it was made the same way twice.
            </p>
          </div>

          <div className="lg-method__grid">
            <div className="lg-method__col">
              <span className="lg-method__num">01</span>
              <h3>Brief and bake-off</h3>
              <p>
                Write the constraints down, then draw six marks on one grid in the real palette. Keep
                the one that survives 16px, not the one that photographs best.
              </p>
            </div>
            <div className="lg-method__col">
              <span className="lg-method__num">02</span>
              <h3>Mark, board, tokens</h3>
              <p>
                Outline the wordmark from the font file, build the family, render the board, and move
                every value into primitive → semantic → component tokens.
              </p>
            </div>
            <div className="lg-method__col">
              <span className="lg-method__num">03</span>
              <h3>Proof and audit</h3>
              <p>
                Build the page with real copy and real states. Recompute every contrast pair from hex,
                and print the one that fails with the job it may therefore not do.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="ha-wrap lg-foot">
        <div>
          <div className="lg-foot__mark">
            <img
              className="lg-brand__mark--day"
              src="/brand/halation/mark.svg"
              alt=""
              width="22"
              height="22"
            />
            <img
              className="lg-brand__mark--night"
              src="/brand/halation/mark-reverse.svg"
              alt=""
              width="22"
              height="22"
            />
            Halation
          </div>
          <p>
            Case 00 · the shelf
            <br />
            Reeded prismatic glass · coral #ff4a34 · set in Syne and Schibsted Grotesk · day and
            night cut from the same eighteen primitives
          </p>
        </div>
        <a className="ha-btn ha-btn--ghost" href="/design-system/halation">
          Read the brand system
        </a>
      </footer>
    </div>
  )
}
