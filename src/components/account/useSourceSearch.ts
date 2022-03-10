import { useRouter } from 'next/router'

import { routes } from '@/lib/core/navigation/routes'
import type { Href } from '@/lib/core/navigation/types'
import { sanitizeSearchParams } from '@/lib/utils'
import type { SourcesPage } from '@/pages/account/sources.page'

export interface UseSourceSearchResult {
  getSearchSourcesLink: (query: SourcesPage.SearchParamsInput) => {
    href: Href
    shallow: boolean
    scroll: boolean
  }
  searchSources: (query: SourcesPage.SearchParamsInput) => Promise<boolean>
}

export function useSourceSearch(): UseSourceSearchResult {
  const router = useRouter()

  function getSearchSourcesLink(query: SourcesPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return { href: routes.SourcesPage(sanitizeSearchParams(query)), shallow: true, scroll: true }
  }

  function searchSources(query: SourcesPage.SearchParamsInput) {
    return router.push(getSearchSourcesLink(query).href, undefined, { shallow: true, scroll: true })
  }

  return { getSearchSourcesLink, searchSources }
}
