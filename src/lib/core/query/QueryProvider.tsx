import type { ReactNode } from 'react'
import type { DehydratedState, QueryClient } from 'react-query'
import { Hydrate, QueryClientProvider } from 'react-query'

export type { DehydratedState } from 'react-query'

interface QueryProviderProps {
  children?: ReactNode
  client: QueryClient
  state: DehydratedState | undefined
}

export function QueryProvider(props: QueryProviderProps): JSX.Element {
  const { client, state } = props

  return (
    <QueryClientProvider client={client}>
      <Hydrate state={state}>{props.children}</Hydrate>
    </QueryClientProvider>
  )
}
