import css from '@/components/account/UserSearchResultsFooter.module.css'
import { UserSearchResultsPageNavigation } from '@/components/account/UserSearchResultsPageNavigation'

export function UserSearchResultsFooter(): JSX.Element {
  return (
    <aside className={css['container']}>
      <div className={css['input']}>
        <UserSearchResultsPageNavigation variant="input" />
      </div>
      <div className={css['long']}>
        <UserSearchResultsPageNavigation />
      </div>
    </aside>
  )
}
