import type { StaticResult as ContributePages } from '@/lib/core/navigation/contribute-pages.static'
import _contributePages from '@/lib/core/navigation/contribute-pages.static'
import type { NavItems } from '@/lib/core/page/types'

const contributePages = _contributePages as unknown as ContributePages

export function useContributeNavItems(): NavItems {
  const items = contributePages.map((page) => {
    return { id: page.label, label: page.label, href: page.href }
  })

  return items
}
