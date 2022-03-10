import { useDraftItemsSearch } from '@/components/account/useDraftItemsSearch'
import { useDraftItemsSearchFilters } from '@/components/account/useDraftItemsSearchFilters'
import { useDraftItemsSearchResults } from '@/components/account/useDraftItemsSearchResults'
import { Pagination } from '@/components/common/Pagination'

export interface DraftItemSearchResultsPageNavigationProps {
  /** @default 'primary' */
  variant?: 'input' | 'primary'
}

export function DraftItemSearchResultsPageNavigation(
  props: DraftItemSearchResultsPageNavigationProps,
): JSX.Element {
  const searchResults = useDraftItemsSearchResults()
  const searchFilters = useDraftItemsSearchFilters()
  const { getSearchDraftItemsLink, searchDraftItems } = useDraftItemsSearch()

  const variant = props.variant ?? 'primary'

  return (
    <Pagination
      searchFilters={searchFilters}
      searchResults={searchResults}
      getSearchItemsLink={getSearchDraftItemsLink}
      searchItems={searchDraftItems}
      variant={variant}
    />
  )
}
