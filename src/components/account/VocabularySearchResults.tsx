import { useVocabularySearchResults } from '@/components/account/useVocabularySearchResults'
import { VocabularySearchResult } from '@/components/account/VocabularySearchResult'
import css from '@/components/account/VocabularySearchResults.module.css'
import { NoSearchResultsFound } from '@/components/common/NoSearchResultsFound'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function VocabularySearchResults(): JSX.Element {
  const vocabularySearch = useVocabularySearchResults()

  if (vocabularySearch.data == null) {
    return (
      <section className={css['container']} data-state="loading">
        <Centered>
          <LoadingIndicator />
        </Centered>
      </section>
    )
  }

  if (vocabularySearch.data.concepts.length === 0) {
    return (
      <section className={css['container']} data-state="empty">
        <NoSearchResultsFound />
      </section>
    )
  }

  return (
    <section className={css['container']}>
      <ul role="list" className={css['search-results']}>
        {vocabularySearch.data.concepts.map((concept) => {
          return (
            <li key={concept.uri}>
              <VocabularySearchResult concept={concept} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
