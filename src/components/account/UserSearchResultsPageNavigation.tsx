import { useUserSearch } from '@/components/account/useUserSearch'
import { useUserSearchFilters } from '@/components/account/useUserSearchFilters'
import { useUserSearchResults } from '@/components/account/useUserSearchResults'
import { Pagination } from '@/components/common/Pagination'

export interface UserSearchResultsPageNavigationProps {
  /** @default 'primary' */
  variant?: 'input' | 'primary'
}

export function UserSearchResultsPageNavigation(
  props: UserSearchResultsPageNavigationProps,
): JSX.Element {
  const searchResults = useUserSearchResults()
  const searchFilters = useUserSearchFilters()
  const { getSearchUsersLink, searchUsers } = useUserSearch()

  const variant = props.variant ?? 'primary'

  return (
    <Pagination
      searchFilters={searchFilters}
      searchResults={searchResults}
      getSearchItemsLink={getSearchUsersLink}
      searchItems={searchUsers}
      variant={variant}
    />
  )
}
