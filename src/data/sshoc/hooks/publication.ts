import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from 'react-query'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query'

import type { AuthData } from '@/data/sshoc/api/common'
import type {
  CommitDraftPublication,
  CreatePublication,
  DeletePublication,
  DeletePublicationVersion,
  GetMergedPublication,
  GetPublication,
  GetPublicationDiff,
  GetPublicationHistory,
  GetPublicationInformationContributors,
  GetPublications,
  GetPublicationSources,
  GetPublicationVersion,
  GetPublicationVersionDiff,
  GetPublicationVersionInformationContributors,
  MergePublications,
  RevertPublicationToVersion,
  UpdatePublication,
} from '@/data/sshoc/api/publication'
import {
  commitDraftPublication,
  createPublication,
  deletePublication,
  deletePublicationVersion,
  getMergedPublication,
  getPublication,
  getPublicationDiff,
  getPublicationHistory,
  getPublicationInformationContributors,
  getPublications,
  getPublicationSources,
  getPublicationVersion,
  getPublicationVersionDiff,
  getPublicationVersionInformationContributors,
  mergePublications,
  revertPublicationToVersion,
  updatePublication,
} from '@/data/sshoc/api/publication'
import { keys as itemKeys } from '@/data/sshoc/hooks/item'
import { useSession } from '@/data/sshoc/lib/useSession'
import { revalidate } from '@/lib/core/app/revalidate'
import { itemRoutes } from '@/lib/core/navigation/item-routes'

// TODO: This needs some hierarchy, to be able to effectively use React Query's
// query invalidation with partial query key matching.
/** scope */
const publication = 'publication'
/** kind */
const list = 'list'
const detail = 'detail'
const infinite = 'infinite'
const version = 'version'
const history = 'history'
const informationContributors = 'informationContributors'
const versionInformationContributors = 'versionInformationContributors'
const merged = 'merged'
const sources = 'sources'
const diff = 'diff'

export const keys = {
  all(auth?: AuthData  ) {
    return [publication, auth ?? null] as const
  },
  lists(auth?: AuthData  ) {
    return [publication, list, auth ?? null] as const
  },
  list(params: GetPublications.Params, auth?: AuthData  ) {
    return [publication, list, params, auth ?? null] as const
  },
  listInfinite(params: GetPublications.Params, auth?: AuthData  ) {
    return [publication, list, infinite, params, auth ?? null] as const
  },
  details(auth?: AuthData  ) {
    return [publication, detail, auth ?? null] as const
  },
  detail(params: GetPublication.Params, auth?: AuthData  ) {
    return [publication, detail, params, auth ?? null] as const
  },
  // versions(auth?: AuthData | undefined) {
  //   return [publication, version, auth ?? null] as const
  // },
  version(params: GetPublicationVersion.Params, auth?: AuthData  ) {
    return [publication, version, params, auth ?? null] as const
  },
  // histories(auth?: AuthData | undefined) {
  //   return [publication, history, auth ?? null] as const
  // },
  history(params: GetPublicationHistory.Params, auth?: AuthData  ) {
    return [publication, history, params, auth ?? null] as const
  },
  // informationContributors(auth?: AuthData | undefined) {
  //   return [publication, informationContributors, auth ?? null] as const
  // },
  informationContributors(
    params: GetPublicationInformationContributors.Params,
    auth?: AuthData  ,
  ) {
    return [publication, informationContributors, params, auth ?? null] as const
  },
  // versionInformationContributors(auth?: AuthData | undefined) {
  //   return [publication, versionInformationContributors, auth ?? null] as const
  // },
  versionInformationContributors(
    params: GetPublicationVersionInformationContributors.Params,
    auth?: AuthData  ,
  ) {
    return [publication, versionInformationContributors, params, auth ?? null] as const
  },
  merged(params: GetMergedPublication.Params, auth?: AuthData  ) {
    return [publication, merged, params, auth ?? null] as const
  },
  sources(params: GetPublicationSources.Params, auth?: AuthData  ) {
    return [publication, sources, params, auth ?? null] as const
  },
  diff(params: GetPublicationDiff.Params, auth?: AuthData  ) {
    return [publication, diff, params, auth ?? null] as const
  },
  diffVersion(params: GetPublicationVersionDiff.Params, auth?: AuthData  ) {
    return [publication, version, diff, params, auth ?? null] as const
  },
}

export function usePublications<TData = GetPublications.Response>(
  params: GetPublications.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<GetPublications.Response, Error, TData, ReturnType<typeof keys.list>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.list(params, session),
    ({ signal }) => {
      return getPublications(params, session, { signal })
    },
    { keepPreviousData: true, ...options },
  )
}

export function usePublicationsInfinite<TData = GetPublications.Response>(
  params: GetPublications.Params,
  auth?: AuthData  ,
  options?: UseInfiniteQueryOptions<
    GetPublications.Response,
    Error,
    TData,
    GetPublications.Response,
    ReturnType<typeof keys.listInfinite>
  >,
) {
  const session = useSession(auth)
  return useInfiniteQuery(
    keys.listInfinite(params, session),
    ({ signal, pageParam = params.page }) => {
      return getPublications({ ...params, page: pageParam }, session, { signal })
    },
    {
      keepPreviousData: true,
      ...options,
      getNextPageParam(lastPage, _allPages) {
        if (lastPage.page < lastPage.pages) {return lastPage.page + 1}
        return undefined
      },
    },
  )
}

export function usePublication<TData = GetPublication.Response>(
  params: GetPublication.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<GetPublication.Response, Error, TData, ReturnType<typeof keys.detail>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.detail(params, session),
    ({ signal }) => {
      return getPublication(params, session, { signal })
    },
    options,
  )
}

export function usePublicationVersion<TData = GetPublicationVersion.Response>(
  params: GetPublicationVersion.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetPublicationVersion.Response,
    Error,
    TData,
    ReturnType<typeof keys.version>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.version(params, session),
    ({ signal }) => {
      return getPublicationVersion(params, session, { signal })
    },
    options,
  )
}

export function usePublicationHistory<TData = GetPublicationHistory.Response>(
  params: GetPublicationHistory.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetPublicationHistory.Response,
    Error,
    TData,
    ReturnType<typeof keys.history>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.history(params, session),
    ({ signal }) => {
      return getPublicationHistory(params, session, { signal })
    },
    options,
  )
}

export function usePublicationInformationContributors<
  TData = GetPublicationInformationContributors.Response,
>(
  params: GetPublicationInformationContributors.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetPublicationInformationContributors.Response,
    Error,
    TData,
    ReturnType<typeof keys.informationContributors>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.informationContributors(params, session),
    ({ signal }) => {
      return getPublicationInformationContributors(params, session, { signal })
    },
    options,
  )
}

export function usePublicationVersionInformationContributors<
  TData = GetPublicationVersionInformationContributors.Response,
>(
  params: GetPublicationVersionInformationContributors.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetPublicationVersionInformationContributors.Response,
    Error,
    TData,
    ReturnType<typeof keys.versionInformationContributors>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.versionInformationContributors(params, session),
    ({ signal }) => {
      return getPublicationVersionInformationContributors(params, session, { signal })
    },
    options,
  )
}

export function useCreatePublication(
  params: CreatePublication.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<CreatePublication.Response, Error, { data: CreatePublication.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: CreatePublication.Body }) => {
      return createPublication(params, data, session)
    },
    {
      ...options,
      onSuccess(publication, ...args) {
        const pathname = itemRoutes.ItemPage('publication')({
          persistentId: publication.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        options?.onSuccess?.(publication, ...args)
      },
    },
  )
}

export function useUpdatePublication(
  params: UpdatePublication.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<UpdatePublication.Response, Error, { data: UpdatePublication.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: UpdatePublication.Body }) => {
      return updatePublication(params, data, session)
    },
    {
      ...options,
      onSuccess(publication, ...args) {
        const pathname = itemRoutes.ItemPage('publication')({
          persistentId: publication.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }))
        options?.onSuccess?.(publication, ...args)
      },
    },
  )
}

export function useDeletePublication(
  params: DeletePublication.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<DeletePublication.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deletePublication(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        const pathname = itemRoutes.ItemPage('publication')({
          persistentId: params.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }))
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useDeletePublicationVersion(
  params: DeletePublicationVersion.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<DeletePublicationVersion.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deletePublicationVersion(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        const pathname = itemRoutes.ItemPage('publication')({
          persistentId: params.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }))
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useRevertPublicationToVersion(
  params: RevertPublicationToVersion.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<RevertPublicationToVersion.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return revertPublicationToVersion(params, session)
    },
    {
      ...options,
      onSuccess(publication, ...args) {
        const pathname = itemRoutes.ItemPage('publication')({
          persistentId: publication.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }))
        options?.onSuccess?.(publication, ...args)
      },
    },
  )
}

export const useApprovePublicationVersion = useRevertPublicationToVersion
export const useRejectPublicationVersion = useDeletePublicationVersion

export function useCommitDraftPublication(
  params: CommitDraftPublication.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<CommitDraftPublication.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return commitDraftPublication(params, session)
    },
    {
      ...options,
      onSuccess(publication, ...args) {
        const pathname = itemRoutes.ItemPage('publication')({
          persistentId: publication.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }))
        queryClient.invalidateQueries(itemKeys.drafts())
        options?.onSuccess?.(publication, ...args)
      },
    },
  )
}

export function useMergedPublication<TData = GetMergedPublication.Response>(
  params: GetMergedPublication.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetMergedPublication.Response,
    Error,
    TData,
    ReturnType<typeof keys.merged>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.merged(params, session),
    ({ signal }) => {
      return getMergedPublication(params, session, { signal })
    },
    options,
  )
}

export function useMergePublications(
  params: MergePublications.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<MergePublications.Response, Error, { data: MergePublications.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: MergePublications.Body }) => {
      return mergePublications(params, data, session)
    },
    {
      ...options,
      onSuccess(publication, ...args) {
        const pathname = itemRoutes.ItemPage('publication')({
          persistentId: publication.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        options?.onSuccess?.(publication, ...args)
      },
    },
  )
}

export function usePublicationDiff<TData = GetPublicationDiff.Response>(
  params: GetPublicationDiff.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetPublicationDiff.Response,
    Error,
    TData,
    ReturnType<typeof keys.diff>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.diff(params, session),
    ({ signal }) => {
      return getPublicationDiff(params, session, { signal })
    },
    options,
  )
}

export function usePublicationVersionDiff<TData = GetPublicationVersionDiff.Response>(
  params: GetPublicationVersionDiff.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetPublicationVersionDiff.Response,
    Error,
    TData,
    ReturnType<typeof keys.diffVersion>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.diffVersion(params, session),
    ({ signal }) => {
      return getPublicationVersionDiff(params, session, { signal })
    },
    options,
  )
}

export function usePublicationSources<TData = GetPublicationSources.Response>(
  params: GetPublicationSources.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetPublicationSources.Response,
    Error,
    TData,
    ReturnType<typeof keys.sources>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.sources(params, session),
    ({ signal }) => {
      return getPublicationSources(params, session, { signal })
    },
    options,
  )
}
