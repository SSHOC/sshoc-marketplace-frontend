import type { GetStaticPathsContext } from "next";

import type { Locales } from "~/config/i18n.config";

export function getLocales(context: GetStaticPathsContext): Locales {
	return context.locales as Locales;
}
