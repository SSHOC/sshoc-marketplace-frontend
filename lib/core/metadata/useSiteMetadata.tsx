import type { SiteMetadata } from "@/config/metadata.config";
import { siteMetadata } from "@/config/metadata.config";
import { useLocale } from "@/lib/core/i18n/useLocale";

export function useSiteMetadata(): SiteMetadata {
	const { locale } = useLocale();

	return siteMetadata[locale];
}
