import { createUrlSearchParams } from "@stefanprobst/request";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useEffect } from "react";
import {
	Button as AriaButton,
	Dialog as AriaDialog,
	DialogTrigger as AriaDialogTrigger,
	Modal as AriaModal,
	ModalOverlay as AriaModalOverlay,
	Separator as AriaSeparator,
} from "react-aria-components";

import { NavLink } from "@/components/common/NavLink";
import { useCurrentUser } from "@/data/sshoc/hooks/auth";
import { useAuth } from "@/lib/core/auth/useAuth";
import { usePathname } from "@/lib/core/navigation/usePathname";
import { Disclosure } from "@/lib/core/page/Disclosure";
import { useAboutNavItems } from "@/lib/core/page/useAboutNavItems";
import { useBrowseNavItems } from "@/lib/core/page/useBrowseNavItems";
import { useContributeNavItems } from "@/lib/core/page/useContributeNavItems";
import { useCreateItemLinks } from "@/lib/core/page/useCreateItemLinks";
import { useItemCategoryNavItems } from "@/lib/core/page/useItemCategoryNavItems";
import { Button } from "@/lib/core/ui/Button/Button";
import Logo from "@/public/assets/images/logo-with-text.svg";

export function MobileNavigationMenu(): ReactNode {
	return (
		<nav className="my-2 flex items-center justify-end gap-8 [grid-area:main-nav]">
			<NavigationMenu />
		</nav>
	);
}

function NavigationMenu(): ReactNode {
	const t = useTranslations();
	const { isSignedIn } = useAuth();

	// const router = useRouter();
	const pathname = usePathname();
	const currentUser = useCurrentUser();

	// useEffect(() => {
	// 	router.events.on("routeChangeStart", state.close);
	// 	window.addEventListener("resize", state.close, { passive: true });

	// 	return () => {
	// 		router.events.off("routeChangeStart", state.close);
	// 		window.removeEventListener("resize", state.close);
	// 	};
	// }, [router.events, state.close]);

	return (
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
												<AuthLinks onClose={close} />
												<Separator />
												<ItemCategoryNavLinks />
												<Separator />
												{isSignedIn ? (
													<Fragment>
														<CreateItemLinks />
														<Separator />
													</Fragment>
												) : null}
												<BrowseNavLinks />
												<Separator />
												<ContributeNavLinks />
												<AboutNavLinks />
												<Separator />
												<li className="flex flex-col gap-1">
													<NavLink
														variant="nav-mobile-menu-link"
														href={`/contact?${createUrlSearchParams({
															email: currentUser.data?.email,
															subject: t("common.report-issue"),
															message: t("common.report-issue-message", { pathname }),
														})}`}
													>
														{t("common.report-issue")}
													</NavLink>
												</li>
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
	);
}

interface AuthLinksProps {
	onClose: () => void;
}

function AuthLinks(props: AuthLinksProps): ReactNode {
	const { onClose } = props;

	const t = useTranslations();
	const { isSignedIn, signOut } = useAuth();
	const currentUser = useCurrentUser();

	function onSignOut() {
		onClose();
		signOut();
	}

	if (!isSignedIn || currentUser.data == null) {
		const item = { href: `/auth/sign-in`, label: t("common.auth.sign-in") };

		return (
			<li className="flex flex-col gap-1">
				<NavLink href={item.href} variant="nav-mobile-menu-link">
					{item.label}
				</NavLink>
			</li>
		);
	}

	const items = [{ id: "account", href: `/account`, label: t("common.pages.account") }] as Array<{
		href: string;
		label: string;
		id: string;
	}>;

	return (
		<li className="flex flex-col gap-1">
			<Disclosure
				label={t("common.auth.account-menu-message", {
					username: currentUser.data.displayName,
				})}
				className="flex items-center justify-between border-l-4 border-neutral-200 bg-neutral-50 px-8 py-6 leading-5.5 text-primary-600 text-primary-700 outline-offset-0 hover:border-primary-600 focus-visible:border-primary-600 focus-visible:bg-neutral-50 focus-visible:text-primary-600 expanded:border-primary-750 expanded:bg-primary-600 expanded:text-neutral-0"
			>
				<ul role="list">
					{items.map((item) => {
						return (
							<li className="flex flex-col gap-1" key={item.id}>
								<NavLink href={item.href} variant="nav-mobile-menu-link-secondary">
									{item.label}
								</NavLink>
							</li>
						);
					})}
					<li className="flex flex-col gap-1">
						<Button onPress={onSignOut} variant="nav-mobile-menu-link-secondary">
							{t("common.auth.sign-out")}
						</Button>
					</li>
				</ul>
			</Disclosure>
		</li>
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
					<li className="flex flex-col gap-1" key={item.id}>
						<NavLink href={item.href} variant="nav-mobile-menu-link">
							{item.label}
						</NavLink>
					</li>
				);
			})}
		</Fragment>
	);
}

function BrowseNavLinks(): ReactNode {
	const t = useTranslations();
	const items = useBrowseNavItems();

	return (
		<li className="flex flex-col gap-1">
			<Disclosure
				label={t("common.pages.browse")}
				className="flex items-center justify-between border-l-4 border-neutral-200 bg-neutral-50 px-8 py-6 leading-5.5 text-primary-600 text-primary-700 outline-offset-0 hover:border-primary-600 focus-visible:border-primary-600 focus-visible:bg-neutral-50 focus-visible:text-primary-600 expanded:border-primary-750 expanded:bg-primary-600 expanded:text-neutral-0"
			>
				<ul role="list">
					{items.map((item) => {
						return (
							<li className="flex flex-col gap-1" key={item.id}>
								<NavLink href={item.href} variant="nav-mobile-menu-link-secondary">
									{item.label}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</Disclosure>
		</li>
	);
}

function ContributeNavLinks(): ReactNode {
	const t = useTranslations();
	const items = useContributeNavItems();

	return (
		<li className="flex flex-col gap-1">
			<Disclosure
				label={t("common.pages.contribute")}
				className="flex items-center justify-between border-l-4 border-neutral-200 bg-neutral-50 px-8 py-6 leading-5.5 text-primary-600 text-primary-700 outline-offset-0 hover:border-primary-600 focus-visible:border-primary-600 focus-visible:bg-neutral-50 focus-visible:text-primary-600 expanded:border-primary-750 expanded:bg-primary-600 expanded:text-neutral-0"
			>
				<ul role="list">
					{items.map((item) => {
						return (
							<li className="flex flex-col gap-1" key={item.id}>
								<NavLink href={item.href} variant="nav-mobile-menu-link-secondary">
									{item.label}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</Disclosure>
		</li>
	);
}

function AboutNavLinks(): ReactNode {
	const t = useTranslations();
	const items = useAboutNavItems();

	return (
		<li className="flex flex-col gap-1">
			<Disclosure
				label={t("common.pages.about")}
				className="flex items-center justify-between border-l-4 border-neutral-200 bg-neutral-50 px-8 py-6 leading-5.5 text-primary-600 text-primary-700 outline-offset-0 hover:border-primary-600 focus-visible:border-primary-600 focus-visible:bg-neutral-50 focus-visible:text-primary-600 expanded:border-primary-750 expanded:bg-primary-600 expanded:text-neutral-0"
			>
				<ul role="list">
					{items.map((item) => {
						return (
							<li className="flex flex-col gap-1" key={item.id}>
								<NavLink href={item.href} variant="nav-mobile-menu-link-secondary">
									{item.label}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</Disclosure>
		</li>
	);
}

function CreateItemLinks(): ReactNode {
	const t = useTranslations();
	const items = useCreateItemLinks();

	if (items == null) {
		return null;
	}

	return (
		<li className="flex flex-col gap-1">
			<Disclosure
				label={t("common.create-new-items")}
				className="flex items-center justify-between border-l-4 border-neutral-200 bg-neutral-50 px-8 py-6 leading-5.5 text-primary-600 text-primary-700 outline-offset-0 hover:border-primary-600 focus-visible:border-primary-600 focus-visible:bg-neutral-50 focus-visible:text-primary-600 expanded:border-primary-750 expanded:bg-primary-600 expanded:text-neutral-0"
			>
				<ul role="list">
					{items.map((item) => {
						return (
							<li className="flex flex-col gap-1" key={item.id}>
								<NavLink href={item.href} variant="nav-mobile-menu-link-secondary">
									{item.label}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</Disclosure>
		</li>
	);
}

function Separator(): ReactNode {
	return <AriaSeparator elementType="li" className="h-px w-full bg-neutral-150" />;
}
