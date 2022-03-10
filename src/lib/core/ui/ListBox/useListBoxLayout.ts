import { useCollator } from '@react-aria/i18n'
import { ListLayout } from '@react-stately/layout'
import type { ListState } from '@react-stately/list'
import { useMemo } from 'react'

export function useListBoxLayout<T extends object>(state: ListState<T>): ListLayout<T> {
  const collator = useCollator({ usage: 'search', sensitivity: 'base' })
  const layout = useMemo(() => {
    return new ListLayout<T>({
      collator,
      estimatedHeadingHeight: 26,
      estimatedRowHeight: 36,
      loaderHeight: 40,
      padding: 4,
      placeholderHeight: 36,
    })
  }, [collator])

  layout.collection = state.collection
  layout.disabledKeys = state.disabledKeys

  return layout
}
