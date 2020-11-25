import type { PropsWithChildren } from 'react'
import { Fragment } from 'react'
import { useAuth } from '@/modules/auth/AuthContext'

export default function ProtectedView({
  children,
}: PropsWithChildren<unknown>): JSX.Element | null {
  const { session } = useAuth()

  if (session === null) return null

  return <Fragment>{children}</Fragment>
}
