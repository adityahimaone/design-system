import type { DesignCase } from './cases'

/**
 * The six collections. Order is the shelf's order, not alphabetical — the
 * cases are grouped by the material they are made of, which is how someone
 * browsing actually asks the question ("show me the glass ones").
 *
 * Every case must appear in exactly one collection: the filter bar counts
 * them, so a case that belongs to none is a case the shelf cannot reach.
 */
export type Collection = { name: string; label: string; cases: readonly string[] }

export const COLLECTIONS: readonly Collection[] = [
  {
    name: 'press',
    label: 'Print & ink',
    cases: ['sunnyside', 'riso', 'vesper', 'huginn', 'arete', 'daybook', 'serenica'],
  },
  { name: 'glass', label: 'Glass & light', cases: ['vitrine', 'cove', 'wildflower-wind', 'halation', 'mullion'] },
  { name: 'survey', label: 'Chart & sea', cases: ['hachure', 'bluewater'] },
  { name: 'stone', label: 'Stone & earth', cases: ['porphyry', 'strand', 'clearing', 'quieta', 'tavola'] },
  { name: 'system', label: 'Grids & cities', cases: ['ledger', 'jakarta'] },
  { name: 'freight', label: 'Board & freight', cases: ['causeway', 'manifest'] },
]

export const collectionOf = (c: DesignCase) =>
  COLLECTIONS.find((col) => col.cases.includes(c.slug))
