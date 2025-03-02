import { Item } from '@react-stately/collections'
import { useTranslations } from 'next-intl'
import type { Key } from 'react'

import { useContributedItemsSearch } from '@/components/account/useContributedItemsSearch'
import { useContributedItemsSearchFilters } from '@/components/account/useContributedItemsSearchFilters'
import { Select } from '@/lib/core/ui/Select/Select'
import type { ContributedItemSortOrder } from '~/config/sshoc.config'
import { contributedItemsSortOrder } from '~/config/sshoc.config'

export function ContributedItemsSearchSortOrderSelect(): JSX.Element {
  const t = useTranslations('common')
  const searchFilters = useContributedItemsSearchFilters()
  const sortOrder = searchFilters.order
  const { searchContributedItems } = useContributedItemsSearch()

  const items = contributedItemsSortOrder.map((id) => {
    return {
      id,
      label: t('search.sort-by', {
        order: t(`search.sort-orders.${id}`),
      }),
    }
  })

  function onChange(key: Key) {
    const searchParams = { ...searchFilters, order: key as ContributedItemSortOrder }
    searchContributedItems(searchParams)
  }

  return (
    <Select
      aria-label={t('search.sort-order')}
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
