import { createContext, useContext } from 'react'

import type { FieldStatus } from '@/modules/form/diff/types'

export interface DiffFieldState {
  name: string
  index: number
  fields?: any
  isReviewed: boolean
  status: FieldStatus
  approvedValue?: unknown
  suggestedValue?: unknown
  onApprove: () => void
  onReject: () => void
  onRemove: () => void
  arrayRequiresReview?: boolean
}

export const DiffFieldStateContext = createContext<DiffFieldState>({
  name: '',
  status: 'unchanged',
  isReviewed: true,
  onApprove: () => {
    return null
  },
  onReject: () => {
    return null
  },
  onRemove: () => {
    return null
  },
  index: -1,
})

export function useDiffFieldState(): DiffFieldState {
  return useContext(DiffFieldStateContext)
}
