import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { LinkButton } from "@/components/common/LinkButton";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { PageMetadata } from "@/components/metadata/page-metadata";
import { BackgroundGradient } from "@/components/success/BackgroundGradient";
import { SuccessCard } from "@/components/success/SuccessCard";
import { SuccessCardControls } from "@/components/success/SuccessCardControls";
import { SuccessScreenLayout } from "@/components/success/SuccessScreenLayout";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import { PageMainContent } from "@/lib/core/page/PageMainContent";

export namespace SuccessPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export type Props = {
		messages: Messages;
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<SuccessPage.PathParams>,
): Promise<GetStaticPropsResult<SuccessPage.Props>> {
	const locale = getLocale(context);
	const messages = await load(locale, ["common"]);

	return {
		props: {
			messages,
		},
	};
}

export default function SuccessPage(_props: SuccessPage.Props): ReactNode {
	const t = useTranslations();

	const title = t("common.pages.success");

	return (
		<Fragment>
			<PageMetadata noindex title={title} />
			<PageMainContent>
				<SuccessScreenLayout>
					<BackgroundGradient />
					<SuccessCard>
						<ScreenHeader>
							<ScreenTitle>{t("common.success.title")}</ScreenTitle>
						</ScreenHeader>
						<p>{t("common.success.message")}</p>
						<SuccessCardControls>
							<LinkButton href="/">{t("common.success.back-home")}</LinkButton>
						</SuccessCardControls>
					</SuccessCard>
					<FundingNotice />
				</SuccessScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<SuccessPage.Props> = SuccessPage;

Page.getLayout = undefined;
