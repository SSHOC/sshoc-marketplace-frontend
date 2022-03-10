import { z } from 'zod'

import { propertyTypeType } from '@/data/sshoc/api/property'
import { isoDateString } from '@/data/sshoc/validation-schemas/common'
import { conceptRefSchema } from '@/data/sshoc/validation-schemas/vocabulary'

export const propertyInputConceptSchema = z.object({
  type: z.object({
    code: z.string(),
    type: z.literal('concept'),
  }),
  concept: conceptRefSchema,
  // value: z.never(),
})

export const propertyInputScalarSchema = z
  .object({
    type: z.object({
      code: z.string(),
      type: z.enum(
        propertyTypeType.filter((type) => {
          return type !== 'concept'
        }) as unknown as Exclude<typeof propertyTypeType, 'concept'>,
      ),
    }),
    // concept: z.never(),
    value: z.string(),
  })
  // TODO: Use `superRefine` to add custom errors.
  // TODO: could also add more types to discriminated union which can be checked individually,
  // e.g. { type: { type: z.literal('url') }, value: z.string().url() }
  .refine(
    (data) => {
      switch (data.type.type) {
        case 'boolean':
          return z.boolean().safeParse(data.value).success
        case 'date':
          return isoDateString.safeParse(data.value).success
        case 'float':
          return z.number().safeParse(data.value).success
        case 'int':
          return z.number().int().safeParse(data.value).success
        case 'string':
          return z.string().safeParse(data.value).success
        case 'url':
          return z.string().url().safeParse(data.value).success
        default:
          return true
      }
    },
    // FIXME: i18n (solved by using superrefine and a custom error type, i18n should be done in errormap)
    { message: 'Invalid value', path: ['value'], params: { invalidValue: true } },
  )

export const propertyInputSchema = propertyInputConceptSchema.or(propertyInputScalarSchema)

// TODO: `zod` as of v3.12 does not support nested fields as discriminator.
// z.discriminatedUnion('type.type', [propertyInputConceptSchema, propertyInputScalarSchema])

export const propertyTypeInputSchema = z.object({
  label: z.string(),
  type: z.enum(['concept', 'string', 'url', 'int', 'float', 'date', 'boolean']),
  groupName: z.string().optional(),
  hidden: z.boolean().optional(),
  ord: z.number().optional(),
  allowedVocabularies: z.array(z.string()).optional(),
})
