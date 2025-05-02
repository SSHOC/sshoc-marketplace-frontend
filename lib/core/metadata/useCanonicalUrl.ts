import type { UrlSearchParamsInit } from "@stefanprobst/request";
import { useMemo } from "react";

import { useLocale } from "@/lib/core/i18n/useLocale";
import { usePathname } from "@/lib/core/navigation/usePathname";
import { createSiteUrl } from "@/lib/utils";

export type UseCanonicalUrlResult = string;

export function useCanonicalUrl(searchParams?: UrlSearchParamsInit): UseCanonicalUrlResult {
	const pathname = usePathname();
	const { locale } = useLocale();

	const canonicalUrl = useMemo(() => {
		const url = createSiteUrl({
			locale,
			pathname,
			searchParams,
			hash: undefined,
		});

		return String(url);
	}, [pathname, locale, searchParams]);

	return canonicalUrl;
}
