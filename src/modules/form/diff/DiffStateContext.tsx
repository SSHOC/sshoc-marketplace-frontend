import { createContext, useContext } from 'react'

import type { DiffState } from '@/modules/form/diff/useDiffState'

export type DiffStateContextValue = Pick<DiffState, 'requiresReview' | 'status'>

export const DiffStateContext = createContext<DiffStateContextValue | null>(
  null,
)

export function useDiffStateContext(): DiffStateContextValue {
  const value = useContext(DiffStateContext)

  if (value === null) {
    throw new Error(
      '`useDiffStateContext` must be nested inside a `DiffStateContext.Provider`.',
    )
  }

  return value
}
