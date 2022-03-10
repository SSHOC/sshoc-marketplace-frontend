import { ContributedItemSearchResult } from '@/components/account/ContributedItemSearchResult'
import css from '@/components/account/ContributedItemSearchResults.module.css'
import { useContributedItemsSearchResults } from '@/components/account/useContributedItemsSearchResults'
import { NoSearchResultsFound } from '@/components/common/NoSearchResultsFound'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function ContributedItemSearchResults(): JSX.Element {
  const contributedItemSearch = useContributedItemsSearchResults()

  if (contributedItemSearch.data == null) {
    return (
      <section className={css['container']} data-state="loading">
        <Centered>
          <LoadingIndicator />
        </Centered>
      </section>
    )
  }

  if (contributedItemSearch.data.items.length === 0) {
    return (
      <section className={css['container']} data-state="empty">
        <NoSearchResultsFound />
      </section>
    )
  }

  return (
    <section className={css['container']}>
      <ul role="list" className={css['search-results']}>
        {contributedItemSearch.data.items.map((item) => {
          if (item.category === 'step') return null

          return (
            <li key={[item.persistentId, item.id].join('+')}>
              <ContributedItemSearchResult item={item} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
