'use client'

import { useMemo } from 'react'

import { Donut } from '@/features/ledger/dashboard/charts/donut'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/ledger/ui/card'

export type CategoryMixDatum = {
  category: string
  /** Percent of total (0–100). Usually sums to 100. */
  share: number
}

const SLICE_PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const

/** At most four named slices; remaining share rolls into a fifth slice, "Others". */
const MAX_NAMED_SLICES = 4

const periodDays = 7

const data = [
  { category: 'Apparel', share: 22 },
  { category: 'Accessories', share: 22 },
  { category: 'Footwear', share: 18 },
  { category: 'Home & living', share: 14 },
  { category: 'Beauty', share: 11 },
  { category: 'Outlet', share: 8 },
  { category: 'Sports', share: 5 },
] as const satisfies readonly CategoryMixDatum[]

/** Sort by share descending, keep the top four, merge the rest into "Others". */
function consolidateTopFourAndOthers(
  rows: readonly CategoryMixDatum[],
): CategoryMixDatum[] {
  if (rows.length <= MAX_NAMED_SLICES) return [...rows]

  const sorted = [...rows].sort((a, b) => b.share - a.share)
  const head = sorted.slice(0, MAX_NAMED_SLICES)
  const tail = sorted.slice(MAX_NAMED_SLICES)
  const othersShare = tail.reduce((sum, row) => sum + row.share, 0)

  return [...head, { category: 'Others', share: othersShare }]
}

type SliceRow = {
  key: string
  category: string
  share: number
  fill: string
}

function buildSlices(rows: readonly CategoryMixDatum[]): SliceRow[] {
  return rows.map((row, index) => ({
    key: `s${index}`,
    category: row.category,
    share: row.share,
    fill: SLICE_PALETTE[index % SLICE_PALETTE.length],
  }))
}

export function CategoryRankChart() {
  const slices = useMemo(
    () => buildSlices(consolidateTopFourAndOthers(data)),
    [],
  )

  return (
    <Card className="panel-hover lg:col-span-4">
      <CardHeader className="px-5 pt-5">
        <CardTitle>Revenue by category</CardTitle>
        <CardDescription>
          Share of net revenue · last {periodDays} days
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 px-5 pb-5">
        <div className="flex justify-center">
          <Donut
            data={slices}
            label={`${periodDays} days`}
            size={176}
            thickness={26}
            value="100%"
          />
        </div>

        {/* Legend as a data list, not a colour key: the ramp is the reading. */}
        <ul className="flex flex-col">
          {slices.map((slice) => (
            <li
              className="flex items-center gap-2.5 border-border/40 border-t py-1.5 text-xs first:border-t-0"
              key={slice.key}
            >
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-[3px]"
                style={{ backgroundColor: slice.fill }}
              />
              <span className="truncate text-muted-foreground">
                {slice.category}
              </span>
              <span className="fig ml-auto text-[11px] text-foreground">
                {slice.share}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
