import { Item } from '@react-stately/collections'
import { useTranslations } from 'next-intl'
import type { Key } from 'react'

import { useDraftItemsSearch } from '@/components/account/useDraftItemsSearch'
import { useDraftItemsSearchFilters } from '@/components/account/useDraftItemsSearchFilters'
import type { ItemDraftSortOrder } from '@/data/sshoc/api/item'
import { itemDraftSortOrders } from '@/data/sshoc/api/item'
import { Select } from '@/lib/core/ui/Select/Select'

export function DraftItemsSearchSortOrderSelect(): JSX.Element {
  const t = useTranslations('authenticated')
  const searchFilters = useDraftItemsSearchFilters()
  const sortOrder = searchFilters.order
  const { searchDraftItems } = useDraftItemsSearch()

  const items = itemDraftSortOrders.map((id) => {
    return {
      id,
      label: t('draft-items.sort-by', {
        order: t(`draft-items.sort-orders.${id}`),
      }),
    }
  })

  function onChange(key: Key) {
    const searchParams = { ...searchFilters, order: key as ItemDraftSortOrder }
    searchDraftItems(searchParams)
  }

  return (
    <Select
      aria-label={t('draft-items.sort-order')}
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
