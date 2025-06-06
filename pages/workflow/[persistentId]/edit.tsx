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
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { useCreateOrUpdateWorkflow } from "@/components/item-form/useCreateOrUpdateWorkflow";
import { useUpdateItemMeta } from "@/components/item-form/useUpdateItemMeta";
import { useWorkflowFormFields } from "@/components/item-form/useWorkflowFormFields";
import { useWorkflowFormPage } from "@/components/item-form/useWorkflowFormPage";
import { useWorkflowWithStepsValidationSchema } from "@/components/item-form/useWorkflowValidationSchema";
import { WorkflowForm } from "@/components/item-form/WorkflowForm";
import { PageMetadata } from "@/components/metadata/page-metadata";
import type { Workflow, WorkflowInput } from "@/data/sshoc/api/workflow";
import { useWorkflow } from "@/data/sshoc/hooks/workflow";
import type { PageComponent } from "@/lib/core/app/types";
import { FORM_ERROR } from "@/lib/core/form/Form";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { getLocales } from "@/lib/core/i18n/getLocales";
import { load } from "@/lib/core/i18n/load";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export type UpdateWorkflowFormValues = ItemFormValues<WorkflowInput>;

export namespace EditWorkflowPage {
	export interface PathParamsInput extends ParamsInput {
		persistentId: Workflow["persistentId"];
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
): Promise<GetStaticPathsResult<EditWorkflowPage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		const persistentIds: Array<Workflow["persistentId"]> = [];
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
	context: GetStaticPropsContext<EditWorkflowPage.PathParams>,
): Promise<GetStaticPropsResult<EditWorkflowPage.Props>> {
	const locale = getLocale(context);
	const params = context.params as EditWorkflowPage.PathParams;
	const messages = await load(locale, ["common", "authenticated"]);

	return {
		props: {
			messages,
			params,
		},
	};
}

export default function EditWorkflowPage(props: EditWorkflowPage.Props): ReactNode {
	const t = useTranslations();
	const router = useRouter();

	const { persistentId } = props.params;
	const _workflow = useWorkflow({ persistentId }, undefined, {
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
	const workflow = _workflow.data;

	const { page, setPage } = useWorkflowFormPage();

	const category = workflow?.category ?? "workflow";
	const label = t(`common.item-categories.${category}.one`);
	const title = t("authenticated.forms.edit-item", {
		item:
			page.type === "workflow"
				? label
				: page.type === "steps"
					? t("common.item-categories.step.other")
					: t("common.item-categories.step.one"),
	});

	const formFields = useWorkflowFormFields();
	const validate = useWorkflowWithStepsValidationSchema();
	const meta = useUpdateItemMeta({ category });
	const createOrUpdateWorkflow = useCreateOrUpdateWorkflow(undefined, { meta });

	function onSubmit(
		values: UpdateWorkflowFormValues,
		form: FormApi<UpdateWorkflowFormValues>,
		done?: (errors?: SubmissionErrors) => void,
	) {
		delete values["__submitting__"];

		const shouldSaveAsDraft = values["__draft__"] === true;
		delete values["__draft__"];

		createOrUpdateWorkflow.mutate(
			{ data: values, draft: shouldSaveAsDraft },
			{
				onSuccess(workflow) {
					if (workflow.status === "draft") {
						// FIXME: Probably better to keep this state in useCreateOrUpdateWorkflow.
						form.batch(() => {
							form.change("persistentId", workflow.persistentId);
							form.change("status", workflow.status);
						});
						window.scrollTo(0, 0);
					} else if (workflow.status === "approved") {
						router.push(`/workflow/${workflow.persistentId}`);
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

	if (router.isFallback || workflow == null) {
		return (
			<Fragment>
				<PageMetadata title={title} />
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
			<PageMetadata noindex title={title} />
			<PageMainContent>
				<ItemFormScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<ScreenTitle>{title}</ScreenTitle>
					</ScreenHeader>
					<Content>
						<FormHelpText />
						<WorkflowForm<UpdateWorkflowFormValues>
							formFields={formFields}
							initialValues={workflow}
							name="update-workflow"
							onCancel={onCancel}
							onSubmit={onSubmit}
							validate={validate}
							page={page}
							setPage={setPage}
						/>
					</Content>
					<FundingNotice />
				</ItemFormScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<EditWorkflowPage.Props> = EditWorkflowPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator", "contributor"].includes(user.role);
};
