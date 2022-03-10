import { useRouter } from 'next/router'

import { routes } from '@/lib/core/navigation/routes'
import type { Href } from '@/lib/core/navigation/types'
import { sanitizeSearchParams } from '@/lib/utils'
import type { UsersPage } from '@/pages/account/users.page'

export interface UseUserSearchResult {
  getSearchUsersLink: (query: UsersPage.SearchParamsInput) => {
    href: Href
    shallow: boolean
    scroll: boolean
  }
  searchUsers: (query: UsersPage.SearchParamsInput) => Promise<boolean>
}

export function useUserSearch(): UseUserSearchResult {
  const router = useRouter()

  function getSearchUsersLink(query: UsersPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return { href: routes.UsersPage(sanitizeSearchParams(query)), shallow: true, scroll: true }
  }

  function searchUsers(query: UsersPage.SearchParamsInput) {
    return router.push(getSearchUsersLink(query).href, undefined, { shallow: true, scroll: true })
  }

  return { getSearchUsersLink, searchUsers }
}
