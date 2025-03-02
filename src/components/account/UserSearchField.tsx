import { useTranslations } from 'next-intl'

import { useUserSearch } from '@/components/account/useUserSearch'
import { SearchField } from '@/lib/core/ui/SearchField/SearchField'

export function UserSearchField(): JSX.Element {
  const t = useTranslations('authenticated')
  const { searchUsers } = useUserSearch()

  function onSubmit(value: string) {
    searchUsers({ q: value })
  }

  return <SearchField aria-label={t('users.search-users')} onSubmit={onSubmit} />
}
