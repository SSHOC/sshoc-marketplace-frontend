import { useModerateItemsSearchResults } from '@/components/account/useModerateItemsSearchResults'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function ModerateItemsBackgroundFetchIndicator(): JSX.Element | null {
  const searchResults = useModerateItemsSearchResults()

  if (!searchResults.isFetching) {
    return null
  }

  return <LoadingIndicator />
}
