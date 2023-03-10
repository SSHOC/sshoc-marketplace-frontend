import type { JwtPayload } from 'jwt-decode'
import jwtDecode from 'jwt-decode'
import { useEffect } from 'react'

import { useAuth } from '@/lib/core/auth/useAuth'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { useToast } from '@/lib/core/toast/useToast'

export function useAccessTokenExpirationTimer(): void {
  const { t, formatDateTime } = useI18n<'common'>()
  const { session } = useAuth()
  const toast = useToast()

  const { token } = session

  useEffect(() => {
    if (token == null) return

    const { exp } = jwtDecode<JwtPayload>(token)
    if (exp == null) return

    function onTokenTimeout() {
      const message = t(['common', 'token-expiration-warning'], {
        values: {
          time: formatDateTime((exp /** seconds */ as number) * 1000, { timeStyle: 'medium' }),
        },
      })
      toast.warn(message)
    }

    const warnBefore = 60 * 1000
    const delta = Math.max(exp /** seconds */ * 1000 - Date.now() - warnBefore, 0)
    const timeout = window.setTimeout(onTokenTimeout, delta)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [token, t, formatDateTime, toast])
}
