import { createAssetOptions, withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";

import type { Locale } from "@/config/i18n.config";

export function createLinkSchema(assetPath: `/${string}/`, locale: Locale) {
	return fields.conditional(
		fields.select({
			label: "Kind",
			options: [
				{ label: "About pages", value: "about-pages" },
				{ label: "Contribute pages", value: "contribute-pages" },
				{ label: "Pages", value: "pages" },
				{ label: "Download", value: "download" },
				{ label: "External", value: "external" },
			],
			defaultValue: "external",
		}),
		{
			"about-pages": fields.relationship({
				label: "About page",
				validation: { isRequired: true },
				collection: withI18nPrefix("about-pages", locale),
			}),
			"contribute-pages": fields.relationship({
				label: "Contribute page",
				validation: { isRequired: true },
				collection: withI18nPrefix("contribute-pages", locale),
			}),
			pages: fields.relationship({
				label: "Page",
				validation: { isRequired: true },
				collection: withI18nPrefix("pages", locale),
			}),
			download: fields.file({
				label: "Download",
				validation: { isRequired: true },
				...createAssetOptions(assetPath),
			}),
			external: fields.url({
				label: "URL",
				validation: { isRequired: true },
			}),
		},
	);
}
