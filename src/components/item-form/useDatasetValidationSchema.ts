import { useItemFormErrorMap } from '@/components/item-form/useItemFormErrorMap'
import { datasetInputSchema as schema } from '@/data/sshoc/validation-schemas/dataset'
import { validateSchema } from '@/lib/core/form/validateSchema'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useDatasetValidationSchema() {
  const errorMap = useItemFormErrorMap()

  return validateSchema(schema, errorMap)
}
