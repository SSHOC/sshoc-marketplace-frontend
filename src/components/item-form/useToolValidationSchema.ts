import { useItemFormErrorMap } from "@/components/item-form/useItemFormErrorMap";
import { toolInputSchema as schema } from "@/data/sshoc/validation-schemas/tool";
import type { Preprocessor } from "@/lib/core/form/validateSchema";
import { validateSchema } from "@/lib/core/form/validateSchema";

export function useToolValidationSchema(preprocess?: Preprocessor<any, any>) {
	const errorMap = useItemFormErrorMap();

	return validateSchema(schema, errorMap, preprocess);
}
