import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Fragment } from "react";

import { BackgroundGradient } from "@/components/auth/BackgroundGradient";
import { BackgroundImage } from "@/components/auth/BackgroundImageSignIn";
import { SignInCard } from "@/components/auth/SignInCard";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignInScreenLayout } from "@/components/auth/SignInScreenLayout";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";

export namespace SignInPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export interface SearchParamsInput {
		next?: string;
	}
	export type Props = WithDictionaries<"common">;
}

export async function getStaticProps(
	context: GetStaticPropsContext<SignInPage.PathParams>,
): Promise<GetStaticPropsResult<SignInPage.Props>> {
	const locale = getLocale(context);
	const dictionaries = await load(locale, ["common"]);

	return {
		props: {
			dictionaries,
		},
	};
}

export default function SignInPage(_props: SignInPage.Props): JSX.Element {
	const { t } = useI18n<"common">();

	const title = t(["common", "pages", "sign-in"]);

	return (
		<Fragment>
			<PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
			<PageMainContent>
				<SignInScreenLayout>
					<BackgroundGradient />
					<BackgroundImage />
					<SignInCard>
						<ScreenHeader>
							<ScreenTitle>{title}</ScreenTitle>
						</ScreenHeader>
						<SignInForm />
					</SignInCard>
					<FundingNotice />
				</SignInScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<SignInPage.Props> = SignInPage;

Page.getLayout = undefined;
