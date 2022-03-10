import type { ReactNode } from 'react'
import { Fragment } from 'react'

import type { UserRole } from '@/data/sshoc/api/user'
import { useCurrentUser } from '@/data/sshoc/hooks/auth'

export interface AccessControlProps {
  children?: ReactNode
  roles?: Array<UserRole>
}

export function AccessControl(props: AccessControlProps): JSX.Element {
  const { children, roles } = props

  const currentUser = useCurrentUser()

  if (currentUser.data == null) {
    return <Fragment />
  }

  if (Array.isArray(roles) && !roles.includes(currentUser.data.role)) {
    return <Fragment />
  }

  return <Fragment>{children}</Fragment>
}
