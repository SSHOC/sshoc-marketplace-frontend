import { useRouter } from 'next/router'

import { routes } from '@/lib/core/navigation/routes'
import type { Href } from '@/lib/core/navigation/types'
import { sanitizeSearchParams } from '@/lib/utils'
import type { ModerateItemsPage } from '@/pages/account/moderate-items.page'

export interface UseModerateItemsSearchResult {
  getSearchModerateItemsLink: (query: ModerateItemsPage.SearchParamsInput) => {
    href: Href
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
      href: routes.ModerateItemsPage(sanitizeSearchParams(query)),
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
