import type { FormApi, SubmissionErrors } from "final-form";
import { FORM_ERROR } from "final-form";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

import type { ItemFormValues } from "@/components/item-form/ItemForm";
import { ItemForm } from "@/components/item-form/ItemForm";
import { removeEmptyItemFieldsOnSubmit } from "@/components/item-form/removeEmptyItemFieldsOnSubmit";
import { useCreateItemMeta } from "@/components/item-form/useCreateItemMeta";
import { useCreateOrUpdateTrainingMaterial } from "@/components/item-form/useCreateOrUpdateTrainingMaterial";
import { useTrainingMaterialFormFields } from "@/components/item-form/useTrainingMaterialFormFields";
import { useTrainingMaterialFormRecommendedFields } from "@/components/item-form/useTrainingMaterialFormRecommendedFields";
import { useTrainingMaterialValidationSchema } from "@/components/item-form/useTrainingMaterialValidationSchema";
import type { TrainingMaterialInput } from "@/data/sshoc/api/training-material";
import { getApiErrorMessage } from "@/data/sshoc/utils/get-api-error-message";

export type CreateTrainingMaterialFormValues = ItemFormValues<TrainingMaterialInput>;

export function TrainingMaterialCreateForm(): ReactNode {
	const category = "training-material";

	const router = useRouter();
	const formFields = useTrainingMaterialFormFields();
	const recommendedFields = useTrainingMaterialFormRecommendedFields();
	const validate = useTrainingMaterialValidationSchema(removeEmptyItemFieldsOnSubmit);
	const meta = useCreateItemMeta({ category });
	const createOrUpdateTrainingMaterial = useCreateOrUpdateTrainingMaterial(undefined, { meta });

	function onSubmit(
		values: CreateTrainingMaterialFormValues,
		form: FormApi<CreateTrainingMaterialFormValues>,
		done?: (errors?: SubmissionErrors) => void,
	) {
		const shouldSaveAsDraft = values["__draft__"] === true;
		delete values["__draft__"];

		const data = removeEmptyItemFieldsOnSubmit(values);
		delete values["__submitting__"];

		form.pauseValidation();
		createOrUpdateTrainingMaterial.mutate(
			{ data, draft: shouldSaveAsDraft },
			{
				onSuccess(trainingMaterial) {
					if (trainingMaterial.status === "draft") {
						form.batch(() => {
							form.change("persistentId", trainingMaterial.persistentId);
							form.change("status", trainingMaterial.status);
						});
						window.scrollTo(0, 0);
						form.resumeValidation();
					} else if (trainingMaterial.status === "approved") {
						router.push(`/training-material/${trainingMaterial.persistentId}`);
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
		<ItemForm<CreateTrainingMaterialFormValues>
			formFields={formFields}
			name="create-item"
			initialValues={recommendedFields}
			onCancel={onCancel}
			onSubmit={onSubmit}
			validate={validate}
		/>
	);
}
