import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { PropertyType } from '@/data/sshoc/api/property'
import type { FormSelectProps } from '@/lib/core/form/FormSelect'
import { FormSelect } from '@/lib/core/form/FormSelect'
import { Item } from '@/lib/core/ui/Collection/Item'

export interface PropertyTypeSelectProps
  extends Pick<FormSelectProps<PropertyType>, 'isLoading' | 'items' | 'onSelectionChange'> {
  field: ItemFormFields['fields']['properties']['fields']['type']
}

export function PropertyTypeSelect(props: PropertyTypeSelectProps): JSX.Element {
  const { field, items, isLoading, onSelectionChange } = props

  return (
    <FormSelect
      {...field}
      isLoading={isLoading}
      items={items}
      onSelectionChange={onSelectionChange}
    >
      {(item) => {
        return <Item key={item.code}>{item.label}</Item>
      }}
    </FormSelect>
  )
}
