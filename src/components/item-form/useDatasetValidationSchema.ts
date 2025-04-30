import { useItemFormErrorMap } from "@/components/item-form/useItemFormErrorMap";
import { datasetInputSchema as schema } from "@/data/sshoc/validation-schemas/dataset";
import type { Preprocessor } from "@/lib/core/form/validateSchema";
import { validateSchema } from "@/lib/core/form/validateSchema";

export function useDatasetValidationSchema(preprocess?: Preprocessor<any, any>) {
	const errorMap = useItemFormErrorMap();

	return validateSchema(schema, errorMap, preprocess);
}
