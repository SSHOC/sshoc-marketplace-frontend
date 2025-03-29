import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { NavLink } from "@/components/nav-link";
import type { NavigationLink } from "@/lib/navigation/navigation";

export function PageFooter(): ReactNode {
	const t = useTranslations("PageFooter");

	const navigation = {
		about: {
			type: "link",
			href: "/about/service",
			label: t("links.about"),
		},
		imprint: {
			type: "link",
			href: "/imprint",
			label: t("links.imprint"),
		},
		"privacy-policy": {
			type: "link",
			href: "/privacy-policy",
			label: t("links.privacy-policy"),
		},
		"terms-of-use": {
			type: "link",
			href: "/terms-of-use",
			label: t("links.terms-of-use"),
		},
		contact: {
			type: "link",
			href: "/contact",
			label: t("links.contact"),
		},
	} satisfies Record<string, NavigationLink>;

	return (
		<footer className="border-t border-neutral-150 bg-neutral-100 text-neutral-700">
			<nav
				aria-label={t("navigation.label")}
				className="mx-auto flex w-full max-w-[120rem] items-center justify-between gap-x-8 px-8"
			>
				<ul className="flex text-[0.9375rem]" role="list">
					{Object.entries(navigation).map(([id, item]) => {
						return (
							<li key={id}>
								<NavLink className="flex px-6 py-5 transition hover:bg-neutral-50" href={item.href}>
									{item.label}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</nav>
		</footer>
	);
}
