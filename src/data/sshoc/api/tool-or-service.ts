import type { AuthData, PaginatedRequest, PaginatedResponse } from '@/data/sshoc/api/common'
import type { ItemBase, ItemBaseInput, ItemHistoryEntry, ItemsDiff } from '@/data/sshoc/api/item'
import type { Source } from '@/data/sshoc/api/source'
import type { User } from '@/data/sshoc/api/user'
import type { RequestOptions } from '@/data/sshoc/lib/client'
import { createUrl, request } from '@/data/sshoc/lib/client'
import type { AllowedRequestOptions } from '@/data/sshoc/lib/types'
import { toolInputSchema } from '@/data/sshoc/validation-schemas/tool'

export interface Tool extends ItemBase {
  category: 'tool-or-service'
}

export type ToolInput = ItemBaseInput

export namespace GetTools {
  export type SearchParams = PaginatedRequest<{
    /** @default true */
    approved?: boolean
  }>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    tools: Array<Tool>
  }>
}

export function getTools(
  params: GetTools.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetTools.Response> {
  const url = createUrl({ pathname: '/api/tools-services', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetTool {
  export interface PathParams {
    persistentId: Tool['persistentId']
  }
  export interface SearchParams {
    /** @default false */
    draft?: boolean
    /** @default true */
    approved?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = Tool
}

export function getTool(
  params: GetTool.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetTool.Response> {
  const url = createUrl({
    pathname: `/api/tools-services/${params.persistentId}`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetToolVersion {
  export interface PathParams {
    persistentId: Tool['persistentId']
    versionId: Tool['id']
  }
  export type Params = PathParams
  export type Response = Tool
}

export function getToolVersion(
  params: GetToolVersion.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetToolVersion.Response> {
  const url = createUrl({
    pathname: `/api/tools-services/${params.persistentId}/versions/${params.versionId}`,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetToolHistory {
  export interface PathParams {
    persistentId: Tool['persistentId']
  }
  export interface SearchParams {
    /** @default false */
    draft?: boolean
    /** @default true */
    approved?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = Array<ItemHistoryEntry>
}

export function getToolHistory(
  params: GetToolHistory.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetToolHistory.Response> {
  const url = createUrl({ pathname: `/api/tools-services/${params.persistentId}/history` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetToolInformationContributors {
  export interface PathParams {
    persistentId: Tool['persistentId']
  }
  export type Params = PathParams
  export type Response = Array<User>
}

export function getToolInformationContributors(
  params: GetToolInformationContributors.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetToolInformationContributors.Response> {
  const url = createUrl({
    pathname: `/api/tools-services/${params.persistentId}/information-contributors`,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetToolVersionInformationContributors {
  export interface PathParams {
    persistentId: Tool['persistentId']
    versionId: Tool['id']
  }
  export type Params = PathParams
  export type Response = Array<User>
}

export function getToolVersionInformationContributors(
  params: GetToolVersionInformationContributors.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetToolVersionInformationContributors.Response> {
  const url = createUrl({
    pathname: `/api/tools-services/${params.persistentId}/versions/${params.versionId}/information-contributors`,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateTool {
  export interface SearchParams {
    /** @default false */
    draft?: boolean
  }
  export type Params = SearchParams
  export type Body = ToolInput
  export type Response = Tool
}

export function createTool(
  params: CreateTool.Params,
  data: CreateTool.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateTool.Response> {
  const url = createUrl({ pathname: '/api/tools-services', searchParams: params })
  const json = toolInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace CommitDraftTool {
  export interface PathParams {
    persistentId: Tool['persistentId']
  }
  export type Params = PathParams
  export type Response = Tool
}

export function commitDraftTool(
  params: CommitDraftTool.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CommitDraftTool.Response> {
  const url = createUrl({ pathname: `/api/tools-services/${params.persistentId}/commit` })
  const options: RequestOptions = { ...requestOptions, method: 'post' }

  return request(url, options, auth)
}

export namespace UpdateTool {
  export interface PathParams {
    persistentId: Tool['persistentId']
  }
  export interface SearchParams {
    /** @default false */
    draft?: boolean
    /** @default true */
    approved?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Body = ToolInput
  export type Response = Tool
}

export function updateTool(
  params: UpdateTool.Params,
  data: UpdateTool.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateTool.Response> {
  const url = createUrl({
    pathname: `/api/tools-services/${params.persistentId}`,
    searchParams: params,
  })
  const json = toolInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeleteTool {
  export interface PathParams {
    persistentId: Tool['persistentId']
  }
  export interface SearchParams {
    /** @default false */
    draft?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = void
}

export function deleteTool(
  params: DeleteTool.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteTool.Response> {
  const url = createUrl({
    pathname: `/api/tools-services/${params.persistentId}`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace DeleteToolVersion {
  export interface PathParams {
    persistentId: Tool['persistentId']
    versionId: Tool['id']
  }
  export type Params = PathParams
  export type Response = void
}

export function deleteToolVersion(
  params: DeleteToolVersion.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteToolVersion.Response> {
  const url = createUrl({
    pathname: `/api/tools-services/${params.persistentId}/versions/${params.versionId}`,
  })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace RevertToolToVersion {
  export interface PathParams {
    persistentId: Tool['persistentId']
    versionId: Tool['id']
  }
  export type Params = PathParams
  export type Response = Tool
}

export function revertToolToVersion(
  params: RevertToolToVersion.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<RevertToolToVersion.Response> {
  const url = createUrl({
    pathname: `/api/tools-services/${params.persistentId}/versions/${params.versionId}/revert`,
  })
  const options: RequestOptions = { ...requestOptions, method: 'put' }

  return request(url, options, auth)
}

export const approveToolVersion = revertToolToVersion

export namespace GetMergedTool {
  export interface PathParams {
    persistentId: Tool['persistentId']
  }
  export interface SearchParams {
    with: Array<Tool['persistentId']>
  }
  export type Params = PathParams & SearchParams
  export type Response = Tool
}

export function getMergedTool(
  params: GetMergedTool.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetMergedTool.Response> {
  const url = createUrl({
    pathname: `/api/tools-services/${params.persistentId}/merge`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace MergeTools {
  export interface SearchParams {
    with: Array<Tool['persistentId']>
  }
  export type Params = SearchParams
  export type Body = ToolInput
  export type Response = Tool
}

export function mergeTools(
  params: MergeTools.Params,
  data: MergeTools.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<MergeTools.Response> {
  const url = createUrl({ pathname: '/api/tools-services/merge', searchParams: params })
  const json = toolInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace GetToolDiff {
  export interface PathParams {
    persistentId: Tool['persistentId']
  }
  export interface SearchParams {
    /** `persistentId` of item to compare with. */
    with: Tool['persistentId']
    /** `versionId` of item to compare with. */
    otherVersionId?: Tool['id']
  }
  export type Params = PathParams & SearchParams
  export type Response = ItemsDiff
}

export function getToolDiff(
  params: GetToolDiff.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetToolDiff.Response> {
  const url = createUrl({
    pathname: `/api/tools-services/${params.persistentId}/diff`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetToolVersionDiff {
  export interface PathParams {
    persistentId: Tool['persistentId']
    versionId: Tool['id']
  }
  export interface SearchParams {
    /** `persistentId` of item to compare with. */
    with: Tool['persistentId']
    /** `versionId` of item to compare with. */
    otherVersionId?: Tool['id']
  }
  export type Params = PathParams & SearchParams
  export type Response = ItemsDiff
}

export function getToolVersionDiff(
  params: GetToolVersionDiff.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetToolVersionDiff.Response> {
  const url = createUrl({
    pathname: `/api/tools-services/${params.persistentId}/versions/${params.versionId}/diff`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetToolSources {
  export interface PathParams {
    persistentId: Tool['persistentId']
  }
  export type Params = PathParams
  export type Response = Array<Source>
}

export function getToolSources(
  params: GetToolSources.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetToolSources.Response> {
  const url = createUrl({ pathname: `/api/tools-services/${params.persistentId}/sources` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}
