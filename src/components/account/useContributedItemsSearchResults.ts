import { useContributedItemsSearchFilters } from '@/components/account/useContributedItemsSearchFilters'
import { useContributedItems } from '@/data/sshoc/hooks/item'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useContributedItemsSearchResults() {
  const searchFilters = useContributedItemsSearchFilters()
  const searchParams = searchFilters
  const contributedItemsSearch = useContributedItems(searchParams)

  return contributedItemsSearch
}
