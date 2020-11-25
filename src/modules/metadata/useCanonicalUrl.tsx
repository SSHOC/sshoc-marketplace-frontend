import { useRouter } from 'next/router'

/**
 * Returns the current route's canonical url, given a site's base url.
 */
export function useCanonicalUrl(baseUrl: string): string {
  const { asPath } = useRouter()
  const { pathname } = new URL(asPath, baseUrl)
  return String(new URL(pathname, baseUrl))
}
