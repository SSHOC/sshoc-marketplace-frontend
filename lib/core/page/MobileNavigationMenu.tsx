import { createUrlSearchParams } from "@stefanprobst/request";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useEffect } from "react";
import {
	Button as AriaButton,
	Dialog as AriaDialog,
	DialogTrigger as AriaDialogTrigger,
	Modal as AriaModal,
	ModalOverlay as AriaModalOverlay,
} from "react-aria-components";

import { NavLink } from "@/components/common/NavLink";
import { useCurrentUser } from "@/data/sshoc/hooks/auth";
import { useAuth } from "@/lib/core/auth/useAuth";
import { usePathname } from "@/lib/core/navigation/usePathname";
import { Disclosure } from "@/lib/core/page/Disclosure";
import css from "@/lib/core/page/MobileNavigationMenu.module.css";
import dialogStyles from "@/lib/core/page/ModalDialog.module.css";
import { useAboutNavItems } from "@/lib/core/page/useAboutNavItems";
import { useBrowseNavItems } from "@/lib/core/page/useBrowseNavItems";
import { useContributeNavItems } from "@/lib/core/page/useContributeNavItems";
import { useCreateItemLinks } from "@/lib/core/page/useCreateItemLinks";
import { useItemCategoryNavItems } from "@/lib/core/page/useItemCategoryNavItems";
import { Button } from "@/lib/core/ui/Button/Button";
import { CloseButton } from "@/lib/core/ui/CloseButton/CloseButton";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import MenuIcon from "@/lib/core/ui/icons/menu.svg?symbol-icon";
import Logo from "@/public/assets/images/logo-with-text.svg";

export function MobileNavigationMenu(): ReactNode {
	return (
		<nav className={css["container"]}>
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
				color="gradient"
				style={{
					"--button-padding-inline": "var(--space-2-5)",
					"--button-padding-block": "var(--space-2-5)",
				}}
			>
				<Icon icon={MenuIcon} />
			</AriaButton>
			<AriaModalOverlay className={dialogStyles["backdrop"]}>
				<AriaModal className={dialogStyles["container"]}>
					<AriaDialog aria-label={t("common.navigation-menu")}>
						{({ close }) => {
							return (
								<Fragment>
									<header className={css["header"]}>
										<div className={css["home-link"]}>
											<NavLink aria-label={t("common.pages.home")} href="/">
												<Image src={Logo} alt="" priority />
											</NavLink>
										</div>
										<CloseButton autoFocus onPress={close} size="lg" />
									</header>
									<div className={css["content"]}>
										<nav className={css["main-nav"]}>
											<ul className={css["nav-items"]} role="list">
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
												<li className={css["nav-item"]}>
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
			<li className={css["nav-item"]}>
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
		<li className={css["nav-item"]}>
			<Disclosure
				label={t("common.auth.account-menu-message", {
					username: currentUser.data.displayName,
				})}
				className={css["nav-link-disclosure-button"]}
			>
				<ul role="list">
					{items.map((item) => {
						return (
							<li className={css["nav-item"]} key={item.id}>
								<NavLink href={item.href} variant="nav-mobile-menu-link-secondary">
									{item.label}
								</NavLink>
							</li>
						);
					})}
					<li className={css["nav-item"]}>
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
					<li className={css["nav-item"]} key={item.id}>
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
		<li className={css["nav-item"]}>
			<Disclosure label={t("common.pages.browse")} className={css["nav-link-disclosure-button"]}>
				<ul role="list">
					{items.map((item) => {
						return (
							<li className={css["nav-item"]} key={item.id}>
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
		<li className={css["nav-item"]}>
			<Disclosure
				label={t("common.pages.contribute")}
				className={css["nav-link-disclosure-button"]}
			>
				<ul role="list">
					{items.map((item) => {
						return (
							<li className={css["nav-item"]} key={item.id}>
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
		<li className={css["nav-item"]}>
			<Disclosure label={t("common.pages.about")} className={css["nav-link-disclosure-button"]}>
				<ul role="list">
					{items.map((item) => {
						return (
							<li className={css["nav-item"]} key={item.id}>
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
		<li className={css["nav-item"]}>
			<Disclosure
				label={t("common.create-new-items")}
				className={css["nav-link-disclosure-button"]}
			>
				<ul role="list">
					{items.map((item) => {
						return (
							<li className={css["nav-item"]} key={item.id}>
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
	return <li role="separator" className={css["nav-separator"]} />;
}
