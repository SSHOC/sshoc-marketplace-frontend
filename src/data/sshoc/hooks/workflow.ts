import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from 'react-query'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query'

import type { AuthData } from '@/data/sshoc/api/common'
import type {
  CommitDraftWorkflow,
  CreateWorkflow,
  DeleteWorkflow,
  DeleteWorkflowVersion,
  GetMergedWorkflow,
  GetWorkflow,
  GetWorkflowDiff,
  GetWorkflowHistory,
  GetWorkflowInformationContributors,
  GetWorkflows,
  GetWorkflowSources,
  GetWorkflowVersion,
  GetWorkflowVersionDiff,
  GetWorkflowVersionInformationContributors,
  MergeWorkflows,
  RevertWorkflowToVersion,
  UpdateWorkflow,
} from '@/data/sshoc/api/workflow'
import {
  commitDraftWorkflow,
  createWorkflow,
  deleteWorkflow,
  deleteWorkflowVersion,
  getMergedWorkflow,
  getWorkflow,
  getWorkflowDiff,
  getWorkflowHistory,
  getWorkflowInformationContributors,
  getWorkflows,
  getWorkflowSources,
  getWorkflowVersion,
  getWorkflowVersionDiff,
  getWorkflowVersionInformationContributors,
  mergeWorkflows,
  revertWorkflowToVersion,
  updateWorkflow,
} from '@/data/sshoc/api/workflow'
import { keys as itemKeys } from '@/data/sshoc/hooks/item'
import { useSession } from '@/data/sshoc/lib/useSession'
import { revalidate } from '@/lib/core/app/revalidate'
import { itemRoutes } from '@/lib/core/navigation/item-routes'

// TODO: This needs some hierarchy, to be able to effectively use React Query's
// query invalidation with partial query key matching.
/** scope */
const workflow = 'workflow'
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
    return [workflow, auth ?? null] as const
  },
  lists(auth?: AuthData  ) {
    return [workflow, list, auth ?? null] as const
  },
  list(params: GetWorkflows.Params, auth?: AuthData  ) {
    return [workflow, list, params, auth ?? null] as const
  },
  listInfinite(params: GetWorkflows.Params, auth?: AuthData  ) {
    return [workflow, list, infinite, params, auth ?? null] as const
  },
  details(auth?: AuthData  ) {
    return [workflow, detail, auth ?? null] as const
  },
  detail(params: GetWorkflow.Params, auth?: AuthData  ) {
    return [workflow, detail, params, auth ?? null] as const
  },
  // versions(auth?: AuthData | undefined) {
  //   return [workflow, version, auth ?? null] as const
  // },
  version(params: GetWorkflowVersion.Params, auth?: AuthData  ) {
    return [workflow, version, params, auth ?? null] as const
  },
  // histories(auth?: AuthData | undefined) {
  //   return [workflow, history, auth ?? null] as const
  // },
  history(params: GetWorkflowHistory.Params, auth?: AuthData  ) {
    return [workflow, history, params, auth ?? null] as const
  },
  // informationContributors(auth?: AuthData | undefined) {
  //   return [workflow, informationContributors, auth ?? null] as const
  // },
  informationContributors(
    params: GetWorkflowInformationContributors.Params,
    auth?: AuthData  ,
  ) {
    return [workflow, informationContributors, params, auth ?? null] as const
  },
  // versionInformationContributors(auth?: AuthData | undefined) {
  //   return [workflow, versionInformationContributors, auth ?? null] as const
  // },
  versionInformationContributors(
    params: GetWorkflowVersionInformationContributors.Params,
    auth?: AuthData  ,
  ) {
    return [workflow, versionInformationContributors, params, auth ?? null] as const
  },
  merged(params: GetMergedWorkflow.Params, auth?: AuthData  ) {
    return [workflow, merged, params, auth ?? null] as const
  },
  sources(params: GetWorkflowSources.Params, auth?: AuthData  ) {
    return [workflow, sources, params, auth ?? null] as const
  },
  diff(params: GetWorkflowDiff.Params, auth?: AuthData  ) {
    return [workflow, diff, params, auth ?? null] as const
  },
  diffVersion(params: GetWorkflowVersionDiff.Params, auth?: AuthData  ) {
    return [workflow, version, diff, params, auth ?? null] as const
  },
}

export function useWorkflows<TData = GetWorkflows.Response>(
  params: GetWorkflows.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<GetWorkflows.Response, Error, TData, ReturnType<typeof keys.list>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.list(params, session),
    ({ signal }) => {
      return getWorkflows(params, session, { signal })
    },
    { keepPreviousData: true, ...options },
  )
}

export function useWorkflowsInfinite<TData = GetWorkflows.Response>(
  params: GetWorkflows.Params,
  auth?: AuthData  ,
  options?: UseInfiniteQueryOptions<
    GetWorkflows.Response,
    Error,
    TData,
    GetWorkflows.Response,
    ReturnType<typeof keys.listInfinite>
  >,
) {
  const session = useSession(auth)
  return useInfiniteQuery(
    keys.listInfinite(params, session),
    ({ signal, pageParam = params.page }) => {
      return getWorkflows({ ...params, page: pageParam }, session, { signal })
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

export function useWorkflow<TData = GetWorkflow.Response>(
  params: GetWorkflow.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<GetWorkflow.Response, Error, TData, ReturnType<typeof keys.detail>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.detail(params, session),
    ({ signal }) => {
      return getWorkflow(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowVersion<TData = GetWorkflowVersion.Response>(
  params: GetWorkflowVersion.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetWorkflowVersion.Response,
    Error,
    TData,
    ReturnType<typeof keys.version>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.version(params, session),
    ({ signal }) => {
      return getWorkflowVersion(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowHistory<TData = GetWorkflowHistory.Response>(
  params: GetWorkflowHistory.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetWorkflowHistory.Response,
    Error,
    TData,
    ReturnType<typeof keys.history>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.history(params, session),
    ({ signal }) => {
      return getWorkflowHistory(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowInformationContributors<
  TData = GetWorkflowInformationContributors.Response,
>(
  params: GetWorkflowInformationContributors.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetWorkflowInformationContributors.Response,
    Error,
    TData,
    ReturnType<typeof keys.informationContributors>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.informationContributors(params, session),
    ({ signal }) => {
      return getWorkflowInformationContributors(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowVersionInformationContributors<
  TData = GetWorkflowVersionInformationContributors.Response,
>(
  params: GetWorkflowVersionInformationContributors.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetWorkflowVersionInformationContributors.Response,
    Error,
    TData,
    ReturnType<typeof keys.versionInformationContributors>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.versionInformationContributors(params, session),
    ({ signal }) => {
      return getWorkflowVersionInformationContributors(params, session, { signal })
    },
    options,
  )
}

export function useCreateWorkflow(
  params: CreateWorkflow.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<CreateWorkflow.Response, Error, { data: CreateWorkflow.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: CreateWorkflow.Body }) => {
      return createWorkflow(params, data, session)
    },
    {
      ...options,
      onSuccess(workflow, ...args) {
        const pathname = itemRoutes.ItemPage('workflow')({
          persistentId: workflow.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        options?.onSuccess?.(workflow, ...args)
      },
    },
  )
}

export function useUpdateWorkflow(
  params: UpdateWorkflow.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<UpdateWorkflow.Response, Error, { data: UpdateWorkflow.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: UpdateWorkflow.Body }) => {
      return updateWorkflow(params, data, session)
    },
    {
      ...options,
      onSuccess(workflow, ...args) {
        const pathname = itemRoutes.ItemPage('workflow')({
          persistentId: workflow.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }))
        options?.onSuccess?.(workflow, ...args)
      },
    },
  )
}

export function useDeleteWorkflow(
  params: DeleteWorkflow.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<DeleteWorkflow.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deleteWorkflow(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        const pathname = itemRoutes.ItemPage('workflow')({
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

export function useDeleteWorkflowVersion(
  params: DeleteWorkflowVersion.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<DeleteWorkflowVersion.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deleteWorkflowVersion(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        const pathname = itemRoutes.ItemPage('workflow')({
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

export function useRevertWorkflowToVersion(
  params: RevertWorkflowToVersion.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<RevertWorkflowToVersion.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return revertWorkflowToVersion(params, session)
    },
    {
      ...options,
      onSuccess(workflow, ...args) {
        const pathname = itemRoutes.ItemPage('workflow')({
          persistentId: workflow.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }))
        options?.onSuccess?.(workflow, ...args)
      },
    },
  )
}

export const useApproveWorkflowVersion = useRevertWorkflowToVersion
export const useRejectWorkflowVersion = useDeleteWorkflowVersion

export function useCommitDraftWorkflow(
  params: CommitDraftWorkflow.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<CommitDraftWorkflow.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return commitDraftWorkflow(params, session)
    },
    {
      ...options,
      onSuccess(workflow, ...args) {
        const pathname = itemRoutes.ItemPage('workflow')({
          persistentId: workflow.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }))
        queryClient.invalidateQueries(itemKeys.drafts())
        options?.onSuccess?.(workflow, ...args)
      },
    },
  )
}

export function useMergedWorkflow<TData = GetMergedWorkflow.Response>(
  params: GetMergedWorkflow.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetMergedWorkflow.Response,
    Error,
    TData,
    ReturnType<typeof keys.merged>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.merged(params, session),
    ({ signal }) => {
      return getMergedWorkflow(params, session, { signal })
    },
    options,
  )
}

export function useMergeWorkflows(
  params: MergeWorkflows.Params,
  auth?: AuthData  ,
  options?: UseMutationOptions<MergeWorkflows.Response, Error, { data: MergeWorkflows.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: MergeWorkflows.Body }) => {
      return mergeWorkflows(params, data, session)
    },
    {
      ...options,
      onSuccess(workflow, ...args) {
        const pathname = itemRoutes.ItemPage('workflow')({
          persistentId: workflow.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(keys.lists())
        options?.onSuccess?.(workflow, ...args)
      },
    },
  )
}

export function useWorkflowDiff<TData = GetWorkflowDiff.Response>(
  params: GetWorkflowDiff.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<GetWorkflowDiff.Response, Error, TData, ReturnType<typeof keys.diff>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.diff(params, session),
    ({ signal }) => {
      return getWorkflowDiff(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowVersionDiff<TData = GetWorkflowVersionDiff.Response>(
  params: GetWorkflowVersionDiff.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetWorkflowVersionDiff.Response,
    Error,
    TData,
    ReturnType<typeof keys.diffVersion>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.diffVersion(params, session),
    ({ signal }) => {
      return getWorkflowVersionDiff(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowSources<TData = GetWorkflowSources.Response>(
  params: GetWorkflowSources.Params,
  auth?: AuthData  ,
  options?: UseQueryOptions<
    GetWorkflowSources.Response,
    Error,
    TData,
    ReturnType<typeof keys.sources>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.sources(params, session),
    ({ signal }) => {
      return getWorkflowSources(params, session, { signal })
    },
    options,
  )
}
