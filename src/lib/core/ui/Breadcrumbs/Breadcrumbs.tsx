import { Fragment, type ReactNode } from "react";

import { NavLink } from "@/components/common/NavLink";
import { useI18n } from "@/lib/core/i18n/useI18n";
import css from "@/lib/core/ui/Breadcrumbs/Breadcrumbs.module.css";

export interface BreadcrumbsProps {
	links: Array<{ href: string; label: string; isCurrent?: boolean; isDisabled?: boolean }>;
}

export function Breadcrumbs(props: BreadcrumbsProps): ReactNode {
	const { t } = useI18n<"common">();

	return (
		<nav aria-label={t(["common", "breadcrumbs"])}>
			<ol role="list" className={css["nav-items"]}>
				{props.links.map((link, index) => {
					return (
						<Fragment key={link.label}>
							{index !== 0 ? (
								<li aria-hidden className={css["nav-separator"]}>
									/
								</li>
							) : null}
							<li>
								<NavLink
									href={link.href}
									isCurrent={link.isCurrent}
									isDisabled={link.isDisabled}
									variant="breadcrumb"
								>
									{link.label}
								</NavLink>
							</li>
						</Fragment>
					);
				})}
			</ol>
		</nav>
	);
}
