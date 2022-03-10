import { useSearchFilters } from '@/components/search/useSearchFilters'
import { useItemSearch } from '@/data/sshoc/hooks/item'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useSearchResults() {
  const searchFilters = useSearchFilters()
  const itemSearch = useItemSearch(searchFilters)

  return itemSearch
}
