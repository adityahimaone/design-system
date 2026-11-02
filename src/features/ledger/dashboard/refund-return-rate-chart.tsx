'use client'

import { AreaChart } from '@/features/ledger/dashboard/charts/area-chart'
import { Delta, DeltaIcon, DeltaValue } from '@/features/ledger/dashboard/delta'
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

/** Daily return rate (% of fulfilled orders returned), last 7 days (demo). */
const returnDaily7 = [
  { day: 'Mon', returnRate: 2.2 },
  { day: 'Tue', returnRate: 1.5 },
  { day: 'Wed', returnRate: 3.1 },
  { day: 'Thu', returnRate: 4.8 },
  { day: 'Fri', returnRate: 2.4 },
  { day: 'Sat', returnRate: 3.2 },
  { day: 'Sun', returnRate: 3.9 },
] as const

/** Share of orders that were refunded over the same window (demo). */
const REFUNDED_SHARE_OF_ORDERS_PCT = 2.6

export function RefundReturnRateChart() {
  const first = returnDaily7[0]
  const lastW = returnDaily7.at(-1) ?? first
  const returnTrendPct =
    first.returnRate > 0
      ? ((lastW.returnRate - first.returnRate) / first.returnRate) * 100
      : 0

  const series = returnDaily7.map((row) => ({
    label: row.day,
    value: row.returnRate,
  }))

  return (
    <Card className="panel-hover">
      <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 pt-5">
        <div className="space-y-1">
          <CardTitle>Return rate</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </div>
        <div className="space-y-1 text-right">
          <p className="fig text-lg font-semibold leading-none">
            {REFUNDED_SHARE_OF_ORDERS_PCT}%
          </p>
          <CardDescription className="text-[11px]">
            of orders refunded
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="mt-auto px-2">
        <AreaChart
          data={series}
          formatValue={(value) => `${value.toFixed(1)}%`}
          formatX={(label) => label}
          formatY={(value) =>
            `${Number.isInteger(value) ? value : value.toFixed(1)}%`
          }
          height={160}
          label="Return %"
        />
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 px-5 pb-5">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-muted-foreground text-xs">
          <Delta value={returnTrendPct}>
            <DeltaIcon />
            <DeltaValue />
          </Delta>
          <span className="inline-flex min-w-0 text-pretty">
            vs first day (last 7 days)
          </span>
        </div>
        <Button
          asChild
          className="h-7 gap-1 text-muted-foreground transition-colors duration-200 hover:text-foreground"
          size="xs"
          variant="ghost"
        >
          <a href="#/orders/returns">
            Returns desk
            <IconPlaceholder aria-hidden="true" lucide="ArrowRightIcon" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
