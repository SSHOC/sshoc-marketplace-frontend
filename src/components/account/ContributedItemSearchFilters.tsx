import { useButton } from '@react-aria/button'
import { useId } from '@react-aria/utils'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import type { FormEvent, ReactNode } from 'react'
import { Fragment, useRef } from 'react'

import css from '@/components/account/ContributedItemSearchFilters.module.css'
import { useContributedItemsSearch } from '@/components/account/useContributedItemsSearch'
import type { SearchFilters } from '@/components/account/useContributedItemsSearchFilters'
import { useContributedItemsSearchFilters } from '@/components/account/useContributedItemsSearchFilters'
import { Link } from '@/components/common/Link'
import { ModalDialog } from '@/components/search/ModalDialog'
import type { ItemStatus } from '@/data/sshoc/api/item'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { routes } from '@/lib/core/navigation/routes'
import { Button } from '@/lib/core/ui/Button/Button'
import { CloseButton } from '@/lib/core/ui/CloseButton/CloseButton'
import { Facet, Item as FacetValue } from '@/lib/core/ui/Facet/Facet'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import CrossIcon from '@/lib/core/ui/icons/cross.svg?symbol-icon'
import { useModalDialogTriggerState } from '@/lib/core/ui/ModalDialog/useModalDialogState'
import { useModalDialogTrigger } from '@/lib/core/ui/ModalDialog/useModalDialogTrigger'
import { queryableItemStatus } from '~/config/sshoc.config'

export function ContributedItemSearchFilters(): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()

  return (
    <aside className={css['container']}>
      <header className={css['section-header']}>
        <h2 className={css['section-title']}>{t(['common', 'search', 'refine-search'])}</h2>
        <div className={css['clear-link']}>
          <Link href={routes.ContributedItemsPage()}>
            {t(['common', 'search', 'clear-filters'])}
          </Link>
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
  const searchFilters = useContributedItemsSearchFilters()

  const activeFilters = [searchFilters['d.status']]

  if (
    activeFilters.every((facet) => {
      return facet.length === 0
    })
  ) {
    return <Fragment />
  }

  return (
    <section className={css['active-facets']}>
      <ActiveItemStatusFacets />
    </section>
  )
}

interface RemoveFacetValueButtonProps {
  name: Exclude<keyof SearchFilters, 'order' | 'page' | 'perpage' | 'q'>
  value: string
  label: ReactNode
}

function RemoveFacetValueButton(props: RemoveFacetValueButtonProps): JSX.Element {
  const { name, value, label } = props

  const searchFilters = useContributedItemsSearchFilters()
  const { searchContributedItems } = useContributedItemsSearch()
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(
    {
      onPress() {
        searchContributedItems({
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

function ActiveItemStatusFacets() {
  const name = 'd.status'

  const { t } = useI18n<'common'>()
  const searchFilters = useContributedItemsSearchFilters()

  const values = searchFilters[name]

  if (values.length === 0) {
    return <Fragment />
  }

  return (
    <div className={css['active-facet']}>
      <h3 className={css['active-facet-title']}>{t(['common', 'item', 'status'])}</h3>
      <ul role="list" className={css['active-facet-values']}>
        {values.map((value) => {
          return (
            <li key={value} className={css['active-facet-value']}>
              {t(['common', 'item-status', value])}
              <RemoveFacetValueButton
                name={name}
                value={value}
                label={t(['common', 'search', 'remove-filter-value'], {
                  values: {
                    facet: t(['common', 'item', 'status']),
                    value: t(['common', 'item-status', value]),
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

function SearchFacetsForm(): JSX.Element {
  const searchFilters = useContributedItemsSearchFilters()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form
      onSubmit={onSubmit}
      method="get"
      action={routes.ContributedItemsPage().pathname}
      className={css['facets']}
    >
      <input type="hidden" name="q" value={searchFilters.q} />
      <input type="hidden" name="order" value={searchFilters.order} />
      <input type="hidden" name="page" value={searchFilters.page} />
      <ItemStatusFacets />
    </form>
  )
}

function ItemStatusFacets(): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()
  const { searchContributedItems } = useContributedItemsSearch()
  const filters = useContributedItemsSearchFilters()

  const name = 'd.status'
  const label = t(['common', 'item', 'status'])
  const selectedKeys = filters[name]
  const items = queryableItemStatus.map((status) => {
    return { id: status, label: t(['common', 'item-status', status]) }
  })

  function onChange(keys: Array<string>) {
    searchContributedItems({ ...filters, page: 1, [name]: keys as Array<ItemStatus> })
  }

  return (
    <div>
      <Facet defaultOpen label={label} name={name} onChange={onChange} value={selectedKeys}>
        {items.map((item) => {
          return (
            <FacetValue key={item.id} value={item.id}>
              {item.label}
            </FacetValue>
          )
        })}
      </Facet>
    </div>
  )
}
