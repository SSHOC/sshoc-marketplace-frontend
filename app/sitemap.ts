import { createUrl } from "@acdh-oeaw/lib";
import type { MetadataRoute } from "next";

import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";

const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = ["/", "/imprint"] as const;

	return locales.flatMap((locale) => {
		return routes.map((pathname) => {
			return {
				url: String(createUrl({ baseUrl, pathname: ["/", locale, pathname].join("") })),
				lastModified: new Date(),
			};
		});
	});
}
