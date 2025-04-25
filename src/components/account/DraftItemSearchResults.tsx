import { DraftItemSearchResult } from '@/components/account/DraftItemSearchResult'
import css from '@/components/account/DraftItemSearchResults.module.css'
import { useDraftItemsSearchResults } from '@/components/account/useDraftItemsSearchResults'
import { NoSearchResultsFound } from '@/components/common/NoSearchResultsFound'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export function DraftItemSearchResults(): JSX.Element {
  const draftItemSearch = useDraftItemsSearchResults()

  if (draftItemSearch.data == null) {
    return (
      <section className={css['container']} data-state="loading">
        <Centered>
          <LoadingIndicator />
        </Centered>
      </section>
    )
  }

  if (draftItemSearch.data.items.length === 0) {
    return (
      <section className={css['container']} data-state="empty">
        <NoSearchResultsFound />
      </section>
    )
  }

  return (
    <section className={css['container']}>
      <ul role="list" className={css['search-results']}>
        {draftItemSearch.data.items.map((item) => {
          // FIXME: Check if `getDraftItems` still returns steps or not
          // Also check any other endpoints returning `ItemCore`.
          if (item.category === 'step') {return null}

          return (
            <li key={[item.persistentId, item.id].join('+')}>
              <DraftItemSearchResult item={item} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
