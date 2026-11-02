import React, { useState } from 'react'
import { DESIGN_CASES, type DesignCase } from '../data/cases'
import { ArrowUpRight, ArrowRight, Layers, Sparkles, Filter, Code } from 'lucide-react'

export function CaseGallery() {
  const [activeTag, setActiveTag] = useState<string>('all')

  const allTags = ['all', 'Glass', 'Dither', 'Forms', 'Maritime', 'Transit', 'Two inks', 'Paper']

  const filteredCases = activeTag === 'all'
    ? DESIGN_CASES
    : DESIGN_CASES.filter((c) =>
        c.tags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase()))
      )

  return (
    <div className="min-h-screen bg-[#0e1013] text-[#e4e7eb] font-sans selection:bg-[#202735] selection:text-white pb-24">
      {/* Top Banner / Nav */}
      <nav className="border-b border-[#20242c] bg-[#12151b]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-sm tracking-wide text-white uppercase">
              Design System Library
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e232e] text-[#8e98a8] border border-[#2c3240]">
              {DESIGN_CASES.length} Cases
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <a
              href="/api/cases.json"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1a1f29] hover:bg-[#242b38] text-[#9ca3af] hover:text-white border border-[#2b3342] transition-colors"
            >
              <Code className="size-3.5 text-sky-400" />
              <span>GET /api/cases.json</span>
            </a>
            <a
              href="https://adityahimaone.space"
              className="inline-flex items-center gap-1 text-[#a0abbd] hover:text-white transition-colors"
            >
              <span>Studio Portfolio</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1b212c] border border-[#2b3446] text-sky-400 text-xs font-mono mb-6">
            <Sparkles className="size-3.5" />
            <span>Systems & Identity Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
            Fourteen design systems, engineered from one rigorous method.
          </h1>
          <p className="text-lg text-[#95a1b5] leading-relaxed mb-8">
            Every case is built with its own palette, mark family, responsive tokens,
            accessible contrast audit, and interactive live proof page.
          </p>

          {/* Tag Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-mono text-[#6c788c] flex items-center gap-1.5 mr-2">
              <Filter className="size-3.5" /> Filter:
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer capitalize font-medium ${
                  activeTag === tag
                    ? 'bg-sky-500/10 text-sky-300 border-sky-500/40 shadow-sm'
                    : 'bg-[#151922] text-[#8793a6] border-[#252c3c] hover:border-[#38435b] hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Cases Grid */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((c) => {
            const isExternal = c.href.startsWith('http')
            return (
              <article
                key={c.slug}
                className="group relative flex flex-col rounded-xl bg-[#14171f] border border-[#222733] hover:border-[#3b4457] transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1"
              >
                {/* Cover Image Thumbnail */}
                <a
                  href={c.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                  className="relative aspect-16/10 w-full overflow-hidden bg-[#1a1e28] block"
                >
                  <img
                    src={c.cover}
                    alt={c.coverAlt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback placeholder if image fails to load
                      const target = e.currentTarget
                      target.style.display = 'none'
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-[#0e1117]/85 backdrop-blur-sm border border-white/10 text-[11px] font-mono text-[#ccd5e3]">
                    Case {c.number}
                  </div>
                  {isExternal && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 text-[10px] font-mono text-amber-300">
                      Studio Anchor ↗
                    </div>
                  )}
                </a>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                      <a
                        href={c.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noreferrer' : undefined}
                        className="focus:outline-none"
                      >
                        {c.name}
                      </a>
                    </h2>
                    <a
                      href={c.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noreferrer' : undefined}
                      className="p-1 rounded text-[#727e94] group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      aria-label={`Open ${c.name}`}
                    >
                      {isExternal ? (
                        <ArrowUpRight className="size-4" />
                      ) : (
                        <ArrowRight className="size-4" />
                      )}
                    </a>
                  </div>

                  <p className="text-xs font-mono text-sky-400/90 mb-3 font-medium">
                    {c.tagline}
                  </p>

                  <p className="text-sm text-[#8793a6] line-clamp-3 mb-4 leading-relaxed flex-1">
                    {c.description}
                  </p>

                  <div className="border-t border-[#1f2430] pt-4 mt-auto">
                    <div className="text-[11px] font-mono text-[#616c80] mb-2 truncate">
                      <span className="text-[#8895ad]">Material:</span> {c.material}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {c.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#1c212c] text-[#93a0b5] border border-[#283040]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Methodology Strip */}
        <section className="mt-20 border-t border-[#1f2430] pt-12">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase text-sky-400 tracking-wider">
              Architecture & Process
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Three rules every system complies with
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#14171f] border border-[#222733]">
              <span className="text-xs font-mono text-[#6a768c]">01</span>
              <h4 className="text-base font-semibold text-white mt-2 mb-2">
                Brief & explorations
              </h4>
              <p className="text-sm text-[#8793a6] leading-relaxed">
                Write constraints down, then draw six marks on one grid. Keep the
                one that survives 16px, not the one that photographs best.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#14171f] border border-[#222733]">
              <span className="text-xs font-mono text-[#6a768c]">02</span>
              <h4 className="text-base font-semibold text-white mt-2 mb-2">
                Mark, board, tokens
              </h4>
              <p className="text-sm text-[#8793a6] leading-relaxed">
                Outline the wordmark, build lockups and favicon, render a 3×3
                board, and move values into primitive → semantic → component tokens.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#14171f] border border-[#222733]">
              <span className="text-xs font-mono text-[#6a768c]">03</span>
              <h4 className="text-base font-semibold text-white mt-2 mb-2">
                Proof & audit
              </h4>
              <p className="text-sm text-[#8793a6] leading-relaxed">
                Build the page with real interactive states and copy. Check contrast,
                keyboard, reduced motion and the smallest viewport.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
