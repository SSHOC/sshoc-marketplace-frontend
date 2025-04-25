import { z } from 'zod'

export const sourceRefSchema = z.object({
  id: z.number(),
})

export const sourceInputSchema = z
  .object({
    label: z.string().min(1),
    url: z.string().url(),
    urlTemplate: z.string().url(),
  })
  .refine(
    (data) => {
      if (!data.urlTemplate.includes('{source-item-id}')) {return false}
      return true
    },
    {
      message: 'Must include "{source-item-id}"',
      path: ['urlTemplate'],
      params: { code: 'missingSourceItemId' },
    },
  )
