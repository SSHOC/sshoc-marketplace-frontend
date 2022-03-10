import { useMemo } from 'react'

import type { ItemSearch, ItemStatus } from '@/data/sshoc/api/item'
import { isItemCategory, isItemStatus } from '@/data/sshoc/api/item'
import type { User } from '@/data/sshoc/api/user'
import { useSearchParams } from '@/lib/core/navigation/useSearchParams'
import { toPositiveInteger } from '@/lib/utils'
import { defaultContributedItemsSortOrder, isContributedItemSortOrder } from '~/config/sshoc.config'

const defaultItemStatus: ItemStatus = 'approved'

export type SearchFilters = Pick<
  ItemSearch.SearchParams,
  'categories' | 'f.activity' | 'f.keyword' | 'f.language' | 'f.source' | 'order' | 'page' | 'q'
> & {
  /**
   * The backend expects dynamic properties as flat string queries which can be passed
   * directly to olr But on the client it makes more sense to store array values.
   * They are converted back to the shape the backend expects with `convertDynamicSearchParams`.
   */
  'd.status'?: Array<ItemStatus>
  'd.owner'?: Array<User['username']>
}

export function useContributedItemsSearchFilters(): Required<SearchFilters> {
  const searchParams = useSearchParams()

  const searchFilters = useMemo(() => {
    const defaultSearchFilters: Required<SearchFilters> = {
      page: 1,
      order: [defaultContributedItemsSortOrder],
      q: '',
      categories: [],
      'f.activity': [],
      'f.keyword': [],
      'f.language': [],
      'f.source': [],
      'd.status': [defaultItemStatus],
      'd.owner': [],
    }

    if (searchParams == null) {
      return defaultSearchFilters
    }

    const _page = searchParams.get('page')
    const page = toPositiveInteger(_page) ?? 1

    const _order = searchParams.getAll('order').filter(isContributedItemSortOrder)
    const order = _order.length > 0 ? _order : [defaultContributedItemsSortOrder]

    const _status = searchParams.getAll('d.status').filter(isItemStatus)
    const status = _status.length > 0 ? _status : [defaultItemStatus]

    const searchFilters: Required<SearchFilters> = {
      page,
      order,
      q: searchParams.get('q') ?? '',
      categories: searchParams.getAll('categories').filter(isItemCategory),
      'f.activity': searchParams.getAll('f.activity'),
      'f.keyword': searchParams.getAll('f.keyword'),
      'f.language': searchParams.getAll('f.language'),
      'f.source': searchParams.getAll('f.source'),
      'd.status': status,
      'd.owner': searchParams.getAll('d.owner'),
    }

    return searchFilters
  }, [searchParams])

  return searchFilters
}
