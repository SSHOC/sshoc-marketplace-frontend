import { useContext } from 'react'

import type { AuthService } from '@/lib/core/auth/AuthProvider'
import { AuthContext } from '@/lib/core/auth/AuthProvider'
import { assert } from '@/lib/utils'

export function useAccessToken(): AuthService['session']['token'] {
  const value = useContext(AuthContext)

  assert(value != null, '`useAccessToken` must be nested inside an `AuthProvider`.')

  return value.session.token
}
