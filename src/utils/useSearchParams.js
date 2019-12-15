import { useQueryParams } from './useQueryParams'
import { useMemo } from 'react'

export const useSearchParams = () => {
  const [queryParams, setQueryParams] = useQueryParams()

  const searchParams = useMemo(
    () => ({
      categories: queryParams.getAll('categories'),
      page: parseInt(queryParams.get('page'), 10) || 1,
      query: queryParams.get('query'),
      sort: queryParams.get('sort'),
    }),
    [queryParams]
  )

  return [searchParams, setQueryParams]
}
