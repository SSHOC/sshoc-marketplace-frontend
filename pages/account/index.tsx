import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { AccountHelpText } from "@/components/account/AccountHelpText";
import { AccountLinks } from "@/components/account/AccountLinks";
import { AccountScreenLayout } from "@/components/account/AccountScreenLayout";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import { Content } from "@/components/account/Content";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { PageMetadata } from "@/components/metadata/page-metadata";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";

export namespace AccountPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export type Props = {
		messages: Messages;
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<AccountPage.PathParams>,
): Promise<GetStaticPropsResult<AccountPage.Props>> {
	const locale = getLocale(context);
	const messages = await load(locale, ["authenticated", "common"]);

	return {
		props: {
			messages,
		},
	};
}

export default function AccountPage(_props: AccountPage.Props): ReactNode {
	const t = useTranslations();

	const title = t("authenticated.pages.account");

	const breadcrumbs = [
		{ href: "/", label: t("common.pages.home") },
		{
			href: `/account`,
			label: t("authenticated.pages.account"),
		},
	];

	return (
		<Fragment>
			<PageMetadata noindex title={title} />
			<PageMainContent>
				<AccountScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<Breadcrumbs links={breadcrumbs} />
						<ScreenTitle>{title}</ScreenTitle>
					</ScreenHeader>
					<Content>
						<AccountHelpText />
						<AccountLinks />
					</Content>
					<FundingNotice />
				</AccountScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<AccountPage.Props> = AccountPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator", "contributor"].includes(user.role);
};
