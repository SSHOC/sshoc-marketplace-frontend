import { Fragment } from 'react'

import { useSearchResults } from '@/components/search/useSearchResults'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function BackgroundFetchIndicator(): JSX.Element {
  const searchResults = useSearchResults()

  if (!searchResults.isFetching) {
    return <Fragment />
  }

  return <LoadingIndicator />
}
