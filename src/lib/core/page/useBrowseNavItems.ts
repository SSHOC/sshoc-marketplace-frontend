import { itemFacets } from '@/data/sshoc/api/item'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { routes } from '@/lib/core/navigation/routes'
import type { NavItems } from '@/lib/core/page/types'

export function useBrowseNavItems(): NavItems {
  const { t } = useI18n<'common'>()

  const items = itemFacets.map((id) => {
    const label = t(['common', 'browse', 'browse-facet'], {
      values: { facet: t(['common', 'facets', id, 'other']).toLowerCase() },
    })

    const href = routes.BrowsePage({ id })

    return { id, label, href }
  })

  return items
}
