import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { FormHelpText } from "@/components/item-form/FormHelpText";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { ToolOrServiceCreateForm } from "@/components/item-form/ToolOrServiceCreateForm";
import { PageMetadata } from "@/components/metadata/page-metadata";
import type { ToolInput } from "@/data/sshoc/api/tool-or-service";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import { PageMainContent } from "@/lib/core/page/PageMainContent";

export type CreateToolFormValues = ItemFormValues<ToolInput>;

export namespace CreateToolOrServicePage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export type Props = {
		messages: Messages;
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<CreateToolOrServicePage.PathParams>,
): Promise<GetStaticPropsResult<CreateToolOrServicePage.Props>> {
	const locale = getLocale(context);
	const messages = await load(locale, ["common", "authenticated"]);

	return {
		props: {
			messages,
		},
	};
}

export default function CreateToolOrServicePage(_props: CreateToolOrServicePage.Props): ReactNode {
	const t = useTranslations();

	const category = "tool-or-service";
	const label = t(`common.item-categories.${category}.one`);
	const title = t("authenticated.forms.create-item", { item: label });

	return (
		<Fragment>
			<PageMetadata noindex title={title} />
			<PageMainContent>
				<ItemFormScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<ScreenTitle>{title}</ScreenTitle>
					</ScreenHeader>
					<Content>
						<FormHelpText />
						<ToolOrServiceCreateForm />
					</Content>
					<FundingNotice />
				</ItemFormScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<CreateToolOrServicePage.Props> = CreateToolOrServicePage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator", "contributor"].includes(user.role);
};
