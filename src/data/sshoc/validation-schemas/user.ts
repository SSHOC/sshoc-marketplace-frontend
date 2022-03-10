import { z } from 'zod'

/**
 * Avoid circular dependency.
 */
// import { userRoles } from '@/data/sshoc/api/user'
const userRoles = [
  'contributor',
  'system-contributor',
  'moderator',
  'system-moderator',
  'administrator',
] as const

export const userInputSchema = z.object({
  username: z.string(),
  displayName: z.string(),
  password: z.string(),
  role: z.enum(userRoles).optional(),
  email: z.string().email(),
})

export const userDisplayNameInputSchema = z.object({
  displayName: z.string().optional(),
})

export const userNewPasswordInputSchema = z.object({
  newPassword: z.string(),
  verifiedPassword: z.string(),
  currentPassword: z.string(),
})
