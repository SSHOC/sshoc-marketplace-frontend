import type { UseQueryResult } from 'react-query'

import { NoSearchResultsFound } from '@/components/common/NoSearchResultsFound'
import { ItemHistorySearchResult } from '@/components/item-history/ItemHistorySearchResult'
import css from '@/components/item-history/ItemHistorySearchResults.module.css'
import type { ItemCategory, ItemHistoryEntry } from '@/data/sshoc/api/item'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export interface ItemHistorySearchResultsProps {
  items: UseQueryResult<Array<ItemHistoryEntry>, Error>
}

export function ItemHistorySearchResults(props: ItemHistorySearchResultsProps): JSX.Element {
  const { items } = props

  if (items.data == null) {
    return (
      <section className={css['container']} data-state="loading">
        <Centered>
          <LoadingIndicator />
        </Centered>
      </section>
    )
  }

  if (items.data.length === 0) {
    return (
      <section className={css['container']} data-state="empty">
        <NoSearchResultsFound />
      </section>
    )
  }

  return (
    <section className={css['container']}>
      <ol role="list" className={css['search-results']}>
        {items.data.map((item) => {
          if (item.category === 'step') return null

          return (
            <li key={[item.persistentId, item.id].join('+')}>
              <ItemHistorySearchResult
                item={item as ItemHistoryEntry & { category: ItemCategory }}
              />
            </li>
          )
        })}
      </ol>
    </section>
  )
}
