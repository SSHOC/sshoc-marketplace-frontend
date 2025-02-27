import { z } from 'zod'

import type {
  AuthData,
  FacetValue,
  PaginatedRequest,
  PaginatedResponse,
} from '@/data/sshoc/api/common'
import type { PropertyTypeRef } from '@/data/sshoc/api/property'
import type { RequestOptions } from '@/data/sshoc/lib/client'
import { createUrl, request } from '@/data/sshoc/lib/client'
import type { AllowedRequestOptions, BooleanString, UrlString } from '@/data/sshoc/lib/types'
import { conceptInputSchema } from '@/data/sshoc/validation-schemas/vocabulary'

export const conceptSortOrders = ['score', 'label'] as const

export type ConceptSortOrder = (typeof conceptSortOrders)[number]

export function isConceptSortOrder(sortOrder: string): sortOrder is ConceptSortOrder {
  return conceptSortOrders.includes(sortOrder as ConceptSortOrder)
}

/** VocabularyBasicDto */
export interface VocabularyBase {
  code: string
  label: string
  accessibleAt?: UrlString
  /** Should always be included in `VocabularyBase`, except it is omitted in `GetVocabularies.Response`. */
  scheme?: string
  namespace?: string
  closed: boolean
}

/** VocabularyDto */
export interface Vocabulary extends VocabularyBase {
  description?: string
  conceptResults: PaginatedResponse<{ concepts: Array<Concept> }>
}

/** VocabularyId */
export interface VocabularyRef {
  code: string
}

/** ConceptBasicDto */
export interface ConceptBase {
  code: string
  vocabulary: VocabularyBase
  label: string
  notation: string
  definition?: string
  uri: UrlString
  candidate: boolean
}

/** ConceptDto */
export interface Concept {
  code: string
  vocabulary: VocabularyBase
  label: string
  notation: string
  definition?: string
  uri: UrlString
  candidate: boolean
  relatedConcepts: Array<RelatedConcept>
}

/** ConceptCore */
export interface ConceptInput {
  label: string
  notation?: string
  definition?: string
  uri?: UrlString
  relatedConcepts?: Array<RelatedConceptInput>
}

/** ConceptId */
export interface ConceptRef {
  /** Not actually required, even though it is in the OpenAPI schema. */
  // code: string
  /** Not actually required, even though it is in the OpenAPI schema. */
  // vocabulary: VocabularyRef
  uri: UrlString
}

/** RelatedConceptDto */
export interface RelatedConcept {
  code: string
  vocabulary: VocabularyBase
  label: string
  notation: string
  definition?: string
  uri: UrlString
  relation: ConceptRelation
  candidate: boolean
}

export interface RelatedConceptInput {
  code: string
  vocabulary: VocabularyRef
  uri?: UrlString
  relation: ConceptRelationRef
}

/** ConceptRelationDto */
export interface ConceptRelation {
  code: string
  label: string
}

/** ConceptRelationId */
export interface ConceptRelationRef {
  code: string
}

/** SearchConcept */
export interface ConceptSearchResult {
  code: string
  vocabulary: VocabularyRef
  label: string
  notation: string
  definition?: string
  uri: UrlString
  types: Array<PropertyTypeRef>
  candidate: boolean
}

export namespace GetVocabularies {
  export type SearchParams = PaginatedRequest<unknown>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    vocabularies: Array<VocabularyBase>
  }>
}

export function getVocabularies(
  params: GetVocabularies.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetVocabularies.Response> {
  const url = createUrl({ pathname: '/api/vocabularies', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetVocabulary {
  export type PathParams = {
    code: string
  }
  export type SearchParams = PaginatedRequest<unknown>
  export type Params = PathParams & SearchParams
  export type Response = Vocabulary
}

export function getVocabulary(
  params: GetVocabulary.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetVocabulary.Response> {
  const url = createUrl({ pathname: `/api/vocabularies/${params.code}`, searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateVocabulary {
  export type SearchParams = {
    /** @default false */
    query?: boolean
  }
  export type Params = SearchParams
  /** FormData<{ ttl: File }> */
  export type Body = FormData
  export type Response = VocabularyBase
}

export function createVocabulary(
  params: CreateVocabulary.Params,
  data: CreateVocabulary.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateVocabulary.Response> {
  const url = createUrl({ pathname: '/api/vocabularies', searchParams: params })
  const options: RequestOptions = { ...requestOptions, method: 'post', body: data }

  return request(url, options, auth)
}

export namespace UpdateVocabulary {
  export type PathParams = {
    code: string
  }
  export type SearchParams = {
    /** @default false */
    force?: boolean
    /** @default false */
    closed?: boolean
  }
  export type Params = PathParams & SearchParams
  /** FormData<{ ttl: File }> */
  export type Body = FormData
  export type Response = VocabularyBase
}

export function updateVocabulary(
  params: UpdateVocabulary.Params,
  data: UpdateVocabulary.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateVocabulary.Response> {
  const url = createUrl({ pathname: `/api/vocabularies/${params.code}`, searchParams: params })
  const options: RequestOptions = { ...requestOptions, method: 'put', body: data }

  return request(url, options, auth)
}

export namespace DeleteVocabulary {
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

export function deleteVocabulary(
  params: DeleteVocabulary.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteVocabulary.Response> {
  const url = createUrl({ pathname: `/api/vocabularies/${params.code}`, searchParams: params })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace SetVocabularyOpen {
  export type PathParams = {
    code: string
  }
  export type Params = PathParams
  export type Response = VocabularyBase
}

export function setVocabularyOpen(
  params: SetVocabularyOpen.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<SetVocabularyOpen.Response> {
  const url = createUrl({ pathname: `/api/vocabularies/${params.code}/open` })
  const options: RequestOptions = { ...requestOptions, method: 'put' }

  return request(url, options, auth)
}

export namespace SetVocabularyClosed {
  export type PathParams = {
    code: string
  }
  export type Params = PathParams
  export type Response = VocabularyBase
}

export function setVocabularyClosed(
  params: SetVocabularyClosed.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<SetVocabularyClosed.Response> {
  const url = createUrl({ pathname: `/api/vocabularies/${params.code}/close` })
  const options: RequestOptions = { ...requestOptions, method: 'put' }

  return request(url, options, auth)
}

export namespace GetConcept {
  export type PathParams = {
    vocabularyCode: string
    code: string
  }
  export type Params = PathParams
  export type Response = Concept
}

export function getConcept(
  params: GetConcept.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetConcept.Response> {
  const url = createUrl({
    pathname: `/api/vocabularies/${params.vocabularyCode}/concepts/${params.code}`,
  })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateConcept {
  export type PathParams = {
    vocabularyCode: string
  }
  export type SearchParams = {
    /** @default true */
    candidate?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Body = ConceptInput & { code: string }
  export type Response = Concept
}

export function createConcept(
  params: CreateConcept.Params,
  data: CreateConcept.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateConcept.Response> {
  const url = createUrl({
    pathname: `/api/vocabularies/${params.vocabularyCode}/concepts`,
    searchParams: params,
  })
  const json = conceptInputSchema.and(z.object({ code: z.string() })).parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace UpdateConcept {
  export type PathParams = {
    vocabularyCode: string
    code: string
  }
  export type Params = PathParams
  export type Body = ConceptInput
  export type Response = Concept
}

export function updateConcept(
  params: UpdateConcept.Params,
  data: UpdateConcept.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateConcept.Response> {
  const url = createUrl({
    pathname: `/api/vocabularies/${params.vocabularyCode}/concepts/${params.code}`,
  })
  const json = conceptInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeleteConcept {
  export type PathParams = {
    vocabularyCode: string
    code: string
  }
  export type SearchParams = {
    /** @default false */
    force?: boolean
  }
  export type Params = PathParams & SearchParams
  export type Response = void
}

export function deleteConcept(
  params: DeleteConcept.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeleteConcept.Response> {
  const url = createUrl({
    pathname: `/api/vocabularies/${params.vocabularyCode}/concepts/${params.code}`,
    searchParams: params,
  })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export const rejectSuggestedConcept = deleteConcept

export namespace CommitSuggestedConcept {
  export type PathParams = {
    vocabularyCode: string
    code: string
  }
  export type Params = PathParams
  export type Response = Concept
}

export function commitSuggestedConcept(
  params: CommitSuggestedConcept.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CommitSuggestedConcept.Response> {
  const url = createUrl({
    pathname: `/api/vocabularies/${params.vocabularyCode}/concepts/${params.code}/commit`,
  })
  const options: RequestOptions = { ...requestOptions, method: 'put' }

  return request(url, options, auth)
}

export const approveSuggestedConcept = commitSuggestedConcept

export namespace MergeConcepts {
  export type PathParams = {
    vocabularyCode: string
    code: string
  }
  export type SearchParams = {
    with: Array<string>
  }
  export type Params = PathParams & SearchParams
  export type Response = Concept
}

export function mergeConcepts(
  params: MergeConcepts.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<MergeConcepts.Response> {
  const url = createUrl({
    pathname: `/api/vocabularies/${params.vocabularyCode}/concepts/${params.code}/merge`,
  })
  const options: RequestOptions = { ...requestOptions, method: 'post' }

  return request(url, options, auth)
}

export namespace GetConceptRelations {
  export type Response = Array<ConceptRelation>
}

export function getConceptRelations(
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetConceptRelations.Response> {
  const url = createUrl({ pathname: '/api/concept-relations' })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace SearchConcepts {
  export type SearchParams = PaginatedRequest<{
    q?: string
    order?: ConceptSortOrder
    types?: Array<string>
    'f.candidate'?: Array<BooleanString>
    /** @default false */
    advanced?: boolean
  }>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    q?: string
    concepts: Array<ConceptSearchResult>
    types: Record<string, FacetValue<{ code: string; label: string }>>
    facets: Record<string, Record<string, FacetValue<unknown>>>
  }>
}

export function searchConcepts(
  params: SearchConcepts.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<SearchConcepts.Response> {
  const url = createUrl({ pathname: '/api/concept-search', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}
