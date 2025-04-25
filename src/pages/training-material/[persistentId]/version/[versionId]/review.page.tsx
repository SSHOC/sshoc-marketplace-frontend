import type { FormApi, SubmissionErrors } from "final-form";
import type {
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from "next";
import { useRouter } from "next/router";
import { Fragment } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { ItemReviewForm } from "@/components/item-form/ItemReviewForm";
import { useCreateOrUpdateTrainingMaterial } from "@/components/item-form/useCreateOrUpdateTrainingMaterial";
import { useReviewItemMeta } from "@/components/item-form/useReviewItemMeta";
import { useTrainingMaterialFormFields } from "@/components/item-form/useTrainingMaterialFormFields";
import { useTrainingMaterialValidationSchema } from "@/components/item-form/useTrainingMaterialValidationSchema";
import type { TrainingMaterial, TrainingMaterialInput } from "@/data/sshoc/api/training-material";
import {
	useRejectTrainingMaterialVersion,
	useTrainingMaterialDiff,
	useTrainingMaterialVersion,
} from "@/data/sshoc/hooks/training-material";
import { isNotFoundError } from "@/data/sshoc/utils/isNotFoundError";
import type { PageComponent } from "@/lib/core/app/types";
import { FORM_ERROR } from "@/lib/core/form/Form";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { getLocales } from "@/lib/core/i18n/getLocales";
import { load } from "@/lib/core/i18n/load";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { QueryMetadata } from "@/lib/core/query/types";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export type UpdateTrainingMaterialFormValues = ItemFormValues<TrainingMaterialInput>;

export namespace ReviewTrainingMaterialPage {
	export interface PathParamsInput extends ParamsInput {
		persistentId: TrainingMaterial["persistentId"];
		versionId: TrainingMaterial["id"];
	}
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export interface Props extends WithDictionaries<"authenticated" | "common"> {
		params: PathParams;
	}
}

export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<ReviewTrainingMaterialPage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		const persistentIds: Array<TrainingMaterial["persistentId"]> = [];
		return persistentIds.flatMap((persistentId) => {
			const versionIds: Array<TrainingMaterial["id"]> = [];
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
	context: GetStaticPropsContext<ReviewTrainingMaterialPage.PathParams>,
): Promise<GetStaticPropsResult<ReviewTrainingMaterialPage.Props>> {
	const locale = getLocale(context);
	const params = context.params as ReviewTrainingMaterialPage.PathParams;
	const dictionaries = await load(locale, ["common", "authenticated"]);

	return {
		props: {
			dictionaries,
			params,
		},
	};
}

export default function ReviewTrainingMaterialPage(
	props: ReviewTrainingMaterialPage.Props,
): ReactNode {
	const { t } = useI18n<"authenticated" | "common">();
	const router = useRouter();

	const { persistentId, versionId: _versionId } = props.params;
	const versionId = Number(_versionId);
	const _trainingMaterial = useTrainingMaterialVersion({ persistentId, versionId }, undefined, {
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
	const trainingMaterial = _trainingMaterial.data;
	/** For newly suggested items there will be no diff available. */
	const ignoreMissingDiff: QueryMetadata = {
		messages: {
			error(error) {
				if (isNotFoundError(error)) {
					return false;
				}
				return undefined;
			},
		},
	};
	const _diff = useTrainingMaterialDiff(
		{ persistentId, with: persistentId, otherVersionId: versionId },
		undefined,
		{
			meta: ignoreMissingDiff,
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		},
	);
	const diff = _diff.data;
	const diffNotFound = isNotFoundError(_diff.error);

	const category = trainingMaterial?.category ?? "training-material";
	const label = t(["common", "item-categories", category, "one"]);
	const title = t(["authenticated", "forms", "edit-item"], { values: { item: label } });

	const formFields = useTrainingMaterialFormFields();
	const validate = useTrainingMaterialValidationSchema();
	const meta = useReviewItemMeta({ category });
	const createOrUpdateTrainingMaterial = useCreateOrUpdateTrainingMaterial(undefined, {
		meta: meta.approve,
	});
	const rejectTrainingMaterialVersion = useRejectTrainingMaterialVersion(
		{ persistentId, versionId },
		undefined,
		{ meta: meta.reject },
	);

	function onSubmit(
		values: UpdateTrainingMaterialFormValues,
		form: FormApi<UpdateTrainingMaterialFormValues>,
		done?: (errors?: SubmissionErrors) => void,
	) {
		delete values["__submitting__"];

		const shouldSaveAsDraft = values["__draft__"] === true;
		delete values["__draft__"];

		createOrUpdateTrainingMaterial.mutate(
			{ data: values, draft: shouldSaveAsDraft },
			{
				onSuccess(trainingMaterial) {
					if (trainingMaterial.status === "draft") {
						// FIXME: Probably better to keep this state in useCreateOrUpdateTrainingMaterial.
						form.batch(() => {
							form.change("persistentId", trainingMaterial.persistentId);
							form.change("status", trainingMaterial.status);
						});
						window.scrollTo(0, 0);
					} else if (trainingMaterial.status === "approved") {
						router.push(`/training-material/${trainingMaterial.persistentId}`);
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

	function onReject() {
		rejectTrainingMaterialVersion.mutate();
	}

	function onCancel() {
		router.push(`/account`);
	}

	if (router.isFallback || trainingMaterial == null || (diff == null && !diffNotFound)) {
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
						<ItemReviewForm<UpdateTrainingMaterialFormValues>
							formFields={formFields}
							name="review-item"
							initialValues={trainingMaterial}
							diff={diff}
							onCancel={onCancel}
							onReject={onReject}
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

const Page: PageComponent<ReviewTrainingMaterialPage.Props> = ReviewTrainingMaterialPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator"].includes(user.role);
};
