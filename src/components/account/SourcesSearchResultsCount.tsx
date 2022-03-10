import { Fragment } from 'react'

import { useSourceSearchResults } from '@/components/account/useSourceSearchResults'
import { ItemsCount } from '@/components/common/ItemsCount'

export function SourcesSearchResultsCount(): JSX.Element {
  const searchResults = useSourceSearchResults()

  if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
    return <Fragment />
  }

  return <ItemsCount count={searchResults.data.hits} />
}
