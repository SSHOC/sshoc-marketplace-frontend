import Layout from '@stefanprobst/next-app-layout'
import ErrorBoundary from '@stefanprobst/next-error-boundary'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'
import np from 'nprogress'
import type { PropsWithChildren } from 'react'
import { Fragment } from 'react'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'
import { ToastContainer, Slide } from 'react-toastify'
import AuthProvider from '@/modules/auth/AuthContext'
import ClientError from '@/modules/error/ClientError'
import PageLayout from '@/modules/page/PageLayout'

import 'focus-visible'
import '@/styles/global.css'
import 'tailwindcss/tailwind.css'
import '@/styles/nprogress.css'
/** should use ReactToastify.minimal.css */
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/combobox.css'
import '@reach/dialog/styles.css'

/**
 * Report web vitals.
 */
export function reportWebVitals(metric: NextWebVitalsMetric): void {
  /** should be dispatched to an analytics service */
  console.info(metric)
}

/**
 * Report page transitions to Matomo analytics.
 */
Router.events.on('routeChangeComplete', (url) => {
  if (typeof window !== 'undefined') {
    const w = window as typeof window & { _paq?: Array<unknown> }
    if (w._paq !== undefined) {
      w._paq.push(['setCustomUrl', url])
      w._paq.push(['setDocumentTitle', document.title])
      w._paq.push(['trackPageView'])
    }
  }
})

/**
 * Progress bar for client-side page transitions.
 */
np.configure({ showSpinner: false })
/** show progress indicator only if transition takes longer than `delay` */
const delay = 250
let timeout: number
function startProgressIndicator() {
  timeout = window.setTimeout(np.start, delay)
}
function stopProgressIndicator() {
  window.clearTimeout(timeout)
  np.done()
}
Router.events.on('routeChangeStart', startProgressIndicator)
Router.events.on('routeChangeComplete', stopProgressIndicator)
Router.events.on('routeChangeError', stopProgressIndicator)

/**
 * Client side cache for server data.
 */
const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      cacheTime: Infinity,
      staleTime: Infinity,
      structuralSharing: false,
    },
  },
})

/**
 * Providers.
 */
function Providers({ children }: PropsWithChildren<unknown>) {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryCacheProvider>
  )
}

/**
 * App shell.
 */
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ErrorBoundary fallback={ClientError}>
        <Providers {...pageProps}>
          <Layout {...pageProps} default={PageLayout}>
            <Component {...pageProps} />
          </Layout>
          <ToastContainer
            transition={Slide}
            toastClassName={({ type } = {}) => {
              const shared =
                'relative mb-4 p-4 rounded shadow-md flex justify-between overflow-hidden cursor-pointer'
              switch (type) {
                case 'error':
                  return [shared, 'bg-error-600 text-white'].join(' ')
                default:
                  return [shared, 'bg-secondary-600 text-white'].join(' ')
              }
            }}
            bodyClassName="text-sm font-medium p-2 flex-1 mx-auto"
          />
          <ReactQueryDevtools />
        </Providers>
      </ErrorBoundary>
    </Fragment>
  )
}