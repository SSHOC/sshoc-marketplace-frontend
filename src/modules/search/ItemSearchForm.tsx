import { useRouter } from 'next/router'
import type { FormEvent, Key, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { useAutocompleteItems, useGetItemCategories } from '@/api/sshoc'
import type { ItemCategory, ItemSearchQuery } from '@/api/sshoc/types'
import { Button } from '@/elements/Button/Button'
import { ComboBox } from '@/elements/ComboBox/ComboBox'
import { HighlightedText } from '@/elements/HighlightedText/HighlightedText'
import { Select } from '@/elements/Select/Select'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { useQueryParam } from '@/lib/hooks/useQueryParam'

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
  shouldSubmitOnSelect?: boolean
}

export function ItemSearchComboBox(
  props: ItemSearchComboBoxProps,
): JSX.Element {
  const router = useRouter()
  const defaultSearchTerm = useQueryParam('q', false)
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm ?? '')

  /**
   * When the page is server-rendered, query parameters (i.e. the default search string)
   * is only available after hydration. If the search input field is still pristine, we
   * update the input value.
   */
  useEffect(() => {
    if (searchTerm.length === 0 && defaultSearchTerm !== undefined) {
      setSearchTerm(defaultSearchTerm)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSearchTerm])

  const debouncedSearchTerm = useDebouncedState(searchTerm, 150).trim()
  const items = useAutocompleteItems(
    { q: debouncedSearchTerm },
    {
      /** Backend requires non-empty search phrase. */
      enabled: debouncedSearchTerm.length > 0,
      keepPreviousData: true,
    },
  )
  const suggestions =
    items.data?.suggestions?.map((suggestion) => ({ suggestion })) ?? []

  function onSelectionChange(key: Key | null) {
    if (
      props.shouldSubmitOnSelect === true &&
      key != null &&
      String(key).length > 0
    ) {
      router.push({ pathname: '/search', query: { q: key } })
    }
  }

  return (
    <ComboBox
      name="q"
      aria-label="Search term"
      allowsCustomValue
      items={suggestions}
      isLoading={items.isLoading}
      inputValue={searchTerm}
      onInputChange={setSearchTerm}
      onSelectionChange={onSelectionChange}
      variant="search"
      type="search"
      allowsEmptyCollection
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
