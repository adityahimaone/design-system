/**
 * Huginn — mark geometry, v3.0.
 *
 * Mirrors `public/brand/huginn/mark*.svg`. The SVGs are the source of truth
 * (the cells are hand-placed on the 64 grid); this file re-states them so the
 * React mark can inherit `currentColor` and the escapee token.
 *
 * The construction: five 14-unit cells on a 3-unit gap, and a sixth that has
 * left the grid by 6 units and is printed in the field colour.
 */

export type Cell = { x: number; y: number; size: number; escape?: boolean }

export type CellGeometry = { box: number; cells: readonly Cell[] }

export const MARK: CellGeometry = {
  box: 64,
  cells: [
    { x: 6, y: 10, size: 14 },
    { x: 23, y: 10, size: 14 },
    { x: 6, y: 27, size: 14 },
    { x: 23, y: 27, size: 14 },
    { x: 6, y: 44, size: 14 },
    { x: 43, y: 6, size: 14, escape: true },
  ],
}

export const COMPACT: CellGeometry = {
  box: 32,
  cells: [
    { x: 2, y: 13, size: 8 },
    { x: 12, y: 13, size: 8 },
    { x: 2, y: 23, size: 8 },
    { x: 23, y: 2, size: 8, escape: true },
  ],
}

export const GLYPH: CellGeometry = {
  box: 32,
  cells: [
    { x: 4, y: 17, size: 11 },
    { x: 19, y: 4, size: 9, escape: true },
  ],
}

/** The outlined wordmark's box, drawn as 22 rows of cells. */
export const WORDMARK_VIEWBOX = { width: 950, height: 200 }
