import { Fragment } from 'react'

import { useDraftItemsSearchResults } from '@/components/account/useDraftItemsSearchResults'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function DraftItemsBackgroundFetchIndicator(): JSX.Element {
  const searchResults = useDraftItemsSearchResults()

  if (!searchResults.isFetching) {
    return <Fragment />
  }

  return <LoadingIndicator />
}
