import type { AuthData } from '@/data/sshoc/api/common'
import { useAuth } from '@/lib/core/auth/useAuth'

export function useSession(auth: AuthData | undefined): AuthData | { token: null } {
  const { session } = useAuth()

  if (auth != null) return auth

  return session.status === 'signedIn' ? { token: session.token } : { token: null }
}
