import { useRouter } from 'next/router'

import { routes } from '@/lib/core/navigation/routes'
import type { Href } from '@/lib/core/navigation/types'
import { sanitizeSearchParams } from '@/lib/utils'
import type { VocabulariesPage } from '@/pages/account/vocabularies.page'

export interface UseVocabularySearchResult {
  getSearchVocabulariesLink: (query: VocabulariesPage.SearchParamsInput) => {
    href: Href
    shallow: boolean
    scroll: boolean
  }
  searchVocabularies: (query: VocabulariesPage.SearchParamsInput) => Promise<boolean>
}

export function useVocabularySearch(): UseVocabularySearchResult {
  const router = useRouter()

  function getSearchVocabulariesLink(query: VocabulariesPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: routes.VocabulariesPage(sanitizeSearchParams(query)),
      shallow: true,
      scroll: true,
    }
  }

  function searchVocabularies(query: VocabulariesPage.SearchParamsInput) {
    return router.push(getSearchVocabulariesLink(query).href, undefined, {
      shallow: true,
      scroll: true,
    })
  }

  return { getSearchVocabulariesLink, searchVocabularies }
}
