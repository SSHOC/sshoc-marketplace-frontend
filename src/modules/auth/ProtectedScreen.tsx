import { useRouter } from 'next/router'
import type { PropsWithChildren } from 'react'
import { Fragment, useEffect } from 'react'

import type { UserDto } from '@/api/sshoc'
import { useCurrentUser } from '@/api/sshoc/client'
import { useAuth } from '@/modules/auth/AuthContext'

export default function ProtectedScreen({
  children,
  roles,
}: PropsWithChildren<{
  roles?: Array<'contributor' | 'moderator' | 'administrator'>
}>): JSX.Element | null {
  const router = useRouter()
  const { session, hasCheckedLocalStorage } = useAuth()
  const user = useCurrentUser()

  useEffect(() => {
    if (!hasCheckedLocalStorage) return

    if (
      session === null ||
      user.status === 'error' ||
      (user.status === 'success' && !hasAppropriateRole(roles, user.data))
    ) {
      router.replace({
        pathname: '/auth/sign-in',
        query: { from: router.asPath },
      })
    }
  }, [roles, user.status, user.data, session, hasCheckedLocalStorage, router])

  /**
   * avoid flash of content, because the router (for redirecting) is only available on the client
   */
  if (session === null || !hasAppropriateRole(roles, user.data)) return null

  return <Fragment>{children}</Fragment>
}

function hasAppropriateRole(
  roles?: Array<'contributor' | 'moderator' | 'administrator'>,
  user?: UserDto,
) {
  if (Array.isArray(roles)) {
    const role = user?.role
    if (role == null || !(roles as Array<string>).includes(role)) return false
  }

  return true
}
