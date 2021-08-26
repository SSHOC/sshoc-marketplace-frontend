import cx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
import type { ChangeEvent, FormEvent, Key } from 'react'
import { Fragment, useEffect, useState } from 'react'

import type { SearchItem, SearchItems } from '@/api/sshoc'
import { useGetSources, useGetUsers, useSearchItems } from '@/api/sshoc'
import type { ItemCategory, ItemSearchQuery } from '@/api/sshoc/types'
import { CheckBoxGroup } from '@/elements/CheckBoxGroup/CheckBoxGroup'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { Select } from '@/elements/Select/Select'
import { TextField } from '@/elements/TextField/TextField'
import { useToast } from '@/elements/Toast/useToast'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
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
import Spinner from '@/modules/ui/Spinner'
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
 * Moderate items screen.
 */
export default function ModerateItemsScreen(): JSX.Element {
  const router = useRouter()
  const query = sanitizeQuery(router.query)

  const auth = useAuth()
  const handleErrors = useErrorHandlers()
  const toast = useToast()

  const items = useSearchItems(
    {
      order: ['modified-on'],
      ...query,
    } as SearchItems.QueryParameters,
    {
      enabled: auth.session?.accessToken != null,
      keepPreviousData: true,
      onError(error) {
        toast.error('Failed to fetch items to moderate')

        if (error instanceof Error) {
          handleErrors(error)
        }
      },
    },
    { token: auth.session?.accessToken },
  )

  return (
    <Fragment>
      <Metadata noindex title="Items to moderate" />
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
                pathname: '/account/moderate',
                label: 'Items to moderate',
              },
            ]}
          />
        </Header>
        <ContentColumn>
          <div className="px-6 pb-12">
            <Title className="space-x-3">
              <span>Items to moderate</span>
              {Number(items.data?.hits) > 0 ? (
                <span className="text-2xl font-normal">
                  ({items.data?.hits})
                </span>
              ) : null}
              {items.isFetching ? (
                <span>
                  <Spinner className="w-6 h-6 text-secondary-600" />
                </span>
              ) : null}
            </Title>
          </div>
        </ContentColumn>
        <section
          className="px-6 pb-12 mr-6 space-y-8"
          style={{ gridColumn: '3 / span 3' }}
        >
          <SearchFacets filter={query} />
        </section>
        <section
          className="px-6 pb-12 space-y-12"
          style={{ gridColumn: '-10 / span 7' }}
        >
          {items.data === undefined ? (
            items.isError ? null : (
              <ProgressSpinner />
            )
          ) : items.data.items?.length === 0 ? (
            <div>Nothing to moderate.</div>
          ) : (
            <Fragment>
              <div className="flex items-center justify-between">
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
        </section>
      </GridLayout>
    </Fragment>
  )
}

interface SearchFacetsProps {
  filter: ItemSearchQuery
}

function SearchFacets(props: SearchFacetsProps) {
  const { filter } = props

  return (
    <Fragment>
      <CategoryFacet filter={filter} />
      <CurationFlags filter={filter} />
      <StatusFacet filter={filter} />
      <SourceFacet filter={filter} />
      <ContributorFacet filter={filter} />
      <LastUpdatedFacet filter={filter} />
    </Fragment>
  )
}

interface CurationFlagsProps {
  filter: ItemSearchQuery
}

function CurationFlags(props: CurationFlagsProps) {
  const router = useRouter()

  const { filter } = props

  function onChange(status: Array<string>) {
    const query = { ...filter }
    allowedFlags.forEach((flag) => {
      const key = `d.curation-flag-${flag}` as const
      if (!status.includes(flag)) {
        delete query[key]
      } else {
        query[key] = 'TRUE'
      }
    })
    delete query.page
    router.push({ query })
  }

  const allowedFlags = ['description', 'url', 'coverage', 'relations'] as const

  const defaultValue = [] as Array<string>
  allowedFlags.forEach((flag) => {
    if (filter[`d.curation-flag-${flag}` as const] === 'TRUE') {
      defaultValue.push(flag)
    }
  })

  return (
    <fieldset>
      <legend
        id="facet-curation"
        className="w-full pt-8 mb-4 font-medium uppercase border-t border-gray-200"
      >
        Curation flags
      </legend>
      <CheckBoxGroup
        variant="form"
        aria-labelledby="facet-curation"
        onChange={onChange}
        defaultValue={defaultValue}
      >
        {allowedFlags.map((flag) => {
          return (
            <CheckBoxGroup.Item key={flag} value={flag}>
              {flag}
            </CheckBoxGroup.Item>
          )
        })}
      </CheckBoxGroup>
    </fieldset>
  )
}

interface StatusFacetProps {
  filter: ItemSearchQuery
}

function StatusFacet(props: StatusFacetProps) {
  const router = useRouter()

  const { filter } = props

  function onChange(status: Array<string>) {
    const query = { ...filter }
    if (status.length === 0) {
      delete query['d.status']
    } else {
      query['d.status'] = `(${status.join(' OR ')})`
    }
    delete query.page
    router.push({ query })
  }

  const allowedStatus = [
    'ingested',
    'suggested',
    'approved',
    'deprecated',
  ] as const

  const defaultValue = [] as Array<string>
  const current = filter['d.status']
  if (current != null) {
    allowedStatus.forEach((status) => {
      if (current.includes(status)) {
        defaultValue.push(status)
      }
    })
  }
  return (
    <fieldset>
      <legend
        id="facet-status"
        className="w-full pt-8 mb-4 font-medium uppercase border-t border-gray-200"
      >
        Status
      </legend>
      <CheckBoxGroup
        variant="form"
        aria-labelledby="facet-status"
        onChange={onChange}
        defaultValue={defaultValue}
      >
        {allowedStatus.map((status) => {
          return (
            <CheckBoxGroup.Item key={status} value={status}>
              {status}
            </CheckBoxGroup.Item>
          )
        })}
      </CheckBoxGroup>
    </fieldset>
  )
}

interface SourceFacetProps {
  filter: ItemSearchQuery
}

function SourceFacet(props: SourceFacetProps) {
  const router = useRouter()
  const auth = useAuth()
  const toast = useToast()

  const { filter } = props

  function onChange(source: Array<string>) {
    const query = { ...filter }
    if (source.length === 0) {
      delete query['f.source']
    } else {
      query['f.source'] = source
    }
    delete query.page
    router.push({ query })
  }

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedState(searchTerm, 150).trim()
  const sourceQuery =
    debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined

  const sources = useGetSources(
    {
      q: sourceQuery,
    },
    {
      enabled: Boolean(auth.session?.accessToken),
      keepPreviousData: true,
      onError() {
        toast.error('Failed to fetch sources')
      },
    },
    {
      token: auth.session?.accessToken,
    },
  )
  const allowedSources = sources.data?.sources ?? []

  return (
    <fieldset>
      <legend
        id="facet-source"
        className="w-full pt-8 mb-4 font-medium uppercase border-t border-gray-200"
      >
        Sources
      </legend>
      <div className="mb-6">
        <TextField
          placeholder="Search source"
          onChange={setSearchTerm}
          value={searchTerm}
          aria-labelledby="facet-source"
          variant="form"
          size="sm"
        />
      </div>
      <CheckBoxGroup
        variant="form"
        aria-labelledby="facet-source"
        onChange={onChange}
        // defaultValue={filter['d.status']}
      >
        {allowedSources.map((source) => {
          return (
            <CheckBoxGroup.Item key={source.id} value={source.label!}>
              {source.label}
            </CheckBoxGroup.Item>
          )
        })}
      </CheckBoxGroup>
    </fieldset>
  )
}

interface ContributorFacetProps {
  filter: ItemSearchQuery
}

function ContributorFacet(props: ContributorFacetProps) {
  const router = useRouter()
  const auth = useAuth()
  const toast = useToast()

  const { filter } = props

  function onChange(contributors: Array<string>) {
    const query = { ...filter }
    if (contributors.length === 0) {
      delete query['d.owner']
    } else {
      query['d.owner'] = `(${contributors.join(' OR ')})`
    }
    delete query.page
    router.push({ query })
  }

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedState(searchTerm, 150).trim()
  const contributorQuery =
    debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined

  const users = useGetUsers(
    {
      q: contributorQuery,
    },
    {
      enabled: Boolean(auth.session?.accessToken),
      keepPreviousData: true,
      onError() {
        toast.error('Failed to fetch users')
      },
    },
    {
      token: auth.session?.accessToken,
    },
  )
  const allowedUsers = users.data?.users ?? []

  return (
    <fieldset>
      <legend
        id="facet-contributor"
        className="w-full pt-8 mb-4 font-medium uppercase border-t border-gray-200"
      >
        Contributors
      </legend>
      <div className="mb-6">
        <TextField
          placeholder="Search contributor"
          onChange={setSearchTerm}
          value={searchTerm}
          aria-labelledby="facet-contributor"
          variant="form"
          size="sm"
        />
      </div>
      <CheckBoxGroup
        variant="form"
        aria-labelledby="facet-contributor"
        onChange={onChange}
        // defaultValue={filter['d.contributor']}
      >
        {allowedUsers.map((user) => {
          return (
            <CheckBoxGroup.Item key={user.id} value={user.username!}>
              {user.displayName}
            </CheckBoxGroup.Item>
          )
        })}
      </CheckBoxGroup>
    </fieldset>
  )
}

interface LastUpdatedFacetProps {
  filter: ItemSearchQuery
}

function LastUpdatedFacet(props: LastUpdatedFacetProps) {
  const router = useRouter()

  const { filter } = props

  function onChange(lastInfoUpdate: string) {
    const query = { ...filter }
    if (lastInfoUpdate.length === 0) {
      delete query['d.lastInfoUpdate']
    } else {
      const date = new Date(lastInfoUpdate).toISOString()
      query['d.lastInfoUpdate'] = `[${date} TO NOW]`
    }
    delete query.page
    router.push({ query })
  }

  return (
    <fieldset>
      <legend
        id="facet-lastInfoUpdate"
        className="w-full pt-8 mb-4 font-medium uppercase border-t border-gray-200"
      >
        Last updated after
      </legend>
      <TextField
        type="date"
        variant="form"
        size="sm"
        onChange={onChange}
        aria-labelledby="facet-lastInfoUpdate"
        // defaultValue={filter['d.lastInfoUpdate']}
      />
    </fieldset>
  )
}

interface CategoryFacetProps {
  filter: ItemSearchQuery
}

function CategoryFacet(props: CategoryFacetProps) {
  const router = useRouter()

  const { filter } = props

  function onChange(categories: Array<string>) {
    const query = { ...filter }
    if (categories.length === 0) {
      delete query['categories']
    } else {
      query['categories'] = categories as Array<ItemCategory>
    }
    delete query.page
    router.push({ query })
  }

  const allowedCategories: Record<Exclude<ItemCategory, 'step'>, string> = {
    'tool-or-service': 'Tools & Services',
    'training-material': 'Training Materials',
    dataset: 'Datasets',
    publication: 'Publications',
    workflow: 'Workflows',
  }
  const defaultValue = filter.categories

  return (
    <fieldset>
      <legend
        id="facet-categories"
        className="w-full pt-8 mb-4 font-medium uppercase border-t border-gray-200"
      >
        Categories
      </legend>
      <CheckBoxGroup
        variant="form"
        aria-labelledby="facet-categories"
        onChange={onChange}
        defaultValue={defaultValue}
      >
        {Object.entries(allowedCategories).map(([category, label]) => {
          return (
            <CheckBoxGroup.Item key={category} value={category}>
              {label}
            </CheckBoxGroup.Item>
          )
        })}
      </CheckBoxGroup>
    </fieldset>
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
      <div className="flex items-center justify-between space-x-2">
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
        {item.lastInfoUpdate != null ? (
          <div className="space-x-1.5 flex-shrink-0">
            <span className="text-gray-550">Date:</span>
            <LastUpdate isoDate={item.lastInfoUpdate} />
          </div>
        ) : null}
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
          {Array.isArray(item.contributors) && item.contributors.length > 0 ? (
            <div className="space-x-1.5">
              <span className="text-gray-550">Contributors:</span>
              <span>
                {item.contributors
                  .map((contributor) => {
                    return contributor.actor?.name
                  })
                  .join(', ')}
              </span>
            </div>
          ) : null}
        </div>
        <div className="text-sm">
          <ProtectedView roles={['moderator', 'administrator']}>
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
                query: {
                  review: true,
                },
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
    delete query.page
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

  if (params.categories != null) {
    const allowedCategories: Array<ItemCategory> = [
      'dataset',
      'publication',
      'tool-or-service',
    ]
    const categories = ensureArray(params.categories).filter((category) =>
      (allowedCategories as Array<string>).includes(category),
    )
    if (categories.length > 0) {
      sanitized.push(['categories', categories])
    }
  }
  if (params['d.lastInfoUpdate'] != null) {
    const lastInfoUpdate = ensureScalar(params['d.lastInfoUpdate'])
    if (lastInfoUpdate.length > 0) {
      sanitized.push(['d.lastInfoUpdate', lastInfoUpdate])
    }
  }
  if (params['d.owner'] != null) {
    const contributor = ensureScalar(params['d.owner'])
    if (contributor.length > 0) {
      sanitized.push(['d.owner', contributor])
    }
  }
  if (params['d.status'] != null) {
    const status = ensureScalar(params['d.status'])
    if (status.length > 0) {
      sanitized.push(['d.status', status])
    }
  }
  if (params['f.source'] != null) {
    const source = ensureArray(params['f.source'])
    if (source.length > 0) {
      sanitized.push(['f.source', source])
    }
  }
  if (params['d.curation-flag-description'] != null) {
    const curationFlagDescription = ensureScalar(
      params['d.curation-flag-description'],
    )
    if (curationFlagDescription.length > 0) {
      sanitized.push(['d.curation-flag-description', curationFlagDescription])
    }
  }
  if (params['d.curation-flag-url'] != null) {
    const curationFlagUrl = ensureScalar(params['d.curation-flag-url'])
    if (curationFlagUrl.length > 0) {
      sanitized.push(['d.curation-flag-url', curationFlagUrl])
    }
  }
  if (params['d.curation-flag-relations'] != null) {
    const curationFlagRelations = ensureScalar(
      params['d.curation-flag-relations'],
    )
    if (curationFlagRelations.length > 0) {
      sanitized.push(['d.curation-flag-relations', curationFlagRelations])
    }
  }
  if (params['d.curation-flag-coverage'] != null) {
    const curationFlagCoverage = ensureScalar(
      params['d.curation-flag-coverage'],
    )
    if (curationFlagCoverage.length > 0) {
      sanitized.push(['d.curation-flag-coverage', curationFlagCoverage])
    }
  }

  const sanitizedParams = Object.fromEntries(sanitized)
  return sanitizedParams
}
