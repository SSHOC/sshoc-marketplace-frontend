import 'react-toastify/dist/ReactToastify.css'
import '@/styles/index.css'
import '~/stories/styles/preview.css'

import { defaultTheme, themes } from '@stefanprobst/next-theme'
import { action } from '@storybook/addon-actions'
import type { DecoratorFunction, GlobalTypes, Parameters } from '@storybook/csf'
import type { ReactFramework } from '@storybook/react'
import { initialize as initializeMsw, mswDecorator as withMsw } from 'msw-storybook-addon'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import type { ImageProps } from 'next/image'
import * as NextImage from 'next/image'

import { dictionary as common } from '@/dictionaries/common/en'
import { I18nProvider } from '@/lib/core/i18n/I18nProvider'
import { defaultLocale, locales } from '~/config/i18n.config.mjs'
import { createMockRouter } from '~/test/lib/create-mock-router'

const OriginalNextImage = NextImage.default

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: function StorybookImageWrapper(props: ImageProps) {
    return <OriginalNextImage {...props} unoptimized />
  },
})

if (process.env['NEXT_PUBLIC_API_MOCKING'] === 'enabled') {
  initializeMsw()
}

export const globalTypes: GlobalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: defaultTheme,
    type: {
      name: 'enum',
      value: Object.keys(themes),
    },
    toolbar: {
      icon: 'circlehollow',
      items: Object.keys(themes),
    },
  },
  locale: {
    name: 'Locale',
    description: 'Internationalisation locale',
    defaultValue: defaultLocale,
    type: {
      name: 'enum',
      value: locales,
    },
    toolbar: {
      icon: 'globe',
      items: locales,
    },
  },
}

const withRouter: DecoratorFunction<ReactFramework> = function withRouter(Story, context) {
  const options = context.parameters['router']
  const locale = context.globals['locale']
  const router = createMockRouter({
    push(...args: Array<unknown>) {
      action('router.push')(...args)
      return Promise.resolve(true)
    },
    replace(...args: Array<unknown>) {
      action('router.replace')(...args)
      return Promise.resolve(true)
    },
    reload(...args: Array<unknown>) {
      action('router.reload')(...args)
    },
    back(...args: Array<unknown>) {
      action('router.back')(...args)
    },
    prefetch(...args: Array<unknown>) {
      action('router.prefetch')(...args)
      return Promise.resolve()
    },
    beforePopState(...args: Array<unknown>) {
      action('router.beforePopState')(...args)
    },
    events: {
      on(...args: Array<unknown>) {
        action('router.events.on')(...args)
      },
      off(...args: Array<unknown>) {
        action('router.events.off')(...args)
      },
      emit(...args: Array<unknown>) {
        action('router.events.emit')(...args)
      },
    },
    ...options,
    locale,
  })

  return (
    <RouterContext.Provider value={router}>
      <Story {...context} />
    </RouterContext.Provider>
  )
}

const withI18n: DecoratorFunction<ReactFramework> = function withI18n(Story, context) {
  const options = context.parameters['i18n']
  const dictionaries = options?.dictionaries ?? { common }

  return (
    <I18nProvider dictionaries={dictionaries}>
      <Story {...context} />
    </I18nProvider>
  )
}

const withTheme: DecoratorFunction<ReactFramework> = function withTheme(Story, context) {
  document.documentElement.dataset['theme'] = context.globals['theme']
  return <Story {...context} />
}

export const decorators = [withMsw, withTheme, withI18n, withRouter]

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  parameters: {
    msw: {
      handlers: [
        /** Add handlers which should be globally available here. */
      ],
    },
  },
}
