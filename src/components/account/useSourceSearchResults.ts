import { useSourceSearchFilters } from '@/components/account/useSourceSearchFilters'
import { useSources } from '@/data/sshoc/hooks/source'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useSourceSearchResults() {
  const searchFilters = useSourceSearchFilters()
  const sourceSearch = useSources(searchFilters)

  return sourceSearch
}
