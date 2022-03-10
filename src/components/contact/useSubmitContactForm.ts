import { request } from '@stefanprobst/request'
import type { UseMutationOptions } from 'react-query'
import { useMutation } from 'react-query'

import type { RequestOptions } from '@/data/sshoc/lib/client'
import { createSiteUrl } from '@/lib/utils'

export interface ContactFormData {
  email: string
  subject: string
  message: string
}

/* eslint-disable-next-line @typescript-eslint/no-namespace */
export namespace SubmitContactForm {
  export type Body = ContactFormData
  export type Variables = { data: Body }
  export type Response = void
}

export function submitContactForm(
  data: SubmitContactForm.Body,
  requestOptions?: { signal?: AbortSignal | null | undefined },
): Promise<SubmitContactForm.Response> {
  const url = createSiteUrl({ pathname: '/api/contact' })
  const options: RequestOptions = { ...requestOptions, method: 'post', json: data }

  return request(url, options)
}

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useSubmitContactForm(
  options?: UseMutationOptions<SubmitContactForm.Response, Error, SubmitContactForm.Variables>,
) {
  return useMutation(({ data }: SubmitContactForm.Variables) => {
    return submitContactForm(data)
  }, options)
}
