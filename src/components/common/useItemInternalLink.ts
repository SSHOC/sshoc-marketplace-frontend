import { itemRoutes as routes } from '@/lib/core/navigation/item-routes'

export interface UseItemInternalLinkArgs {}

export interface UseItemInternalLinkResult {}

export function useItemInternalLink(args) {
  const href = routes.ItemPage(category)({ persistentId })
}
