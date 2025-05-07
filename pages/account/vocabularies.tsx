import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { AccountScreenWithFiltersLayout } from "@/components/account/AccountScreenWithFiltersLayout";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import type { SearchFilters } from "@/components/account/useVocabularySearchFilters";
import { VocabulariesBackgroundFetchIndicator } from "@/components/account/VocabulariesBackgroundFetchIndicator";
import { VocabulariesSearchResultsCount } from "@/components/account/VocabulariesSearchResultsCount";
import { VocabularySearchFilters } from "@/components/account/VocabularySearchFilters";
import { VocabularySearchResults } from "@/components/account/VocabularySearchResults";
import { VocabularySearchResultsFooter } from "@/components/account/VocabularySearchResultsFooter";
import { VocabularySearchResultsHeader } from "@/components/account/VocabularySearchResultsHeader";
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

export namespace VocabulariesPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = SearchFilters;
	export type Props = {
		messages: Messages;
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<VocabulariesPage.PathParams>,
): Promise<GetStaticPropsResult<VocabulariesPage.Props>> {
	const locale = getLocale(context);
	const messages = await load(locale, ["authenticated", "common"]);

	return {
		props: {
			messages,
		},
	};
}

export default function VocabulariesPage(_props: VocabulariesPage.Props): ReactNode {
	const t = useTranslations();

	const title = t("authenticated.pages.vocabularies");

	const breadcrumbs = [
		{ href: "/", label: t("common.pages.home") },
		{
			href: `/account`,
			label: t("authenticated.pages.account"),
		},
		{
			href: `/account/vocabularies`,
			label: t("authenticated.pages.vocabularies"),
		},
	];

	return (
		<Fragment>
			<PageMetadata noindex title={title} />
			<PageMainContent>
				<AccountScreenWithFiltersLayout>
					<BackgroundImage />
					<ScreenHeader>
						<Breadcrumbs links={breadcrumbs} />
						<SpacedRow>
							<ScreenTitle>
								{title}
								<VocabulariesSearchResultsCount />
							</ScreenTitle>
							<VocabulariesBackgroundFetchIndicator />
						</SpacedRow>
					</ScreenHeader>
					<VocabularySearchFilters />
					<VocabularySearchResultsHeader />
					<VocabularySearchResults />
					<VocabularySearchResultsFooter />
					<FundingNotice />
				</AccountScreenWithFiltersLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<VocabulariesPage.Props> = VocabulariesPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator"].includes(user.role);
};
