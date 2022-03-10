import { useMemo } from 'react'

import type { Item, ItemsDiff } from '@/data/sshoc/api/item'

export interface UseItemDiffFormInitialValues<T extends Item> {
  diff: ItemsDiff | undefined
  item: T | undefined
}

export function useItemDiffFormInitialValues<T extends Item>(
  args: UseItemDiffFormInitialValues<T>,
): T | undefined {
  const { diff, item } = args

  const initialValues = useMemo(() => {
    if (diff == null || item == null || diff.equal) return item

    const initialValues = { ...item }

    /**
     * Add deleted array field items to initial form values, so we can attach
     * diff metadata to them in `useDiffFormFieldMetadata`.
     */
    Object.entries(diff.item).forEach(([key, value]) => {
      /* @ts-expect-error Not worth fixing types here. */
      if (Array.isArray(value) && value.length > initialValues[key].length) {
        /* @ts-expect-error Not worth fixing types here. */
        initialValues[key] = initialValues[key].concat(
          /* @ts-expect-error Not worth fixing types here. */
          Array(value.length - initialValues[key].length).fill(undefined),
        )
      }
    })

    return initialValues
  }, [diff, item])

  return initialValues
}
