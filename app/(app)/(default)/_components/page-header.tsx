import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AuthMenu } from "@/app/(app)/(default)/_components/auth-menu";
import {
	type NavigationItem,
	PageNavigation,
} from "@/app/(app)/(default)/_components/page-navigation";
import { ReportIssueLink } from "@/app/(app)/(default)/_components/report-issue-link";
import { Image } from "@/components/image";
import { NavLink } from "@/components/nav-link";
import { createHref } from "@/lib/navigation/create-href";
import { getSession } from "@/lib/server/auth/session";
import logo from "@/public/assets/images/logo-with-text.svg";

interface PageHeaderProps {}

export async function PageHeader(_props: Readonly<PageHeaderProps>): Promise<ReactNode> {
	const t = await getTranslations("PageHeader");

	const session = await getSession();

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

	return (
		<header className="border-b border-neutral-200">
			<div className="mx-auto flex w-full max-w-[120rem] items-center justify-between gap-x-8 px-8">
				<NavLink className="shrink-0 py-2" href={navigation.home.href}>
					<Image alt="" className="h-16 w-auto shrink-0" priority={true} src={logo} />
					<span className="sr-only">{navigation.home.label}</span>
				</NavLink>

				<div className="hidden flex-col items-end 2xl:flex">
					<div className="flex items-center gap-x-8">
						<ReportIssueLink />
						<AuthMenu />
					</div>
					<PageNavigation label={t("navigation.label")} navigation={navigation} />
				</div>
			</div>
		</header>
	);
}
