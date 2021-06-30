import cx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
import type { ChangeEvent, FormEvent, Key } from 'react'
import { Fragment, useEffect, useState } from 'react'

import type { SearchItem, SearchItems } from '@/api/sshoc'
import { useGetLoggedInUser, useSearchItems } from '@/api/sshoc'
import type { ItemCategory, ItemSearchQuery } from '@/api/sshoc/types'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { Select } from '@/elements/Select/Select'
import { useToast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
import ProtectedView from '@/modules/auth/ProtectedView'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import Metadata from '@/modules/metadata/Metadata'
import { Anchor } from '@/modules/ui/Anchor'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import Triangle from '@/modules/ui/Triangle'
import { Title } from '@/modules/ui/typography/Title'
import { ensureArray } from '@/utils/ensureArray'
import { ensureScalar } from '@/utils/ensureScalar'
import { getSingularItemCategoryLabel } from '@/utils/getSingularItemCategoryLabel'
import usePagination from '@/utils/usePagination'

const itemSortOrders = ['label', 'modified-on'] as const
type ItemSortOrder = typeof itemSortOrders[number]
const defaultItemSortOrder: ItemSortOrder = 'modified-on'

/**
 * Contributed items screen.
 */
export default function ContributedItemsScreen(): JSX.Element {
  const router = useRouter()
  const query = sanitizeQuery(router.query)

  const user = useGetLoggedInUser()

  const auth = useAuth()
  const handleErrors = useErrorHandlers()
  const toast = useToast()
  const items = useSearchItems(
    {
      ...query,
      'd.status': '(approved OR suggested)',
      // When a user is logged in as admin, this will not return the user's
      // items, but *all* items, so we specifically query by username, even though
      // this is not necessary for non-admin users.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      'd.owner': user.data!.username!,
    } as SearchItems.QueryParameters,
    {
      enabled: auth.session?.accessToken != null && user.data?.username != null,
      keepPreviousData: true,
      onError(error) {
        toast.error('Failed to fetch contributed items')

        if (error instanceof Error) {
          handleErrors(error)
        }
      },
    },
    { token: auth.session?.accessToken },
  )

  return (
    <Fragment>
      <Metadata noindex title="My draft items" />
      <GridLayout>
        <Header
          image={'/assets/images/search/clouds@2x.png'}
          showSearchBar={false}
        >
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              { pathname: '/account', label: 'My account' },
              {
                pathname: '/account/contributed',
                label: 'My contributed items',
              },
            ]}
          />
        </Header>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>My contributed items</Title>
          {items.data === undefined ? (
            <ProgressSpinner />
          ) : items.data.items?.length === 0 ? (
            <div>Nothing found</div>
          ) : (
            <Fragment>
              <div className="items-center justify-between">
                <ItemSortOrder filter={query} />
                <ItemPagination filter={query} results={items.data} />
              </div>
              <ul className="space-y-2.5">
                {items.data.items?.map((item) => {
                  return (
                    <li key={item.persistentId}>
                      <ContributedItem item={item} />
                    </li>
                  )
                })}
              </ul>
              <div className="flex justify-end">
                <ItemLongPagination filter={query} results={items.data} />
              </div>
            </Fragment>
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}

interface ContributedItemProps {
  item: SearchItem
}

function ContributedItem(props: ContributedItemProps) {
  const { item } = props
  const category = item.category as Exclude<ItemCategory, 'step'>

  return (
    <div className="p-4 space-y-4 text-xs border border-gray-200 rounded bg-gray-75">
      <div className="flex items-center justify-between">
        <h2>
          <Link
            href={{
              pathname: [
                '',
                category,
                item.persistentId,
                'version',
                item.id,
              ].join('/'),
            }}
          >
            <a className="text-base font-bold transition text-primary-750 hover:text-secondary-600">
              {item.label}
            </a>
          </Link>
        </h2>
        {/* FIXME: Needs https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/93 */}
        {/* {item.lastInfoUpdate != null ? (
          <div className="space-x-1.5">
            <span className="text-gray-550">Date:</span>
            <LastUpdate isoDate={item.lastInfoUpdate} />
          </div>
        ) : null} */}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="space-x-1.5">
            <span className="text-gray-550">Category:</span>
            <span>{getSingularItemCategoryLabel(category)}</span>
          </div>
          <div className="space-x-1.5">
            <span className="text-gray-550">Status:</span>
            <span>{item.status}</span>
          </div>
        </div>
        <div className="text-sm">
          <ProtectedView>
            <Link
              passHref
              href={{
                pathname: [
                  '',
                  category,
                  item.persistentId,
                  'version',
                  item.id,
                  'edit',
                ].join('/'),
              }}
            >
              <Anchor className="cursor-default text-ui-base">Edit</Anchor>
            </Link>
          </ProtectedView>
        </div>
      </div>
    </div>
  )
}

interface LastUpdateProps {
  isoDate: string | undefined
}

function LastUpdate({ isoDate }: LastUpdateProps) {
  if (isoDate == null) return null
  const date = new Date(isoDate)

  return (
    <time dateTime={isoDate}>
      {Intl.DateTimeFormat('en', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/44632
        dateStyle: 'medium',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/44632
        timeStyle: 'short',
      }).format(date)}
    </time>
  )
}

interface ItemSortOrderProps {
  filter: ItemSearchQuery
}

function ItemSortOrder(props: ItemSortOrderProps) {
  const { filter } = props

  const router = useRouter()

  const currentSortOrder =
    filter.order === undefined
      ? defaultItemSortOrder
      : (filter.order[0] as ItemSortOrder)

  function onSubmit(order: Key) {
    const query = { ...filter }
    if (order === defaultItemSortOrder) {
      delete query.order
    } else {
      query.order = [order as ItemSortOrder]
    }
    router.push({ query })
  }

  /** we don't get labels for sort order from the backend */
  const labels: Record<ItemSortOrder, string> = {
    label: 'name',
    'modified-on': 'last modification',
  }

  const items = itemSortOrders.map((id) => ({ id, label: labels[id] }))

  return (
    <Select
      aria-label="Sort order"
      items={items}
      onSelectionChange={onSubmit}
      selectedKey={currentSortOrder}
    >
      {(item) => (
        <Select.Item key={item.id} textValue={item.label}>
          Sort by {item.label}
        </Select.Item>
      )}
    </Select>
  )
}

/**
 * Top search results pagination.
 */
function ItemPagination({
  filter,
  results,
}: {
  filter: ItemSearchQuery
  results?: SearchItems.Response.Success
}) {
  const router = useRouter()
  const currentPage = filter.page ?? 1
  const pages = results?.pages ?? 1

  /**
   * input value is both controlled and uncontrolled:
   * when page in url changes the input should be updated,
   * but when user types in input, page value should only
   * be reflected in url upon submit, not immediately on change.
   */
  const [input, setInput] = useState(String(currentPage))
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value
    if (value === '') {
      setInput('')
    } else {
      const page = parseInt(value, 10)
      if (!Number.isNaN(page)) {
        setInput(String(page))
      }
    }
  }
  useEffect(() => {
    setInput(String(currentPage))
  }, [currentPage])

  function onChangePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = new FormData(event.currentTarget).get('page') as string
    const page = parseInt(input, 10)
    if (!Number.isNaN(page) && page > 0 && page <= pages) {
      router.push({ query: { ...filter, page } })
    }
  }

  if (pages <= 1) return null

  return (
    <nav aria-label="Pagination">
      <HStack as="ol" className="items-center space-x-6">
        <li className="flex items-center">
          <PreviousPageLink currentPage={currentPage} filter={filter} />
        </li>
        <li className="flex items-center">
          <HStack as="form" onSubmit={onChangePage} className="space-x-2">
            <input
              type="text"
              name="page"
              inputMode="numeric"
              value={input}
              onChange={onChange}
              aria-label="Go to page"
              className="w-8 text-right border-b border-gray-800"
            />
            <span>of {pages}</span>
          </HStack>
        </li>
        <li className="flex items-center">
          <NextPageLink
            currentPage={currentPage}
            pages={pages}
            filter={filter}
          />
        </li>
      </HStack>
    </nav>
  )
}

/**
 * Bottom search results pagination.
 */
function ItemLongPagination({
  filter,
  results,
}: {
  filter: ItemSearchQuery
  results?: SearchItems.Response.Success
}) {
  const currentPage = filter.page ?? 1
  const pages = results?.pages ?? 1

  const items = usePagination({
    page: currentPage,
    count: pages,
  })

  if (pages <= 1) return null

  return (
    <nav aria-label="Pagination">
      <HStack as="ol" className="items-center space-x-6">
        <li className="flex items-center border-b border-transparent">
          <PreviousPageLink currentPage={currentPage} filter={filter} />
        </li>
        {items.map(({ page, isCurrent }) => {
          if (page === 'ellipsis')
            return (
              <span key={page} className="select-none">
                ...
              </span>
            )

          return (
            <li key={page} className="flex items-center">
              <Link href={{ query: { ...filter, page } }} passHref>
                <Anchor
                  aria-label={`Page ${page}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cx(
                    'border-b',
                    isCurrent
                      ? ['pointer-events-none', 'border-primary-800']
                      : 'border-transparent',
                  )}
                >
                  {page}
                </Anchor>
              </Link>
            </li>
          )
        })}
        <li className="flex items-center border-b border-transparent">
          <NextPageLink
            currentPage={currentPage}
            pages={pages}
            filter={filter}
          />
        </li>
      </HStack>
    </nav>
  )
}

/**
 * Previous page.
 */
function PreviousPageLink({
  currentPage = 1,
  filter,
}: {
  currentPage?: number
  filter: ItemSearchQuery
}) {
  const isDisabled = currentPage <= 1
  const label = (
    <Fragment>
      <span className="transform rotate-90">
        <Triangle />
      </span>
      <span>Previous </span>
    </Fragment>
  )
  if (isDisabled) {
    return (
      <div className="inline-flex items-center text-gray-500 pointer-events-none">
        {label}
      </div>
    )
  }
  return (
    <Link href={{ query: { ...filter, page: currentPage - 1 } }} passHref>
      <Anchor rel="prev" className="inline-flex items-center">
        {label}
      </Anchor>
    </Link>
  )
}

/**
 * Next page.
 */
function NextPageLink({
  currentPage = 1,
  pages = 1,
  filter,
}: {
  currentPage?: number
  pages?: number
  filter: ItemSearchQuery
}) {
  const isDisabled = currentPage >= pages
  const label = (
    <Fragment>
      <span>Next </span>
      <span className="transform -rotate-90">
        <Triangle />
      </span>
    </Fragment>
  )
  if (isDisabled) {
    return (
      <div className="inline-flex items-center text-gray-500 pointer-events-none">
        {label}
      </div>
    )
  }
  return (
    <Link href={{ query: { ...filter, page: currentPage + 1 } }} passHref>
      <Anchor rel="next" className="inline-flex items-center">
        {label}
      </Anchor>
    </Link>
  )
}

function sanitizeQuery(params?: ParsedUrlQuery): ItemSearchQuery {
  if (params === undefined) return {}

  const sanitized = []

  if (params.order !== undefined) {
    const order = ensureArray(
      params.order,
    ).filter((sortOrder): sortOrder is ItemSortOrder =>
      itemSortOrders.includes(sortOrder as ItemSortOrder),
    )
    sanitized.push(['order', order])
  }

  if (params.page !== undefined) {
    const page = parseInt(ensureScalar(params.page), 10)
    if (!Number.isNaN(page) && page > 0) {
      sanitized.push(['page', page])
    }
  }
  if (params.perpage !== undefined) {
    const perpage = parseInt(ensureScalar(params.perpage), 10)
    if (!Number.isNaN(perpage) && perpage > 0 && perpage <= 50) {
      sanitized.push(['perpage', perpage])
    }
  }

  const sanitizedParams = Object.fromEntries(sanitized)
  return sanitizedParams
}
