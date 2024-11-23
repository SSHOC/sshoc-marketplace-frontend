import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { NavLink } from "@/app/(app)/_components/nav-link";
import type { LinkProps } from "@/components/link";
import { createHref } from "@/lib/create-href";

interface NavigationLink {
	type: "link";
	href: LinkProps["href"];
	label: string;
}

type NavigationItem = NavigationLink;

export function AppFooter(): ReactNode {
	const t = useTranslations("AppFooter");

	const navigation = {
		about: {
			type: "link",
			href: createHref({ pathname: "/about/service" }),
			label: t("links.about"),
		},
		"privacy-policy": {
			type: "link",
			href: createHref({ pathname: "/privacy-policy" }),
			label: t("links.privacy-policy"),
		},
		"terms-of-use": {
			type: "link",
			href: createHref({ pathname: "/terms-of-use" }),
			label: t("links.terms-of-use"),
		},
		contact: {
			type: "link",
			href: createHref({ pathname: "/contact" }),
			label: t("links.contact"),
		},
	} satisfies Record<string, NavigationItem>;

	return (
		<footer className="layout-grid grid gap-y-6 border-t border-stroke-weak py-12">
			<div className="flex items-center justify-between gap-4 py-6">
				<nav aria-label={t("navigation-secondary")}>
					<ul className="flex flex-wrap items-center gap-4 text-sm" role="list">
						{Object.entries(navigation).map(([id, link]) => {
							switch (link.type) {
								// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
								case "link": {
									return (
										<li key={id}>
											<NavLink href={link.href}>{link.label}</NavLink>
										</li>
									);
								}
							}
						})}
					</ul>
				</nav>
			</div>
		</footer>
	);
}
