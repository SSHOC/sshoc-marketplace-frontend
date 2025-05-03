import type { FormApi, SubmissionErrors } from "final-form";
import type {
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from "next";
import { useRouter } from "next/router";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { FormHelpText } from "@/components/item-form/FormHelpText";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import { ItemForm } from "@/components/item-form/ItemForm";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { useCreateOrUpdatePublication } from "@/components/item-form/useCreateOrUpdatePublication";
import { usePublicationFormFields } from "@/components/item-form/usePublicationFormFields";
import { usePublicationValidationSchema } from "@/components/item-form/usePublicationValidationSchema";
import { useUpdateItemMeta } from "@/components/item-form/useUpdateItemMeta";
import type { Publication, PublicationInput } from "@/data/sshoc/api/publication";
import { usePublication } from "@/data/sshoc/hooks/publication";
import type { PageComponent } from "@/lib/core/app/types";
import { FORM_ERROR } from "@/lib/core/form/Form";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { getLocales } from "@/lib/core/i18n/getLocales";
import { load } from "@/lib/core/i18n/load";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export type UpdatePublicationFormValues = ItemFormValues<PublicationInput>;

export namespace EditPublicationPage {
	export interface PathParamsInput extends ParamsInput {
		persistentId: Publication["persistentId"];
	}
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export interface Props {
		messages: Messages;
		params: PathParams;
	}
}

export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<EditPublicationPage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		const persistentIds: Array<Publication["persistentId"]> = [];
		return persistentIds.map((persistentId) => {
			const params = { persistentId };
			return { locale, params };
		});
	});

	return {
		paths,
		fallback: "blocking",
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<EditPublicationPage.PathParams>,
): Promise<GetStaticPropsResult<EditPublicationPage.Props>> {
	const locale = getLocale(context);
	const params = context.params as EditPublicationPage.PathParams;
	const messages = await load(locale, ["common", "authenticated"]);

	return {
		props: {
			messages,
			params,
		},
	};
}

export default function EditPublicationPage(props: EditPublicationPage.Props): ReactNode {
	const t = useTranslations();
	const router = useRouter();

	const { persistentId } = props.params;
	const _publication = usePublication({ persistentId }, undefined, {
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
	const publication = _publication.data;

	const category = publication?.category ?? "publication";
	const label = t(`common.item-categories.${category}.one`);
	const title = t("authenticated.forms.edit-item", { item: label });

	const formFields = usePublicationFormFields();
	const validate = usePublicationValidationSchema();
	const meta = useUpdateItemMeta({ category });
	const createOrUpdatePublication = useCreateOrUpdatePublication(undefined, { meta });

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

	function onCancel() {
		router.push(`/account`);
	}

	if (router.isFallback || publication == null) {
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
						<FormHelpText />
						<ItemForm<UpdatePublicationFormValues>
							formFields={formFields}
							name="update-item"
							initialValues={publication}
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

const Page: PageComponent<EditPublicationPage.Props> = EditPublicationPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator", "contributor"].includes(user.role);
};
