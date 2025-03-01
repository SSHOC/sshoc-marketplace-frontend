import { useButton } from '@react-aria/button'
import { useId } from '@react-aria/utils'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import type { FormEvent, ReactNode } from 'react'
import { Fragment, useRef } from 'react'

import { getTopFacetValues } from '@/components/common/getTopFacetValues'
import { ItemCategoryIcon } from '@/components/common/ItemCategoryIcon'
import { ItemSearchDialog } from '@/components/common/ItemSearchDialog'
import { Link } from '@/components/common/Link'
import { SearchFacetsOverlay } from '@/components/common/SearchFacetsOverlay'
import { useSearchItems } from '@/components/common/useSearchItems'
import { ModalDialog } from '@/components/search/ModalDialog'
import css from '@/components/search/SearchFilters.module.css'
import type { SearchFilters as ItemSearchFilters } from '@/components/search/useSearchFilters'
import { useSearchFilters } from '@/components/search/useSearchFilters'
import { useSearchResults } from '@/components/search/useSearchResults'
import type { ItemCategory } from '@/data/sshoc/api/item'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Button } from '@/lib/core/ui/Button/Button'
import { ButtonLink } from '@/lib/core/ui/Button/ButtonLink'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { CheckBoxGroup } from '@/lib/core/ui/CheckBoxGroup/CheckBoxGroup'
import { CloseButton } from '@/lib/core/ui/CloseButton/CloseButton'
import { Facet, Item as FacetValue } from '@/lib/core/ui/Facet/Facet'
import { useDisclosure } from '@/lib/core/ui/hooks/useDisclosure'
import { useDisclosureState } from '@/lib/core/ui/hooks/useDisclosureState'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import CrossIcon from '@/lib/core/ui/icons/cross.svg?symbol-icon'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'
import { useModalDialogTriggerState } from '@/lib/core/ui/ModalDialog/useModalDialogState'
import { useModalDialogTrigger } from '@/lib/core/ui/ModalDialog/useModalDialogTrigger'
import { entries, length } from '@/lib/utils'

export function SearchFilters(): JSX.Element {
  const { t } = useI18n<'common'>()

  return (
    <aside className={css['container']} aria-label={t(['common', 'search', 'search-filters'])}>
      <header className={css['section-header']}>
        <h2 className={css['section-title']}>{t(['common', 'search', 'refine-search'])}</h2>
        <div className={css['clear-link']}>
          <Link href="/search">{t(['common', 'search', 'clear-filters'])}</Link>
        </div>
      </header>
      <div className={css['facets-form-container']}>
        {/* <Suspense
          fallback={
            <Centered>
              <LoadingIndicator />
            </Centered>
          }
        > */}
        <SearchFacetsForm />
        {/* </Suspense> */}
      </div>
      <div className={css['facets-dialog-container']}>
        <ItemSearchDialog />
        <SearchFacetsDialog />
      </div>
    </aside>
  )
}

function SearchFacetsDialog(): JSX.Element {
  const { t } = useI18n<'common'>()
  const state = useModalDialogTriggerState({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { triggerProps, overlayProps } = useModalDialogTrigger(
    { type: 'dialog' },
    state,
    triggerRef,
  )
  const titleId = useId()

  return (
    <Fragment>
      <Button
        ref={triggerRef}
        {...triggerProps}
        color="gradient"
        data-dialog="facets"
        onPress={state.toggle}
      >
        {t(['common', 'search', 'refine-search'])}
      </Button>
      <ActiveSearchFacets />
      {state.isOpen ? (
        <ModalDialog
          {...(overlayProps as any)}
          aria-labelledby={titleId}
          isDismissable
          isOpen={state.isOpen}
          onClose={state.close}
        >
          <header className={css['overlay-header']}>
            <h2 className={css['overlay-title']} id={titleId}>
              {t(['common', 'search', 'refine-search'])}
            </h2>
            <CloseButton autoFocus onPress={state.close} size="lg" />
          </header>
          {/* <Suspense
            fallback={
              <Centered>
                <LoadingIndicator />
              </Centered>
            }
          > */}
          <SearchFacetsForm />
          {/* </Suspense> */}
        </ModalDialog>
      ) : null}
    </Fragment>
  )
}

function ActiveSearchFacets(): JSX.Element {
  const searchFilters = useSearchFilters()

  const activeFilters = [
    searchFilters['categories'],
    searchFilters['f.activity'],
    searchFilters['f.keyword'],
    searchFilters['f.language'],
    searchFilters['f.source'],
  ]

  if (
    activeFilters.every((facet) => {
      return facet.length === 0
    })
  ) {
    return <Fragment />
  }

  return (
    <section className={css['active-facets']}>
      <ActiveItemCategoryFacets />
      <ActiveActivityFacets />
      <ActiveKeywordFacets />
      <ActiveSourceFacets />
      <ActiveLanguageFacets />
    </section>
  )
}

interface RemoveFacetValueButtonProps {
  name: Exclude<keyof ItemSearchFilters, 'order' | 'page' | 'perpage' | 'q'>
  value: string
  label: ReactNode
}

function RemoveFacetValueButton(props: RemoveFacetValueButtonProps): JSX.Element {
  const { name, value, label } = props

  const searchFilters = useSearchFilters()
  const { searchItems } = useSearchItems()
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(
    {
      onPress() {
        searchItems({
          ...searchFilters,
          [name]: searchFilters[name].filter((v) => {
            return v !== value
          }),
        })
      },
    },
    ref,
  )

  return (
    <button {...buttonProps} ref={ref} className={css['remove-facet-value-button']}>
      <VisuallyHidden>{label}</VisuallyHidden>
      <Icon icon={CrossIcon} />
    </button>
  )
}

function ActiveItemCategoryFacets() {
  const facet = 'item-category'
  const name = 'categories'

  const { t } = useI18n<'common'>()
  const searchFilters = useSearchFilters()

  const values = searchFilters[name]

  if (values.length === 0) {
    return <Fragment />
  }

  return (
    <div className={css['active-facet']}>
      <h3 className={css['active-facet-title']}>{t(['common', 'facets', facet, 'other'])}</h3>
      <ul role="list" className={css['active-facet-values']}>
        {values.map((value) => {
          return (
            <li key={value} className={css['active-facet-value']}>
              {t(['common', 'item-categories', value, 'other'])}
              <RemoveFacetValueButton
                name={name}
                value={value}
                label={t(['common', 'search', 'remove-filter-value'], {
                  values: {
                    facet: t(['common', 'facets', facet, 'other']),
                    value: t(['common', 'item-categories', value, 'other']),
                  },
                })}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ActiveActivityFacets() {
  const facet = 'activity'
  const name = 'f.activity'

  const { t } = useI18n<'common'>()
  const searchFilters = useSearchFilters()

  const values = searchFilters[name]

  if (values.length === 0) {
    return <Fragment />
  }

  return (
    <div className={css['active-facet']}>
      <h3 className={css['active-facet-title']}>{t(['common', 'facets', facet, 'other'])}</h3>
      <ul role="list" className={css['active-facet-values']}>
        {values.map((value) => {
          return (
            <li key={value} className={css['active-facet-value']}>
              {value}
              <RemoveFacetValueButton
                name={name}
                value={value}
                label={t(['common', 'search', 'remove-filter-value'], {
                  values: { facet: t(['common', 'facets', facet, 'other']), value },
                })}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ActiveKeywordFacets() {
  const facet = 'keyword'
  const name = 'f.keyword'

  const { t } = useI18n<'common'>()
  const searchFilters = useSearchFilters()

  const values = searchFilters[name]

  if (values.length === 0) {
    return <Fragment />
  }

  return (
    <div className={css['active-facet']}>
      <h3 className={css['active-facet-title']}>{t(['common', 'facets', facet, 'other'])}</h3>
      <ul role="list" className={css['active-facet-values']}>
        {values.map((value) => {
          return (
            <li key={value} className={css['active-facet-value']}>
              {value}
              <RemoveFacetValueButton
                name={name}
                value={value}
                label={t(['common', 'search', 'remove-filter-value'], {
                  values: { facet: t(['common', 'facets', facet, 'other']), value },
                })}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ActiveLanguageFacets() {
  const facet = 'language'
  const name = 'f.language'

  const { t } = useI18n<'common'>()
  const searchFilters = useSearchFilters()

  const values = searchFilters[name]

  if (values.length === 0) {
    return <Fragment />
  }

  return (
    <div className={css['active-facet']}>
      <h3 className={css['active-facet-title']}>{t(['common', 'facets', facet, 'other'])}</h3>
      <ul role="list" className={css['active-facet-values']}>
        {values.map((value) => {
          return (
            <li key={value} className={css['active-facet-value']}>
              {value}
              <RemoveFacetValueButton
                name={name}
                value={value}
                label={t(['common', 'search', 'remove-filter-value'], {
                  values: { facet: t(['common', 'facets', facet, 'other']), value },
                })}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ActiveSourceFacets() {
  const facet = 'source'
  const name = 'f.source'

  const { t } = useI18n<'common'>()
  const searchFilters = useSearchFilters()

  const values = searchFilters[name]

  if (values.length === 0) {
    return <Fragment />
  }

  return (
    <div className={css['active-facet']}>
      <h3 className={css['active-facet-title']}>{t(['common', 'facets', facet, 'other'])}</h3>
      <ul role="list" className={css['active-facet-values']}>
        {values.map((value) => {
          return (
            <li key={value} className={css['active-facet-value']}>
              {value}
              <RemoveFacetValueButton
                name={name}
                value={value}
                label={t(['common', 'search', 'remove-filter-value'], {
                  values: { facet: t(['common', 'facets', facet, 'other']), value },
                })}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function SearchFacetsForm(): JSX.Element {
  const searchFilters = useSearchFilters()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form onSubmit={onSubmit} method="get" action="/search" className={css['facets']}>
      <input type="hidden" name="q" value={searchFilters.q} />
      <input type="hidden" name="order" value={searchFilters.order} />
      <input type="hidden" name="page" value={searchFilters.page} />
      <ItemCategoryFacets />
      <ActivityFacets />
      <KeywordFacets />
      <SourceFacets />
      <LanguageFacets />
    </form>
  )
}

function ItemCategoryFacets(): JSX.Element {
  const facet = 'item-category'
  const name = 'categories'

  const { t } = useI18n<'common'>()
  const searchFilters = useSearchFilters()
  const selectedKeys = searchFilters[name]
  const searchResults = useSearchResults()
  const { searchItems } = useSearchItems()

  if (searchResults.data == null) {
    return (
      <Centered>
        <LoadingIndicator />
      </Centered>
    )
  }

  const values = searchResults.data[name]

  if (length(values) === 0) {
    return <Fragment />
  }

  const items = entries(values).filter(([category, { count }]) => {
    if (category === 'step') return false
    if (count === 0) return false
    return true
  })

  if (items.length === 0) {
    return <Fragment />
  }

  function onChange(keys: Array<string>) {
    const searchParams = {
      ...searchFilters,
      page: 1,
      [name]: keys as Array<ItemCategory>,
    }

    searchItems(searchParams)
  }

  return (
    <div>
      <Facet
        defaultOpen
        label={t(['common', 'facets', facet, 'other'])}
        name={name}
        value={selectedKeys}
        onChange={onChange}
      >
        {items.map(([value, { count }]) => {
          return (
            <FacetValue key={value} value={value}>
              <span
                style={{
                  display: 'grid',
                  gap: '6px',
                  gridTemplateColumns: '20px 1fr',
                  alignItems: 'center',
                }}
              >
                <span aria-hidden style={{ aspectRatio: '1' }}>
                  <ItemCategoryIcon category={value} />
                </span>
                {t(['common', 'item-categories', value, 'other'])}
              </span>
              <span className={css['secondary']}>{count}</span>
            </FacetValue>
          )
        })}
      </Facet>
    </div>
  )
}

function ActivityFacets(): JSX.Element {
  const facet = 'activity'
  const name = 'f.activity'

  const { t } = useI18n<'common'>()
  const searchFilters = useSearchFilters()
  const selectedKeys = searchFilters[name]
  const searchResults = useSearchResults()
  const { searchItems } = useSearchItems()

  const overlay = useDisclosureState({})
  const { contentProps, triggerProps } = useDisclosure(overlay)

  if (searchResults.data == null) {
    return <Fragment />
  }

  const values = searchResults.data.facets[facet]

  if (length(values) === 0) {
    return <Fragment />
  }

  const { items, hasMoreItems, all } = getTopFacetValues(values, selectedKeys)

  function onChange(keys: Array<string>) {
    const searchParams = {
      ...searchFilters,
      page: 1,
      [name]: keys,
    }

    searchItems(searchParams)
  }

  if (overlay.isOpen) {
    const items = all

    return (
      <div>
        <SearchFacetsOverlay
          title={t(['common', 'facets', facet, 'other'])}
          onClose={overlay.close}
          triggerProps={triggerProps}
        >
          <CheckBoxGroup
            {...(contentProps as any)}
            aria-label={t(['common', 'facets', facet, 'other'])}
            name={name}
            value={selectedKeys}
            onChange={onChange}
            variant="facet"
          >
            {items.map(([value, { count }]) => {
              return (
                <FacetValue key={value} value={value}>
                  {value}
                  <span className={css['secondary']}>{count}</span>
                </FacetValue>
              )
            })}
          </CheckBoxGroup>
        </SearchFacetsOverlay>
      </div>
    )
  }

  const controls = (
    <ButtonLink {...(triggerProps as any)} onPress={overlay.toggle}>
      {t(['common', 'search', 'show-more'])}
    </ButtonLink>
  )

  return (
    <div>
      <Facet
        defaultOpen
        label={t(['common', 'facets', facet, 'other'])}
        name={name}
        value={selectedKeys}
        onChange={onChange}
        controls={hasMoreItems ? controls : undefined}
      >
        {items.map(([value, { count }]) => {
          return (
            <FacetValue key={value} value={value}>
              {value}
              <span className={css['secondary']}>{count}</span>
            </FacetValue>
          )
        })}
      </Facet>
    </div>
  )
}

function KeywordFacets(): JSX.Element {
  const facet = 'keyword'
  const name = 'f.keyword'

  const { t } = useI18n<'common'>()
  const searchFilters = useSearchFilters()
  const selectedKeys = searchFilters[name]
  const searchResults = useSearchResults()
  const { searchItems } = useSearchItems()

  const overlay = useDisclosureState({})
  const { contentProps, triggerProps } = useDisclosure(overlay)

  if (searchResults.data == null) {
    return <Fragment />
  }

  const values = searchResults.data.facets[facet]

  if (length(values) === 0) {
    return <Fragment />
  }

  const { items, hasMoreItems, all } = getTopFacetValues(values, selectedKeys)

  function onChange(keys: Array<string>) {
    const searchParams = {
      ...searchFilters,
      page: 1,
      [name]: keys as Array<ItemCategory>,
    }

    searchItems(searchParams)
  }

  if (overlay.isOpen) {
    const items = all

    return (
      <div>
        <SearchFacetsOverlay
          title={t(['common', 'facets', facet, 'other'])}
          onClose={overlay.close}
          triggerProps={triggerProps}
        >
          <CheckBoxGroup
            {...contentProps}
            aria-label={t(['common', 'facets', facet, 'other'])}
            name={name}
            onChange={onChange}
            value={selectedKeys}
            variant="facet"
          >
            {items.map(([value, { count }]) => {
              return (
                <FacetValue key={value} value={value}>
                  {value}
                  <span className={css['secondary']}>{count}</span>
                </FacetValue>
              )
            })}
          </CheckBoxGroup>
        </SearchFacetsOverlay>
      </div>
    )
  }

  const controls = (
    <ButtonLink {...(triggerProps as any)} onPress={overlay.toggle}>
      {t(['common', 'search', 'show-more'])}
    </ButtonLink>
  )

  return (
    <div>
      <Facet
        defaultOpen
        label={t(['common', 'facets', facet, 'other'])}
        name={name}
        value={selectedKeys}
        onChange={onChange}
        controls={hasMoreItems ? controls : undefined}
      >
        {items.map(([value, { count }]) => {
          return (
            <FacetValue key={value} value={value}>
              {value}
              <span className={css['secondary']}>{count}</span>
            </FacetValue>
          )
        })}
      </Facet>
    </div>
  )
}

function LanguageFacets(): JSX.Element {
  const facet = 'language'
  const name = 'f.language'

  const { t } = useI18n<'common'>()
  const searchFilters = useSearchFilters()
  const selectedKeys = searchFilters[name]
  const searchResults = useSearchResults()
  const { searchItems } = useSearchItems()

  const overlay = useDisclosureState({})
  const { contentProps, triggerProps } = useDisclosure(overlay)

  if (searchResults.data == null) {
    return <Fragment />
  }

  const values = searchResults.data.facets[facet]

  if (length(values) === 0) {
    return <Fragment />
  }

  const { items, hasMoreItems, all } = getTopFacetValues(values, selectedKeys)

  function onChange(keys: Array<string>) {
    const searchParams = {
      ...searchFilters,
      page: 1,
      [name]: keys as Array<ItemCategory>,
    }

    searchItems(searchParams)
  }

  if (overlay.isOpen) {
    const items = all

    return (
      <div>
        <SearchFacetsOverlay
          title={t(['common', 'facets', facet, 'other'])}
          onClose={overlay.close}
          triggerProps={triggerProps}
        >
          <CheckBoxGroup
            {...(contentProps as any)}
            aria-label={t(['common', 'facets', facet, 'other'])}
            name={name}
            value={selectedKeys}
            onChange={onChange}
            variant="facet"
          >
            {items.map(([value, { count }]) => {
              return (
                <FacetValue key={value} value={value}>
                  {value}
                  <span className={css['secondary']}>{count}</span>
                </FacetValue>
              )
            })}
          </CheckBoxGroup>
        </SearchFacetsOverlay>
      </div>
    )
  }

  const controls = (
    <ButtonLink {...(triggerProps as any)} onPress={overlay.toggle}>
      {t(['common', 'search', 'show-more'])}
    </ButtonLink>
  )

  return (
    <div>
      <Facet
        defaultOpen
        label={t(['common', 'facets', facet, 'other'])}
        name={name}
        value={selectedKeys}
        onChange={onChange}
        controls={hasMoreItems ? controls : undefined}
      >
        {items.map(([value, { count }]) => {
          return (
            <FacetValue key={value} value={value}>
              {value}
              <span className={css['secondary']}>{count}</span>
            </FacetValue>
          )
        })}
      </Facet>
    </div>
  )
}

function SourceFacets(): JSX.Element {
  const facet = 'source'
  const name = 'f.source'

  const { t } = useI18n<'common'>()
  const searchFilters = useSearchFilters()
  const selectedKeys = searchFilters[name]
  const searchResults = useSearchResults()
  const { searchItems } = useSearchItems()

  const overlay = useDisclosureState({})
  const { contentProps, triggerProps } = useDisclosure(overlay)

  if (searchResults.data == null) {
    return <Fragment />
  }

  const values = searchResults.data.facets[facet]

  if (length(values) === 0) {
    return <Fragment />
  }

  const { items, hasMoreItems, all } = getTopFacetValues(values, selectedKeys)

  function onChange(keys: Array<string>) {
    const searchParams = {
      ...searchFilters,
      page: 1,
      [name]: keys as Array<ItemCategory>,
    }

    searchItems(searchParams)
  }

  if (overlay.isOpen) {
    const items = all

    return (
      <div>
        <SearchFacetsOverlay
          title={t(['common', 'facets', facet, 'other'])}
          onClose={overlay.close}
          triggerProps={triggerProps}
        >
          <CheckBoxGroup
            {...(contentProps as any)}
            aria-label={t(['common', 'facets', facet, 'other'])}
            name={name}
            value={selectedKeys}
            onChange={onChange}
            variant="facet"
          >
            {items.map(([value, { count }]) => {
              return (
                <FacetValue key={value} value={value}>
                  {value}
                  <span className={css['secondary']}>{count}</span>
                </FacetValue>
              )
            })}
          </CheckBoxGroup>
        </SearchFacetsOverlay>
      </div>
    )
  }

  const controls = (
    <ButtonLink {...(triggerProps as any)} onPress={overlay.toggle}>
      {t(['common', 'search', 'show-more'])}
    </ButtonLink>
  )

  return (
    <div>
      <Facet
        defaultOpen
        label={t(['common', 'facets', facet, 'other'])}
        name={name}
        value={selectedKeys}
        onChange={onChange}
        controls={hasMoreItems ? controls : undefined}
      >
        {items.map(([value, { count }]) => {
          return (
            <FacetValue key={value} value={value}>
              {value}
              <span className={css['secondary']}>{count}</span>
            </FacetValue>
          )
        })}
      </Facet>
    </div>
  )
}
