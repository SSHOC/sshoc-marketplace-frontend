import { z } from 'zod'

export const oAuthRegistrationInputSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  acceptedRegulations: z.boolean(),
})
