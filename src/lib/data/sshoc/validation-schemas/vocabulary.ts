import { z } from 'zod'

export const conceptRelationRefSchema = z.object({
  code: z.string(),
})

export const vocabularyRefSchema = z.object({
  code: z.string(),
})

export const conceptRefSchema = z.object({
  // code: z.string(),
  // vocabulary: vocabularyRefSchema,
  /** This is not necessarily a valid URL. */
  uri: z.string(),
})

export const relatedConceptInputSchema = z.object({
  code: z.string(),
  vocabulary: vocabularyRefSchema,
  uri: z.string().url().optional(),
  relation: conceptRelationRefSchema,
})

export const conceptInputSchema = z.object({
  label: z.string().min(1),
  notation: z.string().optional(),
  definition: z.string().optional(),
  uri: z.string().url().optional(),
  relatedConcepts: z.array(relatedConceptInputSchema).optional(),
})
