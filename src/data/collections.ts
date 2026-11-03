import type { DesignCase } from './cases'

/**
 * The five collections. Order is the shelf's order, not alphabetical — the
 * cases are grouped by the material they are made of, which is how someone
 * browsing actually asks the question ("show me the glass ones").
 */
export type Collection = { name: string; label: string; cases: readonly string[] }

export const COLLECTIONS: readonly Collection[] = [
  { name: 'press', label: 'Print & ink', cases: ['sunnyside', 'riso', 'vesper', 'huginn'] },
  { name: 'glass', label: 'Glass & light', cases: ['vitrine', 'cove', 'wildflower-wind', 'halation'] },
  { name: 'survey', label: 'Chart & sea', cases: ['hachure', 'bluewater'] },
  { name: 'stone', label: 'Stone & earth', cases: ['porphyry', 'strand', 'clearing'] },
  { name: 'system', label: 'Grids & cities', cases: ['ledger', 'jakarta'] },
]

export const collectionOf = (c: DesignCase) =>
  COLLECTIONS.find((col) => col.cases.includes(c.slug))
