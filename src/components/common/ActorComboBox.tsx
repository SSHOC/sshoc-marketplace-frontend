import type { Key } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-final-form'

import { ItemInfo } from '@/components/common/ItemInfo'
import type { ActorFormFields } from '@/components/common/useActorFormFields'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { Actor } from '@/data/sshoc/api/actor'
import { useActorSearchInfinite } from '@/data/sshoc/hooks/actor'
import { FormComboBox } from '@/lib/core/form/FormComboBox'
import { useFieldState } from '@/lib/core/form/useFieldState'
import { Item } from '@/lib/core/ui/Collection/Item'
import { mapBy } from '@/lib/utils'
import { useDebouncedState } from '@/lib/utils/hooks/useDebouncedState'
import { debounceDelay } from '~/config/sshoc.config'

export interface ActorComboBoxProps {
  field:
    | ItemFormFields['fields']['contributors']['fields']['actor']
    | (ActorFormFields['affiliations']['fields']['actor'] & { _root: string })
}

export function ActorComboBox(props: ActorComboBoxProps): JSX.Element {
  const { field } = props

  const form = useForm()

  const idField = 'id'
  const labelField = 'name'
  const labelFieldName = [field._root, labelField].join('.')

  const initialValue = useFieldState<Actor | undefined>(field._root).input.value
  const initialSearchTerm = initialValue?.[labelField] ?? ''

  const [actorSearchTerm, setActorSearchTerm] = useState<string>(initialSearchTerm)
  const debouncedActorSearchTerm = useDebouncedState({
    value: actorSearchTerm,
    delay: debounceDelay,
  })
  // TODO: `placeholderData`
  const actorSearchResults = useActorSearchInfinite({
    q: debouncedActorSearchTerm.length > 0 ? debouncedActorSearchTerm : undefined,
    order: 'name',
  })
  const items = useMemo(() => {
    if (actorSearchResults.data?.pages == null) {return []}
    return actorSearchResults.data.pages.flatMap((page) => {
      return page.actors
    })
  }, [actorSearchResults.data?.pages])
  const itemsById = useMemo(() => {
    return mapBy(items, idField)
  }, [items])

  function onSelectionChange(id: Key | null) {
    if (id == null) {
      form.change(labelFieldName, undefined)
      setActorSearchTerm('')
    } else {
      const item = itemsById.get(id as number)
      const label = item?.[labelField]
      form.change(labelFieldName, label)
      setActorSearchTerm(label ?? '')
    }
  }

  /** Need to update input value when selection changes, but also when item moves to new array index. */
  useEffect(() => {
    setActorSearchTerm(initialSearchTerm)
  }, [initialSearchTerm])

  const loadingState = actorSearchResults.isLoading
    ? 'loading'
    : actorSearchResults.isFetchingNextPage
      ? 'loadingMore'
      : 'idle'

  return (
    <FormComboBox
      {...field}
      inputValue={actorSearchTerm}
      items={items}
      layout={layout}
      loadingState={loadingState}
      onInputChange={setActorSearchTerm}
      onLoadMore={
        actorSearchResults.hasNextPage === true && actorSearchResults.isSuccess
          ? actorSearchResults.fetchNextPage
          : undefined
      }
      onSelectionChange={onSelectionChange}
    >
      {(item) => {
        return (
          <Item textValue={item[labelField]}>
            {item[labelField]}
            <ItemInfo>
              {item.affiliations.map((actor) => {
                return actor.name
              })}
            </ItemInfo>
          </Item>
        )
      }}
    </FormComboBox>
  )
}

const layout = {
  estimatedRowHeight: 60,
}
