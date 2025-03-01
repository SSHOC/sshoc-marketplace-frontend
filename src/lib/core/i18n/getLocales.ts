import { type Locale, locales } from '~/config/i18n.config'

export function getLocales(): ReadonlyArray<Locale> {
  return locales
}
