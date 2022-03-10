import type { RequestOptions } from '@stefanprobst/request'
import { createUrl, request } from '@stefanprobst/request'

import { baseUrl } from '~/config/site.config'

/* eslint-disable-next-line @typescript-eslint/no-namespace */
export namespace Revalidate {
  export type Body = { pathname: string }
  export type Variables = { data: Body }
  export type Response = void
}

export async function revalidate(data: Revalidate.Body): Promise<Revalidate.Response> {
  const url = createUrl({ pathname: '/api/revalidate', baseUrl })
  const options: RequestOptions = { method: 'put', json: data }

  return request(url, options)
}
