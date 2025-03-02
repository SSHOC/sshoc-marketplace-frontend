import { itemFacets } from '@/data/sshoc/api/item'
import { useTranslations } from 'next-intl'
import type { NavItems } from '@/lib/core/page/types'

export function useBrowseNavItems(): NavItems {
  const t = useTranslations('common')

  const items = itemFacets.map((id) => {
    const label = t(['common', 'browse', 'browse-facet'], {
      values: { facet: t(['common', 'facets', id, 'other']).toLowerCase() },
    })

    const href = `/browse/${id}`

    return { id, label, href }
  })

  return items
}
