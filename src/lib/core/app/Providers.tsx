'use client'

import { I18nProvider as AriaI18nProvider } from '@react-aria/i18n'
import { OverlayProvider } from '@react-aria/overlays'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useQueryErrorResetBoundary } from 'react-query'

import type { PageComponent, SharedPageProps } from '@/lib/core/app/types'
import { AuthProvider } from '@/lib/core/auth/AuthProvider'
import { PageAccessControl } from '@/lib/core/auth/PageAccessControl'
import type { QueryClient } from '@/lib/core/query/create-query-client'
import { createQueryClient } from '@/lib/core/query/create-query-client'
import { QueryProvider } from '@/lib/core/query/QueryProvider'
import { ToastContainer } from '@/lib/core/toast/ToastContainer'

import { getLocale } from '../i18n/getLocale'

export interface ContextProvidersProps {
  children?: ReactNode
  pageProps: SharedPageProps
  isPageAccessible?: PageComponent['isPageAccessible']
}

export function ContextProviders(props: ContextProvidersProps): JSX.Element {
  const [queryClient] = useState(() => {
    return createQueryClient({
      query: {
        error:
          props.pageProps.messages?.common['default-query-error-message'] ??
          'Something went wrong.',
      },
      mutation: {
        mutate:
          props.pageProps.messages?.common['default-mutation-pending-message'] ?? 'Submitting...',
        success:
          props.pageProps.messages?.common['default-mutation-success-message'] ??
          'Successfully submitted.',
        error:
          props.pageProps.messages?.common['default-mutation-error-message'] ??
          'Something went wrong.',
      },
    })
  })

  return (
    <Providers
      {...props.pageProps}
      isPageAccessible={props.isPageAccessible}
      queryClient={queryClient}
    >
      {props.children}
    </Providers>
  )
}

export interface ProvidersProps extends KeysAllowUndefined<SharedPageProps> {
  isPageAccessible?: PageComponent['isPageAccessible']
  children?: ReactNode
  queryClient: QueryClient
}

export function Providers(props: ProvidersProps): JSX.Element {
  const { messages = {}, initialQueryState, isPageAccessible, queryClient } = props

  const locale = getLocale()
  const { reset } = useQueryErrorResetBoundary()

  function onSignIn() {
    reset()
  }

  function onSignOut() {
    queryClient.clear()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider client={queryClient} state={initialQueryState}>
        <AuthProvider
          isPageAccessible={isPageAccessible}
          onSignIn={onSignIn} // FIXME: useQueryErrorResetBoundary().reset
          onSignOut={onSignOut}
        >
          <PageAccessControl>
            <AriaI18nProvider locale={locale}>
              <OverlayProvider>{props.children}</OverlayProvider>
            </AriaI18nProvider>
          </PageAccessControl>
        </AuthProvider>
      </QueryProvider>
      <ToastContainer />
    </NextIntlClientProvider>
  )
}
