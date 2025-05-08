import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { AccountScreenWithoutFiltersLayout } from "@/components/account/AccountScreenWithoutFiltersLayout";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import { ContributedItemsBackgroundFetchIndicator } from "@/components/account/ContributedItemsBackgroundFetchIndicator";
import { ContributedItemSearchResults } from "@/components/account/ContributedItemSearchResults";
import { ContributedItemSearchResultsFooter } from "@/components/account/ContributedItemSearchResultsFooter";
import { ContributedItemSearchResultsHeader } from "@/components/account/ContributedItemSearchResultsHeader";
import { ContributedItemsSearchResultsCount } from "@/components/account/ContributedItemsSearchResultsCount";
import type { SearchFilters } from "@/components/account/useContributedItemsSearchFilters";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { PageMetadata } from "@/components/metadata/page-metadata";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { SpacedRow } from "@/lib/core/ui/SpacedRow/SpacedRow";

export namespace ContributedItemsPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = SearchFilters;
	export type Props = {
		messages: Messages;
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<ContributedItemsPage.PathParams>,
): Promise<GetStaticPropsResult<ContributedItemsPage.Props>> {
	const locale = getLocale(context);
	const messages = await load(locale, ["authenticated", "common"]);

	return {
		props: {
			messages,
		},
	};
}

export default function ContributedItemsPage(_props: ContributedItemsPage.Props): ReactNode {
	const t = useTranslations();

	const title = t("authenticated.pages.contributed-items");

	const breadcrumbs = [
		{ href: "/", label: t("common.pages.home") },
		{
			href: `/account`,
			label: t("authenticated.pages.account"),
		},
		{
			href: `/account/contributed-items`,
			label: t("authenticated.pages.contributed-items"),
		},
	];

	return (
		<Fragment>
			<PageMetadata noindex title={title} />
			<PageMainContent>
				<AccountScreenWithoutFiltersLayout>
					<BackgroundImage />
					<ScreenHeader>
						<Breadcrumbs links={breadcrumbs} />
						<SpacedRow>
							<ScreenTitle>
								{title}
								<ContributedItemsSearchResultsCount />
							</ScreenTitle>
							<ContributedItemsBackgroundFetchIndicator />
						</SpacedRow>
					</ScreenHeader>
					<ContributedItemSearchResultsHeader />
					<ContributedItemSearchResults />
					<ContributedItemSearchResultsFooter />
					<FundingNotice />
				</AccountScreenWithoutFiltersLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<ContributedItemsPage.Props> = ContributedItemsPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator", "contributor"].includes(user.role);
};
