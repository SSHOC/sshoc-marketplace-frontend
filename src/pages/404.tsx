import ErrorScreen from '@/screens/error/ErrorScreen'

/**
 * Not Found error page.
 *
 * Renders as a child of PageLayout.
 */
export default function NotFoundErrorPage(): JSX.Element {
  return <ErrorScreen message="Page not found." statusCode={404} />
}
