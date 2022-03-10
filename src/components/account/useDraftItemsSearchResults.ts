import { useDraftItemsSearchFilters } from '@/components/account/useDraftItemsSearchFilters'
import { useDraftItems } from '@/data/sshoc/hooks/item'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useDraftItemsSearchResults() {
  const searchFilters = useDraftItemsSearchFilters()
  const draftItemsSearch = useDraftItems(searchFilters)

  return draftItemsSearch
}
