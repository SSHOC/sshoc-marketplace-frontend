import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import {
	PageNavigation,
	PageNavigationMobile,
} from "@/app/(app)/(default)/_components/page-navigation";
import { UserAccountMenu } from "@/app/(app)/(default)/_components/user-account-menu";
import { Image } from "@/components/image";
import { NavLink } from "@/components/nav-link";
import { ButtonNavLink } from "@/components/ui/button";
import { createHref } from "@/lib/navigation/create-href";
import type { NavigationItem } from "@/lib/navigation/navigation";
import { getCurrentUser } from "@/lib/server/api/client";
import { getCurrentSession } from "@/lib/server/auth/session";
import logo from "@/public/assets/images/logo-with-text.svg";

export async function PageHeader(): Promise<ReactNode> {
	const t = await getTranslations("PageHeader");

	const session = await getCurrentSession();

	const navigation = {
		home: {
			type: "link",
			href: createHref({
				pathname: "/",
			}),
			label: t("links.home"),
		},
		"tools-services": {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({
					categories: ["tool-or-service"],
				}),
			}),
			label: t("links.tools-services"),
		},
		"training-materials": {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({
					categories: ["training-material"],
				}),
			}),
			label: t("links.training-materials"),
		},
		publications: {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({
					categories: ["publication"],
				}),
			}),
			label: t("links.publications"),
		},
		datasets: {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({
					categories: ["dataset"],
				}),
			}),
			label: t("links.datasets"),
		},
		workflows: {
			type: "link",
			href: createHref({
				pathname: "/search",
				searchParams: createUrlSearchParams({
					categories: ["workflow"],
				}),
			}),
			label: t("links.workflows"),
		},
		"separator-1": {
			type: "separator",
		},
		browse: {
			type: "menu",
			label: t("links.browse"),
			children: {
				activities: {
					type: "link",
					href: createHref({
						pathname: "/browse/activities",
					}),
					label: t("links.browse-activities"),
				},
				keywords: {
					type: "link",
					href: createHref({
						pathname: "/browse/keywords",
					}),
					label: t("links.browse-keywords"),
				},
				sources: {
					type: "link",
					href: createHref({
						pathname: "/browse/sources",
					}),
					label: t("links.browse-sources"),
				},
				languages: {
					type: "link",
					href: createHref({
						pathname: "/browse/languages",
					}),
					label: t("links.browse-languages"),
				},
			},
		},
		"separator-2": {
			type: "separator",
		},
		contribute: {
			type: "menu",
			label: t("links.contribute"),
			children: {
				overview: {
					type: "link",
					href: createHref({
						pathname: "/contribute/overview",
					}),
					label: t("links.contribute-overview"),
				},
				create: {
					type: "link",
					href: createHref({
						pathname: "/contribute/create-an-individual-item",
					}),
					label: t("links.contribute-create"),
				},
				enrich: {
					type: "link",
					href: createHref({
						pathname: "/contribute/enrich-an-individual-item",
					}),
					label: t("links.contribute-enrich"),
				},
				issue: {
					type: "link",
					href: createHref({
						pathname: "/contribute/report-an-issue",
					}),
					label: t("links.contribute-issue"),
				},
				moderator: {
					type: "link",
					href: createHref({
						pathname: "/contribute/moderator-guidelines",
					}),
					label: t("links.contribute-moderator"),
				},
				administrator: {
					type: "link",
					href: createHref({
						pathname: "/contribute/administrator-guidelines",
					}),
					label: t("links.contribute-administrator"),
				},
				metadata: {
					type: "link",
					href: createHref({
						pathname: "/contribute/metadata-guidelines",
					}),
					label: t("links.contribute-metadata"),
				},
			},
		},
		about: {
			type: "menu",
			label: t("links.about"),
			children: {
				service: {
					type: "link",
					href: createHref({
						pathname: "/about/service",
					}),
					label: t("links.about-service"),
				},
				eosc: {
					type: "link",
					href: createHref({
						pathname: "/about/sshoc-eosc",
					}),
					label: t("links.about-eosc"),
				},
				data: {
					type: "link",
					href: createHref({
						pathname: "/about/data-population",
					}),
					label: t("links.about-data"),
				},
				team: {
					type: "link",
					href: createHref({
						pathname: "/about/team",
					}),
					label: t("links.about-team"),
				},
				docs: {
					type: "link",
					href: createHref({
						pathname: "/about/api-documentation",
					}),
					label: t("links.about-docs"),
				},
				implementation: {
					type: "link",
					href: createHref({
						pathname: "/about/implementation",
					}),
					label: t("links.about-implementation"),
				},
				faq: {
					type: "link",
					href: createHref({
						pathname: "/about/frequently-asked-questions",
					}),
					label: t("links.about-faq"),
				},
				communication: {
					type: "link",
					href: createHref({
						pathname: "/about/communication-kit",
					}),
					label: t("links.about-communication"),
				},
			},
		},
	} satisfies Record<string, NavigationItem>;

	const signInLink = {
		type: "link",
		href: createHref({ pathname: "/auth/sign-in" }),
		label: t("links.sign-in"),
	} satisfies NavigationItem;

	const reportIssueLink = {
		type: "link",
		href: createHref({
			pathname: "/contact",
			searchParams: {
				subject: t("report-issue.label"),
				message: t("report-issue.message"),
			},
		}),
		label: t("report-issue.label"),
	} satisfies NavigationItem;

	return (
		<header className="border-b border-neutral-150">
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
						{session != null ? (
							<Suspense>
								<UserAccountMenu name={(await getCurrentUser()).displayName} />
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
						label={t("navigation.label")}
						menuCloseLabel={t("menu.close")}
						menuOpenLabel={t("menu.open")}
						menuTitleLabel={t("menu.title")}
						navigation={{
							...(session ? {} : { "sign-in": signInLink }),
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
	);
}
