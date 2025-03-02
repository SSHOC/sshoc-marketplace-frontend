import { VisuallyHidden } from '@react-aria/visually-hidden'
import { useTranslations } from 'next-intl'
import type { FormEvent } from 'react'
import { Fragment } from 'react'
import type { UseQueryResult } from 'react-query'

import { Link } from '@/components/common/Link'
import { NavLink } from '@/components/common/NavLink'
import css from '@/components/common/Pagination.module.css'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import TriangleIcon from '@/lib/core/ui/icons/triangle.svg?symbol-icon'
import { toPositiveInteger } from '@/lib/utils'
import { usePagination } from '@/lib/utils/hooks'

export interface PaginationProps<TResults, TFilters> {
  searchResults: TResults
  searchFilters: TFilters
  searchItems: (filters: TFilters) => Promise<boolean>
  getSearchItemsLink: (filters: TFilters) => { href: string; shallow?: boolean; scroll?: boolean }
  /** @default 'primary' */
  variant?: 'input' | 'primary'
}

export function Pagination<
  TResults extends UseQueryResult<{ pages: number; page: number }>,
  TFilters extends { page: number },
>(props: PaginationProps<TResults, TFilters>): JSX.Element {
  const { searchResults, searchFilters, searchItems, getSearchItemsLink } = props

  const t = useTranslations('common')

  const variant = props.variant ?? 'primary'

  const pages = searchResults.data?.pages ?? 1
  const page = Math.min(searchFilters.page, pages)

  if (pages <= 1) {
    return <Fragment />
  }

  const hasPreviousPage = page > 1
  const hasNextPage = page < pages

  return (
    <nav aria-label={t('pagination.navigation')}>
      <ol role="list" className={css['nav-items']}>
        <li className={css['nav-item']}>
          <Link
            {...getSearchItemsLink({ ...searchFilters, page: page - 1 })}
            isDisabled={!hasPreviousPage}
            rel="prev"
            variant="pagination"
          >
            <Icon icon={TriangleIcon} />
            <span>{t('pagination.previous-page')}</span>
          </Link>
        </li>
        <li className={css['nav-item']}>
          {variant === 'input' ? (
            <PageInput
              page={page}
              pages={pages}
              searchFilters={searchFilters}
              searchItems={searchItems}
            />
          ) : (
            <PageLinks
              page={page}
              pages={pages}
              searchFilters={searchFilters}
              getSearchItemsLink={getSearchItemsLink}
            />
          )}
        </li>
        <li className={css['nav-item']}>
          <Link
            {...getSearchItemsLink({ ...searchFilters, page: page + 1 })}
            isDisabled={!hasNextPage}
            rel="next"
            variant="pagination"
          >
            <span>{t('pagination.next-page')}</span>
            <Icon icon={TriangleIcon} />
          </Link>
        </li>
      </ol>
    </nav>
  )
}

interface PageInputProps<TResults, TFilters> {
  page: number
  pages: number
  searchFilters: PaginationProps<TResults, TFilters>['searchFilters']
  searchItems: PaginationProps<TResults, TFilters>['searchItems']
}

function PageInput<TResults, TFilters extends { page: number }>(
  props: PageInputProps<TResults, TFilters>,
): JSX.Element {
  const { page, pages, searchFilters, searchItems } = props

  const t = useTranslations('common')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const newPage = Math.min(toPositiveInteger(formData.get('page')) ?? page, pages)

    searchItems({ ...searchFilters, page: newPage })

    event.preventDefault()
  }

  return (
    <form
      /** Force remount when searchparams change to reset form input value. */
      key={searchFilters.page}
      noValidate
      onSubmit={onSubmit}
      method="get"
      action="/search"
    >
      <label className={css['page-number-input']}>
        <VisuallyHidden>{t('pagination.go-to-page')}</VisuallyHidden>
        {/* TODO: @react-aria/number-field */}
        <input
          defaultValue={page}
          inputMode="numeric"
          max={pages}
          min={1}
          name="page"
          type="text"
        />
        <span aria-hidden>{t('pagination.of-pages', { pages: String(pages) })}</span>
      </label>
      {/* Add hidden fields to preserve search filters when submitting html form without javascript. */}
      {Object.entries(searchFilters).map(([key, value]) => {
        if (key === 'page') return null

        if (Array.isArray(value)) {
          return (
            <Fragment key={key}>
              {value.map((v) => {
                return <input key={[key, v].join('+')} type="hidden" value={v} name={key} />
              })}
            </Fragment>
          )
        }

        return <input key={key} type="hidden" value={value} name={key} />
      })}
    </form>
  )
}

interface PageLinksProps<TResults, TFilters> {
  page: number
  pages: number
  searchFilters: PaginationProps<TResults, TFilters>['searchFilters']
  getSearchItemsLink: PaginationProps<TResults, TFilters>['getSearchItemsLink']
}

function PageLinks<TResults, TFilters extends { page: number }>(
  props: PageLinksProps<TResults, TFilters>,
): JSX.Element {
  const { page, pages, searchFilters, getSearchItemsLink } = props

  const items = usePagination({ page, pages })

  return (
    <Fragment>
      {items.map((item, index) => {
        if (item.page === 'ellipsis') {
          return (
            <span key={[item.page, index].join('+')} className={css['nav-link-ellipsis']}>
              ...
            </span>
          )
        }

        return (
          <NavLink
            key={item.page}
            {...getSearchItemsLink({ ...searchFilters, page: item.page })}
            // isDisabled={item.isCurrent}
            isCurrent={item.isCurrent}
            variant="pagination"
          >
            {item.page}
          </NavLink>
        )
      })}
    </Fragment>
  )
}
