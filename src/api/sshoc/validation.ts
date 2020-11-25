/**
 * Helpers for runtime validation.
 *
 * Ideally these would be created from typescript with [io-ts](https://github.com/gcanti/io-ts)
 * or [runtypes](https://github.com/pelotom/runtypes).
 */

import type { ParsedUrlQuery } from 'querystring'
import type {
  ItemCategory,
  ItemSearchQuery,
  ItemSortOrder,
} from '@/api/sshoc/types'
import { ensureArray } from '@/utils/ensureArray'
import { ensureScalar } from '@/utils/ensureScalar'

/**
 * Item categories.
 */
export const itemCategories: Array<Exclude<ItemCategory, 'step'>> = [
  'dataset',
  'publication',
  'tool-or-service',
  'training-material',
  'workflow',
]

/**
 * Item sort order.
 */
export const itemSortOrders: Array<ItemSortOrder> = [
  'score',
  'label',
  'modified-on',
]

/**
 * Default item sort order.
 */
export const defaultItemSortOrder: ItemSortOrder = 'score'

/**
 * Sanitize item search query.
 */
export function sanitizeItemSearchQuery(
  params?: ParsedUrlQuery,
): ItemSearchQuery {
  if (params === undefined) return {}

  const sanitized = []

  if (params.q !== undefined) {
    const q = ensureScalar(params.q)
    sanitized.push(['q', q])
  }

  if (params.categories !== undefined) {
    const categories = ensureArray(
      params.categories,
    ).filter((category): category is ItemCategory =>
      (itemCategories as Array<string>).includes(category),
    )
    sanitized.push(['categories', categories])
  }

  if (params.order !== undefined) {
    const order = ensureArray(
      params.order,
    ).filter((sortOrder): sortOrder is ItemSortOrder =>
      (itemSortOrders as Array<string>).includes(sortOrder),
    )
    sanitized.push(['order', order])
  }

  if (params.page !== undefined) {
    const page = parseInt(ensureScalar(params.page), 10)
    if (!Number.isNaN(page) && page > 0) {
      sanitized.push(['page', page])
    }
  }
  if (params.perpage !== undefined) {
    const perpage = parseInt(ensureScalar(params.perpage), 10)
    if (!Number.isNaN(perpage) && perpage > 0 && perpage <= 50) {
      sanitized.push(['perpage', perpage])
    }
  }

  if (params['f.activity'] !== undefined) {
    sanitized.push(['f.activity', ensureArray(params['f.activity'])])
  }
  if (params['f.keyword'] !== undefined) {
    sanitized.push(['f.keyword', ensureArray(params['f.keyword'])])
  }
  if (params['f.source'] !== undefined) {
    sanitized.push(['f.source', ensureArray(params['f.source'])])
  }

  const sanitizedParams = Object.fromEntries(sanitized)
  return sanitizedParams
}
