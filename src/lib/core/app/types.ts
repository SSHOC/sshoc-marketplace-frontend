import type { AppProps as NextAppProps } from 'next/app'

import type { User } from '@/data/sshoc/api/user'
import type { DehydratedState } from '@/lib/core/query/QueryProvider'

export interface GetLayout {
  (page: JSX.Element, pageProps: SharedPageProps): JSX.Element
}

export type PageComponent<T = unknown> = NextAppProps<T>['Component'] & {
  getLayout?: GetLayout | undefined
  isPageAccessible?: boolean | ((user: User) => boolean) | undefined
}

export interface SharedPageProps {
  messages?: IntlMessages
  initialQueryState?: DehydratedState
}

export interface AppProps extends NextAppProps {
  Component: PageComponent<SharedPageProps>
  pageProps: SharedPageProps
}
