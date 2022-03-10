import css from '@/components/search/SearchResultsFooter.module.css'
import { SearchResultsPageNavigation } from '@/components/search/SearchResultsPageNavigation'

export function SearchResultsFooter(): JSX.Element {
  return (
    <aside className={css['container']}>
      <div className={css['input']}>
        <SearchResultsPageNavigation variant="input" />
      </div>
      <div className={css['long']}>
        <SearchResultsPageNavigation />
      </div>
    </aside>
  )
}
