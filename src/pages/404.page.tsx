import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Fragment, type ReactNode } from "react";

import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FundingNotice } from "@/components/common/FundingNotice";
import { LinkButton } from "@/components/common/LinkButton";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/error/BackgroundImage";
import { Content } from "@/components/error/Content";
import { ErrorScreenLayout } from "@/components/error/ErrorScreenLayout";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";

export namespace NotFoundPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export type Props = WithDictionaries<"common">;
}

export async function getStaticProps(
	context: GetStaticPropsContext<NotFoundPage.PathParams>,
): Promise<GetStaticPropsResult<NotFoundPage.Props>> {
	const locale = getLocale(context);
	const dictionaries = await load(locale, ["common"]);

	return {
		props: {
			dictionaries,
		},
	};
}

export default function NotFoundPage(_props: NotFoundPage.Props): ReactNode {
	const { t } = useI18n<"common">();

	const title = t(["common", "pages", "page-not-found"]);
	const message = t(["common", "page-not-found-error-message"]);

	return (
		<Fragment>
			<PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
			<PageMainContent>
				<ErrorScreenLayout>
					<BackgroundImage />
					<Content>
						<ScreenTitle>{title}</ScreenTitle>
						<ErrorMessage message={message} statusCode={404} />
						<div>
							<LinkButton href="/" color="secondary">
								{t(["common", "go-to-main-page"])}
							</LinkButton>
						</div>
					</Content>
					<FundingNotice />
				</ErrorScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<NotFoundPage.Props> = NotFoundPage;

Page.getLayout = undefined;
