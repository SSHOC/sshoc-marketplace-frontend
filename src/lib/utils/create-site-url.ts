import type { UrlInit } from '@stefanprobst/request'
import { createUrl } from '@stefanprobst/request'

import type { Locale } from '~/config/i18n.config.mjs'
import { baseUrl } from '~/config/site.config'

export function createSiteUrl(
  init: Omit<UrlInit, 'baseUrl'> & { locale?: Locale | undefined },
): URL {
  const pathname =
    init.locale == null
      ? (init.pathname ?? '')
      : init.pathname == null
        ? init.locale
        : init.pathname.startsWith('/')
          ? ['/', init.locale, init.pathname].join('')
          : [init.locale, init.pathname].join('/')

  return createUrl({ baseUrl, pathname, ...init })
}
