import { useItemFormErrorMap } from '@/components/item-form/useItemFormErrorMap'
import {
  workflowInputSchema,
  workflowWithStepsInputSchema,
} from '@/data/sshoc/validation-schemas/workflow'
import type { Preprocessor } from '@/lib/core/form/validateSchema'
import { validateSchema } from '@/lib/core/form/validateSchema'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useWorkflowValidationSchema(preprocess?: Preprocessor<any, any>) {
  const errorMap = useItemFormErrorMap()

  return validateSchema(workflowInputSchema, errorMap, preprocess)
}

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useWorkflowWithStepsValidationSchema(preprocess?: Preprocessor<any, any>) {
  const errorMap = useItemFormErrorMap()

  return validateSchema(workflowWithStepsInputSchema, errorMap, preprocess)
}
