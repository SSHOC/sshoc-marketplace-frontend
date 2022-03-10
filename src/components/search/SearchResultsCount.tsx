import { Fragment } from 'react'

import { ItemsCount } from '@/components/common/ItemsCount'
import { useSearchResults } from '@/components/search/useSearchResults'

export function SearchResultsCount(): JSX.Element {
  const searchResults = useSearchResults()

  if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
    return <Fragment />
  }

  return <ItemsCount count={searchResults.data.hits} />
}
