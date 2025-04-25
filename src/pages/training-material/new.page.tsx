import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Fragment } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { FormHelpText } from "@/components/item-form/FormHelpText";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { TrainingMaterialCreateForm } from "@/components/item-form/TrainingMaterialCreateForm";
import type { TrainingMaterialInput } from "@/data/sshoc/api/training-material";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";

export type CreateTrainingMaterialFormValues = ItemFormValues<TrainingMaterialInput>;

export namespace CreateTrainingMaterialPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export type Props = WithDictionaries<"authenticated" | "common">;
}

export async function getStaticProps(
	context: GetStaticPropsContext<CreateTrainingMaterialPage.PathParams>,
): Promise<GetStaticPropsResult<CreateTrainingMaterialPage.Props>> {
	const locale = getLocale(context);
	const dictionaries = await load(locale, ["common", "authenticated"]);

	return {
		props: {
			dictionaries,
		},
	};
}

export default function CreateTrainingMaterialPage(
	_props: CreateTrainingMaterialPage.Props,
): ReactNode {
	const { t } = useI18n<"authenticated" | "common">();

	const category = "training-material";
	const label = t(["common", "item-categories", category, "one"]);
	const title = t(["authenticated", "forms", "create-item"], { values: { item: label } });

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
						<TrainingMaterialCreateForm />
					</Content>
					<FundingNotice />
				</ItemFormScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<CreateTrainingMaterialPage.Props> = CreateTrainingMaterialPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator", "contributor"].includes(user.role);
};
