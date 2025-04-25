import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Fragment } from "react";

import { BackgroundGradient } from "@/components/auth/BackgroundGradient";
import { BackgroundImage } from "@/components/auth/BackgroundImageSignUp";
import { SignUpCard } from "@/components/auth/SignUpCard";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { SignUpScreenLayout } from "@/components/auth/SignUpScreenLayout";
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

export namespace SignUpPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export interface SearchParamsInput {
		next?: string;
	}
	export type Props = WithDictionaries<"common">;
}

export async function getStaticProps(
	context: GetStaticPropsContext<SignUpPage.PathParams>,
): Promise<GetStaticPropsResult<SignUpPage.Props>> {
	const locale = getLocale(context);
	const dictionaries = await load(locale, ["common"]);

	return {
		props: {
			dictionaries,
		},
	};
}

export default function SignUpPage(_props: SignUpPage.Props): JSX.Element {
	const { t } = useI18n<"common">();

	const title = t(["common", "pages", "sign-up"]);

	return (
		<Fragment>
			<PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
			<PageMainContent>
				<SignUpScreenLayout>
					<BackgroundGradient />
					<BackgroundImage />
					<SignUpCard>
						<ScreenHeader>
							<ScreenTitle>{title}</ScreenTitle>
						</ScreenHeader>
						<SignUpForm />
					</SignUpCard>
					<FundingNotice />
				</SignUpScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<SignUpPage.Props> = SignUpPage;

Page.getLayout = undefined;
