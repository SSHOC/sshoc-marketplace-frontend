import { useActorSearchFilters } from '@/components/account/useActorSearchFilters'
import { useActorSearch } from '@/data/sshoc/hooks/actor'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useActorSearchResults() {
  const searchFilters = useActorSearchFilters()
  const actorSearch = useActorSearch(searchFilters)

  return actorSearch
}
