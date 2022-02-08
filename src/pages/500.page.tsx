import NextError from 'next/error'

import ErrorScreen from '@/screens/error/ErrorScreen'

type InternalErrorPageProps = {
  statusCode: number
}

/**
 * Unexpected error page.
 */
export default function InternalErrorPage({
  statusCode = 500,
}: InternalErrorPageProps): JSX.Element {
  return (
    <ErrorScreen
      message="An unexpected error has occurred."
      statusCode={statusCode}
      className="min-h-screen"
    />
  )
}
