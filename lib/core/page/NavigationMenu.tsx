import type { ReactNode } from "react";
import {
	Button as AriaButton,
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	MenuTrigger as AriaMenuTrigger,
} from "react-aria-components";

import css from "@/lib/core/page/NavigationMenu.module.css";
import pageNavigationStyles from "@/lib/core/page/PageNavigation.module.css";
import { Popover } from "@/lib/core/page/Popover";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import ChevronIcon from "@/lib/core/ui/icons/chevron.svg?symbol-icon";
import linkStyles from "@/lib/core/ui/Link/Link.module.css";

export interface NavigationMenuProps {
	label: string;
	items: Array<{ label: string; href: string }>;
}

/**
 * TODO: We should be using the disclosure pattern for navigation menus, *not* the menu pattern.
 *
 * @see https://w3c.github.io/aria-practices/#disclosure
 * @see https://w3c.github.io/aria-practices/examples/disclosure/disclosure-navigation.html
 * @see https://www.evinced.com/blog/a11y-nav-menus/
 * @see https://github.com/adobe/react-spectrum/discussions/7429
 */
export function NavigationMenu(props: NavigationMenuProps): ReactNode {
	const { items, label } = props;

	// const router = useRouter();

	// useEffect(() => {
	// 	router.events.on("routeChangeStart", state.close);

	// 	return () => {
	// 		router.events.off("routeChangeStart", state.close);
	// 	};
	// }, [router, state.close]);

	return (
		<div className={css["container"]}>
			<AriaMenuTrigger>
				<AriaButton
					className={pageNavigationStyles["nav-menu-button"]}
					// data-state={state.isOpen ? "expanded" : "collapsed"}
				>
					{label}
					<Icon icon={ChevronIcon} />
				</AriaButton>
				<Popover>
					<AriaMenu aria-label={label} className={css["nav-menu"]}>
						{items.map((item, index) => {
							return (
								<AriaMenuItem
									key={index}
									className={linkStyles["link"]}
									data-variant="nav-menu-link"
									href={item.href}
								>
									{item.label}
								</AriaMenuItem>
							);
						})}
					</AriaMenu>
				</Popover>
			</AriaMenuTrigger>
		</div>
	);
}
