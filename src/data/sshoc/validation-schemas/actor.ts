import { z } from 'zod'

export const actorRefSchema = z.object({
  id: z.number(),
})

export const actorSourceRefSchema = z.object({
  code: z.string(),
})

export const actorRoleRefSchema = z.object({
  code: z.string(),
})

export const actorExternalIdInputSchema = z.object({
  identifierService: actorSourceRefSchema,
  identifier: z.string(),
})

export const actorInputSchema = z.object({
  name: z.string(),
  externalIds: z.array(actorExternalIdInputSchema).optional(),
  website: z.string().url().optional(),
  email: z.string().email().optional(),
  affiliations: z.array(actorRefSchema).optional(),
})

export const actorSourceInputSchema = z
  .object({
    label: z.string(),
    ord: z.number().optional(),
    urlTemplate: z.string().url().optional(),
  })
  .refine(
    (data) => {
      if (`urlTemplate` in data && data.urlTemplate != null) {
        if (!data.urlTemplate.includes('{source-actor-id}')) return false
      }
      return true
    },
    {
      message: 'Must include "{source-actor-id}"',
      path: ['urlTemplate'],
      params: { code: 'missingSourceActorId' },
    },
  )

export const actorRoleInputSchema = z.object({
  label: z.string(),
  ord: z.number().optional(),
})
