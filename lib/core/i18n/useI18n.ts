import type { I18nContextValue } from "@stefanprobst/next-i18n";
import { useI18n as _useI18n } from "@stefanprobst/next-i18n";

import type { Locale } from "@/config/i18n.config";
import type { Dictionary } from "@/dictionaries";

export function useI18n<K extends keyof Dictionary = never>(): I18nContextValue<
	Pick<Dictionary, K>,
	Locale
> {
	return _useI18n<Pick<Dictionary, K>, Locale>();
}
