import { createUrlSearchParams } from '@stefanprobst/request'
import { useRouter } from 'next/router'

import { sanitizeSearchParams } from '@/lib/utils'
import type { ModerateItemsPage } from '@/pages/account/moderate-items'

export interface UseModerateItemsSearchResult {
  getSearchModerateItemsLink: (query: ModerateItemsPage.SearchParamsInput) => {
    href: string
    shallow: boolean
    scroll: boolean
  }
  searchModerateItems: (query: ModerateItemsPage.SearchParamsInput) => Promise<boolean>
}

export function useModerateItemsSearch(): UseModerateItemsSearchResult {
  const router = useRouter()

  function getSearchModerateItemsLink(query: ModerateItemsPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: `/account/moderate-items?${createUrlSearchParams(sanitizeSearchParams(query))}`,
      shallow: true,
      scroll: true,
    }
  }

  function searchModerateItems(query: ModerateItemsPage.SearchParamsInput) {
    return router.push(getSearchModerateItemsLink(query).href, undefined, {
      shallow: true,
      scroll: true,
    })
  }

  return { getSearchModerateItemsLink, searchModerateItems }
}
