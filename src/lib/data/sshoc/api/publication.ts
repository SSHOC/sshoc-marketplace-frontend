import type { AuthData, PaginatedRequest, PaginatedResponse } from '@/data/sshoc/api/common'
import type { ItemBase, ItemBaseInput, ItemHistoryEntry, ItemsDiff } from '@/data/sshoc/api/item'
import type { Source } from '@/data/sshoc/api/source'
import type { User } from '@/data/sshoc/api/user'
import type { RequestOptions } from '@/data/sshoc/lib/client'
import { createUrl, request } from '@/data/sshoc/lib/client'
import type { AllowedRequestOptions, IsoDateString } from '@/data/sshoc/lib/types'
import { publicationInputSchema } from '@/data/sshoc/validation-schemas/publication'

export interface Publication extends ItemBase {
  category: 'publication'
  dateCreated?: IsoDateString
  dateLastUpdated?: IsoDateString
}

export interface PublicationInput extends ItemBaseInput {
  // category: 'publication'
  dateCreated?: IsoDateString
  dateLastUpdated?: IsoDateString
}

export namespace GetPublications {
  export type SearchParams = PaginatedRequest<{
    /** @default true */
    approved?: boolean
  }>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    publications: Array<Publication>
  }>
}

export function getPublications(
  params: GetPublications.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetPublications.Response> {
  const url = createUrl({ pathname: '/api/publications', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetPublication {
  export type PathParams = {
    persistentId: Publication['persistentId']
  }
  export type SearchParams = {
    /** @default false */
    draft?: boolean
    /** @default true */
    approved?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = Publication
}

export function getPublication(
  params: GetPublication.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetPublication.Response> {
  const url = createUrl({
    pathname: `/api/publications/${params.persistentId}`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetPublicationVersion {
  export type PathParams = {
    persistentId: Publication['persistentId']
    versionId: Publication['id']
  }
  export type Params = PathParams
  export type Response = Publication
}

export function getPublicationVersion(
  params: GetPublicationVersion.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetPublicationVersion.Response> {
  const url = createUrl({
    pathname: `/api/publications/${params.persistentId}/versions/${params.versionId}`,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetPublicationHistory {
  export type PathParams = {
    persistentId: Publication['persistentId']
  }
  export type SearchParams = {
    /** @default false */
    draft?: boolean
    /** @default true */
    approved?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = Array<ItemHistoryEntry>
}

export function getPublicationHistory(
  params: GetPublicationHistory.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetPublicationHistory.Response> {
  const url = createUrl({ pathname: `/api/publications/${params.persistentId}/history` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetPublicationInformationContributors {
  export type PathParams = {
    persistentId: Publication['persistentId']
  }
  export type Params = PathParams
  export type Response = Array<User>
}

export function getPublicationInformationContributors(
  params: GetPublicationInformationContributors.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetPublicationInformationContributors.Response> {
  const url = createUrl({
    pathname: `/api/publications/${params.persistentId}/information-contributors`,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetPublicationVersionInformationContributors {
  export type PathParams = {
    persistentId: Publication['persistentId']
    versionId: Publication['id']
  }
  export type Params = PathParams
  export type Response = Array<User>
}

export function getPublicationVersionInformationContributors(
  params: GetPublicationVersionInformationContributors.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetPublicationVersionInformationContributors.Response> {
  const url = createUrl({
    pathname: `/api/publications/${params.persistentId}/versions/${params.versionId}/information-contributors`,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreatePublication {
  export type SearchParams = {
    /** @default false */
    draft?: boolean
  }
  export type Params = SearchParams
  export type Body = PublicationInput
  export type Response = Publication
}

export function createPublication(
  params: CreatePublication.Params,
  data: CreatePublication.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreatePublication.Response> {
  const url = createUrl({ pathname: '/api/publications', searchParams: params })
  const json = publicationInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace CommitDraftPublication {
  export type PathParams = {
    persistentId: Publication['persistentId']
  }
  export type Params = PathParams
  export type Response = Publication
}

export function commitDraftPublication(
  params: CommitDraftPublication.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CommitDraftPublication.Response> {
  const url = createUrl({ pathname: `/api/publications/${params.persistentId}/commit` })
  const options: RequestOptions = { ...requestOptions, method: 'post' }

  return request(url, options, auth)
}

export namespace UpdatePublication {
  export type PathParams = {
    persistentId: Publication['persistentId']
  }
  export type SearchParams = {
    /** @default false */
    draft?: boolean
    /** @default true */
    approved?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Body = PublicationInput
  export type Response = Publication
}

export function updatePublication(
  params: UpdatePublication.Params,
  data: UpdatePublication.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdatePublication.Response> {
  const url = createUrl({
    pathname: `/api/publications/${params.persistentId}`,
    searchParams: params,
  })
  const json = publicationInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeletePublication {
  export type PathParams = {
    persistentId: Publication['persistentId']
  }
  export type SearchParams = {
    /** @default false */
    draft?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = void
}

export function deletePublication(
  params: DeletePublication.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeletePublication.Response> {
  const url = createUrl({
    pathname: `/api/publications/${params.persistentId}`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace DeletePublicationVersion {
  export type PathParams = {
    persistentId: Publication['persistentId']
    versionId: Publication['id']
  }
  export type Params = PathParams
  export type Response = void
}

export function deletePublicationVersion(
  params: DeletePublicationVersion.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeletePublicationVersion.Response> {
  const url = createUrl({
    pathname: `/api/publications/${params.persistentId}/versions/${params.versionId}`,
  })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace RevertPublicationToVersion {
  export type PathParams = {
    persistentId: Publication['persistentId']
    versionId: Publication['id']
  }
  export type Params = PathParams
  export type Response = Publication
}

export function revertPublicationToVersion(
  params: RevertPublicationToVersion.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<RevertPublicationToVersion.Response> {
  const url = createUrl({
    pathname: `/api/publications/${params.persistentId}/versions/${params.versionId}/revert`,
  })
  const options: RequestOptions = { ...requestOptions, method: 'put' }

  return request(url, options, auth)
}

export const approvePublicationVersion = revertPublicationToVersion

export namespace GetMergedPublication {
  export type PathParams = {
    persistentId: Publication['persistentId']
  }
  export type SearchParams = {
    with: Array<Publication['persistentId']>
  }
  export type Params = PathParams & SearchParams
  export type Response = Publication
}

export function getMergedPublication(
  params: GetMergedPublication.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetMergedPublication.Response> {
  const url = createUrl({
    pathname: `/api/publications/${params.persistentId}/merge`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace MergePublications {
  export type SearchParams = {
    with: Array<Publication['persistentId']>
  }
  export type Params = SearchParams
  export type Body = PublicationInput
  export type Response = Publication
}

export function mergePublications(
  params: MergePublications.Params,
  data: MergePublications.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<MergePublications.Response> {
  const url = createUrl({
    pathname: '/api/publications/merge',
    searchParams: params,
  })
  const json = publicationInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace GetPublicationDiff {
  export type PathParams = {
    persistentId: Publication['persistentId']
  }
  export type SearchParams = {
    /** `persistentId` of item to compare with. */
    with: Publication['persistentId']
    /** `versionId` of item to compare with. */
    otherVersionId?: Publication['id']
  }
  export type Params = PathParams & SearchParams
  export type Response = ItemsDiff
}

export function getPublicationDiff(
  params: GetPublicationDiff.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetPublicationDiff.Response> {
  const url = createUrl({
    pathname: `/api/publications/${params.persistentId}/diff`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetPublicationVersionDiff {
  export type PathParams = {
    persistentId: Publication['persistentId']
    versionId: Publication['id']
  }
  export type SearchParams = {
    /** `persistentId` of item to compare with. */
    with: Publication['persistentId']
    /** `versionId` of item to compare with. */
    otherVersionId?: Publication['id']
  }
  export type Params = PathParams & SearchParams
  export type Response = ItemsDiff
}

export function getPublicationVersionDiff(
  params: GetPublicationVersionDiff.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetPublicationVersionDiff.Response> {
  const url = createUrl({
    pathname: `/api/publications/${params.persistentId}/versions/${params.versionId}/diff`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetPublicationSources {
  export type PathParams = {
    persistentId: Publication['persistentId']
  }
  export type Params = PathParams
  export type Response = Array<Source>
}

export function getPublicationSources(
  params: GetPublicationSources.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetPublicationSources.Response> {
  const url = createUrl({ pathname: `/api/publications/${params.persistentId}/sources` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}
