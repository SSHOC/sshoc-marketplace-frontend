import type { FormApi } from 'final-form'

import { FormSections } from '@/components/common/FormSections'
import { ActorFormSection } from '@/components/item-form/ActorFormSection'
import { DateFormSection } from '@/components/item-form/DateFormSection'
import { ItemFormControls } from '@/components/item-form/ItemFormControls'
import { MainFormSection } from '@/components/item-form/MainFormSection'
import { MediaFormSection } from '@/components/item-form/MediaFormSection'
import { PropertyFormSection } from '@/components/item-form/PropertyFormSection'
import { RelatedItemFormSection } from '@/components/item-form/RelatedItemFormSection'
import { ThumbnailFormSection } from '@/components/item-form/ThumbnailFormSection'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { Item, ItemInput } from '@/data/sshoc/api/item'
import type { FormProps } from '@/lib/core/form/Form'
import { Form } from '@/lib/core/form/Form'

export type ItemFormValues<T extends ItemInput> = T & {
  persistentId?: Item['persistentId']
  status?: Item['status']
  __draft__?: boolean
}

export interface ItemFormProps<T extends ItemInput> extends FormProps<T> {
  name?: string
  onCancel: () => void
  formFields: ItemFormFields
}

export function ItemForm<T extends ItemFormValues<ItemInput>>(
  props: ItemFormProps<T>,
): JSX.Element {
  const { formFields, initialValues, name, onCancel, onSubmit, validate } = props

  function onBeforeSaveAsDraft(form: FormApi<T>) {
    form.change('__draft__', true)
  }

  function onBeforeSubmit(form: FormApi<T>) {
    form.change('__draft__', false)
  }

  return (
    <Form initialValues={initialValues} name={name} onSubmit={onSubmit} validate={validate}>
      <FormSections>
        <MainFormSection formFields={formFields} />
        <DateFormSection formFields={formFields} />
        <ActorFormSection formFields={formFields} />
        <PropertyFormSection formFields={formFields} />
        <MediaFormSection formFields={formFields} />
        <ThumbnailFormSection formFields={formFields} />
        <RelatedItemFormSection formFields={formFields} />

        <ItemFormControls<T>
          onBeforeSaveAsDraft={onBeforeSaveAsDraft}
          onBeforeSubmit={onBeforeSubmit}
          onCancel={onCancel}
        />
      </FormSections>
    </Form>
  )
}
