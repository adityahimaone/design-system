import { CategoryRankChart } from "@/features/ledger/dashboard/category-rank-chart";
import { QuickActions } from "@/features/ledger/dashboard/quick-actions";
import { RecentOrders } from "@/features/ledger/dashboard/recent-orders";
import { RefundReturnRateChart } from "@/features/ledger/dashboard/refund-return-rate-chart";
import { RevenueChart } from "@/features/ledger/dashboard/revenue-chart";
import { DashboardStats } from "@/features/ledger/dashboard/stats";
import { PageHead } from "@/features/ledger/dashboard/page-head";

export function Dashboard() {
  return (
    <div className="flex flex-col gap-5">
      <PageHead />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
        <DashboardStats />
        <RevenueChart />
        <CategoryRankChart />
        <RecentOrders />
        <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-4">
          <RefundReturnRateChart />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
