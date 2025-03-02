import { createUrlSearchParams } from '@stefanprobst/request'
import { useRouter } from 'next/router'

import { sanitizeSearchParams } from '@/lib/utils'
import type { ContributedItemsPage } from '@/pages/account/contributed-items'

export interface UseContributedItemsSearchResult {
  getSearchContributedItemsLink: (query: ContributedItemsPage.SearchParamsInput) => {
    href: string
    shallow: boolean
    scroll: boolean
  }
  searchContributedItems: (query: ContributedItemsPage.SearchParamsInput) => Promise<boolean>
}

export function useContributedItemsSearch(): UseContributedItemsSearchResult {
  const router = useRouter()

  function getSearchContributedItemsLink(query: ContributedItemsPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: `/account/contributed-items?${createUrlSearchParams(sanitizeSearchParams(query))}`,
      shallow: true,
      scroll: true,
    }
  }

  function searchContributedItems(query: ContributedItemsPage.SearchParamsInput) {
    return router.push(getSearchContributedItemsLink(query).href, undefined, {
      shallow: true,
      scroll: true,
    })
  }

  return { getSearchContributedItemsLink, searchContributedItems }
}
