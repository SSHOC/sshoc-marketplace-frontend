/**
 * Endpoints not documented in sshoc openapi document.
 */

/* eslint-disable @typescript-eslint/no-namespace */

import type { MutationConfig, MutationResultPair } from 'react-query'
import { useMutation } from 'react-query'
import type { ImplicitGrantTokenData, OAuthRegistrationDto } from '@/api/sshoc'
import { request } from '@/api/sshoc'

/**
 * Sign in user with username and password.
 *
 * If successful, a JWT will be returned in the Authorization header.
 */

export type LoginData = {
  username: string
  password: string
}

export namespace SignInUser {
  export namespace Response {
    export type Success = { token: string | null }
    export type Error = unknown
  }
  export type RequestBody = LoginData
}

export function signInUser([body]: [body: SignInUser.RequestBody]): Promise<
  SignInUser.Response.Success
> {
  return request({
    path: '/api/auth/sign-in',
    options: {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    hooks: {
      async response(response: Response) {
        const token = response.headers.get('authorization')
        return { token }
      },
    },
  })
}

export function useSignInUser(
  config?: MutationConfig<
    SignInUser.Response.Success,
    SignInUser.Response.Error,
    [SignInUser.RequestBody],
    unknown
  >,
): MutationResultPair<
  SignInUser.Response.Success,
  SignInUser.Response.Error,
  [SignInUser.RequestBody],
  unknown
> {
  return useMutation(signInUser, config)
}

/**
 * Validate eosc auth code for returning user.
 *
 * The token validation endpoint is overloaded and returns either nothing,
 * or user registration info, depending on the value of `registration` in the request body.
 *
 * Use `useValidateImplicitGrantTokenWithRegistration` from the auto-generated client for first-time users.
 */

export namespace ValidateImplicitGrantTokenWithoutRegistration {
  export namespace Response {
    export type Success = { token: string | null }
    export type Error = unknown
  }
  export type RequestBody = ImplicitGrantTokenData & { registration: false }
}

export async function validateImplicitGrantTokenWithoutRegistration([body]: [
  body: ValidateImplicitGrantTokenWithoutRegistration.RequestBody,
]): Promise<ValidateImplicitGrantTokenWithoutRegistration.Response.Success> {
  return request({
    path: `/api/oauth/token`,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    hooks: {
      async response(response: Response) {
        const token = response.headers.get('authorization')
        return { token }
      },
    },
  })
}

export function useValidateImplicitGrantTokenWithoutRegistration(
  config?: MutationConfig<
    ValidateImplicitGrantTokenWithoutRegistration.Response.Success,
    ValidateImplicitGrantTokenWithoutRegistration.Response.Error,
    [ValidateImplicitGrantTokenWithoutRegistration.RequestBody],
    unknown
  >,
): MutationResultPair<
  ValidateImplicitGrantTokenWithoutRegistration.Response.Success,
  ValidateImplicitGrantTokenWithoutRegistration.Response.Error,
  [ValidateImplicitGrantTokenWithoutRegistration.RequestBody],
  unknown
> {
  return useMutation(validateImplicitGrantTokenWithoutRegistration, config)
}
/**
 * Validate eosc auth code for first-time user.
 *
 * The token validation endpoint is overloaded and returns either nothing,
 * or user registration info, depending on the value of `registration` in the request body.
 *
 * Use `validateImplicitGrantTokenWithoutRegistration` from the auto-generated client for returning users.
 */

export namespace ValidateImplicitGrantTokenWithRegistration {
  export namespace Response {
    export type Success = OAuthRegistrationDto & { token: string | null }
    export type Error = unknown
  }
  export type RequestBody = ImplicitGrantTokenData & { registration: true }
}

export async function validateImplicitGrantTokenWithRegistration([body]: [
  body: ValidateImplicitGrantTokenWithRegistration.RequestBody,
]): Promise<ValidateImplicitGrantTokenWithRegistration.Response.Success> {
  return request({
    path: `/api/oauth/token`,
    options: {
      method: 'put',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    hooks: {
      async response(response: Response) {
        const token = response.headers.get('authorization')
        const data = await response.json()
        return { ...data, token }
      },
    },
  })
}

export function useValidateImplicitGrantTokenWithRegistration(
  config?: MutationConfig<
    ValidateImplicitGrantTokenWithRegistration.Response.Success,
    ValidateImplicitGrantTokenWithRegistration.Response.Error,
    [ValidateImplicitGrantTokenWithRegistration.RequestBody],
    unknown
  >,
): MutationResultPair<
  ValidateImplicitGrantTokenWithRegistration.Response.Success,
  ValidateImplicitGrantTokenWithRegistration.Response.Error,
  [ValidateImplicitGrantTokenWithRegistration.RequestBody],
  unknown
> {
  return useMutation(validateImplicitGrantTokenWithRegistration, config)
}
