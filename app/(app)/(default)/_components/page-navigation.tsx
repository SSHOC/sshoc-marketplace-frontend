"use client";

import { ChevronDownIcon, MenuIcon } from "lucide-react";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import type { ReactNode } from "react";
import { chain } from "react-aria";
import {
	Button,
	DialogTrigger,
	Menu,
	MenuItem,
	type MenuItemProps,
	MenuTrigger,
	Popover,
	Separator,
} from "react-aria-components";

import { NavLink, type NavLinkProps } from "@/components/nav-link";
import { usePathname, useRouter } from "@/lib/navigation/navigation";
import { isCurrentPage } from "@/lib/navigation/use-nav-link";

interface NavigationLink {
	type: "link";
	href: NonNullable<NavLinkProps["href"]>;
	label: string;
}

interface NavigationSeparator {
	type: "separator";
}

interface NavigationMenu {
	type: "menu";
	label: string;
	children: Record<string, NavigationLink | NavigationSeparator>;
}

export type NavigationItem = NavigationLink | NavigationSeparator | NavigationMenu;

interface PageNavigationProps {
	label: string;
	navigation: Record<string, NavigationItem>;
}

export function PageNavigation(props: Readonly<PageNavigationProps>): ReactNode {
	const { label, navigation } = props;

	const pathname = usePathname();

	return (
		<nav aria-label={label}>
			<ul className="flex flex-wrap" role="list">
				{Object.entries(navigation).map(([id, item]) => {
					if (id === "home") {
						return null;
					}

					switch (item.type) {
						case "link": {
							return (
								<li key={id}>
									<NavLink
										className="flex items-center gap-x-2 p-6 text-center text-sm text-primary-700 transition hover:bg-neutral-50 hover:text-primary-600 pressed:bg-primary-600 pressed:text-neutral-0"
										href={item.href}
									>
										{item.label}
									</NavLink>
								</li>
							);
						}

						case "menu": {
							/**
							 * Menu items are not announced as links, so we should use selection state
							 * instead of `aria-current`. Unfortunately, we cannot set selection state
							 * on individual menu items, but only on the menu itself.
							 *
							 * @see https://github.com/adobe/react-spectrum/issues/7587
							 */
							const selectedKeys = new Set<string>();
							Object.entries(item.children).forEach(([id, item]) => {
								if (item.type === "link" && isCurrentPage(item.href, pathname)) {
									selectedKeys.add(id);
								}
							});

							return (
								<li key={id}>
									<MenuTrigger>
										<Button className="flex items-center gap-x-2 p-6 text-center text-sm text-primary-700 transition hover:bg-neutral-50 hover:text-primary-600 pressed:bg-primary-600 pressed:text-neutral-0">
											{item.label}
											<ChevronDownIcon aria-hidden={true} className="-mr-1 size-4 shrink-0" />
										</Button>
										<Popover
											className="min-w-(--trigger-width) rounded-sm border border-neutral-200 bg-neutral-0 shadow entering:animate-popover-bottom-in exiting:animate-popover-bottom-out"
											placement="bottom right"
										>
											<Menu
												className="flex max-h-[inherit] min-w-96 flex-col overflow-auto py-1"
												selectedKeys={selectedKeys}
											>
												{Object.entries(item.children).map(([id, item]) => {
													switch (item.type) {
														case "link": {
															return (
																<NavigationMenuItem
																	key={id}
																	className="flex border-l-4 border-neutral-200 px-8 py-6 text-sm text-primary-700 transition hover:border-primary-600 hover:bg-neutral-50 hover:text-primary-600"
																	href={item.href}
																	textValue={item.label}
																>
																	{item.label}
																</NavigationMenuItem>
															);
														}

														case "separator": {
															return (
																<Separator
																	key={id}
																	className="my-1 w-full border-b border-neutral-200"
																/>
															);
														}
													}
												})}
											</Menu>
										</Popover>
									</MenuTrigger>
								</li>
							);
						}

						case "separator": {
							return (
								<Separator
									key={id}
									className="mx-1 h-full border-l border-neutral-200"
									elementType="li"
									orientation="vertical"
								/>
							);
						}
					}
				})}
			</ul>
		</nav>
	);
}

interface NavigationMenuItemProps extends MenuItemProps {
	href: string;
}

function NavigationMenuItem(props: Readonly<NavigationMenuItemProps>): ReactNode {
	const { href, onHoverStart } = props;

	const router = useRouter();

	/**
	 * Adds prefetch behavior similar to `next/link`.
	 *
	 * @see https://github.com/vercel/next.js/discussions/73381
	 *
	 * @see https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/Link.tsx
	 * @see https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/link/src/useLink.ts
	 */
	function prefetch() {
		router.prefetch(href, { kind: PrefetchKind.AUTO });
	}

	return (
		<MenuItem
			{...props}
			// @ts-expect-error @see https://github.com/adobe/react-spectrum/issues/7453
			onFocus={chain(prefetch, props.onFocus)}
			onHoverStart={chain(prefetch, onHoverStart)}
		/>
	);
}

interface AppNavigationMobileProps {
	label: string;
	menuCloseLabel: string;
	menuOpenLabel: string;
	menuTitleLabel: string;
	navigation: Record<string, NavigationItem>;
}

export function AppNavigationMobile(props: Readonly<AppNavigationMobileProps>): ReactNode {
	const { label, menuCloseLabel, menuOpenLabel, menuTitleLabel, navigation } = props;

	return (
		<DialogTrigger>
			<nav aria-label={label}>
				<Button className="">
					<MenuIcon aria-hidden={true} className="size-6 shrink-0" />
					<span className="sr-only">{menuOpenLabel}</span>
				</Button>
			</nav>
		</DialogTrigger>
	);
}
