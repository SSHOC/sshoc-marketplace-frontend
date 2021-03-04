import { useRouter } from 'next/router'
import { ReactNode, useMemo, useState } from 'react'
import { useAutocompleteItems, useGetItemCategories } from '@/api/sshoc'
import { ItemCategory } from '@/api/sshoc/types'
import { Button } from '@/elements/Button/Button'
import { HighlightedText } from '@/elements/HighlightedText/HighlightedText'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { FormComboBox } from '@/modules/form/components/FormComboBox/FormComboBox'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { Form } from '@/modules/form/Form'

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

  function onSubmit(values: SearchFormValues) {
    router.push({
      pathname: '/search',
      query: {
        q: values.q !== undefined && values.q.length > 0 ? values.q : undefined,
        categories:
          values.category !== undefined && values.category.length > 0
            ? [values.category]
            : undefined,
      },
    })
  }

  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit }) => {
        return (
          <form
            onSubmit={handleSubmit}
            role="search"
            className={props.className}
          >
            {props.children}
          </form>
        )
      }}
    </Form>
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
    <FormSelect
      name="category"
      aria-label="Category"
      isLoading={categories.isLoading}
      items={itemCategories}
      /** Use explicit "All categories" option, not placeholder text as initial value. */
      defaultSelectedKey=""
      variant="search"
    >
      {(item) => <FormSelect.Item key={item.id}>{item.label}</FormSelect.Item>}
    </FormSelect>
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
    <FormComboBox
      name="q"
      aria-label="Search term"
      allowsCustomValue
      items={suggestions}
      // isLoading={items.isLoading}
      defaultInputValue={defaultSearchTerm}
      onInputChange={setSearchTerm}
      variant="search"
      hideSelectionIcon
      hideButton
      style={
        props.variant === 'invisible'
          ? { borderWidth: 0, flex: 1 }
          : { flex: 1 }
      }
    >
      {(item) => (
        <FormComboBox.Item key={item.suggestion} textValue={item.suggestion}>
          <HighlightedText
            text={item.suggestion}
            searchPhrase={debouncedSearchTerm}
          />
        </FormComboBox.Item>
      )}
    </FormComboBox>
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
