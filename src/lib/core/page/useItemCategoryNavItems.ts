import { createUrlSearchParams } from '@stefanprobst/request'

import type { ItemCategory } from '@/data/sshoc/api/item'
import { useItemCategories } from '@/data/sshoc/hooks/item'
import { useTranslations } from 'next-intl'
import type { NavItems } from '@/lib/core/page/types'
import { keys } from '@/lib/utils'

export function useItemCategoryNavItems(): NavItems | null {
  const t = useTranslations('common')
  const itemCategories = useItemCategories()

  if (itemCategories.data == null) return null

  const items = keys(itemCategories.data)
    .filter((category): category is ItemCategory => {
      return category !== 'step'
    })
    .map((category) => {
      return {
        id: category,
        label: t(['common', 'item-categories', category, 'other']),
        href: `/search?${createUrlSearchParams({ categories: [category] })}`,
      }
    })

  return items
}
