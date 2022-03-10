import type { AuthData, PaginatedRequest, PaginatedResponse } from '@/data/sshoc/api/common'
import type { ItemBase, ItemBaseInput, ItemHistoryEntry, ItemsDiff } from '@/data/sshoc/api/item'
import type { Source } from '@/data/sshoc/api/source'
import type { User } from '@/data/sshoc/api/user'
import type { RequestOptions } from '@/data/sshoc/lib/client'
import { createUrl, request } from '@/data/sshoc/lib/client'
import type { AllowedRequestOptions, IsoDateString } from '@/data/sshoc/lib/types'
import { trainingMaterialInputSchema } from '@/data/sshoc/validation-schemas/training-material'

export interface TrainingMaterial extends ItemBase {
  category: 'training-material'
  dateCreated?: IsoDateString
  dateLastUpdated?: IsoDateString
}

export interface TrainingMaterialInput extends ItemBaseInput {
  // category: 'training-material'
  dateCreated?: IsoDateString
  dateLastUpdated?: IsoDateString
}

export namespace GetTrainingMaterials {
  export type SearchParams = PaginatedRequest<{
    /** @default true */
    approved?: boolean
  }>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    trainingMaterials: Array<TrainingMaterial>
  }>
}

export function getTrainingMaterials(
  params: GetTrainingMaterials.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetTrainingMaterials.Response> {
  const url = createUrl({ pathname: '/api/training-materials', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetTrainingMaterial {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
  }
  export type SearchParams = {
    /** @default false */
    draft?: boolean
    /** @default true */
    approved?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = TrainingMaterial
}

export function getTrainingMaterial(
  params: GetTrainingMaterial.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetTrainingMaterial.Response> {
  const url = createUrl({
    pathname: `/api/training-materials/${params.persistentId}`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetTrainingMaterialVersion {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
    versionId: TrainingMaterial['id']
  }
  export type Params = PathParams
  export type Response = TrainingMaterial
}

export function getTrainingMaterialVersion(
  params: GetTrainingMaterialVersion.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetTrainingMaterialVersion.Response> {
  const url = createUrl({
    pathname: `/api/training-materials/${params.persistentId}/versions/${params.versionId}`,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetTrainingMaterialHistory {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
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

export function getTrainingMaterialHistory(
  params: GetTrainingMaterialHistory.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetTrainingMaterialHistory.Response> {
  const url = createUrl({ pathname: `/api/training-materials/${params.persistentId}/history` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetTrainingMaterialInformationContributors {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
  }
  export type Params = PathParams
  export type Response = Array<User>
}

export function getTrainingMaterialInformationContributors(
  params: GetTrainingMaterialInformationContributors.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetTrainingMaterialInformationContributors.Response> {
  const url = createUrl({
    pathname: `/api/training-materials/${params.persistentId}/information-contributors`,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetTrainingMaterialVersionInformationContributors {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
    versionId: TrainingMaterial['id']
  }
  export type Params = PathParams
  export type Response = Array<User>
}

export function getTrainingMaterialVersionInformationContributors(
  params: GetTrainingMaterialVersionInformationContributors.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetTrainingMaterialVersionInformationContributors.Response> {
  const url = createUrl({
    pathname: `/api/training-materials/${params.persistentId}/versions/${params.versionId}/information-contributors`,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateTrainingMaterial {
  export type SearchParams = {
    /** @default false */
    draft?: boolean
  }
  export type Params = SearchParams
  export type Body = TrainingMaterialInput
  export type Response = TrainingMaterial
}

export function createTrainingMaterial(
  params: CreateTrainingMaterial.Params,
  data: CreateTrainingMaterial.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateTrainingMaterial.Response> {
  const url = createUrl({ pathname: '/api/training-materials', searchParams: params })
  const json = trainingMaterialInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace CommitDraftTrainingMaterial {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
  }
  export type Params = PathParams
  export type Response = TrainingMaterial
}

export function commitDraftTrainingMaterial(
  params: CommitDraftTrainingMaterial.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CommitDraftTrainingMaterial.Response> {
  const url = createUrl({ pathname: `/api/training-materials/${params.persistentId}/commit` })
  const options: RequestOptions = { ...requestOptions, method: 'post' }

  return request(url, options, auth)
}

export namespace UpdateTrainingMaterial {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
  }
  export type SearchParams = {
    /** @default false */
    draft?: boolean
    /** @default true */
    approved?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Body = TrainingMaterialInput
  export type Response = TrainingMaterial
}

export function updateTrainingMaterial(
  params: UpdateTrainingMaterial.Params,
  data: UpdateTrainingMaterial.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateTrainingMaterial.Response> {
  const url = createUrl({
    pathname: `/api/training-materials/${params.persistentId}`,
    searchParams: params,
  })
  const json = trainingMaterialInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeleteTrainingMaterial {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
  }
  export type SearchParams = {
    /** @default false */
    draft?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = void
}

export function deleteTrainingMaterial(
  params: DeleteTrainingMaterial.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteTrainingMaterial.Response> {
  const url = createUrl({
    pathname: `/api/training-materials/${params.persistentId}`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace DeleteTrainingMaterialVersion {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
    versionId: TrainingMaterial['id']
  }
  export type Params = PathParams
  export type Response = void
}

export function deleteTrainingMaterialVersion(
  params: DeleteTrainingMaterialVersion.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteTrainingMaterialVersion.Response> {
  const url = createUrl({
    pathname: `/api/training-materials/${params.persistentId}/versions/${params.versionId}`,
  })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace RevertTrainingMaterialToVersion {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
    versionId: TrainingMaterial['id']
  }
  export type Params = PathParams
  export type Response = TrainingMaterial
}

export function revertTrainingMaterialToVersion(
  params: RevertTrainingMaterialToVersion.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<RevertTrainingMaterialToVersion.Response> {
  const url = createUrl({
    pathname: `/api/training-materials/${params.persistentId}/versions/${params.versionId}/revert`,
  })
  const options: RequestOptions = { ...requestOptions, method: 'put' }

  return request(url, options, auth)
}

export const approveTrainingMaterialVersion = revertTrainingMaterialToVersion

export namespace GetMergedTrainingMaterial {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
  }
  export type SearchParams = {
    with: Array<TrainingMaterial['persistentId']>
  }
  export type Params = PathParams & SearchParams
  export type Response = TrainingMaterial
}

export function getMergedTrainingMaterial(
  params: GetMergedTrainingMaterial.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetMergedTrainingMaterial.Response> {
  const url = createUrl({
    pathname: `/api/training-materials/${params.persistentId}/merge`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace MergeTrainingMaterials {
  export type SearchParams = {
    with: Array<TrainingMaterial['persistentId']>
  }
  export type Params = SearchParams
  export type Body = TrainingMaterialInput
  export type Response = TrainingMaterial
}

export function mergeTrainingMaterials(
  params: MergeTrainingMaterials.Params,
  data: MergeTrainingMaterials.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<MergeTrainingMaterials.Response> {
  const url = createUrl({
    pathname: '/api/training-materials/merge',
    searchParams: params,
  })
  const json = trainingMaterialInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace GetTrainingMaterialDiff {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
  }
  export type SearchParams = {
    /** `persistentId` of item to compare with. */
    with: TrainingMaterial['persistentId']
    /** `versionId` of item to compare with. */
    otherVersionId?: TrainingMaterial['id']
  }
  export type Params = PathParams & SearchParams
  export type Response = ItemsDiff
}

export function getTrainingMaterialDiff(
  params: GetTrainingMaterialDiff.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetTrainingMaterialDiff.Response> {
  const url = createUrl({
    pathname: `/api/training-materials/${params.persistentId}/diff`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetTrainingMaterialVersionDiff {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
    versionId: TrainingMaterial['id']
  }
  export type SearchParams = {
    /** `persistentId` of item to compare with. */
    with: TrainingMaterial['persistentId']
    /** `versionId` of item to compare with. */
    otherVersionId?: TrainingMaterial['id']
  }
  export type Params = PathParams & SearchParams
  export type Response = ItemsDiff
}

export function getTrainingMaterialVersionDiff(
  params: GetTrainingMaterialVersionDiff.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetTrainingMaterialVersionDiff.Response> {
  const url = createUrl({
    pathname: `/api/training-materials/${params.persistentId}/versions/${params.versionId}/diff`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetTrainingMaterialSources {
  export type PathParams = {
    persistentId: TrainingMaterial['persistentId']
  }
  export type Params = PathParams
  export type Response = Array<Source>
}

export function getTrainingMaterialSources(
  params: GetTrainingMaterialSources.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetTrainingMaterialSources.Response> {
  const url = createUrl({ pathname: `/api/training-materials/${params.persistentId}/sources` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}
