import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ColorSchemeSwitcher } from "@/components/color-scheme-switcher";
import type { LinkProps } from "@/components/link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavLink } from "@/components/nav-link";

export function AppHeader(): ReactNode {
	const t = useTranslations("AppHeader");

	const links = {
		home: { href: { pathname: "/" }, label: t("links.home") },
		"search-tools-and-services": {
			href: { pathname: "/search", query: { categories: ["tools-and-services"] } },
			label: t("links.search-tools-and-services"),
		},
		"search-training-materials": {
			href: { pathname: "/search", query: { categories: ["training-materials"] } },
			label: t("links.search-training-materials"),
		},
		"search-publications": {
			href: { pathname: "/search", query: { categories: ["publications"] } },
			label: t("links.search-publications"),
		},
		"search-datasets": {
			href: { pathname: "/search", query: { categories: ["datasets"] } },
			label: t("links.search-datasets"),
		},
		"search-workflows": {
			href: { pathname: "/search", query: { categories: ["workflows"] } },
			label: t("links.search-workflows"),
		},
		browse: { href: { pathname: "/browse" }, label: t("links.browse") },
		contribute: { href: { pathname: "/contribute" }, label: t("links.contribute") },
		about: { href: { pathname: "/about" }, label: t("links.about") },
	} satisfies Record<string, { href: LinkProps["href"]; label: string }>;

	return (
		<header className="border-b">
			<div className="container flex items-center justify-between gap-4 py-8">
				<nav aria-label={t("navigation-primary")}>
					<ul className="flex items-center gap-4" role="list">
						{Object.entries(links).map(([key, link]) => {
							return (
								<li key={key}>
									<NavLink href={link.href}>{link.label}</NavLink>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="flex items-center gap-4">
					<ColorSchemeSwitcher />
					<LocaleSwitcher />
				</div>
			</div>
		</header>
	);
}
