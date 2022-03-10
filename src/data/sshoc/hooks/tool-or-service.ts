import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from 'react-query'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query'

import type { AuthData } from '@/data/sshoc/api/common'
import type {
  CommitDraftTool,
  CreateTool,
  DeleteTool,
  DeleteToolVersion,
  GetMergedTool,
  GetTool,
  GetToolDiff,
  GetToolHistory,
  GetToolInformationContributors,
  GetTools,
  GetToolSources,
  GetToolVersion,
  GetToolVersionDiff,
  GetToolVersionInformationContributors,
  MergeTools,
  RevertToolToVersion,
  UpdateTool,
} from '@/data/sshoc/api/tool-or-service'
import {
  commitDraftTool,
  createTool,
  deleteTool,
  deleteToolVersion,
  getMergedTool,
  getTool,
  getToolDiff,
  getToolHistory,
  getToolInformationContributors,
  getTools,
  getToolSources,
  getToolVersion,
  getToolVersionDiff,
  getToolVersionInformationContributors,
  mergeTools,
  revertToolToVersion,
  updateTool,
} from '@/data/sshoc/api/tool-or-service'
import { keys as itemKeys } from '@/data/sshoc/hooks/item'
import { useSession } from '@/data/sshoc/lib/useSession'
import { revalidate } from '@/lib/core/app/revalidate'
import { itemRoutes } from '@/lib/core/navigation/item-routes'

// TODO: This needs some hierarchy, to be able to effectively use React Query's
// query invalidation with partial query key matching.
/** scope */
const tool = 'tool-or-service'
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
  all(auth?: AuthData | undefined) {
    return [tool, auth ?? null] as const
  },
  lists(auth?: AuthData | undefined) {
    return [tool, list, auth ?? null] as const
  },
  list(params: GetTools.Params, auth?: AuthData | undefined) {
    return [tool, list, params, auth ?? null] as const
  },
  listInfinite(params: GetTools.Params, auth?: AuthData | undefined) {
    return [tool, list, infinite, params, auth ?? null] as const
  },
  details(auth?: AuthData | undefined) {
    return [tool, detail, auth ?? null] as const
  },
  detail(params: GetTool.Params, auth?: AuthData | undefined) {
    return [tool, detail, params, auth ?? null] as const
  },
  // versions(auth?: AuthData | undefined) {
  //   return [tool, version, auth ?? null] as const
  // },
  version(params: GetToolVersion.Params, auth?: AuthData | undefined) {
    return [tool, version, params, auth ?? null] as const
  },
  // histories(auth?: AuthData | undefined) {
  //   return [tool, history, auth ?? null] as const
  // },
  history(params: GetToolHistory.Params, auth?: AuthData | undefined) {
    return [tool, history, params, auth ?? null] as const
  },
  // informationContributors(auth?: AuthData | undefined) {
  //   return [tool, informationContributors, auth ?? null] as const
  // },
  informationContributors(
    params: GetToolInformationContributors.Params,
    auth?: AuthData | undefined,
  ) {
    return [tool, informationContributors, params, auth ?? null] as const
  },
  // versionInformationContributors(auth?: AuthData | undefined) {
  //   return [tool, versionInformationContributors, auth ?? null] as const
  // },
  versionInformationContributors(
    params: GetToolVersionInformationContributors.Params,
    auth?: AuthData | undefined,
  ) {
    return [tool, versionInformationContributors, params, auth ?? null] as const
  },
  merged(params: GetMergedTool.Params, auth?: AuthData | undefined) {
    return [tool, merged, params, auth ?? null] as const
  },
  sources(params: GetToolSources.Params, auth?: AuthData | undefined) {
    return [tool, sources, params, auth ?? null] as const
  },
  diff(params: GetToolDiff.Params, auth?: AuthData | undefined) {
    return [tool, diff, params, auth ?? null] as const
  },
  diffVersion(params: GetToolVersionDiff.Params, auth?: AuthData | undefined) {
    return [tool, version, diff, params, auth ?? null] as const
  },
}

export function useTools<TData = GetTools.Response>(
  params: GetTools.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<GetTools.Response, Error, TData, ReturnType<typeof keys.list>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.list(params, session),
    ({ signal }) => {
      return getTools(params, session, { signal })
    },
    { keepPreviousData: true, ...options },
  )
}

export function useToolsInfinite<TData = GetTools.Response>(
  params: GetTools.Params,
  auth?: AuthData | undefined,
  options?: UseInfiniteQueryOptions<
    GetTools.Response,
    Error,
    TData,
    GetTools.Response,
    ReturnType<typeof keys.listInfinite>
  >,
) {
  const session = useSession(auth)
  return useInfiniteQuery(
    keys.listInfinite(params, session),
    ({ signal, pageParam = params.page }) => {
      return getTools({ ...params, page: pageParam }, session, { signal })
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

export function useTool<TData = GetTool.Response>(
  params: GetTool.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<GetTool.Response, Error, TData, ReturnType<typeof keys.detail>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.detail(params, session),
    ({ signal }) => {
      return getTool(params, session, { signal })
    },
    options,
  )
}

export function useToolVersion<TData = GetToolVersion.Response>(
  params: GetToolVersion.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<GetToolVersion.Response, Error, TData, ReturnType<typeof keys.version>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.version(params, session),
    ({ signal }) => {
      return getToolVersion(params, session, { signal })
    },
    options,
  )
}

export function useToolHistory<TData = GetToolHistory.Response>(
  params: GetToolHistory.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<GetToolHistory.Response, Error, TData, ReturnType<typeof keys.history>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.history(params, session),
    ({ signal }) => {
      return getToolHistory(params, session, { signal })
    },
    options,
  )
}

export function useToolInformationContributors<TData = GetToolInformationContributors.Response>(
  params: GetToolInformationContributors.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetToolInformationContributors.Response,
    Error,
    TData,
    ReturnType<typeof keys.informationContributors>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.informationContributors(params, session),
    ({ signal }) => {
      return getToolInformationContributors(params, session, { signal })
    },
    options,
  )
}

export function useToolVersionInformationContributors<
  TData = GetToolVersionInformationContributors.Response,
>(
  params: GetToolVersionInformationContributors.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetToolVersionInformationContributors.Response,
    Error,
    TData,
    ReturnType<typeof keys.versionInformationContributors>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.versionInformationContributors(params, session),
    ({ signal }) => {
      return getToolVersionInformationContributors(params, session, { signal })
    },
    options,
  )
}

export function useCreateTool(
  params: CreateTool.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<CreateTool.Response, Error, { data: CreateTool.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: CreateTool.Body }) => {
      return createTool(params, data, session)
    },
    {
      ...options,
      onSuccess(tool, ...args) {
        const pathname = itemRoutes.ItemPage('tool-or-service')({
          persistentId: tool.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        options?.onSuccess?.(tool, ...args)
      },
    },
  )
}

export function useUpdateTool(
  params: UpdateTool.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<UpdateTool.Response, Error, { data: UpdateTool.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: UpdateTool.Body }) => {
      return updateTool(params, data, session)
    },
    {
      ...options,
      onSuccess(tool, ...args) {
        const pathname = itemRoutes.ItemPage('tool-or-service')({
          persistentId: tool.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }))
        options?.onSuccess?.(tool, ...args)
      },
    },
  )
}

export function useDeleteTool(
  params: DeleteTool.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<DeleteTool.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deleteTool(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        const pathname = itemRoutes.ItemPage('tool-or-service')({
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

export function useDeleteToolVersion(
  params: DeleteToolVersion.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<DeleteToolVersion.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deleteToolVersion(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        const pathname = itemRoutes.ItemPage('tool-or-service')({
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

export function useRevertToolToVersion(
  params: RevertToolToVersion.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<RevertToolToVersion.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return revertToolToVersion(params, session)
    },
    {
      ...options,
      onSuccess(tool, ...args) {
        const pathname = itemRoutes.ItemPage('tool-or-service')({
          persistentId: tool.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }))
        options?.onSuccess?.(tool, ...args)
      },
    },
  )
}

export const useApproveToolVersion = useRevertToolToVersion
export const useRejectToolVersion = useDeleteToolVersion

export function useCommitDraftTool(
  params: CommitDraftTool.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<CommitDraftTool.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return commitDraftTool(params, session)
    },
    {
      ...options,
      onSuccess(tool, ...args) {
        const pathname = itemRoutes.ItemPage('tool-or-service')({
          persistentId: tool.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }))
        queryClient.invalidateQueries(itemKeys.drafts())
        options?.onSuccess?.(tool, ...args)
      },
    },
  )
}

export function useMergedTool<TData = GetMergedTool.Response>(
  params: GetMergedTool.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<GetMergedTool.Response, Error, TData, ReturnType<typeof keys.merged>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.merged(params, session),
    ({ signal }) => {
      return getMergedTool(params, session, { signal })
    },
    options,
  )
}

export function useMergeTools(
  params: MergeTools.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<MergeTools.Response, Error, { data: MergeTools.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: MergeTools.Body }) => {
      return mergeTools(params, data, session)
    },
    {
      ...options,
      onSuccess(tool, ...args) {
        const pathname = itemRoutes.ItemPage('tool-or-service')({
          persistentId: tool.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        options?.onSuccess?.(tool, ...args)
      },
    },
  )
}

export function useToolDiff<TData = GetToolDiff.Response>(
  params: GetToolDiff.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<GetToolDiff.Response, Error, TData, ReturnType<typeof keys.diff>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.diff(params, session),
    ({ signal }) => {
      return getToolDiff(params, session, { signal })
    },
    options,
  )
}

export function useToolVersionDiff<TData = GetToolVersionDiff.Response>(
  params: GetToolVersionDiff.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetToolVersionDiff.Response,
    Error,
    TData,
    ReturnType<typeof keys.diffVersion>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.diffVersion(params, session),
    ({ signal }) => {
      return getToolVersionDiff(params, session, { signal })
    },
    options,
  )
}

export function useToolSources<TData = GetToolSources.Response>(
  params: GetToolSources.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<GetToolSources.Response, Error, TData, ReturnType<typeof keys.sources>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.sources(params, session),
    ({ signal }) => {
      return getToolSources(params, session, { signal })
    },
    options,
  )
}
