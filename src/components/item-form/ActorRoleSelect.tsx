import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { useActorRoles } from '@/data/sshoc/hooks/actor'
import { FormSelect } from '@/lib/core/form/FormSelect'
import { Item } from '@/lib/core/ui/Collection/Item'

export interface ActorRoleSelectProps {
  field: ItemFormFields['fields']['contributors']['fields']['role']
}

export function ActorRoleSelect(props: ActorRoleSelectProps): JSX.Element {
  const { field } = props

  const actorRoles = useActorRoles()
  const items = actorRoles.data ?? []

  return (
    <FormSelect {...field} isLoading={actorRoles.isLoading} items={items}>
      {(item) => {
        return <Item key={item.code}>{item.label}</Item>
      }}
    </FormSelect>
  )
}
