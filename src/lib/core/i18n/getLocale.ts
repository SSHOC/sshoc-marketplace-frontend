import { defaultLocale, type Locale } from "~/config/i18n.config.mjs";

export function getLocale(): Locale {
  return defaultLocale;
}
