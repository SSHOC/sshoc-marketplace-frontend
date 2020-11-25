/**
 * Creates a fully qualified `URL` from a pathname by using a dummy base URL.
 */
export function createUrlFromPath(pathname: string): URL {
  return new URL(pathname, 'http://n')
}
