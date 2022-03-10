import { z } from 'zod'

import type { AuthData, PaginatedRequest, PaginatedResponse } from '@/data/sshoc/api/common'
import type {
  ConceptBase,
  ConceptRef,
  Vocabulary,
  VocabularyBase,
} from '@/data/sshoc/api/vocabulary'
import type { RequestOptions } from '@/data/sshoc/lib/client'
import { createUrl, request } from '@/data/sshoc/lib/client'
import type { AllowedRequestOptions } from '@/data/sshoc/lib/types'
import { propertyTypeInputSchema } from '@/data/sshoc/validation-schemas/property'

export const propertyTypeType = [
  'concept',
  'string',
  'url',
  'int',
  'float',
  'date',
  'boolean',
] as const

export type PropertyTypeType = typeof propertyTypeType[number]

export interface PropertyBase {
  type: PropertyType
}

export interface PropertyConcept extends PropertyBase {
  type: PropertyTypeConcept
  concept: ConceptBase
}

export interface PropertyScalar extends PropertyBase {
  type: PropertyTypeScalar
  value: string
}

/** PropertyDto */
export type Property = PropertyConcept | PropertyScalar

export function isPropertyConcept(property: Property): property is PropertyConcept {
  return property.type.type === 'concept'
}

export function isPropertyScalar(property: Property): property is PropertyScalar {
  return property.type.type !== 'concept'
}

interface PropertyTypeScalarRef extends PropertyTypeRef {
  type: Exclude<PropertyTypeType, 'concept'>
}

interface PropertyTypeConceptRef extends PropertyTypeRef {
  type: 'concept'
}

export interface PropertyInputBase {
  type: PropertyTypeRef
}

export interface PropertyConceptInput extends PropertyInputBase {
  type: PropertyTypeConceptRef
  concept: ConceptRef
}

export interface PropertyScalarInput extends PropertyInputBase {
  type: PropertyTypeScalarRef
  value: string
}

/** PropertyCore */
export type PropertyInput = PropertyConceptInput | PropertyScalarInput

export interface PropertyTypeBase {
  code: string
  label: string
  type: PropertyTypeType
  groupName?: string
  hidden: boolean
  ord: number
}

export interface PropertyTypeConcept extends PropertyTypeBase {
  type: 'concept'
  allowedVocabularies: Array<VocabularyBase>
}

export interface PropertyTypeScalar extends PropertyTypeBase {
  type: Exclude<PropertyTypeType, 'concept'>
  allowedVocabularies: []
}

/** PropertyTypeDto */
export type PropertyType = PropertyTypeConcept | PropertyTypeScalar

/** PropertyTypeCore */
export interface PropertyTypeInput {
  label: string
  /** Optional in PUT, required in POST. */
  type: PropertyTypeType
  groupName?: string
  hidden?: boolean
  ord?: number
  /** Currently not required when creating a concept-based property, but should be populated later. */
  allowedVocabularies: Array<Vocabulary['code']>
}

/** PropertyTypeId */
export interface PropertyTypeRef {
  code: string
}

/** PropertyTypeReorder */
export interface PropertyTypeReorder {
  code: string
  ord: number
}

/** PropertyTypesReordering */
export interface PropertyTypesReordering {
  shifts: Array<PropertyTypeReorder>
}

export namespace GetPropertyTypes {
  export type SearchParams = PaginatedRequest<{
    q?: string
  }>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    propertyTypes: Array<PropertyType>
  }>
}

export function getPropertyTypes(
  params: GetPropertyTypes.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetPropertyTypes.Response> {
  const url = createUrl({ pathname: '/api/property-types', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetPropertyType {
  export type PathParams = {
    code: string
  }
  export type Params = PathParams
  export type Response = PropertyType
}

export function getPropertyType(
  params: GetPropertyType.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetPropertyType.Response> {
  const url = createUrl({ pathname: `/api/property-types/${params.code}` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreatePropertyType {
  export type Body = PropertyTypeInput & { code: string }
  export type Response = PropertyType
}

export function createPropertyType(
  data: CreatePropertyType.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreatePropertyType.Response> {
  const url = createUrl({ pathname: '/api/property-types' })
  const json = propertyTypeInputSchema.and(z.object({ code: z.string() })).parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace UpdatePropertyType {
  export type PathParams = {
    code: string
  }
  export type Params = PathParams
  export type Body = PropertyTypeInput
  export type Response = PropertyType
}

export function updatePropertyType(
  params: UpdatePropertyType.Params,
  data: UpdatePropertyType.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdatePropertyType.Response> {
  const url = createUrl({ pathname: `/api/property-types/${params.code}` })
  const json = propertyTypeInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace DeletePropertyType {
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

export function deletePropertyType(
  params: DeletePropertyType.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<DeletePropertyType.Response> {
  const url = createUrl({ pathname: `/api/property-types/${params.code}`, searchParams: params })
  const options: RequestOptions = { ...requestOptions, method: 'delete', responseType: 'void' }

  return request(url, options, auth)
}

export namespace ReorderPropertyTypes {
  export type Body = PropertyTypesReordering
  export type Response = void
}

export function reorderPropertyTypes(
  data: ReorderPropertyTypes.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<ReorderPropertyTypes.Response> {
  const url = createUrl({ pathname: '/api/property-types/reorder' })
  const options: RequestOptions = {
    ...requestOptions,
    method: 'post',
    json: data,
    responseType: 'void',
  }

  return request(url, options, auth)
}
