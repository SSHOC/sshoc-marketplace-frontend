import { useMemo } from 'react'

import type { Href } from '@/lib/core/navigation/types'
import { useRoute } from '@/lib/core/navigation/useRoute'

export interface Matcher {
  (href: Href, route: URL): boolean
}

const isMatchingPathnames: Matcher = function isMatchingPathnames(href, route) {
  return href.pathname === route.pathname
}

export interface UseIsCurrentRouteArgs {
  href: Href
  isCurrent?: Matcher | boolean | undefined
}

export function useIsCurrentRoute(options: UseIsCurrentRouteArgs): boolean {
  const { href, isCurrent = isMatchingPathnames } = options

  const route = useRoute()

  const isCurrentRoute = useMemo(() => {
    return typeof isCurrent === 'boolean' ? isCurrent : isCurrent(href, route)
  }, [route, href, isCurrent])

  return isCurrentRoute
}
