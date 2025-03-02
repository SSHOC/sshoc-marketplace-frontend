import { useError } from '@stefanprobst/next-error-boundary'
import { HttpError } from '@stefanprobst/request'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { SignInForm } from '@/components/auth/SignInForm'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { AuthorizationError } from '@/lib/core/error/AuthorizationError'
import { useTranslations } from 'next-intl'
import { FullPage } from '@/lib/core/ui/FullPage/FullPage'

export function RootErrorFallback(): JSX.Element {
  const router = useRouter()
  const { error, onReset } = useError()
  const t = useTranslations('common')

  /**
   * TODO:
   * consider either adding a `resetOnRouteChange` prop to the error boundary itself,
   * or make `useError` accept an optional argument, which sets up this effect internally.
   * the strategy of using a `key` on the error boundary sucks for the root error boundary
   * because it wraps the page layout, and therefore will always *remount* (not only
   * rerender) the page on every route change.
   */
  useEffect(() => {
    router.events.on('routeChangeComplete', onReset)

    return () => {
      router.events.off('routeChangeComplete', onReset)
    }
  }, [router.events, onReset])

  if (error instanceof HttpError && error.response.status === 401) {
    return <SignInForm />
  }

  if (
    error instanceof AuthorizationError ||
    (error instanceof HttpError && error.response.status === 403)
  ) {
    return (
      <FullPage>
        <ErrorMessage
          statusCode={error instanceof HttpError ? error.response.status : undefined}
          message={t(['common', 'default-authorization-error-message'])}
        />
      </FullPage>
    )
  }

  return (
    <FullPage>
      <ErrorMessage
        statusCode={error instanceof HttpError ? error.response.status : undefined}
        message={error.message}
        onReset={onReset}
      />
    </FullPage>
  )
}
