import type { Metadata } from 'next'

import { LedgerDashboardPage, LEDGER } from '@/features/ledger'

/**
 * The live dashboard. It is the proof for the case, not a second landing page,
 * so it points its canonical at `/design-system/ledger` and stays out of the
 * index — a demo storefront should not compete with the case that explains it.
 */
export const metadata: Metadata = {
  title: 'Ledger — Commerce overview',
  description:
    'The live Ledger dashboard: four glass KPIs, one revenue chart, a category mix, an orders table and a returns card, on the Tactile Glass & Crisp Grid system.',
  alternates: { canonical: LEDGER.href },
  robots: { index: false, follow: true },
}

export default function LedgerDashboardRoute() {
  return <LedgerDashboardPage />
}
