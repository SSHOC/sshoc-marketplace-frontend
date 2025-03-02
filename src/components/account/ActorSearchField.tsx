import { useTranslations } from 'next-intl'

import { useActorSearch } from '@/components/account/useActorSearch'
import { SearchField } from '@/lib/core/ui/SearchField/SearchField'

export function ActorSearchField(): JSX.Element {
  const t = useTranslations('authenticated')
  const { searchActors } = useActorSearch()

  function onSubmit(value: string) {
    searchActors({ q: value })
  }

  return <SearchField aria-label={t('actors.search-actors')} onSubmit={onSubmit} />
}
