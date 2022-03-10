import { Fragment } from 'react'

import { useUserSearchResults } from '@/components/account/useUserSearchResults'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function UsersBackgroundFetchIndicator(): JSX.Element {
  const searchResults = useUserSearchResults()

  if (!searchResults.isFetching) {
    return <Fragment />
  }

  return <LoadingIndicator />
}
