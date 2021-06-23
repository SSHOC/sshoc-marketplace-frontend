/**
 * SSHOC Marketplace API
 *
 * Social Sciences and Humanities Open Cloud Marketplace
 *
 * License: Apache 2.0
 * Version: 0.1.1
 */

/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */

import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query'
import { useMutation, useQuery } from 'react-query'

export type ActorDto = {
  id?: number /* int64 */
  name?: string
  externalIds?: Array<ActorExternalIdDto>
  website?: string
  email?: string
  affiliations?: Array<ActorDto>
}

export type ActorExternalIdDto = {
  identifierService?: ActorSourceDto
  identifier?: string
}

export type ActorSourceDto = {
  code?: string
  label?: string
}

export type PaginatedActors = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  actors?: Array<ActorDto>
}

export type ActorCore = {
  name?: string
  externalIds?: Array<ActorExternalIdCore>
  website?: string
  email?: string
  affiliations?: Array<ActorId>
}

export type ActorExternalIdCore = {
  identifierService: ActorSourceId
  identifier: string
}

export type ActorId = {
  id?: number /* int64 */
}

export type ActorSourceId = {
  code?: string
}

export type PaginatedPropertyTypes = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  propertyTypes?: Array<PropertyTypeDto>
}

export type PropertyTypeDto = {
  code?: string
  label?: string
  type?: 'concept' | 'string' | 'url' | 'int' | 'float' | 'date'
  groupName?: string
  hidden?: boolean
  ord?: number /* int32 */
  allowedVocabularies?: Array<VocabularyBasicDto>
}

export type VocabularyBasicDto = {
  code?: string
  label?: string
  accessibleAt?: string
}

export type PropertyTypeReorder = {
  code: string
  ord?: number /* int32 */
}

export type PropertyTypesReordering = {
  shifts: Array<PropertyTypeReorder>
}

export type PropertyTypeCore = {
  code?: string
  label?: string
  type?: 'concept' | 'string' | 'url' | 'int' | 'float' | 'date'
  groupName?: string
  hidden?: boolean
  ord?: number /* int32 */
  allowedVocabularies?: Array<string>
}

export type SourceDto = {
  id?: number /* int64 */
  label?: string
  url?: string
  urlTemplate?: string
  lastHarvestedDate?: string
}

export type PaginatedSources = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  sources?: Array<SourceDto>
}

export type SourceCore = {
  label?: string
  url?: string
  urlTemplate?: string
}

export type ActorRoleId = {
  code?: string
}

export type ConceptId = {
  code?: string
  vocabulary?: VocabularyId
  uri?: string
}

export type ItemContributorId = {
  actor?: ActorId
  role?: ActorRoleId
}

export type ItemExternalIdCore = {
  identifierService: ItemExternalIdId
  identifier: string
}

export type ItemExternalIdId = {
  code?: string
}

export type ItemMediaCore = {
  info?: MediaDetailsId
  caption?: string
}

export type ItemRelationId = {
  code?: string
}

export type ItemThumbnailId = {
  mediaId?: string /* uuid */
}

export type MediaDetailsId = {
  mediaId?: string /* uuid */
}

export type PropertyCore = {
  type?: PropertyTypeId
  value?: string
  concept?: ConceptId
}

export type PropertyTypeId = {
  code?: string
}

export type RelatedItemCore = {
  persistentId?: string
  relation?: ItemRelationId
}

export type SourceId = {
  id?: number /* int64 */
}

export type StepCore = {
  label?: string
  version?: string
  description?: string
  contributors?: Array<ItemContributorId>
  externalIds?: Array<ItemExternalIdCore>
  properties?: Array<PropertyCore>
  relatedItems?: Array<RelatedItemCore>
  media?: Array<ItemMediaCore>
  thumbnail?: ItemThumbnailId
  accessibleAt?: Array<string>
  source?: SourceId
  sourceItemId?: string
  stepNo?: number /* int32 */
}

export type VocabularyId = {
  code?: string
}

export type ActorRoleDto = {
  code?: string
  label?: string
}

export type ConceptBasicDto = {
  code?: string
  vocabulary?: VocabularyBasicDto
  label?: string
  notation?: string
  definition?: string
  uri?: string
}

export type ItemContributorDto = {
  actor?: ActorDto
  role?: ActorRoleDto
}

export type ItemExternalIdDto = {
  identifierService?: ItemSourceDto
  identifier?: string
}

export type ItemMediaDto = {
  info?: MediaDetails
  caption?: string
}

export type ItemRelationDto = {
  code?: string
  label?: string
}

export type ItemSourceDto = {
  code?: string
  label?: string
}

export type MediaDetails = {
  mediaId?: string /* uuid */
  category?: 'image' | 'video' | 'object' | 'thumbnail'
  location?: MediaLocation
  filename?: string
  mimeType?: string
  hasThumbnail?: boolean
}

export type MediaLocation = {
  sourceUrl?: string /* url */
}

export type PropertyDto = {
  id?: number /* int64 */
  type?: PropertyTypeDto
  value?: string
  concept?: ConceptBasicDto
}

export type RelatedItemDto = {
  id?: number /* int64 */
  persistentId?: string
  category?:
    | 'tool-or-service'
    | 'training-material'
    | 'publication'
    | 'dataset'
    | 'workflow'
    | 'step'
  label?: string
  description?: string
  relation?: ItemRelationDto
}

export type SourceBasicDto = {
  id?: number /* int64 */
  label?: string
  url?: string
  urlTemplate?: string
}

export type StepDto = {
  id?: number /* int64 */
  category?:
    | 'tool-or-service'
    | 'training-material'
    | 'publication'
    | 'dataset'
    | 'workflow'
    | 'step'
  label?: string
  version?: string
  persistentId?: string
  lastInfoUpdate?: string
  status?:
    | 'draft'
    | 'ingested'
    | 'suggested'
    | 'approved'
    | 'disapproved'
    | 'deprecated'
  informationContributor?: UserDto
  description?: string
  contributors?: Array<ItemContributorDto>
  properties?: Array<PropertyDto>
  externalIds?: Array<ItemExternalIdDto>
  accessibleAt?: Array<string>
  source?: SourceBasicDto
  sourceItemId?: string
  relatedItems?: Array<RelatedItemDto>
  media?: Array<ItemMediaDto>
  thumbnail?: ItemThumbnailId
  composedOf?: Array<StepDto>
}

export type UserDto = {
  id?: number /* int64 */
  username?: string
  displayName?: string
  status?: 'during-registration' | 'enabled' | 'locked'
  registrationDate?: string
  role?:
    | 'contributor'
    | 'system-contributor'
    | 'moderator'
    | 'system-moderator'
    | 'administrator'
  email?: string
  config?: boolean
}

export type WorkflowDto = {
  id?: number /* int64 */
  category?:
    | 'tool-or-service'
    | 'training-material'
    | 'publication'
    | 'dataset'
    | 'workflow'
    | 'step'
  label?: string
  version?: string
  persistentId?: string
  lastInfoUpdate?: string
  status?:
    | 'draft'
    | 'ingested'
    | 'suggested'
    | 'approved'
    | 'disapproved'
    | 'deprecated'
  informationContributor?: UserDto
  description?: string
  contributors?: Array<ItemContributorDto>
  properties?: Array<PropertyDto>
  externalIds?: Array<ItemExternalIdDto>
  accessibleAt?: Array<string>
  source?: SourceBasicDto
  sourceItemId?: string
  relatedItems?: Array<RelatedItemDto>
  media?: Array<ItemMediaDto>
  thumbnail?: ItemThumbnailId
  composedOf?: Array<StepDto>
}

export type ItemExtBasicDto = {
  id?: number /* int64 */
  category?:
    | 'tool-or-service'
    | 'training-material'
    | 'publication'
    | 'dataset'
    | 'workflow'
    | 'step'
  label?: string
  version?: string
  persistentId?: string
  lastInfoUpdate?: string
  status?:
    | 'draft'
    | 'ingested'
    | 'suggested'
    | 'approved'
    | 'disapproved'
    | 'deprecated'
  informationContributor?: UserDto
}

export type WorkflowCore = {
  label?: string
  version?: string
  description?: string
  contributors?: Array<ItemContributorId>
  externalIds?: Array<ItemExternalIdCore>
  properties?: Array<PropertyCore>
  relatedItems?: Array<RelatedItemCore>
  media?: Array<ItemMediaCore>
  thumbnail?: ItemThumbnailId
  accessibleAt?: Array<string>
  source?: SourceId
  sourceItemId?: string
}

export type PaginatedWorkflows = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  workflows?: Array<WorkflowDto>
}

export type OAuthRegistrationData = {
  id?: number /* int64 */
  displayName?: string
  email?: string
  acceptedRegulations?: boolean
}

export type ImplicitGrantTokenData = {
  token?: string
  registration?: boolean
}

export type OAuthRegistrationDto = {
  id?: number /* int64 */
  displayName?: string
  email?: string
}

export type UserDisplayNameCore = {
  displayName?: string
}

export type NewPasswordData = {
  newPassword?: string
  verifiedPassword?: string
  currentPassword?: string
}

export type UserCore = {
  username?: string
  displayName?: string
  password?: string
  role?:
    | 'contributor'
    | 'system-contributor'
    | 'moderator'
    | 'system-moderator'
    | 'administrator'
  email?: string
}

export type PaginatedUsers = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  users?: Array<UserDto>
}

export type ItemBasicDto = {
  id?: number /* int64 */
  category?:
    | 'tool-or-service'
    | 'training-material'
    | 'publication'
    | 'dataset'
    | 'workflow'
    | 'step'
  label?: string
  version?: string
  persistentId?: string
  lastInfoUpdate?: string
}

export type ItemRelatedItemDto = {
  subject?: ItemBasicDto
  object?: ItemBasicDto
  relation?: ItemRelationDto
}

export type ItemCommentDto = {
  id?: number /* int64 */
  body?: string
  creator?: UserDto
  dateCreated?: string
  dateLastUpdated?: string
}

export type ItemCommentCore = {
  body?: string
}

export type PublicationCore = {
  label?: string
  version?: string
  description?: string
  contributors?: Array<ItemContributorId>
  externalIds?: Array<ItemExternalIdCore>
  properties?: Array<PropertyCore>
  relatedItems?: Array<RelatedItemCore>
  media?: Array<ItemMediaCore>
  thumbnail?: ItemThumbnailId
  accessibleAt?: Array<string>
  source?: SourceId
  sourceItemId?: string
  dateCreated?: string
  dateLastUpdated?: string
}

export type PublicationDto = {
  id?: number /* int64 */
  category?:
    | 'tool-or-service'
    | 'training-material'
    | 'publication'
    | 'dataset'
    | 'workflow'
    | 'step'
  label?: string
  version?: string
  persistentId?: string
  lastInfoUpdate?: string
  status?:
    | 'draft'
    | 'ingested'
    | 'suggested'
    | 'approved'
    | 'disapproved'
    | 'deprecated'
  informationContributor?: UserDto
  description?: string
  contributors?: Array<ItemContributorDto>
  properties?: Array<PropertyDto>
  externalIds?: Array<ItemExternalIdDto>
  accessibleAt?: Array<string>
  source?: SourceBasicDto
  sourceItemId?: string
  relatedItems?: Array<RelatedItemDto>
  media?: Array<ItemMediaDto>
  thumbnail?: ItemThumbnailId
  dateCreated?: string
  dateLastUpdated?: string
}

export type PaginatedPublications = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  publications?: Array<PublicationDto>
}

export type ActorRoleCore = {
  code?: string
  label: string
  ord?: number /* int32 */
}

export type ActorSourceCore = {
  code?: string
  label: string
  ord?: number /* int32 */
}

export type ConceptDto = {
  code?: string
  vocabulary?: VocabularyBasicDto
  label?: string
  notation?: string
  definition?: string
  uri?: string
  relatedConcepts?: Array<RelatedConceptDto>
}

export type ConceptRelationDto = {
  code?: string
  label?: string
}

export type PaginatedConcepts = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  concepts?: Array<ConceptDto>
}

export type RelatedConceptDto = {
  code?: string
  vocabulary?: VocabularyBasicDto
  label?: string
  notation?: string
  definition?: string
  uri?: string
  relation?: ConceptRelationDto
}

export type VocabularyDto = {
  code?: string
  label?: string
  accessibleAt?: string
  description?: string
  conceptResults?: PaginatedConcepts
}

export type PaginatedVocabularies = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  vocabularies?: Array<VocabularyBasicDto>
}

export type PaginatedTools = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  tools?: Array<ToolDto>
}

export type ToolDto = {
  id?: number /* int64 */
  category?:
    | 'tool-or-service'
    | 'training-material'
    | 'publication'
    | 'dataset'
    | 'workflow'
    | 'step'
  label?: string
  version?: string
  persistentId?: string
  lastInfoUpdate?: string
  status?:
    | 'draft'
    | 'ingested'
    | 'suggested'
    | 'approved'
    | 'disapproved'
    | 'deprecated'
  informationContributor?: UserDto
  description?: string
  contributors?: Array<ItemContributorDto>
  properties?: Array<PropertyDto>
  externalIds?: Array<ItemExternalIdDto>
  accessibleAt?: Array<string>
  source?: SourceBasicDto
  sourceItemId?: string
  relatedItems?: Array<RelatedItemDto>
  media?: Array<ItemMediaDto>
  thumbnail?: ItemThumbnailId
}

export type ToolCore = {
  label?: string
  version?: string
  description?: string
  contributors?: Array<ItemContributorId>
  externalIds?: Array<ItemExternalIdCore>
  properties?: Array<PropertyCore>
  relatedItems?: Array<RelatedItemCore>
  media?: Array<ItemMediaCore>
  thumbnail?: ItemThumbnailId
  accessibleAt?: Array<string>
  source?: SourceId
  sourceItemId?: string
}

export type CheckedCount = {
  count?: number /* int64 */
  checked?: boolean
}

export type LabeledCheckedCount = {
  count?: number /* int64 */
  checked?: boolean
  label?: string
}

export type PaginatedSearchItems = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  q?: string
  order?: Array<'score' | 'label' | 'modified-on'>
  items?: Array<SearchItem>
  categories?: Record<string, LabeledCheckedCount>
  facets?: Record<string, Record<string, CheckedCount>>
}

export type SearchItem = {
  id?: number /* int64 */
  persistentId?: string
  label?: string
  description?: string
  contributors?: Array<ItemContributorDto>
  properties?: Array<PropertyDto>
  category?:
    | 'tool-or-service'
    | 'training-material'
    | 'publication'
    | 'dataset'
    | 'workflow'
    | 'step'
  status?:
    | 'draft'
    | 'ingested'
    | 'suggested'
    | 'approved'
    | 'disapproved'
    | 'deprecated'
  owner?: string
}

export type CountedPropertyType = {
  code?: string
  label?: string
  count?: number /* int64 */
  checked?: boolean
}

export type PaginatedSearchConcepts = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  q?: string
  concepts?: Array<SearchConcept>
  types?: Record<string, CountedPropertyType>
}

export type SearchConcept = {
  code?: string
  vocabulary?: VocabularyId
  label?: string
  notation?: string
  definition?: string
  uri?: string
  types?: Array<PropertyTypeId>
}

export type SuggestedSearchPhrases = {
  phrase?: string
  suggestions?: Array<string>
}

export type MediaSourceCore = {
  code?: string
  serviceUrl?: string
  mediaCategory?: 'image' | 'video' | 'object' | 'thumbnail'
  ord?: number /* int32 */
}

export type MediaSourceDto = {
  code?: string
  serviceUrl?: string
  mediaCategory?: 'image' | 'video' | 'object' | 'thumbnail'
}

export type Resource = {
  open?: boolean
  file?: string /* binary */
  url?: string /* url */
  readable?: boolean
  filename?: string
  description?: string
  uri?: string /* uri */
  inputStream?: {}
}

export type MediaUploadInfo = {
  mediaId?: string /* uuid */
  filename?: string
  mimeType?: string
  nextChunkNo?: number /* int32 */
}

export type LoginData = {
  username?: string
  password?: string
}

export type TrainingMaterialDto = {
  id?: number /* int64 */
  category?:
    | 'tool-or-service'
    | 'training-material'
    | 'publication'
    | 'dataset'
    | 'workflow'
    | 'step'
  label?: string
  version?: string
  persistentId?: string
  lastInfoUpdate?: string
  status?:
    | 'draft'
    | 'ingested'
    | 'suggested'
    | 'approved'
    | 'disapproved'
    | 'deprecated'
  informationContributor?: UserDto
  description?: string
  contributors?: Array<ItemContributorDto>
  properties?: Array<PropertyDto>
  externalIds?: Array<ItemExternalIdDto>
  accessibleAt?: Array<string>
  source?: SourceBasicDto
  sourceItemId?: string
  relatedItems?: Array<RelatedItemDto>
  media?: Array<ItemMediaDto>
  thumbnail?: ItemThumbnailId
  dateCreated?: string
  dateLastUpdated?: string
}

export type TrainingMaterialCore = {
  label?: string
  version?: string
  description?: string
  contributors?: Array<ItemContributorId>
  externalIds?: Array<ItemExternalIdCore>
  properties?: Array<PropertyCore>
  relatedItems?: Array<RelatedItemCore>
  media?: Array<ItemMediaCore>
  thumbnail?: ItemThumbnailId
  accessibleAt?: Array<string>
  source?: SourceId
  sourceItemId?: string
  dateCreated?: string
  dateLastUpdated?: string
}

export type PaginatedTrainingMaterials = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  trainingMaterials?: Array<TrainingMaterialDto>
}

export type PaginatedItemsBasic = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  items?: Array<ItemBasicDto>
}

export type ItemSourceCore = {
  code?: string
  label: string
  ord?: number /* int32 */
}

export type DatasetDto = {
  id?: number /* int64 */
  category?:
    | 'tool-or-service'
    | 'training-material'
    | 'publication'
    | 'dataset'
    | 'workflow'
    | 'step'
  label?: string
  version?: string
  persistentId?: string
  lastInfoUpdate?: string
  status?:
    | 'draft'
    | 'ingested'
    | 'suggested'
    | 'approved'
    | 'disapproved'
    | 'deprecated'
  informationContributor?: UserDto
  description?: string
  contributors?: Array<ItemContributorDto>
  properties?: Array<PropertyDto>
  externalIds?: Array<ItemExternalIdDto>
  accessibleAt?: Array<string>
  source?: SourceBasicDto
  sourceItemId?: string
  relatedItems?: Array<RelatedItemDto>
  media?: Array<ItemMediaDto>
  thumbnail?: ItemThumbnailId
  dateCreated?: string
  dateLastUpdated?: string
}

export type PaginatedDatasets = {
  hits?: number /* int64 */
  count?: number /* int32 */
  page?: number /* int32 */
  perpage?: number /* int32 */
  pages?: number /* int32 */
  datasets?: Array<DatasetDto>
}

export type DatasetCore = {
  label?: string
  version?: string
  description?: string
  contributors?: Array<ItemContributorId>
  externalIds?: Array<ItemExternalIdCore>
  properties?: Array<PropertyCore>
  relatedItems?: Array<RelatedItemCore>
  media?: Array<ItemMediaCore>
  thumbnail?: ItemThumbnailId
  accessibleAt?: Array<string>
  source?: SourceId
  sourceItemId?: string
  dateCreated?: string
  dateLastUpdated?: string
}

const defaultBaseUrl =
  process.env.SSHOC_API_BASE_URL ?? process.env.NEXT_PUBLIC_SSHOC_API_BASE_URL

export { defaultBaseUrl as baseUrl }

export class HttpError extends Error {
  response: Response
  statusCode: number

  constructor(response: Response, message?: string) {
    super((message ?? response.statusText) || 'Unexpected HTTP error.')
    this.name = 'HttpError'
    this.response = response
    this.statusCode = response.status
  }
}

function createUrl(
  path: string,
  baseUrl = defaultBaseUrl,
  query: Record<string, unknown> = {},
) {
  const url = new URL(path, baseUrl)
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v != null) {
          url.searchParams.append(key, String(v))
        }
      })
    } else if (value != null) {
      url.searchParams.set(key, String(value))
    }
  })
  return url.toString()
}

type RequestOptions<T> = {
  hooks?: {
    request?: (request: Request) => Request
    response?: (response: Response) => Promise<T>
  }
  token?: string
}
export async function request<T = unknown>({
  path,
  baseUrl,
  query,
  options,
  hooks = {},
  token,
  returnType = 'json',
}: {
  path: string
  baseUrl?: string
  query?: Record<string, unknown>
  options?: RequestInit
  hooks?: RequestOptions<T>['hooks']
  token?: RequestOptions<T>['token']
  returnType?: 'json'
}): Promise<T> {
  const url = createUrl(path, baseUrl, query)
  const req = new Request(url, options)
  const request = typeof hooks.request === 'function' ? hooks.request(req) : req
  if (token !== undefined && token.length > 0) {
    request.headers.set('Authorization', token)
  }
  const response = await fetch(request)
  if (!response.ok) {
    let message
    if (response.headers.get('content-type') === 'application/json') {
      const data = await response.json()
      if (typeof data.message === 'string') {
        message = data.message
      } else if (data.error != null) {
        if (typeof data.error === 'string') {
          message = data.error
        } else if (typeof data.error?.message === 'string') {
          message = data.error.message
        }
      } else if (Array.isArray(data.errors)) {
        const [error] = data.errors
        if (typeof error === 'string') {
          message = error
        } else if (typeof error.message === 'string') {
          message = error.message
        }
      }
    }
    throw new HttpError(response, message)
  }
  if (typeof hooks.response === 'function') return hooks.response(response)
  return response[returnType]()
}

export namespace GetActor {
  export type PathParameters = {
    id: number /* int64 */
  }
  export namespace Response {
    export type Success = ActorDto
    export type Error = unknown
  }
}

export async function getActor(
  pathParams: GetActor.PathParameters,
  requestOptions?: RequestOptions<GetActor.Response.Success>,
): Promise<GetActor.Response.Success> {
  return request({
    path: `/api/actors/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetActor(
  pathParams: GetActor.PathParameters,
  options?: UseQueryOptions<GetActor.Response.Success, GetActor.Response.Error>,
  requestOptions?: RequestOptions<GetActor.Response.Success>,
): UseQueryResult<GetActor.Response.Success, GetActor.Response.Error> {
  return useQuery(
    ['getActor', pathParams],
    () => getActor(pathParams, requestOptions),
    options,
  )
}

export namespace UpdateActor {
  export type PathParameters = {
    id: number /* int64 */
  }
  export namespace Response {
    export type Success = ActorDto
    export type Error = unknown
  }
  export type RequestBody = ActorCore
}

export async function updateActor([pathParams, body, requestOptions]: [
  pathParams: UpdateActor.PathParameters,
  body: UpdateActor.RequestBody,
  requestOptions?: RequestOptions<UpdateActor.Response.Success>,
]): Promise<UpdateActor.Response.Success> {
  return request({
    path: `/api/actors/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateActor(
  options?: UseMutationOptions<
    UpdateActor.Response.Success,
    UpdateActor.Response.Error,
    [
      UpdateActor.PathParameters,
      UpdateActor.RequestBody,
      RequestOptions<UpdateActor.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateActor.Response.Success,
  UpdateActor.Response.Error,
  [
    UpdateActor.PathParameters,
    UpdateActor.RequestBody,
    RequestOptions<UpdateActor.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateActor, options)
}

export namespace DeleteActor {
  export type PathParameters = {
    id: number /* int64 */
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteActor([pathParams, requestOptions]: [
  pathParams: DeleteActor.PathParameters,
  requestOptions?: RequestOptions<DeleteActor.Response.Success>,
]): Promise<DeleteActor.Response.Success> {
  return request({
    path: `/api/actors/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteActor(
  options?: UseMutationOptions<
    DeleteActor.Response.Success,
    DeleteActor.Response.Error,
    [DeleteActor.PathParameters, RequestOptions<DeleteActor.Response.Success>],
    unknown
  >,
): UseMutationResult<
  DeleteActor.Response.Success,
  DeleteActor.Response.Error,
  [DeleteActor.PathParameters, RequestOptions<DeleteActor.Response.Success>],
  unknown
> {
  return useMutation(deleteActor, options)
}

export namespace GetActors {
  export type QueryParameters = {
    q?: string
    page?: number /* int32 */
    perpage?: number /* int32 */
  }
  export namespace Response {
    export type Success = PaginatedActors
    export type Error = unknown
  }
}

export async function getActors(
  queryParams: GetActors.QueryParameters,
  requestOptions?: RequestOptions<GetActors.Response.Success>,
): Promise<GetActors.Response.Success> {
  return request({
    path: `/api/actors`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetActors(
  queryParams: GetActors.QueryParameters,
  options?: UseQueryOptions<
    GetActors.Response.Success,
    GetActors.Response.Error
  >,
  requestOptions?: RequestOptions<GetActors.Response.Success>,
): UseQueryResult<GetActors.Response.Success, GetActors.Response.Error> {
  return useQuery(
    ['getActors', queryParams],
    () => getActors(queryParams, requestOptions),
    options,
  )
}

export namespace CreateActor {
  export namespace Response {
    export type Success = ActorDto
    export type Error = unknown
  }
  export type RequestBody = ActorCore
}

export async function createActor([body, requestOptions]: [
  body: CreateActor.RequestBody,
  requestOptions?: RequestOptions<CreateActor.Response.Success>,
]): Promise<CreateActor.Response.Success> {
  return request({
    path: `/api/actors`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateActor(
  options?: UseMutationOptions<
    CreateActor.Response.Success,
    CreateActor.Response.Error,
    [CreateActor.RequestBody, RequestOptions<CreateActor.Response.Success>],
    unknown
  >,
): UseMutationResult<
  CreateActor.Response.Success,
  CreateActor.Response.Error,
  [CreateActor.RequestBody, RequestOptions<CreateActor.Response.Success>],
  unknown
> {
  return useMutation(createActor, options)
}

export namespace GetPropertyTypes {
  export type QueryParameters = {
    q?: string
    page?: number /* int32 */
    perpage?: number /* int32 */
  }
  export namespace Response {
    export type Success = PaginatedPropertyTypes
    export type Error = unknown
  }
}

export async function getPropertyTypes(
  queryParams: GetPropertyTypes.QueryParameters,
  requestOptions?: RequestOptions<GetPropertyTypes.Response.Success>,
): Promise<GetPropertyTypes.Response.Success> {
  return request({
    path: `/api/property-types`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetPropertyTypes(
  queryParams: GetPropertyTypes.QueryParameters,
  options?: UseQueryOptions<
    GetPropertyTypes.Response.Success,
    GetPropertyTypes.Response.Error
  >,
  requestOptions?: RequestOptions<GetPropertyTypes.Response.Success>,
): UseQueryResult<
  GetPropertyTypes.Response.Success,
  GetPropertyTypes.Response.Error
> {
  return useQuery(
    ['getPropertyTypes', queryParams],
    () => getPropertyTypes(queryParams, requestOptions),
    options,
  )
}

export namespace CreatePropertyType {
  export namespace Response {
    export type Success = PropertyTypeDto
    export type Error = unknown
  }
  export type RequestBody = PropertyTypeCore
}

export async function createPropertyType([body, requestOptions]: [
  body: CreatePropertyType.RequestBody,
  requestOptions?: RequestOptions<CreatePropertyType.Response.Success>,
]): Promise<CreatePropertyType.Response.Success> {
  return request({
    path: `/api/property-types`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreatePropertyType(
  options?: UseMutationOptions<
    CreatePropertyType.Response.Success,
    CreatePropertyType.Response.Error,
    [
      CreatePropertyType.RequestBody,
      RequestOptions<CreatePropertyType.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreatePropertyType.Response.Success,
  CreatePropertyType.Response.Error,
  [
    CreatePropertyType.RequestBody,
    RequestOptions<CreatePropertyType.Response.Success>,
  ],
  unknown
> {
  return useMutation(createPropertyType, options)
}

export namespace GetPropertyType {
  export type PathParameters = {
    code: string
  }
  export namespace Response {
    export type Success = PropertyTypeDto
    export type Error = unknown
  }
}

export async function getPropertyType(
  pathParams: GetPropertyType.PathParameters,
  requestOptions?: RequestOptions<GetPropertyType.Response.Success>,
): Promise<GetPropertyType.Response.Success> {
  return request({
    path: `/api/property-types/${encodeURIComponent(pathParams.code)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetPropertyType(
  pathParams: GetPropertyType.PathParameters,
  options?: UseQueryOptions<
    GetPropertyType.Response.Success,
    GetPropertyType.Response.Error
  >,
  requestOptions?: RequestOptions<GetPropertyType.Response.Success>,
): UseQueryResult<
  GetPropertyType.Response.Success,
  GetPropertyType.Response.Error
> {
  return useQuery(
    ['getPropertyType', pathParams],
    () => getPropertyType(pathParams, requestOptions),
    options,
  )
}

export namespace UpdatePropertyType {
  export type PathParameters = {
    code: string
  }
  export namespace Response {
    export type Success = PropertyTypeDto
    export type Error = unknown
  }
  export type RequestBody = PropertyTypeCore
}

export async function updatePropertyType([pathParams, body, requestOptions]: [
  pathParams: UpdatePropertyType.PathParameters,
  body: UpdatePropertyType.RequestBody,
  requestOptions?: RequestOptions<UpdatePropertyType.Response.Success>,
]): Promise<UpdatePropertyType.Response.Success> {
  return request({
    path: `/api/property-types/${encodeURIComponent(pathParams.code)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdatePropertyType(
  options?: UseMutationOptions<
    UpdatePropertyType.Response.Success,
    UpdatePropertyType.Response.Error,
    [
      UpdatePropertyType.PathParameters,
      UpdatePropertyType.RequestBody,
      RequestOptions<UpdatePropertyType.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdatePropertyType.Response.Success,
  UpdatePropertyType.Response.Error,
  [
    UpdatePropertyType.PathParameters,
    UpdatePropertyType.RequestBody,
    RequestOptions<UpdatePropertyType.Response.Success>,
  ],
  unknown
> {
  return useMutation(updatePropertyType, options)
}

export namespace DeletePropertyType {
  export type PathParameters = {
    code: string
  }
  export type QueryParameters = {
    force?: boolean
  }
  export namespace Response {
    export type Success = PropertyTypeDto
    export type Error = unknown
  }
}

export async function deletePropertyType([
  pathParams,
  queryParams,
  requestOptions,
]: [
  pathParams: DeletePropertyType.PathParameters,
  queryParams: DeletePropertyType.QueryParameters,
  requestOptions?: RequestOptions<DeletePropertyType.Response.Success>,
]): Promise<DeletePropertyType.Response.Success> {
  return request({
    path: `/api/property-types/${encodeURIComponent(pathParams.code)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeletePropertyType(
  options?: UseMutationOptions<
    DeletePropertyType.Response.Success,
    DeletePropertyType.Response.Error,
    [
      DeletePropertyType.PathParameters,
      DeletePropertyType.QueryParameters,
      RequestOptions<DeletePropertyType.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeletePropertyType.Response.Success,
  DeletePropertyType.Response.Error,
  [
    DeletePropertyType.PathParameters,
    DeletePropertyType.QueryParameters,
    RequestOptions<DeletePropertyType.Response.Success>,
  ],
  unknown
> {
  return useMutation(deletePropertyType, options)
}

export namespace ReorderPropertyTypes {
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
  export type RequestBody = PropertyTypesReordering
}

export async function reorderPropertyTypes([body, requestOptions]: [
  body: ReorderPropertyTypes.RequestBody,
  requestOptions?: RequestOptions<ReorderPropertyTypes.Response.Success>,
]): Promise<ReorderPropertyTypes.Response.Success> {
  return request({
    path: `/api/property-types/reorder`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useReorderPropertyTypes(
  options?: UseMutationOptions<
    ReorderPropertyTypes.Response.Success,
    ReorderPropertyTypes.Response.Error,
    [
      ReorderPropertyTypes.RequestBody,
      RequestOptions<ReorderPropertyTypes.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  ReorderPropertyTypes.Response.Success,
  ReorderPropertyTypes.Response.Error,
  [
    ReorderPropertyTypes.RequestBody,
    RequestOptions<ReorderPropertyTypes.Response.Success>,
  ],
  unknown
> {
  return useMutation(reorderPropertyTypes, options)
}

export namespace GetSource {
  export type PathParameters = {
    id: number /* int64 */
  }
  export namespace Response {
    export type Success = SourceDto
    export type Error = unknown
  }
}

export async function getSource(
  pathParams: GetSource.PathParameters,
  requestOptions?: RequestOptions<GetSource.Response.Success>,
): Promise<GetSource.Response.Success> {
  return request({
    path: `/api/sources/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetSource(
  pathParams: GetSource.PathParameters,
  options?: UseQueryOptions<
    GetSource.Response.Success,
    GetSource.Response.Error
  >,
  requestOptions?: RequestOptions<GetSource.Response.Success>,
): UseQueryResult<GetSource.Response.Success, GetSource.Response.Error> {
  return useQuery(
    ['getSource', pathParams],
    () => getSource(pathParams, requestOptions),
    options,
  )
}

export namespace UpdateSource {
  export type PathParameters = {
    id: number /* int64 */
  }
  export namespace Response {
    export type Success = SourceDto
    export type Error = unknown
  }
  export type RequestBody = SourceCore
}

export async function updateSource([pathParams, body, requestOptions]: [
  pathParams: UpdateSource.PathParameters,
  body: UpdateSource.RequestBody,
  requestOptions?: RequestOptions<UpdateSource.Response.Success>,
]): Promise<UpdateSource.Response.Success> {
  return request({
    path: `/api/sources/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateSource(
  options?: UseMutationOptions<
    UpdateSource.Response.Success,
    UpdateSource.Response.Error,
    [
      UpdateSource.PathParameters,
      UpdateSource.RequestBody,
      RequestOptions<UpdateSource.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateSource.Response.Success,
  UpdateSource.Response.Error,
  [
    UpdateSource.PathParameters,
    UpdateSource.RequestBody,
    RequestOptions<UpdateSource.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateSource, options)
}

export namespace DeleteSource {
  export type PathParameters = {
    id: number /* int64 */
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteSource([pathParams, requestOptions]: [
  pathParams: DeleteSource.PathParameters,
  requestOptions?: RequestOptions<DeleteSource.Response.Success>,
]): Promise<DeleteSource.Response.Success> {
  return request({
    path: `/api/sources/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteSource(
  options?: UseMutationOptions<
    DeleteSource.Response.Success,
    DeleteSource.Response.Error,
    [
      DeleteSource.PathParameters,
      RequestOptions<DeleteSource.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteSource.Response.Success,
  DeleteSource.Response.Error,
  [DeleteSource.PathParameters, RequestOptions<DeleteSource.Response.Success>],
  unknown
> {
  return useMutation(deleteSource, options)
}

export namespace GetSources {
  export type QueryParameters = {
    q?: string
    page?: number /* int32 */
    perpage?: number /* int32 */
  }
  export namespace Response {
    export type Success = PaginatedSources
    export type Error = unknown
  }
}

export async function getSources(
  queryParams: GetSources.QueryParameters,
  requestOptions?: RequestOptions<GetSources.Response.Success>,
): Promise<GetSources.Response.Success> {
  return request({
    path: `/api/sources`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetSources(
  queryParams: GetSources.QueryParameters,
  options?: UseQueryOptions<
    GetSources.Response.Success,
    GetSources.Response.Error
  >,
  requestOptions?: RequestOptions<GetSources.Response.Success>,
): UseQueryResult<GetSources.Response.Success, GetSources.Response.Error> {
  return useQuery(
    ['getSources', queryParams],
    () => getSources(queryParams, requestOptions),
    options,
  )
}

export namespace CreateSource {
  export namespace Response {
    export type Success = SourceDto
    export type Error = unknown
  }
  export type RequestBody = SourceCore
}

export async function createSource([body, requestOptions]: [
  body: CreateSource.RequestBody,
  requestOptions?: RequestOptions<CreateSource.Response.Success>,
]): Promise<CreateSource.Response.Success> {
  return request({
    path: `/api/sources`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateSource(
  options?: UseMutationOptions<
    CreateSource.Response.Success,
    CreateSource.Response.Error,
    [CreateSource.RequestBody, RequestOptions<CreateSource.Response.Success>],
    unknown
  >,
): UseMutationResult<
  CreateSource.Response.Success,
  CreateSource.Response.Error,
  [CreateSource.RequestBody, RequestOptions<CreateSource.Response.Success>],
  unknown
> {
  return useMutation(createSource, options)
}

export namespace CreateSubstep {
  export type PathParameters = {
    workflowId: string
    stepId: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = StepDto
    export type Error = unknown
  }
  export type RequestBody = StepCore
}

export async function createSubstep([
  pathParams,
  queryParams,
  body,
  requestOptions,
]: [
  pathParams: CreateSubstep.PathParameters,
  queryParams: CreateSubstep.QueryParameters,
  body: CreateSubstep.RequestBody,
  requestOptions?: RequestOptions<CreateSubstep.Response.Success>,
]): Promise<CreateSubstep.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(
      pathParams.workflowId,
    )}/steps/${encodeURIComponent(pathParams.stepId)}/steps`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateSubstep(
  options?: UseMutationOptions<
    CreateSubstep.Response.Success,
    CreateSubstep.Response.Error,
    [
      CreateSubstep.PathParameters,
      CreateSubstep.QueryParameters,
      CreateSubstep.RequestBody,
      RequestOptions<CreateSubstep.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateSubstep.Response.Success,
  CreateSubstep.Response.Error,
  [
    CreateSubstep.PathParameters,
    CreateSubstep.QueryParameters,
    CreateSubstep.RequestBody,
    RequestOptions<CreateSubstep.Response.Success>,
  ],
  unknown
> {
  return useMutation(createSubstep, options)
}

export namespace GetStep {
  export type PathParameters = {
    workflowId: string
    stepId: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = StepDto
    export type Error = unknown
  }
}

export async function getStep(
  pathParams: GetStep.PathParameters,
  queryParams: GetStep.QueryParameters,
  requestOptions?: RequestOptions<GetStep.Response.Success>,
): Promise<GetStep.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(
      pathParams.workflowId,
    )}/steps/${encodeURIComponent(pathParams.stepId)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetStep(
  pathParams: GetStep.PathParameters,
  queryParams: GetStep.QueryParameters,
  options?: UseQueryOptions<GetStep.Response.Success, GetStep.Response.Error>,
  requestOptions?: RequestOptions<GetStep.Response.Success>,
): UseQueryResult<GetStep.Response.Success, GetStep.Response.Error> {
  return useQuery(
    ['getStep', pathParams, queryParams],
    () => getStep(pathParams, queryParams, requestOptions),
    options,
  )
}

export namespace UpdateStep {
  export type PathParameters = {
    workflowId: string
    stepId: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = StepDto
    export type Error = unknown
  }
  export type RequestBody = StepCore
}

export async function updateStep([
  pathParams,
  queryParams,
  body,
  requestOptions,
]: [
  pathParams: UpdateStep.PathParameters,
  queryParams: UpdateStep.QueryParameters,
  body: UpdateStep.RequestBody,
  requestOptions?: RequestOptions<UpdateStep.Response.Success>,
]): Promise<UpdateStep.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(
      pathParams.workflowId,
    )}/steps/${encodeURIComponent(pathParams.stepId)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateStep(
  options?: UseMutationOptions<
    UpdateStep.Response.Success,
    UpdateStep.Response.Error,
    [
      UpdateStep.PathParameters,
      UpdateStep.QueryParameters,
      UpdateStep.RequestBody,
      RequestOptions<UpdateStep.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateStep.Response.Success,
  UpdateStep.Response.Error,
  [
    UpdateStep.PathParameters,
    UpdateStep.QueryParameters,
    UpdateStep.RequestBody,
    RequestOptions<UpdateStep.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateStep, options)
}

export namespace DeleteStep {
  export type PathParameters = {
    workflowId: string
    stepId: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteStep([pathParams, queryParams, requestOptions]: [
  pathParams: DeleteStep.PathParameters,
  queryParams: DeleteStep.QueryParameters,
  requestOptions?: RequestOptions<DeleteStep.Response.Success>,
]): Promise<DeleteStep.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(
      pathParams.workflowId,
    )}/steps/${encodeURIComponent(pathParams.stepId)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteStep(
  options?: UseMutationOptions<
    DeleteStep.Response.Success,
    DeleteStep.Response.Error,
    [
      DeleteStep.PathParameters,
      DeleteStep.QueryParameters,
      RequestOptions<DeleteStep.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteStep.Response.Success,
  DeleteStep.Response.Error,
  [
    DeleteStep.PathParameters,
    DeleteStep.QueryParameters,
    RequestOptions<DeleteStep.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteStep, options)
}

export namespace RevertStep {
  export type PathParameters = {
    workflowId: string
    stepId: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = StepDto
    export type Error = unknown
  }
}

export async function revertStep([pathParams, requestOptions]: [
  pathParams: RevertStep.PathParameters,
  requestOptions?: RequestOptions<RevertStep.Response.Success>,
]): Promise<RevertStep.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(
      pathParams.workflowId,
    )}/steps/${encodeURIComponent(
      pathParams.stepId,
    )}/versions/${encodeURIComponent(pathParams.versionId)}/revert`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useRevertStep(
  options?: UseMutationOptions<
    RevertStep.Response.Success,
    RevertStep.Response.Error,
    [RevertStep.PathParameters, RequestOptions<RevertStep.Response.Success>],
    unknown
  >,
): UseMutationResult<
  RevertStep.Response.Success,
  RevertStep.Response.Error,
  [RevertStep.PathParameters, RequestOptions<RevertStep.Response.Success>],
  unknown
> {
  return useMutation(revertStep, options)
}

export namespace PublishWorkflow {
  export type PathParameters = {
    workflowId: string
  }
  export namespace Response {
    export type Success = WorkflowDto
    export type Error = unknown
  }
}

export async function publishWorkflow([pathParams, requestOptions]: [
  pathParams: PublishWorkflow.PathParameters,
  requestOptions?: RequestOptions<PublishWorkflow.Response.Success>,
]): Promise<PublishWorkflow.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(pathParams.workflowId)}/commit`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function usePublishWorkflow(
  options?: UseMutationOptions<
    PublishWorkflow.Response.Success,
    PublishWorkflow.Response.Error,
    [
      PublishWorkflow.PathParameters,
      RequestOptions<PublishWorkflow.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  PublishWorkflow.Response.Success,
  PublishWorkflow.Response.Error,
  [
    PublishWorkflow.PathParameters,
    RequestOptions<PublishWorkflow.Response.Success>,
  ],
  unknown
> {
  return useMutation(publishWorkflow, options)
}

export namespace GetWorkflowHistory {
  export type PathParameters = {
    workflowId: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = Array<ItemExtBasicDto>
    export type Error = unknown
  }
}

export async function getWorkflowHistory(
  pathParams: GetWorkflowHistory.PathParameters,
  queryParams: GetWorkflowHistory.QueryParameters,
  requestOptions?: RequestOptions<GetWorkflowHistory.Response.Success>,
): Promise<GetWorkflowHistory.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(pathParams.workflowId)}/history`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetWorkflowHistory(
  pathParams: GetWorkflowHistory.PathParameters,
  queryParams: GetWorkflowHistory.QueryParameters,
  options?: UseQueryOptions<
    GetWorkflowHistory.Response.Success,
    GetWorkflowHistory.Response.Error
  >,
  requestOptions?: RequestOptions<GetWorkflowHistory.Response.Success>,
): UseQueryResult<
  GetWorkflowHistory.Response.Success,
  GetWorkflowHistory.Response.Error
> {
  return useQuery(
    ['getWorkflowHistory', pathParams, queryParams],
    () => getWorkflowHistory(pathParams, queryParams, requestOptions),
    options,
  )
}

export namespace GetStepHistory {
  export type PathParameters = {
    workflowId: string
    stepId: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = Array<ItemExtBasicDto>
    export type Error = unknown
  }
}

export async function getStepHistory(
  pathParams: GetStepHistory.PathParameters,
  queryParams: GetStepHistory.QueryParameters,
  requestOptions?: RequestOptions<GetStepHistory.Response.Success>,
): Promise<GetStepHistory.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(
      pathParams.workflowId,
    )}/steps/${encodeURIComponent(pathParams.stepId)}/history`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetStepHistory(
  pathParams: GetStepHistory.PathParameters,
  queryParams: GetStepHistory.QueryParameters,
  options?: UseQueryOptions<
    GetStepHistory.Response.Success,
    GetStepHistory.Response.Error
  >,
  requestOptions?: RequestOptions<GetStepHistory.Response.Success>,
): UseQueryResult<
  GetStepHistory.Response.Success,
  GetStepHistory.Response.Error
> {
  return useQuery(
    ['getStepHistory', pathParams, queryParams],
    () => getStepHistory(pathParams, queryParams, requestOptions),
    options,
  )
}

export namespace GetWorkflow {
  export type PathParameters = {
    workflowId: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = WorkflowDto
    export type Error = unknown
  }
}

export async function getWorkflow(
  pathParams: GetWorkflow.PathParameters,
  queryParams: GetWorkflow.QueryParameters,
  requestOptions?: RequestOptions<GetWorkflow.Response.Success>,
): Promise<GetWorkflow.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(pathParams.workflowId)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetWorkflow(
  pathParams: GetWorkflow.PathParameters,
  queryParams: GetWorkflow.QueryParameters,
  options?: UseQueryOptions<
    GetWorkflow.Response.Success,
    GetWorkflow.Response.Error
  >,
  requestOptions?: RequestOptions<GetWorkflow.Response.Success>,
): UseQueryResult<GetWorkflow.Response.Success, GetWorkflow.Response.Error> {
  return useQuery(
    ['getWorkflow', pathParams, queryParams],
    () => getWorkflow(pathParams, queryParams, requestOptions),
    options,
  )
}

export namespace UpdateWorkflow {
  export type PathParameters = {
    workflowId: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = WorkflowDto
    export type Error = unknown
  }
  export type RequestBody = WorkflowCore
}

export async function updateWorkflow([
  pathParams,
  queryParams,
  body,
  requestOptions,
]: [
  pathParams: UpdateWorkflow.PathParameters,
  queryParams: UpdateWorkflow.QueryParameters,
  body: UpdateWorkflow.RequestBody,
  requestOptions?: RequestOptions<UpdateWorkflow.Response.Success>,
]): Promise<UpdateWorkflow.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(pathParams.workflowId)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateWorkflow(
  options?: UseMutationOptions<
    UpdateWorkflow.Response.Success,
    UpdateWorkflow.Response.Error,
    [
      UpdateWorkflow.PathParameters,
      UpdateWorkflow.QueryParameters,
      UpdateWorkflow.RequestBody,
      RequestOptions<UpdateWorkflow.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateWorkflow.Response.Success,
  UpdateWorkflow.Response.Error,
  [
    UpdateWorkflow.PathParameters,
    UpdateWorkflow.QueryParameters,
    UpdateWorkflow.RequestBody,
    RequestOptions<UpdateWorkflow.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateWorkflow, options)
}

export namespace DeleteWorkflow {
  export type PathParameters = {
    workflowId: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteWorkflow([
  pathParams,
  queryParams,
  requestOptions,
]: [
  pathParams: DeleteWorkflow.PathParameters,
  queryParams: DeleteWorkflow.QueryParameters,
  requestOptions?: RequestOptions<DeleteWorkflow.Response.Success>,
]): Promise<DeleteWorkflow.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(pathParams.workflowId)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteWorkflow(
  options?: UseMutationOptions<
    DeleteWorkflow.Response.Success,
    DeleteWorkflow.Response.Error,
    [
      DeleteWorkflow.PathParameters,
      DeleteWorkflow.QueryParameters,
      RequestOptions<DeleteWorkflow.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteWorkflow.Response.Success,
  DeleteWorkflow.Response.Error,
  [
    DeleteWorkflow.PathParameters,
    DeleteWorkflow.QueryParameters,
    RequestOptions<DeleteWorkflow.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteWorkflow, options)
}

export namespace GetWorkflowVersion {
  export type PathParameters = {
    workflowId: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = WorkflowDto
    export type Error = unknown
  }
}

export async function getWorkflowVersion(
  pathParams: GetWorkflowVersion.PathParameters,
  requestOptions?: RequestOptions<GetWorkflowVersion.Response.Success>,
): Promise<GetWorkflowVersion.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(
      pathParams.workflowId,
    )}/versions/${encodeURIComponent(pathParams.versionId)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetWorkflowVersion(
  pathParams: GetWorkflowVersion.PathParameters,
  options?: UseQueryOptions<
    GetWorkflowVersion.Response.Success,
    GetWorkflowVersion.Response.Error
  >,
  requestOptions?: RequestOptions<GetWorkflowVersion.Response.Success>,
): UseQueryResult<
  GetWorkflowVersion.Response.Success,
  GetWorkflowVersion.Response.Error
> {
  return useQuery(
    ['getWorkflowVersion', pathParams],
    () => getWorkflowVersion(pathParams, requestOptions),
    options,
  )
}

export namespace GetWorkflows {
  export type QueryParameters = {
    page?: number /* int32 */
    perpage?: number /* int32 */
    approved?: boolean
  }
  export namespace Response {
    export type Success = PaginatedWorkflows
    export type Error = unknown
  }
}

export async function getWorkflows(
  queryParams: GetWorkflows.QueryParameters,
  requestOptions?: RequestOptions<GetWorkflows.Response.Success>,
): Promise<GetWorkflows.Response.Success> {
  return request({
    path: `/api/workflows`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetWorkflows(
  queryParams: GetWorkflows.QueryParameters,
  options?: UseQueryOptions<
    GetWorkflows.Response.Success,
    GetWorkflows.Response.Error
  >,
  requestOptions?: RequestOptions<GetWorkflows.Response.Success>,
): UseQueryResult<GetWorkflows.Response.Success, GetWorkflows.Response.Error> {
  return useQuery(
    ['getWorkflows', queryParams],
    () => getWorkflows(queryParams, requestOptions),
    options,
  )
}

export namespace CreateWorkflow {
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = WorkflowDto
    export type Error = unknown
  }
  export type RequestBody = WorkflowCore
}

export async function createWorkflow([queryParams, body, requestOptions]: [
  queryParams: CreateWorkflow.QueryParameters,
  body: CreateWorkflow.RequestBody,
  requestOptions?: RequestOptions<CreateWorkflow.Response.Success>,
]): Promise<CreateWorkflow.Response.Success> {
  return request({
    path: `/api/workflows`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateWorkflow(
  options?: UseMutationOptions<
    CreateWorkflow.Response.Success,
    CreateWorkflow.Response.Error,
    [
      CreateWorkflow.QueryParameters,
      CreateWorkflow.RequestBody,
      RequestOptions<CreateWorkflow.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateWorkflow.Response.Success,
  CreateWorkflow.Response.Error,
  [
    CreateWorkflow.QueryParameters,
    CreateWorkflow.RequestBody,
    RequestOptions<CreateWorkflow.Response.Success>,
  ],
  unknown
> {
  return useMutation(createWorkflow, options)
}

export namespace RevertWorkflow {
  export type PathParameters = {
    id: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = WorkflowDto
    export type Error = unknown
  }
}

export async function revertWorkflow([pathParams, requestOptions]: [
  pathParams: RevertWorkflow.PathParameters,
  requestOptions?: RequestOptions<RevertWorkflow.Response.Success>,
]): Promise<RevertWorkflow.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(
      pathParams.id,
    )}/versions/${encodeURIComponent(pathParams.versionId)}/revert`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useRevertWorkflow(
  options?: UseMutationOptions<
    RevertWorkflow.Response.Success,
    RevertWorkflow.Response.Error,
    [
      RevertWorkflow.PathParameters,
      RequestOptions<RevertWorkflow.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  RevertWorkflow.Response.Success,
  RevertWorkflow.Response.Error,
  [
    RevertWorkflow.PathParameters,
    RequestOptions<RevertWorkflow.Response.Success>,
  ],
  unknown
> {
  return useMutation(revertWorkflow, options)
}

export namespace GetStepVersion {
  export type PathParameters = {
    workflowId: string
    stepId: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = StepDto
    export type Error = unknown
  }
}

export async function getStepVersion(
  pathParams: GetStepVersion.PathParameters,
  requestOptions?: RequestOptions<GetStepVersion.Response.Success>,
): Promise<GetStepVersion.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(
      pathParams.workflowId,
    )}/steps/${encodeURIComponent(
      pathParams.stepId,
    )}/versions/${encodeURIComponent(pathParams.versionId)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetStepVersion(
  pathParams: GetStepVersion.PathParameters,
  options?: UseQueryOptions<
    GetStepVersion.Response.Success,
    GetStepVersion.Response.Error
  >,
  requestOptions?: RequestOptions<GetStepVersion.Response.Success>,
): UseQueryResult<
  GetStepVersion.Response.Success,
  GetStepVersion.Response.Error
> {
  return useQuery(
    ['getStepVersion', pathParams],
    () => getStepVersion(pathParams, requestOptions),
    options,
  )
}

export namespace CreateStep {
  export type PathParameters = {
    workflowId: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = StepDto
    export type Error = unknown
  }
  export type RequestBody = StepCore
}

export async function createStep([
  pathParams,
  queryParams,
  body,
  requestOptions,
]: [
  pathParams: CreateStep.PathParameters,
  queryParams: CreateStep.QueryParameters,
  body: CreateStep.RequestBody,
  requestOptions?: RequestOptions<CreateStep.Response.Success>,
]): Promise<CreateStep.Response.Success> {
  return request({
    path: `/api/workflows/${encodeURIComponent(pathParams.workflowId)}/steps`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateStep(
  options?: UseMutationOptions<
    CreateStep.Response.Success,
    CreateStep.Response.Error,
    [
      CreateStep.PathParameters,
      CreateStep.QueryParameters,
      CreateStep.RequestBody,
      RequestOptions<CreateStep.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateStep.Response.Success,
  CreateStep.Response.Error,
  [
    CreateStep.PathParameters,
    CreateStep.QueryParameters,
    CreateStep.RequestBody,
    RequestOptions<CreateStep.Response.Success>,
  ],
  unknown
> {
  return useMutation(createStep, options)
}

export namespace ReindexItems {
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function reindexItems([requestOptions]: [
  requestOptions?: RequestOptions<ReindexItems.Response.Success>,
]): Promise<ReindexItems.Response.Success> {
  return request({
    path: `/api/item-reindex`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useReindexItems(
  options?: UseMutationOptions<
    ReindexItems.Response.Success,
    ReindexItems.Response.Error,
    [RequestOptions<ReindexItems.Response.Success>],
    unknown
  >,
): UseMutationResult<
  ReindexItems.Response.Success,
  ReindexItems.Response.Error,
  [RequestOptions<ReindexItems.Response.Success>],
  unknown
> {
  return useMutation(reindexItems, options)
}

export namespace RebuildAutocompleteIndex {
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function rebuildAutocompleteIndex([requestOptions]: [
  requestOptions?: RequestOptions<RebuildAutocompleteIndex.Response.Success>,
]): Promise<RebuildAutocompleteIndex.Response.Success> {
  return request({
    path: `/api/item-autocomplete-rebuild`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useRebuildAutocompleteIndex(
  options?: UseMutationOptions<
    RebuildAutocompleteIndex.Response.Success,
    RebuildAutocompleteIndex.Response.Error,
    [RequestOptions<RebuildAutocompleteIndex.Response.Success>],
    unknown
  >,
): UseMutationResult<
  RebuildAutocompleteIndex.Response.Success,
  RebuildAutocompleteIndex.Response.Error,
  [RequestOptions<RebuildAutocompleteIndex.Response.Success>],
  unknown
> {
  return useMutation(rebuildAutocompleteIndex, options)
}

export namespace ReindexConcepts {
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function reindexConcepts([requestOptions]: [
  requestOptions?: RequestOptions<ReindexConcepts.Response.Success>,
]): Promise<ReindexConcepts.Response.Success> {
  return request({
    path: `/api/concept-reindex`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useReindexConcepts(
  options?: UseMutationOptions<
    ReindexConcepts.Response.Success,
    ReindexConcepts.Response.Error,
    [RequestOptions<ReindexConcepts.Response.Success>],
    unknown
  >,
): UseMutationResult<
  ReindexConcepts.Response.Success,
  ReindexConcepts.Response.Error,
  [RequestOptions<ReindexConcepts.Response.Success>],
  unknown
> {
  return useMutation(reindexConcepts, options)
}

export namespace RegisterOAuth2User {
  export namespace Response {
    export type Success = UserDto
    export type Error = unknown
  }
  export type RequestBody = OAuthRegistrationData
}

export async function registerOAuth2User([body, requestOptions]: [
  body: RegisterOAuth2User.RequestBody,
  requestOptions?: RequestOptions<RegisterOAuth2User.Response.Success>,
]): Promise<RegisterOAuth2User.Response.Success> {
  return request({
    path: `/api/oauth/sign-up`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useRegisterOAuth2User(
  options?: UseMutationOptions<
    RegisterOAuth2User.Response.Success,
    RegisterOAuth2User.Response.Error,
    [
      RegisterOAuth2User.RequestBody,
      RequestOptions<RegisterOAuth2User.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  RegisterOAuth2User.Response.Success,
  RegisterOAuth2User.Response.Error,
  [
    RegisterOAuth2User.RequestBody,
    RequestOptions<RegisterOAuth2User.Response.Success>,
  ],
  unknown
> {
  return useMutation(registerOAuth2User, options)
}

export namespace ValidateImplicitGrantToken {
  export namespace Response {
    export type Success = OAuthRegistrationDto
    export type Error = unknown
  }
  export type RequestBody = ImplicitGrantTokenData
}

export async function validateImplicitGrantToken([body, requestOptions]: [
  body: ValidateImplicitGrantToken.RequestBody,
  requestOptions?: RequestOptions<ValidateImplicitGrantToken.Response.Success>,
]): Promise<ValidateImplicitGrantToken.Response.Success> {
  return request({
    path: `/api/oauth/token`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useValidateImplicitGrantToken(
  options?: UseMutationOptions<
    ValidateImplicitGrantToken.Response.Success,
    ValidateImplicitGrantToken.Response.Error,
    [
      ValidateImplicitGrantToken.RequestBody,
      RequestOptions<ValidateImplicitGrantToken.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  ValidateImplicitGrantToken.Response.Success,
  ValidateImplicitGrantToken.Response.Error,
  [
    ValidateImplicitGrantToken.RequestBody,
    RequestOptions<ValidateImplicitGrantToken.Response.Success>,
  ],
  unknown
> {
  return useMutation(validateImplicitGrantToken, options)
}

export namespace GetLoggedInUser {
  export namespace Response {
    export type Success = UserDto
    export type Error = unknown
  }
}

export async function getLoggedInUser(
  requestOptions?: RequestOptions<GetLoggedInUser.Response.Success>,
): Promise<GetLoggedInUser.Response.Success> {
  return request({
    path: `/api/auth/me`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetLoggedInUser(
  options?: UseQueryOptions<
    GetLoggedInUser.Response.Success,
    GetLoggedInUser.Response.Error
  >,
  requestOptions?: RequestOptions<GetLoggedInUser.Response.Success>,
): UseQueryResult<
  GetLoggedInUser.Response.Success,
  GetLoggedInUser.Response.Error
> {
  return useQuery(
    ['getLoggedInUser'],
    () => getLoggedInUser(requestOptions),
    options,
  )
}

export namespace GetUser {
  export type PathParameters = {
    id: number /* int64 */
  }
  export namespace Response {
    export type Success = UserDto
    export type Error = unknown
  }
}

export async function getUser(
  pathParams: GetUser.PathParameters,
  requestOptions?: RequestOptions<GetUser.Response.Success>,
): Promise<GetUser.Response.Success> {
  return request({
    path: `/api/users/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetUser(
  pathParams: GetUser.PathParameters,
  options?: UseQueryOptions<GetUser.Response.Success, GetUser.Response.Error>,
  requestOptions?: RequestOptions<GetUser.Response.Success>,
): UseQueryResult<GetUser.Response.Success, GetUser.Response.Error> {
  return useQuery(
    ['getUser', pathParams],
    () => getUser(pathParams, requestOptions),
    options,
  )
}

export namespace UpdateUserDisplayName {
  export type PathParameters = {
    id: number /* int64 */
  }
  export namespace Response {
    export type Success = UserDto
    export type Error = unknown
  }
  export type RequestBody = UserDisplayNameCore
}

export async function updateUserDisplayName([
  pathParams,
  body,
  requestOptions,
]: [
  pathParams: UpdateUserDisplayName.PathParameters,
  body: UpdateUserDisplayName.RequestBody,
  requestOptions?: RequestOptions<UpdateUserDisplayName.Response.Success>,
]): Promise<UpdateUserDisplayName.Response.Success> {
  return request({
    path: `/api/users/${encodeURIComponent(pathParams.id)}/display-name`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateUserDisplayName(
  options?: UseMutationOptions<
    UpdateUserDisplayName.Response.Success,
    UpdateUserDisplayName.Response.Error,
    [
      UpdateUserDisplayName.PathParameters,
      UpdateUserDisplayName.RequestBody,
      RequestOptions<UpdateUserDisplayName.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateUserDisplayName.Response.Success,
  UpdateUserDisplayName.Response.Error,
  [
    UpdateUserDisplayName.PathParameters,
    UpdateUserDisplayName.RequestBody,
    RequestOptions<UpdateUserDisplayName.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateUserDisplayName, options)
}

export namespace UpdateUserPassword {
  export type PathParameters = {
    id: number /* int64 */
  }
  export namespace Response {
    export type Success = UserDto
    export type Error = unknown
  }
  export type RequestBody = NewPasswordData
}

export async function updateUserPassword([pathParams, body, requestOptions]: [
  pathParams: UpdateUserPassword.PathParameters,
  body: UpdateUserPassword.RequestBody,
  requestOptions?: RequestOptions<UpdateUserPassword.Response.Success>,
]): Promise<UpdateUserPassword.Response.Success> {
  return request({
    path: `/api/users/${encodeURIComponent(pathParams.id)}/password`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateUserPassword(
  options?: UseMutationOptions<
    UpdateUserPassword.Response.Success,
    UpdateUserPassword.Response.Error,
    [
      UpdateUserPassword.PathParameters,
      UpdateUserPassword.RequestBody,
      RequestOptions<UpdateUserPassword.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateUserPassword.Response.Success,
  UpdateUserPassword.Response.Error,
  [
    UpdateUserPassword.PathParameters,
    UpdateUserPassword.RequestBody,
    RequestOptions<UpdateUserPassword.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateUserPassword, options)
}

export namespace GetUsers {
  export type QueryParameters = {
    q?: string
    page?: number /* int32 */
    perpage?: number /* int32 */
  }
  export namespace Response {
    export type Success = PaginatedUsers
    export type Error = unknown
  }
}

export async function getUsers(
  queryParams: GetUsers.QueryParameters,
  requestOptions?: RequestOptions<GetUsers.Response.Success>,
): Promise<GetUsers.Response.Success> {
  return request({
    path: `/api/users`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetUsers(
  queryParams: GetUsers.QueryParameters,
  options?: UseQueryOptions<GetUsers.Response.Success, GetUsers.Response.Error>,
  requestOptions?: RequestOptions<GetUsers.Response.Success>,
): UseQueryResult<GetUsers.Response.Success, GetUsers.Response.Error> {
  return useQuery(
    ['getUsers', queryParams],
    () => getUsers(queryParams, requestOptions),
    options,
  )
}

export namespace CreateUser {
  export namespace Response {
    export type Success = UserDto
    export type Error = unknown
  }
  export type RequestBody = UserCore
}

export async function createUser([body, requestOptions]: [
  body: CreateUser.RequestBody,
  requestOptions?: RequestOptions<CreateUser.Response.Success>,
]): Promise<CreateUser.Response.Success> {
  return request({
    path: `/api/users`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateUser(
  options?: UseMutationOptions<
    CreateUser.Response.Success,
    CreateUser.Response.Error,
    [CreateUser.RequestBody, RequestOptions<CreateUser.Response.Success>],
    unknown
  >,
): UseMutationResult<
  CreateUser.Response.Success,
  CreateUser.Response.Error,
  [CreateUser.RequestBody, RequestOptions<CreateUser.Response.Success>],
  unknown
> {
  return useMutation(createUser, options)
}

export namespace UpdateUserStatus {
  export type PathParameters = {
    id: number /* int64 */
    userStatus: 'during-registration' | 'enabled' | 'locked'
  }
  export namespace Response {
    export type Success = UserDto
    export type Error = unknown
  }
}

export async function updateUserStatus([pathParams, requestOptions]: [
  pathParams: UpdateUserStatus.PathParameters,
  requestOptions?: RequestOptions<UpdateUserStatus.Response.Success>,
]): Promise<UpdateUserStatus.Response.Success> {
  return request({
    path: `/api/users/${encodeURIComponent(
      pathParams.id,
    )}/status/${encodeURIComponent(pathParams.userStatus)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateUserStatus(
  options?: UseMutationOptions<
    UpdateUserStatus.Response.Success,
    UpdateUserStatus.Response.Error,
    [
      UpdateUserStatus.PathParameters,
      RequestOptions<UpdateUserStatus.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateUserStatus.Response.Success,
  UpdateUserStatus.Response.Error,
  [
    UpdateUserStatus.PathParameters,
    RequestOptions<UpdateUserStatus.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateUserStatus, options)
}

export namespace UpdateUserRole {
  export type PathParameters = {
    id: number /* int64 */
    userRole:
      | 'contributor'
      | 'system-contributor'
      | 'moderator'
      | 'system-moderator'
      | 'administrator'
  }
  export namespace Response {
    export type Success = UserDto
    export type Error = unknown
  }
}

export async function updateUserRole([pathParams, requestOptions]: [
  pathParams: UpdateUserRole.PathParameters,
  requestOptions?: RequestOptions<UpdateUserRole.Response.Success>,
]): Promise<UpdateUserRole.Response.Success> {
  return request({
    path: `/api/users/${encodeURIComponent(
      pathParams.id,
    )}/role/${encodeURIComponent(pathParams.userRole)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateUserRole(
  options?: UseMutationOptions<
    UpdateUserRole.Response.Success,
    UpdateUserRole.Response.Error,
    [
      UpdateUserRole.PathParameters,
      RequestOptions<UpdateUserRole.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateUserRole.Response.Success,
  UpdateUserRole.Response.Error,
  [
    UpdateUserRole.PathParameters,
    RequestOptions<UpdateUserRole.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateUserRole, options)
}

export namespace GetAllItemRelations {
  export namespace Response {
    export type Success = Array<ItemRelationDto>
    export type Error = unknown
  }
}

export async function getAllItemRelations(
  requestOptions?: RequestOptions<GetAllItemRelations.Response.Success>,
): Promise<GetAllItemRelations.Response.Success> {
  return request({
    path: `/api/items-relations`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetAllItemRelations(
  options?: UseQueryOptions<
    GetAllItemRelations.Response.Success,
    GetAllItemRelations.Response.Error
  >,
  requestOptions?: RequestOptions<GetAllItemRelations.Response.Success>,
): UseQueryResult<
  GetAllItemRelations.Response.Success,
  GetAllItemRelations.Response.Error
> {
  return useQuery(
    ['getAllItemRelations'],
    () => getAllItemRelations(requestOptions),
    options,
  )
}

export namespace CreateItemRelatedItem {
  export type PathParameters = {
    subjectId: string
    objectId: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = ItemRelatedItemDto
    export type Error = unknown
  }
  export type RequestBody = ItemRelationId
}

export async function createItemRelatedItem([
  pathParams,
  queryParams,
  body,
  requestOptions,
]: [
  pathParams: CreateItemRelatedItem.PathParameters,
  queryParams: CreateItemRelatedItem.QueryParameters,
  body: CreateItemRelatedItem.RequestBody,
  requestOptions?: RequestOptions<CreateItemRelatedItem.Response.Success>,
]): Promise<CreateItemRelatedItem.Response.Success> {
  return request({
    path: `/api/items-relations/${encodeURIComponent(
      pathParams.subjectId,
    )}/${encodeURIComponent(pathParams.objectId)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateItemRelatedItem(
  options?: UseMutationOptions<
    CreateItemRelatedItem.Response.Success,
    CreateItemRelatedItem.Response.Error,
    [
      CreateItemRelatedItem.PathParameters,
      CreateItemRelatedItem.QueryParameters,
      CreateItemRelatedItem.RequestBody,
      RequestOptions<CreateItemRelatedItem.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateItemRelatedItem.Response.Success,
  CreateItemRelatedItem.Response.Error,
  [
    CreateItemRelatedItem.PathParameters,
    CreateItemRelatedItem.QueryParameters,
    CreateItemRelatedItem.RequestBody,
    RequestOptions<CreateItemRelatedItem.Response.Success>,
  ],
  unknown
> {
  return useMutation(createItemRelatedItem, options)
}

export namespace DeleteItemRelatedItem {
  export type PathParameters = {
    subjectId: string
    objectId: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteItemRelatedItem([
  pathParams,
  queryParams,
  requestOptions,
]: [
  pathParams: DeleteItemRelatedItem.PathParameters,
  queryParams: DeleteItemRelatedItem.QueryParameters,
  requestOptions?: RequestOptions<DeleteItemRelatedItem.Response.Success>,
]): Promise<DeleteItemRelatedItem.Response.Success> {
  return request({
    path: `/api/items-relations/${encodeURIComponent(
      pathParams.subjectId,
    )}/${encodeURIComponent(pathParams.objectId)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteItemRelatedItem(
  options?: UseMutationOptions<
    DeleteItemRelatedItem.Response.Success,
    DeleteItemRelatedItem.Response.Error,
    [
      DeleteItemRelatedItem.PathParameters,
      DeleteItemRelatedItem.QueryParameters,
      RequestOptions<DeleteItemRelatedItem.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteItemRelatedItem.Response.Success,
  DeleteItemRelatedItem.Response.Error,
  [
    DeleteItemRelatedItem.PathParameters,
    DeleteItemRelatedItem.QueryParameters,
    RequestOptions<DeleteItemRelatedItem.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteItemRelatedItem, options)
}

export namespace GetLastComments {
  export type PathParameters = {
    itemId: string
  }
  export namespace Response {
    export type Success = Array<ItemCommentDto>
    export type Error = unknown
  }
}

export async function getLastComments(
  pathParams: GetLastComments.PathParameters,
  requestOptions?: RequestOptions<GetLastComments.Response.Success>,
): Promise<GetLastComments.Response.Success> {
  return request({
    path: `/api/items/${encodeURIComponent(pathParams.itemId)}/last-comments`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetLastComments(
  pathParams: GetLastComments.PathParameters,
  options?: UseQueryOptions<
    GetLastComments.Response.Success,
    GetLastComments.Response.Error
  >,
  requestOptions?: RequestOptions<GetLastComments.Response.Success>,
): UseQueryResult<
  GetLastComments.Response.Success,
  GetLastComments.Response.Error
> {
  return useQuery(
    ['getLastComments', pathParams],
    () => getLastComments(pathParams, requestOptions),
    options,
  )
}

export namespace GetComments {
  export type PathParameters = {
    itemId: string
  }
  export namespace Response {
    export type Success = Array<ItemCommentDto>
    export type Error = unknown
  }
}

export async function getComments(
  pathParams: GetComments.PathParameters,
  requestOptions?: RequestOptions<GetComments.Response.Success>,
): Promise<GetComments.Response.Success> {
  return request({
    path: `/api/items/${encodeURIComponent(pathParams.itemId)}/comments`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetComments(
  pathParams: GetComments.PathParameters,
  options?: UseQueryOptions<
    GetComments.Response.Success,
    GetComments.Response.Error
  >,
  requestOptions?: RequestOptions<GetComments.Response.Success>,
): UseQueryResult<GetComments.Response.Success, GetComments.Response.Error> {
  return useQuery(
    ['getComments', pathParams],
    () => getComments(pathParams, requestOptions),
    options,
  )
}

export namespace CreateItemComment {
  export type PathParameters = {
    itemId: string
  }
  export namespace Response {
    export type Success = ItemCommentDto
    export type Error = unknown
  }
  export type RequestBody = ItemCommentCore
}

export async function createItemComment([pathParams, body, requestOptions]: [
  pathParams: CreateItemComment.PathParameters,
  body: CreateItemComment.RequestBody,
  requestOptions?: RequestOptions<CreateItemComment.Response.Success>,
]): Promise<CreateItemComment.Response.Success> {
  return request({
    path: `/api/items/${encodeURIComponent(pathParams.itemId)}/comments`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateItemComment(
  options?: UseMutationOptions<
    CreateItemComment.Response.Success,
    CreateItemComment.Response.Error,
    [
      CreateItemComment.PathParameters,
      CreateItemComment.RequestBody,
      RequestOptions<CreateItemComment.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateItemComment.Response.Success,
  CreateItemComment.Response.Error,
  [
    CreateItemComment.PathParameters,
    CreateItemComment.RequestBody,
    RequestOptions<CreateItemComment.Response.Success>,
  ],
  unknown
> {
  return useMutation(createItemComment, options)
}

export namespace UpdateItemComment {
  export type PathParameters = {
    itemId: string
    id: number /* int64 */
  }
  export namespace Response {
    export type Success = ItemCommentDto
    export type Error = unknown
  }
  export type RequestBody = ItemCommentCore
}

export async function updateItemComment([pathParams, body, requestOptions]: [
  pathParams: UpdateItemComment.PathParameters,
  body: UpdateItemComment.RequestBody,
  requestOptions?: RequestOptions<UpdateItemComment.Response.Success>,
]): Promise<UpdateItemComment.Response.Success> {
  return request({
    path: `/api/items/${encodeURIComponent(
      pathParams.itemId,
    )}/comments/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateItemComment(
  options?: UseMutationOptions<
    UpdateItemComment.Response.Success,
    UpdateItemComment.Response.Error,
    [
      UpdateItemComment.PathParameters,
      UpdateItemComment.RequestBody,
      RequestOptions<UpdateItemComment.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateItemComment.Response.Success,
  UpdateItemComment.Response.Error,
  [
    UpdateItemComment.PathParameters,
    UpdateItemComment.RequestBody,
    RequestOptions<UpdateItemComment.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateItemComment, options)
}

export namespace DeleteItemComment {
  export type PathParameters = {
    itemId: string
    id: number /* int64 */
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteItemComment([pathParams, requestOptions]: [
  pathParams: DeleteItemComment.PathParameters,
  requestOptions?: RequestOptions<DeleteItemComment.Response.Success>,
]): Promise<DeleteItemComment.Response.Success> {
  return request({
    path: `/api/items/${encodeURIComponent(
      pathParams.itemId,
    )}/comments/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteItemComment(
  options?: UseMutationOptions<
    DeleteItemComment.Response.Success,
    DeleteItemComment.Response.Error,
    [
      DeleteItemComment.PathParameters,
      RequestOptions<DeleteItemComment.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteItemComment.Response.Success,
  DeleteItemComment.Response.Error,
  [
    DeleteItemComment.PathParameters,
    RequestOptions<DeleteItemComment.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteItemComment, options)
}

export namespace GetPublications {
  export type QueryParameters = {
    page?: number /* int32 */
    perpage?: number /* int32 */
    approved?: boolean
  }
  export namespace Response {
    export type Success = PaginatedPublications
    export type Error = unknown
  }
}

export async function getPublications(
  queryParams: GetPublications.QueryParameters,
  requestOptions?: RequestOptions<GetPublications.Response.Success>,
): Promise<GetPublications.Response.Success> {
  return request({
    path: `/api/publications`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetPublications(
  queryParams: GetPublications.QueryParameters,
  options?: UseQueryOptions<
    GetPublications.Response.Success,
    GetPublications.Response.Error
  >,
  requestOptions?: RequestOptions<GetPublications.Response.Success>,
): UseQueryResult<
  GetPublications.Response.Success,
  GetPublications.Response.Error
> {
  return useQuery(
    ['getPublications', queryParams],
    () => getPublications(queryParams, requestOptions),
    options,
  )
}

export namespace CreatePublication {
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = PublicationDto
    export type Error = unknown
  }
  export type RequestBody = PublicationCore
}

export async function createPublication([queryParams, body, requestOptions]: [
  queryParams: CreatePublication.QueryParameters,
  body: CreatePublication.RequestBody,
  requestOptions?: RequestOptions<CreatePublication.Response.Success>,
]): Promise<CreatePublication.Response.Success> {
  return request({
    path: `/api/publications`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreatePublication(
  options?: UseMutationOptions<
    CreatePublication.Response.Success,
    CreatePublication.Response.Error,
    [
      CreatePublication.QueryParameters,
      CreatePublication.RequestBody,
      RequestOptions<CreatePublication.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreatePublication.Response.Success,
  CreatePublication.Response.Error,
  [
    CreatePublication.QueryParameters,
    CreatePublication.RequestBody,
    RequestOptions<CreatePublication.Response.Success>,
  ],
  unknown
> {
  return useMutation(createPublication, options)
}

export namespace GetPublication {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = PublicationDto
    export type Error = unknown
  }
}

export async function getPublication(
  pathParams: GetPublication.PathParameters,
  queryParams: GetPublication.QueryParameters,
  requestOptions?: RequestOptions<GetPublication.Response.Success>,
): Promise<GetPublication.Response.Success> {
  return request({
    path: `/api/publications/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetPublication(
  pathParams: GetPublication.PathParameters,
  queryParams: GetPublication.QueryParameters,
  options?: UseQueryOptions<
    GetPublication.Response.Success,
    GetPublication.Response.Error
  >,
  requestOptions?: RequestOptions<GetPublication.Response.Success>,
): UseQueryResult<
  GetPublication.Response.Success,
  GetPublication.Response.Error
> {
  return useQuery(
    ['getPublication', pathParams, queryParams],
    () => getPublication(pathParams, queryParams, requestOptions),
    options,
  )
}

export namespace UpdatePublication {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = PublicationDto
    export type Error = unknown
  }
  export type RequestBody = PublicationCore
}

export async function updatePublication([
  pathParams,
  queryParams,
  body,
  requestOptions,
]: [
  pathParams: UpdatePublication.PathParameters,
  queryParams: UpdatePublication.QueryParameters,
  body: UpdatePublication.RequestBody,
  requestOptions?: RequestOptions<UpdatePublication.Response.Success>,
]): Promise<UpdatePublication.Response.Success> {
  return request({
    path: `/api/publications/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdatePublication(
  options?: UseMutationOptions<
    UpdatePublication.Response.Success,
    UpdatePublication.Response.Error,
    [
      UpdatePublication.PathParameters,
      UpdatePublication.QueryParameters,
      UpdatePublication.RequestBody,
      RequestOptions<UpdatePublication.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdatePublication.Response.Success,
  UpdatePublication.Response.Error,
  [
    UpdatePublication.PathParameters,
    UpdatePublication.QueryParameters,
    UpdatePublication.RequestBody,
    RequestOptions<UpdatePublication.Response.Success>,
  ],
  unknown
> {
  return useMutation(updatePublication, options)
}

export namespace DeletePublication {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deletePublication([
  pathParams,
  queryParams,
  requestOptions,
]: [
  pathParams: DeletePublication.PathParameters,
  queryParams: DeletePublication.QueryParameters,
  requestOptions?: RequestOptions<DeletePublication.Response.Success>,
]): Promise<DeletePublication.Response.Success> {
  return request({
    path: `/api/publications/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeletePublication(
  options?: UseMutationOptions<
    DeletePublication.Response.Success,
    DeletePublication.Response.Error,
    [
      DeletePublication.PathParameters,
      DeletePublication.QueryParameters,
      RequestOptions<DeletePublication.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeletePublication.Response.Success,
  DeletePublication.Response.Error,
  [
    DeletePublication.PathParameters,
    DeletePublication.QueryParameters,
    RequestOptions<DeletePublication.Response.Success>,
  ],
  unknown
> {
  return useMutation(deletePublication, options)
}

export namespace GetPublicationVersion {
  export type PathParameters = {
    id: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = PublicationDto
    export type Error = unknown
  }
}

export async function getPublicationVersion(
  pathParams: GetPublicationVersion.PathParameters,
  requestOptions?: RequestOptions<GetPublicationVersion.Response.Success>,
): Promise<GetPublicationVersion.Response.Success> {
  return request({
    path: `/api/publications/${encodeURIComponent(
      pathParams.id,
    )}/versions/${encodeURIComponent(pathParams.versionId)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetPublicationVersion(
  pathParams: GetPublicationVersion.PathParameters,
  options?: UseQueryOptions<
    GetPublicationVersion.Response.Success,
    GetPublicationVersion.Response.Error
  >,
  requestOptions?: RequestOptions<GetPublicationVersion.Response.Success>,
): UseQueryResult<
  GetPublicationVersion.Response.Success,
  GetPublicationVersion.Response.Error
> {
  return useQuery(
    ['getPublicationVersion', pathParams],
    () => getPublicationVersion(pathParams, requestOptions),
    options,
  )
}

export namespace RevertPublication {
  export type PathParameters = {
    id: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = PublicationDto
    export type Error = unknown
  }
}

export async function revertPublication([pathParams, requestOptions]: [
  pathParams: RevertPublication.PathParameters,
  requestOptions?: RequestOptions<RevertPublication.Response.Success>,
]): Promise<RevertPublication.Response.Success> {
  return request({
    path: `/api/publications/${encodeURIComponent(
      pathParams.id,
    )}/versions/${encodeURIComponent(pathParams.versionId)}/revert`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useRevertPublication(
  options?: UseMutationOptions<
    RevertPublication.Response.Success,
    RevertPublication.Response.Error,
    [
      RevertPublication.PathParameters,
      RequestOptions<RevertPublication.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  RevertPublication.Response.Success,
  RevertPublication.Response.Error,
  [
    RevertPublication.PathParameters,
    RequestOptions<RevertPublication.Response.Success>,
  ],
  unknown
> {
  return useMutation(revertPublication, options)
}

export namespace PublishPublication {
  export type PathParameters = {
    publicationId: string
  }
  export namespace Response {
    export type Success = PublicationDto
    export type Error = unknown
  }
}

export async function publishPublication([pathParams, requestOptions]: [
  pathParams: PublishPublication.PathParameters,
  requestOptions?: RequestOptions<PublishPublication.Response.Success>,
]): Promise<PublishPublication.Response.Success> {
  return request({
    path: `/api/publications/${encodeURIComponent(
      pathParams.publicationId,
    )}/commit`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function usePublishPublication(
  options?: UseMutationOptions<
    PublishPublication.Response.Success,
    PublishPublication.Response.Error,
    [
      PublishPublication.PathParameters,
      RequestOptions<PublishPublication.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  PublishPublication.Response.Success,
  PublishPublication.Response.Error,
  [
    PublishPublication.PathParameters,
    RequestOptions<PublishPublication.Response.Success>,
  ],
  unknown
> {
  return useMutation(publishPublication, options)
}

export namespace GetPublicationHistory {
  export type PathParameters = {
    publicationId: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = Array<ItemExtBasicDto>
    export type Error = unknown
  }
}

export async function getPublicationHistory(
  pathParams: GetPublicationHistory.PathParameters,
  queryParams: GetPublicationHistory.QueryParameters,
  requestOptions?: RequestOptions<GetPublicationHistory.Response.Success>,
): Promise<GetPublicationHistory.Response.Success> {
  return request({
    path: `/api/publications/${encodeURIComponent(
      pathParams.publicationId,
    )}/history`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetPublicationHistory(
  pathParams: GetPublicationHistory.PathParameters,
  queryParams: GetPublicationHistory.QueryParameters,
  options?: UseQueryOptions<
    GetPublicationHistory.Response.Success,
    GetPublicationHistory.Response.Error
  >,
  requestOptions?: RequestOptions<GetPublicationHistory.Response.Success>,
): UseQueryResult<
  GetPublicationHistory.Response.Success,
  GetPublicationHistory.Response.Error
> {
  return useQuery(
    ['getPublicationHistory', pathParams, queryParams],
    () => getPublicationHistory(pathParams, queryParams, requestOptions),
    options,
  )
}

export namespace GetActorRole {
  export type PathParameters = {
    roleCode: string
  }
  export namespace Response {
    export type Success = ActorRoleDto
    export type Error = unknown
  }
}

export async function getActorRole(
  pathParams: GetActorRole.PathParameters,
  requestOptions?: RequestOptions<GetActorRole.Response.Success>,
): Promise<GetActorRole.Response.Success> {
  return request({
    path: `/api/actor-roles/${encodeURIComponent(pathParams.roleCode)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetActorRole(
  pathParams: GetActorRole.PathParameters,
  options?: UseQueryOptions<
    GetActorRole.Response.Success,
    GetActorRole.Response.Error
  >,
  requestOptions?: RequestOptions<GetActorRole.Response.Success>,
): UseQueryResult<GetActorRole.Response.Success, GetActorRole.Response.Error> {
  return useQuery(
    ['getActorRole', pathParams],
    () => getActorRole(pathParams, requestOptions),
    options,
  )
}

export namespace UpdateActorRole {
  export type PathParameters = {
    roleCode: string
  }
  export namespace Response {
    export type Success = ActorRoleDto
    export type Error = unknown
  }
  export type RequestBody = ActorRoleCore
}

export async function updateActorRole([pathParams, body, requestOptions]: [
  pathParams: UpdateActorRole.PathParameters,
  body: UpdateActorRole.RequestBody,
  requestOptions?: RequestOptions<UpdateActorRole.Response.Success>,
]): Promise<UpdateActorRole.Response.Success> {
  return request({
    path: `/api/actor-roles/${encodeURIComponent(pathParams.roleCode)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateActorRole(
  options?: UseMutationOptions<
    UpdateActorRole.Response.Success,
    UpdateActorRole.Response.Error,
    [
      UpdateActorRole.PathParameters,
      UpdateActorRole.RequestBody,
      RequestOptions<UpdateActorRole.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateActorRole.Response.Success,
  UpdateActorRole.Response.Error,
  [
    UpdateActorRole.PathParameters,
    UpdateActorRole.RequestBody,
    RequestOptions<UpdateActorRole.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateActorRole, options)
}

export namespace DeleteActorRole {
  export type PathParameters = {
    roleCode: string
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteActorRole([pathParams, requestOptions]: [
  pathParams: DeleteActorRole.PathParameters,
  requestOptions?: RequestOptions<DeleteActorRole.Response.Success>,
]): Promise<DeleteActorRole.Response.Success> {
  return request({
    path: `/api/actor-roles/${encodeURIComponent(pathParams.roleCode)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteActorRole(
  options?: UseMutationOptions<
    DeleteActorRole.Response.Success,
    DeleteActorRole.Response.Error,
    [
      DeleteActorRole.PathParameters,
      RequestOptions<DeleteActorRole.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteActorRole.Response.Success,
  DeleteActorRole.Response.Error,
  [
    DeleteActorRole.PathParameters,
    RequestOptions<DeleteActorRole.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteActorRole, options)
}

export namespace GetAllActorRoles {
  export namespace Response {
    export type Success = Array<ActorRoleDto>
    export type Error = unknown
  }
}

export async function getAllActorRoles(
  requestOptions?: RequestOptions<GetAllActorRoles.Response.Success>,
): Promise<GetAllActorRoles.Response.Success> {
  return request({
    path: `/api/actor-roles`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetAllActorRoles(
  options?: UseQueryOptions<
    GetAllActorRoles.Response.Success,
    GetAllActorRoles.Response.Error
  >,
  requestOptions?: RequestOptions<GetAllActorRoles.Response.Success>,
): UseQueryResult<
  GetAllActorRoles.Response.Success,
  GetAllActorRoles.Response.Error
> {
  return useQuery(
    ['getAllActorRoles'],
    () => getAllActorRoles(requestOptions),
    options,
  )
}

export namespace CreateActorRole {
  export namespace Response {
    export type Success = ActorRoleDto
    export type Error = unknown
  }
  export type RequestBody = ActorRoleCore
}

export async function createActorRole([body, requestOptions]: [
  body: CreateActorRole.RequestBody,
  requestOptions?: RequestOptions<CreateActorRole.Response.Success>,
]): Promise<CreateActorRole.Response.Success> {
  return request({
    path: `/api/actor-roles`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateActorRole(
  options?: UseMutationOptions<
    CreateActorRole.Response.Success,
    CreateActorRole.Response.Error,
    [
      CreateActorRole.RequestBody,
      RequestOptions<CreateActorRole.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateActorRole.Response.Success,
  CreateActorRole.Response.Error,
  [
    CreateActorRole.RequestBody,
    RequestOptions<CreateActorRole.Response.Success>,
  ],
  unknown
> {
  return useMutation(createActorRole, options)
}

export namespace GetAllActorSources {
  export namespace Response {
    export type Success = Array<ActorSourceDto>
    export type Error = unknown
  }
}

export async function getAllActorSources(
  requestOptions?: RequestOptions<GetAllActorSources.Response.Success>,
): Promise<GetAllActorSources.Response.Success> {
  return request({
    path: `/api/actor-sources`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetAllActorSources(
  options?: UseQueryOptions<
    GetAllActorSources.Response.Success,
    GetAllActorSources.Response.Error
  >,
  requestOptions?: RequestOptions<GetAllActorSources.Response.Success>,
): UseQueryResult<
  GetAllActorSources.Response.Success,
  GetAllActorSources.Response.Error
> {
  return useQuery(
    ['getAllActorSources'],
    () => getAllActorSources(requestOptions),
    options,
  )
}

export namespace CreateActorSource {
  export namespace Response {
    export type Success = ActorSourceDto
    export type Error = unknown
  }
  export type RequestBody = ActorSourceCore
}

export async function createActorSource([body, requestOptions]: [
  body: CreateActorSource.RequestBody,
  requestOptions?: RequestOptions<CreateActorSource.Response.Success>,
]): Promise<CreateActorSource.Response.Success> {
  return request({
    path: `/api/actor-sources`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateActorSource(
  options?: UseMutationOptions<
    CreateActorSource.Response.Success,
    CreateActorSource.Response.Error,
    [
      CreateActorSource.RequestBody,
      RequestOptions<CreateActorSource.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateActorSource.Response.Success,
  CreateActorSource.Response.Error,
  [
    CreateActorSource.RequestBody,
    RequestOptions<CreateActorSource.Response.Success>,
  ],
  unknown
> {
  return useMutation(createActorSource, options)
}

export namespace GetActorSource {
  export type PathParameters = {
    sourceCode: string
  }
  export namespace Response {
    export type Success = ActorSourceDto
    export type Error = unknown
  }
}

export async function getActorSource(
  pathParams: GetActorSource.PathParameters,
  requestOptions?: RequestOptions<GetActorSource.Response.Success>,
): Promise<GetActorSource.Response.Success> {
  return request({
    path: `/api/actor-sources/${encodeURIComponent(pathParams.sourceCode)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetActorSource(
  pathParams: GetActorSource.PathParameters,
  options?: UseQueryOptions<
    GetActorSource.Response.Success,
    GetActorSource.Response.Error
  >,
  requestOptions?: RequestOptions<GetActorSource.Response.Success>,
): UseQueryResult<
  GetActorSource.Response.Success,
  GetActorSource.Response.Error
> {
  return useQuery(
    ['getActorSource', pathParams],
    () => getActorSource(pathParams, requestOptions),
    options,
  )
}

export namespace UpdateActorSource {
  export type PathParameters = {
    sourceCode: string
  }
  export namespace Response {
    export type Success = ActorSourceDto
    export type Error = unknown
  }
  export type RequestBody = ActorSourceCore
}

export async function updateActorSource([pathParams, body, requestOptions]: [
  pathParams: UpdateActorSource.PathParameters,
  body: UpdateActorSource.RequestBody,
  requestOptions?: RequestOptions<UpdateActorSource.Response.Success>,
]): Promise<UpdateActorSource.Response.Success> {
  return request({
    path: `/api/actor-sources/${encodeURIComponent(pathParams.sourceCode)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateActorSource(
  options?: UseMutationOptions<
    UpdateActorSource.Response.Success,
    UpdateActorSource.Response.Error,
    [
      UpdateActorSource.PathParameters,
      UpdateActorSource.RequestBody,
      RequestOptions<UpdateActorSource.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateActorSource.Response.Success,
  UpdateActorSource.Response.Error,
  [
    UpdateActorSource.PathParameters,
    UpdateActorSource.RequestBody,
    RequestOptions<UpdateActorSource.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateActorSource, options)
}

export namespace DeleteActorSource {
  export type PathParameters = {
    sourceCode: string
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteActorSource([pathParams, requestOptions]: [
  pathParams: DeleteActorSource.PathParameters,
  requestOptions?: RequestOptions<DeleteActorSource.Response.Success>,
]): Promise<DeleteActorSource.Response.Success> {
  return request({
    path: `/api/actor-sources/${encodeURIComponent(pathParams.sourceCode)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteActorSource(
  options?: UseMutationOptions<
    DeleteActorSource.Response.Success,
    DeleteActorSource.Response.Error,
    [
      DeleteActorSource.PathParameters,
      RequestOptions<DeleteActorSource.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteActorSource.Response.Success,
  DeleteActorSource.Response.Error,
  [
    DeleteActorSource.PathParameters,
    RequestOptions<DeleteActorSource.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteActorSource, options)
}

export namespace GetVocabulary {
  export type PathParameters = {
    code: string
  }
  export type QueryParameters = {
    page?: number /* int32 */
    perpage?: number /* int32 */
  }
  export namespace Response {
    export type Success = VocabularyDto
    export type Error = unknown
  }
}

export async function getVocabulary(
  pathParams: GetVocabulary.PathParameters,
  queryParams: GetVocabulary.QueryParameters,
  requestOptions?: RequestOptions<GetVocabulary.Response.Success>,
): Promise<GetVocabulary.Response.Success> {
  return request({
    path: `/api/vocabularies/${encodeURIComponent(pathParams.code)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetVocabulary(
  pathParams: GetVocabulary.PathParameters,
  queryParams: GetVocabulary.QueryParameters,
  options?: UseQueryOptions<
    GetVocabulary.Response.Success,
    GetVocabulary.Response.Error
  >,
  requestOptions?: RequestOptions<GetVocabulary.Response.Success>,
): UseQueryResult<
  GetVocabulary.Response.Success,
  GetVocabulary.Response.Error
> {
  return useQuery(
    ['getVocabulary', pathParams, queryParams],
    () => getVocabulary(pathParams, queryParams, requestOptions),
    options,
  )
}

export namespace UpdateVocabulary {
  export type PathParameters = {
    code: string
  }
  export type QueryParameters = {
    ttl: {
      ttl?: string /* binary */
    }
    force?: boolean
  }
  export namespace Response {
    export type Success = VocabularyBasicDto
    export type Error = unknown
  }
}

export async function updateVocabulary([
  pathParams,
  queryParams,
  requestOptions,
]: [
  pathParams: UpdateVocabulary.PathParameters,
  queryParams: UpdateVocabulary.QueryParameters,
  requestOptions?: RequestOptions<UpdateVocabulary.Response.Success>,
]): Promise<UpdateVocabulary.Response.Success> {
  return request({
    path: `/api/vocabularies/${encodeURIComponent(pathParams.code)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateVocabulary(
  options?: UseMutationOptions<
    UpdateVocabulary.Response.Success,
    UpdateVocabulary.Response.Error,
    [
      UpdateVocabulary.PathParameters,
      UpdateVocabulary.QueryParameters,
      RequestOptions<UpdateVocabulary.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateVocabulary.Response.Success,
  UpdateVocabulary.Response.Error,
  [
    UpdateVocabulary.PathParameters,
    UpdateVocabulary.QueryParameters,
    RequestOptions<UpdateVocabulary.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateVocabulary, options)
}

export namespace DeleteVocabulary {
  export type PathParameters = {
    code: string
  }
  export type QueryParameters = {
    force?: boolean
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteVocabulary([
  pathParams,
  queryParams,
  requestOptions,
]: [
  pathParams: DeleteVocabulary.PathParameters,
  queryParams: DeleteVocabulary.QueryParameters,
  requestOptions?: RequestOptions<DeleteVocabulary.Response.Success>,
]): Promise<DeleteVocabulary.Response.Success> {
  return request({
    path: `/api/vocabularies/${encodeURIComponent(pathParams.code)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteVocabulary(
  options?: UseMutationOptions<
    DeleteVocabulary.Response.Success,
    DeleteVocabulary.Response.Error,
    [
      DeleteVocabulary.PathParameters,
      DeleteVocabulary.QueryParameters,
      RequestOptions<DeleteVocabulary.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteVocabulary.Response.Success,
  DeleteVocabulary.Response.Error,
  [
    DeleteVocabulary.PathParameters,
    DeleteVocabulary.QueryParameters,
    RequestOptions<DeleteVocabulary.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteVocabulary, options)
}

export namespace GetVocabularies {
  export type QueryParameters = {
    page?: number /* int32 */
    perpage?: number /* int32 */
  }
  export namespace Response {
    export type Success = PaginatedVocabularies
    export type Error = unknown
  }
}

export async function getVocabularies(
  queryParams: GetVocabularies.QueryParameters,
  requestOptions?: RequestOptions<GetVocabularies.Response.Success>,
): Promise<GetVocabularies.Response.Success> {
  return request({
    path: `/api/vocabularies`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetVocabularies(
  queryParams: GetVocabularies.QueryParameters,
  options?: UseQueryOptions<
    GetVocabularies.Response.Success,
    GetVocabularies.Response.Error
  >,
  requestOptions?: RequestOptions<GetVocabularies.Response.Success>,
): UseQueryResult<
  GetVocabularies.Response.Success,
  GetVocabularies.Response.Error
> {
  return useQuery(
    ['getVocabularies', queryParams],
    () => getVocabularies(queryParams, requestOptions),
    options,
  )
}

export namespace CreateVocabulary {
  export type QueryParameters = {
    ttl: {
      ttl?: string /* binary */
    }
  }
  export namespace Response {
    export type Success = VocabularyBasicDto
    export type Error = unknown
  }
}

export async function createVocabulary([queryParams, requestOptions]: [
  queryParams: CreateVocabulary.QueryParameters,
  requestOptions?: RequestOptions<CreateVocabulary.Response.Success>,
]): Promise<CreateVocabulary.Response.Success> {
  return request({
    path: `/api/vocabularies`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateVocabulary(
  options?: UseMutationOptions<
    CreateVocabulary.Response.Success,
    CreateVocabulary.Response.Error,
    [
      CreateVocabulary.QueryParameters,
      RequestOptions<CreateVocabulary.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateVocabulary.Response.Success,
  CreateVocabulary.Response.Error,
  [
    CreateVocabulary.QueryParameters,
    RequestOptions<CreateVocabulary.Response.Success>,
  ],
  unknown
> {
  return useMutation(createVocabulary, options)
}

export namespace GetAllConceptRelations {
  export namespace Response {
    export type Success = Array<ConceptRelationDto>
    export type Error = unknown
  }
}

export async function getAllConceptRelations(
  requestOptions?: RequestOptions<GetAllConceptRelations.Response.Success>,
): Promise<GetAllConceptRelations.Response.Success> {
  return request({
    path: `/api/concept-relations`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetAllConceptRelations(
  options?: UseQueryOptions<
    GetAllConceptRelations.Response.Success,
    GetAllConceptRelations.Response.Error
  >,
  requestOptions?: RequestOptions<GetAllConceptRelations.Response.Success>,
): UseQueryResult<
  GetAllConceptRelations.Response.Success,
  GetAllConceptRelations.Response.Error
> {
  return useQuery(
    ['getAllConceptRelations'],
    () => getAllConceptRelations(requestOptions),
    options,
  )
}

export namespace GetTools {
  export type QueryParameters = {
    page?: number /* int32 */
    perpage?: number /* int32 */
    approved?: boolean
  }
  export namespace Response {
    export type Success = PaginatedTools
    export type Error = unknown
  }
}

export async function getTools(
  queryParams: GetTools.QueryParameters,
  requestOptions?: RequestOptions<GetTools.Response.Success>,
): Promise<GetTools.Response.Success> {
  return request({
    path: `/api/tools-services`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetTools(
  queryParams: GetTools.QueryParameters,
  options?: UseQueryOptions<GetTools.Response.Success, GetTools.Response.Error>,
  requestOptions?: RequestOptions<GetTools.Response.Success>,
): UseQueryResult<GetTools.Response.Success, GetTools.Response.Error> {
  return useQuery(
    ['getTools', queryParams],
    () => getTools(queryParams, requestOptions),
    options,
  )
}

export namespace CreateTool {
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = ToolDto
    export type Error = unknown
  }
  export type RequestBody = ToolCore
}

export async function createTool([queryParams, body, requestOptions]: [
  queryParams: CreateTool.QueryParameters,
  body: CreateTool.RequestBody,
  requestOptions?: RequestOptions<CreateTool.Response.Success>,
]): Promise<CreateTool.Response.Success> {
  return request({
    path: `/api/tools-services`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateTool(
  options?: UseMutationOptions<
    CreateTool.Response.Success,
    CreateTool.Response.Error,
    [
      CreateTool.QueryParameters,
      CreateTool.RequestBody,
      RequestOptions<CreateTool.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateTool.Response.Success,
  CreateTool.Response.Error,
  [
    CreateTool.QueryParameters,
    CreateTool.RequestBody,
    RequestOptions<CreateTool.Response.Success>,
  ],
  unknown
> {
  return useMutation(createTool, options)
}

export namespace GetTool {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = ToolDto
    export type Error = unknown
  }
}

export async function getTool(
  pathParams: GetTool.PathParameters,
  queryParams: GetTool.QueryParameters,
  requestOptions?: RequestOptions<GetTool.Response.Success>,
): Promise<GetTool.Response.Success> {
  return request({
    path: `/api/tools-services/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetTool(
  pathParams: GetTool.PathParameters,
  queryParams: GetTool.QueryParameters,
  options?: UseQueryOptions<GetTool.Response.Success, GetTool.Response.Error>,
  requestOptions?: RequestOptions<GetTool.Response.Success>,
): UseQueryResult<GetTool.Response.Success, GetTool.Response.Error> {
  return useQuery(
    ['getTool', pathParams, queryParams],
    () => getTool(pathParams, queryParams, requestOptions),
    options,
  )
}

export namespace UpdateTool {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = ToolDto
    export type Error = unknown
  }
  export type RequestBody = ToolCore
}

export async function updateTool([
  pathParams,
  queryParams,
  body,
  requestOptions,
]: [
  pathParams: UpdateTool.PathParameters,
  queryParams: UpdateTool.QueryParameters,
  body: UpdateTool.RequestBody,
  requestOptions?: RequestOptions<UpdateTool.Response.Success>,
]): Promise<UpdateTool.Response.Success> {
  return request({
    path: `/api/tools-services/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateTool(
  options?: UseMutationOptions<
    UpdateTool.Response.Success,
    UpdateTool.Response.Error,
    [
      UpdateTool.PathParameters,
      UpdateTool.QueryParameters,
      UpdateTool.RequestBody,
      RequestOptions<UpdateTool.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateTool.Response.Success,
  UpdateTool.Response.Error,
  [
    UpdateTool.PathParameters,
    UpdateTool.QueryParameters,
    UpdateTool.RequestBody,
    RequestOptions<UpdateTool.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateTool, options)
}

export namespace DeleteTool {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteTool([pathParams, queryParams, requestOptions]: [
  pathParams: DeleteTool.PathParameters,
  queryParams: DeleteTool.QueryParameters,
  requestOptions?: RequestOptions<DeleteTool.Response.Success>,
]): Promise<DeleteTool.Response.Success> {
  return request({
    path: `/api/tools-services/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteTool(
  options?: UseMutationOptions<
    DeleteTool.Response.Success,
    DeleteTool.Response.Error,
    [
      DeleteTool.PathParameters,
      DeleteTool.QueryParameters,
      RequestOptions<DeleteTool.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteTool.Response.Success,
  DeleteTool.Response.Error,
  [
    DeleteTool.PathParameters,
    DeleteTool.QueryParameters,
    RequestOptions<DeleteTool.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteTool, options)
}

export namespace RevertTool {
  export type PathParameters = {
    id: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = ToolDto
    export type Error = unknown
  }
}

export async function revertTool([pathParams, requestOptions]: [
  pathParams: RevertTool.PathParameters,
  requestOptions?: RequestOptions<RevertTool.Response.Success>,
]): Promise<RevertTool.Response.Success> {
  return request({
    path: `/api/tools-services/${encodeURIComponent(
      pathParams.id,
    )}/versions/${encodeURIComponent(pathParams.versionId)}/revert`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useRevertTool(
  options?: UseMutationOptions<
    RevertTool.Response.Success,
    RevertTool.Response.Error,
    [RevertTool.PathParameters, RequestOptions<RevertTool.Response.Success>],
    unknown
  >,
): UseMutationResult<
  RevertTool.Response.Success,
  RevertTool.Response.Error,
  [RevertTool.PathParameters, RequestOptions<RevertTool.Response.Success>],
  unknown
> {
  return useMutation(revertTool, options)
}

export namespace GetToolVersion {
  export type PathParameters = {
    id: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = ToolDto
    export type Error = unknown
  }
}

export async function getToolVersion(
  pathParams: GetToolVersion.PathParameters,
  requestOptions?: RequestOptions<GetToolVersion.Response.Success>,
): Promise<GetToolVersion.Response.Success> {
  return request({
    path: `/api/tools-services/${encodeURIComponent(
      pathParams.id,
    )}/versions/${encodeURIComponent(pathParams.versionId)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetToolVersion(
  pathParams: GetToolVersion.PathParameters,
  options?: UseQueryOptions<
    GetToolVersion.Response.Success,
    GetToolVersion.Response.Error
  >,
  requestOptions?: RequestOptions<GetToolVersion.Response.Success>,
): UseQueryResult<
  GetToolVersion.Response.Success,
  GetToolVersion.Response.Error
> {
  return useQuery(
    ['getToolVersion', pathParams],
    () => getToolVersion(pathParams, requestOptions),
    options,
  )
}

export namespace PublishTool {
  export type PathParameters = {
    toolId: string
  }
  export namespace Response {
    export type Success = ToolDto
    export type Error = unknown
  }
}

export async function publishTool([pathParams, requestOptions]: [
  pathParams: PublishTool.PathParameters,
  requestOptions?: RequestOptions<PublishTool.Response.Success>,
]): Promise<PublishTool.Response.Success> {
  return request({
    path: `/api/tools-services/${encodeURIComponent(pathParams.toolId)}/commit`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function usePublishTool(
  options?: UseMutationOptions<
    PublishTool.Response.Success,
    PublishTool.Response.Error,
    [PublishTool.PathParameters, RequestOptions<PublishTool.Response.Success>],
    unknown
  >,
): UseMutationResult<
  PublishTool.Response.Success,
  PublishTool.Response.Error,
  [PublishTool.PathParameters, RequestOptions<PublishTool.Response.Success>],
  unknown
> {
  return useMutation(publishTool, options)
}

export namespace GetToolHistory {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = Array<ItemExtBasicDto>
    export type Error = unknown
  }
}

export async function getToolHistory(
  pathParams: GetToolHistory.PathParameters,
  queryParams: GetToolHistory.QueryParameters,
  requestOptions?: RequestOptions<GetToolHistory.Response.Success>,
): Promise<GetToolHistory.Response.Success> {
  return request({
    path: `/api/tools-services/${encodeURIComponent(pathParams.id)}/history`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetToolHistory(
  pathParams: GetToolHistory.PathParameters,
  queryParams: GetToolHistory.QueryParameters,
  options?: UseQueryOptions<
    GetToolHistory.Response.Success,
    GetToolHistory.Response.Error
  >,
  requestOptions?: RequestOptions<GetToolHistory.Response.Success>,
): UseQueryResult<
  GetToolHistory.Response.Success,
  GetToolHistory.Response.Error
> {
  return useQuery(
    ['getToolHistory', pathParams, queryParams],
    () => getToolHistory(pathParams, queryParams, requestOptions),
    options,
  )
}

/**
 * Search among items.
 */

export namespace SearchItems {
  export type QueryParameters = {
    q?: string
    d?: string
    categories?: Array<
      | 'tool-or-service'
      | 'training-material'
      | 'publication'
      | 'dataset'
      | 'workflow'
      | 'step'
    >
    order?: Array<'score' | 'label' | 'modified-on'>
    page?: number /* int32 */
    perpage?: number /* int32 */
    advanced?: boolean
    f?: string
  }
  export namespace Response {
    export type Success = PaginatedSearchItems
    export type Error = unknown
  }
}

export async function searchItems(
  queryParams: SearchItems.QueryParameters,
  requestOptions?: RequestOptions<SearchItems.Response.Success>,
): Promise<SearchItems.Response.Success> {
  return request({
    path: `/api/item-search`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useSearchItems(
  queryParams: SearchItems.QueryParameters,
  options?: UseQueryOptions<
    SearchItems.Response.Success,
    SearchItems.Response.Error
  >,
  requestOptions?: RequestOptions<SearchItems.Response.Success>,
): UseQueryResult<SearchItems.Response.Success, SearchItems.Response.Error> {
  return useQuery(
    ['searchItems', queryParams],
    () => searchItems(queryParams, requestOptions),
    options,
  )
}

/**
 * Search among concepts.
 */

export namespace SearchConcepts {
  export type QueryParameters = {
    q?: string
    types?: Array<string>
    page?: number /* int32 */
    perpage?: number /* int32 */
    advanced?: boolean
  }
  export namespace Response {
    export type Success = PaginatedSearchConcepts
    export type Error = unknown
  }
}

export async function searchConcepts(
  queryParams: SearchConcepts.QueryParameters,
  requestOptions?: RequestOptions<SearchConcepts.Response.Success>,
): Promise<SearchConcepts.Response.Success> {
  return request({
    path: `/api/concept-search`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useSearchConcepts(
  queryParams: SearchConcepts.QueryParameters,
  options?: UseQueryOptions<
    SearchConcepts.Response.Success,
    SearchConcepts.Response.Error
  >,
  requestOptions?: RequestOptions<SearchConcepts.Response.Success>,
): UseQueryResult<
  SearchConcepts.Response.Success,
  SearchConcepts.Response.Error
> {
  return useQuery(
    ['searchConcepts', queryParams],
    () => searchConcepts(queryParams, requestOptions),
    options,
  )
}

/**
 * Autocomplete for items search.
 */

export namespace AutocompleteItems {
  export type QueryParameters = {
    q: string
  }
  export namespace Response {
    export type Success = SuggestedSearchPhrases
    export type Error = unknown
  }
}

export async function autocompleteItems(
  queryParams: AutocompleteItems.QueryParameters,
  requestOptions?: RequestOptions<AutocompleteItems.Response.Success>,
): Promise<AutocompleteItems.Response.Success> {
  return request({
    path: `/api/item-search/autocomplete`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useAutocompleteItems(
  queryParams: AutocompleteItems.QueryParameters,
  options?: UseQueryOptions<
    AutocompleteItems.Response.Success,
    AutocompleteItems.Response.Error
  >,
  requestOptions?: RequestOptions<AutocompleteItems.Response.Success>,
): UseQueryResult<
  AutocompleteItems.Response.Success,
  AutocompleteItems.Response.Error
> {
  return useQuery(
    ['autocompleteItems', queryParams],
    () => autocompleteItems(queryParams, requestOptions),
    options,
  )
}

export namespace GetMediaSource {
  export type PathParameters = {
    code: string
  }
  export namespace Response {
    export type Success = MediaSourceDto
    export type Error = unknown
  }
}

export async function getMediaSource(
  pathParams: GetMediaSource.PathParameters,
  requestOptions?: RequestOptions<GetMediaSource.Response.Success>,
): Promise<GetMediaSource.Response.Success> {
  return request({
    path: `/api/media-sources/${encodeURIComponent(pathParams.code)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetMediaSource(
  pathParams: GetMediaSource.PathParameters,
  options?: UseQueryOptions<
    GetMediaSource.Response.Success,
    GetMediaSource.Response.Error
  >,
  requestOptions?: RequestOptions<GetMediaSource.Response.Success>,
): UseQueryResult<
  GetMediaSource.Response.Success,
  GetMediaSource.Response.Error
> {
  return useQuery(
    ['getMediaSource', pathParams],
    () => getMediaSource(pathParams, requestOptions),
    options,
  )
}

export namespace UpdateMediaSource {
  export type PathParameters = {
    code: string
  }
  export namespace Response {
    export type Success = MediaSourceDto
    export type Error = unknown
  }
  export type RequestBody = MediaSourceCore
}

export async function updateMediaSource([pathParams, body, requestOptions]: [
  pathParams: UpdateMediaSource.PathParameters,
  body: UpdateMediaSource.RequestBody,
  requestOptions?: RequestOptions<UpdateMediaSource.Response.Success>,
]): Promise<UpdateMediaSource.Response.Success> {
  return request({
    path: `/api/media-sources/${encodeURIComponent(pathParams.code)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateMediaSource(
  options?: UseMutationOptions<
    UpdateMediaSource.Response.Success,
    UpdateMediaSource.Response.Error,
    [
      UpdateMediaSource.PathParameters,
      UpdateMediaSource.RequestBody,
      RequestOptions<UpdateMediaSource.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateMediaSource.Response.Success,
  UpdateMediaSource.Response.Error,
  [
    UpdateMediaSource.PathParameters,
    UpdateMediaSource.RequestBody,
    RequestOptions<UpdateMediaSource.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateMediaSource, options)
}

export namespace DeleteMediaSource {
  export type PathParameters = {
    code: string
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteMediaSource([pathParams, requestOptions]: [
  pathParams: DeleteMediaSource.PathParameters,
  requestOptions?: RequestOptions<DeleteMediaSource.Response.Success>,
]): Promise<DeleteMediaSource.Response.Success> {
  return request({
    path: `/api/media-sources/${encodeURIComponent(pathParams.code)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteMediaSource(
  options?: UseMutationOptions<
    DeleteMediaSource.Response.Success,
    DeleteMediaSource.Response.Error,
    [
      DeleteMediaSource.PathParameters,
      RequestOptions<DeleteMediaSource.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteMediaSource.Response.Success,
  DeleteMediaSource.Response.Error,
  [
    DeleteMediaSource.PathParameters,
    RequestOptions<DeleteMediaSource.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteMediaSource, options)
}

export namespace GetAllMediaSources {
  export namespace Response {
    export type Success = Array<MediaSourceDto>
    export type Error = unknown
  }
}

export async function getAllMediaSources(
  requestOptions?: RequestOptions<GetAllMediaSources.Response.Success>,
): Promise<GetAllMediaSources.Response.Success> {
  return request({
    path: `/api/media-sources`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetAllMediaSources(
  options?: UseQueryOptions<
    GetAllMediaSources.Response.Success,
    GetAllMediaSources.Response.Error
  >,
  requestOptions?: RequestOptions<GetAllMediaSources.Response.Success>,
): UseQueryResult<
  GetAllMediaSources.Response.Success,
  GetAllMediaSources.Response.Error
> {
  return useQuery(
    ['getAllMediaSources'],
    () => getAllMediaSources(requestOptions),
    options,
  )
}

export namespace CreateMediaSource {
  export namespace Response {
    export type Success = MediaSourceDto
    export type Error = unknown
  }
  export type RequestBody = MediaSourceCore
}

export async function createMediaSource([body, requestOptions]: [
  body: CreateMediaSource.RequestBody,
  requestOptions?: RequestOptions<CreateMediaSource.Response.Success>,
]): Promise<CreateMediaSource.Response.Success> {
  return request({
    path: `/api/media-sources`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateMediaSource(
  options?: UseMutationOptions<
    CreateMediaSource.Response.Success,
    CreateMediaSource.Response.Error,
    [
      CreateMediaSource.RequestBody,
      RequestOptions<CreateMediaSource.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateMediaSource.Response.Success,
  CreateMediaSource.Response.Error,
  [
    CreateMediaSource.RequestBody,
    RequestOptions<CreateMediaSource.Response.Success>,
  ],
  unknown
> {
  return useMutation(createMediaSource, options)
}

export namespace GetMediaThumbnail {
  export type PathParameters = {
    mediaId: string /* uuid */
  }
  export namespace Response {
    export type Success = Resource
    export type Error = unknown
  }
}

export async function getMediaThumbnail(
  pathParams: GetMediaThumbnail.PathParameters,
  requestOptions?: RequestOptions<GetMediaThumbnail.Response.Success>,
): Promise<GetMediaThumbnail.Response.Success> {
  return request({
    path: `/api/media/thumbnail/${encodeURIComponent(pathParams.mediaId)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetMediaThumbnail(
  pathParams: GetMediaThumbnail.PathParameters,
  options?: UseQueryOptions<
    GetMediaThumbnail.Response.Success,
    GetMediaThumbnail.Response.Error
  >,
  requestOptions?: RequestOptions<GetMediaThumbnail.Response.Success>,
): UseQueryResult<
  GetMediaThumbnail.Response.Success,
  GetMediaThumbnail.Response.Error
> {
  return useQuery(
    ['getMediaThumbnail', pathParams],
    () => getMediaThumbnail(pathParams, requestOptions),
    options,
  )
}

export namespace GetMediaFile {
  export type PathParameters = {
    mediaId: string /* uuid */
  }
  export namespace Response {
    export type Success = Resource
    export type Error = unknown
  }
}

export async function getMediaFile(
  pathParams: GetMediaFile.PathParameters,
  requestOptions?: RequestOptions<GetMediaFile.Response.Success>,
): Promise<GetMediaFile.Response.Success> {
  return request({
    path: `/api/media/download/${encodeURIComponent(pathParams.mediaId)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetMediaFile(
  pathParams: GetMediaFile.PathParameters,
  options?: UseQueryOptions<
    GetMediaFile.Response.Success,
    GetMediaFile.Response.Error
  >,
  requestOptions?: RequestOptions<GetMediaFile.Response.Success>,
): UseQueryResult<GetMediaFile.Response.Success, GetMediaFile.Response.Error> {
  return useQuery(
    ['getMediaFile', pathParams],
    () => getMediaFile(pathParams, requestOptions),
    options,
  )
}

export namespace GetMediaInfo {
  export type PathParameters = {
    mediaId: string /* uuid */
  }
  export namespace Response {
    export type Success = MediaDetails
    export type Error = unknown
  }
}

export async function getMediaInfo(
  pathParams: GetMediaInfo.PathParameters,
  requestOptions?: RequestOptions<GetMediaInfo.Response.Success>,
): Promise<GetMediaInfo.Response.Success> {
  return request({
    path: `/api/media/info/${encodeURIComponent(pathParams.mediaId)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetMediaInfo(
  pathParams: GetMediaInfo.PathParameters,
  options?: UseQueryOptions<
    GetMediaInfo.Response.Success,
    GetMediaInfo.Response.Error
  >,
  requestOptions?: RequestOptions<GetMediaInfo.Response.Success>,
): UseQueryResult<GetMediaInfo.Response.Success, GetMediaInfo.Response.Error> {
  return useQuery(
    ['getMediaInfo', pathParams],
    () => getMediaInfo(pathParams, requestOptions),
    options,
  )
}

export namespace UploadMedia {
  export type QueryParameters = {
    file: {
      file?: string /* binary */
    }
  }
  export namespace Response {
    export type Success = MediaDetails
    export type Error = unknown
  }
}

export async function uploadMedia([queryParams, requestOptions]: [
  queryParams: UploadMedia.QueryParameters,
  requestOptions?: RequestOptions<UploadMedia.Response.Success>,
]): Promise<UploadMedia.Response.Success> {
  return request({
    path: `/api/media/upload/full`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUploadMedia(
  options?: UseMutationOptions<
    UploadMedia.Response.Success,
    UploadMedia.Response.Error,
    [UploadMedia.QueryParameters, RequestOptions<UploadMedia.Response.Success>],
    unknown
  >,
): UseMutationResult<
  UploadMedia.Response.Success,
  UploadMedia.Response.Error,
  [UploadMedia.QueryParameters, RequestOptions<UploadMedia.Response.Success>],
  unknown
> {
  return useMutation(uploadMedia, options)
}

export namespace UploadMediaChunk {
  export type QueryParameters = {
    mediaId?: string /* uuid */
    no: number /* int32 */
    chunk: {
      chunk?: string /* binary */
    }
  }
  export namespace Response {
    export type Success = MediaUploadInfo
    export type Error = unknown
  }
}

export async function uploadMediaChunk([queryParams, requestOptions]: [
  queryParams: UploadMediaChunk.QueryParameters,
  requestOptions?: RequestOptions<UploadMediaChunk.Response.Success>,
]): Promise<UploadMediaChunk.Response.Success> {
  return request({
    path: `/api/media/upload/chunk`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUploadMediaChunk(
  options?: UseMutationOptions<
    UploadMediaChunk.Response.Success,
    UploadMediaChunk.Response.Error,
    [
      UploadMediaChunk.QueryParameters,
      RequestOptions<UploadMediaChunk.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UploadMediaChunk.Response.Success,
  UploadMediaChunk.Response.Error,
  [
    UploadMediaChunk.QueryParameters,
    RequestOptions<UploadMediaChunk.Response.Success>,
  ],
  unknown
> {
  return useMutation(uploadMediaChunk, options)
}

export namespace CompleteMediaUpload {
  export type PathParameters = {
    mediaId: string /* uuid */
  }
  export type QueryParameters = {
    filename?: string
  }
  export namespace Response {
    export type Success = MediaDetails
    export type Error = unknown
  }
}

export async function completeMediaUpload([
  pathParams,
  queryParams,
  requestOptions,
]: [
  pathParams: CompleteMediaUpload.PathParameters,
  queryParams: CompleteMediaUpload.QueryParameters,
  requestOptions?: RequestOptions<CompleteMediaUpload.Response.Success>,
]): Promise<CompleteMediaUpload.Response.Success> {
  return request({
    path: `/api/media/upload/complete/${encodeURIComponent(
      pathParams.mediaId,
    )}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCompleteMediaUpload(
  options?: UseMutationOptions<
    CompleteMediaUpload.Response.Success,
    CompleteMediaUpload.Response.Error,
    [
      CompleteMediaUpload.PathParameters,
      CompleteMediaUpload.QueryParameters,
      RequestOptions<CompleteMediaUpload.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CompleteMediaUpload.Response.Success,
  CompleteMediaUpload.Response.Error,
  [
    CompleteMediaUpload.PathParameters,
    CompleteMediaUpload.QueryParameters,
    RequestOptions<CompleteMediaUpload.Response.Success>,
  ],
  unknown
> {
  return useMutation(completeMediaUpload, options)
}

export namespace ImportMedia {
  export namespace Response {
    export type Success = MediaDetails
    export type Error = unknown
  }
  export type RequestBody = MediaLocation
}

export async function importMedia([body, requestOptions]: [
  body: ImportMedia.RequestBody,
  requestOptions?: RequestOptions<ImportMedia.Response.Success>,
]): Promise<ImportMedia.Response.Success> {
  return request({
    path: `/api/media/upload/import`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useImportMedia(
  options?: UseMutationOptions<
    ImportMedia.Response.Success,
    ImportMedia.Response.Error,
    [ImportMedia.RequestBody, RequestOptions<ImportMedia.Response.Success>],
    unknown
  >,
): UseMutationResult<
  ImportMedia.Response.Success,
  ImportMedia.Response.Error,
  [ImportMedia.RequestBody, RequestOptions<ImportMedia.Response.Success>],
  unknown
> {
  return useMutation(importMedia, options)
}

/**
 * Sign into the system
 */

export namespace SignIn {
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
  export type RequestBody = LoginData
}

export async function signIn([body, requestOptions]: [
  body: SignIn.RequestBody,
  requestOptions?: RequestOptions<SignIn.Response.Success>,
]): Promise<SignIn.Response.Success> {
  return request({
    path: `/api/auth/sign-in`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useSignIn(
  options?: UseMutationOptions<
    SignIn.Response.Success,
    SignIn.Response.Error,
    [SignIn.RequestBody, RequestOptions<SignIn.Response.Success>],
    unknown
  >,
): UseMutationResult<
  SignIn.Response.Success,
  SignIn.Response.Error,
  [SignIn.RequestBody, RequestOptions<SignIn.Response.Success>],
  unknown
> {
  return useMutation(signIn, options)
}

/**
 * Sign into the system using oauth2
 */

export namespace Oauth2 {
  export type QueryParameters = {
    'success-redirect-url': string
    'failure-redirect-url': string
    'registration-redirect-url': string
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function oauth2(
  queryParams: Oauth2.QueryParameters,
  requestOptions?: RequestOptions<Oauth2.Response.Success>,
): Promise<Oauth2.Response.Success> {
  return request({
    path: `/oauth2/authorize/eosc`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useOauth2(
  queryParams: Oauth2.QueryParameters,
  options?: UseQueryOptions<Oauth2.Response.Success, Oauth2.Response.Error>,
  requestOptions?: RequestOptions<Oauth2.Response.Success>,
): UseQueryResult<Oauth2.Response.Success, Oauth2.Response.Error> {
  return useQuery(
    ['oauth2', queryParams],
    () => oauth2(queryParams, requestOptions),
    options,
  )
}

export namespace GetTrainingMaterial {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = TrainingMaterialDto
    export type Error = unknown
  }
}

export async function getTrainingMaterial(
  pathParams: GetTrainingMaterial.PathParameters,
  queryParams: GetTrainingMaterial.QueryParameters,
  requestOptions?: RequestOptions<GetTrainingMaterial.Response.Success>,
): Promise<GetTrainingMaterial.Response.Success> {
  return request({
    path: `/api/training-materials/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetTrainingMaterial(
  pathParams: GetTrainingMaterial.PathParameters,
  queryParams: GetTrainingMaterial.QueryParameters,
  options?: UseQueryOptions<
    GetTrainingMaterial.Response.Success,
    GetTrainingMaterial.Response.Error
  >,
  requestOptions?: RequestOptions<GetTrainingMaterial.Response.Success>,
): UseQueryResult<
  GetTrainingMaterial.Response.Success,
  GetTrainingMaterial.Response.Error
> {
  return useQuery(
    ['getTrainingMaterial', pathParams, queryParams],
    () => getTrainingMaterial(pathParams, queryParams, requestOptions),
    options,
  )
}

export namespace UpdateTrainingMaterial {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = TrainingMaterialDto
    export type Error = unknown
  }
  export type RequestBody = TrainingMaterialCore
}

export async function updateTrainingMaterial([
  pathParams,
  queryParams,
  body,
  requestOptions,
]: [
  pathParams: UpdateTrainingMaterial.PathParameters,
  queryParams: UpdateTrainingMaterial.QueryParameters,
  body: UpdateTrainingMaterial.RequestBody,
  requestOptions?: RequestOptions<UpdateTrainingMaterial.Response.Success>,
]): Promise<UpdateTrainingMaterial.Response.Success> {
  return request({
    path: `/api/training-materials/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateTrainingMaterial(
  options?: UseMutationOptions<
    UpdateTrainingMaterial.Response.Success,
    UpdateTrainingMaterial.Response.Error,
    [
      UpdateTrainingMaterial.PathParameters,
      UpdateTrainingMaterial.QueryParameters,
      UpdateTrainingMaterial.RequestBody,
      RequestOptions<UpdateTrainingMaterial.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateTrainingMaterial.Response.Success,
  UpdateTrainingMaterial.Response.Error,
  [
    UpdateTrainingMaterial.PathParameters,
    UpdateTrainingMaterial.QueryParameters,
    UpdateTrainingMaterial.RequestBody,
    RequestOptions<UpdateTrainingMaterial.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateTrainingMaterial, options)
}

export namespace DeleteTrainingMaterial {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteTrainingMaterial([
  pathParams,
  queryParams,
  requestOptions,
]: [
  pathParams: DeleteTrainingMaterial.PathParameters,
  queryParams: DeleteTrainingMaterial.QueryParameters,
  requestOptions?: RequestOptions<DeleteTrainingMaterial.Response.Success>,
]): Promise<DeleteTrainingMaterial.Response.Success> {
  return request({
    path: `/api/training-materials/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteTrainingMaterial(
  options?: UseMutationOptions<
    DeleteTrainingMaterial.Response.Success,
    DeleteTrainingMaterial.Response.Error,
    [
      DeleteTrainingMaterial.PathParameters,
      DeleteTrainingMaterial.QueryParameters,
      RequestOptions<DeleteTrainingMaterial.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteTrainingMaterial.Response.Success,
  DeleteTrainingMaterial.Response.Error,
  [
    DeleteTrainingMaterial.PathParameters,
    DeleteTrainingMaterial.QueryParameters,
    RequestOptions<DeleteTrainingMaterial.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteTrainingMaterial, options)
}

export namespace PublishTrainingMaterial {
  export type PathParameters = {
    trainingMaterialId: string
  }
  export namespace Response {
    export type Success = TrainingMaterialDto
    export type Error = unknown
  }
}

export async function publishTrainingMaterial([pathParams, requestOptions]: [
  pathParams: PublishTrainingMaterial.PathParameters,
  requestOptions?: RequestOptions<PublishTrainingMaterial.Response.Success>,
]): Promise<PublishTrainingMaterial.Response.Success> {
  return request({
    path: `/api/training-materials/${encodeURIComponent(
      pathParams.trainingMaterialId,
    )}/commit`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function usePublishTrainingMaterial(
  options?: UseMutationOptions<
    PublishTrainingMaterial.Response.Success,
    PublishTrainingMaterial.Response.Error,
    [
      PublishTrainingMaterial.PathParameters,
      RequestOptions<PublishTrainingMaterial.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  PublishTrainingMaterial.Response.Success,
  PublishTrainingMaterial.Response.Error,
  [
    PublishTrainingMaterial.PathParameters,
    RequestOptions<PublishTrainingMaterial.Response.Success>,
  ],
  unknown
> {
  return useMutation(publishTrainingMaterial, options)
}

export namespace GetTrainingMaterialVersion {
  export type PathParameters = {
    id: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = TrainingMaterialDto
    export type Error = unknown
  }
}

export async function getTrainingMaterialVersion(
  pathParams: GetTrainingMaterialVersion.PathParameters,
  requestOptions?: RequestOptions<GetTrainingMaterialVersion.Response.Success>,
): Promise<GetTrainingMaterialVersion.Response.Success> {
  return request({
    path: `/api/training-materials/${encodeURIComponent(
      pathParams.id,
    )}/versions/${encodeURIComponent(pathParams.versionId)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetTrainingMaterialVersion(
  pathParams: GetTrainingMaterialVersion.PathParameters,
  options?: UseQueryOptions<
    GetTrainingMaterialVersion.Response.Success,
    GetTrainingMaterialVersion.Response.Error
  >,
  requestOptions?: RequestOptions<GetTrainingMaterialVersion.Response.Success>,
): UseQueryResult<
  GetTrainingMaterialVersion.Response.Success,
  GetTrainingMaterialVersion.Response.Error
> {
  return useQuery(
    ['getTrainingMaterialVersion', pathParams],
    () => getTrainingMaterialVersion(pathParams, requestOptions),
    options,
  )
}

export namespace GetTrainingMaterials {
  export type QueryParameters = {
    page?: number /* int32 */
    perpage?: number /* int32 */
    approved?: boolean
  }
  export namespace Response {
    export type Success = PaginatedTrainingMaterials
    export type Error = unknown
  }
}

export async function getTrainingMaterials(
  queryParams: GetTrainingMaterials.QueryParameters,
  requestOptions?: RequestOptions<GetTrainingMaterials.Response.Success>,
): Promise<GetTrainingMaterials.Response.Success> {
  return request({
    path: `/api/training-materials`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetTrainingMaterials(
  queryParams: GetTrainingMaterials.QueryParameters,
  options?: UseQueryOptions<
    GetTrainingMaterials.Response.Success,
    GetTrainingMaterials.Response.Error
  >,
  requestOptions?: RequestOptions<GetTrainingMaterials.Response.Success>,
): UseQueryResult<
  GetTrainingMaterials.Response.Success,
  GetTrainingMaterials.Response.Error
> {
  return useQuery(
    ['getTrainingMaterials', queryParams],
    () => getTrainingMaterials(queryParams, requestOptions),
    options,
  )
}

export namespace CreateTrainingMaterial {
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = TrainingMaterialDto
    export type Error = unknown
  }
  export type RequestBody = TrainingMaterialCore
}

export async function createTrainingMaterial([
  queryParams,
  body,
  requestOptions,
]: [
  queryParams: CreateTrainingMaterial.QueryParameters,
  body: CreateTrainingMaterial.RequestBody,
  requestOptions?: RequestOptions<CreateTrainingMaterial.Response.Success>,
]): Promise<CreateTrainingMaterial.Response.Success> {
  return request({
    path: `/api/training-materials`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateTrainingMaterial(
  options?: UseMutationOptions<
    CreateTrainingMaterial.Response.Success,
    CreateTrainingMaterial.Response.Error,
    [
      CreateTrainingMaterial.QueryParameters,
      CreateTrainingMaterial.RequestBody,
      RequestOptions<CreateTrainingMaterial.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateTrainingMaterial.Response.Success,
  CreateTrainingMaterial.Response.Error,
  [
    CreateTrainingMaterial.QueryParameters,
    CreateTrainingMaterial.RequestBody,
    RequestOptions<CreateTrainingMaterial.Response.Success>,
  ],
  unknown
> {
  return useMutation(createTrainingMaterial, options)
}

export namespace RevertTrainingMaterial {
  export type PathParameters = {
    id: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = TrainingMaterialDto
    export type Error = unknown
  }
}

export async function revertTrainingMaterial([pathParams, requestOptions]: [
  pathParams: RevertTrainingMaterial.PathParameters,
  requestOptions?: RequestOptions<RevertTrainingMaterial.Response.Success>,
]): Promise<RevertTrainingMaterial.Response.Success> {
  return request({
    path: `/api/training-materials/${encodeURIComponent(
      pathParams.id,
    )}/versions/${encodeURIComponent(pathParams.versionId)}/revert`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useRevertTrainingMaterial(
  options?: UseMutationOptions<
    RevertTrainingMaterial.Response.Success,
    RevertTrainingMaterial.Response.Error,
    [
      RevertTrainingMaterial.PathParameters,
      RequestOptions<RevertTrainingMaterial.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  RevertTrainingMaterial.Response.Success,
  RevertTrainingMaterial.Response.Error,
  [
    RevertTrainingMaterial.PathParameters,
    RequestOptions<RevertTrainingMaterial.Response.Success>,
  ],
  unknown
> {
  return useMutation(revertTrainingMaterial, options)
}

export namespace GetTrainingMaterialHistory {
  export type PathParameters = {
    trainingMaterialId: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = Array<ItemExtBasicDto>
    export type Error = unknown
  }
}

export async function getTrainingMaterialHistory(
  pathParams: GetTrainingMaterialHistory.PathParameters,
  queryParams: GetTrainingMaterialHistory.QueryParameters,
  requestOptions?: RequestOptions<GetTrainingMaterialHistory.Response.Success>,
): Promise<GetTrainingMaterialHistory.Response.Success> {
  return request({
    path: `/api/training-materials/${encodeURIComponent(
      pathParams.trainingMaterialId,
    )}/history`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetTrainingMaterialHistory(
  pathParams: GetTrainingMaterialHistory.PathParameters,
  queryParams: GetTrainingMaterialHistory.QueryParameters,
  options?: UseQueryOptions<
    GetTrainingMaterialHistory.Response.Success,
    GetTrainingMaterialHistory.Response.Error
  >,
  requestOptions?: RequestOptions<GetTrainingMaterialHistory.Response.Success>,
): UseQueryResult<
  GetTrainingMaterialHistory.Response.Success,
  GetTrainingMaterialHistory.Response.Error
> {
  return useQuery(
    ['getTrainingMaterialHistory', pathParams, queryParams],
    () => getTrainingMaterialHistory(pathParams, queryParams, requestOptions),
    options,
  )
}

export namespace GetItemCategories {
  export namespace Response {
    export type Success = Record<string, string>
    export type Error = unknown
  }
}

export async function getItemCategories(
  requestOptions?: RequestOptions<GetItemCategories.Response.Success>,
): Promise<GetItemCategories.Response.Success> {
  return request({
    path: `/api/items-categories`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetItemCategories(
  options?: UseQueryOptions<
    GetItemCategories.Response.Success,
    GetItemCategories.Response.Error
  >,
  requestOptions?: RequestOptions<GetItemCategories.Response.Success>,
): UseQueryResult<
  GetItemCategories.Response.Success,
  GetItemCategories.Response.Error
> {
  return useQuery(
    ['getItemCategories'],
    () => getItemCategories(requestOptions),
    options,
  )
}

export namespace GetItems {
  export type QueryParameters = {
    sourceId: number /* int64 */
    sourceItemId: string
  }
  export namespace Response {
    export type Success = Array<ItemBasicDto>
    export type Error = unknown
  }
}

export async function getItems(
  queryParams: GetItems.QueryParameters,
  requestOptions?: RequestOptions<GetItems.Response.Success>,
): Promise<GetItems.Response.Success> {
  return request({
    path: `/api/items`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetItems(
  queryParams: GetItems.QueryParameters,
  options?: UseQueryOptions<GetItems.Response.Success, GetItems.Response.Error>,
  requestOptions?: RequestOptions<GetItems.Response.Success>,
): UseQueryResult<GetItems.Response.Success, GetItems.Response.Error> {
  return useQuery(
    ['getItems', queryParams],
    () => getItems(queryParams, requestOptions),
    options,
  )
}

export namespace GetMyDraftItems {
  export type QueryParameters = {
    order?: 'label' | 'modified-on'
    page?: number /* int32 */
    perpage?: number /* int32 */
  }
  export namespace Response {
    export type Success = PaginatedItemsBasic
    export type Error = unknown
  }
}

export async function getMyDraftItems(
  queryParams: GetMyDraftItems.QueryParameters,
  requestOptions?: RequestOptions<GetMyDraftItems.Response.Success>,
): Promise<GetMyDraftItems.Response.Success> {
  return request({
    path: `/api/draft-items`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetMyDraftItems(
  queryParams: GetMyDraftItems.QueryParameters,
  options?: UseQueryOptions<
    GetMyDraftItems.Response.Success,
    GetMyDraftItems.Response.Error
  >,
  requestOptions?: RequestOptions<GetMyDraftItems.Response.Success>,
): UseQueryResult<
  GetMyDraftItems.Response.Success,
  GetMyDraftItems.Response.Error
> {
  return useQuery(
    ['getMyDraftItems', queryParams],
    () => getMyDraftItems(queryParams, requestOptions),
    options,
  )
}

export namespace GetItemSource {
  export type PathParameters = {
    sourceCode: string
  }
  export namespace Response {
    export type Success = ItemSourceDto
    export type Error = unknown
  }
}

export async function getItemSource(
  pathParams: GetItemSource.PathParameters,
  requestOptions?: RequestOptions<GetItemSource.Response.Success>,
): Promise<GetItemSource.Response.Success> {
  return request({
    path: `/api/item-sources/${encodeURIComponent(pathParams.sourceCode)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetItemSource(
  pathParams: GetItemSource.PathParameters,
  options?: UseQueryOptions<
    GetItemSource.Response.Success,
    GetItemSource.Response.Error
  >,
  requestOptions?: RequestOptions<GetItemSource.Response.Success>,
): UseQueryResult<
  GetItemSource.Response.Success,
  GetItemSource.Response.Error
> {
  return useQuery(
    ['getItemSource', pathParams],
    () => getItemSource(pathParams, requestOptions),
    options,
  )
}

export namespace UpdateItemSource {
  export type PathParameters = {
    sourceCode: string
  }
  export namespace Response {
    export type Success = ItemSourceDto
    export type Error = unknown
  }
  export type RequestBody = ItemSourceCore
}

export async function updateItemSource([pathParams, body, requestOptions]: [
  pathParams: UpdateItemSource.PathParameters,
  body: UpdateItemSource.RequestBody,
  requestOptions?: RequestOptions<UpdateItemSource.Response.Success>,
]): Promise<UpdateItemSource.Response.Success> {
  return request({
    path: `/api/item-sources/${encodeURIComponent(pathParams.sourceCode)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateItemSource(
  options?: UseMutationOptions<
    UpdateItemSource.Response.Success,
    UpdateItemSource.Response.Error,
    [
      UpdateItemSource.PathParameters,
      UpdateItemSource.RequestBody,
      RequestOptions<UpdateItemSource.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateItemSource.Response.Success,
  UpdateItemSource.Response.Error,
  [
    UpdateItemSource.PathParameters,
    UpdateItemSource.RequestBody,
    RequestOptions<UpdateItemSource.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateItemSource, options)
}

export namespace DeleteItemSource {
  export type PathParameters = {
    sourceCode: string
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteItemSource([pathParams, requestOptions]: [
  pathParams: DeleteItemSource.PathParameters,
  requestOptions?: RequestOptions<DeleteItemSource.Response.Success>,
]): Promise<DeleteItemSource.Response.Success> {
  return request({
    path: `/api/item-sources/${encodeURIComponent(pathParams.sourceCode)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteItemSource(
  options?: UseMutationOptions<
    DeleteItemSource.Response.Success,
    DeleteItemSource.Response.Error,
    [
      DeleteItemSource.PathParameters,
      RequestOptions<DeleteItemSource.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteItemSource.Response.Success,
  DeleteItemSource.Response.Error,
  [
    DeleteItemSource.PathParameters,
    RequestOptions<DeleteItemSource.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteItemSource, options)
}

export namespace GetAllItemSources {
  export namespace Response {
    export type Success = Array<ItemSourceDto>
    export type Error = unknown
  }
}

export async function getAllItemSources(
  requestOptions?: RequestOptions<GetAllItemSources.Response.Success>,
): Promise<GetAllItemSources.Response.Success> {
  return request({
    path: `/api/item-sources`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetAllItemSources(
  options?: UseQueryOptions<
    GetAllItemSources.Response.Success,
    GetAllItemSources.Response.Error
  >,
  requestOptions?: RequestOptions<GetAllItemSources.Response.Success>,
): UseQueryResult<
  GetAllItemSources.Response.Success,
  GetAllItemSources.Response.Error
> {
  return useQuery(
    ['getAllItemSources'],
    () => getAllItemSources(requestOptions),
    options,
  )
}

export namespace CreateItemSource {
  export namespace Response {
    export type Success = ItemSourceDto
    export type Error = unknown
  }
  export type RequestBody = ItemSourceCore
}

export async function createItemSource([body, requestOptions]: [
  body: CreateItemSource.RequestBody,
  requestOptions?: RequestOptions<CreateItemSource.Response.Success>,
]): Promise<CreateItemSource.Response.Success> {
  return request({
    path: `/api/item-sources`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateItemSource(
  options?: UseMutationOptions<
    CreateItemSource.Response.Success,
    CreateItemSource.Response.Error,
    [
      CreateItemSource.RequestBody,
      RequestOptions<CreateItemSource.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateItemSource.Response.Success,
  CreateItemSource.Response.Error,
  [
    CreateItemSource.RequestBody,
    RequestOptions<CreateItemSource.Response.Success>,
  ],
  unknown
> {
  return useMutation(createItemSource, options)
}

export namespace GetDatasets {
  export type QueryParameters = {
    page?: number /* int32 */
    perpage?: number /* int32 */
    approved?: boolean
  }
  export namespace Response {
    export type Success = PaginatedDatasets
    export type Error = unknown
  }
}

export async function getDatasets(
  queryParams: GetDatasets.QueryParameters,
  requestOptions?: RequestOptions<GetDatasets.Response.Success>,
): Promise<GetDatasets.Response.Success> {
  return request({
    path: `/api/datasets`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetDatasets(
  queryParams: GetDatasets.QueryParameters,
  options?: UseQueryOptions<
    GetDatasets.Response.Success,
    GetDatasets.Response.Error
  >,
  requestOptions?: RequestOptions<GetDatasets.Response.Success>,
): UseQueryResult<GetDatasets.Response.Success, GetDatasets.Response.Error> {
  return useQuery(
    ['getDatasets', queryParams],
    () => getDatasets(queryParams, requestOptions),
    options,
  )
}

export namespace CreateDataset {
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = DatasetDto
    export type Error = unknown
  }
  export type RequestBody = DatasetCore
}

export async function createDataset([queryParams, body, requestOptions]: [
  queryParams: CreateDataset.QueryParameters,
  body: CreateDataset.RequestBody,
  requestOptions?: RequestOptions<CreateDataset.Response.Success>,
]): Promise<CreateDataset.Response.Success> {
  return request({
    path: `/api/datasets`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useCreateDataset(
  options?: UseMutationOptions<
    CreateDataset.Response.Success,
    CreateDataset.Response.Error,
    [
      CreateDataset.QueryParameters,
      CreateDataset.RequestBody,
      RequestOptions<CreateDataset.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  CreateDataset.Response.Success,
  CreateDataset.Response.Error,
  [
    CreateDataset.QueryParameters,
    CreateDataset.RequestBody,
    RequestOptions<CreateDataset.Response.Success>,
  ],
  unknown
> {
  return useMutation(createDataset, options)
}

export namespace GetDataset {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = DatasetDto
    export type Error = unknown
  }
}

export async function getDataset(
  pathParams: GetDataset.PathParameters,
  queryParams: GetDataset.QueryParameters,
  requestOptions?: RequestOptions<GetDataset.Response.Success>,
): Promise<GetDataset.Response.Success> {
  return request({
    path: `/api/datasets/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetDataset(
  pathParams: GetDataset.PathParameters,
  queryParams: GetDataset.QueryParameters,
  options?: UseQueryOptions<
    GetDataset.Response.Success,
    GetDataset.Response.Error
  >,
  requestOptions?: RequestOptions<GetDataset.Response.Success>,
): UseQueryResult<GetDataset.Response.Success, GetDataset.Response.Error> {
  return useQuery(
    ['getDataset', pathParams, queryParams],
    () => getDataset(pathParams, queryParams, requestOptions),
    options,
  )
}

export namespace UpdateDataset {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = DatasetDto
    export type Error = unknown
  }
  export type RequestBody = DatasetCore
}

export async function updateDataset([
  pathParams,
  queryParams,
  body,
  requestOptions,
]: [
  pathParams: UpdateDataset.PathParameters,
  queryParams: UpdateDataset.QueryParameters,
  body: UpdateDataset.RequestBody,
  requestOptions?: RequestOptions<UpdateDataset.Response.Success>,
]): Promise<UpdateDataset.Response.Success> {
  return request({
    path: `/api/datasets/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useUpdateDataset(
  options?: UseMutationOptions<
    UpdateDataset.Response.Success,
    UpdateDataset.Response.Error,
    [
      UpdateDataset.PathParameters,
      UpdateDataset.QueryParameters,
      UpdateDataset.RequestBody,
      RequestOptions<UpdateDataset.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  UpdateDataset.Response.Success,
  UpdateDataset.Response.Error,
  [
    UpdateDataset.PathParameters,
    UpdateDataset.QueryParameters,
    UpdateDataset.RequestBody,
    RequestOptions<UpdateDataset.Response.Success>,
  ],
  unknown
> {
  return useMutation(updateDataset, options)
}

export namespace DeleteDataset {
  export type PathParameters = {
    id: string
  }
  export type QueryParameters = {
    draft?: boolean
  }
  export namespace Response {
    export type Success = void
    export type Error = unknown
  }
}

export async function deleteDataset([pathParams, queryParams, requestOptions]: [
  pathParams: DeleteDataset.PathParameters,
  queryParams: DeleteDataset.QueryParameters,
  requestOptions?: RequestOptions<DeleteDataset.Response.Success>,
]): Promise<DeleteDataset.Response.Success> {
  return request({
    path: `/api/datasets/${encodeURIComponent(pathParams.id)}`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'delete',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useDeleteDataset(
  options?: UseMutationOptions<
    DeleteDataset.Response.Success,
    DeleteDataset.Response.Error,
    [
      DeleteDataset.PathParameters,
      DeleteDataset.QueryParameters,
      RequestOptions<DeleteDataset.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  DeleteDataset.Response.Success,
  DeleteDataset.Response.Error,
  [
    DeleteDataset.PathParameters,
    DeleteDataset.QueryParameters,
    RequestOptions<DeleteDataset.Response.Success>,
  ],
  unknown
> {
  return useMutation(deleteDataset, options)
}

export namespace GetDatasetVersion {
  export type PathParameters = {
    id: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = DatasetDto
    export type Error = unknown
  }
}

export async function getDatasetVersion(
  pathParams: GetDatasetVersion.PathParameters,
  requestOptions?: RequestOptions<GetDatasetVersion.Response.Success>,
): Promise<GetDatasetVersion.Response.Success> {
  return request({
    path: `/api/datasets/${encodeURIComponent(
      pathParams.id,
    )}/versions/${encodeURIComponent(pathParams.versionId)}`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetDatasetVersion(
  pathParams: GetDatasetVersion.PathParameters,
  options?: UseQueryOptions<
    GetDatasetVersion.Response.Success,
    GetDatasetVersion.Response.Error
  >,
  requestOptions?: RequestOptions<GetDatasetVersion.Response.Success>,
): UseQueryResult<
  GetDatasetVersion.Response.Success,
  GetDatasetVersion.Response.Error
> {
  return useQuery(
    ['getDatasetVersion', pathParams],
    () => getDatasetVersion(pathParams, requestOptions),
    options,
  )
}

export namespace RevertDataset {
  export type PathParameters = {
    id: string
    versionId: number /* int64 */
  }
  export namespace Response {
    export type Success = DatasetDto
    export type Error = unknown
  }
}

export async function revertDataset([pathParams, requestOptions]: [
  pathParams: RevertDataset.PathParameters,
  requestOptions?: RequestOptions<RevertDataset.Response.Success>,
]): Promise<RevertDataset.Response.Success> {
  return request({
    path: `/api/datasets/${encodeURIComponent(
      pathParams.id,
    )}/versions/${encodeURIComponent(pathParams.versionId)}/revert`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'put',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useRevertDataset(
  options?: UseMutationOptions<
    RevertDataset.Response.Success,
    RevertDataset.Response.Error,
    [
      RevertDataset.PathParameters,
      RequestOptions<RevertDataset.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  RevertDataset.Response.Success,
  RevertDataset.Response.Error,
  [
    RevertDataset.PathParameters,
    RequestOptions<RevertDataset.Response.Success>,
  ],
  unknown
> {
  return useMutation(revertDataset, options)
}

export namespace PublishDataset {
  export type PathParameters = {
    datasetId: string
  }
  export namespace Response {
    export type Success = DatasetDto
    export type Error = unknown
  }
}

export async function publishDataset([pathParams, requestOptions]: [
  pathParams: PublishDataset.PathParameters,
  requestOptions?: RequestOptions<PublishDataset.Response.Success>,
]): Promise<PublishDataset.Response.Success> {
  return request({
    path: `/api/datasets/${encodeURIComponent(pathParams.datasetId)}/commit`,
    baseUrl: undefined,
    query: undefined,
    options: {
      method: 'post',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function usePublishDataset(
  options?: UseMutationOptions<
    PublishDataset.Response.Success,
    PublishDataset.Response.Error,
    [
      PublishDataset.PathParameters,
      RequestOptions<PublishDataset.Response.Success>,
    ],
    unknown
  >,
): UseMutationResult<
  PublishDataset.Response.Success,
  PublishDataset.Response.Error,
  [
    PublishDataset.PathParameters,
    RequestOptions<PublishDataset.Response.Success>,
  ],
  unknown
> {
  return useMutation(publishDataset, options)
}

export namespace GetDatasetHistory {
  export type PathParameters = {
    datasetId: string
  }
  export type QueryParameters = {
    draft?: boolean
    approved?: boolean
  }
  export namespace Response {
    export type Success = Array<ItemExtBasicDto>
    export type Error = unknown
  }
}

export async function getDatasetHistory(
  pathParams: GetDatasetHistory.PathParameters,
  queryParams: GetDatasetHistory.QueryParameters,
  requestOptions?: RequestOptions<GetDatasetHistory.Response.Success>,
): Promise<GetDatasetHistory.Response.Success> {
  return request({
    path: `/api/datasets/${encodeURIComponent(pathParams.datasetId)}/history`,
    baseUrl: undefined,
    query: queryParams,
    options: {
      method: 'get',
      body: undefined,
      headers: {},
    },
    returnType: 'json',
    hooks: requestOptions?.hooks,
    token: requestOptions?.token,
  })
}

export function useGetDatasetHistory(
  pathParams: GetDatasetHistory.PathParameters,
  queryParams: GetDatasetHistory.QueryParameters,
  options?: UseQueryOptions<
    GetDatasetHistory.Response.Success,
    GetDatasetHistory.Response.Error
  >,
  requestOptions?: RequestOptions<GetDatasetHistory.Response.Success>,
): UseQueryResult<
  GetDatasetHistory.Response.Success,
  GetDatasetHistory.Response.Error
> {
  return useQuery(
    ['getDatasetHistory', pathParams, queryParams],
    () => getDatasetHistory(pathParams, queryParams, requestOptions),
    options,
  )
}
