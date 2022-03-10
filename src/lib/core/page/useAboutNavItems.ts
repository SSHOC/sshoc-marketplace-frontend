import type { StaticResult as AboutPages } from '@/lib/core/navigation/about-pages.static'
import _aboutPages from '@/lib/core/navigation/about-pages.static'
import type { NavItems } from '@/lib/core/page/types'

const aboutPages = _aboutPages as unknown as AboutPages

export function useAboutNavItems(): NavItems {
  const items = aboutPages.map((page) => {
    return { id: page.label, label: page.label, href: page.href }
  })

  return items
}
