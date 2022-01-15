import cx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
import type { ChangeEvent, FormEvent } from 'react'
import { Fragment, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

import type { SearchConcept, SearchConcepts } from '@/api/sshoc'
import {
  useCommitConcept,
  useDeleteConcept,
  useSearchConcepts,
} from '@/api/sshoc'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as SearchIcon } from '@/elements/icons/small/search.svg'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { useToast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
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
import styles from '@/screens/account/VocabulariesScreen.module.css'
import { ensureScalar } from '@/utils/ensureScalar'
import usePagination from '@/utils/usePagination'

/**
 * Vocabularies screen.
 */
export default function VocabulariesScreen(): JSX.Element {
  const auth = useAuth()
  const handleErrors = useErrorHandlers()
  const toast = useToast()
  const router = useRouter()
  const query = sanitizeQuery(router.query)

  const concepts = useSearchConcepts(
    // @ts-expect-error Facet exists.
    { 'f.candidate': true, ...query },
    {
      enabled: auth.session?.accessToken != null,
      keepPreviousData: true,
      onError(error) {
        toast.error('Failed to fetch candidate concepts.')

        if (error instanceof Error) {
          handleErrors(error)
        }
      },
    },
    {
      token: auth.session?.accessToken,
    },
  )

  return (
    <Fragment>
      <Metadata noindex title="Vocabularies" />
      <GridLayout className={styles.layout}>
        <Header
          image={'/assets/images/search/clouds@2x.png'}
          showSearchBar={false}
        >
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              { pathname: '/account', label: 'My account' },
              {
                pathname: '/account/vocabularies',
                label: 'Vocabularies',
              },
            ]}
          />
        </Header>
        <ContentColumn className={cx('px-6 py-12 space-y-12', styles.content)}>
          <div className="flex justify-between">
            <Title>
              Candidate concepts
              {concepts.data != null ? (
                <span className="text-xl font-normal">
                  {' '}
                  ({concepts.data.hits})
                </span>
              ) : null}
            </Title>
          </div>
          {concepts.data === undefined ? (
            <ProgressSpinner />
          ) : (
            <Fragment>
              <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <div className="flex items-center space-x-8">
                  <ItemSearch filter={query} />
                </div>
                <ItemPagination filter={query} results={concepts.data} />
              </div>
              {concepts.data.concepts?.length === 0 ? (
                <div>No candidate concepts found.</div>
              ) : (
                <ul className="space-y-2.5">
                  {concepts.data.concepts?.map((concept) => {
                    return (
                      <li key={concept.code}>
                        <Concept concept={concept} />
                      </li>
                    )
                  })}
                </ul>
              )}
              <div className="flex justify-end">
                <ItemLongPagination filter={query} results={concepts.data} />
              </div>
            </Fragment>
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}

interface ConceptProps {
  concept: SearchConcept
}

function Concept(props: ConceptProps) {
  const { concept } = props

  const auth = useAuth()
  const toast = useToast()
  const approve = useCommitConcept()
  const reject = useDeleteConcept()
  const queryClient = useQueryClient()

  function onApprove() {
    approve.mutate(
      [
        { code: concept.code!, 'vocabulary-code': concept.vocabulary!.code! },
        {
          token: auth.session?.accessToken,
        },
      ],
      {
        onError() {
          toast.error('Failed to approve concept.')
        },
        onSuccess() {
          toast.success('Successfully approved concept.')
          queryClient.invalidateQueries(['searchConcepts'])
        },
      },
    )
  }

  function onReject() {
    reject.mutate(
      [
        { code: concept.code!, 'vocabulary-code': concept.vocabulary!.code! },
        {},
        {
          token: auth.session?.accessToken,
          hooks: {
            response() {
              return Promise.resolve()
            },
          },
        },
      ],
      {
        onError() {
          toast.error('Failed to reject concept.')
        },
        onSuccess() {
          toast.success('Successfully rejected concept.')
          queryClient.invalidateQueries(['searchConcepts'])
        },
      },
    )
  }

  return (
    <div className="p-4 space-y-4 text-xs border border-gray-200 rounded bg-gray-75">
      <div className="flex items-center justify-between space-x-2">
        <h2>
          <span className="text-base font-bold text-gray-600">
            {concept.label}
          </span>
        </h2>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="space-x-1.5">
          <span className="text-gray-550">Vocabulary: </span>
          <span>
            {concept.vocabulary?.code}{' '}
            {/* We don't get the vocabulary label. */}
            <span>({concept.types?.map((type) => type.code).join(', ')})</span>
          </span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onApprove}
            className="cursor-default flex space-x-1.5 text-primary-750 hover:text-secondary-600 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="cursor-default flex space-x-1.5 text-primary-750 hover:text-secondary-600 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

interface ItemSearchProps {
  filter: SearchConcepts.QueryParameters
}

/**
 * Search.
 */
function ItemSearch(props: ItemSearchProps) {
  const router = useRouter()
  const { filter } = props
  const [searchTerm, setSearchTerm] = useState(filter.q ?? '')

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = { ...filter }
    delete query.page
    router.push({ query: { ...query, q: searchTerm } })
  }

  return (
    <form className="relative inline-flex" onSubmit={onSubmit}>
      <input
        value={searchTerm}
        onChange={onChange}
        className="px-4 py-3 pr-8 font-normal border border-gray-300 rounded font-body text-ui-base"
        placeholder="Search"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center justify-center p-4 text-gray-350 placeholder-gray-350"
      >
        <Icon icon={SearchIcon} className="w-4 h-4" />
      </button>
    </form>
  )
}

/**
 * Top pagination.
 */
function ItemPagination({
  filter,
  results,
}: {
  filter: SearchConcepts.QueryParameters
  results?: SearchConcepts.Response.Success
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
 * Bottom pagination.
 */
function ItemLongPagination({
  filter,
  results,
}: {
  filter: SearchConcepts.QueryParameters
  results?: SearchConcepts.Response.Success
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
  filter: SearchConcepts.QueryParameters
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
  filter: SearchConcepts.QueryParameters
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

function sanitizeQuery(
  params?: ParsedUrlQuery,
): SearchConcepts.QueryParameters {
  if (params === undefined) return {}

  const sanitized = []

  if (params.q != null && params.q.length > 0) {
    sanitized.push(['q', params.q])
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
