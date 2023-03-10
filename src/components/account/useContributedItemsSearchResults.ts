import { useContributedItemsSearchFilters } from '@/components/account/useContributedItemsSearchFilters'
import { useCurrentUser } from '@/data/sshoc/hooks/auth'
import { useItemSearch } from '@/data/sshoc/hooks/item'
import { convertDynamicPropertySearchParams } from '@/data/sshoc/lib/convertDynamicPropertySearchParams'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useContributedItemsSearchResults() {
  const currentUser = useCurrentUser()
  const searchFilters = useContributedItemsSearchFilters()
  const searchParams = {
    ...convertDynamicPropertySearchParams(searchFilters),
    /**
     * Explicitly adding `owner` even though it is not required for non-admin users,
     * which will only see non-approved versions they are the owner of (determined by the access token).
     * However, an access token with admin privilige will return *all* items for the
     * specified item status. Explicitly sending `d.owner` should only return items which are
     * actually owned by the admin user.
     *
     * FIXME: The problem is that `owner` will be set to the person approving an item. So a user
     * will not be able to see contributed items which have been approved, because they are now
     * "owned" by administrator/moderator.
     * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace/-/issues/102
     */
    'd.owner': currentUser.data?.username ?? '',
  }
  const contributedItemsSearch = useItemSearch(searchParams)

  return contributedItemsSearch
}
