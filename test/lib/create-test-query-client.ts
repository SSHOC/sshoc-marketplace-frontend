import type { QueryClient } from 'react-query'

import { createQueryClient } from '@/lib/core/query/create-query-client'
import type { DefaultErrorMessageMap } from '@/lib/core/query/types'

export function createTestQueryClient(defaultErrorMessages: DefaultErrorMessageMap): QueryClient {
  const queryClient = createQueryClient(defaultErrorMessages)

  const defaultOptions = queryClient.getDefaultOptions()
  queryClient.setDefaultOptions({
    ...defaultOptions,
    queries: {
      ...defaultOptions.queries,
      retry: false,
    },
    mutations: {
      ...defaultOptions.mutations,
      retry: false,
    },
  })

  return queryClient
}
