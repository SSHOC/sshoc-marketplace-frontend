import { Fragment } from 'react'

import { useActorSearchResults } from '@/components/account/useActorSearchResults'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function ActorsBackgroundFetchIndicator(): JSX.Element {
  const searchResults = useActorSearchResults()

  if (!searchResults.isFetching) {
    return <Fragment />
  }

  return <LoadingIndicator />
}
