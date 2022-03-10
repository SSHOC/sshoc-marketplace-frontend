import type { FormEvent, Key } from 'react'
import { Fragment } from 'react'

// import { useQueryClient } from 'react-query'
import { MetadataLabel } from '@/components/common/MetadataLabel'
import { MetadataValue } from '@/components/common/MetadataValue'
import { SearchResult } from '@/components/common/SearchResult'
import { SearchResultContent } from '@/components/common/SearchResultContent'
import { SearchResultControls } from '@/components/common/SearchResultControls'
import { SearchResultMeta } from '@/components/common/SearchResultMeta'
import { SearchResultTitle } from '@/components/common/SearchResultTitle'
import { Timestamp } from '@/components/common/Timestamp'
// import { useUserSearchFilters } from '@/components/account/useUserSearchFilters'
import type {
  GetUsers,
  UpdateUserRole,
  UpdateUserStatus,
  User,
  UserRole,
  UserStatus,
} from '@/data/sshoc/api/user'
import { userRoles, userStatus } from '@/data/sshoc/api/user'
import {
  // keys as userQueryKeys,
  useUpdateUserRole,
  useUpdateUserStatus,
} from '@/data/sshoc/hooks/user'
import { PASSED_IN_VIA_MUTATION_FUNCTION } from '@/data/sshoc/lib/const'
// import { useQueryKeys } from '@/data/sshoc/lib/useQueryKeys'
import { useI18n } from '@/lib/core/i18n/useI18n'
import type { MutationMetadata } from '@/lib/core/query/types'
import { Item } from '@/lib/core/ui/Collection/Item'
import { Select } from '@/lib/core/ui/Select/Select'

export interface UserSearchResultProps {
  user: GetUsers.Response['users'][number]
}

export function UserSearchResult(props: UserSearchResultProps): JSX.Element {
  const { user } = props

  const { t } = useI18n<'authenticated' | 'common'>()

  return (
    <Fragment>
      <SearchResult>
        <SearchResultTitle>{user.displayName}</SearchResultTitle>
        <SearchResultMeta>
          <MetadataValue size="sm">
            <MetadataLabel size="sm">
              {t(['authenticated', 'users', 'registration-date'])}:
            </MetadataLabel>
            <Timestamp dateTime={user.registrationDate} />
          </MetadataValue>
        </SearchResultMeta>
        <SearchResultContent>
          <MetadataValue>
            <MetadataLabel>{t(['authenticated', 'users', 'email'])}:</MetadataLabel>
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </MetadataValue>
        </SearchResultContent>
        <SearchResultControls>
          <UserRoleSelect user={user} />
          <UserStatusSelect user={user} />
        </SearchResultControls>
      </SearchResult>
    </Fragment>
  )
}

interface UserRoleSelectProps {
  user: User
}

function UserRoleSelect(props: UserRoleSelectProps): JSX.Element {
  const { user } = props

  const { t } = useI18n<'authenticated' | 'common'>()
  const userRoleIds = userRoles.map((role) => {
    return { id: role, label: role }
  })

  // const queryClient = useQueryClient()
  // const filters = useUserSearchFilters()
  // const queryKeys = useQueryKeys(userQueryKeys)
  const meta: MutationMetadata<UpdateUserRole.Response, Error> = {
    messages: {
      mutate() {
        return t(['authenticated', 'users', 'update-user-role-pending'])
      },
      success() {
        return t(['authenticated', 'users', 'update-user-role-success'])
      },
      error() {
        return t(['authenticated', 'users', 'update-user-role-error'])
      },
    },
  }
  const updateUserRole = useUpdateUserRole(
    { id: user.id, role: PASSED_IN_VIA_MUTATION_FUNCTION },
    undefined,
    {
      meta,
      /** TODO: Optimistic update. */
      // onMutate(variables) {
      //   queryClient.cancelQueries(queryKeys.list(filters))
      //   const current = queryClient.getQueryData(queryKeys.list(filters))
      //   queryClient.setQueriesData(queryKeys.list(filters), (data) => {
      //     return {
      //       ...data,
      //       users: data.users.map((u) => {
      //         if (u.id === user.id) return { ...u, role: variables.role }
      //         return u
      //       }),
      //     }
      //   })
      //   const context = { current }
      //   return context
      // },
      // onError(error, variables, context) {
      //   if (context != null && context.current != null) {
      //     queryClient.setQueriesData(queryKeys.list(filters), context.current)
      //   }
      // },
      // onSettled() {
      //   queryClient.invalidateQueries(queryKeys.list(filters))
      // },
    },
  )

  function onUpdateUserRole(role: Key) {
    updateUserRole.mutate({ role: role as UserRole })
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form name={`user-role-${user.id}`} noValidate onSubmit={onSubmit}>
      <Select
        items={userRoleIds}
        isDisabled={updateUserRole.isLoading}
        loadingState={updateUserRole.isLoading ? 'loading' : undefined}
        label={t(['authenticated', 'users', 'role'])}
        onSelectionChange={onUpdateUserRole}
        selectedKey={user.role}
        size="sm"
      >
        {(item) => {
          return <Item>{item.label}</Item>
        }}
      </Select>
    </form>
  )
}

interface UserStatusSelectProps {
  user: User
}

function UserStatusSelect(props: UserStatusSelectProps): JSX.Element {
  const { user } = props

  const { t } = useI18n<'authenticated' | 'common'>()
  const items = userStatus.map((status) => {
    return { id: status, label: status }
  })

  // const queryClient = useQueryClient()
  // const filters = useUserSearchFilters()
  // const queryKeys = useQueryKeys(userQueryKeys)
  const meta: MutationMetadata<UpdateUserStatus.Response, Error> = {
    messages: {
      mutate() {
        return t(['authenticated', 'users', 'update-user-status-pending'])
      },
      success() {
        return t(['authenticated', 'users', 'update-user-status-success'])
      },
      error() {
        return t(['authenticated', 'users', 'update-user-status-error'])
      },
    },
  }
  const updateUserStatus = useUpdateUserStatus(
    { id: user.id, status: PASSED_IN_VIA_MUTATION_FUNCTION },
    undefined,
    {
      meta,
      /** TODO: Optimistic update. */
      // onMutate(variables) {
      //   queryClient.cancelQueries(queryKeys.list(filters))
      //   const current = queryClient.getQueryData(queryKeys.list(filters))
      //   queryClient.setQueriesData(queryKeys.list(filters), (data) => {
      //     return {
      //       ...data,
      //       users: data.users.map((u) => {
      //         if (u.id === user.id) return { ...u, status: variables.status }
      //         return u
      //       }),
      //     }
      //   })
      //   const context = { current }
      //   return context
      // },
      // onError(error, variables, context) {
      //   if (context != null && context.current != null) {
      //     queryClient.setQueriesData(queryKeys.list(filters), context.current)
      //   }
      // },
      // onSettled() {
      //   queryClient.invalidateQueries(queryKeys.list(filters))
      // },
    },
  )

  function onUpdateUserStatus(status: Key) {
    updateUserStatus.mutate({ status: status as UserStatus })
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form name={`user-status-${user.id}`} noValidate onSubmit={onSubmit}>
      <Select
        items={items}
        isDisabled={updateUserStatus.isLoading}
        loadingState={updateUserStatus.isLoading ? 'loading' : undefined}
        label={t(['authenticated', 'users', 'status'])}
        onSelectionChange={onUpdateUserStatus}
        selectedKey={user.status}
        size="sm"
      >
        {(item) => {
          return <Item>{item.label}</Item>
        }}
      </Select>
    </form>
  )
}
