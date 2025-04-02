import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { signOut } from "@/app/(app)/(default)/_client-actions/navigation";
import {
	PageNavigation,
	PageNavigationMobile,
} from "@/app/(app)/(default)/_components/page-navigation";
import { UserAccountMenu } from "@/app/(app)/(default)/_components/user-account-menu";
import { Image } from "@/components/image";
import { NavLink } from "@/components/nav-link";
import { ButtonNavLink } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/api/client";
import { createHref } from "@/lib/navigation/create-href";
import type { NavigationItem } from "@/lib/navigation/navigation";
import { isAuthenticated } from "@/lib/server/auth/session";
import logo from "@/public/assets/images/logo-with-text.svg";

export async function PageHeader(): Promise<ReactNode> {
	const t = await getTranslations("PageHeader");

	const authenticated = await isAuthenticated();

	const navigation = {
		home: {
			type: "link",
			href: createHref({
				pathname: "/",
			}),
			label: t("navigation.items.home"),
		},
		"tools-services": {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({
					categories: ["tool-or-service"],
				}),
			}),
			label: t("navigation.items.tools-services"),
		},
		"training-materials": {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({
					categories: ["training-material"],
				}),
			}),
			label: t("navigation.items.training-materials"),
		},
		publications: {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({
					categories: ["publication"],
				}),
			}),
			label: t("navigation.items.publications"),
		},
		datasets: {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({
					categories: ["dataset"],
				}),
			}),
			label: t("navigation.items.datasets"),
		},
		workflows: {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({
					categories: ["workflow"],
				}),
			}),
			label: t("navigation.items.workflows"),
		},
		"separator-1": {
			type: "separator",
		},
		browse: {
			type: "menu",
			label: t("navigation.items.browse"),
			children: {
				activities: {
					type: "link",
					href: createHref({
						pathname: "/browse/activities",
					}),
					label: t("navigation.items.browse-activities"),
				},
				keywords: {
					type: "link",
					href: createHref({
						pathname: "/browse/keywords",
					}),
					label: t("navigation.items.browse-keywords"),
				},
				sources: {
					type: "link",
					href: createHref({
						pathname: "/browse/sources",
					}),
					label: t("navigation.items.browse-sources"),
				},
				languages: {
					type: "link",
					href: createHref({
						pathname: "/browse/languages",
					}),
					label: t("navigation.items.browse-languages"),
				},
			},
		},
		"separator-2": {
			type: "separator",
		},
		contribute: {
			type: "menu",
			label: t("navigation.items.contribute"),
			children: {
				overview: {
					type: "link",
					href: createHref({
						pathname: "/contribute/overview",
					}),
					label: t("navigation.items.contribute-overview"),
				},
				create: {
					type: "link",
					href: createHref({
						pathname: "/contribute/create-an-individual-item",
					}),
					label: t("navigation.items.contribute-create"),
				},
				enrich: {
					type: "link",
					href: createHref({
						pathname: "/contribute/enrich-an-individual-item",
					}),
					label: t("navigation.items.contribute-enrich"),
				},
				issue: {
					type: "link",
					href: createHref({
						pathname: "/contribute/report-an-issue",
					}),
					label: t("navigation.items.contribute-issue"),
				},
				moderator: {
					type: "link",
					href: createHref({
						pathname: "/contribute/moderator-guidelines",
					}),
					label: t("navigation.items.contribute-moderator"),
				},
				administrator: {
					type: "link",
					href: createHref({
						pathname: "/contribute/administrator-guidelines",
					}),
					label: t("navigation.items.contribute-administrator"),
				},
				metadata: {
					type: "link",
					href: createHref({
						pathname: "/contribute/metadata-guidelines",
					}),
					label: t("navigation.items.contribute-metadata"),
				},
			},
		},
		about: {
			type: "menu",
			label: t("navigation.items.about"),
			children: {
				service: {
					type: "link",
					href: createHref({
						pathname: "/about/service",
					}),
					label: t("navigation.items.about-service"),
				},
				eosc: {
					type: "link",
					href: createHref({
						pathname: "/about/sshoc-eosc",
					}),
					label: t("navigation.items.about-eosc"),
				},
				data: {
					type: "link",
					href: createHref({
						pathname: "/about/data-population",
					}),
					label: t("navigation.items.about-data"),
				},
				team: {
					type: "link",
					href: createHref({
						pathname: "/about/team",
					}),
					label: t("navigation.items.about-team"),
				},
				docs: {
					type: "link",
					href: createHref({
						pathname: "/about/api-documentation",
					}),
					label: t("navigation.items.about-docs"),
				},
				implementation: {
					type: "link",
					href: createHref({
						pathname: "/about/implementation",
					}),
					label: t("navigation.items.about-implementation"),
				},
				faq: {
					type: "link",
					href: createHref({
						pathname: "/about/frequently-asked-questions",
					}),
					label: t("navigation.items.about-faq"),
				},
				communication: {
					type: "link",
					href: createHref({
						pathname: "/about/communication-kit",
					}),
					label: t("navigation.items.about-communication"),
				},
			},
		},
	} satisfies Record<string, NavigationItem>;

	const reportIssueLink = {
		type: "link",
		href: createHref({
			pathname: "/contact",
			searchParams: {
				subject: t("navigation.items.report-issue"),
				message: t("report-issue-message"),
			},
		}),
		label: t("navigation.items.report-issue"),
	} satisfies NavigationItem;

	const signInLink = {
		type: "link",
		href: createHref({
			pathname: "/auth/sign-in",
		}),
		label: t("navigation.items.sign-in"),
	} satisfies NavigationItem;

	const userAccountItems = {
		type: "menu",
		label: t("navigation-user-account.label"),
		children: {
			"user-account": {
				type: "link",
				href: createHref({
					pathname: "/account",
				}),
				label: t("navigation-user-account.items.user-account"),
			},
			"sign-out": {
				type: "action",
				onAction: signOut,
				label: t("navigation-user-account.items.sign-out"),
			},
		},
	} satisfies NavigationItem;

	const createItemsNavigation = {
		"tools-services": {
			type: "link",
			label: t("navigation-create-items.items.create-tools-services"),
			href: createHref({
				pathname: "/tools-services/new",
			}),
		},
		"training-materials": {
			type: "link",
			label: t("navigation-create-items.items.create-training-materials"),
			href: createHref({
				pathname: "/training-materials/new",
			}),
		},
		publications: {
			type: "link",
			label: t("navigation-create-items.items.create-publications"),
			href: createHref({
				pathname: "/publications/new",
			}),
		},
		datasets: {
			type: "link",
			label: t("navigation-create-items.items.create-datasets"),
			href: createHref({
				pathname: "/datasets/new",
			}),
		},
		workflows: {
			type: "link",
			label: t("navigation-create-items.items.create-workflows"),
			href: createHref({
				pathname: "/workflows/new",
			}),
		},
	} satisfies Record<string, NavigationItem>;

	return (
		<div className="isolate">
			<header className="isolate border-b border-neutral-150">
				<div className="mx-auto flex w-full max-w-[120rem] items-center justify-between gap-x-8 px-8">
					<NavLink
						className="shrink-0 rounded-sm py-4 focus-visible:outline-2 focus-visible:outline-brand-600"
						href={navigation.home.href}
					>
						<Image alt="" className="h-16 w-auto shrink-0" priority={true} src={logo} />
						<span className="sr-only">{navigation.home.label}</span>
					</NavLink>

					<div className="hidden flex-col items-end gap-y-2 2xl:flex">
						<div className="flex items-center gap-x-12">
							<NavLink
								className="rounded-b-sm p-2 px-8 text-sm text-neutral-600 transition hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-brand-600"
								href={reportIssueLink.href}
							>
								{reportIssueLink.label}
							</NavLink>
							{authenticated ? (
								<Suspense
									fallback={
										<UserAccountMenu
											items={userAccountItems.children}
											label={userAccountItems.label}
										/>
									}
								>
									<UserAccountMenu
										items={userAccountItems.children}
										label={t("navigation-user-account.label-named", {
											name: (await getCurrentUser()).displayName,
										})}
									/>
								</Suspense>
							) : (
								<ButtonNavLink
									className="min-h-9 rounded-t-none px-16"
									href={signInLink.href}
									size="small"
								>
									{signInLink.label}
								</ButtonNavLink>
							)}
						</div>
						<PageNavigation label={t("navigation.label")} navigation={navigation} />
					</div>

					<div className="2xl:hidden">
						<PageNavigationMobile
							drawerCloseLabel={t("navigation.drawer.close")}
							drawerLabel={t("navigation.drawer.title")}
							drawerOpenLabel={t("navigation.drawer.open")}
							label={t("navigation.label")}
							navigation={{
								...(authenticated
									? { "user-account": userAccountItems }
									: { "sign-in": signInLink }),
								"separator-3": {
									type: "separator",
								},
								...navigation,
								"separator-4": {
									type: "separator",
								},
								"report-issue": reportIssueLink,
							}}
						/>
					</div>
				</div>
			</header>

			{authenticated ? (
				<nav
					aria-label={t("navigation-create-items.label")}
					className="isolate -mt-px hidden border-y border-brand-100 bg-brand-25 text-sm text-brand-750 2xl:block"
				>
					<ul className="mx-auto flex w-full max-w-[120rem] justify-end px-8" role="list">
						{Object.entries(createItemsNavigation).map(([id, item]) => {
							return (
								<li key={id}>
									<NavLink
										className="inline-flex px-6 py-4 transition hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-600"
										href={item.href}
									>
										{item.label}
									</NavLink>
								</li>
							);
						})}
					</ul>
				</nav>
			) : null}
		</div>
	);
}
