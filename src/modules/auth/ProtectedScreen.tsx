import { useRouter } from 'next/router'
import { Fragment, useEffect } from 'react'
import type { PropsWithChildren } from 'react'
import { useAuth } from '@/modules/auth/AuthContext'

export default function ProtectedScreen({
  children,
}: PropsWithChildren<unknown>): JSX.Element | null {
  const router = useRouter()
  const { session } = useAuth()

  useEffect(() => {
    if (session === null) {
      router.replace({
        pathname: '/auth/sign-in',
        query: { from: router.asPath },
      })
    }
  }, [session, router])

  /**
   * avoid flash of content, because the router (for redirecting) is only available on the client
   */
  if (session === null) return null

  return <Fragment>{children}</Fragment>
}
