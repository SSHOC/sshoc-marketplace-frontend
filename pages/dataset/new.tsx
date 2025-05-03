import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { DatasetCreateForm } from "@/components/item-form/DatasetCreateForm";
import { FormHelpText } from "@/components/item-form/FormHelpText";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";

export namespace CreateDatasetPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export type Props = {
		messages: Messages;
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<CreateDatasetPage.PathParams>,
): Promise<GetStaticPropsResult<CreateDatasetPage.Props>> {
	const locale = getLocale(context);
	const messages = await load(locale, ["common", "authenticated"]);

	return {
		props: {
			messages,
		},
	};
}

export default function CreateDatasetPage(_props: CreateDatasetPage.Props): ReactNode {
	const t = useTranslations();

	const category = "dataset";
	const label = t(`common.item-categories.${category}.one`);
	const title = t("authenticated.forms.create-item", { item: label });

	return (
		<Fragment>
			<PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
			<PageMainContent>
				<ItemFormScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<ScreenTitle>{title}</ScreenTitle>
					</ScreenHeader>
					<Content>
						<FormHelpText />
						<DatasetCreateForm />
					</Content>
					<FundingNotice />
				</ItemFormScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<CreateDatasetPage.Props> = CreateDatasetPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator", "contributor"].includes(user.role);
};
