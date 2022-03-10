import { useItemFormErrorMap } from '@/components/item-form/useItemFormErrorMap'
import { trainingMaterialInputSchema as schema } from '@/data/sshoc/validation-schemas/training-material'
import { validateSchema } from '@/lib/core/form/validateSchema'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useTrainingMaterialValidationSchema() {
  const errorMap = useItemFormErrorMap()

  return validateSchema(schema, errorMap)
}
