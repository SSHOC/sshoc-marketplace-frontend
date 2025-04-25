import type { SearchFilters } from '@/components/account/useVocabularySearchFilters'
import { useVocabularySearchFilters } from '@/components/account/useVocabularySearchFilters'
import { useConceptSearch } from '@/data/sshoc/hooks/vocabulary'
import { convertDynamicPropertySearchParams } from '@/data/sshoc/lib/convertDynamicPropertySearchParams'
import { entries } from '@/lib/utils'

 
export function useVocabularySearchResults() {
  const searchFilters = useVocabularySearchFilters()
  const normalizedSearchFilters = normalizeSearchFilters(searchFilters)
  const searchParams = convertDynamicPropertySearchParams(normalizedSearchFilters)
  const contributedItemsSearch = useConceptSearch(searchParams)

  return contributedItemsSearch
}

function normalizeSearchFilters(filters: SearchFilters) {
  const searchFilters = {} as any

  entries(filters).forEach(([key, value]) => {
    switch (key) {
      case 'f.status': {
        if (Array.isArray(value)) {
          searchFilters['f.candidate'] = value.map((status) => {
            if (status === 'candidate') {return 'true'}
            return 'false'
          })
        }
        break
      }

      default:
        searchFilters[key] = value
    }
  })

  return searchFilters
}
