import type { AuthData, PaginatedRequest, PaginatedResponse } from '@/data/sshoc/api/common'
import type { RequestOptions } from '@/data/sshoc/lib/client'
import { createUrl, request } from '@/data/sshoc/lib/client'
import type { AllowedRequestOptions, IsoDateString } from '@/data/sshoc/lib/types'
import {
  userDisplayNameInputSchema,
  userInputSchema,
  userNewPasswordInputSchema,
} from '@/data/sshoc/validation-schemas/user'

export const userStatus = ['during-registration', 'enabled', 'locked'] as const

export type UserStatus = (typeof userStatus)[number]

export const userRoles = [
  'contributor',
  'system-contributor',
  'moderator',
  'system-moderator',
  'administrator',
] as const

export type UserRole = (typeof userRoles)[number]

export const userSortOrders = ['username', 'date'] as const

export type UserSortOrder = (typeof userSortOrders)[number]

export function isUserSortOrder(sortOrder: string): sortOrder is UserSortOrder {
  return userSortOrders.includes(sortOrder as UserSortOrder)
}

/** UserDto */
export interface User {
  id: number
  username: string
  displayName: string
  status: UserStatus
  registrationDate: IsoDateString
  role: UserRole
  email: string
  config: boolean
}

/** UserCore */
export interface UserInput {
  username: string
  displayName: string
  password: string
  /** @default 'contributor' */
  role?: UserRole
  email: string
}

/** UserDisplayNameCore */
export interface UserDisplayNameInput {
  displayName?: string
}

/** NewPasswordData */
export interface UserNewPasswordInput {
  newPassword: string
  verifiedPassword: string
  currentPassword: string
}

export namespace GetUsers {
  export type SearchParams = PaginatedRequest<{
    q?: string
    order?: UserSortOrder
  }>
  export type Params = SearchParams
  export type Response = PaginatedResponse<{
    users: Array<User>
  }>
}

export function getUsers(
  params: GetUsers.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetUsers.Response> {
  const url = createUrl({ pathname: '/api/users', searchParams: params })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace GetUser {
  export type PathParams = {
    id: number
  }
  export type Params = PathParams
  export type Response = User
}

export function getUser(
  params: GetUser.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetUser.Response> {
  const url = createUrl({ pathname: `/api/users/${params.id}` })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace CreateUser {
  export type Body = UserInput
  export type Response = User
}

export function createUser(
  data: CreateUser.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<CreateUser.Response> {
  const url = createUrl({ pathname: '/api/users' })
  const json = userInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'post', json }

  return request(url, options, auth)
}

export namespace UpdateUserDisplayName {
  export type PathParams = {
    id: number
  }
  export type Params = PathParams
  export type Body = UserDisplayNameInput
  export type Response = User
}

export function updateUserDisplayName(
  params: UpdateUserDisplayName.Params,
  data: UpdateUserDisplayName.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateUserDisplayName.Response> {
  const url = createUrl({ pathname: `/api/users/${params.id}/display-name` })
  const json = userDisplayNameInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace UpdateUserPassword {
  export type PathParams = {
    id: number
  }
  export type Params = PathParams
  export type Body = UserNewPasswordInput
  export type Response = User
}

export function updateUserPassword(
  params: UpdateUserPassword.Params,
  data: UpdateUserPassword.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateUserPassword.Response> {
  const url = createUrl({ pathname: `/api/users/${params.id}/password` })
  const json = userNewPasswordInputSchema.parse(data)
  const options: RequestOptions = { ...requestOptions, method: 'put', json }

  return request(url, options, auth)
}

export namespace UpdateUserRole {
  export type PathParams = {
    id: number
    role: UserRole
  }
  export type Params = PathParams
  export type Response = User
}

export function updateUserRole(
  params: UpdateUserRole.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateUserRole.Response> {
  const url = createUrl({ pathname: `/api/users/${params.id}/role/${params.role}` })
  const options: RequestOptions = { ...requestOptions, method: 'put' }

  return request(url, options, auth)
}

export namespace UpdateUserStatus {
  export type PathParams = {
    id: number
    status: UserStatus
  }
  export type Params = PathParams
  export type Response = User
}

export function updateUserStatus(
  params: UpdateUserStatus.Params,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UpdateUserStatus.Response> {
  const url = createUrl({ pathname: `/api/users/${params.id}/status/${params.status}` })
  const options: RequestOptions = { ...requestOptions, method: 'put' }

  return request(url, options, auth)
}
