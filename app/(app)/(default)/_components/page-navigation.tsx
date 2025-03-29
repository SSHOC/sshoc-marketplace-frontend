"use client";

import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { type ComponentPropsWithRef, Fragment, type ReactNode } from "react";
import { chain } from "react-aria";
import {
	Button,
	Disclosure,
	DisclosurePanel,
	Heading,
	Menu,
	MenuItem,
	type MenuItemProps,
	MenuTrigger,
	Popover,
	Separator,
} from "react-aria-components";

import { Image } from "@/components/image";
import { NavLink } from "@/components/nav-link";
import { Drawer, DrawerHeader, DrawerTrigger, Modal, ModalOverlay } from "@/components/ui/drawer";
import { IconButton } from "@/components/ui/icon-button";
import { TouchTarget } from "@/components/ui/touch-target";
import {
	type NavigationItem,
	type NavigationLink,
	usePathname,
	useRouter,
} from "@/lib/navigation/navigation";
import { isCurrentPage } from "@/lib/navigation/use-nav-link";
import logo from "@/public/assets/images/logo-with-text.svg";

interface PageNavigationProps {
	label: string;
	navigation: Record<string, NavigationItem> & { home: NavigationLink };
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
										className="flex items-center gap-x-2 rounded-t-sm p-6 text-center text-sm text-brand-700 transition hover:bg-neutral-50 hover:text-brand-600 pressed:bg-brand-600 pressed:text-neutral-0"
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
										<Button className="flex items-center gap-x-2 rounded-t-sm p-6 text-center text-sm text-brand-700 transition hover:bg-neutral-50 hover:text-brand-600 pressed:bg-brand-600 pressed:text-neutral-0">
											{item.label}
											<ChevronDownIcon aria-hidden={true} className="-mr-1 size-4 shrink-0" />
										</Button>
										<Popover
											className="min-w-(--trigger-width) rounded-sm border border-neutral-150 bg-neutral-0 shadow entering:animate-popover-bottom-in exiting:animate-popover-bottom-out"
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
																	className="flex border-l-4 border-neutral-200 px-8 py-6 text-sm text-brand-700 transition hover:border-brand-600 hover:bg-neutral-50 hover:text-brand-600"
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

interface PageNavigationMobileProps {
	label: string;
	menuCloseLabel: string;
	menuOpenLabel: string;
	menuTitleLabel: string;
	navigation: Record<string, NavigationItem> & { home: NavigationLink };
}

export function PageNavigationMobile(props: Readonly<PageNavigationMobileProps>): ReactNode {
	const { label, menuCloseLabel, menuOpenLabel, menuTitleLabel, navigation } = props;

	return (
		<DrawerTrigger>
			<nav aria-label={label}>
				<IconButton className="size-9" kind="gradient" label={menuOpenLabel} size="small">
					<MenuIcon aria-hidden={true} className="shrink-0" data-slot="icon" />
					<TouchTarget />
				</IconButton>
			</nav>

			<ModalOverlay isDismissable={true}>
				<Modal size="large">
					<Drawer aria-label={menuTitleLabel} className="bg-neutral-50">
						{({ close }) => {
							return (
								<Fragment>
									<DrawerHeader className="bg-neutral-75">
										<NavLink
											className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-brand-600"
											href={navigation.home.href}
										>
											<Image alt="" className="h-16 w-auto shrink-0" priority={true} src={logo} />
											<span className="sr-only">{navigation.home.label}</span>
										</NavLink>

										<IconButton kind="text" label={menuCloseLabel} slot="close">
											<XIcon aria-hidden={true} className="size-8 shrink-0" />
										</IconButton>
									</DrawerHeader>

									<div className="overflow-y-auto">
										<ul role="list">
											{Object.entries(navigation).map(([id, item]) => {
												if (id === "home") {
													return null;
												}

												switch (item.type) {
													case "link": {
														return (
															<li key={id}>
																<NavLinkMobile
																	className="flex border-l-4 border-neutral-200 px-8 py-6 text-sm text-brand-700 transition hover:border-brand-600 hover:bg-neutral-50 hover:text-brand-600"
																	close={close}
																	href={item.href}
																>
																	{item.label}
																</NavLinkMobile>
															</li>
														);
													}

													case "menu": {
														return (
															<li key={id}>
																<Disclosure className="group">
																	<Heading>
																		<Button
																			className="flex w-full justify-between border-l-4 border-neutral-200 px-8 py-6 text-sm text-brand-700 transition group-expanded:bg-brand-600 group-expanded:text-neutral-0 hover:border-brand-600 hover:bg-neutral-50 hover:text-brand-600 group-expanded:hover:bg-brand-600 group-expanded:hover:text-neutral-0"
																			slot="trigger"
																		>
																			{item.label}
																			<ChevronDownIcon
																				aria-hidden={true}
																				className="size-4 shrink-0 transition group-expanded:rotate-180"
																				data-slot="icon"
																			/>
																		</Button>
																	</Heading>
																	<DisclosurePanel className="bg-neutral-0">
																		<ul role="list">
																			{Object.entries(item.children).map(([id, item]) => {
																				switch (item.type) {
																					case "link": {
																						return (
																							<li key={id}>
																								<NavLinkMobile
																									className="flex border-l-4 border-neutral-200 px-8 py-6 text-sm text-brand-700 transition hover:border-brand-600 hover:bg-neutral-50 hover:text-brand-600"
																									close={close}
																									href={item.href}
																								>
																									{item.label}
																								</NavLinkMobile>
																							</li>
																						);
																					}

																					case "separator": {
																						return (
																							<li key={id}>
																								<Separator
																									key={id}
																									className="my-1 w-full border-t border-neutral-150"
																								/>
																							</li>
																						);
																					}
																				}
																			})}
																		</ul>
																	</DisclosurePanel>
																</Disclosure>
															</li>
														);
													}

													case "separator": {
														return (
															<li key={id}>
																<Separator
																	key={id}
																	className="my-1 w-full border-t border-neutral-150"
																/>
															</li>
														);
													}
												}
											})}
										</ul>
									</div>
								</Fragment>
							);
						}}
					</Drawer>
				</Modal>
			</ModalOverlay>
		</DrawerTrigger>
	);
}

interface NavLinkMobileProps extends Omit<ComponentPropsWithRef<typeof NavLink>, "onPress"> {
	close: () => void;
}

function NavLinkMobile(props: NavLinkMobileProps): ReactNode {
	const { children, close, ...rest } = props;

	return (
		<NavLink
			{...rest}
			onPress={() => {
				/**
				 * `next/link` does not support pointer events, and `click`
				 * fires after react aria components' `press` events, therefore
				 * we delay closing the dialog so the navigation is guaranteed to
				 * be triggered. practically, this seems only relevant for
				 * firefox on touch devices.
				 *
				 * maybe unnecessary after @see https://github.com/adobe/react-spectrum/pull/7542
				 */
				requestAnimationFrame(close);
			}}
		>
			{children}
		</NavLink>
	);
}
