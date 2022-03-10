import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from 'react-query'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query'

import type {
  CreateActor,
  CreateActorRole,
  CreateActorSource,
  DeleteActor,
  DeleteActorRole,
  DeleteActorSource,
  GetActor,
  GetActorHistory,
  GetActorRole,
  GetActorRoles,
  GetActors,
  GetActorSource,
  GetActorSources,
  MergeActors,
  SearchActors,
  UpdateActor,
  UpdateActorRole,
  UpdateActorSource,
} from '@/data/sshoc/api/actor'
import {
  createActor,
  createActorRole,
  createActorSource,
  deleteActor,
  deleteActorRole,
  deleteActorSource,
  getActor,
  getActorHistory,
  getActorRole,
  getActorRoles,
  getActors,
  getActorSource,
  getActorSources,
  mergeActors,
  searchActors,
  updateActor,
  updateActorRole,
  updateActorSource,
} from '@/data/sshoc/api/actor'
import type { AuthData } from '@/data/sshoc/api/common'
import { useSession } from '@/data/sshoc/lib/useSession'

/** scope */
const actor = 'actor'
const source = 'actor-source'
const role = 'actor-role'
/** kind */
const list = 'list'
const detail = 'detail'
const history = 'history'
const search = 'search'
const infinite = 'infinite'

export const keys = {
  all(auth?: AuthData | undefined) {
    return [actor, auth ?? null] as const
  },
  lists(auth?: AuthData | undefined) {
    return [actor, list, auth ?? null] as const
  },
  list(params: GetActors.Params, auth?: AuthData | undefined) {
    return [actor, list, params, auth ?? null] as const
  },
  listInfinite(params: GetActors.Params, auth?: AuthData | undefined) {
    return [actor, list, infinite, params, auth ?? null] as const
  },
  details(auth?: AuthData | undefined) {
    return [actor, detail, auth ?? null] as const
  },
  detail(params: GetActor.Params, auth?: AuthData | undefined) {
    return [actor, detail, params, auth ?? null] as const
  },
  history(params: GetActorHistory.Params, auth?: AuthData | undefined) {
    return [actor, history, params, auth ?? null] as const
  },
  search(params: SearchActors.Params = {}, auth?: AuthData | undefined) {
    return [actor, search, params, auth ?? null] as const
  },
  searchInfinite(params: SearchActors.Params, auth?: AuthData | undefined) {
    return [actor, search, infinite, params, auth ?? null] as const
  },
  source: {
    all(auth?: AuthData | undefined) {
      return [source, auth ?? null] as const
    },
    lists(auth?: AuthData | undefined) {
      return [source, list, auth ?? null] as const
    },
    list(auth?: AuthData | undefined) {
      return [source, list, auth ?? null] as const
    },
    details(auth?: AuthData | undefined) {
      return [source, detail, auth ?? null] as const
    },
    detail(params: GetActorSource.Params, auth?: AuthData | undefined) {
      return [source, detail, params, auth ?? null] as const
    },
  },
  role: {
    all(auth?: AuthData | undefined) {
      return [role, auth ?? null] as const
    },
    lists(auth?: AuthData | undefined) {
      return [role, list, auth ?? null] as const
    },
    list(auth?: AuthData | undefined) {
      return [role, list, auth ?? null] as const
    },
    details(auth?: AuthData | undefined) {
      return [role, detail, auth ?? null] as const
    },
    detail(params: GetActorRole.Params, auth?: AuthData | undefined) {
      return [role, detail, params, auth ?? null] as const
    },
  },
}

export function useActors<TData = GetActors.Response>(
  params: GetActors.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<GetActors.Response, Error, TData, ReturnType<typeof keys.list>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.list(params, session),
    ({ signal }) => {
      return getActors(params, session, { signal })
    },
    { keepPreviousData: true, ...options },
  )
}

export function useActorsInfinite<TData = GetActors.Response>(
  params: GetActors.Params,
  auth?: AuthData | undefined,
  options?: UseInfiniteQueryOptions<
    GetActors.Response,
    Error,
    TData,
    GetActors.Response,
    ReturnType<typeof keys.listInfinite>
  >,
) {
  const session = useSession(auth)
  return useInfiniteQuery(
    keys.listInfinite(params, session),
    ({ signal, pageParam = params.page }) => {
      return getActors({ ...params, page: pageParam }, session, { signal })
    },
    {
      keepPreviousData: true,
      ...options,
      getNextPageParam(lastPage, _allPages) {
        if (lastPage.page < lastPage.pages) return lastPage.page + 1
        return undefined
      },
    },
  )
}

export function useActor<TData = GetActor.Response>(
  params: GetActor.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<GetActor.Response, Error, TData, ReturnType<typeof keys.detail>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.detail(params, session),
    ({ signal }) => {
      return getActor(params, session, { signal })
    },
    options,
  )
}

export function useCreateActor(
  auth?: AuthData | undefined,
  options?: UseMutationOptions<CreateActor.Response, Error, { data: CreateActor.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: CreateActor.Body }) => {
      return createActor(data, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.search())
        queryClient.invalidateQueries(keys.lists())
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useUpdateActor(
  params: UpdateActor.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<UpdateActor.Response, Error, { data: UpdateActor.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: UpdateActor.Body }) => {
      return updateActor(params, data, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ id: params.id }))
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useDeleteActor(
  params: DeleteActor.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<DeleteActor.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deleteActor(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ id: params.id }))
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useMergeActors(
  params: MergeActors.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<MergeActors.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return mergeActors(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ id: params.id }))
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useActorHistory<TData = GetActorHistory.Response>(
  params: GetActorHistory.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetActorHistory.Response,
    Error,
    TData,
    ReturnType<typeof keys.history>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.history(params, session),
    ({ signal }) => {
      return getActorHistory(params, session, { signal })
    },
    options,
  )
}

export function useActorSearch<TData = SearchActors.Response>(
  params: SearchActors.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<SearchActors.Response, Error, TData, ReturnType<typeof keys.search>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.search(params, session),
    ({ signal }) => {
      return searchActors(params, session, { signal })
    },
    { keepPreviousData: true, ...options },
  )
}

export function useActorSearchInfinite<TData = SearchActors.Response>(
  params: SearchActors.Params,
  auth?: AuthData | undefined,
  options?: UseInfiniteQueryOptions<
    SearchActors.Response,
    Error,
    TData,
    SearchActors.Response,
    ReturnType<typeof keys.searchInfinite>
  >,
) {
  const session = useSession(auth)
  return useInfiniteQuery(
    keys.searchInfinite(params, session),
    ({ signal, pageParam = params.page }) => {
      return searchActors({ ...params, page: pageParam }, session, { signal })
    },
    {
      keepPreviousData: true,
      ...options,
      getNextPageParam(lastPage, _allPages) {
        if (lastPage.page < lastPage.pages) return lastPage.page + 1
        return undefined
      },
    },
  )
}

export function useActorSources<TData = GetActorSources.Response>(
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetActorSources.Response,
    Error,
    TData,
    ReturnType<typeof keys.source.list>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.source.list(session),
    ({ signal }) => {
      return getActorSources(session, { signal })
    },
    options,
  )
}

export function useActorSource<TData = GetActorSource.Response>(
  params: GetActorSource.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetActorSource.Response,
    Error,
    TData,
    ReturnType<typeof keys.source.detail>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.source.detail(params, session),
    ({ signal }) => {
      return getActorSource(params, session, { signal })
    },
    options,
  )
}

export function useCreateActorSource(
  auth?: AuthData | undefined,
  options?: UseMutationOptions<CreateActorSource.Response, Error, { data: CreateActorSource.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: CreateActorSource.Body }) => {
      return createActorSource(data, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.source.lists())
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useUpdateActorSource(
  params: UpdateActorSource.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<UpdateActorSource.Response, Error, { data: UpdateActorSource.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: UpdateActorSource.Body }) => {
      return updateActorSource(params, data, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.source.lists())
        queryClient.invalidateQueries(keys.source.detail({ code: params.code }))
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useDeleteActorSource(
  params: DeleteActorSource.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<DeleteActorSource.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deleteActorSource(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.source.lists())
        queryClient.invalidateQueries(keys.source.detail({ code: params.code }))
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useActorRoles<TData = GetActorRoles.Response>(
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetActorRoles.Response,
    Error,
    TData,
    ReturnType<typeof keys.role.list>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.role.list(session),
    ({ signal }) => {
      return getActorRoles(session, { signal })
    },
    options,
  )
}

export function useActorRole<TData = GetActorRole.Response>(
  params: GetActorRole.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetActorRole.Response,
    Error,
    TData,
    ReturnType<typeof keys.role.detail>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.role.detail(params, session),
    ({ signal }) => {
      return getActorRole(params, session, { signal })
    },
    options,
  )
}

export function useCreateActorRole(
  auth?: AuthData | undefined,
  options?: UseMutationOptions<CreateActorRole.Response, Error, { data: CreateActorRole.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: CreateActorRole.Body }) => {
      return createActorRole(data, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.role.lists())
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useUpdateActorRole(
  params: UpdateActorRole.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<UpdateActorRole.Response, Error, { data: UpdateActorRole.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: UpdateActorRole.Body }) => {
      return updateActorRole(params, data, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.role.lists())
        queryClient.invalidateQueries(keys.role.detail({ code: params.code }))
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useDeleteActorRole(
  params: DeleteActorRole.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<DeleteActorRole.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deleteActorRole(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.role.lists())
        queryClient.invalidateQueries(keys.role.detail({ code: params.code }))
        options?.onSuccess?.(...args)
      },
    },
  )
}
