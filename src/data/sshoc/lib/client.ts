import type {
  AfterResponseHook,
  BeforeRequestHook,
  RequestOptions,
  UrlInit,
} from '@stefanprobst/request'
import { createUrl as _createUrl, request as _request } from '@stefanprobst/request'

import type { AuthData } from '@/data/sshoc/api/common'
import { baseUrl } from '~/config/sshoc.config'

const defaultReponseType = 'json' as const

export const createUrl = (init: Omit<UrlInit, 'baseUrl'>): URL => {
  return _createUrl({ baseUrl, ...init })
}

export const request = (
  input: Request | URL,
  init: RequestOptions,
  auth?: AuthData,
): ReturnType<typeof _request> => {
  const options = { responseType: defaultReponseType, ...init, auth }

  /**
   * Avoid sending empty query params.
   * `request` will filter out nullish values and empty arrays, but not empty strings.
   * We do this mostly, because the backend currently crashes when we send empty query
   * params on a dynamic property query.
   */
  if (input instanceof URL) {
    const searchParams = new URLSearchParams(input.searchParams)
    searchParams.forEach((value, key) => {
      if (value === '') {
        input.searchParams.delete(key)
      }
    })
  }

  return _request(input, options)
}

export type { AfterResponseHook, BeforeRequestHook, RequestOptions }

// TODO: `useRequest` which adds token from auth context provider,
// to avoid manually adding the token in every single hook.
