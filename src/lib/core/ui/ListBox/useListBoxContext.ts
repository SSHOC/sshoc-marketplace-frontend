import type { ListState } from '@react-stately/list'
import { useContext } from 'react'

import { ListBoxContext } from '@/lib/core/ui/ListBox/ListBoxContext'
import { assert } from '@/lib/utils'

export function useListBoxContext<T extends object>(): ListState<T> {
  const value = useContext(ListBoxContext)

  assert(value != null)

  return value as ListState<T>
}
