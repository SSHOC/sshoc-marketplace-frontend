import { useItemFormErrorMap } from '@/components/item-form/useItemFormErrorMap'
import { workflowInputSchema as schema } from '@/data/sshoc/validation-schemas/workflow'
import { validateSchema } from '@/lib/core/form/validateSchema'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useWorkflowValidationSchema() {
  const errorMap = useItemFormErrorMap()

  return validateSchema(schema, errorMap)
}
