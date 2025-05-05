import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import type { Messages } from "next-intl";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { BackgroundImage } from "@/components/home/BackgroundImage";
import { BrowseItems } from "@/components/home/BrowseItems";
import { FeaturedResources } from "@/components/home/FeaturedResources";
import { Hero } from "@/components/home/Hero";
import { HomeScreenLayout } from "@/components/home/HomeScreenLayout";
import { ItemSearchForm } from "@/components/home/ItemSearchForm";
import { ItemSearchFormPanel } from "@/components/home/ItemSearchFormPanel";
import { LastUpdatedItems } from "@/components/home/LastUpdatedItems";
import { PeopleImage } from "@/components/home/PeopleImage";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";

export namespace HomePage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export type Props = {
		messages: Messages;
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<HomePage.PathParams>,
): Promise<GetStaticPropsResult<HomePage.Props>> {
	const locale = getLocale(context);
	const messages = await load(locale, ["common"]);

	return {
		props: {
			messages,
		},
	};
}

export default function HomePage(_props: HomePage.Props): ReactNode {
	const t = useTranslations();

	const title = t("common.pages.home");

	return (
		<Fragment>
			<PageMetadata title={title} openGraph={{}} twitter={{}} />
			<PageMainContent>
				<HomeScreenLayout>
					<BackgroundImage />
					<PeopleImage />
					<Hero>
						<ItemSearchFormPanel>
							<ItemSearchForm />
						</ItemSearchFormPanel>
					</Hero>
					<FeaturedResources />
					<BrowseItems />
					<LastUpdatedItems />
					<FundingNotice />
				</HomeScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<HomePage.Props> = HomePage;

Page.getLayout = undefined;
