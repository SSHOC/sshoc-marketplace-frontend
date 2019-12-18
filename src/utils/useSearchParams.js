import { useMemo } from 'react'
import { DEFAULT_SORT_FIELD } from '../constants'
import { useQueryParams } from './useQueryParams'

export const useSearchParams = () => {
  const [queryParams, setQueryParams] = useQueryParams()

  const searchParams = useMemo(
    () => ({
      categories: queryParams.getAll('categories'),
      page: parseInt(queryParams.get('page'), 10) || 1,
      query: queryParams.get('query'),
      sort: queryParams.get('sort') || DEFAULT_SORT_FIELD,
    }),
    [queryParams]
  )

  const setSearchParams = ({ categories, page, query, sort }, pathname) =>
    setQueryParams(
      {
        categories,
        page: page === 1 ? undefined : page,
        query,
        sort: sort === DEFAULT_SORT_FIELD ? undefined : sort,
      },
      pathname
    )

  return [searchParams, setSearchParams]
}
