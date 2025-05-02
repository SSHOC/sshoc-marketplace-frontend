import { useItemFormErrorMap } from "@/components/item-form/useItemFormErrorMap";
import {
	workflowInputSchema,
	workflowWithStepsInputSchema,
} from "@/data/sshoc/validation-schemas/workflow";
import type { Preprocessor } from "@/lib/core/form/validateSchema";
import { validateSchema } from "@/lib/core/form/validateSchema";

export function useWorkflowValidationSchema(preprocess?: Preprocessor<any, any>) {
	const errorMap = useItemFormErrorMap();

	return validateSchema(workflowInputSchema, errorMap, preprocess);
}

export function useWorkflowWithStepsValidationSchema(preprocess?: Preprocessor<any, any>) {
	const errorMap = useItemFormErrorMap();

	return validateSchema(workflowWithStepsInputSchema, errorMap, preprocess);
}
