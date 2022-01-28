import type { ReactNode } from 'react'

import { DiffControls } from '@/modules/form/diff/DiffControls'
import { DiffStateContext } from '@/modules/form/diff/DiffStateContext'
import { useDiffState } from '@/modules/form/diff/useDiffState'

export function DiffField({
  children,
  name,
  approvedValue,
  suggestedValue,
  isArrayField = false,
  variant,
}: {
  children: ReactNode
  name: string
  approvedValue: unknown
  suggestedValue: unknown
  isArrayField?: boolean
  /** @default 'input' */
  variant?: 'input' | 'media'
}): JSX.Element {
  const state = useDiffState({
    name,
    approvedValue,
    suggestedValue,
    isArrayField,
  })

  return (
    <DiffStateContext.Provider value={state}>
      {state.requiresReview ? (
        <DiffControls
          onApprove={state.onApprove}
          onReject={state.onReject}
          status={state.status}
          variant={variant}
        >
          {children}
        </DiffControls>
      ) : (
        children
      )}
    </DiffStateContext.Provider>
  )
}
