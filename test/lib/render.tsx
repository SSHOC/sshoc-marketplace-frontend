import { render } from '@testing-library/react'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import type { NextRouter } from 'next/router'
import type { FC } from 'react'
import type { DehydratedState } from 'react-query'

import type { Dictionary } from '@/dictionaries'
import { dictionary as common } from '@/dictionaries/common/en'
import { Providers } from '@/lib/core/app/Providers'
import type { PageComponent } from '@/lib/core/app/types'
import { RootErrorBoundary } from '@/lib/core/error/RootErrorBoundary'
import { createMockRouter } from '~/test/lib/create-mock-router'
import { createTestQueryClient } from '~/test/lib/create-test-query-client'

export interface CreateWrapperOptions {
  dictionaries?: Partial<Dictionary> | undefined
  initialQueryState?: DehydratedState | undefined
  isPageAccessible?: PageComponent['isPageAccessible']
  router?: Partial<NextRouter> | undefined
}

export function createWrapper(options?: CreateWrapperOptions): FC {
  const { dictionaries, initialQueryState, isPageAccessible, router } = options ?? {}

  const mockRouter = createMockRouter(router)
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

  return function Wrapper(props) {
    return (
      <RouterContext.Provider value={mockRouter}>
        <Providers
          dictionaries={dictionaries ?? { common }}
          initialQueryState={initialQueryState}
          isPageAccessible={isPageAccessible}
          queryClient={testQueryClient}
        >
          <RootErrorBoundary>{props.children}</RootErrorBoundary>
        </Providers>
      </RouterContext.Provider>
    )
  }
}

export const renderWithProviders = function renderWithProviders(
  ui: JSX.Element,
  {
    dictionaries,
    initialQueryState,
    isPageAccessible,
    router,
    wrapper,
    ...options
  }: CreateWrapperOptions & Parameters<typeof render>[1] = {},
): ReturnType<typeof render> {
  return render(ui, {
    wrapper:
      wrapper ?? createWrapper({ dictionaries, initialQueryState, isPageAccessible, router }),
    ...options,
  })
} as typeof render
