import { useUserSearchResults } from '@/components/account/useUserSearchResults'
import { ItemsCount } from '@/components/common/ItemsCount'

export function UsersSearchResultsCount(): JSX.Element | null {
  const searchResults = useUserSearchResults()

  if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
    return null
  }

  return <ItemsCount count={searchResults.data.hits} />
}
