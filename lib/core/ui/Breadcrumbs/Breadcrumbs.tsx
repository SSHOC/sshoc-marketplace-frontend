import Link from "next/link";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

export interface BreadcrumbsProps {
	links: Array<{ href: string; label: string }>;
}

export function Breadcrumbs(props: Readonly<BreadcrumbsProps>): ReactNode {
	const t = useTranslations();

	return (
		<nav aria-label={t("common.breadcrumbs")}>
			<ol role="list" className="flex flex-wrap items-center gap-2 text-md">
				{props.links.map((link, index, links) => {
					const isCurrent = index === links.length - 1;

					return (
						<li key={link.label} className="flex items-center gap-2">
							{isCurrent ? (
								<span className="cursor-default text-neutral-600">{link.label}</span>
							) : (
								<Fragment>
									<Link
										className="text-primary-750 outline-transparent transition hover:text-primary-600 focus-visible:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
										href={link.href}
									>
										{link.label}
									</Link>
									<span aria-hidden className="mx-1 text-neutral-150 select-none">
										/
									</span>
								</Fragment>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
