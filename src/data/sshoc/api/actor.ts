import { z } from 'zod'

import type { AuthData, PaginatedRequest, PaginatedResponse } from '@/data/sshoc/api/common'
import type { RequestOptions } from '@/data/sshoc/lib/client'
import { createUrl, request } from '@/data/sshoc/lib/client'
import type {
  AllowedRequestOptions,
  EmailString,
  IsoDateString,
  JsonString,
  UrlString,
} from '@/data/sshoc/lib/types'
import {
  actorInputSchema,
  actorRoleInputSchema,
  actorSourceInputSchema,
} from '@/data/sshoc/validation-schemas/actor'

/** ActorDto */
export interface Actor {
  id: number
  name: string
  externalIds: Array<ActorExternalId>
  website?: UrlString
  email?: EmailString
  affiliations: Array<Actor>
}

/** ActorCore */
export interface ActorInput {
  name: string
  externalIds?: Array<ActorExternalIdInput>
  website?: UrlString
  email?: EmailString
  affiliations?: Array<ActorRef>
}

/** ActorId */
export interface ActorRef {
  id: number
}

/** ActorExternalIdDto */
export interface ActorExternalId {
  identifierService: ActorSource
  identifier: string
}

/** ActorExternalIdCore */
export interface ActorExternalIdInput {
  identifierService: ActorSourceRef
  identifier: string
}

/** ActorSourceDto */
export interface ActorSource {
  code: string
  label: string
  ord: number
  /** Replace `{source-actor-id}` with identifier. */
  urlTemplate?: UrlString
}

/** ActorSourceCore */
export interface ActorSourceInput {
  label: string
  ord?: number
  /** Must include `{source-actor-id}`. */
  urlTemplate?: UrlString
}

/** ActorSourceId */
export interface ActorSourceRef {
  code: string
}

/** ActorRoleDto */
export interface ActorRole {
  code: string
  label: string
  ord: number
}

/** ActorRoleCore */
export interface ActorRoleInput {
  label: string
  ord?: number
}

/** ActorRoleId */
export interface ActorRoleRef {
  code: string
}

/** ActorHistoryDto */
export interface ActorHistoryEntry {
  id: number
  actor: ActorInput
  dateCreated: IsoDateString
  /** JSON serialization of merged-in actor. */
  history: JsonString
}

/** SearchActor */
export interface ActorSearchResult {
  id: number
  name: string
  externalIds: Array<ActorExternalId>
  website?: UrlString
  email?: EmailString
  affiliations: Array<Actor>
}

export namespace GetActors {
  export type SearchParams = PaginatedRequest<unknown>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    actors: Array<Actor>
  }>
}

export function getActors(
  params: GetActors.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetActors.Response> {
  const url = createUrl({ pathname: '/api/actors', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetActor {
  export type PathParams = {
    id: Actor['id']
  }
  export type SearchParams = {
    /** @default false */
    items?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = Actor
}

export function getActor(
  params: GetActor.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetActor.Response> {
  const url = createUrl({ pathname: `/api/actors/${params.id}`, searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateActor {
  export type Body = ActorInput
  export type Response = Actor
}

export function createActor(
  data: CreateActor.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateActor.Response> {
  const url = createUrl({ pathname: '/api/actors' })
  const json = actorInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace UpdateActor {
  export type PathParams = {
    id: Actor['id']
  }
  export type Params = PathParams
  export type Body = ActorInput
  export type Response = Actor
}

export function updateActor(
  params: UpdateActor.Params,
  data: UpdateActor.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateActor.Response> {
  const url = createUrl({ pathname: `/api/actors/${params.id}` })
  const json = actorInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeleteActor {
  export type PathParams = {
    id: Actor['id']
  }
  export type Params = PathParams
  export type Response = void
}

export function deleteActor(
  params: DeleteActor.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteActor.Response> {
  const url = createUrl({ pathname: `/api/actors/${params.id}` })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace MergeActors {
  export type PathParams = {
    id: Actor['id']
  }
  export type SearchParams = {
    with: Array<Actor['id']>
  }
  export type Params = PathParams & SearchParams
  export type Response = Actor
}

export function mergeActors(
  params: MergeActors.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<MergeActors.Response> {
  const url = createUrl({ pathname: `/api/actors/${params.id}/merge`, searchParams: params })
  const options: RequestOptions = { ...requestOptions, method: 'post' }

  return request(url, options, auth)
}

export namespace GetActorHistory {
  export type PathParams = {
    id: Actor['id']
  }
  export type Params = PathParams
  export type Response = Array<ActorHistoryEntry>
}

/**
 * Note: This only records the history of actor *merges*, not edits.
 */
export function getActorHistory(
  params: GetActorHistory.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetActorHistory.Response> {
  const url = createUrl({ pathname: `/api/actors/${params.id}/history` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace SearchActors {
  export type SearchParams = PaginatedRequest<{
    q?: string
    'd.name'?: string
    'd.email'?: string
    'd.website'?: UrlString
    'd.external-identifier'?: string
    /** @default false */
    advanced?: boolean
  }>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    q?: string
    actors: Array<ActorSearchResult>
  }>
}

export function searchActors(
  params: SearchActors.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<SearchActors.Response> {
  const url = createUrl({ pathname: '/api/actor-search', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetActorSources {
  export type Response = Array<ActorSource>
}

export function getActorSources(
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetActorSources.Response> {
  const url = createUrl({ pathname: '/api/actor-sources' })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetActorSource {
  export type PathParams = {
    code: ActorSource['code']
  }
  export type Params = PathParams
  export type Response = ActorSource
}

export function getActorSource(
  params: GetActorSource.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetActorSource.Response> {
  const url = createUrl({ pathname: `/api/actor-sources/${params.code}` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateActorSource {
  export type Body = ActorSourceInput & { code: string }
  export type Response = ActorSource
}

export function createActorSource(
  data: CreateActorSource.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateActorSource.Response> {
  const url = createUrl({ pathname: '/api/actor-sources' })
  const json = actorSourceInputSchema.and(z.object({ code: z.string() })).parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace UpdateActorSource {
  export type PathParams = {
    code: ActorSource['code']
  }
  export type Params = PathParams
  export type Body = ActorSourceInput
  export type Response = ActorSource
}

export function updateActorSource(
  params: UpdateActorSource.Params,
  data: UpdateActorSource.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateActorSource.Response> {
  const url = createUrl({ pathname: `/api/actor-sources/${params.code}` })
  const json = actorSourceInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeleteActorSource {
  export type PathParams = {
    code: ActorSource['code']
  }
  export type Params = PathParams
  export type Response = void
}

export function deleteActorSource(
  params: DeleteActorSource.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteActorSource.Response> {
  const url = createUrl({ pathname: `/api/actor-sources/${params.code}` })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace GetActorRoles {
  export type Response = Array<ActorRole>
}

export function getActorRoles(
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetActorRoles.Response> {
  const url = createUrl({ pathname: '/api/actor-roles' })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetActorRole {
  export type PathParams = {
    code: ActorRole['code']
  }
  export type Params = PathParams
  export type Response = ActorRole
}

export function getActorRole(
  params: GetActorRole.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetActorRole.Response> {
  const url = createUrl({ pathname: `/api/actor-roles/${params.code}` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateActorRole {
  export type Body = ActorRoleInput & { code: string }
  export type Response = ActorRole
}

export function createActorRole(
  data: CreateActorRole.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateActorRole.Response> {
  const url = createUrl({ pathname: '/api/actor-roles' })
  const json = actorRoleInputSchema.and(z.object({ code: z.string() })).parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace UpdateActorRole {
  export type PathParams = {
    code: ActorRole['code']
  }
  export type Params = PathParams
  export type Body = ActorRoleInput
  export type Response = ActorRole
}

export function updateActorRole(
  params: UpdateActorRole.Params,
  data: UpdateActorRole.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateActorRole.Response> {
  const url = createUrl({ pathname: `/api/actor-roles/${params.code}` })
  const json = actorRoleInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeleteActorRole {
  export type PathParams = {
    code: ActorRole['code']
  }
  export type Params = PathParams
  export type Response = void
}

export function deleteActorRole(
  params: DeleteActorRole.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteActorRole.Response> {
  const url = createUrl({ pathname: `/api/actor-roles/${params.code}` })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}
