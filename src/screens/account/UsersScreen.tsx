import { Dialog } from '@reach/dialog'
import cx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
import type { ChangeEvent, FormEvent, Key } from 'react'
import { Fragment, useEffect, useState } from 'react'
import { QueryClientProvider, useQueryClient } from 'react-query'

import type { GetUsers, UserDto } from '@/api/sshoc'
import {
  useGetUsers,
  useUpdateUserRole,
  useUpdateUserStatus,
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
import { ensureArray } from '@/utils/ensureArray'
import { ensureScalar } from '@/utils/ensureScalar'
import usePagination from '@/utils/usePagination'

const itemSortOrders = ['label', 'modified-on'] as const
type ItemSortOrder = typeof itemSortOrders[number]
const defaultItemSortOrder: ItemSortOrder = 'modified-on'

/**
 * Users screen.
 */
export default function UsersScreen(): JSX.Element {
  const router = useRouter()
  // TODO: use useQueryParam
  // const q = useQueryParam('q', false)
  // const order = useQueryParam('order', true)?.filter((sortOrder) =>
  //   itemSortOrders.includes(sortOrder as ItemSortOrder),
  // )
  // const page = useQueryParam('page', false, Number)
  // const perPage = clamp(0, useQueryParam('perPage', false, Number), 50)
  // const query = { q, page }
  // FIXME: mockups allow sorting, but api does not
  const query = sanitizeQuery(router.query)

  const auth = useAuth()
  const handleErrors = useErrorHandlers()
  const toast = useToast()

  const users = useGetUsers(
    query,
    {
      enabled: auth.session?.accessToken != null,
      keepPreviousData: true,
      onError(error) {
        toast.error('Failed to fetch users.')

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
      <Metadata noindex title="Users" />
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
                pathname: '/account/users',
                label: 'Users',
              },
            ]}
          />
        </Header>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>
            Users
            {users.data != null ? (
              <span className="text-xl font-normal"> ({users.data.hits})</span>
            ) : null}
          </Title>
          {users.data === undefined ? (
            <ProgressSpinner />
          ) : (
            <Fragment>
              <div className="flex items-center justify-between">
                <div className="space-x-8">
                  {/* <ItemSortOrder filter={query} /> */}
                  <ItemSearch filter={query} />
                </div>
                <ItemPagination filter={query} results={users.data} />
              </div>
              {users.data.users?.length === 0 ? (
                <div>No users found.</div>
              ) : (
                <ul className="space-y-2.5">
                  {users.data.users?.map((user) => {
                    return (
                      <li key={user.id}>
                        <User user={user} />
                      </li>
                    )
                  })}
                </ul>
              )}
              <div className="flex justify-end">
                <ItemLongPagination filter={query} results={users.data} />
              </div>
            </Fragment>
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}

interface UserProps {
  user: UserDto
}

function User(props: UserProps) {
  const { user } = props

  return (
    <div className="p-4 space-y-4 text-xs border border-gray-200 rounded bg-gray-75">
      <div className="flex items-center justify-between">
        <h2 className="space-x-1.5">
          <span className="text-gray-550">Username:</span>
          <span className="text-base font-bold transition text-primary-750">
            {user.username}
          </span>
        </h2>
        <div className="space-x-1.5">
          <span className="text-gray-550">Registration date:</span>
          <FormattedDate isoDate={user.registrationDate} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="space-x-1.5">
            <span className="text-gray-550">Display name:</span>
            <span>{user.displayName}</span>
          </div>
          <div className="space-x-1.5">
            <span className="text-gray-550">Email:</span>
            <Anchor href={`mailto:${user.email}`}>
              <span>{user.email}</span>
            </Anchor>
          </div>
        </div>
        <div className="flex space-x-4 text-sm text-primary-750">
          <ProtectedView roles={['administrator']}>
            <UserRoleSelect user={user} />
            <UserStatusSelect user={user} />
            {/* FIXME: Needs endpoint */}
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {/* <DeleteUsereButton id={user.id!} /> */}
            {/* <EditUserButton user={user} /> */}
          </ProtectedView>
        </div>
      </div>
    </div>
  )
}

interface FormattedDateProps {
  isoDate: string | undefined
}

function FormattedDate({ isoDate }: FormattedDateProps) {
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
  filter: GetUsers.QueryParameters
}

/**
 * Sort order.
 */
// function ItemSortOrder(props: ItemSortOrderProps) {
//   const { filter } = props

//   const router = useRouter()

//   const currentSortOrder =
//     filter.order === undefined
//       ? defaultItemSortOrder
//       : (filter.order[0] as ItemSortOrder)

//   function onSubmit(order: Key) {
//     const query = { ...filter }
//     if (order === defaultItemSortOrder) {
//       delete query.order
//     } else {
//       query.order = [order as ItemSortOrder]
//     }
//     router.push({ query })
//   }

//   /** we don't get labels for sort order from the backend */
//   const labels: Record<ItemSortOrder, string> = {
//     label: 'name',
//     'modified-on': 'last modification',
//   }

//   const items = itemSortOrders.map((id) => ({ id, label: labels[id] }))

//   return (
//     <Select
//       aria-label="Sort order"
//       items={items}
//       onSelectionChange={onSubmit}
//       selectedKey={currentSortOrder}
//     >
//       {(item) => (
//         <Select.Item key={item.id} textValue={item.label}>
//           Sort by {item.label}
//         </Select.Item>
//       )}
//     </Select>
//   )
// }

interface ItemSearchProps {
  filter: GetUsers.QueryParameters
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
  filter: GetUsers.QueryParameters
  results?: GetUsers.Response.Success
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
  filter: GetUsers.QueryParameters
  results?: GetUsers.Response.Success
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
  filter: GetUsers.QueryParameters
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
  filter: GetUsers.QueryParameters
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

function sanitizeQuery(params?: ParsedUrlQuery): GetUsers.QueryParameters {
  if (params === undefined) return {}

  const sanitized = []

  if (params.q != null && params.q.length > 0) {
    sanitized.push(['q', params.q])
  }

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

type AllowedUserStatus = Exclude<UserDto['status'], undefined>

interface UserStatusSelectProps {
  user: UserDto
}

/**
 * Set user status.
 */
function UserStatusSelect(props: UserStatusSelectProps) {
  const { user } = props

  const toast = useToast()
  const auth = useAuth()
  const handleErrors = useErrorHandlers()
  const queryClient = useQueryClient()
  const updateUserStatus = useUpdateUserStatus({
    onSuccess() {
      toast.success('Successfully changed user status')
      queryClient.invalidateQueries(['getUsers'])
      queryClient.invalidateQueries(['getUser', { id: user.id }])
    },
    onError(error) {
      toast.error('Failed to update user status')

      if (error instanceof Error) {
        handleErrors(error)
      }
    },
  })

  const allowedStatus: Array<AllowedUserStatus> = [
    'enabled',
    'locked',
    'during-registration',
  ]
  const labeledAllowedStatus = allowedStatus.map((id) => ({
    id,
    label: id.split('-').map(capitalize).join(' '),
  }))

  function onSubmit(status: Key) {
    updateUserStatus.mutate([
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: user.id!,
        userStatus: status as AllowedUserStatus,
      },
      { token: auth.session?.accessToken },
    ])
  }

  return (
    <label className="space-x-1.5 flex items-center">
      <span className="text-xs text-gray-550">Status:</span>
      <Select
        aria-label="User status"
        items={labeledAllowedStatus}
        onSelectionChange={onSubmit}
        selectedKey={user.status}
        size="small"
      >
        {(item) => <Select.Item>{item.label}</Select.Item>}
      </Select>
    </label>
  )
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

type AllowedUserRole = Exclude<UserDto['role'], undefined>

interface UserRoleSelectProps {
  user: UserDto
}

/**
 * Set user status.
 */
function UserRoleSelect(props: UserRoleSelectProps) {
  const { user } = props

  const toast = useToast()
  const auth = useAuth()
  const handleErrors = useErrorHandlers()
  const queryClient = useQueryClient()
  const updateUserRole = useUpdateUserRole({
    onSuccess() {
      toast.success('Successfully changed user role')
      queryClient.invalidateQueries(['getUsers'])
      queryClient.invalidateQueries(['getUser', { id: user.id }])
    },
    onError(error) {
      toast.error('Failed to update user role')

      if (error instanceof Error) {
        handleErrors(error)
      }
    },
  })

  const allowedRoles: Array<AllowedUserRole> = [
    'contributor',
    'system-contributor',
    'moderator',
    'system-moderator',
    'administrator',
  ]
  const labeledAllowedRoles = allowedRoles.map((id) => ({
    id,
    label: id.split('-').map(capitalize).join(' '),
  }))

  function onSubmit(role: Key) {
    updateUserRole.mutate([
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: user.id!,
        userRole: role as AllowedUserRole,
      },
      { token: auth.session?.accessToken },
    ])
  }

  return (
    <label className="space-x-1.5 flex items-center">
      <span className="text-xs text-gray-550">Role:</span>
      <Select
        aria-label="User role"
        items={labeledAllowedRoles}
        onSelectionChange={onSubmit}
        selectedKey={user.role}
        size="small"
      >
        {(item) => <Select.Item>{item.label}</Select.Item>}
      </Select>
    </label>
  )
}
