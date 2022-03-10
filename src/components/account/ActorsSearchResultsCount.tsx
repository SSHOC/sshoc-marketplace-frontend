import { Fragment } from 'react'

import { useActorSearchResults } from '@/components/account/useActorSearchResults'
import { ItemsCount } from '@/components/common/ItemsCount'

export function ActorsSearchResultsCount(): JSX.Element {
  const searchResults = useActorSearchResults()

  if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
    return <Fragment />
  }

  return <ItemsCount count={searchResults.data.hits} />
}
