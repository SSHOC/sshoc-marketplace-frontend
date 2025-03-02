import { Item } from '@react-stately/collections'
import { useTranslations } from 'next-intl'
import type { Key } from 'react'

import { useModerateItemsSearch } from '@/components/account/useModerateItemsSearch'
import { useModerateItemsSearchFilters } from '@/components/account/useModerateItemsSearchFilters'
import { Select } from '@/lib/core/ui/Select/Select'
import type { ModerateItemSortOrder } from '~/config/sshoc.config'
import { moderateItemsSortOrder } from '~/config/sshoc.config'

export function ModerateItemsSearchSortOrderSelect(): JSX.Element {
  const t = useTranslations('common')
  const searchFilters = useModerateItemsSearchFilters()
  const sortOrder = searchFilters.order[0]
  const { searchModerateItems } = useModerateItemsSearch()

  const items = moderateItemsSortOrder.map((id) => {
    return {
      id,
      label: t('search.sort-by', {
        order: t(`search.sort-orders.${id}`),
      }),
    }
  })

  function onChange(key: Key) {
    const searchParams = { ...searchFilters, order: [key as ModerateItemSortOrder] }
    searchModerateItems(searchParams)
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
