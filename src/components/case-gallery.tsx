import React, { useMemo, useState } from 'react'
import { DESIGN_CASES, type DesignCase } from '../data/cases'
import { COLLECTIONS, collectionOf } from '../data/collections'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { TiltedGridHero } from './tilted-grid-hero'
import {
  Badge,
  Button,
  EmptyState,
  Field,
  SearchField,
  Select,
  Tabs,
  Tag,
  type TabItem,
} from '../features/meniscus/ui'

/* The band alternates the work with the material: every third tile is a
   caustic plate, so the row has rhythm instead of being a strip of
   screenshots. */
const PLATES = [
  '/brand/meniscus/plates/plate-1.svg',
  '/brand/meniscus/plates/plate-2.svg',
  '/brand/meniscus/plates/plate-3.svg',
  '/brand/meniscus/plates/plate-4.svg',
]

const BAND = DESIGN_CASES.flatMap((c, i) => [
  { src: c.cover, alt: c.coverAlt },
  ...(i % 3 === 1 ? [{ src: PLATES[Math.floor(i / 3) % PLATES.length], alt: 'Caustic plate' }] : []),
])

const haystack = (c: DesignCase) =>
  [c.name, c.tagline, c.description, c.material, c.status, c.role, collectionOf(c)?.label ?? '', ...c.tags]
    .join(' ')
    .toLowerCase()

const SORTS = [
  { id: 'shelf', label: 'Shelf order' },
  { id: 'name', label: 'Name A–Z' },
  { id: 'collection', label: 'Collection' },
] as const

export function CaseGallery() {
  const [active, setActive] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<string>('shelf')

  const tabs: readonly TabItem[] = useMemo(
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
    <div className="me-scope me-page me-gallery">
      <nav className="me-nav">
        <div className="me-wrap me-nav__in">
          <a className="me-brand" href="/">
            <img src="/brand/meniscus/mark.svg" alt="" />
            <span className="me-brand__name">Meniscus</span>
            <span className="me-brand__case">Design system library</span>
          </a>
          <div className="me-nav__links">
            <a href="/design-system/meniscus">Brand system</a>
            <a href="/api/cases.json" target="_blank" rel="noreferrer">
              API
            </a>
            <a href="https://adityahimaone.space" target="_blank" rel="noreferrer">
              Studio
            </a>
          </div>
        </div>
      </nav>

      <TiltedGridHero
        className="me-hero"
        images={BAND}
        speed={4.2}
        tileHeight={18}
        axis={50}
        curve={64}
        gap={5}
        fade={14}
      >
        <div className="me-hero__scrim" aria-hidden="true" />
        <div className="me-wrap me-hero__in">
          <div>
            <p className="me-eyebrow">
              <i aria-hidden="true" />
              Case 00 · the shelf
            </p>
            <h1 className="me-display">
              Fourteen systems, held in <em>glass</em>.
            </h1>
          </div>

          <div className="me-hero__foot">
            <div>
              <p className="me-hero__lead">
                Every case states its own primitives, its mark family, and{' '}
                <b>the contrast pair it fails</b>. The shelf does not compete with them — it only
                frames them.
              </p>
              <div className="me-stats">
                <div className="me-stat">
                  <span className="me-stat__n">{DESIGN_CASES.length}</span>
                  <span className="me-stat__l">Cases held</span>
                </div>
                <div className="me-stat">
                  <span className="me-stat__n">05</span>
                  <span className="me-stat__l">Collections</span>
                </div>
                <div className="me-stat">
                  <span className="me-stat__n">12</span>
                  <span className="me-stat__l">Primitives</span>
                </div>
                <div className="me-stat">
                  <span className="me-stat__n">15</span>
                  <span className="me-stat__l">Pairs measured</span>
                </div>
                <div className="me-stat">
                  <span className="me-stat__n">03</span>
                  <span className="me-stat__l">Published fails</span>
                </div>
              </div>
            </div>
            <div className="me-cta">
              <Button variant="primary" onClick={() => document.getElementById('shelf')?.scrollIntoView()}>
                Open the shelf
              </Button>
              <Button variant="ghost" onClick={() => (window.location.href = '/design-system/meniscus')}>
                Read the system
              </Button>
            </div>
          </div>
        </div>
      </TiltedGridHero>

      <div className="me-wrap me-gallery__body" id="shelf">
        <div className="me-toolbar">
          <Field label="Search the shelf" htmlFor="me-search">
            <SearchField
              id="me-search"
              value={query}
              onValueChange={setQuery}
              placeholder="A material, a hue, a case name…"
            />
          </Field>
          <Field label="Sort" htmlFor="me-sort">
            <Select id="me-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="me-toolbar__end">
            <span className="me-toolbar__count">
              <b>{String(shown.length).padStart(2, '0')}</b> of {DESIGN_CASES.length} shown
            </span>
            {filtered && (
              <Button variant="ghost" size="sm" onClick={clear}>
                Clear
              </Button>
            )}
          </div>
        </div>

        <Tabs label="Filter by collection" items={tabs} value={active} onChange={setActive} />

        {shown.length === 0 ? (
          <div className="me-cases me-cases--empty">
            <EmptyState
              title="No case matches that"
              body={`Nothing on the shelf answers “${query}”. Fourteen cases, five collections — try a material like paper, glass, stone or emerald, or clear the filter.`}
              action={
                <Button size="sm" onClick={clear}>
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <div className="me-cases">
            {shown.map((c) => {
              const col = collectionOf(c)
              const external = c.href.startsWith('http')
              return (
                <article className="me-case" key={c.slug}>
                  <a
                    className="me-case__cover"
                    href={c.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                    aria-label={`Open ${c.name}`}
                  >
                    <img src={c.cover} alt={c.coverAlt} loading="lazy" />
                    <div className="me-case__badges">
                      <Badge tone="outline">Case {c.number}</Badge>
                      {external && <Badge tone="signal">Studio ↗</Badge>}
                    </div>
                  </a>
                  <div className="me-case__body">
                    <h2>
                      <a
                        href={c.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noreferrer' : undefined}
                      >
                        {c.name}
                        {external ? (
                          <ArrowUpRight className="me-case__arrow" size={15} />
                        ) : (
                          <ArrowRight className="me-case__arrow" size={15} />
                        )}
                      </a>
                    </h2>
                    <p className="me-case__tag">{c.tagline}</p>
                    <p className="me-case__desc">{c.description}</p>
                    <div className="me-case__foot">
                      <span className="me-case__mat">{c.material}</span>
                      {col && <Tag>{col.label}</Tag>}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <section className="me-method">
          <div className="me-sec__head">
            <span className="me-sec__num">01</span>
            <h2 className="me-sec__title">Method</h2>
            <span className="me-sec__rule" aria-hidden="true" />
            <span className="me-sec__note">Three rules every case complies with</span>
          </div>
          <div className="me-method-grid">
            <div>
              <span className="me-method-num">01</span>
              <h3>Brief and bake-off</h3>
              <p>
                Write the constraints down, then draw six marks on one grid in the real palette.
                Keep the one that survives 16px, not the one that photographs best.
              </p>
            </div>
            <div>
              <span className="me-method-num">02</span>
              <h3>Mark, board, tokens</h3>
              <p>
                Outline the wordmark from the font file, build the family, render the board, and
                move every value into primitive → semantic → component tokens.
              </p>
            </div>
            <div>
              <span className="me-method-num">03</span>
              <h3>Proof and audit</h3>
              <p>
                Build the page with real copy and real states. Recompute every contrast pair from
                hex, and print the one that fails with the job it may therefore not do.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="me-wrap me-foot">
        <p>
          Meniscus · Case 00 · the shelf
          <br />
          Smoked graphite #0e1013 · caustic #ffa768 · set in Bricolage Grotesque and Schibsted
          Grotesk
        </p>
        <a className="me-foot__link" href="/design-system/meniscus">
          Read the brand system →
        </a>
      </footer>
    </div>
  )
}
