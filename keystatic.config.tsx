import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { config } from "@keystatic/core";

import { Logo } from "@/components/logo";
import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";
import { createAboutPages, createContributePages, createPages } from "@/lib/keystatic/collections";
import { createMetadata } from "@/lib/keystatic/singletons";

export default config({
	collections: {
		[withI18nPrefix("about-pages", "en")]: createAboutPages("en"),
		[withI18nPrefix("contribute-pages", "en")]: createContributePages("en"),
		[withI18nPrefix("pages", "en")]: createPages("en"),
	},
	singletons: {
		[withI18nPrefix("metadata", "en")]: createMetadata("en"),
		// [withI18nPrefix("navigation", "en")]: createNavigation("en"),
	},
	storage:
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			mark() {
				return <Logo />;
			},
			name: "SSHOC Marketplace",
		},
		navigation: {
			AboutPages: locales.map((locale) => {
				return withI18nPrefix("about-pages", locale);
			}),
			ContributePages: locales.map((locale) => {
				return withI18nPrefix("contribute-pages", locale);
			}),
			Pages: locales.map((locale) => {
				return withI18nPrefix("pages", locale);
			}),
			// Navigation: locales.map((locale) => {
			// 	return withI18nPrefix("navigation", locale);
			// }),
			Metadata: locales.map((locale) => {
				return withI18nPrefix("metadata", locale);
			}),
		},
	},
});
