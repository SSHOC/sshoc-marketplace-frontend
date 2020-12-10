import { Listbox } from '@headlessui/react'
import cx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  PropsWithChildren,
  Ref,
} from 'react'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { QueryStatus } from 'react-query'
import type { SearchItems } from '@/api/sshoc'
import { HttpError, useSearchItems } from '@/api/sshoc'
import type {
  ItemCategory,
  ItemSearchFacet,
  ItemSearchFacetData,
  ItemSearchQuery,
  ItemSortOrder,
} from '@/api/sshoc/types'
import {
  defaultItemSortOrder,
  itemSortOrders,
  sanitizeItemSearchQuery,
} from '@/api/sshoc/validation'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import Metadata from '@/modules/metadata/Metadata'
import { Anchor } from '@/modules/ui/Anchor'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Checkbox from '@/modules/ui/Checkbox'
import CheckMark from '@/modules/ui/CheckMark'
import FadeIn from '@/modules/ui/FadeIn'
import Header from '@/modules/ui/Header'
import { ItemCategoryIcon } from '@/modules/ui/ItemCategoryIcon'
import Spinner from '@/modules/ui/Spinner'
import Triangle from '@/modules/ui/Triangle'
import { SubSectionTitle } from '@/modules/ui/typography/SubSectionTitle'
import { Title } from '@/modules/ui/typography/Title'
import ErrorScreen from '@/screens/error/ErrorScreen'
import styles from '@/screens/search/SearchScreen.module.css'
import { ensureScalar } from '@/utils/ensureScalar'
import { useDebounce } from '@/utils/useDebounce'
import { Svg as CloseIcon } from '@@/assets/icons/close.svg'
import { Svg as LinkIcon } from '@@/assets/icons/link.svg'
import { Svg as NoResultsIcon } from '@@/assets/icons/no-results.svg'
import siteMetadata from '@@/config/metadata.json'

const MAX_DESCRIPTION_LENGTH = 280
const MAX_METADATA_VALUES = 5

const baseUrl = process.env.NEXT_PUBLIC_SSHOC_BASE_URL ?? siteMetadata.url

/** lazy load markdown processor */
const Plaintext = dynamic(() => import('@/modules/markdown/Plaintext'))

export default function SearchScreen(): JSX.Element {
  const router = useRouter()
  const query = sanitizeItemSearchQuery(router.query)
  const { data: results, status, error, isFetching } = useSearchItems(query, {
    keepPreviousData: true,
  })
  const formRef = useRef<HTMLFormElement>(null)

  if (status === 'error') {
    const message = error instanceof Error ? error.message : undefined
    const statusCode = error instanceof HttpError ? error.statusCode : undefined
    return <ErrorScreen message={message} statusCode={statusCode} />
  }

  return (
    <Fragment>
      <Metadata title="Search results" />
      <GridLayout className={styles.grid}>
        <Header
          image={'/assets/images/search/clouds@2x.png'}
          initialValue={query.q}
        >
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              { pathname: '/search', label: 'Search' },
            ]}
          />
        </Header>
        <ContentColumn>
          <div className="px-6 pb-12">
            <Title className="space-x-3">
              <span>Search results</span>
              {Number(results?.hits) > 0 ? (
                <span className="text-2xl font-normal">({results?.hits})</span>
              ) : null}
              {isFetching ? (
                <span>
                  <Spinner className="w-6 h-6 text-secondary-600" />
                </span>
              ) : null}
            </Title>
          </div>
        </ContentColumn>
        <SideColumn>
          <HStack className="items-center justify-between h-full pb-6">
            <SubSectionTitle as="h2">Refine your search</SubSectionTitle>
            <button
              onClick={() => {
                /**
                 * because we are using an uncontrolled form we need to manually sync the form to query params
                 * any time we change query params without interacting with the form.
                 * to avoid this, we put a `key` on the form and rerender on every query param change
                 */
                // formRef.current.reset()
                router.push({ query: {} }, undefined, { shallow: true })
              }}
            >
              <span className="text-primary-800">Clear filters</span>
            </button>
          </HStack>
        </SideColumn>
        <MainColumn>
          <HStack className="items-center justify-between h-full pb-6">
            <ItemSearchSortOrder filter={query} />
            <ItemSearchPagination filter={query} results={results} />
          </HStack>
        </MainColumn>
        <SideColumn>
          <div className="pb-12">
            <ItemSearchFilter
              filter={query}
              results={results}
              formRef={formRef}
            />
          </div>
        </SideColumn>
        <MainColumn className="bg-gray-50">
          <ItemSearchResultsList results={results} status={status} />
        </MainColumn>
        <b className={cx('bg-gray-50', styles.rightBleed)} />
        <MainColumn>
          <div className="flex justify-end px-6 pt-6 pb-12">
            <ItemSearchLongPagination filter={query} results={results} />
          </div>
        </MainColumn>
      </GridLayout>
    </Fragment>
  )
}

/**
 * Main column layout.
 */
function MainColumn({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const classNames = {
    section: cx('pr-6', className, styles.mainColumn),
  }
  return <section className={classNames.section}>{children}</section>
}

/**
 * Side column layout.
 */
function SideColumn({ children }: PropsWithChildren<unknown>) {
  const classNames = {
    section: cx('px-6 mr-6', styles.sideColumn),
  }
  return <section className={classNames.section}>{children}</section>
}

/**
 * Item sort order select.
 */
function ItemSearchSortOrder({ filter }: { filter: ItemSearchQuery }) {
  const router = useRouter()

  const currentSortOrder =
    filter.order !== undefined
      ? ensureScalar(filter.order) ?? defaultItemSortOrder
      : defaultItemSortOrder

  /** no need for local state since we are storing state in the url */
  // const [sortOrder, setSortOrder] = useState<ItemSortOrder>(currentSortOrder)

  function onSubmit(order: ItemSortOrder) {
    const query = { ...filter }
    if (order === defaultItemSortOrder) {
      delete query.order
    } else {
      query.order = [order]
    }
    router.push({ query }, undefined, { shallow: true })
  }

  /** we don't get labels for sort order from the backend */
  const label = {
    score: 'relevance',
    label: 'name',
    'modified-on': 'last modification',
  }

  return (
    <Listbox value={currentSortOrder} onChange={onSubmit}>
      {({ open }) => (
        <div className="relative w-64">
          <Listbox.Button className="inline-flex items-center justify-between w-full h-full p-2 border border-gray-200 divide-x divide-gray-200 rounded hover:text-primary-750 hover:bg-gray-50 focus:bg-gray-50">
            <span className="px-2">Sort by {label[currentSortOrder]}</span>
            <span className="inline-flex items-center h-full pl-2 justify-content text-secondary-600">
              <Triangle />
            </span>
          </Listbox.Button>
          <FadeIn show={open}>
            <Listbox.Options
              static
              className="absolute min-w-full py-2 mt-1 overflow-hidden whitespace-no-wrap bg-white border border-gray-200 rounded shadow-md select-none"
            >
              {itemSortOrders.map((order) => {
                return (
                  <Listbox.Option key={order} value={order} as={Fragment}>
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
                        <span>Sort by {label[order]}</span>
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

/**
 * Top search results pagination.
 */
function ItemSearchPagination({
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
   * be reflected in url upon submit, ont immediately on change.
   */
  const [input, setInput] = useState(currentPage)
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value
    const page = parseInt(value, 10)
    if (!Number.isNaN(page) && page > 0 && page <= pages) {
      setInput(page)
    }
  }
  useEffect(() => {
    setInput(currentPage)
  }, [currentPage])

  function onChangePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = new FormData(event.currentTarget).get('page') as string
    const page = parseInt(input, 10)
    if (!Number.isNaN(page) && page > 0 && page <= pages) {
      router.push({ query: { ...filter, page } }, undefined, { shallow: true })
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
function ItemSearchLongPagination({
  filter,
  results,
}: {
  filter: ItemSearchQuery
  results?: SearchItems.Response.Success
}) {
  const currentPage = filter.page ?? 1
  const pages = results?.pages ?? 1

  function getPaginationRange(min = 1, length = 5) {
    if (length > pages) length = pages

    let start = currentPage - Math.floor(length / 2)
    start = Math.max(start, min)
    start = Math.min(start, min + pages - length)

    return Array.from({ length }, (_, i) => start + i)
  }

  if (pages <= 1) return null

  return (
    <nav aria-label="Pagination">
      <HStack as="ol" className="items-center space-x-6">
        <li className="flex items-center">
          <PreviousPageLink currentPage={currentPage} filter={filter} />
        </li>
        {getPaginationRange().map((num) => {
          return (
            <li key={num} className="flex items-center">
              <Link
                href={{ query: { ...filter, page: num } }}
                passHref
                shallow={true}
              >
                <Anchor aria-label={`Page ${num}`}>{num}</Anchor>
              </Link>
            </li>
          )
        })}
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
    <Link
      href={{ query: { ...filter, page: currentPage - 1 } }}
      passHref
      shallow={true}
    >
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
    <Link
      href={{ query: { ...filter, page: currentPage + 1 } }}
      passHref
      shallow={false}
    >
      <Anchor rel="next" className="inline-flex items-center">
        {label}
      </Anchor>
    </Link>
  )
}

/**
 * Item search facets.
 */
function ItemSearchFilter({
  filter,
  results,
  formRef,
}: {
  filter: ItemSearchQuery
  results?: SearchItems.Response.Success
  formRef: Ref<HTMLFormElement>
}) {
  const [
    detailedFilterList,
    setDetailedFilterList,
  ] = useState<ItemSearchFacet | null>(null)

  const filterLists = {
    categories: { label: 'Categories', values: results?.categories },
    'f.activity': { label: 'Activities', values: results?.facets?.activity },
    'f.keyword': { label: 'Keywords', values: results?.facets?.keyword },
    'f.source': { label: 'Sources', values: results?.facets?.source },
  }

  /** display full list on filter values */
  if (detailedFilterList !== null && detailedFilterList in filterLists) {
    const name = detailedFilterList
    const { label, values } = filterLists[detailedFilterList]
    return (
      <ItemSearchFilterDetailedForm
        name={name}
        label={label}
        values={values}
        filter={filter}
        setDetailedFilterList={setDetailedFilterList}
        formRef={formRef}
      />
    )
  }

  return (
    <ItemSearchFilterForm
      filter={filter}
      filterLists={filterLists}
      setDetailedFilterList={setDetailedFilterList}
      formRef={formRef}
    />
  )
}

/**
 * Long facet values list.
 */
function ItemSearchFilterDetailedForm({
  name,
  label,
  values,
  filter,
  setDetailedFilterList,
  formRef,
}: {
  name: ItemSearchFacet
  label: string
  values?: Record<string, ItemSearchFacetData>
  filter: ItemSearchQuery
  setDetailedFilterList: Dispatch<SetStateAction<ItemSearchFacet | null>>
  formRef: Ref<HTMLFormElement>
}) {
  const router = useRouter()

  function onChange(event: ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const query = {
      ...filter,
      [name]: formData.getAll(name),
    }
    /** reset page */
    delete query.page
    router.push({ query }, undefined, { shallow: true })
  }

  /**
   * the filters are updated in `onChange`.
   *
   * needs research on the a11y implications.
   */
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form
      ref={formRef}
      onChange={onChange}
      onSubmit={onSubmit}
      role="search"
      /** rerender form on every query param change to avoid stale values in uncontrolled form state */
      key={JSON.stringify(router.query)}
    >
      <ItemSearchFilterDetailedList
        name={name}
        label={label}
        values={values}
        filter={filter[name]}
        setDetailedFilterList={setDetailedFilterList}
      />
    </form>
  )
}

/**
 * Truncated facet values list.
 */
function ItemSearchFilterForm({
  filter,
  filterLists,
  setDetailedFilterList,
  formRef,
}: {
  filter: ItemSearchQuery
  filterLists: Record<
    ItemSearchFacet,
    { label: string; values?: Record<string, ItemSearchFacetData> }
  >
  setDetailedFilterList: Dispatch<SetStateAction<ItemSearchFacet | null>>
  formRef: Ref<HTMLFormElement>
}) {
  const router = useRouter()

  function onChange(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const query = {
      ...filter,
      categories: formData.getAll('categories'),
      'f.activity': formData.getAll('f.activity'),
      'f.keyword': formData.getAll('f.keyword'),
      'f.source': formData.getAll('f.source'),
    } as ItemSearchQuery
    /** reset page */
    delete query.page
    router.push({ query }, undefined, { shallow: true })
  }

  /**
   * the filters are updated in `onChange`.
   *
   * needs research on the a11y implications.
   */
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form
      ref={formRef}
      onChange={onChange}
      onSubmit={onSubmit}
      role="search"
      className="flex flex-col space-y-8"
      /** rerender form on every query param change to avoid stale values in uncontrolled form state */
      key={JSON.stringify(router.query)}
    >
      {Object.entries(filterLists).map(([name, { label, values }]) => {
        return (
          <ItemSearchFilterList
            key={name}
            name={name as ItemSearchFacet}
            label={label}
            values={values}
            filter={filter[name as ItemSearchFacet]}
            setDetailedFilterList={setDetailedFilterList}
          />
        )
      })}
    </form>
  )
}

function ItemSearchFilterList({
  name,
  label,
  values = {},
  filter = [],
  setDetailedFilterList,
}: {
  name: ItemSearchFacet
  label: string
  values?: Record<string, ItemSearchFacetData>
  filter?: Array<string>
  setDetailedFilterList: Dispatch<SetStateAction<ItemSearchFacet | null>>
}) {
  const allValues = Object.entries(values)
  if (allValues.length === 0) return null
  const visibleFilterValues = new Map(allValues.slice(0, 10))
  /** if active filter is not included in the first 10 filter values, append it to the list */
  filter.forEach((key) => {
    if (!visibleFilterValues.has(key)) {
      visibleFilterValues.set(key, values[key])
    }
  })

  return (
    <fieldset className="flex flex-col justify-between space-y-2">
      <legend className="w-full pt-8 mb-4 font-medium uppercase border-t border-gray-200">
        {label}
      </legend>
      {Array.from(visibleFilterValues).map(([value, meta]) => {
        if (meta === undefined || meta.count === 0) return null
        return (
          <ItemSearchFilterValue
            key={value}
            name={name}
            value={value}
            /**
             * we use the state from the query params, not from the search results.
             * we need to keep previous search results for this to make a difference.
             */
            active={Boolean(filter.includes(value))}
            label={'label' in meta ? meta.label : value}
            count={meta.count}
          />
        )
      })}
      {visibleFilterValues.size < allValues.length ? (
        <button
          onClick={() => setDetailedFilterList(name)}
          className="inline-flex justify-start py-2 transition-colors duration-150 text-primary-800 hover:text-primary-700"
        >
          More&hellip;
        </button>
      ) : null}
    </fieldset>
  )
}

/**
 * todo: figure out what aria role this is, most probably this should be a combobox.
 * also need to announce the change to detailed filter list somehow.
 */
function ItemSearchFilterDetailedList({
  name,
  label,
  values = {},
  filter = [],
  setDetailedFilterList,
}: {
  name: ItemSearchFacet
  label: string
  values?: Record<string, ItemSearchFacetData>
  filter?: Array<string>
  setDetailedFilterList: Dispatch<SetStateAction<ItemSearchFacet | null>>
}) {
  const [listFilter, setListFilter] = useState('')

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setListFilter(event.currentTarget.value.toLowerCase())
  }

  const debouncedListFilter = useDebounce(listFilter.trim(), 150)
  const filteredValues = useMemo(() => {
    if (!debouncedListFilter) return new Set(Object.keys(values))
    return new Set(
      Object.keys(values).filter((value) => {
        if (value.toLowerCase().includes(debouncedListFilter)) return true
        return false
      }),
    )
  }, [values, debouncedListFilter])

  return (
    <div className="flex flex-col border border-gray-200 divide-y divide-gray-200">
      <header className="flex items-center justify-between py-6 pl-6 pr-4">
        <span className="font-medium uppercase">{label}</span>
        <button
          onClick={() => setDetailedFilterList(null)}
          aria-label="Close"
          className="p-2 rounded"
        >
          <CloseIcon height="0.6em" />
        </button>
      </header>
      <div className="px-6 py-4 bg-gray-100">
        <input
          className="w-full p-2 placeholder-gray-300 rounded"
          type="text"
          placeholder={`Filter ${label}`}
          value={listFilter}
          onChange={onChange}
        />
      </div>
      <div className="flex-1 max-h-full p-6 space-y-2 overflow-y-auto bg-gray-100">
        {Object.entries(values).map(([value, meta]) => {
          if (meta === undefined || meta.count === 0) return null
          return (
            <ItemSearchFilterValue
              /**
               * ensure that every checkbox stays in the dom, so we don't lose checkbox state
               * when changing form values (we are using uncontrolled components and get the
               * form data with new FormData)
               */
              hidden={!filteredValues.has(value)}
              key={value}
              name={name}
              value={value}
              /**
               * we use the state from the query params, not from the search results.
               * we need to keep previous search results for this to make a difference.
               */
              active={Boolean(filter.includes(value))}
              label={'label' in meta ? meta.label : value}
              count={meta.count}
            />
          )
        })}
      </div>
    </div>
  )
}

function ItemSearchFilterValue({
  name,
  value,
  active,
  label,
  count,
  hidden,
}: {
  name: string
  value: string
  active: boolean
  label?: string
  count?: number
  hidden?: boolean
}) {
  return (
    <div
      className={cx(
        'justify-between text-sm',
        hidden === true ? 'hidden' : 'flex',
      )}
    >
      <Checkbox
        name={name}
        /** uncontrolled checkbox, since we rerender on every form `onChange` */
        defaultChecked={active}
        value={value}
      >
        {label ?? value}
      </Checkbox>
      <span>{count}</span>
    </div>
  )
}

/**
 * Item search results.
 */
function ItemSearchResultsList({
  results,
  status,
}: {
  results?: SearchItems.Response.Success
  status: QueryStatus
}) {
  if (status === 'loading') return <ItemSearchResultsLoading />
  const { items } = results ?? {}
  if (items === undefined || items.length === 0)
    return <ItemSearchResultsNotFound />
  return (
    <ul className="divide-y-4 divide-white">
      {items.map((item) => {
        return (
          <li key={item.persistentId}>
            <ItemSearchResult item={item} />
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Initially loading search results.
 * Not shown on subsequent queries since we show the previous results
 * until the query succeeds. A loading indicator is however shown
 * next to the page title.
 */
function ItemSearchResultsLoading() {
  return (
    <VStack className="items-center h-full py-48 space-y-12">
      <div className="w-40 h-4 rounded-full bg-gradient-to-r from-secondary-600 to-primary-800" />
      <SubSectionTitle as="div">Loading...</SubSectionTitle>
    </VStack>
  )
}

/**
 * No search results found.
 */
function ItemSearchResultsNotFound() {
  return (
    <VStack className="items-center h-full py-48 space-y-12">
      <div className="inline-flex items-center justify-center w-40 h-40 border-4 border-white rounded-full bg-highlight-100">
        <NoResultsIcon width="3em" className="pl-1" />
      </div>
      <div className="space-y-3 text-center">
        <SubSectionTitle as="div">No search results</SubSectionTitle>
        <p>We could not find any results matching your search criteria.</p>
      </div>
    </VStack>
  )
}

/**
 * Item search result.
 */
function ItemSearchResult({
  item,
}: {
  item: Exclude<SearchItems.Response.Success['items'], undefined>[0]
}) {
  const allActivities = item.properties?.filter(
    (property) => property.type?.code === 'activity',
  )
  const activities = allActivities
    ?.slice(0, MAX_METADATA_VALUES)
    ?.map((activity) => activity.concept?.label)
    ?.join(', ')
  const allKeywords = item.properties?.filter(
    (property) => property.type?.code === 'keyword',
  )
  const keywords = allKeywords
    ?.slice(0, MAX_METADATA_VALUES)
    ?.map((keyword) => keyword.value)
    ?.join(', ')

  const pathname = `/${item.category}/${item.persistentId}`

  return (
    <article className="flex flex-col py-8 pl-16 pr-6 space-y-4">
      <div className="flex justify-between">
        <h3 className="flex items-center space-x-4 text-xl font-medium">
          <ItemCategoryIcon
            category={item.category as Exclude<ItemCategory, 'step'>}
            className="flex-shrink-0"
            height="2.5em"
          />
          <Link href={{ pathname }}>
            <a className="transition-colors duration-150 hover:text-primary-800">
              {item.label}
            </a>
          </Link>
        </h3>
        <CopyToClipboardButton pathname={pathname} />
      </div>
      <dl
        className="grid text-xs text-gray-500"
        style={{ gridTemplateColumns: 'auto 1fr', columnGap: '0.5rem' }}
      >
        {activities !== undefined && activities.length > 0 ? (
          <Fragment>
            <dt>Activities:</dt>
            <dd>
              {activities}
              {allActivities !== undefined &&
              allActivities.length > MAX_METADATA_VALUES
                ? '...'
                : null}
            </dd>
          </Fragment>
        ) : null}
        {keywords !== undefined && keywords.length > 0 ? (
          <Fragment>
            <dt>Keywords:</dt>
            <dd>
              {keywords}
              {allKeywords !== undefined &&
              allKeywords.length > MAX_METADATA_VALUES
                ? '...'
                : null}
            </dd>
          </Fragment>
        ) : null}
      </dl>
      <div className="leading-7">
        <Plaintext text={item.description} maxLength={MAX_DESCRIPTION_LENGTH} />
      </div>
      <Link href={{ pathname }} passHref>
        <Anchor className="self-end">Read more</Anchor>
      </Link>
    </article>
  )
}

/**
 * Copy item link to clipboard.
 */
function CopyToClipboardButton({ pathname }: { pathname: string }) {
  function onClick() {
    const url = new URL(pathname, baseUrl)
    /** no need to await the returned promise, which will reject when we don't have required permissions */
    window.navigator.clipboard.writeText(String(url))
  }

  return (
    <button
      onClick={onClick}
      aria-label="Copy to clipboard"
      title="Copy to clipboard"
      className="inline-flex items-center justify-center w-6 h-6 transition-colors duration-150 border border-gray-200 rounded hover:bg-highlight-100 hover:border-highlight-200"
    >
      <LinkIcon height="0.75em" />
    </button>
  )
}
