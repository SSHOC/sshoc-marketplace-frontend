import { useMemo } from 'react'

import type { ItemFormDateFields } from '@/components/item-form/useItemFormDateFields'
import { useItemFormDateFields } from '@/components/item-form/useItemFormDateFields'
import type {
  ItemFormBaseFields,
  ItemFormFieldsBase,
} from '@/components/item-form/useItemFormFields'
import { useItemFormFields } from '@/components/item-form/useItemFormFields'

export interface DatasetFormFields extends ItemFormFieldsBase {
  category: 'dataset'
  fields: ItemFormBaseFields & ItemFormDateFields
}

export function useDatasetFormFields(prefix = ''): DatasetFormFields {
  const itemFields = useItemFormFields(prefix)
  const dateFields = useItemFormDateFields(prefix)

  const fields = useMemo(() => {
    const fields: DatasetFormFields = {
      category: 'dataset',
      fields: { ...itemFields, ...dateFields },
    }

    return fields
  }, [itemFields, dateFields])

  return fields
}
