import { useTranslations } from 'next-intl'

import { useSourceSearch } from '@/components/account/useSourceSearch'
import { SearchField } from '@/lib/core/ui/SearchField/SearchField'

export function SourceSearchField(): JSX.Element {
  const t = useTranslations('authenticated')
  const { searchSources } = useSourceSearch()

  function onSubmit(value: string) {
    searchSources({ q: value })
  }

  return <SearchField aria-label={t('sources.search-sources')} onSubmit={onSubmit} />
}
