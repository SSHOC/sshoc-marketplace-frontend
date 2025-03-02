import { useTranslations } from 'next-intl'

import { useVocabularySearch } from '@/components/account/useVocabularySearch'
import { SearchField } from '@/lib/core/ui/SearchField/SearchField'

export function VocabularySearchField(): JSX.Element {
  const t = useTranslations('authenticated')
  const { searchVocabularies } = useVocabularySearch()

  function onSubmit(value: string) {
    searchVocabularies({ q: value })
  }

  return <SearchField aria-label={t('concepts.search-concepts')} onSubmit={onSubmit} />
}
