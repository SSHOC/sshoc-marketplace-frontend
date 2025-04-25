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
import { useCreateOrUpdatePublication } from "@/components/item-form/useCreateOrUpdatePublication";
import { usePublicationFormFields } from "@/components/item-form/usePublicationFormFields";
import { usePublicationValidationSchema } from "@/components/item-form/usePublicationValidationSchema";
import { useReviewItemMeta } from "@/components/item-form/useReviewItemMeta";
import type { Publication, PublicationInput } from "@/data/sshoc/api/publication";
import {
	usePublicationDiff,
	usePublicationVersion,
	useRejectPublicationVersion,
} from "@/data/sshoc/hooks/publication";
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

export type UpdatePublicationFormValues = ItemFormValues<PublicationInput>;

export namespace ReviewPublicationPage {
	export interface PathParamsInput extends ParamsInput {
		persistentId: Publication["persistentId"];
		versionId: Publication["id"];
	}
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export interface Props extends WithDictionaries<"authenticated" | "common"> {
		params: PathParams;
	}
}

export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<ReviewPublicationPage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		const persistentIds: Array<Publication["persistentId"]> = [];
		return persistentIds.flatMap((persistentId) => {
			const versionIds: Array<Publication["id"]> = [];
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
	context: GetStaticPropsContext<ReviewPublicationPage.PathParams>,
): Promise<GetStaticPropsResult<ReviewPublicationPage.Props>> {
	const locale = getLocale(context);
	const params = context.params as ReviewPublicationPage.PathParams;
	const dictionaries = await load(locale, ["common", "authenticated"]);

	return {
		props: {
			dictionaries,
			params,
		},
	};
}

export default function ReviewPublicationPage(props: ReviewPublicationPage.Props): JSX.Element {
	const { t } = useI18n<"authenticated" | "common">();
	const router = useRouter();

	const { persistentId, versionId: _versionId } = props.params;
	const versionId = Number(_versionId);
	const _publication = usePublicationVersion({ persistentId, versionId }, undefined, {
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
	const publication = _publication.data;
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
	const _diff = usePublicationDiff(
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

	const category = publication?.category ?? "publication";
	const label = t(["common", "item-categories", category, "one"]);
	const title = t(["authenticated", "forms", "edit-item"], { values: { item: label } });

	const formFields = usePublicationFormFields();
	const validate = usePublicationValidationSchema();
	const meta = useReviewItemMeta({ category });
	const createOrUpdatePublication = useCreateOrUpdatePublication(undefined, { meta: meta.approve });
	const rejectPublicationVersion = useRejectPublicationVersion(
		{ persistentId, versionId },
		undefined,
		{ meta: meta.reject },
	);

	function onSubmit(
		values: UpdatePublicationFormValues,
		form: FormApi<UpdatePublicationFormValues>,
		done?: (errors?: SubmissionErrors) => void,
	) {
		delete values["__submitting__"];

		const shouldSaveAsDraft = values["__draft__"] === true;
		delete values["__draft__"];

		createOrUpdatePublication.mutate(
			{ data: values, draft: shouldSaveAsDraft },
			{
				onSuccess(publication) {
					if (publication.status === "draft") {
						// FIXME: Probably better to keep this state in useCreateOrUpdatePublication.
						form.batch(() => {
							form.change("persistentId", publication.persistentId);
							form.change("status", publication.status);
						});
						window.scrollTo(0, 0);
					} else if (publication.status === "approved") {
						router.push(`/publication/${publication.persistentId}`);
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
		rejectPublicationVersion.mutate();
	}

	function onCancel() {
		router.push(`/account`);
	}

	if (router.isFallback || publication == null || (diff == null && !diffNotFound)) {
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
						<ItemReviewForm<UpdatePublicationFormValues>
							formFields={formFields}
							name="review-item"
							initialValues={publication}
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

const Page: PageComponent<ReviewPublicationPage.Props> = ReviewPublicationPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator"].includes(user.role);
};
