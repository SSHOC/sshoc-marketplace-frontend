import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { NavLink } from "@/components/common/NavLink";
import css from "@/lib/core/page/PageFooter.module.css";

export function PageFooter(): ReactNode {
	const t = useTranslations();

	const links = [
		{ label: t("common.pages.about"), href: "/about/service" },
		{ label: t("common.pages.privacy-policy"), href: "/privacy-policy" },
		{ label: t("common.pages.terms-of-use"), href: "/terms-of-use" },
		{ label: t("common.pages.contact"), href: "/contact" },
	];

	return (
		<footer className={css["container"]}>
			<nav className={css["footer-nav"]} aria-label={t("common.footer-navigation")}>
				<ul className={css["nav-items"]} role="list">
					{links.map((link) => {
						return (
							<li key={link.label}>
								<NavLink variant="nav-link-footer" href={link.href}>
									{link.label}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</nav>
		</footer>
	);
}
