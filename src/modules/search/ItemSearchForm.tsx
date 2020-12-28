import { Listbox } from '@headlessui/react'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'
import cx from 'clsx'
import { useRouter } from 'next/router'
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  Dispatch,
  FormEvent,
  SetStateAction,
} from 'react'
import { createContext, Fragment, useContext, useState } from 'react'
import { useAutocompleteItems, useGetItemCategories } from '@/api/sshoc'
import type { ItemCategory, ItemSearchQuery } from '@/api/sshoc/types'
import CheckMark from '@/modules/ui/CheckMark'
import FadeIn from '@/modules/ui/FadeIn'
import Triangle from '@/modules/ui/Triangle'
import { useDebounce } from '@/utils/useDebounce'

type ItemSearchFormData = {
  categories?: Exclude<ItemCategory, 'step'> | ''
  q?: string
}

const MIN_AUTOCOMPLETE_LENGTH = 3

const ItemSearchFormContext = createContext<
  [ItemSearchFormData, Dispatch<SetStateAction<ItemSearchFormData>>] | null
>(null)

function useItemSearchFormContext() {
  const value = useContext(ItemSearchFormContext)

  if (value === null) {
    throw new Error(
      '`useItemSearchFormContext` must be nested inside a `ItemSearchFormContext.Provider`.',
    )
  }

  return value
}

export default function ItemSearchForm({
  children,
  className,
}: ComponentPropsWithoutRef<'form'>): JSX.Element {
  const router = useRouter()
  const [formData, setFormData] = useState<ItemSearchFormData>({})

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query: ItemSearchQuery = sanitizeFormData(formData)
    router.push({ pathname: '/search', query }, undefined, {
      shallow: router.pathname === '/search',
    })
  }

  return (
    <form
      className={cx('flex bg-white', className)}
      role="search"
      autoComplete="off"
      onSubmit={onSubmit}
    >
      <ItemSearchFormContext.Provider value={[formData, setFormData]}>
        {children}
      </ItemSearchFormContext.Provider>
    </form>
  )
}

/** avoid empty queries like `?q=&categories=` */
function sanitizeFormData(query: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(query).filter(([key, value]) => {
      return value !== ''
    }),
  )
}

export function ItemAutoCompleteInput({
  initialValue = '',
  className,
}: {
  initialValue?: string
  className?: string
}): JSX.Element {
  const [formData, setFormData] = useItemSearchFormContext()

  const searchTerm = formData.q ?? initialValue
  function setSearchTerm(searchTerm: string) {
    setFormData((prev) => ({ ...prev, q: searchTerm }))
  }

  /** debounce autocomplete requests */
  const autocompleteTerm = useDebounce(searchTerm.trim(), 150)
  const { data: suggestions } = useAutocompleteItems(
    { q: autocompleteTerm },
    {
      enabled: autocompleteTerm.length >= MIN_AUTOCOMPLETE_LENGTH,
      keepPreviousData: true,
    },
  )

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value)
  }

  /** in case the backend does not limit suggestions */
  const MAX_SUGGESTIONS = 10

  return (
    <Combobox
      aria-label="Search term"
      openOnFocus
      className="relative flex-1"
      /**
       * we need to wrap the selected autosuggest value in quotes.
       * otherwise, solr will interpret special characters like a minus ("-")
       * as query language, if the autosuggested term includes such a character.
       * */
      onSelect={(value) => setSearchTerm(`"${value}"`)}
    >
      <ComboboxInput
        name="q"
        type="search"
        onChange={onChange}
        /** value is managed by `@reach/combobox` internally, i.e. when selecting a `ComboboxOption` */
        value={searchTerm}
        placeholder="Search"
        className={cx(
          'w-full h-full px-4 py-2 border border-gray-200 rounded placeholder-gray-350 hover:bg-gray-50 focus:border-primary-750 transition-colors duration-150',
          className,
        )}
      />
      {autocompleteTerm.length >= MIN_AUTOCOMPLETE_LENGTH &&
      suggestions?.suggestions !== undefined &&
      suggestions.suggestions.length > 0 ? (
        <ComboboxPopover
          portal={false}
          className="absolute z-10 w-full py-2 mt-1 bg-white border border-gray-200 rounded shadow-md"
        >
          <ComboboxList className="select-none">
            {suggestions.suggestions
              .slice(0, MAX_SUGGESTIONS)
              .map((suggestion) => (
                <ComboboxOption
                  key={suggestion}
                  value={suggestion}
                  className="px-4 py-2 truncate hover:bg-gray-50"
                />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      ) : null}
    </Combobox>
  )
}

export function ItemCategoriesSelect(): JSX.Element {
  const { data: itemCategories = {} } = useGetItemCategories({})
  const [formData, setFormData] = useItemSearchFormContext()

  const selectedCategory = formData.categories ?? ''
  function setSelectedCategory(category: Exclude<ItemCategory, 'step'> | '') {
    setFormData((prev) => ({ ...prev, categories: category }))
  }

  return (
    <Listbox value={selectedCategory} onChange={setSelectedCategory}>
      {({ open }) => (
        <div className="relative w-64">
          <Listbox.Button className="inline-flex items-center justify-between w-full h-full p-2 border border-gray-200 divide-x divide-gray-200 rounded hover:text-primary-750 hover:bg-gray-50 focus:bg-gray-50">
            <span className="px-2">
              {itemCategories[selectedCategory] ?? 'All categories'}
            </span>
            <span className="inline-flex items-center h-full pl-2 justify-content text-secondary-600">
              <Triangle />
            </span>
          </Listbox.Button>
          <FadeIn show={open}>
            <Listbox.Options
              static
              className="absolute min-w-full py-2 mt-1 overflow-hidden whitespace-no-wrap bg-white border border-gray-200 rounded shadow-md select-none"
            >
              {[['', 'All categories']]
                .concat(Object.entries(itemCategories))
                .map(([category, label]) => {
                  return (
                    <Listbox.Option
                      key={category}
                      value={category}
                      as={Fragment}
                    >
                      {({ active, selected }) => (
                        <li
                          className={cx(
                            'px-4 py-3 flex space-x-2 items-center',
                            active === true && 'bg-gray-50',
                            selected === true && 'text-primary-750',
                          )}
                        >
                          <span className="w-6">
                            {selected === true ? <CheckMark /> : null}
                          </span>
                          <span>{label}</span>
                        </li>
                      )}
                    </Listbox.Option>
                  )
                })}
            </Listbox.Options>
          </FadeIn>
        </div>
      )}
    </Listbox>
  )
}

export function SubmitButton({
  className,
}: ComponentPropsWithoutRef<'button'>): JSX.Element {
  return (
    <button
      type="submit"
      className={cx(
        'text-lg text-white rounded w-36 bg-gradient-to-r from-secondary-500 to-primary-800 hover:from-secondary-600 hover:to-secondary-600 focus:from-primary-750 focus:to-primary-750 transition-colors duration-150',
        className,
      )}
    >
      Search
    </button>
  )
}
