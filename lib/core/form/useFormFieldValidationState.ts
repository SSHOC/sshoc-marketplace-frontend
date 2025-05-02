import type { ValidationState } from "@react-types/shared";
import type { FieldRenderProps } from "react-final-form";

export interface FormFieldValidationState {
	isDisabled?: boolean;
	validationState?: ValidationState;
	errorMessage?: string;
}

export function useFormFieldValidationState<T>(
	meta: FieldRenderProps<T>["meta"],
): FormFieldValidationState {
	return {
		isDisabled: meta.submitting,
		validationState: meta.touched === true && meta.invalid === true ? "invalid" : undefined,
		errorMessage: Array.isArray(meta.error)
			? meta.error.join(", ")
			: meta.error || meta.submitError,
	};
}
