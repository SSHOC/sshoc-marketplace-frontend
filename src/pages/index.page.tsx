import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Fragment } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { BackgroundImage } from "@/components/home/BackgroundImage";
import { BrowseItems } from "@/components/home/BrowseItems";
import { Hero } from "@/components/home/Hero";
import { HomeScreenLayout } from "@/components/home/HomeScreenLayout";
import { ItemSearchForm } from "@/components/home/ItemSearchForm";
import { ItemSearchFormPanel } from "@/components/home/ItemSearchFormPanel";
import { LastUpdatedItems } from "@/components/home/LastUpdatedItems";
import { PeopleImage } from "@/components/home/PeopleImage";
import { RecommendedItems } from "@/components/home/RecommendedItems";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
// import { Centered } from '@/lib/core/ui/Centered/Centered'
// import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'

export namespace HomePage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export type Props = WithDictionaries<"common">;
}

export async function getStaticProps(
	context: GetStaticPropsContext<HomePage.PathParams>,
): Promise<GetStaticPropsResult<HomePage.Props>> {
	const locale = getLocale(context);
	const dictionaries = await load(locale, ["common"]);

	return {
		props: {
			dictionaries,
		},
	};
}

export default function HomePage(_props: HomePage.Props): JSX.Element {
	const { t } = useI18n<"common">();

	const title = t(["common", "pages", "home"]);

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
					{/* <Suspense
            fallback={
              <Centered>
                <LoadingIndicator />
              </Centered>
            }
          > */}
					<BrowseItems />
					<RecommendedItems />
					<LastUpdatedItems />
					<FundingNotice />
					{/* </Suspense> */}
				</HomeScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<HomePage.Props> = HomePage;

Page.getLayout = undefined;
