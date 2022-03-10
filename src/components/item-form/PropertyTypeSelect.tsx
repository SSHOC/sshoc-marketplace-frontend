import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { PropertyType } from '@/data/sshoc/api/property'
import type { FormSelectProps } from '@/lib/core/form/FormSelect'
import { FormSelect } from '@/lib/core/form/FormSelect'
import { Item } from '@/lib/core/ui/Collection/Item'

export interface PropertyTypeSelectProps
  extends Pick<FormSelectProps<PropertyType>, 'items' | 'loadingState' | 'onSelectionChange'> {
  field: ItemFormFields['fields']['properties']['fields']['type']
}

export function PropertyTypeSelect(props: PropertyTypeSelectProps): JSX.Element {
  const { field, items, loadingState, onSelectionChange } = props

  return (
    <FormSelect
      {...field}
      loadingState={loadingState}
      items={items}
      onSelectionChange={onSelectionChange}
    >
      {(item) => {
        return <Item key={item.code}>{item.label}</Item>
      }}
    </FormSelect>
  )
}
