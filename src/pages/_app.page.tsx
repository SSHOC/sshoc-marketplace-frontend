/** Needs to be imported before `src/styles/index.css` so we can overwrite custom properties. */
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/index.css'

import { ErrorBoundary, useError } from '@stefanprobst/next-error-boundary'
import type { NextWebVitalsMetric } from 'next/app'
import { Fragment } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'

import { reportPageView } from '@/lib/core/analytics/analytics-service'
import { AnalyticsScript } from '@/lib/core/analytics/AnalyticsScript'
import { ContextProviders } from '@/lib/core/app/Providers'
import type { AppProps, GetLayout } from '@/lib/core/app/types'
import { RootErrorBoundary } from '@/lib/core/error/RootErrorBoundary'
import { PageLayout } from '@/lib/core/layouts/PageLayout'
import { SiteMetadata } from '@/lib/core/metadata/SiteMetadata'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { FullPage } from '@/lib/core/ui/FullPage/FullPage'

if (process.env['NEXT_PUBLIC_API_MOCKING'] === 'enabled') {
  await import('@/lib/core/app/msw').then(({ start }) => {
    start()
  })
}

export default function App(props: AppProps): JSX.Element {
  const { Component, pageProps } = props

  const getLayout = Component.getLayout ?? getDefaultLayout

  return (
    <Fragment>
      <AnalyticsScript />
      <SiteMetadata />
      <ErrorBoundary fallback={<ErrorFallback />}>
        <ContextProviders pageProps={pageProps} isPageAccessible={Component.isPageAccessible}>
          <RootErrorBoundary>
            {/* <Suspense fallback={<RootSuspenseFallback />}> */}
            {getLayout(<Component {...pageProps} />, pageProps)}
            {/* </Suspense> */}
          </RootErrorBoundary>
          <ReactQueryDevtools />
        </ContextProviders>
      </ErrorBoundary>
    </Fragment>
  )
}

function ErrorFallback() {
  const { error } = useError()

  return (
    <FullPage>
      <Centered>
        <div role="alert">
          <p>{error.message || 'Something went wrong.'}</p>
        </div>
      </Centered>
    </FullPage>
  )
}

// function RootSuspenseFallback() {
//   return (
//     <FullPage>
//       <Centered>
//         <ProgressSpinner />
//       </Centered>
//     </FullPage>
//   )
// }

export const getDefaultLayout: GetLayout = function getDefaultLayout(page, pageProps) {
  return <PageLayout pageProps={pageProps}>{page}</PageLayout>
}

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  switch (metric.name) {
    case 'Next.js-hydration':
      /** Register right after hydration. */
      break
    case 'Next.js-route-change-to-render':
      /** Register page views after client-side transitions. */
      reportPageView()
      break
    default:
      break
  }
}
