import type { LinkProps } from 'next/link'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'

import { createUrlFromPath } from '@/utils/createUrlFromPath'

export type UrlObject = Exclude<LinkProps['href'], string>

/**
 * Returns whether the provided `href` matches the current route.
 *
 * By default, matches by pathname, but a custom matching function can be provided.
 */
export function useActiveLink(href: UrlObject, isMatching = isMatchingPathnameExactly): boolean {
  const router = useRouter()
  return isMatching(href, router)
}

/**
 * Match by pathname, ignoring query params.
 */
function isMatchingPathnameExactly(href: UrlObject, router: NextRouter) {
  const { pathname } = createUrlFromPath(router.asPath)
  return href.pathname === pathname
}
