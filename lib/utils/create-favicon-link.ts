import { defaultLocale, type Locale } from "@/config/i18n.config";
import { createSiteUrl } from "@/lib/utils";

export function createFaviconLink(locale: Locale, fileName: string): URL {
	return createSiteUrl({
		/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
		locale: locale === defaultLocale ? undefined : locale,
		pathname: fileName,
	});
}
