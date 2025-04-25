import type { ReactNode } from 'react'
import { Fragment } from 'react'

import type { UserRole } from '@/data/sshoc/api/user'
import { useCurrentUser } from '@/data/sshoc/hooks/auth'

export interface AccessControlProps {
  children?: ReactNode
  roles?: Array<UserRole>
}

export function AccessControl(props: AccessControlProps): JSX.Element | null {
  const { children, roles } = props

  const currentUser = useCurrentUser()

  if (currentUser.data == null) {
    return null
  }

  if (Array.isArray(roles) && !roles.includes(currentUser.data.role)) {
    return null
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment>{children}</Fragment>
}
