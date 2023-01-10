import type { ItemDraftSortOrder, ItemSortOrder, ItemStatus } from '@/data/sshoc/api/item'
import { itemSortOrders, itemStatus } from '@/data/sshoc/api/item'
import type { SourceSortOrder } from '@/data/sshoc/api/source'
import type { UserSortOrder } from '@/data/sshoc/api/user'

export const maxBrowseFacets = 20

export const maxLastAddedItems = 5

export const maxRecommendedItemsPerCategory = 2

/** Visible text might be shorter because of css `line-clamp`. */
export const maxPreviewDescriptionLength = 420

export const maxPreviewMetadataValues = 5

export const defaultItemSearchResultsSortOrder: ItemSortOrder = 'score'

export function isContributedItemSortOrder(order: string): order is ContributedItemSortOrder {
  return itemSortOrders.includes(order as ContributedItemSortOrder)
}

function isAllowedContributedItemSortOrder(
  order: ItemSortOrder,
): order is Exclude<ItemSortOrder, 'score'> {
  return order !== 'score'
}

export const contributedItemsSortOrder = itemSortOrders.filter(isAllowedContributedItemSortOrder)

export type ContributedItemSortOrder = typeof contributedItemsSortOrder[number]

export const defaultContributedItemsSortOrder: ContributedItemSortOrder = 'modified-on'

export function isModerateItemSortOrder(order: string): order is ModerateItemSortOrder {
  return itemSortOrders.includes(order as ModerateItemSortOrder)
}

function isAllowedModerateItemSortOrder(
  order: ItemSortOrder,
): order is Exclude<ItemSortOrder, 'score'> {
  return order !== 'score'
}

export const moderateItemsSortOrder = itemSortOrders.filter(isAllowedModerateItemSortOrder)

export type ModerateItemSortOrder = typeof contributedItemsSortOrder[number]

export const defaultModerateItemsSortOrder: ModerateItemSortOrder = 'modified-on'

export const defaultSourceSortOrder: SourceSortOrder = 'name'

export const defaultUserSortOrder: UserSortOrder = 'username'

export const defaultDraftItemSortOrder: ItemDraftSortOrder = 'modified-on'

function isSupportedItemStatusQuery(status: ItemStatus): status is ItemStatus {
  /** Item with these status are not indexed in solr and can therefore not be queried with `d.status` parameter. */
  const nonIndexedStatus: Array<ItemStatus> = ['draft', 'deprecated', 'disapproved']
  return !nonIndexedStatus.includes(status)
}

export const queryableItemStatus: Array<ItemStatus> = itemStatus.filter(isSupportedItemStatusQuery)

export const maxItemSearchFacetValues = 10

export const initialRelatedItemsCount = 4

export const relatedItemsPage = 10

export const debounceDelay = 150 /** ms */

export const baseUrl = process.env['NEXT_PUBLIC_SSHOC_API_BASE_URL'] ?? 'http://localhost:8080'
