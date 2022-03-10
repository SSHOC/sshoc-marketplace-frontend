import type { Key } from 'react'
import { useMemo } from 'react'

import { useSearchItems } from '@/components/common/useSearchItems'
import type { ItemCategory, ItemSearchSuggestion } from '@/data/sshoc/api/item'
import { useItemAutocomplete } from '@/data/sshoc/hooks/item'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Item } from '@/lib/core/ui/Collection/Item'
import { HighlightedText } from '@/lib/core/ui/HighlightedText/HighlightedText'
import { SearchAutocomplete } from '@/lib/core/ui/SearchAutocomplete/SearchAutocomplete'
import { mapBy } from '@/lib/utils'
import { useDebouncedState } from '@/lib/utils/hooks'
import { debounceDelay } from '~/config/sshoc.config'

export interface ItemSearchAutocompleteProps {
  itemCategory?: ItemCategory
  itemSearchTerm: string
  onChangeItemSearchTerm: (itemSearchTerm: string) => void
  onSubmit?: () => void
  /** @default 'md' */
  size?: 'md' | 'sm'
}

export function ItemSearchTermAutocomplete(props: ItemSearchAutocompleteProps): JSX.Element {
  const { itemCategory, itemSearchTerm, onChangeItemSearchTerm, onSubmit, size } = props

  const { t } = useI18n<'common'>()
  const { searchItems } = useSearchItems()
  // TOOD: use `useDeferredValue` (React 18).
  const debouncedItemSearchTerm = useDebouncedState({
    value: itemSearchTerm,
    delay: debounceDelay,
  }).trim()
  const itemAutocompleteSuggestions = useItemAutocomplete({
    q: debouncedItemSearchTerm,
    category: itemCategory,
  })
  const itemsById = useMemo(() => {
    if (itemAutocompleteSuggestions.data?.suggestions == null) {
      return new Map<string, ItemSearchSuggestion>()
    }
    return mapBy(itemAutocompleteSuggestions.data.suggestions, 'persistentId')
  }, [itemAutocompleteSuggestions.data])
  const items = itemSearchTerm.length > 0 ? itemAutocompleteSuggestions.data?.suggestions ?? [] : []

  function onSelectSuggestion(value: string, key: Key | null) {
    const item = itemsById.get(key as string)
    const q = item?.phrase ?? value
    searchItems({ q })
    onSubmit?.()
  }

  return (
    <SearchAutocomplete
      name="q"
      aria-label={t(['common', 'home', 'search', 'item-search-term'])}
      items={items}
      loadingState={itemAutocompleteSuggestions.isLoading ? 'loading' : 'idle'}
      inputValue={itemSearchTerm}
      onInputChange={onChangeItemSearchTerm}
      onSubmit={onSelectSuggestion}
      size={size}
    >
      {(item) => {
        return (
          <Item key={item.persistentId} textValue={item.phrase}>
            <HighlightedText text={item.phrase} searchPhrase={itemSearchTerm} />
          </Item>
        )
      }}
    </SearchAutocomplete>
  )
}
