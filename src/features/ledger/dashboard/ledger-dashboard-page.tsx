import { CaseChrome } from '@/features/ledger/case/case-chrome'
import { Dashboard } from '@/features/ledger/dashboard/dashboard'
import { AppShell } from '@/features/ledger/dashboard/shell/app-shell'

/**
 * The live dashboard, in the shape the system ships it: a scoped `[data-ledger]`
 * subtree so the portfolio's own tokens never leak in, and the site chrome
 * retired while the rail is on screen.
 *
 * The field paints at z-0 and the shell sits at z-10. `-z-10` cannot be used
 * here: the scoped wrapper carries the opaque canvas colour, and a negative
 * child would paint underneath it.
 */
export function LedgerDashboardPage() {
  return (
    <div data-ledger className="ledger-canvas relative min-h-svh">
      <CaseChrome />
      <div className="relative z-10">
        <AppShell>
          <Dashboard />
        </AppShell>
      </div>
    </div>
  )
}
