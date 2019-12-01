import { useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

export const useQueryParams = () => {
  const history = useHistory()
  const { search } = useLocation()

  const queryParams = useMemo(() => new URLSearchParams(search), [search])

  const setQueryParams = (params = {}, pathname) => {
    const queryParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value
          .slice()
          .sort()
          .forEach(item => {
            if (item) {
              queryParams.append(key, item)
            }
          })
      } else if (value) {
        queryParams.set(key, value)
      }
    })

    queryParams.sort()

    history.push({ pathname, search: queryParams.toString() })
  }

  return [queryParams, setQueryParams]
}
