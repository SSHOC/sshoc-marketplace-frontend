import { Fragment } from 'react'

import { useModerateItemsSearchResults } from '@/components/account/useModerateItemsSearchResults'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function ModerateItemsBackgroundFetchIndicator(): JSX.Element {
  const searchResults = useModerateItemsSearchResults()

  if (!searchResults.isFetching) {
    return <Fragment />
  }

  return <LoadingIndicator />
}
