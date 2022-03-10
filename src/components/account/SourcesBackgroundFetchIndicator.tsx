import { Fragment } from 'react'

import { useSourceSearchResults } from '@/components/account/useSourceSearchResults'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function SourcesBackgroundFetchIndicator(): JSX.Element {
  const searchResults = useSourceSearchResults()

  if (!searchResults.isFetching) {
    return <Fragment />
  }

  return <LoadingIndicator />
}
