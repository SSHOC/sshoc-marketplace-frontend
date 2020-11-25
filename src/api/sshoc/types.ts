/**
 * Additional types not directly provided by the sshoc api,
 * mostly because they are inlined, or because they don't specify
 * required/optional fields.
 */

import type {
  DatasetDto,
  ItemBasicDto,
  PublicationDto,
  SearchItems,
  ToolDto,
  TrainingMaterialDto,
  WorkflowDto,
} from '@/api/sshoc'
// import type { OptionalFields, RequiredFields } from '@/utils/ts/object'

/**
 * Item search results.
 */
export type ItemSearchResults = Required<SearchItems.Response.Success>

/**
 * Sort order for item search results.
 */
export type ItemSortOrder = Exclude<
  SearchItems.QueryParameters['order'],
  undefined
>[0]

/**
 * Item category.
 */
export type ItemCategory = Exclude<ItemBasicDto['category'], undefined>

/**
 * item search query parameters.
 */
export type ItemSearchQuery = Omit<SearchItems.QueryParameters, 'f'> & {
  'f.activity'?: Array<string>
  'f.keyword'?: Array<string>
  'f.source'?: Array<string>
}

/**
 * Item search facet.
 */
export type ItemSearchFacet =
  | 'categories'
  | 'f.activity'
  | 'f.keyword'
  | 'f.source'

/**
 * Item search facet value.
 */
export type ItemSearchFacetData =
  | Exclude<SearchItems.Response.Success['categories'], undefined>[string]
  | Exclude<SearchItems.Response.Success['facets'], undefined>[string][string]

/**
 * ISO date string.
 */
export type ISODateString = string

/**
 * Item details.
 */
export type Item =
  | DatasetDto
  | PublicationDto
  | ToolDto
  | TrainingMaterialDto
  | WorkflowDto
