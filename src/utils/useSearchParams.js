import { useMemo } from 'react'
import { DEFAULT_SORT_FIELD } from '../constants'
import { useQueryParams } from './useQueryParams'

export const useSearchParams = () => {
  const [queryParams, setQueryParams] = useQueryParams()

  const searchParams = useMemo(() => {
    let facets = {}
    try {
      facets = JSON.parse(queryParams.get('facets') || '{}')
    } catch (error) {
      // noop
    }

    return {
      categories: queryParams.getAll('categories'),
      facets,
      page: parseInt(queryParams.get('page'), 10) || 1,
      query: queryParams.get('query'),
      sort: queryParams.get('sort') || DEFAULT_SORT_FIELD,
    }
  }, [queryParams])

  const setSearchParams = (
    { categories, facets, page, query, sort },
    pathname
  ) =>
    setQueryParams(
      {
        categories,
        facets:
          facets && typeof facets === 'object' && Object.keys(facets).length
            ? JSON.stringify(facets)
            : undefined,
        page: page === 1 ? undefined : page,
        query,
        sort: sort === DEFAULT_SORT_FIELD ? undefined : sort,
      },
      pathname
    )

  return [searchParams, setSearchParams]
}
