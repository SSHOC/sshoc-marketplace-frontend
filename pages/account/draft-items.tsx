import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { AccountScreenWithoutFiltersLayout } from "@/components/account/AccountScreenWithoutFiltersLayout";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import { DraftItemsBackgroundFetchIndicator } from "@/components/account/DraftItemsBackgroundFetchIndicator";
import { DraftItemSearchResults } from "@/components/account/DraftItemSearchResults";
import { DraftItemSearchResultsFooter } from "@/components/account/DraftItemSearchResultsFooter";
import { DraftItemSearchResultsHeader } from "@/components/account/DraftItemSearchResultsHeader";
import { DraftItemsSearchResultsCount } from "@/components/account/DraftItemsSearchResultsCount";
import type { SearchFilters } from "@/components/account/useDraftItemsSearchFilters";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { SpacedRow } from "@/lib/core/ui/SpacedRow/SpacedRow";

export namespace DraftItemsPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = SearchFilters;
	export type Props = {
		messages: Messages;
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<DraftItemsPage.PathParams>,
): Promise<GetStaticPropsResult<DraftItemsPage.Props>> {
	const locale = getLocale(context);
	const messages = await load(locale, ["authenticated", "common"]);

	return {
		props: {
			messages,
		},
	};
}

export default function DraftItemsPage(_props: DraftItemsPage.Props): ReactNode {
	const t = useTranslations();

	const title = t("authenticated.pages.draft-items");

	const breadcrumbs = [
		{ href: "/", label: t("common.pages.home") },
		{
			href: `/account`,
			label: t("authenticated.pages.account"),
		},
		{
			href: `/account/draft-items`,
			label: t("authenticated.pages.draft-items"),
		},
	];

	return (
		<Fragment>
			<PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
			<PageMainContent>
				<AccountScreenWithoutFiltersLayout>
					<BackgroundImage />
					<ScreenHeader>
						<Breadcrumbs links={breadcrumbs} />
						<SpacedRow>
							<ScreenTitle>
								{title}
								<DraftItemsSearchResultsCount />
							</ScreenTitle>
							<DraftItemsBackgroundFetchIndicator />
						</SpacedRow>
					</ScreenHeader>
					<DraftItemSearchResultsHeader />
					<DraftItemSearchResults />
					<DraftItemSearchResultsFooter />
					<FundingNotice />
				</AccountScreenWithoutFiltersLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<DraftItemsPage.Props> = DraftItemsPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator", "contributor"].includes(user.role);
};
