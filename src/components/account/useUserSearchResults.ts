import { useUserSearchFilters } from '@/components/account/useUserSearchFilters'
import { useUsers } from '@/data/sshoc/hooks/user'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useUserSearchResults() {
  const searchFilters = useUserSearchFilters()
  const sourceSearch = useUsers(searchFilters)

  return sourceSearch
}
