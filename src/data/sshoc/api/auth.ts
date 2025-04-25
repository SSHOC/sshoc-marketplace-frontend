import type { AuthData } from '@/data/sshoc/api/common'
import type { User } from '@/data/sshoc/api/user'
import type { RequestOptions } from '@/data/sshoc/lib/client'
import { createUrl, request } from '@/data/sshoc/lib/client'
import type { AllowedRequestOptions } from '@/data/sshoc/lib/types'

/** LoginData */
export interface SignInInput {
  username: string
  password: string
}

/** ImplicitGrantTokenData */
export interface ImplicitGrantTokenInput {
  token: string
  registration: boolean
}

/** OAuthRegistrationDto */
export interface OAuthRegistration {
  id: number
  displayName: string
  email: string
}

/** OAuthRegistrationData */
export interface OAuthRegistrationInput {
  id: number
  displayName: string
  email: string
  acceptedRegulations: boolean
}

export interface AccessToken {
  token: string | null
}

export interface RegistrationToken {
  token: string | null
}

export namespace SignInUser {
  export type Body = SignInInput
  export type Response = AccessToken
}

export async function signInUser(
  data: SignInUser.Body,
  requestOptions?: AllowedRequestOptions,
): Promise<SignInUser.Response> {
  const url = createUrl({ pathname: '/api/auth/sign-in' })
  const options: RequestOptions = {
    ...requestOptions,
    method: 'post',
    json: data,
    responseType: undefined,
  }

  const response = await request(url, options)
  const token = response.headers.get('authorization')

  return { token }
}

export namespace GetCurrentUser {
  export type Response = User
}

export function getCurrentUser(
  auth: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<GetCurrentUser.Response> {
  const url = createUrl({ pathname: '/api/auth/me' })
  const options: RequestOptions = { ...requestOptions }

  return request(url, options, auth)
}

export namespace AuthorizeWithEosc {
  export interface SearchParams {
    successUrl: URL
    registrationUrl: URL
    errorUrl: URL
  }
  export type Params = SearchParams
}

export function authorizeWithEosc(params: AuthorizeWithEosc.Params): void {
  const url = createUrl({
    pathname: '/oauth2/authorize/eosc',
    searchParams: {
      'success-redirect-url': String(params.successUrl),
      'registration-redirect-url': String(params.registrationUrl),
      'failure-redirect-url': String(params.errorUrl),
    },
  })

  /** Kick off redirect. */
  window.location.assign(url)
}

export type SignInResponse = AccessToken & { registration: false }
export type SignUpResponse = OAuthRegistration & RegistrationToken & { registration: true }

export namespace ValidateOAuthToken {
  export type Body = ImplicitGrantTokenInput
  export type Response = SignInResponse | SignUpResponse
}

export async function validateOAuthToken(
  data: ValidateOAuthToken.Body,
  requestOptions?: AllowedRequestOptions,
): Promise<ValidateOAuthToken.Response> {
  const url = createUrl({ pathname: '/api/oauth/token' })
  const options: RequestOptions = {
    ...requestOptions,
    method: 'put',
    json: data,
    responseType: undefined,
  }

  const response = await request(url, options)
  const token = response.headers.get('authorization')
  if (data.registration) {
    const registrationData = await response.json()
    return { ...registrationData, token, registration: true }
  } else {
    return { token, registration: false }
  }
}

export namespace SignUpUser {
  export type Body = DeepNonNullable<RegistrationToken> & OAuthRegistrationInput
  export type Response = AccessToken & User
}

export async function signUpUser(
  data: SignUpUser.Body,
  requestOptions?: AllowedRequestOptions,
): Promise<SignUpUser.Response> {
  const url = createUrl({ pathname: '/api/oauth/sign-up' })
  const options: RequestOptions = {
    ...requestOptions,
    method: 'put',
    json: data,
    responseType: undefined,
    headers: { authorization: data.token },
  }

  const response = await request(url, options)
  const token = data.token
  const userData = await response.json()

  return { ...userData, token }
}
