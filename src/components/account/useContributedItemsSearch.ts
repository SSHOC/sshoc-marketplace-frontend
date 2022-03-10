import { useRouter } from 'next/router'

import { routes } from '@/lib/core/navigation/routes'
import type { Href } from '@/lib/core/navigation/types'
import { sanitizeSearchParams } from '@/lib/utils'
import type { ContributedItemsPage } from '@/pages/account/contributed-items.page'

export interface UseContributedItemsSearchResult {
  getSearchContributedItemsLink: (query: ContributedItemsPage.SearchParamsInput) => {
    href: Href
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
      href: routes.ContributedItemsPage(sanitizeSearchParams(query)),
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
