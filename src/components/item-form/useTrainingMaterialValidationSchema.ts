import { useItemFormErrorMap } from "@/components/item-form/useItemFormErrorMap";
import { trainingMaterialInputSchema as schema } from "@/lib/data/sshoc/validation-schemas/training-material";
import type { Preprocessor } from "@/lib/core/form/validateSchema";
import { validateSchema } from "@/lib/core/form/validateSchema";

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useTrainingMaterialValidationSchema(
  preprocess?: Preprocessor<any, any>
) {
  const errorMap = useItemFormErrorMap();

  return validateSchema(schema, errorMap, preprocess);
}
