import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { NavLink } from "@/components/common/NavLink";
import { NavigationMenu } from "@/lib/core/page/NavigationMenu";
import css from "@/lib/core/page/PageNavigation.module.css";
import { useAboutNavItems } from "@/lib/core/page/useAboutNavItems";
import { useBrowseNavItems } from "@/lib/core/page/useBrowseNavItems";
import { useContributeNavItems } from "@/lib/core/page/useContributeNavItems";
import { useItemCategoryNavItems } from "@/lib/core/page/useItemCategoryNavItems";

export function PageNavigation(): ReactNode {
	return (
		<nav className={css["main-nav"]}>
			<ul className={css["nav-items"]} role="list">
				<ItemCategoryNavLinks />
				<Separator />
				<BrowseNavMenu />
				<Separator />
				<ContributeNavMenu />
				<AboutNavMenu />
			</ul>
		</nav>
	);
}

function ItemCategoryNavLinks(): ReactNode {
	const items = useItemCategoryNavItems();

	if (items == null) {
		return null;
	}

	return (
		<Fragment>
			{items.map((item) => {
				return (
					<li className={css["nav-item"]} key={item.id}>
						<NavLink variant="nav-link-header" href={item.href}>
							{item.label}
						</NavLink>
					</li>
				);
			})}
		</Fragment>
	);
}

function BrowseNavMenu(): ReactNode {
	const t = useTranslations();
	const items = useBrowseNavItems();

	return (
		<li className={css["nav-item"]}>
			<NavigationMenu label={t("common.pages.browse")} items={items} />
		</li>
	);
}

function ContributeNavMenu(): ReactNode {
	const t = useTranslations();
	const items = useContributeNavItems();

	return (
		<li className={css["nav-item"]}>
			<NavigationMenu label={t("common.pages.contribute")} items={items} />
		</li>
	);
}

function AboutNavMenu(): ReactNode {
	const t = useTranslations();
	const items = useAboutNavItems();

	return (
		<li className={css["nav-item"]}>
			<NavigationMenu label={t("common.pages.about")} items={items} />
		</li>
	);
}

function Separator(): ReactNode {
	return <li role="separator" className={css["nav-separator"]} />;
}
