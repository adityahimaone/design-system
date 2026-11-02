'use client'

import { useMemo, useState } from 'react'

import {
  formatChartAxisTick,
  formatCompactCurrency,
  formatCurrency,
} from '@/features/ledger/dashboard/formater'
import { AreaChart } from '@/features/ledger/dashboard/charts/area-chart'
import { Delta, DeltaIcon, DeltaValue } from '@/features/ledger/dashboard/delta'
import { revenueChartDemo } from '@/features/ledger/dashboard/revenue-chart-data'
import { Button } from '@/features/ledger/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/ledger/ui/card'
import { IconPlaceholder } from '@/features/ledger/ui/icon-placeholder'

type PeriodDays = 7 | 14 | 30 | 60 | 90

const PERIODS: readonly PeriodDays[] = [7, 14, 30, 60, 90]

export function RevenueChart() {
  const [periodDays, setPeriodDays] = useState<PeriodDays>(60)

  const rows = useMemo(
    () => revenueChartDemo.slice(-periodDays),
    [periodDays],
  )

  const series = useMemo(
    () => rows.map((row) => ({ label: row.date, value: row.revenue })),
    [rows],
  )

  const growthPct = useMemo(() => {
    const first = rows[0]?.revenue ?? 0
    const last = rows.at(-1)?.revenue ?? first
    return first ? ((last - first) / first) * 100 : 0
  }, [rows])

  return (
    <Card className="panel-hover md:col-span-2 lg:col-span-8">
      <CardHeader className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Gross sales, net of refunds · daily</CardDescription>
        </div>

        {/* Native select: one control, no portal, works before hydration. */}
        <label className="relative">
          <span className="sr-only">Revenue time range</span>
          <select
            className="h-8 cursor-pointer appearance-none rounded-lg border border-border/60 bg-background/40 pr-8 pl-3 text-xs text-foreground backdrop-blur-sm transition-colors duration-200 hover:border-foreground/20 focus-visible:border-foreground/60 focus-visible:ring-[3px] focus-visible:ring-foreground/15 focus-visible:outline-none"
            onChange={(event) =>
              setPeriodDays(Number(event.target.value) as PeriodDays)
            }
            value={periodDays}
          >
            {PERIODS.map((days) => (
              <option key={days} value={days}>
                Last {days} days
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground">
            <IconPlaceholder className="size-3.5" lucide="ChevronDownIcon" />
          </span>
        </label>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-2">
        <AreaChart
          data={series}
          formatValue={(value) => formatCurrency(value)}
          formatX={(label) => formatChartAxisTick(label, periodDays)}
          formatY={(value) => formatCompactCurrency(value)}
          height={280}
          label="Revenue"
        />
      </CardContent>

      <CardFooter className="flex items-center justify-between px-5 pb-5">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Delta value={growthPct}>
            <DeltaIcon />
            <DeltaValue />
          </Delta>
          <p className="inline-flex text-pretty">
            vs first day in last {periodDays} days.
          </p>
        </div>
        <Button
          asChild
          className="h-7 gap-1 text-muted-foreground transition-colors duration-200 hover:text-foreground"
          size="xs"
          variant="ghost"
        >
          <a href="#/reports">
            View report
            <IconPlaceholder aria-hidden="true" lucide="ArrowRightIcon" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
