import { useError } from '@stefanprobst/next-error-boundary'
import ErrorScreen from '@/screens/error/ErrorScreen'

/**
 * Error boundary fallback. Sits above page layout.
 */
export default function ClientError(): JSX.Element {
  const { error } = useError()
  return <ErrorScreen message={error.message} className="min-h-screen" />
}
