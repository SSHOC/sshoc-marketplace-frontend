import { HttpError } from '@stefanprobst/request'
import { MutationCache, QueryCache, QueryClient } from 'react-query'
import { broadcastQueryClient } from 'react-query/broadcastQueryClient-experimental'

import { isNotFoundError } from '@/data/sshoc/utils/isNotFoundError'
import type {
  DefaultErrorMessageMap,
  MutationMetadata,
  QueryMetadata,
} from '@/lib/core/query/types'
import { toast } from '@/lib/core/toast/toast'
import { includes, isNonEmptyString } from '@/lib/utils'
import { toastAutoCloseDelay } from '~/config/site.config'

export type { QueryClient }

/**
 * Creates a `QueryClient` with global error handlers for queries and mutations.
 * Note that global error handlers will run *before* an error is delegated to an error boundary.
 */
export function createQueryClient(defaultErrorMessages: DefaultErrorMessageMap): QueryClient {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError(error, query) {
        /**
         * Only show error toast when there is already data in the cache, which
         * indicates a failed background refresh.
         */
        // if (query.state.data == null) return

        const meta = query.meta as QueryMetadata | undefined
        const customMessage =
          typeof meta?.messages?.error === 'function'
            ? meta.messages.error(error, query)
            : undefined
        const message =
          customMessage != null
            ? customMessage
            : error instanceof Error && isNonEmptyString(error.message)
            ? error.message
            : isNonEmptyString(error)
            ? error
            : defaultErrorMessages.query.error

        /** Global error toast can be prevented when `meta.messages.error` returns `false`. */
        if (message !== false) {
          toast.error(message, { toastId: String(query.queryKey) })
        }

        if (error instanceof HttpError && includes([401, 403], error.response.status)) {
          // TODO: Handle authentication errors here in global `onError` callback, or in root error boundary?
        }
      },
    }),
    mutationCache: new MutationCache({
      onMutate(variables, mutation) {
        const meta = mutation.meta as MutationMetadata | undefined
        const customMessage =
          typeof meta?.messages?.mutate === 'function'
            ? meta.messages.mutate(variables, mutation)
            : undefined
        const message = customMessage != null ? customMessage : defaultErrorMessages.mutation.mutate

        /** Global loading toast can be prevented when `meta.messages.mutate` returns `false`. */
        if (message !== false) {
          const toastId = String(mutation.mutationId)
          toast.loading(message, { toastId, role: 'status' })
          console.info('Mutate notification', message, toastId)
        }
      },
      onSuccess(data, variables, context, mutation) {
        const meta = mutation.meta as MutationMetadata | undefined
        const customMessage =
          typeof meta?.messages?.success === 'function'
            ? meta.messages.success(data, variables, context, mutation)
            : undefined
        const message =
          customMessage != null ? customMessage : defaultErrorMessages.mutation.success

        /** Global loading toast can be prevented when `meta.messages.mutate` returns `false`. */
        if (message !== false) {
          const toastId = String(mutation.mutationId)
          toast.update(toastId, {
            render: message,
            type: 'success',
            isLoading: null,
            autoClose: toastAutoCloseDelay,
            closeButton: null,
            closeOnClick: null,
            draggable: null,
            delay: 100, // Work around one of the race conditions in `react-toastify`.
          })
          console.info('Success notification', message, toastId)
        }
      },
      onError(error, variables, context, mutation) {
        const meta = mutation.meta as MutationMetadata | undefined
        const customMessage =
          typeof meta?.messages?.error === 'function'
            ? meta.messages.error(error, variables, context, mutation)
            : undefined
        const message =
          customMessage != null
            ? customMessage
            : error instanceof Error && isNonEmptyString(error.message)
            ? error.message
            : isNonEmptyString(error)
            ? error
            : defaultErrorMessages.mutation.error

        /** Global error toast can be prevented when `meta.messages.error` returns `false`. */
        if (message !== false) {
          const toastId = String(mutation.mutationId)
          toast.update(toastId, {
            render: message,
            type: 'error',
            isLoading: null,
            autoClose: toastAutoCloseDelay,
            closeButton: null,
            closeOnClick: null,
            draggable: null,
            delay: 100, // Work around one of the race conditions in `react-toastify`.
          })
        }

        if (error instanceof HttpError && includes([401, 403], error.response.status)) {
          // TODO: Handle authentication errors here in global `onError` callback, or in root error boundary?
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry(failureCount, error) {
          if (isNotFoundError(error)) {
            return false
          } else if (failureCount < 2) {
            return true
          } else {
            return false
          }
        },
        // staleTime: 10 * 1000,
        /** Currently, `@react-aria` is not compatible with React 18 Suspense. */
        // suspense: true,
        useErrorBoundary(error) {
          if (!(error instanceof HttpError)) return true

          /**
           * Propagate only server errors and authentication errors to the error boundary.
           */
          return error.response.status >= 500 || includes([401, 403], error.response.status)
        },
      },
      mutations: {
        useErrorBoundary(error) {
          if (!(error instanceof HttpError)) return true

          /**
           * Propagate only server errors and authentication errors to the error boundary.
           */
          return error.response.status >= 500 || includes([401, 403], error.response.status)
        },
      },
    },
  })

  broadcastQueryClient({ queryClient })

  return queryClient
}
