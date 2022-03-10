import type { ErrorFallbackProps } from '@stefanprobst/next-error-boundary'
import { ErrorBoundary } from '@stefanprobst/next-error-boundary'
import { I18nProvider } from '@stefanprobst/next-i18n'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import type { ReactNode } from 'react'

import { dictionary as common } from '@/dictionaries/common/en'
import { mockRouter } from '~/test/lib/create-mock-router'

const dictionaries = { common }

export interface PreviewProps {
  children?: ReactNode
}

export function Preview(props: PreviewProps): JSX.Element {
  return (
    <RouterContext.Provider value={mockRouter}>
      <ErrorBoundary fallback={ErrorFallback}>
        <I18nProvider dictionaries={dictionaries}>{props.children}</I18nProvider>
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
