import { useVocabularySearchResults } from '@/components/account/useVocabularySearchResults'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function VocabulariesBackgroundFetchIndicator(): JSX.Element | null {
  const searchResults = useVocabularySearchResults()

  if (!searchResults.isFetching) {
    return null
  }

  return <LoadingIndicator />
}
