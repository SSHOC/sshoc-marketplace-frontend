import { useRouter } from 'next/router'

import { routes } from '@/lib/core/navigation/routes'
import type { Href } from '@/lib/core/navigation/types'
import { sanitizeSearchParams } from '@/lib/utils'
import type { ActorsPage } from '@/pages/account/actors.page'

export interface UseActorSearchResult {
  getSearchActorsLink: (query: ActorsPage.SearchParamsInput) => {
    href: Href
    shallow: boolean
    scroll: boolean
  }
  searchActors: (query: ActorsPage.SearchParamsInput) => Promise<boolean>
}

export function useActorSearch(): UseActorSearchResult {
  const router = useRouter()

  function getSearchActorsLink(query: ActorsPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return { href: routes.ActorsPage(sanitizeSearchParams(query)), shallow: true, scroll: true }
  }

  function searchActors(query: ActorsPage.SearchParamsInput) {
    return router.push(getSearchActorsLink(query).href, undefined, { shallow: true, scroll: true })
  }

  return { getSearchActorsLink, searchActors }
}
