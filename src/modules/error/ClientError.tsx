import { useError } from '@stefanprobst/next-error-boundary'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import ErrorScreen from '@/screens/error/ErrorScreen'

/**
 * Error boundary fallback. Sits above page layout.
 */
export default function ClientError(): JSX.Element {
  const { error, onReset } = useError()
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeComplete', onReset)

    return () => {
      router.events.off('routeChangeComplete', onReset)
    }
  }, [router.events, onReset])

  return <ErrorScreen message={error.message} className="min-h-screen" />
}
