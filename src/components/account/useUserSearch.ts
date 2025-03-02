import { createUrlSearchParams } from '@stefanprobst/request'
import { useRouter } from 'next/router'

import { sanitizeSearchParams } from '@/lib/utils'
import type { UsersPage } from '@/pages/account/users'

export interface UseUserSearchResult {
  getSearchUsersLink: (query: UsersPage.SearchParamsInput) => {
    href: string
    shallow: boolean
    scroll: boolean
  }
  searchUsers: (query: UsersPage.SearchParamsInput) => Promise<boolean>
}

export function useUserSearch(): UseUserSearchResult {
  const router = useRouter()

  function getSearchUsersLink(query: UsersPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: `/account/users?${createUrlSearchParams(sanitizeSearchParams(query))}`,
      shallow: true,
      scroll: true,
    }
  }

  function searchUsers(query: UsersPage.SearchParamsInput) {
    return router.push(getSearchUsersLink(query).href, undefined, { shallow: true, scroll: true })
  }

  return { getSearchUsersLink, searchUsers }
}
