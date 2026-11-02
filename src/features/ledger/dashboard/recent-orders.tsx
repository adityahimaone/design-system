import { Badge } from "@/features/ledger/ui/badge";
import { Button } from "@/features/ledger/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/features/ledger/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/ledger/ui/table";
import { IconPlaceholder } from "@/features/ledger/ui/icon-placeholder";

type OrderStatus = "Paid" | "Fulfilled" | "Pending" | "Refunded";

type Order = {
  id: string;
  customer: string;
  email: string;
  status: OrderStatus;
  items: number;
  total: string;
  placed: string;
};

const orders: readonly Order[] = [
  {
    id: "LDG-10428",
    customer: "Mira Okafor",
    email: "mira@northbound.co",
    status: "Paid",
    items: 3,
    total: "$418.00",
    placed: "09:42",
  },
  {
    id: "LDG-10427",
    customer: "Tomas Lindqvist",
    email: "tomas@atelier-nord.se",
    status: "Fulfilled",
    items: 1,
    total: "$129.00",
    placed: "09:18",
  },
  {
    id: "LDG-10426",
    customer: "Aiko Tanaka",
    email: "aiko@studio-mono.jp",
    status: "Pending",
    items: 2,
    total: "$246.50",
    placed: "08:57",
  },
  {
    id: "LDG-10425",
    customer: "Daniel Reyes",
    email: "d.reyes@fieldwork.mx",
    status: "Refunded",
    items: 1,
    total: "$86.00",
    placed: "08:31",
  },
  {
    id: "LDG-10424",
    customer: "Noor Haddad",
    email: "noor@twelve-am.ae",
    status: "Paid",
    items: 4,
    total: "$612.40",
    placed: "08:04",
  },
  {
    id: "LDG-10423",
    customer: "Élodie Marchand",
    email: "elodie@maison-v.fr",
    status: "Fulfilled",
    items: 2,
    total: "$204.00",
    placed: "07:48",
  },
  {
    id: "LDG-10422",
    customer: "Ravi Chandran",
    email: "ravi@paper-lane.in",
    status: "Paid",
    items: 1,
    total: "$98.00",
    placed: "07:31",
  },
  {
    id: "LDG-10421",
    customer: "Sofia Bergman",
    email: "sofia@form-arkitektur.se",
    status: "Fulfilled",
    items: 5,
    total: "$742.20",
    placed: "07:12",
  },
  {
    id: "LDG-10420",
    customer: "Jonas Weber",
    email: "jonas@weber-objekt.de",
    status: "Pending",
    items: 2,
    total: "$318.00",
    placed: "06:55",
  },
  {
    id: "LDG-10419",
    customer: "Priya Raman",
    email: "priya@loom-and-co.in",
    status: "Paid",
    items: 3,
    total: "$456.80",
    placed: "06:40",
  },
] as const;

const statusClass: Record<OrderStatus, string> = {
  Paid: "border-transparent bg-foreground/[0.06] text-foreground",
  Fulfilled: "border-border/70 bg-transparent text-muted-foreground",
  Pending: "border-transparent bg-signal/10 text-signal-ink",
  Refunded: "border-transparent bg-destructive/10 text-destructive",
};

export function RecentOrders() {
  return (
    <Card className="panel-hover overflow-hidden p-0 lg:col-span-8">
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-5 pt-5">
        <div className="space-y-1">
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>Last 24 hours · 18 orders</CardDescription>
        </div>
        <Button
          asChild
          className="h-7 gap-1 text-muted-foreground transition-colors duration-200 hover:text-foreground"
          size="xs"
          variant="ghost"
        >
          <a href="#/orders">
            View all
            <IconPlaceholder
              aria-hidden="true"
              data-icon="inline-end"
              lucide="ArrowRightIcon"
            />
          </a>
        </Button>
      </CardHeader>

      <CardContent className="flex-1 px-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-3">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="pr-3 text-right">Placed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow className="cursor-pointer" key={order.id}>
                <TableCell className="pl-3 font-mono text-[11px] text-muted-foreground">
                  {order.id}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium tracking-tight">
                      {order.customer}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {order.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={statusClass[order.status]}
                    variant="outline"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {order.items}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {order.total}
                </TableCell>
                <TableCell className="pr-3 text-right text-muted-foreground">
                  {order.placed}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="mt-auto items-center justify-between border-border/40 border-t px-5 py-3">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
          Showing 10 of 18
        </p>
        <div className="flex items-center gap-1">
          <Button
            aria-label="Previous page"
            className="size-7 text-muted-foreground"
            disabled
            size="icon"
            variant="ghost"
          >
            <IconPlaceholder lucide="ChevronLeftIcon" />
          </Button>
          <Button
            aria-label="Next page"
            className="size-7 text-muted-foreground transition-colors duration-200 hover:text-foreground"
            size="icon"
            variant="ghost"
          >
            <IconPlaceholder lucide="ChevronRightIcon" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
