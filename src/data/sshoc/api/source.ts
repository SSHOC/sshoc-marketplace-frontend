import type { AuthData, PaginatedRequest, PaginatedResponse } from '@/data/sshoc/api/common'
import type { RequestOptions } from '@/data/sshoc/lib/client'
import { createUrl, request } from '@/data/sshoc/lib/client'
import type { AllowedRequestOptions, IsoDateString, UrlString } from '@/data/sshoc/lib/types'
import { sourceInputSchema } from '@/data/sshoc/validation-schemas/source'

export const sourceSortOrders = ['name', 'date'] as const

export type SourceSortOrder = (typeof sourceSortOrders)[number]

export function isSourceSortOrder(sortOrder: string): sortOrder is SourceSortOrder {
  return sourceSortOrders.includes(sortOrder as SourceSortOrder)
}

/** SourceBasicDto */
export interface SourceBase {
  id: number
  label: string
  url: UrlString
  /** Replace `{source-item-id}` with identifier. */
  urlTemplate: UrlString
}

/** SourceDto */
export interface Source extends SourceBase {
  lastHarvestedDate?: IsoDateString
}

/** SourceCore */
export interface SourceInput {
  label: string
  url: UrlString
  /** Must include `{source-item-id}`. */
  urlTemplate: UrlString
}

/** SourceId */
export interface SourceRef {
  id: number
}

export namespace GetSources {
  export type SearchParams = PaginatedRequest<{
    q?: string
    order?: SourceSortOrder
  }>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    sources: Array<Source>
  }>
}

export function getSources(
  params?: GetSources.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetSources.Response> {
  const url = createUrl({ pathname: '/api/sources', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetSource {
  export interface PathParams {
    id: number
  }
  export type Params = PathParams
  export type Response = Source
}

export function getSource(
  params: GetSource.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetSource.Response> {
  const url = createUrl({ pathname: `/api/sources/${params.id}` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateSource {
  export type Body = SourceInput
  export type Response = Source
}

export function createSource(
  data: CreateSource.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateSource.Response> {
  const url = createUrl({ pathname: '/api/sources' })
  const json = sourceInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace UpdateSource {
  export interface PathParams {
    id: number
  }
  export type Params = PathParams
  export type Body = SourceInput
  export type Response = Source
}

export function updateSource(
  params: UpdateSource.Params,
  data: UpdateSource.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateSource.Response> {
  const url = createUrl({ pathname: `/api/sources/${params.id}` })
  const json = sourceInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeleteSource {
  export interface PathParams {
    id: number
  }
  export type Params = PathParams
  export type Response = void
}

export function deleteSource(
  params: DeleteSource.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteSource.Response> {
  const url = createUrl({ pathname: `/api/sources/${params.id}` })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}
