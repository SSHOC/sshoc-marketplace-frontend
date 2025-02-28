import { z } from 'zod'

const dateFormat = /\d{4}-\d{2}-\d{2}/
export const isoDateString = z.preprocess((arg: unknown) => {
  return typeof arg === 'string' && dateFormat.test(arg) ? new Date(arg) : undefined
}, z.date())

export const numberString = z.preprocess((arg: unknown) => {
  return typeof arg === 'string' && arg.length > 0 ? Number(arg) : undefined
}, z.number())

export const integerString = z.preprocess((arg: unknown) => {
  return typeof arg === 'string' && arg.length > 0 ? Number(arg) : undefined
}, z.number().int())

export const booleanString = z.preprocess((arg: unknown) => {
  return typeof arg === 'string'
    ? arg === 'TRUE'
      ? true
      : arg === 'FALSE'
        ? false
        : undefined
    : undefined
}, z.boolean())
