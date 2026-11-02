import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/features/ledger/ui/card";
import { Delta, DeltaIcon, DeltaValue } from "@/features/ledger/dashboard/delta";
import { Sparkline } from "@/features/ledger/dashboard/sparkline";

type Stat = {
  label: string;
  value: string;
  delta: number;
  hint: string;
  series: number[];
};

const stats: readonly Stat[] = [
  {
    label: "Total revenue",
    value: "$284,920",
    delta: 8.2,
    hint: "vs prior 30 days",
    series: [18, 22, 19, 26, 24, 31, 29, 36, 34, 41, 44, 48],
  },
  {
    label: "Orders",
    value: "1,842",
    delta: 4.1,
    hint: "vs prior 30 days",
    series: [30, 28, 33, 31, 35, 34, 38, 37, 40, 39, 43, 45],
  },
  {
    label: "Average order value",
    value: "$154.60",
    delta: -1.3,
    hint: "vs prior 30 days",
    series: [44, 46, 43, 45, 42, 44, 41, 43, 40, 42, 39, 38],
  },
  {
    label: "Store conversion",
    value: "3.06%",
    delta: 0.6,
    hint: "vs prior 30 days",
    series: [21, 23, 22, 25, 24, 24, 27, 26, 28, 27, 29, 30],
  },
] as const;

export function DashboardStats() {
  return (
    <>
      {stats.map((s) => (
        <StatCard key={s.label} stat={s} />
      ))}
    </>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const { label, value, delta, hint, series } = stat;

  return (
    <Card className="panel-hover relative gap-0 overflow-hidden p-0 lg:col-span-3">
      <CardHeader className="gap-0 px-5 pt-5">
        <CardTitle className="font-mono font-normal text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
          {label}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-end justify-between gap-3 px-5 pt-3">
        <p className="fig text-[26px] font-semibold leading-none tracking-tight">
          {value}
        </p>
        <Sparkline className="mb-0.5 text-foreground/45" data={series} />
      </CardContent>

      <CardFooter className="gap-1.5 px-5 pt-4 pb-5 text-xs">
        <Delta value={delta}>
          <DeltaIcon />
          <DeltaValue />
        </Delta>
        <span className="text-pretty text-muted-foreground">{hint}</span>
      </CardFooter>
    </Card>
  );
}
