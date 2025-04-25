import { useForm } from 'react-final-form'
import type { FieldArrayRenderProps } from 'react-final-form-arrays'

import type { DiffFieldMetadata } from '@/components/item-form/useItemDiffFormFieldsMetadata'
import { useFieldState } from '@/lib/core/form/useFieldState'

export interface UseReviewFieldListItemMetadataArgs<T> {
  name: string
  fields: FieldArrayRenderProps<T, HTMLElement>['fields']
  index: number
}

 
export function useReviewFieldListItemMetadata<T>(args: UseReviewFieldListItemMetadataArgs<T>) {
  const { name, fields, index } = args

  const form = useForm()
   
  const setFieldData = form.mutators['setFieldData']!
  const fieldState = useFieldState(name, { data: true })
  const data = fieldState.meta.data as DiffFieldMetadata<T> | undefined
  const metadata = data?.diff

  function onApprove() {
    if (metadata == null) {return}

    form.batch(() => {
      setFieldData(name, { diff: undefined })
      switch (metadata.status) {
        case 'changed':
        case 'inserted':
        case 'unchanged':
          break
        case 'deleted':
          fields.remove(index)
          break
      }
    })
  }

  function onReject() {
    if (metadata == null) {return}

    form.batch(() => {
      setFieldData(name, { diff: undefined })
      switch (metadata.status) {
        case 'changed':
        case 'deleted':
          form.change(name, metadata.current)
          break
        case 'unchanged':
          break
        case 'inserted':
          fields.remove(index)
          break
      }
    })
  }

  return { metadata, onApprove, onReject }
}
