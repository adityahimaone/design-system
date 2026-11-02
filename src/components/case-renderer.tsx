import React from 'react'

import BluewaterPage from '@/cases/bluewater/page'
import BluewaterLayout from '@/cases/bluewater/layout'
import ClearingPage from '@/cases/clearing/page'
import ClearingLayout from '@/cases/clearing/layout'
import CovePage from '@/cases/cove/page'
import CoveLayout from '@/cases/cove/layout'
import HachurePage from '@/cases/hachure/page'
import HuginnPage from '@/cases/huginn/page'
import HuginnLayout from '@/cases/huginn/layout'
import JakartaCasePage from '@/cases/jakarta/page'
import JakartaLayout from '@/cases/jakarta/layout'
import LedgerCasePage from '@/cases/ledger/page'
import PorphyryPage from '@/cases/porphyry/page'
import PorphyryLayout from '@/cases/porphyry/layout'
import RisoPage from '@/cases/riso/page'
import RisoLayout from '@/cases/riso/layout'
import StrandPage from '@/cases/strand/page'
import StrandLayout from '@/cases/strand/layout'
import VesperPage from '@/cases/vesper/page'
import VesperLayout from '@/cases/vesper/layout'
import VitrinePage from '@/cases/vitrine/page'
import WildflowerWindPage from '@/cases/wildflower-wind/page'
import WildflowerWindLayout from '@/cases/wildflower-wind/layout'

export function CaseRenderer({ slug }: { slug: string }) {
  switch (slug) {
    case 'bluewater':
      return (
        <BluewaterLayout>
          <BluewaterPage />
        </BluewaterLayout>
      )
    case 'clearing':
      return (
        <ClearingLayout>
          <ClearingPage />
        </ClearingLayout>
      )
    case 'cove':
      return (
        <CoveLayout>
          <CovePage />
        </CoveLayout>
      )
    case 'hachure':
      return <HachurePage />
    case 'huginn':
      return (
        <HuginnLayout>
          <HuginnPage />
        </HuginnLayout>
      )
    case 'jakarta':
      return (
        <JakartaLayout>
          <JakartaCasePage />
        </JakartaLayout>
      )
    case 'ledger':
      return <LedgerCasePage />
    case 'porphyry':
      return (
        <PorphyryLayout>
          <PorphyryPage />
        </PorphyryLayout>
      )
    case 'riso':
      return (
        <RisoLayout>
          <RisoPage />
        </RisoLayout>
      )
    case 'strand':
      return (
        <StrandLayout>
          <StrandPage />
        </StrandLayout>
      )
    case 'vesper':
      return (
        <VesperLayout>
          <VesperPage />
        </VesperLayout>
      )
    case 'vitrine':
      return <VitrinePage />
    case 'wildflower-wind':
      return (
        <WildflowerWindLayout>
          <WildflowerWindPage />
        </WildflowerWindLayout>
      )
    default:
      return <div>Not found</div>
  }
}
