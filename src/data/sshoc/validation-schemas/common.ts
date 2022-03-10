import { z } from 'zod'

export const isoDateString = z.preprocess((arg: unknown) => {
  return typeof arg === 'string' ? new Date(arg) : undefined
}, z.date())

export const numberString = z.preprocess((arg: unknown) => {
  return typeof arg === 'string' && arg.length > 0 ? Number(arg) : undefined
}, z.number())
