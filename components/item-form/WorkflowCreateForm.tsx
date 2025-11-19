import type { FormApi, SubmissionErrors } from "final-form";
import { FORM_ERROR } from "final-form";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

import type { ItemFormValues } from "@/components/item-form/ItemForm";
import { removeEmptyItemFieldsOnSubmit } from "@/components/item-form/removeEmptyItemFieldsOnSubmit";
import { useCreateItemMeta } from "@/components/item-form/useCreateItemMeta";
import { useCreateOrUpdateWorkflow } from "@/components/item-form/useCreateOrUpdateWorkflow";
import { useWorkflowFormFields } from "@/components/item-form/useWorkflowFormFields";
import type { WorkflowFormPage } from "@/components/item-form/useWorkflowFormPage";
import { useWorkflowFormRecommendedFields } from "@/components/item-form/useWorkflowFormRecommendedFields";
import { useWorkflowWithStepsValidationSchema } from "@/components/item-form/useWorkflowValidationSchema";
import { WorkflowForm } from "@/components/item-form/WorkflowForm";
import type { WorkflowInput } from "@/data/sshoc/api/workflow";
import type { WorkflowStepInput } from "@/data/sshoc/api/workflow-step";
import { getApiErrorMessage } from "@/data/sshoc/utils/get-api-error-message";

export type CreateWorkflowFormValues = ItemFormValues<
	WorkflowInput & {
		composedOf?: Array<ItemFormValues<WorkflowStepInput>>;
		"__create-handle__"?: boolean;
	}
>;

export interface WorkflowCreateFormProps {
	page: WorkflowFormPage;
	setPage: (page: WorkflowFormPage) => void;
}

export function WorkflowCreateForm(props: WorkflowCreateFormProps): ReactNode {
	const { page, setPage } = props;

	const category = "workflow";

	const router = useRouter();
	const formFields = useWorkflowFormFields();
	const recommendedFields = useWorkflowFormRecommendedFields();
	const validate = useWorkflowWithStepsValidationSchema(removeEmptyItemFieldsOnSubmit);
	const meta = useCreateItemMeta({ category });
	const createOrUpdateWorkflow = useCreateOrUpdateWorkflow(undefined, { meta });

	function onSubmit(
		values: CreateWorkflowFormValues,
		form: FormApi<CreateWorkflowFormValues>,
		done?: (errors?: SubmissionErrors) => void,
	) {
		const shouldSaveAsDraft = values["__draft__"] === true;
		delete values["__draft__"];

		const shouldCreateHandle = values["__create-handle__"] === true;
		delete values["__create-handle__"];

		const data = removeEmptyItemFieldsOnSubmit(values);
		delete values["__submitting__"];

		form.pauseValidation();
		createOrUpdateWorkflow.mutate(
			{ data, draft: shouldSaveAsDraft, createHandle: shouldCreateHandle },
			{
				onSuccess(workflow) {
					if (workflow.status === "draft") {
						form.batch(() => {
							form.change("persistentId", workflow.persistentId);
							form.change("status", workflow.status);
							workflow.composedOf.forEach((step, index) => {
								form.change(`composedOf[${index}].persistentId`, step.persistentId);
								form.change(`composedOf[${index}].status`, step.status);
							});
						});
						window.scrollTo(0, 0);
						form.resumeValidation();
					} else if (workflow.status === "approved") {
						router.push(`/workflow/${workflow.persistentId}`);
					} else {
						router.push(`/success`);
					}
					done?.();
				},
				onError(error) {
					form.resumeValidation();
					getApiErrorMessage(error).then((message) => {
						done?.({ [FORM_ERROR]: message });
					});
				},
			},
		);
	}

	function onCancel() {
		router.push(`/account`);
	}

	return (
		<WorkflowForm<CreateWorkflowFormValues>
			allowHandleCreation={true}
			formFields={formFields}
			initialValues={recommendedFields}
			name="create-workflow"
			onCancel={onCancel}
			onSubmit={onSubmit}
			validate={validate}
			page={page}
			setPage={setPage}
		/>
	);
}
