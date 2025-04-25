import { Item } from "@react-stately/collections";
import { useRouter } from "next/router";
import { Fragment } from "react";

import { NavLink } from "@/components/common/NavLink";
import { useI18n } from "@/lib/core/i18n/useI18n";
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
	const { t } = useI18n<"common">();
	const items = useBrowseNavItems();
	const router = useRouter();

	return (
		<li className={css["nav-item"]}>
			<NavigationMenu label={t(["common", "pages", "browse"])} items={items}>
				{(item) => {
					const props = {
						href: item.href,
						onAction() {
							router.push(item.href);
						},
					};

					return <Item {...props}>{item.label}</Item>;
				}}
			</NavigationMenu>
		</li>
	);
}

function ContributeNavMenu(): ReactNode {
	const { t } = useI18n<"common">();
	const items = useContributeNavItems();
	const router = useRouter();

	return (
		<li className={css["nav-item"]}>
			<NavigationMenu label={t(["common", "pages", "contribute"])} items={items}>
				{(item) => {
					const props = {
						href: item.href,
						onAction() {
							router.push(item.href);
						},
					};

					return <Item {...props}>{item.label}</Item>;
				}}
			</NavigationMenu>
		</li>
	);
}

function AboutNavMenu(): ReactNode {
	const { t } = useI18n<"common">();
	const items = useAboutNavItems();
	const router = useRouter();

	return (
		<li className={css["nav-item"]}>
			<NavigationMenu label={t(["common", "pages", "about"])} items={items}>
				{(item) => {
					const props = {
						href: item.href,
						onAction() {
							router.push(item.href);
						},
					};

					return <Item {...props}>{item.label}</Item>;
				}}
			</NavigationMenu>
		</li>
	);
}

function Separator(): ReactNode {
	return <li role="separator" className={css["nav-separator"]} />;
}
