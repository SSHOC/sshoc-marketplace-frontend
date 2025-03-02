import type { ErrorFallbackProps } from '@stefanprobst/next-error-boundary'
import { ErrorBoundary } from '@stefanprobst/next-error-boundary'
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'

import { mockRouter } from '@/lib/cms/previews/create-mock-router'
import { default as common } from '@/messages/common/en'
import { defaultLocale } from '~/config/i18n.config'

const locale = defaultLocale
const messages = { common }

export interface PreviewProps {
  children?: ReactNode
}

export function Preview(props: PreviewProps): JSX.Element {
  return (
    <RouterContext.Provider value={mockRouter}>
      <ErrorBoundary fallback={ErrorFallback}>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
          {props.children}
        </NextIntlClientProvider>
      </ErrorBoundary>
    </RouterContext.Provider>
  )
}

function ErrorFallback(props: ErrorFallbackProps) {
  return (
    <section role="alert">
      <p>Sorry, something went wrong.</p>
      <button onClick={props.onReset}>Clear errors</button>
    </section>
  )
}
