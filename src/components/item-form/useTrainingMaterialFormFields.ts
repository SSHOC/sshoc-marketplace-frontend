import { useMemo } from 'react'

import type { ItemFormDateFields } from '@/components/item-form/useItemFormDateFields'
import { useItemFormDateFields } from '@/components/item-form/useItemFormDateFields'
import type {
  ItemFormBaseFields,
  ItemFormFieldsBase,
} from '@/components/item-form/useItemFormFields'
import { useItemFormFields } from '@/components/item-form/useItemFormFields'

export interface TrainingMaterialFormFields extends ItemFormFieldsBase {
  category: 'training-material'
  fields: ItemFormBaseFields & ItemFormDateFields
}

export function useTrainingMaterialFormFields(prefix = ''): TrainingMaterialFormFields {
  const itemFields = useItemFormFields(prefix)
  const dateFields = useItemFormDateFields(prefix)

  const fields = useMemo(() => {
    const fields: TrainingMaterialFormFields = {
      category: 'training-material',
      fields: { ...itemFields, ...dateFields },
    }

    return fields
  }, [itemFields, dateFields])

  return fields
}
