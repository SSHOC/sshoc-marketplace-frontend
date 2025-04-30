import type { FormApi, SubmissionErrors } from "final-form";
import type {
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from "next";
import { useRouter } from "next/router";
import { Fragment, type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import { ItemForm } from "@/components/item-form/ItemForm";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { useCreateOrUpdateDataset } from "@/components/item-form/useCreateOrUpdateDataset";
import { useDatasetFormFields } from "@/components/item-form/useDatasetFormFields";
import { useDatasetValidationSchema } from "@/components/item-form/useDatasetValidationSchema";
import { useUpdateItemMeta } from "@/components/item-form/useUpdateItemMeta";
import type { Dataset, DatasetInput } from "@/data/sshoc/api/dataset";
import { useDataset, useDatasetVersion } from "@/data/sshoc/hooks/dataset";
import type { PageComponent } from "@/lib/core/app/types";
import { FORM_ERROR } from "@/lib/core/form/Form";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { getLocales } from "@/lib/core/i18n/getLocales";
import { load } from "@/lib/core/i18n/load";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export type UpdateDatasetFormValues = ItemFormValues<DatasetInput>;

export namespace EditDatasetVersionPage {
	export interface PathParamsInput extends ParamsInput {
		persistentId: Dataset["persistentId"];
		versionId: Dataset["id"];
	}
	export type PathParams = StringParams<PathParamsInput>;
	export interface SearchParamsInput {
		draft?: boolean;
	}
	export interface Props extends WithDictionaries<"authenticated" | "common"> {
		params: PathParams;
	}
}

export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<EditDatasetVersionPage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		const persistentIds: Array<Dataset["persistentId"]> = [];
		return persistentIds.flatMap((persistentId) => {
			const versionIds: Array<Dataset["id"]> = [];
			return versionIds.map((versionId) => {
				const params = { persistentId, versionId: String(versionId) };
				return { locale, params };
			});
		});
	});

	return {
		paths,
		fallback: "blocking",
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<EditDatasetVersionPage.PathParams>,
): Promise<GetStaticPropsResult<EditDatasetVersionPage.Props>> {
	const locale = getLocale(context);
	const params = context.params as EditDatasetVersionPage.PathParams;
	const dictionaries = await load(locale, ["common", "authenticated"]);

	return {
		props: {
			dictionaries,
			params,
		},
	};
}

export default function EditDatasetVersionPage(props: EditDatasetVersionPage.Props): ReactNode {
	const { t } = useI18n<"authenticated" | "common">();
	const router = useRouter();

	const { persistentId, versionId: _versionId } = props.params;
	const versionId = Number(_versionId);
	const searchParams = useSearchParams();
	const isDraftVersion = searchParams != null && searchParams.get("draft") != null;
	const _dataset = !isDraftVersion
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useDatasetVersion({ persistentId, versionId }, undefined, {
				enabled: router.isReady,
				refetchOnMount: false,
				refetchOnReconnect: false,
				refetchOnWindowFocus: false,
			})
		: // eslint-disable-next-line react-hooks/rules-of-hooks
			useDataset({ persistentId, draft: true }, undefined, {
				enabled: router.isReady,
				refetchOnMount: false,
				refetchOnReconnect: false,
				refetchOnWindowFocus: false,
			});
	const dataset = _dataset.data;

	const category = dataset?.category ?? "dataset";
	const label = t(["common", "item-categories", category, "one"]);
	const title = t(["authenticated", "forms", "edit-item"], { values: { item: label } });

	const formFields = useDatasetFormFields();
	const validate = useDatasetValidationSchema();
	const meta = useUpdateItemMeta({ category });
	const createOrUpdateDataset = useCreateOrUpdateDataset(undefined, { meta });

	function onSubmit(
		values: UpdateDatasetFormValues,
		form: FormApi<UpdateDatasetFormValues>,
		done?: (errors?: SubmissionErrors) => void,
	) {
		delete values["__submitting__"];

		const shouldSaveAsDraft = values["__draft__"] === true;
		delete values["__draft__"];

		createOrUpdateDataset.mutate(
			{ data: values, draft: shouldSaveAsDraft },
			{
				onSuccess(dataset) {
					if (dataset.status === "draft") {
						// FIXME: Probably better to keep this state in useCreateOrUpdateDataset.
						form.batch(() => {
							form.change("persistentId", dataset.persistentId);
							form.change("status", dataset.status);
						});
						window.scrollTo(0, 0);
					} else if (dataset.status === "approved") {
						router.push(`/dataset/${dataset.persistentId}`);
					} else {
						router.push(`/success`);
					}
					done?.();
				},
				onError(error) {
					done?.({ [FORM_ERROR]: String(error) });
				},
			},
		);
	}

	function onCancel() {
		router.push(`/account`);
	}

	if (router.isFallback || dataset == null) {
		return (
			<Fragment>
				<PageMetadata title={title} openGraph={{}} twitter={{}} />
				<PageMainContent>
					<FullPage>
						<Centered>
							<ProgressSpinner />
						</Centered>
					</FullPage>
				</PageMainContent>
			</Fragment>
		);
	}

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
						<ItemForm<UpdateDatasetFormValues>
							formFields={formFields}
							name="update-item-version"
							initialValues={dataset}
							onCancel={onCancel}
							onSubmit={onSubmit}
							validate={validate}
						/>
					</Content>
					<FundingNotice />
				</ItemFormScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<EditDatasetVersionPage.Props> = EditDatasetVersionPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator", "contributor"].includes(user.role);
};
