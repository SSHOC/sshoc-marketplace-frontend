import type { Locale } from '~/config/i18n.config'

export async function load(
  locale: Locale,
  namespaces: Array<keyof IntlMessages>,
): Promise<IntlMessages> {
  const translations = await Promise.all(
    namespaces.map(async (namespace) => {
      /**
       * The path must be provided as string literal or template string literal.
       *
       * @see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
       */
      const dictionary = await import(`@/messages/${namespace}/${locale}.ts`).then((module) => {
        return module.default
      })

      return [namespace, dictionary]
    }),
  )

  return Object.fromEntries(translations)
}
