import { z } from 'zod'

import type { Actor, ActorRef, ActorRole, ActorRoleRef } from '@/data/sshoc/api/actor'
import type {
  AuthData,
  FacetValue,
  PaginatedRequest,
  PaginatedResponse,
} from '@/data/sshoc/api/common'
import type { Dataset, DatasetInput } from '@/data/sshoc/api/dataset'
import type { MediaDetails, MediaDetailsRef } from '@/data/sshoc/api/media'
import type { Property, PropertyInput } from '@/data/sshoc/api/property'
import type { Publication, PublicationInput } from '@/data/sshoc/api/publication'
import type { SourceBase, SourceRef } from '@/data/sshoc/api/source'
import type { Tool, ToolInput } from '@/data/sshoc/api/tool-or-service'
import type { TrainingMaterial, TrainingMaterialInput } from '@/data/sshoc/api/training-material'
import type { User } from '@/data/sshoc/api/user'
import type { ConceptBase, ConceptRef } from '@/data/sshoc/api/vocabulary'
import type { Workflow, WorkflowInput } from '@/data/sshoc/api/workflow'
import type { WorkflowStep, WorkflowStepInput } from '@/data/sshoc/api/workflow-step'
import type { RequestOptions } from '@/data/sshoc/lib/client'
import { createUrl, request } from '@/data/sshoc/lib/client'
import type {
  AllowedRequestOptions,
  BooleanString,
  IsoDateString,
  UrlString,
} from '@/data/sshoc/lib/types'
import {
  itemCommentInputSchema,
  itemRelationInputSchema,
  itemRelationKindInputSchema,
  itemSourceInputSchema,
} from '@/data/sshoc/validation-schemas/item'
import { enumerate } from '@/lib/utils'

export const itemStatus = [
  'draft',
  'ingested',
  'suggested',
  'approved',
  'disapproved',
  'deprecated',
] as const

export type ItemStatus = (typeof itemStatus)[number]

export function isItemStatus(status: string): status is ItemStatus {
  return itemStatus.includes(status as ItemStatus)
}

export const itemSortOrders = ['score', 'label', 'modified-on'] as const

export type ItemSortOrder = (typeof itemSortOrders)[number]

export function isItemSortOrder(sortOrder: string): sortOrder is ItemSortOrder {
  return itemSortOrders.includes(sortOrder as ItemSortOrder)
}

export const itemDraftSortOrders = ['label', 'modified-on'] as const

export type ItemDraftSortOrder = (typeof itemDraftSortOrders)[number]

export function isItemDraftSortOrder(sortOrder: string): sortOrder is ItemDraftSortOrder {
  return itemDraftSortOrders.includes(sortOrder as ItemDraftSortOrder)
}

export const itemFacets = ['activity', 'keyword', 'source', 'language'] as const

export type ItemFacet = (typeof itemFacets)[number]

export function isItemFacet(facet: string): facet is ItemFacet {
  return itemFacets.includes(facet as ItemFacet)
}

/** ItemContributorDto */
export interface ItemContributor {
  actor: Actor
  role: ActorRole
}

/** ItemContributorId */
export interface ItemContributorRef {
  actor: ActorRef
  role: ActorRoleRef
}

/** ItemExternalIdDto */
export interface ItemExternalId {
  identifier: string
  identifierService: ItemSource
}

/** ItemExternalIdCore */
export interface ItemExternalIdInput {
  identifier: string
  identifierService: ItemSourceRef
}

/** ItemSourceDto */
export interface ItemSource {
  code: string
  label: string
  ord: number
  /** Replace `{source-item-id}` with identifier. */
  urlTemplate?: UrlString
}

/** ItemSourceCore */
export interface ItemSourceInput {
  label: string
  ord?: number
  /** Must include `{source-item-id}`. */
  urlTemplate?: UrlString
}

/** ItemExternalIdId */
export interface ItemSourceRef {
  code: string
}

/** ItemMediaDto */
export interface ItemMedia {
  info: MediaDetails
  caption?: string
  concept?: ConceptBase
}

/** ItemMediaCore */
export interface ItemMediaInput {
  info: MediaDetailsRef
  caption?: string
  concept?: ConceptRef
}

/** ItemRelatedItemDto */
export interface ItemRelatedItem {
  subject: ItemCore
  object: ItemCore
  relation: ItemRelation
}

/** ItemRelationDto */
export interface ItemRelation {
  code: string
  label: string
  inverseOf?: string
}

/** ItemRelationCore */
export interface ItemRelationInput {
  label: string
  inverseOf?: string
  ord?: number
}

/** ItemRelationId */
export interface ItemRelationRef {
  code: ItemRelation['code']
}

export interface RelatedItemBase {
  persistentId: string
  id: number
  category: ItemCategoryWithWorkflowStep
  label: string
  description: string
  relation: ItemRelation
}

export interface RelatedItemMain extends RelatedItemBase {
  category: ItemCategory
}

export interface RelatedItemWorkflowStep extends RelatedItemBase {
  category: 'step'
  workflowId: string
}

/** RelatedItemDto */
export type RelatedItem = RelatedItemMain | RelatedItemWorkflowStep

/** RelatedItemCore */
export interface RelatedItemInput {
  persistentId: string
  relation: ItemRelationRef
}

/** ItemCommentDto */
export interface ItemComment {
  id: number
  body: string
  creator: User
  dateCreated: IsoDateString
  dateLastUpdated: IsoDateString
}

/** ItemCommentCore */
export interface ItemCommentInput {
  body: string
}

/** SuggestedSearchPhrases */
export interface ItemSearchSuggestion {
  phrase: string
  suggestions: Array<{
    phrase: string
    persistentId: string
  }>
}

export interface ItemBase {
  persistentId: string
  id: number
  category: ItemCategoryWithWorkflowStep
  label: string
  version?: string
  lastInfoUpdate: IsoDateString
  status: ItemStatus
  informationContributor: User
  description: string
  contributors: Array<ItemContributor>
  properties: Array<Property>
  externalIds: Array<ItemExternalId>
  accessibleAt: Array<UrlString>
  source?: SourceBase
  sourceItemId?: string
  relatedItems: Array<RelatedItem>
  media: Array<ItemMedia>
  thumbnail?: ItemMedia
}

export interface ItemBaseInput {
  // category: ItemCategoryWithWorkflowStep
  label: string
  version?: string
  description: string
  contributors?: Array<ItemContributorRef>
  properties?: Array<PropertyInput>
  externalIds?: Array<ItemExternalIdInput>
  accessibleAt?: Array<UrlString>
  source?: SourceRef
  sourceItemId?: string
  relatedItems?: Array<RelatedItemInput>
  media?: Array<ItemMediaInput>
  thumbnail?: ItemMediaInput
}

export type Item = Dataset | Publication | Tool | TrainingMaterial | Workflow

export type ItemInput =
  | DatasetInput
  | PublicationInput
  | ToolInput
  | TrainingMaterialInput
  | WorkflowInput

export type ItemWithWorkflowStep = Item | WorkflowStep

export type ItemInputWithWorkflowStep = ItemInput | WorkflowStepInput

export type ItemCategory = Item['category']

export type ItemCategoryWithWorkflowStep = ItemWithWorkflowStep['category']

export const itemCategories = enumerate<ItemCategory>()(
  'dataset',
  'publication',
  'tool-or-service',
  'training-material',
  'workflow',
)

export const itemCategoriesWithWorkflowStep = enumerate<ItemCategoryWithWorkflowStep>()(
  ...itemCategories,
  'step',
)

export function isItemCategory(category: string): category is ItemCategory {
  return itemCategories.includes(category as ItemCategory)
}

export function isItemCategoryWithWorkflowStep(
  category: string,
): category is ItemCategoryWithWorkflowStep {
  return itemCategoriesWithWorkflowStep.includes(category as ItemCategoryWithWorkflowStep)
}

type PickSearchResultKeys<T extends ItemWithWorkflowStep> = Pick<
  T,
  | 'category'
  | 'contributors'
  | 'description'
  | 'id'
  | 'label'
  | 'lastInfoUpdate'
  | 'persistentId'
  | 'properties'
  | 'status'
> & {
  /** Derived from `informationContributor.username`. */
  owner: string
}

/** SearchItem */
export type ItemSearchResult =
  | PickSearchResultKeys<Item>
  | (PickSearchResultKeys<WorkflowStep> & { workflowId: string })

/** ItemBasicDto */
export type ItemCore = Pick<
  ItemBase,
  'category' | 'id' | 'label' | 'lastInfoUpdate' | 'persistentId' | 'version'
>

/** ItemExtBasicDto */
export type ItemHistoryEntry = Pick<
  ItemBase,
  | 'category'
  | 'id'
  | 'informationContributor'
  | 'label'
  | 'lastInfoUpdate'
  | 'persistentId'
  | 'status'
  | 'version'
>

export type ContributedItem = Pick<
  ItemBase,
  'category' | 'id' | 'label' | 'lastInfoUpdate' | 'persistentId' | 'status'
>

/**
 * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/127#note_502140
 * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/152#note_565636
 */
type ItemDiffData<T extends object> = {
  [K in keyof T as T[K] extends Array<unknown> ? K : never]: T[K] extends Array<infer V>
    ? Array<V | null>
    : never
} & {
  [K in keyof T as T[K] extends Array<unknown> ? never : K]?: T[K] | 'unaltered'
}

/** ItemsDifferencesDto */
export interface ItemsDiff {
  equal: boolean
  item: ItemBase
  other: ItemDiffData<
    Pick<
      ItemBase,
      | 'accessibleAt'
      | 'contributors'
      | 'description'
      | 'externalIds'
      | 'label'
      | 'media'
      | 'properties'
      | 'relatedItems'
      | 'source'
      | 'sourceItemId'
      | 'thumbnail'
      | 'version'
    >
  > &
    Pick<
      ItemBase,
      'category' | 'id' | 'informationContributor' | 'lastInfoUpdate' | 'persistentId' | 'status'
    >
}

export namespace ItemSearch {
  export type SearchParams = PaginatedRequest<{
    q?: string
    categories?: Array<ItemCategoryWithWorkflowStep>
    /** @default false */
    includeSteps?: boolean
    /**
     * All fields indexed in SOLR can be queried.
     * Dashes in field names need to be replaced with underscores.
     * Allows query syntax, e.g. `d.status: '(suggested OR ingested)'`.
     *
     * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/102
     * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/blob/develop/etc/solr/items/conf/managed-schema#L113-L131
     */
    /** Exclude<ItemStatus, 'draft'> */
    'd.status'?: string
    /** Searches on `itemContributor.username`. */
    'd.owner'?: string
    /** Searches on `source.label`. */
    'd.source'?: string
    /** Searches on `scontributor.name`. */
    'd.contributor'?: string
    'd.lastInfoUpdate'?: string
    /** Searches on `externalIdentifier.id`. */
    'd.externalIdentifier'?: string
    /** Curation flags. */
    'd.curation-flag-coverage'?: BooleanString
    'd.curation-flag-description'?: BooleanString
    'd.curation-flag-merged'?: BooleanString
    'd.curation-flag-relations'?: BooleanString
    'd.curation-flag-url'?: BooleanString
    order?: Array<ItemSortOrder>
    /** @default false */
    advanced?: boolean
    /** See `ItemFacet` for allowed facet keys. */
    'f.activity'?: Array<string>
    'f.keyword'?: Array<string>
    'f.language'?: Array<string>
    'f.source'?: Array<string>
  }> & {
    /** All values from `/api/property-types` are allowed. */
    [key: `d.${string}`]: string
  }
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    q?: string
    order: Array<ItemSortOrder>
    items: Array<ItemSearchResult>
    categories: Record<ItemCategoryWithWorkflowStep, FacetValue<{ label: string }>>
    facets: Record<ItemFacet, Record<string, FacetValue<unknown>>>
  }>
}

export function searchItems(
  params: ItemSearch.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<ItemSearch.Response> {
  const url = createUrl({ pathname: '/api/item-search', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace ItemAutocomplete {
  export type SearchParams = {
    q: string
    category?: ItemCategory
  }
  export type Params = SearchParams
  export type Response = ItemSearchSuggestion
}

export function autocompleteItems(
  params: ItemAutocomplete.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<ItemAutocomplete.Response> {
  const url = createUrl({ pathname: '/api/item-search/autocomplete', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetItemsBySource {
  export type PathParams = {
    sourceId: number
  }
  export type SearchParams = PaginatedRequest<{
    /** @default true */
    approved?: boolean
  }>
  export type Params = PathParams & SearchParams
  export type Response = PaginatedResponse<{
    items: Array<ItemCore>
  }>
}

export function getItemsBySource(
  params: GetItemsBySource.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetItemsBySource.Response> {
  const url = createUrl({
    pathname: `/api/sources/${params.sourceId}/items`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetItemsBySourceItem {
  export type PathParams = {
    sourceId: number
    sourceItemId: string
  }
  export type SearchParams = PaginatedRequest<{
    /** @default true */
    approved?: boolean
  }>
  export type Params = PathParams & SearchParams
  export type Response = PaginatedResponse<{
    items: Array<ItemCore>
  }>
}
export function getItemsBySourceItem(
  params: GetItemsBySourceItem.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetItemsBySourceItem.Response> {
  const url = createUrl({
    pathname: `/api/sources/${params.sourceId}/items/${params.sourceItemId}`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetDraftItems {
  export type SearchParams = PaginatedRequest<{
    order?: ItemDraftSortOrder
  }>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    items: Array<ItemCore>
  }>
}

export function getDraftItems(
  params: GetDraftItems.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetDraftItems.Response> {
  const url = createUrl({ pathname: '/api/draft-items', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetItemRelations {
  export type SearchParams = PaginatedRequest<unknown>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{ itemRelations: Array<ItemRelation> }>
}

export function getItemRelations(
  params: GetItemRelations.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetItemRelations.Response> {
  const url = createUrl({ pathname: '/api/items-relations', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateItemRelation {
  export type PathParams = {
    subjectId: string
    objectId: string
  }
  export type SearchParams = {
    /** @default false */
    draft?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Body = ItemRelationRef
  export type Response = ItemRelatedItem
}

export function createItemRelation(
  params: CreateItemRelation.Params,
  data: CreateItemRelation.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateItemRelation.Response> {
  const url = createUrl({
    pathname: `/api/items-relations/${params.subjectId}/${params.objectId}`,
    searchParams: params,
  })
  const json = itemRelationInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace DeleteItemRelation {
  export type PathParams = {
    subjectId: string
    objectId: string
  }
  export type SearchParams = {
    /** @default false */
    draft?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = void
}

export function deleteItemRelation(
  params: DeleteItemRelation.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteItemRelation.Response> {
  const url = createUrl({
    pathname: `/api/items-relations/${params.subjectId}/${params.objectId}`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace GetItemRelationKind {
  export type PathParams = {
    code: string
  }
  export type Params = PathParams
  export type Response = ItemRelation
}

export function getItemRelationKind(
  params: GetItemRelationKind.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetItemRelationKind.Response> {
  const url = createUrl({ pathname: `/api/items-relations/${params.code}` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateItemRelationKind {
  export type Body = ItemRelationInput & { code: string }
  export type Response = ItemRelation
}

export function createItemRelationKind(
  data: CreateItemRelationKind.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateItemRelationKind.Response> {
  const url = createUrl({
    pathname: `/api/items-relations`,
  })
  const json = itemRelationKindInputSchema.and(z.object({ code: z.string() })).parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace UpdateItemRelationKind {
  export type PathParams = {
    code: string
  }
  export type Params = PathParams
  export type Body = ItemRelationInput
  export type Response = ItemRelation
}

export function updateItemRelationKind(
  params: UpdateItemRelationKind.Params,
  data: UpdateItemRelationKind.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateItemRelationKind.Response> {
  const url = createUrl({ pathname: `/api/items-relations/${params.code}` })
  const json = itemRelationKindInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeleteItemRelationKind {
  export type PathParams = {
    code: string
  }
  export type SearchParams = {
    /** @default false */
    force?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = void
}

export function deleteItemRelationKind(
  params: DeleteItemRelationKind.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteItemRelationKind.Response> {
  const url = createUrl({
    pathname: `/api/items-relations/${params.code}`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace GetItemComments {
  export type PathParams = {
    itemId: string
  }
  export type Params = PathParams
  export type Response = Array<ItemComment>
}

export function getItemComments(
  params: GetItemComments.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetItemComments.Response> {
  const url = createUrl({ pathname: `/api/items/${params.itemId}/comments` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateItemComment {
  export type PathParams = {
    itemId: string
  }
  export type Params = PathParams
  export type Body = ItemCommentInput
  export type Response = ItemComment
}

export function createItemComment(
  params: CreateItemComment.Params,
  data: CreateItemComment.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateItemComment.Response> {
  const url = createUrl({ pathname: `/api/items/${params.itemId}/comments` })
  const json = itemCommentInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace UpdateItemComment {
  export type PathParams = {
    itemId: string
    id: number
  }
  export type Params = PathParams
  export type Body = ItemCommentInput
  export type Response = ItemComment
}

export function updateItemComment(
  params: UpdateItemComment.Params,
  data: UpdateItemComment.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateItemComment.Response> {
  const url = createUrl({ pathname: `/api/items/${params.itemId}/comments/${params.id}` })
  const json = itemCommentInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeleteItemComment {
  export type PathParams = {
    itemId: string
    id: number
  }
  export type Params = PathParams
  export type Response = void
}

export function deleteItemComment(
  params: DeleteItemComment.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteItemComment.Response> {
  const url = createUrl({ pathname: `/api/items/${params.itemId}/comments/${params.id}` })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace GetLastItemComments {
  export type PathParams = {
    itemId: string
  }
  export type Params = PathParams
  export type Response = Array<ItemComment>
}

export function getLastItemComments(
  params: GetLastItemComments.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetLastItemComments.Response> {
  const url = createUrl({ pathname: `/api/items/${params.itemId}/last-comments` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetItemSources {
  export type Response = Array<ItemSource>
}

export function getItemSources(
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetItemSources.Response> {
  const url = createUrl({ pathname: '/api/item-sources' })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetItemSource {
  export type PathParams = {
    code: string
  }
  export type Params = PathParams
  export type Response = ItemSource
}

export function getItemSource(
  params: GetItemSource.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetItemSource.Response> {
  const url = createUrl({ pathname: `/api/item-sources/${params.code}` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateItemSource {
  export type Body = ItemSourceInput & { code: string }
  export type Response = ItemSource
}

export function createItemSource(
  data: CreateItemSource.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateItemSource.Response> {
  const url = createUrl({ pathname: '/api/item-sources' })
  const json = itemSourceInputSchema.and(z.object({ code: z.string() })).parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace UpdateItemSource {
  export type PathParams = {
    code: string
  }
  export type Params = PathParams
  export type Body = ItemSourceInput
  export type Response = ItemSource
}

export function updateItemSource(
  params: UpdateItemSource.Params,
  data: UpdateItemSource.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateItemSource.Response> {
  const url = createUrl({ pathname: `/api/item-sources/${params.code}` })
  const json = itemSourceInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeleteItemSource {
  export type PathParams = {
    code: string
  }
  export type Params = PathParams
  export type Response = void
}

export function deleteItemSource(
  params: DeleteItemSource.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteItemSource.Response> {
  const url = createUrl({ pathname: `/api/item-sources/${params.code}` })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace GetItemCategories {
  export type Response = Record<ItemCategoryWithWorkflowStep, string>
}

export function getItemCategories(
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetItemCategories.Response> {
  const url = createUrl({ pathname: '/api/items-categories' })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetContributedItems {
  export type SearchParams = PaginatedRequest<{
    order?: 'label' | 'modified-on'
  }>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{ items: Array<ContributedItem> }>
}

export function getContributedItems(
  params: GetContributedItems.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetContributedItems.Response> {
  const url = createUrl({ pathname: '/api/contributed-items', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}
