import { useActorSearch } from '@/components/account/useActorSearch'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { SearchField } from '@/lib/core/ui/SearchField/SearchField'

export function ActorSearchField(): JSX.Element {
  const { t } = useI18n<'authenticated'>()
  const { searchActors } = useActorSearch()

  function onSubmit(value: string) {
    searchActors({ q: value })
  }

  return (
    <SearchField aria-label={t(['authenticated', 'actors', 'search-actors'])} onSubmit={onSubmit} />
  )
}
