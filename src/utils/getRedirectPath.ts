export function getRedirectPath(path: string | undefined): string | undefined {
  if (path === undefined) return undefined
  if (path.length === 0) return undefined
  if (path === '/') return undefined
  if (path.startsWith('/auth/')) return undefined
  return path
}
