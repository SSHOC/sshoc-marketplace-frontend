import { Dialog } from '@reach/dialog'
import cx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
import type { ChangeEvent, FormEvent, Key } from 'react'
import { Fragment, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

import type { GetSources, SourceCore, SourceDto } from '@/api/sshoc'
import {
  useCreateSource,
  useDeleteSource,
  useGetSources,
  useUpdateSource,
} from '@/api/sshoc'
import { Button } from '@/elements/Button/Button'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import { Svg as SearchIcon } from '@/elements/icons/small/search.svg'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { Select } from '@/elements/Select/Select'
import { useToast } from '@/elements/Toast/useToast'
import { useDialogState } from '@/lib/hooks/useDialogState'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { useAuth } from '@/modules/auth/AuthContext'
import ProtectedView from '@/modules/auth/ProtectedView'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { Form } from '@/modules/form/Form'
import { isUrl } from '@/modules/form/validate'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import Metadata from '@/modules/metadata/Metadata'
import { Anchor } from '@/modules/ui/Anchor'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import Triangle from '@/modules/ui/Triangle'
import { Title } from '@/modules/ui/typography/Title'
import styles from '@/screens/account/SourcesScreen.module.css'
import { ensureScalar } from '@/utils/ensureScalar'
import usePagination from '@/utils/usePagination'

const itemSortOrders = ['name', 'date'] as const
type ItemSortOrder = typeof itemSortOrders[number]
const defaultItemSortOrder: ItemSortOrder = 'name'

/**
 * Sources screen.
 */
export default function SourcesScreen(): JSX.Element {
  const router = useRouter()
  // TODO: use useQueryParam
  // const q = useQueryParam('q', false)
  // const order = useQueryParam('order', true)?.filter((sortOrder) =>
  //   itemSortOrders.includes(sortOrder as ItemSortOrder),
  // )
  // const page = useQueryParam('page', false, Number)
  // const perPage = clamp(0, useQueryParam('perPage', false, Number), 50)
  // const query = { q, page }
  const query = sanitizeQuery(router.query)

  const auth = useAuth()
  const handleErrors = useErrorHandlers()
  const toast = useToast()

  const sources = useGetSources(
    query,
    {
      enabled: auth.session?.accessToken != null,
      keepPreviousData: true,
      onError(error) {
        toast.error('Failed to fetch sources.')

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
      <Metadata noindex title="Sources" />
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
                pathname: '/account/sources',
                label: 'Sources',
              },
            ]}
          />
        </Header>
        <ContentColumn className={cx('px-6 py-12 space-y-12', styles.content)}>
          <div className="space-y-2 sm:space-y-0 sm:flex sm:justify-between">
            <Title>
              Sources
              {sources.data != null ? (
                <span className="text-xl font-normal">
                  {' '}
                  ({sources.data.hits})
                </span>
              ) : null}
            </Title>
            <AddSourceButton />
          </div>
          {sources.data === undefined ? (
            <ProgressSpinner />
          ) : (
            <Fragment>
              <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <div className="space-y-2 sm:flex sm:items-center sm:space-x-8 sm:space-y-0">
                  <ItemSortOrder filter={query} />
                  <ItemSearch filter={query} />
                </div>
                <ItemPagination filter={query} results={sources.data} />
              </div>
              {sources.data.sources?.length === 0 ? (
                <div>No source found.</div>
              ) : (
                <ul className="space-y-2.5">
                  {sources.data.sources?.map((source) => {
                    return (
                      <li key={source.id}>
                        <Source source={source} />
                      </li>
                    )
                  })}
                </ul>
              )}
              <div className="flex justify-end">
                <ItemLongPagination filter={query} results={sources.data} />
              </div>
            </Fragment>
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}

interface SourceProps {
  source: SourceDto
}

function Source(props: SourceProps) {
  const { source } = props

  return (
    <div className="p-4 space-y-4 text-xs border border-gray-200 rounded bg-gray-75">
      <div className="flex items-center justify-between space-x-2">
        <h2>
          <span className="text-base font-bold transition text-primary-750">
            {source.label}
          </span>
        </h2>
        {source.lastHarvestedDate != null ? (
          <div className="space-x-1.5 flex-shrink-0">
            <span className="text-gray-550">Last harvested date:</span>
            <LastUpdate isoDate={source.lastHarvestedDate} />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col space-y-2 sm:items-center sm:justify-between sm:flex-row sm:space-y-0">
        <div className="flex flex-col space-x-4">
          <div className="space-x-1.5">
            <span className="text-gray-550">URL:</span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition text-primary-750 hover:text-secondary-600"
            >
              <span>{source.url}</span>
            </a>
          </div>
        </div>
        <div className="flex space-x-4 text-sm text-primary-750">
          <ProtectedView roles={['administrator']}>
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <DeleteSourceButton id={source.id!} />
          </ProtectedView>
          <EditSourceButton source={source} />
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
  filter: GetSources.QueryParameters
}

/**
 * Sort order.
 */
function ItemSortOrder(props: ItemSortOrderProps) {
  const { filter } = props

  const router = useRouter()

  const currentSortOrder =
    filter.order === undefined
      ? defaultItemSortOrder
      : (filter.order as ItemSortOrder)

  function onSubmit(order: Key) {
    const query = { ...filter }
    if (order === defaultItemSortOrder) {
      delete query.order
    } else {
      query.order = order as ItemSortOrder
    }
    router.push({ query })
  }

  /** we don't get labels for sort order from the backend */
  const labels: Record<ItemSortOrder, string> = {
    name: 'name',
    date: 'last harvest date',
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

interface ItemSearchProps {
  filter: GetSources.QueryParameters
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
    router.push({ query: { ...filter, q: searchTerm } })
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
  filter: GetSources.QueryParameters
  results?: GetSources.Response.Success
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
  filter: GetSources.QueryParameters
  results?: GetSources.Response.Success
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
  filter: GetSources.QueryParameters
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
  filter: GetSources.QueryParameters
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

function sanitizeQuery(params?: ParsedUrlQuery): GetSources.QueryParameters {
  if (params === undefined) return {}

  const sanitized = []

  if (params.q != null && params.q.length > 0) {
    sanitized.push(['q', params.q])
  }

  if (params.order !== undefined) {
    const order = ensureScalar(params.order)
    if (itemSortOrders.includes(order as ItemSortOrder)) {
      sanitized.push(['order', order])
    }
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

/**
 * Add source.
 */
function AddSourceButton() {
  const dialog = useDialogState()
  const auth = useAuth()
  const toast = useToast()
  const handleErrors = useErrorHandlers()
  const queryClient = useQueryClient()
  const addSource = useCreateSource({
    onSuccess() {
      toast.success('Successfully added source.')
      queryClient.invalidateQueries(['getSources'])
    },
    onError(error) {
      toast.error('Failed to add source')

      if (error instanceof Error) {
        handleErrors(error)
      }
    },
    onSettled() {
      dialog.close()
    },
  })

  function onSubmit(source: SourceCore) {
    addSource.mutate([source, { token: auth.session?.accessToken }])
  }

  return (
    <Fragment>
      <Button variant="gradient" onPress={dialog.toggle}>
        Add new source
      </Button>
      <Dialog
        isOpen={dialog.isOpen}
        onDismiss={dialog.close}
        aria-label="Add new source"
        className="flex flex-col w-full max-w-screen-lg px-32 py-16 mx-auto bg-white rounded shadow-lg"
        style={{ width: '60vw', marginTop: '10vh', marginBottom: '10vh' }}
      >
        <button onClick={dialog.close} className="self-end">
          <span className="sr-only">Close dialog</span>
          <Icon icon={CloseIcon} className="w-8 h-8" />
        </button>
        <section className="flex flex-col space-y-6">
          <h2 className="text-2xl font-medium">Add source</h2>
          <AddSourceForm
            onDismiss={dialog.close}
            onSubmit={onSubmit}
            isLoading={addSource.isLoading}
            buttonLabel="Add"
          />
        </section>
      </Dialog>
    </Fragment>
  )
}

interface AddSourceFormProps {
  initialValues?: Partial<SourceCore>
  onDismiss: () => void
  onSubmit: (source: SourceCore) => void
  isLoading: boolean
  buttonLabel: string
}

/**
 * Add/edit source form.
 */
function AddSourceForm(props: AddSourceFormProps) {
  const { onSubmit, isLoading, buttonLabel, initialValues } = props

  function onValidate(values: Partial<SourceCore>) {
    const errors: Partial<Record<keyof typeof values, any>> = {}

    if (values.label === undefined) {
      errors.label = 'Label is required.'
    }

    if (values.url === undefined) {
      errors.url = 'URL is required.'
    }

    if (values.url !== undefined && !isUrl(values.url)) {
      errors.url = 'Please provide a valid URL.'
    }

    if (values.urlTemplate === undefined) {
      errors.urlTemplate = 'URL Template is required.'
    }

    if (
      values.urlTemplate !== undefined &&
      !values.urlTemplate.includes('{source-item-id}')
    ) {
      errors.urlTemplate =
        'URL Template must include the substring "{source-item-id}".'
    }

    if (values.urlTemplate !== undefined && !isUrl(values.urlTemplate)) {
      errors.urlTemplate = 'Please provide a valid URL.'
    }

    return errors
  }

  return (
    <Form
      onSubmit={onSubmit}
      validate={onValidate}
      initialValues={initialValues}
    >
      {({ handleSubmit, pristine, invalid, submitting }) => {
        return (
          <form
            noValidate
            className="flex flex-col space-y-6"
            onSubmit={handleSubmit}
          >
            <FormTextField
              style={{ flex: 1 }}
              variant="form"
              name="label"
              label="Label"
              isRequired
            />
            <FormTextField
              style={{ flex: 1 }}
              variant="form"
              name="url"
              label="URL"
              isRequired
            />
            <FormTextField
              style={{ flex: 1 }}
              variant="form"
              name="urlTemplate"
              label="URL Template"
              isRequired
            />
            <div className="flex justify-end space-x-12">
              <Button variant="link" onPress={props.onDismiss}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                isDisabled={submitting || isLoading}
              >
                {buttonLabel}
              </Button>
            </div>
          </form>
        )
      }}
    </Form>
  )
}

interface EditSourceButtonProps {
  source: SourceDto
}

/**
 * Edit source.
 */
function EditSourceButton(props: EditSourceButtonProps) {
  const dialog = useDialogState()
  const auth = useAuth()
  const toast = useToast()
  const handleErrors = useErrorHandlers()
  const queryClient = useQueryClient()
  const editSource = useUpdateSource({
    onSuccess() {
      toast.success('Successfully updated source.')
      queryClient.invalidateQueries(['searchItems'])
      queryClient.invalidateQueries(['getSources'])
      queryClient.invalidateQueries(['getSource', { id: props.source.id }])
    },
    onError(error) {
      toast.error('Failed to update source')

      if (error instanceof Error) {
        handleErrors(error)
      }
    },
    onSettled() {
      dialog.close()
    },
  })

  function onSubmit(source: SourceCore) {
    editSource.mutate([
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { id: props.source.id! },
      source,
      { token: auth.session?.accessToken },
    ])
  }

  return (
    <Fragment>
      <Button variant="link" onPress={dialog.toggle}>
        Edit
      </Button>
      <Dialog
        isOpen={dialog.isOpen}
        onDismiss={dialog.close}
        aria-label="Edit source"
        className="flex flex-col w-full max-w-screen-lg px-32 py-16 mx-auto bg-white rounded shadow-lg"
        style={{ width: '60vw', marginTop: '10vh', marginBottom: '10vh' }}
      >
        <button onClick={dialog.close} className="self-end">
          <span className="sr-only">Close dialog</span>
          <Icon icon={CloseIcon} className="w-8 h-8" />
        </button>
        <section className="flex flex-col space-y-6">
          <h2 className="text-2xl font-medium">Edit source</h2>
          <AddSourceForm
            onDismiss={dialog.close}
            onSubmit={onSubmit}
            initialValues={props.source}
            isLoading={editSource.isLoading}
            buttonLabel="Update"
          />
        </section>
      </Dialog>
    </Fragment>
  )
}

interface DeleteSourceButtonProps {
  id: number
}

function DeleteSourceButton(props: DeleteSourceButtonProps) {
  const { id } = props

  const dialog = useDialogState()
  const auth = useAuth()
  const toast = useToast()
  const handleErrors = useErrorHandlers()
  const queryClient = useQueryClient()
  const deleteSource = useDeleteSource({
    onSuccess() {
      toast.success('Successfully deleted source.')
      queryClient.invalidateQueries(['searchItems'])
      queryClient.invalidateQueries(['getSources'])
    },
    onError(error) {
      toast.error('Failed to delete source.')

      if (error instanceof Error) {
        handleErrors(error)
      }
    },
  })

  function onDeleteSource() {
    deleteSource.mutate([{ id }, { token: auth.session?.accessToken }])
    dialog.close()
  }

  return (
    <Fragment>
      <Button variant="link" onPress={dialog.toggle}>
        Delete
      </Button>
      <Dialog
        isOpen={dialog.isOpen}
        onDismiss={dialog.close}
        aria-label="Delete source"
        className="flex flex-col w-full max-w-screen-lg px-32 py-16 mx-auto bg-white rounded shadow-lg"
        style={{
          width: '60vw',
          marginTop: '10vh',
          marginBottom: '10vh',
          maxWidth: 640,
        }}
      >
        <button onClick={dialog.close} className="self-end">
          <span className="sr-only">Close dialog</span>
          <Icon icon={CloseIcon} className="w-8 h-8" />
        </button>
        <section className="flex flex-col space-y-6">
          <h2 className="text-2xl font-medium">Confirmation</h2>
          <p>Are you sure you would like to delete this Source?</p>
          <div className="self-end space-x-8">
            <Button variant="link" onPress={dialog.close}>
              Cancel
            </Button>
            <Button variant="gradient" onPress={onDeleteSource}>
              Delete
            </Button>
          </div>
        </section>
      </Dialog>
    </Fragment>
  )
}
