import type { Metadata } from 'next'

import { LedgerCase, LEDGER } from '@/features/ledger'

export const metadata: Metadata = {
  title: 'Ledger — Design System',
  description: `${LEDGER.system}: a commerce dashboard built on shadcn/ui. ${LEDGER.description}`,
  alternates: {
    canonical: LEDGER.href,
    types: { 'text/markdown': `${LEDGER.href}/llms.txt` },
  },
  openGraph: {
    title: 'Ledger — Design System',
    description: LEDGER.tagline,
    type: 'website',
    url: LEDGER.href,
    images: [
      {
        url: '/brand/ledger/ledger-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'The Ledger brand board: the grid mark with one lifted tile, the indigo harbor ramp, the glass recipe and a dashboard specimen.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ledger — Design System',
    description: LEDGER.tagline,
    images: ['/brand/ledger/ledger-brandkit.png'],
  },
}

export default function LedgerCasePage() {
  return <LedgerCase />
}
