import { createUrlSearchParams } from '@stefanprobst/request'
import { useRouter } from 'next/router'

import { sanitizeSearchParams } from '@/lib/utils'
import type { ActorsPage } from '@/pages/account/actors.page'

export interface UseActorSearchResult {
  getSearchActorsLink: (query: ActorsPage.SearchParamsInput) => {
    href: string
    shallow: boolean
    scroll: boolean
  }
  searchActors: (query: ActorsPage.SearchParamsInput) => Promise<boolean>
}

export function useActorSearch(): UseActorSearchResult {
  const router = useRouter()

  function getSearchActorsLink(query: ActorsPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: `/account/actors?${createUrlSearchParams(sanitizeSearchParams(query))}`,
      shallow: true,
      scroll: true,
    }
  }

  function searchActors(query: ActorsPage.SearchParamsInput) {
    return router.push(getSearchActorsLink(query).href, undefined, { shallow: true, scroll: true })
  }

  return { getSearchActorsLink, searchActors }
}
