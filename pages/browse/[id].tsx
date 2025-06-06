import type {
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from "next";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { BackgroundImage } from "@/components/browse/BackgroundImage";
import { BrowseFacets } from "@/components/browse/BrowseFacets";
import { BrowseFacetValues } from "@/components/browse/BrowseFacetValues";
import { BrowseScreenLayout } from "@/components/browse/BrowseScreenLayout";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { PageMetadata } from "@/components/metadata/page-metadata";
import type { ItemFacet } from "@/data/sshoc/api/item";
import { itemFacets } from "@/data/sshoc/api/item";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { getLocales } from "@/lib/core/i18n/getLocales";
import { load } from "@/lib/core/i18n/load";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";

export namespace BrowsePage {
	export interface PathParamsInput extends ParamsInput {
		id: ItemFacet;
	}
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export interface Props {
		params: PathParams;
		messages: Messages;
	}
}

export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<BrowsePage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		return itemFacets.map((id) => {
			const params = { id };
			return { locale, params };
		});
	});

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<BrowsePage.PathParams>,
): Promise<GetStaticPropsResult<BrowsePage.Props>> {
	const locale = getLocale(context);
	const params = context.params as BrowsePage.PathParams;
	const messages = await load(locale, ["common"]);

	return {
		props: {
			messages,
			params,
		},
	};
}

export default function BrowsePage(props: BrowsePage.Props): ReactNode {
	const id = props.params.id as ItemFacet;

	const t = useTranslations();

	const title = t("common.browse.browse-facet", {
		facet: t(`common.facets.${id}.other`),
	});

	const breadcrumbs = [
		{ href: "/", label: t("common.pages.home") },
		{ href: `/browse/${id}`, label: title },
	];

	return (
		<Fragment>
			<PageMetadata title={title} />
			<PageMainContent>
				<BrowseScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<ItemSearchBar />
						<Breadcrumbs links={breadcrumbs} />
						<ScreenTitle>{title}</ScreenTitle>
					</ScreenHeader>
					<BrowseFacets>
						<BrowseFacetValues facet={id} />
					</BrowseFacets>
					<FundingNotice />
				</BrowseScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<BrowsePage.Props> = BrowsePage;

Page.getLayout = undefined;
