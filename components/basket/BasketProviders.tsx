'use client'

import { CreateBasketDialog } from './CreateBasketDialog'
import { SelectBasketDialog } from './SelectBasketDialog'
import { FloatingBasketButton } from './FloatingBasketButton'

// Rendered inside BasketDialogProvider (see app/layout.tsx)
export function BasketGlobalUI() {
  return (
    <>
      <FloatingBasketButton />
      <CreateBasketDialog />
      <SelectBasketDialog />
    </>
  )
}
