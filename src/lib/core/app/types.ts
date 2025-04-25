import type { AppProps as NextAppProps } from 'next/app'

import type { User } from '@/data/sshoc/api/user'
import type { Dictionary } from '@/dictionaries'
import type { DehydratedState } from '@/lib/core/query/QueryProvider'

export type GetLayout = (page: JSX.Element, pageProps: SharedPageProps) => JSX.Element

export type PageComponent<T = unknown> = NextAppProps<T>['Component'] & {
  getLayout?: GetLayout | undefined
  isPageAccessible?: boolean | ((user: User) => boolean) | undefined
}

export interface SharedPageProps {
  dictionaries?: Partial<Dictionary>
  initialQueryState?: DehydratedState
}

export interface AppProps extends NextAppProps {
  Component: PageComponent<SharedPageProps>
  pageProps: SharedPageProps
}
