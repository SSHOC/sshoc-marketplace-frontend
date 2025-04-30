import { useRouter } from "next/router";

import type { Locale, Locales } from "~/config/i18n.config.mjs";

export interface UseLocaleResult {
	locale: Locale;
	locales: Locales;
	defaultLocale: Locale;
}

export function useLocale(): UseLocaleResult {
	const { locale, locales, defaultLocale } = useRouter();

	return { locale, locales, defaultLocale } as UseLocaleResult;
}
