import { createUrlSearchParams } from "@stefanprobst/request";
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";
import {
	Button as AriaButton,
	Dialog as AriaDialog,
	DialogTrigger as AriaDialogTrigger,
	Disclosure as AriaDisclosure,
	DisclosurePanel as AriaDisclosurePanel,
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	MenuTrigger as AriaMenuTrigger,
	Modal as AriaModal,
	ModalOverlay as AriaModalOverlay,
	Popover as AriaPopover,
	Separator as AriaSeparator,
} from "react-aria-components";

import { useCurrentUser } from "@/data/sshoc/hooks/auth";
import { useAuth } from "@/lib/core/auth/useAuth";
import { usePathname } from "@/lib/core/navigation/usePathname";
import { useAboutNavItems } from "@/lib/core/page/useAboutNavItems";
import { useBrowseNavItems } from "@/lib/core/page/useBrowseNavItems";
import { useContributeNavItems } from "@/lib/core/page/useContributeNavItems";
import { useCreateItemLinks } from "@/lib/core/page/useCreateItemLinks";
import { useItemCategoryNavItems } from "@/lib/core/page/useItemCategoryNavItems";
import Logo from "@/public/assets/images/logo-with-text.svg";

export interface NavigationLink {
	type: "link";
	label: string;
	href: string;
}

export interface NavigationAction {
	type: "action";
	label: string;
	onAction: () => void;
}

export interface NavigationSeparator {
	type: "separator";
}

export interface NavigationMenu {
	type: "menu";
	label: string;
	children: Array<NavigationLink | NavigationAction | NavigationSeparator>;
}

export type NavigationItem =
	| NavigationLink
	| NavigationAction
	| NavigationSeparator
	| NavigationMenu;

export function PageNavigation(): ReactNode {
	const t = useTranslations();

	const itemCategoryNavItems = useItemCategoryNavItems();
	const browseNavItems = useBrowseNavItems();
	const contributeNavItems = useContributeNavItems();
	const aboutNavItems = useAboutNavItems();

	const items: Array<NavigationItem> = [
		...itemCategoryNavItems,
		{ type: "separator" },
		{
			type: "menu",
			label: t("common.pages.browse"),
			children: browseNavItems,
		},
		{ type: "separator" },
		{
			type: "menu",
			label: t("common.pages.contribute"),
			children: contributeNavItems,
		},
		{
			type: "menu",
			label: t("common.pages.about"),
			children: aboutNavItems,
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

														case "action": {
															return (
																<AriaMenuItem
																	className="flex border-l-4 border-neutral-200 px-8 py-6 text-primary-700 hover:border-primary-600 hover:bg-neutral-50 hover:text-primary-600 focus-visible:border-primary-600 focus-visible:bg-neutral-50 focus-visible:text-primary-600"
																	key={index}
																	onAction={item.onAction}
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

export function MobileNavigationMenu(): ReactNode {
	const t = useTranslations();
	// const router = useRouter();
	const pathname = usePathname();
	const { isSignedIn, signOut } = useAuth();
	const currentUser = useCurrentUser();

	const itemCategoryNavItems = useItemCategoryNavItems();
	const createItemLinks = useCreateItemLinks();
	const browseNavItems = useBrowseNavItems();
	const contributeNavItems = useContributeNavItems();
	const aboutNavItems = useAboutNavItems();

	// useEffect(() => {
	// 	router.events.on("routeChangeStart", state.close);
	// 	window.addEventListener("resize", state.close, { passive: true });

	// 	return () => {
	// 		router.events.off("routeChangeStart", state.close);
	// 		window.removeEventListener("resize", state.close);
	// 	};
	// }, [router.events, state.close]);

	const items: Array<NavigationItem> = [
		...((!isSignedIn || currentUser.data == null
			? [
					{
						type: "link",
						label: t("common.auth.sign-in"),
						href: `/auth/sign-in`,
					},
				]
			: [
					{
						type: "menu",
						label: t("common.auth.account-menu-message", {
							username: currentUser.data.displayName,
						}),
						children: [
							{
								type: "link",
								label: t("common.pages.account"),
								href: `/account`,
							},
							{
								type: "action",
								label: t("common.auth.sign-out"),
								onAction() {
									signOut();
								},
							},
						],
					},
				]) satisfies Array<NavigationItem>),
		{ type: "separator" },
		...itemCategoryNavItems,
		...((isSignedIn
			? [
					{
						type: "menu",
						label: t("common.create-new-items"),
						children: createItemLinks,
					},
				]
			: []) satisfies Array<NavigationItem>),
		{ type: "separator" },
		{
			type: "menu",
			label: t("common.pages.browse"),
			children: browseNavItems,
		},
		{ type: "separator" },
		{
			type: "menu",
			label: t("common.pages.contribute"),
			children: contributeNavItems,
		},
		{
			type: "menu",
			label: t("common.pages.about"),
			children: aboutNavItems,
		},
		{ type: "separator" },
		{
			type: "link",
			label: t("common.report-issue"),
			href: `/contact?${createUrlSearchParams({
				email: currentUser.data?.email,
				subject: t("common.report-issue"),
				message: t("common.report-issue-message", { pathname }),
			})}`,
		},
	];

	return (
		<nav className="my-2 flex items-center justify-end gap-8 [grid-area:main-nav]">
			<AriaDialogTrigger>
				<AriaButton
					aria-label={t("common.navigation-menu")}
					className="to-primay-600 bg-gradient-to-r from-primary-750 p-2.5"
				>
					<MenuIcon aria-hidden={true} className="size-10" />
				</AriaButton>
				<AriaModalOverlay className="fixed inset-0 z-10 flex animate-fade-in justify-end">
					<AriaModal className="flex w-128 max-w-full animate-slide-in-from-right flex-col overflow-hidden bg-neutral-50 shadow">
						<AriaDialog aria-label={t("common.navigation-menu")}>
							{({ close }) => {
								return (
									<Fragment>
										<header className="flex items-center justify-between gap-8 bg-neutral-100 py-4 pr-8 pl-4 text-primary-700">
											<div className="flex max-w-64 flex-1 leading-none">
												<Link aria-label={t("common.pages.home")} href="/" className="w-full">
													<Image src={Logo} alt="" priority />
												</Link>
											</div>
											<AriaButton
												className="focus-visible::text-primary-600 hover:text-primary-600"
												onPress={close}
											>
												<XIcon aria-hidden={true} className="size-10" />
												<span className="sr-only">{t("common.close")}</span>
											</AriaButton>
										</header>
										<div className="flex flex-col overflow-auto text-md">
											<nav className="py-0.5">
												<ul className="flex flex-col gap-y-1" role="list">
													{items.map((item, index) => {
														switch (item.type) {
															case "link": {
																return (
																	<li key={index} className="flex flex-col gap-1">
																		<Link
																			className="focus-visible::border-primary-600 focus-visible::bg-neutral-50 focus-visible::text-primary-600 flex border-l-4 border-neutral-200 px-8 py-6 leading-5.5 text-primary-700 outline-offset-0 hover:border-primary-600 hover:bg-neutral-50 hover:text-primary-600"
																			href={item.href}
																		>
																			{item.label}
																		</Link>
																	</li>
																);
															}

															case "action": {
																return (
																	<li key={index} className="flex flex-col gap-1">
																		<AriaButton
																			className="focus-visible::border-primary-600 focus-visible::bg-neutral-50 focus-visible::text-primary-600 flex border-l-4 border-neutral-200 px-8 py-6 leading-5.5 text-primary-700 outline-offset-0 hover:border-primary-600 hover:bg-neutral-50 hover:text-primary-600"
																			onPress={item.onAction}
																		>
																			{item.label}
																		</AriaButton>
																	</li>
																);
															}

															case "separator": {
																return (
																	<AriaSeparator
																		key={index}
																		elementType="li"
																		className="h-px w-full bg-neutral-150"
																	/>
																);
															}

															case "menu": {
																return (
																	<li key={index} className="flex flex-col gap-1">
																		<AriaDisclosure>
																			<AriaButton>
																				<span>{item.label}</span>
																				<ChevronDownIcon aria-hidden={true} className="size-4" />
																			</AriaButton>
																			<AriaDisclosurePanel>
																				<ul role="list">
																					{item.children.map((item, index) => {
																						switch (item.type) {
																							case "link": {
																								return (
																									<li key={index} className="flex flex-col gap-1">
																										<Link
																											href={item.href}
																											className="focus-visible::border-primary-600 focus-visible::bg-neutral-50 focus-visible::text-primary-600 flex border-l-4 border-neutral-200 px-8 py-6 leading-5.5 text-neutral-0 outline-offset-0 hover:border-primary-600 hover:bg-neutral-50 hover:text-primary-600"
																										>
																											{item.label}
																										</Link>
																									</li>
																								);
																							}

																							case "action": {
																								return (
																									<li key={index} className="flex flex-col gap-1">
																										<AriaButton
																											className="focus-visible::border-primary-600 focus-visible::bg-neutral-50 focus-visible::text-primary-600 flex border-l-4 border-neutral-200 px-8 py-6 leading-5.5 text-neutral-0 outline-offset-0 hover:border-primary-600 hover:bg-neutral-50 hover:text-primary-600"
																											onPress={item.onAction}
																										>
																											{item.label}
																										</AriaButton>
																									</li>
																								);
																							}

																							case "separator": {
																								return (
																									<AriaSeparator
																										key={index}
																										elementType="li"
																										className="h-px w-full bg-neutral-150"
																									/>
																								);
																							}
																						}
																					})}
																				</ul>
																			</AriaDisclosurePanel>
																		</AriaDisclosure>
																	</li>
																);
															}
														}
													})}
												</ul>
											</nav>
										</div>
									</Fragment>
								);
							}}
						</AriaDialog>
					</AriaModal>
				</AriaModalOverlay>
			</AriaDialogTrigger>
		</nav>
	);
}
