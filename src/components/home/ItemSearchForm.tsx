import type { FormEvent, Key } from 'react'
import { useMemo, useState } from 'react'

import { ItemCategoryIcon } from '@/components/common/ItemCategoryIcon'
import { ItemSearchTermAutocomplete } from '@/components/common/ItemSearchTermAutocomplete'
import { useSearchItems } from '@/components/common/useSearchItems'
import css from '@/components/home/ItemSearchForm.module.css'
import type { ItemCategory } from '@/data/sshoc/api/item'
import { useItemCategories } from '@/data/sshoc/hooks/item'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Button } from '@/lib/core/ui/Button/Button'
import { Item } from '@/lib/core/ui/Collection/Item'
import { Select } from '@/lib/core/ui/Select/Select'
import { isNonEmptyString, keys } from '@/lib/utils'

const allItemCategories = '__all__'

type ItemCategoryOptionId = ItemCategory | typeof allItemCategories

export interface ItemSearchFormProps {
  initialItemSearchTerm?: string
}

export function ItemSearchForm(props: ItemSearchFormProps): JSX.Element {
  const { initialItemSearchTerm } = props

  const { t } = useI18n<'common'>()
  const { searchItems } = useSearchItems()

  const [selectedItemCategory, setSelectedItemCategory] =
    useState<ItemCategoryOptionId>(allItemCategories)
  const [itemSearchTerm, setItemSearchTerm] = useState(initialItemSearchTerm ?? '')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const categories =
      selectedItemCategory !== allItemCategories ? [selectedItemCategory] : undefined
    const q = isNonEmptyString(itemSearchTerm) ? itemSearchTerm : undefined

    searchItems({ q, categories })

    event.preventDefault()
  }

  return (
    <form
      name="item-search"
      noValidate
      role="search"
      method="get"
      action="/search"
      onSubmit={onSubmit}
      aria-label={t(['common', 'home', 'search', 'search-items'])}
      className={css['container']}
    >
      <ItemCategorySelect
        selectedItemCategory={selectedItemCategory}
        onSelectItemCategory={setSelectedItemCategory}
      />
      <ItemSearchTermAutocomplete
        itemCategory={selectedItemCategory !== allItemCategories ? selectedItemCategory : undefined}
        itemSearchTerm={itemSearchTerm}
        onChangeItemSearchTerm={setItemSearchTerm}
      />
      <Button color="gradient" type="submit">
        {t(['common', 'home', 'search', 'submit'])}
      </Button>
    </form>
  )
}

interface ItemCategoryOption {
  id: ItemCategoryOptionId
  label: string
}

type ItemCategoryOptions = Array<ItemCategoryOption>

function useItemCategoryOptions() {
  const { t } = useI18n<'common'>()
  const itemCategories = useItemCategories()

  const options: ItemCategoryOptions = useMemo(() => {
    const options: ItemCategoryOptions = [
      { id: allItemCategories, label: t(['common', 'home', 'search', 'all-item-categories']) },
    ]

    if (itemCategories.data == null) return options

    keys(itemCategories.data).forEach((category) => {
      if (category === 'step') return
      options.push({ id: category, label: t(['common', 'item-categories', category, 'other']) })
    })

    return options
  }, [t, itemCategories.data])

  return { ...itemCategories, data: options }
}

interface ItemCategorySelectProps {
  selectedItemCategory: ItemCategoryOptionId
  onSelectItemCategory: (category: ItemCategoryOptionId) => void
}

function ItemCategorySelect(props: ItemCategorySelectProps): JSX.Element {
  const { selectedItemCategory, onSelectItemCategory } = props

  const { t } = useI18n<'common'>()
  const itemCategories = useItemCategoryOptions()

  function onSelectionChange(key: Key) {
    onSelectItemCategory(key as ItemCategoryOptionId)
  }

  return (
    <Select
      name="categories"
      aria-label={t(['common', 'home', 'search', 'item-category'])}
      items={itemCategories.data}
      loadingState={itemCategories.isLoading ? 'loading' : undefined}
      selectedKey={selectedItemCategory}
      onSelectionChange={onSelectionChange}
    >
      {(item) => {
        return (
          <Item textValue={item.label}>
            <span
              style={{
                display: 'grid',
                gap: '6px',
                gridTemplateColumns: '20px 1fr',
                alignItems: 'center',
              }}
            >
              <span aria-hidden style={{ aspectRatio: '1' }}>
                {item.id !== allItemCategories ? <ItemCategoryIcon category={item.id} /> : null}
              </span>
              {item.label}
            </span>
          </Item>
        )
      }}
    </Select>
  )
}
