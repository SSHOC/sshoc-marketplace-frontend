import { useItemFormErrorMap } from '@/components/item-form/useItemFormErrorMap'
import { workflowStepInputSchema as schema } from '@/data/sshoc/validation-schemas/workflow-step'
import type { Preprocessor } from '@/lib/core/form/validateSchema'
import { validateSchema } from '@/lib/core/form/validateSchema'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useWorkflowStepValidationSchema(preprocess?: Preprocessor<any, any>) {
  const errorMap = useItemFormErrorMap()

  return validateSchema(schema, errorMap, preprocess)
}
