import type { ReactNode } from 'react'

import { dictionary as common } from '@/dictionaries/common/en'
import { Providers } from '@/lib/core/app/Providers'
import type { SharedPageProps } from '@/lib/core/app/types'
import { RootErrorBoundary } from '@/lib/core/error/RootErrorBoundary'
import { ToastContainer } from '@/lib/core/toast/ToastContainer'
import { createTestQueryClient } from '~/test/lib/create-test-query-client'

export interface ContextProvidersProps {
  pageProps: SharedPageProps
  children?: ReactNode
}

export function ContextProviders(props: ContextProvidersProps): JSX.Element {
  const { dictionaries, initialQueryState } = props.pageProps

  const testQueryClient = createTestQueryClient({
    query: {
      error: dictionaries?.common?.['default-query-error-message'] ?? 'Something went wrong.',
    },
    mutation: {
      mutate: dictionaries?.common?.['default-mutation-pending-message'] ?? 'Submitting...',
      success:
        dictionaries?.common?.['default-mutation-success-message'] ?? 'Successfully submitted.',
      error: dictionaries?.common?.['default-mutation-error-message'] ?? 'Something went wrong.',
    },
  })

  return (
    <Providers
      dictionaries={dictionaries ?? { common }}
      initialQueryState={initialQueryState}
      queryClient={testQueryClient}
    >
      <RootErrorBoundary>{props.children}</RootErrorBoundary>
      <ToastContainer />
    </Providers>
  )
}
