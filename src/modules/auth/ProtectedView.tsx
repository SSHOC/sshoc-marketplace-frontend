import type { PropsWithChildren } from 'react'
import { Fragment } from 'react'

import { useGetLoggedInUser } from '@/api/sshoc'
import { useAuth } from '@/modules/auth/AuthContext'

export default function ProtectedView({
  children,
  roles,
}: PropsWithChildren<{
  roles?: Array<'contributor' | 'moderator' | 'administrator'>
}>): JSX.Element | null {
  const { session } = useAuth()
  const user = useGetLoggedInUser(
    { enabled: session?.accessToken != null },
    { token: session?.accessToken },
  )

  if (session === null) return null

  if (Array.isArray(roles)) {
    const role = user.data?.role
    if (role == null || !(roles as Array<string>).includes(role)) return null
  }

  return <Fragment>{children}</Fragment>
}
