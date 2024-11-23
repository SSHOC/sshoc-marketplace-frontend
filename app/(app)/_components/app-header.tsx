import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AppNavigation, type NavigationItem } from "@/app/(app)/_components/app-navigation";
import { createHref } from "@/lib/create-href";
import { createCollectionResource } from "@/lib/keystatic/resources";

export async function AppHeader(): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("AppHeader");

	const label = t("navigation-primary");

	const [aboutPages, contributePages] = await Promise.all([
		createCollectionResource("about-pages", locale).all(),
		createCollectionResource("contribute-pages", locale).all(),
	]);

	const navigation = {
		home: {
			type: "link",
			href: createHref({ pathname: "/" }),
			label: t("links.home"),
		},
		toolsServices: {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({ categories: ["tool-or-service"] }),
			}),
			label: t("links.tools-services"),
		},
		trainingMaterials: {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({ categories: ["training-material"] }),
			}),
			label: t("links.training-materials"),
		},
		publications: {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({ categories: ["publication"] }),
			}),
			label: t("links.publications"),
		},
		datasets: {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({ categories: ["dataset"] }),
			}),
			label: t("links.datasets"),
		},
		workflows: {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({ categories: ["workflow"] }),
			}),
			label: t("links.workflows"),
		},
		separator: { type: "separator" },
		browse: {
			type: "menu",
			label: t("links.browse"),
			children: {
				activities: {
					type: "link",
					href: createHref({
						pathname: "/browse/activity",
					}),
					label: t("links.browse-activities"),
				},
				keywords: {
					type: "link",
					href: createHref({
						pathname: "/browse/keyword",
					}),
					label: t("links.browse-keywords"),
				},
				sources: {
					type: "link",
					href: createHref({
						pathname: "/browse/source",
					}),
					label: t("links.browse-sources"),
				},
				languages: {
					type: "link",
					href: createHref({
						pathname: "/browse/language",
					}),
					label: t("links.browse-languages"),
				},
			},
		},
		separator2: { type: "separator" },
		contribute: {
			type: "menu",
			label: t("links.contribute"),
			children: Object.fromEntries(
				contributePages.map((entry) => {
					return [
						entry.id,
						{
							type: "link",
							href: createHref({
								pathname: `/contribute/${entry.id}`,
							}),
							label: entry.data.title,
						},
					];
				}),
			),
		},
		about: {
			type: "menu",
			label: t("links.about"),
			children: Object.fromEntries(
				aboutPages.map((entry) => {
					return [
						entry.id,
						{
							type: "link",
							href: createHref({
								pathname: `/about/${entry.id}`,
							}),
							label: entry.data.title,
						},
					];
				}),
			),
		},
	} satisfies Record<string, NavigationItem>;

	return (
		<header className="layout-grid border-b border-stroke-weak bg-fill-weaker">
			<div className="flex items-center justify-between gap-4 py-6">
				<AppNavigation label={label} navigation={navigation} />
			</div>
		</header>
	);
}
