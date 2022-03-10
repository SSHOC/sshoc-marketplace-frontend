import { Fragment } from 'react'

import { useContributedItemsSearchResults } from '@/components/account/useContributedItemsSearchResults'
import { ItemsCount } from '@/components/common/ItemsCount'

export function ContributedItemsSearchResultsCount(): JSX.Element {
  const searchResults = useContributedItemsSearchResults()

  if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
    return <Fragment />
  }

  return <ItemsCount count={searchResults.data.hits} />
}
