import { Dialog } from '@reach/dialog'
import cx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
import type { ChangeEvent, FormEvent } from 'react'
import { Fragment, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

import type { ActorCore, ActorDto, SearchActors } from '@/api/sshoc'
import {
  useCreateActor,
  useDeleteActor,
  useSearchActors,
  useUpdateActor,
} from '@/api/sshoc'
import {
  CreateActorForm as AddActorForm,
  sanitizeActorFormValues as sanitizeFormValues,
} from '@/components/item/ActorsFormSection/ActorsFormSection'
import { Button } from '@/elements/Button/Button'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import { Svg as SearchIcon } from '@/elements/icons/small/search.svg'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { useToast } from '@/elements/Toast/useToast'
import { useDialogState } from '@/lib/hooks/useDialogState'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
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
import styles from '@/screens/account/ActorsScreen.module.css'
import { ensureScalar } from '@/utils/ensureScalar'
import usePagination from '@/utils/usePagination'
/**
 * Actors screen.
 */
export default function ActorsScreen(): JSX.Element {
  const router = useRouter()
  // TODO: use useQueryParam
  // const q = useQueryParam('q', false)
  // const page = useQueryParam('page', false, Number)
  // const perPage = clamp(0, useQueryParam('perPage', false, Number), 50)
  // const query = { q, page }
  const query = sanitizeQuery(router.query)

  const auth = useAuth()
  const handleErrors = useErrorHandlers()
  const toast = useToast()

  const actors = useSearchActors(
    query,
    {
      enabled: auth.session?.accessToken != null,
      keepPreviousData: true,
      onError(error) {
        toast.error('Failed to fetch actors.')

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
      <Metadata noindex title="Actors" />
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
                pathname: '/account/actors',
                label: 'Actors',
              },
            ]}
          />
        </Header>
        <ContentColumn className={cx('px-6 py-12 space-y-12', styles.content)}>
          <div className="flex justify-between">
            <Title>
              Actors
              {actors.data != null ? (
                <span className="text-xl font-normal">
                  {' '}
                  ({actors.data.hits})
                </span>
              ) : null}
            </Title>
            <AddActorButton />
          </div>
          {actors.data === undefined ? (
            <ProgressSpinner />
          ) : (
            <Fragment>
              <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <ItemSearch filter={query} />
                <ItemPagination filter={query} results={actors.data} />
              </div>
              {actors.data.actors?.length === 0 ? (
                <div>No actors found.</div>
              ) : (
                <ul className="space-y-2.5">
                  {actors.data.actors?.map((actor) => {
                    return (
                      <li key={actor.id}>
                        <Actor actor={actor} />
                      </li>
                    )
                  })}
                </ul>
              )}
              <div className="flex justify-end">
                <ItemLongPagination filter={query} results={actors.data} />
              </div>
            </Fragment>
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}

interface ActorProps {
  actor: ActorDto
}

function Actor(props: ActorProps) {
  const { actor } = props

  return (
    <div className="p-4 space-y-4 text-xs border border-gray-200 rounded bg-gray-75">
      <div className="flex items-center justify-between">
        <h2 className="space-x-4">
          <span className="text-base font-bold transition text-primary-750">
            {actor.name}
          </span>
          {actor.email != null ? (
            <Anchor href={`mailto:${actor.email}`} className="text-primary-750">
              {actor.email}
            </Anchor>
          ) : null}
        </h2>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          {actor.website != null ? (
            <div className="space-x-1.5">
              <span className="text-gray-550">Website:</span>
              <a
                href={actor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="transition text-primary-750 hover:text-secondary-600"
              >
                <span>{actor.website}</span>
              </a>
            </div>
          ) : null}
          {Array.isArray(actor.affiliations) &&
          actor.affiliations.length > 0 ? (
            <div className="space-x-1.5">
              <span className="text-gray-550">Affiliations:</span>
              <span>
                {actor.affiliations
                  .map((affiliation) => {
                    return affiliation.name
                  })
                  .join(', ')}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex space-x-4 text-sm text-primary-750">
          <ProtectedView roles={['administrator']}>
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <DeleteActorButton id={actor.id!} />
          </ProtectedView>
          <EditActorButton actor={actor} />
        </div>
      </div>
    </div>
  )
}

interface ItemSearchProps {
  filter: SearchActors.QueryParameters
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
  filter: SearchActors.QueryParameters
  results?: SearchActors.Response.Success
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
  filter: SearchActors.QueryParameters
  results?: SearchActors.Response.Success
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
  filter: SearchActors.QueryParameters
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
  filter: SearchActors.QueryParameters
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

function sanitizeQuery(params?: ParsedUrlQuery): SearchActors.QueryParameters {
  if (params === undefined) return {}

  const sanitized = []

  if (params.q != null && params.q.length > 0) {
    const q = ensureScalar(params.q)
    sanitized.push(['q', q])
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
 * Add actor.
 */
function AddActorButton() {
  const dialog = useDialogState()
  const auth = useAuth()
  const toast = useToast()
  const handleErrors = useErrorHandlers()
  const queryClient = useQueryClient()
  const addActor = useCreateActor({
    onSuccess() {
      toast.success('Successfully added actor.')
      queryClient.invalidateQueries(['getActors'])
    },
    onError(error) {
      toast.error('Failed to add actor')

      if (error instanceof Error) {
        handleErrors(error)
      }
    },
    onSettled() {
      dialog.close()
    },
  })

  function onSubmit(actor: ActorCore) {
    addActor.mutate([
      sanitizeFormValues(actor),
      { token: auth.session?.accessToken },
    ])
  }

  return (
    <Fragment>
      <Button variant="gradient" onPress={dialog.toggle}>
        Add new actor
      </Button>
      <Dialog
        isOpen={dialog.isOpen}
        onDismiss={dialog.close}
        aria-label="Add new actor"
        className="flex flex-col w-full max-w-screen-lg px-32 py-16 mx-auto bg-white rounded shadow-lg"
        style={{ width: '60vw', marginTop: '10vh', marginBottom: '10vh' }}
      >
        <button onClick={dialog.close} className="self-end">
          <span className="sr-only">Close dialog</span>
          <Icon icon={CloseIcon} className="w-8 h-8" />
        </button>
        <section className="flex flex-col space-y-6">
          <h2 className="text-2xl font-medium">Add actor</h2>
          <AddActorForm
            onDismiss={dialog.close}
            onSubmit={onSubmit}
            isLoading={addActor.isLoading}
            buttonLabel="Add"
          />
        </section>
      </Dialog>
    </Fragment>
  )
}

interface EditActorButtonProps {
  actor: ActorDto
}

/**
 * Edit actor.
 */
function EditActorButton(props: EditActorButtonProps) {
  const dialog = useDialogState()
  const auth = useAuth()
  const toast = useToast()
  const handleErrors = useErrorHandlers()
  const queryClient = useQueryClient()
  const editActor = useUpdateActor({
    onSuccess() {
      toast.success('Successfully updated actor.')
      queryClient.invalidateQueries(['searchItems'])
      queryClient.invalidateQueries(['getActors'])
      queryClient.invalidateQueries(['getActor', { id: props.actor.id }])
    },
    onError(error) {
      toast.error('Failed to update actor')

      if (error instanceof Error) {
        handleErrors(error)
      }
    },
    onSettled() {
      dialog.close()
    },
  })

  function onSubmit(actor: ActorCore) {
    editActor.mutate([
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { id: props.actor.id! },
      sanitizeFormValues(actor),
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
        aria-label="Edit actor"
        className="flex flex-col w-full max-w-screen-lg px-32 py-16 mx-auto bg-white rounded shadow-lg"
        style={{ width: '60vw', marginTop: '10vh', marginBottom: '10vh' }}
      >
        <button onClick={dialog.close} className="self-end">
          <span className="sr-only">Close dialog</span>
          <Icon icon={CloseIcon} className="w-8 h-8" />
        </button>
        <section className="flex flex-col space-y-6">
          <h2 className="text-2xl font-medium">Edit actor</h2>
          <AddActorForm
            onDismiss={dialog.close}
            onSubmit={onSubmit}
            initialValues={convertToFormValues(props.actor)}
            isLoading={editActor.isLoading}
            buttonLabel="Update"
          />
        </section>
      </Dialog>
    </Fragment>
  )
}

interface DeleteActorButton {
  id: number
}

function DeleteActorButton(props: DeleteActorButton) {
  const { id } = props

  const dialog = useDialogState()
  const auth = useAuth()
  const toast = useToast()
  const handleErrors = useErrorHandlers()
  const queryClient = useQueryClient()
  const deleteActor = useDeleteActor({
    onSuccess() {
      toast.success('Successfully deleted actor.')
      queryClient.invalidateQueries(['searchItems'])
      queryClient.invalidateQueries(['getActors'])
    },
    onError(error) {
      toast.error('Failed to delete actor.')

      if (error instanceof Error) {
        handleErrors(error)
      }
    },
  })

  function onDeleteActor() {
    deleteActor.mutate([{ id }, { token: auth.session?.accessToken }])
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
        aria-label="Delete actor"
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
          <p>Are you sure you would like to delete this Actor?</p>
          <div className="self-end space-x-8">
            <Button variant="link" onPress={dialog.close}>
              Cancel
            </Button>
            <Button variant="gradient" onPress={onDeleteActor}>
              Delete
            </Button>
          </div>
        </section>
      </Dialog>
    </Fragment>
  )
}

function convertToFormValues(actor: ActorDto): ActorCore {
  return {
    name: actor.name!,
    email: actor.email,
    website: actor.website,
    affiliations: actor.affiliations?.map(({ id }) => ({ id })),
    externalIds: actor.externalIds?.map((externalId) => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        identifier: externalId.identifier!,
        identifierService: { code: externalId.identifierService?.code },
      }
    }),
  }
}
