import { Fragment } from 'react'

import { useVocabularySearchResults } from '@/components/account/useVocabularySearchResults'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function VocabulariesBackgroundFetchIndicator(): JSX.Element {
  const searchResults = useVocabularySearchResults()

  if (!searchResults.isFetching) {
    return <Fragment />
  }

  return <LoadingIndicator />
}
