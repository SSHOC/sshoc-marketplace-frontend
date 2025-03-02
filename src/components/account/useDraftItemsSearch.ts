import { createUrlSearchParams } from '@stefanprobst/request'
import { useRouter } from 'next/router'

import { sanitizeSearchParams } from '@/lib/utils'
import type { DraftItemsPage } from '@/pages/account/draft-items'

export interface UseDraftItemsSearchResult {
  getSearchDraftItemsLink: (query: DraftItemsPage.SearchParamsInput) => {
    href: string
    shallow: boolean
    scroll: boolean
  }
  searchDraftItems: (query: DraftItemsPage.SearchParamsInput) => Promise<boolean>
}

export function useDraftItemsSearch(): UseDraftItemsSearchResult {
  const router = useRouter()

  function getSearchDraftItemsLink(query: DraftItemsPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: `/account/draft-items?${createUrlSearchParams(sanitizeSearchParams(query))}`,
      shallow: true,
      scroll: true,
    }
  }

  function searchDraftItems(query: DraftItemsPage.SearchParamsInput) {
    return router.push(getSearchDraftItemsLink(query).href, undefined, {
      shallow: true,
      scroll: true,
    })
  }

  return { getSearchDraftItemsLink, searchDraftItems }
}
