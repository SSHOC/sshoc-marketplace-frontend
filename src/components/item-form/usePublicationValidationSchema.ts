import { useItemFormErrorMap } from '@/components/item-form/useItemFormErrorMap'
import { publicationInputSchema as schema } from '@/data/sshoc/validation-schemas/publication'
import type { Preprocessor } from '@/lib/core/form/validateSchema'
import { validateSchema } from '@/lib/core/form/validateSchema'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function usePublicationValidationSchema(preprocess?: Preprocessor<any, any>) {
  const errorMap = useItemFormErrorMap()

  return validateSchema(schema, errorMap, preprocess)
}
