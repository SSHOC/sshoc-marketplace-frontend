import { useMemo } from 'react'

import type { GetSources } from '@/data/sshoc/api/source'
import { isSourceSortOrder } from '@/data/sshoc/api/source'
import { useSearchParams } from '@/lib/core/navigation/useSearchParams'
import { toPositiveInteger } from '@/lib/utils'
import { defaultSourceSortOrder } from '~/config/sshoc.config'

export type SearchFilters = Pick<GetSources.SearchParams, 'order' | 'page' | 'q'>

export function useSourceSearchFilters(): Required<SearchFilters> {
  const searchParams = useSearchParams()

  const searchFilters = useMemo(() => {
    const defaultSearchFilters: Required<SearchFilters> = {
      page: 1,
      q: '',
      order: defaultSourceSortOrder,
    }

    if (searchParams == null) {
      return defaultSearchFilters
    }

    const _page = searchParams.get('page')
    const page = toPositiveInteger(_page) ?? 1

    const _order = searchParams.get('order')
    const order = _order != null && isSourceSortOrder(_order) ? _order : defaultSourceSortOrder

    const searchFilters: Required<SearchFilters> = {
      page,
      q: searchParams.get('q') ?? '',
      order,
    }

    return searchFilters
  }, [searchParams])

  return searchFilters
}
