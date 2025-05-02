import type { ReactNode } from "react";

import { NavLink } from "@/components/common/NavLink";
import css from "@/components/common/ScreenNavigation.module.css";
import type { NavItems } from "@/lib/core/page/types";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import TriangleIcon from "@/lib/core/ui/icons/triangle.svg?symbol-icon";

export interface ScreenNavigationProps {
	label: string;
	items: NavItems;
}

export function ScreenNavigation(props: ScreenNavigationProps): ReactNode {
	const { label, items } = props;

	return (
		<nav aria-label={label} className={css["container"]}>
			<ul role="list">
				{items.map((item) => {
					return (
						<li key={item.id}>
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
