// import 'focus-visible'
import '@/styles/global.css'
import 'tailwindcss/tailwind.css'
import '@/styles/nprogress.css'
/** should use ReactToastify.minimal.css */
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/dialog.css'

import { I18nProvider } from '@react-aria/i18n'
import { useInteractionModality } from '@react-aria/interactions'
import { SSRProvider } from '@react-aria/ssr'
import Layout from '@stefanprobst/next-app-layout'
import { ErrorBoundary } from '@stefanprobst/next-error-boundary'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'
import np from 'nprogress'
import type { PropsWithChildren } from 'react'
import { Fragment, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Slide, ToastContainer } from 'react-toastify'

import AuthProvider from '@/modules/auth/AuthContext'
import ClientError from '@/modules/error/ClientError'
import PageLayout from '@/modules/page/PageLayout'

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
 * Create client side cache for server data.
 */
function createQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // cacheTime: Infinity,
        /**
         * stale time must not be set to infinite, because this will interfere
         * with refetching after clearing the query cache when a user signs in/out.
         *
         * TODO: is this because the cache gets reset to its initialData (which is
         * unauthenticated data fetched server-side)?
         */
        // staleTime: Infinity,
        structuralSharing: false,
      },
    },
  })

  return queryClient
}

/**
 * Providers.
 */
function Providers({ children, render }: PropsWithChildren<{ render: () => void }>) {
  const [queryClient] = useState(() => {
    return createQueryClient()
  })

  useInteractionModality()

  const [clearQueryCache] = useState(() => {
    return () => {
      queryClient.clear()
      /**
       * Clearing the query cache means removing all query subscribers.
       * Rerendering the tree registers them again.
       */
      render()
    }
  })

  return (
    <SSRProvider>
      <I18nProvider locale="en">
        <QueryClientProvider client={queryClient}>
          <AuthProvider onChange={clearQueryCache}>{children}</AuthProvider>
        </QueryClientProvider>
      </I18nProvider>
    </SSRProvider>
  )
}

/**
 * App shell.
 */
export default function App({ Component, pageProps, router }: AppProps): JSX.Element {
  const [, forceRender] = useState<object>({})

  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ErrorBoundary fallback={ClientError}>
        <Providers
          {...pageProps}
          render={() => {
            return forceRender({})
          }}
        >
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
