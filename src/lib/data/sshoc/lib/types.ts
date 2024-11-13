import type { RequestOptions } from '@/data/sshoc/lib/client'

export type BooleanString = 'false' | 'true'

export type IsoDateString = string

export type JsonString = string

export type UrlString = string

export type EmailString = string

export type AllowedRequestOptions = KeysAllowUndefined<Pick<RequestOptions, 'signal'>>
