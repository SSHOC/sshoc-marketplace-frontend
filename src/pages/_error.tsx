import NextError from 'next/error'

import ErrorScreen from '@/screens/error/ErrorScreen'

type InternalErrorPageProps = {
  statusCode: number
}

/**
 * Unexpected error page.
 *
 * Renders without being wrapped in PageLayout, because ErrorBoundary
 * wraps PageLayout.
 */
export default function InternalErrorPage({ statusCode }: InternalErrorPageProps): JSX.Element {
  return (
    <ErrorScreen
      message="An unexpected error has occurred."
      statusCode={statusCode}
      className="min-h-screen"
    />
  )
}

InternalErrorPage.getInitialProps = NextError.getInitialProps
