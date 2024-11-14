import { defaultLocale, locales } from "~/config/i18n.config.mjs";

import type { Locale, Locales } from "~/config/i18n.config.mjs";

export interface UseLocaleResult {
  locale: Locale;
  locales: Locales;
  defaultLocale: Locale;
}

export function useLocale(): UseLocaleResult {
  return { locale: defaultLocale, locales, defaultLocale } as UseLocaleResult;
}
