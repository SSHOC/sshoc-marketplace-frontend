import { Item } from '@react-stately/collections'
import { useTranslations } from 'next-intl'
import type { Key } from 'react'

import { useUserSearch } from '@/components/account/useUserSearch'
import { useUserSearchFilters } from '@/components/account/useUserSearchFilters'
import type { UserSortOrder } from '@/data/sshoc/api/user'
import { userSortOrders } from '@/data/sshoc/api/user'
import { Select } from '@/lib/core/ui/Select/Select'

export function UsersSearchSortOrderSelect(): JSX.Element {
  const t = useTranslations('authenticated')
  const searchFilters = useUserSearchFilters()
  const sortOrder = searchFilters.order
  const { searchUsers } = useUserSearch()

  const items = userSortOrders.map((id) => {
    return {
      id,
      label: t('users.sort-by', {
        order: t(`users.sort-orders.${id}`),
      }),
    }
  })

  function onChange(key: Key) {
    const searchParams = { ...searchFilters, order: key as UserSortOrder }
    searchUsers(searchParams)
  }

  return (
    <Select
      aria-label={t('users.sort-order')}
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
