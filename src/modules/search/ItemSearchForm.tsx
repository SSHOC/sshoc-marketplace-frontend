import { useRouter } from 'next/router'
import { FormEvent, ReactNode, useMemo, useState } from 'react'
import { useAutocompleteItems, useGetItemCategories } from '@/api/sshoc'
import { ItemCategory, ItemSearchQuery } from '@/api/sshoc/types'
import { Button } from '@/elements/Button/Button'
import { HighlightedText } from '@/elements/HighlightedText/HighlightedText'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { ComboBox } from '@/elements/ComboBox/ComboBox'
import { Select } from '@/elements/Select/Select'

interface SearchFormValues {
  q?: string
  category?: ItemCategory
}

export interface ItemSearchFormProps {
  children?: ReactNode
  className?: string
}

export default function ItemSearchForm(
  props: ItemSearchFormProps,
): JSX.Element {
  const router = useRouter()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const values: SearchFormValues = Object.fromEntries(
      new FormData(event.currentTarget),
    )

    const query: ItemSearchQuery = {}

    if (values.q != null && values.q.length > 0) {
      query.q = values.q
    }
    if (values.category != null && values.category.length > 0) {
      query.categories = [values.category]
    }

    router.push({ pathname: '/search', query })
  }

  return (
    <form onSubmit={onSubmit} role="search" className={props.className}>
      {props.children}
    </form>
  )
}

export function ItemCategorySelect(): JSX.Element {
  const categories = useGetItemCategories()
  const itemCategories = useMemo(() => {
    const items = [{ id: '', label: 'All categories' }]

    if (categories.data === undefined) return items

    Object.entries(categories.data).forEach(([id, label]) => {
      items.push({ id, label })
    })

    return items
  }, [categories.data])

  return (
    <Select
      name="category"
      aria-label="Category"
      isLoading={categories.isLoading}
      items={itemCategories}
      /** Use explicit "All categories" option, not placeholder text as initial value. */
      defaultSelectedKey=""
      variant="search"
    >
      {(item) => <Select.Item key={item.id}>{item.label}</Select.Item>}
    </Select>
  )
}

export interface ItemSearchComboBoxProps {
  variant?: 'invisible'
}

export function ItemSearchComboBox(
  props: ItemSearchComboBoxProps,
): JSX.Element {
  const defaultSearchTerm = useQueryParam('q', false) ?? ''

  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm)
  const debouncedSearchTerm = useDebouncedState(searchTerm, 150).trim()
  const items = useAutocompleteItems(
    { q: debouncedSearchTerm },
    {
      /** backend requires non-empty search phrase */
      enabled: debouncedSearchTerm.length > 0,
      keepPreviousData: true,
    },
  )
  const suggestions =
    items.data?.suggestions?.map((suggestion) => ({ suggestion })) ?? []

  return (
    <ComboBox
      name="q"
      aria-label="Search term"
      allowsCustomValue
      items={suggestions}
      isLoading={items.isLoading}
      defaultInputValue={defaultSearchTerm}
      onInputChange={setSearchTerm}
      variant="search"
      type="search"
      hideSelectionIcon
      hideButton
      style={
        props.variant === 'invisible'
          ? { borderWidth: 0, flex: 1 }
          : { flex: 1 }
      }
    >
      {(item) => (
        <ComboBox.Item key={item.suggestion} textValue={item.suggestion}>
          <HighlightedText
            text={item.suggestion}
            searchPhrase={debouncedSearchTerm}
          />
        </ComboBox.Item>
      )}
    </ComboBox>
  )
}

export interface SubmitButtonProps {
  className?: string
}

export function SubmitButton(props: SubmitButtonProps): JSX.Element {
  return (
    <Button type="submit" variant="gradient" className={props.className}>
      Submit
    </Button>
  )
}
