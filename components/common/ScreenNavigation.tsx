import type { ReactNode } from "react";

import { NavLink } from "@/components/common/NavLink";
import css from "@/components/common/ScreenNavigation.module.css";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import TriangleIcon from "@/lib/core/ui/icons/triangle.svg?symbol-icon";

export interface ScreenNavigationProps {
	label: string;
	items: Array<{ href: string; label: string; id?: string }>;
}

export function ScreenNavigation(props: ScreenNavigationProps): ReactNode {
	const { label, items } = props;

	return (
		<nav aria-label={label} className={css["container"]}>
			<ul role="list">
				{items.map((item, index) => {
					return (
						<li key={item.id ?? index}>
							<div className={css["nav-link"]}>
								<NavLink href={item.href}>
									{item.label}
									<Icon icon={TriangleIcon} />
								</NavLink>
							</div>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
