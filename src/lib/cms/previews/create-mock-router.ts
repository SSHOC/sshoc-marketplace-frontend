import type { NextRouter } from 'next/router'

import { noop } from '@/lib/utils'
import { defaultLocale, locales } from '~/config/i18n.config'

export const mockRouter: NextRouter = {
  basePath: '/',
  asPath: '/',
  pathname: '/',
  route: '/',
  query: {},
  isLocaleDomain: false,
  locale: defaultLocale,
  locales,
  defaultLocale,
  push() {
    return Promise.resolve(true)
  },
  replace() {
    return Promise.resolve(true)
  },
  reload: noop,
  back: noop,
  prefetch() {
    return Promise.resolve()
  },
  beforePopState: noop,
  events: { on: noop, off: noop, emit: noop },
  isFallback: false,
  isReady: true,
  isPreview: false,
}

export function createMockRouter(partial?: Partial<NextRouter>): NextRouter {
  return {
    ...mockRouter,
    ...partial,
  }
}
