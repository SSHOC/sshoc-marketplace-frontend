import type { Key } from 'react'
import { Fragment, useMemo } from 'react'
import { useForm } from 'react-final-form'

import { ItemInfo } from '@/components/common/ItemInfo'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import type { PropertyType } from '@/data/sshoc/api/property'
import { useConceptSearchInfinite } from '@/data/sshoc/hooks/vocabulary'
import { FormComboBox } from '@/lib/core/form/FormComboBox'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Item } from '@/lib/core/ui/Collection/Item'
import { mapBy } from '@/lib/utils'
import { useDebouncedState } from '@/lib/utils/hooks/useDebouncedState'
import { debounceDelay } from '~/config/sshoc.config'

import { Link } from '../common/Link'

export interface ConceptComboBoxProps {
  conceptSearchTerm: string
  setConceptSearchTerm: (searchTerm: string) => void
  field: ItemFormFields['fields']['properties']['fields']['concept']
  propertyTypeId: PropertyType['code']
  allowedVocabularies: PropertyType['allowedVocabularies']
}

export function ConceptComboBox(props: ConceptComboBoxProps): JSX.Element {
  const { conceptSearchTerm, field, propertyTypeId, allowedVocabularies, setConceptSearchTerm } =
    props

  const { t } = useI18n<'authenticated' | 'common'>()
  const form = useForm()

  const idField = 'uri'
  const labelField = 'label'
  const labelFieldName = [field._root, labelField].join('.')

  const debouncedConceptSearchTerm = useDebouncedState({
    value: conceptSearchTerm,
    delay: debounceDelay,
  })
  // TODO: `placeholderData`
  const conceptSearchResults = useConceptSearchInfinite({
    q: debouncedConceptSearchTerm.length > 0 ? debouncedConceptSearchTerm : undefined,
    types: [propertyTypeId],
  })
  const items = useMemo(() => {
    if (conceptSearchResults.data?.pages == null) return []
    return conceptSearchResults.data.pages.flatMap((page) => {
      return page.concepts
    })
  }, [conceptSearchResults.data?.pages])
  const itemsById = useMemo(() => {
    return mapBy(items, idField)
  }, [items])

  function onSelectionChange(id: Key | null) {
    if (id == null) {
      form.change(labelFieldName, undefined)
      setConceptSearchTerm('')
    } else {
      const item = itemsById.get(id as string)
      const label = item?.[labelField]
      form.change(labelFieldName, label)
      setConceptSearchTerm(label ?? '')
    }
  }

  const loadingState = conceptSearchResults.isLoading
    ? 'loading'
    : conceptSearchResults.isFetchingNextPage
    ? 'loadingMore'
    : 'idle'

  const description = (
    <Fragment>
      <span>{field.description} </span>
      {/* @ts-expect-error Assume all possible property types have translation. */}
      <span>{t(['authenticated', 'properties', propertyTypeId, 'description'])} </span>
      <small>
        See{' '}
        {allowedVocabularies.map((vocabulary, index) => {
          const href = vocabulary.accessibleAt ?? vocabulary.namespace

          if (href == null) return null

          return (
            <Fragment key={vocabulary.code}>
              {index !== 0 ? ', ' : null}
              <Link href={{ pathname: href }} target="_blank" rel="noreferrer">
                {vocabulary.label}
              </Link>
            </Fragment>
          )
        })}
        .
      </small>
    </Fragment>
  )

  return (
    <FormComboBox
      {...field}
      description={description}
      inputValue={conceptSearchTerm}
      items={items}
      layout={layout}
      loadingState={loadingState}
      onInputChange={setConceptSearchTerm}
      onLoadMore={
        conceptSearchResults.hasNextPage === true && conceptSearchResults.isSuccess
          ? conceptSearchResults.fetchNextPage
          : undefined
      }
      onSelectionChange={onSelectionChange}
    >
      {(item) => {
        return (
          <Item key={item[idField]} textValue={item[labelField]}>
            {item[labelField]}
            <ItemInfo>{item.uri}</ItemInfo>
          </Item>
        )
      }}
    </FormComboBox>
  )
}

const layout = {
  estimatedRowHeight: 60,
}
