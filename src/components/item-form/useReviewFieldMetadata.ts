import { useForm } from 'react-final-form'

import type { DiffFieldMetadata } from '@/components/item-form/useItemDiffFormFieldsMetadata'
import { useFieldState } from '@/lib/core/form/useFieldState'

export interface UseReviewFieldMetadataArgs {
  name: string
}

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useReviewFieldMetadata<T>(args: UseReviewFieldMetadataArgs) {
  const { name } = args

  const form = useForm()
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const setFieldData = form.mutators['setFieldData']!
  const fieldState = useFieldState(name, { data: true })
  const data = fieldState.meta.data as DiffFieldMetadata<T> | undefined
  const metadata = data?.diff

  function onApprove() {
    form.batch(() => {
      setFieldData(name, { diff: undefined })
    })
  }

  function onReject() {
    form.batch(() => {
      setFieldData(name, { diff: undefined })
      form.change(name, metadata?.current)
    })
  }

  return { metadata, onApprove, onReject }
}
