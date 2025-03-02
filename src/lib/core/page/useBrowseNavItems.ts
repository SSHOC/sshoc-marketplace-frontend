import { useTranslations } from 'next-intl'

import { itemFacets } from '@/data/sshoc/api/item'
import type { NavItems } from '@/lib/core/page/types'

export function useBrowseNavItems(): NavItems {
  const t = useTranslations('common')

  const items = itemFacets.map((id) => {
    const label = t('browse.browse-facet', {
      facet: t(`facets.${id}.other`).toLowerCase(),
    })

    const href = `/browse/${id}`

    return { id, label, href }
  })

  return items
}
