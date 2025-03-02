import { Item } from '@react-stately/collections'
import { useTranslations } from 'next-intl'
import type { Key } from 'react'

import { useSourceSearch } from '@/components/account/useSourceSearch'
import { useSourceSearchFilters } from '@/components/account/useSourceSearchFilters'
import type { SourceSortOrder } from '@/data/sshoc/api/source'
import { sourceSortOrders } from '@/data/sshoc/api/source'
import { Select } from '@/lib/core/ui/Select/Select'

export function SourcesSearchSortOrderSelect(): JSX.Element {
  const t = useTranslations('authenticated')
  const searchFilters = useSourceSearchFilters()
  const sortOrder = searchFilters.order
  const { searchSources } = useSourceSearch()

  const items = sourceSortOrders.map((id) => {
    return {
      id,
      label: t('sources.sort-by', {
        order: t(`sources.sort-orders.${id}`),
      }),
    }
  })

  function onChange(key: Key) {
    const searchParams = { ...searchFilters, order: key as SourceSortOrder }
    searchSources(searchParams)
  }

  return (
    <Select
      aria-label={t('sources.sort-order')}
      items={items}
      onSelectionChange={onChange}
      selectedKey={sortOrder}
    >
      {(item) => {
        return <Item>{item.label}</Item>
      }}
    </Select>
  )
}
