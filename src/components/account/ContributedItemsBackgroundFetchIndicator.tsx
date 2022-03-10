import { Fragment } from 'react'

import { useContributedItemsSearchResults } from '@/components/account/useContributedItemsSearchResults'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function ContributedItemsBackgroundFetchIndicator(): JSX.Element {
  const searchResults = useContributedItemsSearchResults()

  if (!searchResults.isFetching) {
    return <Fragment />
  }

  return <LoadingIndicator />
}
