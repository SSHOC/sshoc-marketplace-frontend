import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
	Button as AriaButton,
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	MenuTrigger as AriaMenuTrigger,
	Popover as AriaPopover,
	Separator as AriaSeparator,
} from "react-aria-components";

import { useAboutNavItems } from "@/lib/core/page/useAboutNavItems";
import { useBrowseNavItems } from "@/lib/core/page/useBrowseNavItems";
import { useContributeNavItems } from "@/lib/core/page/useContributeNavItems";
import { useItemCategoryNavItems } from "@/lib/core/page/useItemCategoryNavItems";

interface NavigationLink {
	type: "link";
	label: string;
	href: string;
}

interface NavigationSeparator {
	type: "separator";
}

interface NavigationMenu {
	type: "menu";
	label: string;
	children: Array<NavigationLink | NavigationSeparator>;
}

type NavigationItem = NavigationLink | NavigationSeparator | NavigationMenu;

export function PageNavigation(): ReactNode {
	const t = useTranslations();

	const items: Array<NavigationItem> = [
		...useItemCategoryNavItems(),
		{ type: "separator" },
		{
			type: "menu",
			label: t("common.pages.browse"),
			children: useBrowseNavItems(),
		},
		{ type: "separator" },
		{
			type: "menu",
			label: t("common.pages.contribute"),
			children: useContributeNavItems(),
		},
		{
			type: "menu",
			label: t("common.pages.about"),
			children: useAboutNavItems(),
		},
	];

	return (
		<nav className="hidden [grid-area:main-nav] xl:block">
			<ul className="flex justify-end text-center text-sm" role="list">
				{items.map((item, index) => {
					switch (item.type) {
						case "link": {
							return (
								<li key={index} className="inline-flex">
									<Link
										className="inline-flex items-center rounded-t-sm p-6 text-primary-700 hover:bg-neutral-50 hover:text-primary-600 focus-visible:bg-neutral-50 focus-visible:text-primary-600"
										href={item.href}
									>
										{item.label}
									</Link>
								</li>
							);
						}

						case "separator": {
							return (
								<AriaSeparator
									key={index}
									elementType="li"
									className="mx-2 h-4 w-px self-center bg-neutral-150"
									orientation="vertical"
								/>
							);
						}

						case "menu": {
							return (
								<li key={index} className="relative inline-flex">
									<AriaMenuTrigger>
										<AriaButton className="group inline-flex items-center gap-x-3 rounded-t-sm p-6 text-primary-700 hover:bg-neutral-50 hover:text-primary-700 focus-visible:bg-neutral-50 focus-visible:text-primary-700 aria-expanded:bg-primary-600 aria-expanded:text-neutral-0">
											{item.label}
											<ChevronDownIcon
												aria-hidden={true}
												className="size-4 group-aria-expanded:rotate-180"
											/>
										</AriaButton>
										<AriaPopover offset={8} placement="bottom">
											<AriaMenu className="flex w-max min-w-96 flex-col gap-y-1 rounded-sm border border-neutral-200 bg-neutral-0 py-1 text-md shadow">
												{item.children.map((item, index) => {
													switch (item.type) {
														case "link": {
															return (
																<AriaMenuItem
																	className="flex border-l-4 border-neutral-200 px-8 py-6 text-primary-700 hover:border-primary-600 hover:bg-neutral-50 hover:text-primary-600 focus-visible:border-primary-600 focus-visible:bg-neutral-50 focus-visible:text-primary-600"
																	key={index}
																	href={item.href}
																>
																	{item.label}
																</AriaMenuItem>
															);
														}

														case "separator": {
															return (
																<AriaSeparator
																	orientation="horizontal"
																	className="my-2 h-px w-full bg-neutral-150"
																	key={index}
																/>
															);
														}
													}
												})}
											</AriaMenu>
										</AriaPopover>
									</AriaMenuTrigger>
								</li>
							);
						}
					}
				})}
			</ul>
		</nav>
	);
}
