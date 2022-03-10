import { Fragment } from 'react'

import { useUserSearchResults } from '@/components/account/useUserSearchResults'
import { ItemsCount } from '@/components/common/ItemsCount'

export function UsersSearchResultsCount(): JSX.Element {
  const searchResults = useUserSearchResults()

  if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
    return <Fragment />
  }

  return <ItemsCount count={searchResults.data.hits} />
}
