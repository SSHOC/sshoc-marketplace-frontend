import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export function PageFooter(): ReactNode {
	const t = useTranslations();

	const links = [
		{ label: t("common.pages.about"), href: "/about/service" },
		{ label: t("common.pages.privacy-policy"), href: "/privacy-policy" },
		{ label: t("common.pages.terms-of-use"), href: "/terms-of-use" },
		{ label: t("common.pages.contact"), href: "/contact" },
	];

	return (
		<footer className="border-t border-neutral-150 bg-neutral-100 [grid-area:page-footer]">
			<nav
				className="mx-auto w-full max-w-[120rem] px-8"
				aria-label={t("common.footer-navigation")}
			>
				<ul className="flex flex-col py-2 text-md sm:flex-row sm:py-0" role="list">
					{links.map((link) => {
						return (
							<li key={link.label}>
								<Link
									className="flex justify-center px-6 py-5 text-center text-neutral-700 transition hover:bg-neutral-50 focus-visible:bg-neutral-50"
									href={link.href}
								>
									{link.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</footer>
	);
}
