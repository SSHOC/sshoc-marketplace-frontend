import type { Key } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-final-form'

import { ItemInfo } from '@/components/common/ItemInfo'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { RelatedItem } from '@/data/sshoc/api/item'
import { useItemSearchInfinite } from '@/data/sshoc/hooks/item'
import { FormComboBox } from '@/lib/core/form/FormComboBox'
import { useFieldState } from '@/lib/core/form/useFieldState'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Item } from '@/lib/core/ui/Collection/Item'
import { mapBy } from '@/lib/utils'
import { useDebouncedState } from '@/lib/utils/hooks/useDebouncedState'
import { debounceDelay } from '~/config/sshoc.config'

export interface RelatedItemComboBoxProps {
  field: ItemFormFields['fields']['relatedItems']['fields']['item'] & { _root: string }
}

export function RelatedItemComboBox(props: RelatedItemComboBoxProps): JSX.Element {
  const { field } = props

  const form = useForm()
  const { t } = useI18n<'common'>()

  const idField = 'persistentId'
  const labelField = 'label'
  const labelFieldName = [field._root, labelField].join('.')

  const initialValue = useFieldState<RelatedItem | undefined>(field._root).input.value
  const initialSearchTerm = initialValue?.[labelField] ?? ''

  const [itemSearchTerm, setItemSearchTerm] = useState<string>(initialSearchTerm)
  const debouncedItemSearchTerm = useDebouncedState({ value: itemSearchTerm, delay: debounceDelay })
  // TODO: `placeholderData`
  const itemSearchResults = useItemSearchInfinite({
    q: debouncedItemSearchTerm.length > 0 ? debouncedItemSearchTerm : undefined,
    order: ['label'],
  })
  const items = useMemo(() => {
    if (itemSearchResults.data?.pages == null) return []
    return itemSearchResults.data.pages.flatMap((page) => {
      return page.items
    })
  }, [itemSearchResults.data?.pages])
  const itemsById = useMemo(() => {
    return mapBy(items, idField)
  }, [items])

  function onSelectionChange(id: Key | null) {
    if (id == null) {
      form.change(labelFieldName, undefined)
      setItemSearchTerm('')
    } else {
      const item = itemsById.get(id as string)
      const label = item?.[labelField]
      form.change(labelFieldName, label)
      setItemSearchTerm(label ?? '')
    }
  }

  /** Need to update input value when selection changes, but also when item moves to new array index. */
  useEffect(() => {
    setItemSearchTerm(initialSearchTerm)
  }, [initialSearchTerm])

  const loadingState = itemSearchResults.isLoading
    ? 'loading'
    : itemSearchResults.isFetchingNextPage
    ? 'loadingMore'
    : 'idle'

  return (
    <FormComboBox
      {...field}
      inputValue={itemSearchTerm}
      items={items}
      layout={layout}
      loadingState={loadingState}
      onInputChange={setItemSearchTerm}
      onLoadMore={
        itemSearchResults.hasNextPage === true && itemSearchResults.isSuccess
          ? itemSearchResults.fetchNextPage
          : undefined
      }
      onSelectionChange={onSelectionChange}
    >
      {(item) => {
        return (
          <Item key={item[idField]} textValue={item[labelField]}>
            {item[labelField]}
            <ItemInfo>{t(['common', 'item-categories', item.category, 'one'])}</ItemInfo>
          </Item>
        )
      }}
    </FormComboBox>
  )
}

const layout = {
  estimatedRowHeight: 60,
}
