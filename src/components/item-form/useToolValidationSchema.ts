import { useItemFormErrorMap } from '@/components/item-form/useItemFormErrorMap'
import { toolInputSchema as schema } from '@/data/sshoc/validation-schemas/tool'
import { validateSchema } from '@/lib/core/form/validateSchema'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useToolValidationSchema() {
  const errorMap = useItemFormErrorMap()

  return validateSchema(schema, errorMap)
}
