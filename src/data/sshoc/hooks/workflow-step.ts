import type { UseMutationOptions, UseQueryOptions } from 'react-query'
import { useMutation, useQuery } from 'react-query'

import type { AuthData } from '@/data/sshoc/api/common'
import type {
  CreateWorkflowStep,
  DeleteWorkflowStep,
  DeleteWorkflowStepVersion,
  GetMergedWorkflowStep,
  GetWorkflowStep,
  GetWorkflowStepDiff,
  GetWorkflowStepHistory,
  GetWorkflowStepInformationContributors,
  GetWorkflowStepSources,
  GetWorkflowStepVersion,
  GetWorkflowStepVersionDiff,
  GetWorkflowStepVersionInformationContributors,
  MergeWorkflowSteps,
  RevertWorkflowStepToVersion,
  UpdateWorkflowStep,
} from '@/data/sshoc/api/workflow-step'
import {
  createWorkflowStep,
  deleteWorkflowStep,
  deleteWorkflowStepVersion,
  getMergedWorkflowStep,
  getWorkflowStep,
  getWorkflowStepDiff,
  getWorkflowStepHistory,
  getWorkflowStepInformationContributors,
  getWorkflowStepSources,
  getWorkflowStepVersion,
  getWorkflowStepVersionDiff,
  getWorkflowStepVersionInformationContributors,
  mergeWorkflowSteps,
  revertWorkflowStepToVersion,
  updateWorkflowStep,
} from '@/data/sshoc/api/workflow-step'
import { useSession } from '@/data/sshoc/lib/useSession'

/**
 * Note: Workflow step mutations should only ever happen in tandem with workflow
 * mutations, so we should be able to rely on the workflow mutations correctly
 * invalidating query caches and revalidating static workflow detail pages.
 */

// TODO: This needs some hierarchy, to be able to effectively use React Query's
// query invalidation with partial query key matching.
/** scope */
const workflowStep = 'step'
/** kind */
const list = 'list'
const detail = 'detail'
const version = 'version'
const history = 'history'
const informationContributors = 'informationContributors'
const versionInformationContributors = 'versionInformationContributors'
const merged = 'merged'
const sources = 'sources'
const diff = 'diff'

export const keys = {
  all(auth?: AuthData | undefined) {
    return [workflowStep, auth ?? null] as const
  },
  lists(auth?: AuthData | undefined) {
    return [workflowStep, list, auth ?? null] as const
  },
  // list(params: GetWorkflowSteps.Params, auth?: AuthData | undefined) {
  //   return [workflowStep, list, params, auth ?? null] as const
  // },
  details(auth?: AuthData | undefined) {
    return [workflowStep, detail, auth ?? null] as const
  },
  detail(params: GetWorkflowStep.Params, auth?: AuthData | undefined) {
    return [workflowStep, detail, params, auth ?? null] as const
  },
  // versions(auth?: AuthData | undefined) {
  //   return [workflowStep, version, auth ?? null] as const
  // },
  version(params: GetWorkflowStepVersion.Params, auth?: AuthData | undefined) {
    return [workflowStep, version, params, auth ?? null] as const
  },
  // histories(auth?: AuthData | undefined) {
  //   return [workflowStep, history, auth ?? null] as const
  // },
  history(params: GetWorkflowStepHistory.Params, auth?: AuthData | undefined) {
    return [workflowStep, history, params, auth ?? null] as const
  },
  // informationContributors(auth?: AuthData | undefined) {
  //   return [workflowStep, informationContributors, auth ?? null] as const
  // },
  informationContributors(
    params: GetWorkflowStepInformationContributors.Params,
    auth?: AuthData | undefined,
  ) {
    return [workflowStep, informationContributors, params, auth ?? null] as const
  },
  // versionInformationContributors(auth?: AuthData | undefined) {
  //   return [workflowStep, versionInformationContributors, auth ?? null] as const
  // },
  versionInformationContributors(
    params: GetWorkflowStepVersionInformationContributors.Params,
    auth?: AuthData | undefined,
  ) {
    return [workflowStep, versionInformationContributors, params, auth ?? null] as const
  },
  merged(params: GetMergedWorkflowStep.Params, auth?: AuthData | undefined) {
    return [workflowStep, merged, params, auth ?? null] as const
  },
  sources(params: GetWorkflowStepSources.Params, auth?: AuthData | undefined) {
    return [workflowStep, sources, params, auth ?? null] as const
  },
  diff(params: GetWorkflowStepDiff.Params, auth?: AuthData | undefined) {
    return [workflowStep, diff, params, auth ?? null] as const
  },
  diffVersion(params: GetWorkflowStepVersionDiff.Params, auth?: AuthData | undefined) {
    return [workflowStep, version, diff, params, auth ?? null] as const
  },
}

// export function useWorkflowSteps<TData = GetWorkflowSteps.Response>(
//   params: GetWorkflowSteps.Params,
//   auth?: AuthData | undefined,
//   options?: UseQueryOptions<GetWorkflowSteps.Response, Error, TData, ReturnType<typeof keys.list>>,
// ) {
//   const session = useSession(auth)
//   return useQuery(
//     keys.list(params, auth),
//     ({ signal }) => {
//       return getWorkflowSteps(params, auth, { signal })
//     },
//     options,
//   )
// }

export function useWorkflowStep<TData = GetWorkflowStep.Response>(
  params: GetWorkflowStep.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<GetWorkflowStep.Response, Error, TData, ReturnType<typeof keys.detail>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.detail(params, session),
    ({ signal }) => {
      return getWorkflowStep(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowStepVersion<TData = GetWorkflowStepVersion.Response>(
  params: GetWorkflowStepVersion.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetWorkflowStepVersion.Response,
    Error,
    TData,
    ReturnType<typeof keys.version>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.version(params, session),
    ({ signal }) => {
      return getWorkflowStepVersion(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowStepHistory<TData = GetWorkflowStepHistory.Response>(
  params: GetWorkflowStepHistory.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetWorkflowStepHistory.Response,
    Error,
    TData,
    ReturnType<typeof keys.history>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.history(params, session),
    ({ signal }) => {
      return getWorkflowStepHistory(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowStepInformationContributors<
  TData = GetWorkflowStepInformationContributors.Response,
>(
  params: GetWorkflowStepInformationContributors.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetWorkflowStepInformationContributors.Response,
    Error,
    TData,
    ReturnType<typeof keys.informationContributors>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.informationContributors(params, session),
    ({ signal }) => {
      return getWorkflowStepInformationContributors(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowStepVersionInformationContributors<
  TData = GetWorkflowStepVersionInformationContributors.Response,
>(
  params: GetWorkflowStepVersionInformationContributors.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetWorkflowStepVersionInformationContributors.Response,
    Error,
    TData,
    ReturnType<typeof keys.versionInformationContributors>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.versionInformationContributors(params, session),
    ({ signal }) => {
      return getWorkflowStepVersionInformationContributors(params, session, { signal })
    },
    options,
  )
}

export function useCreateWorkflowStep(
  params: CreateWorkflowStep.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<
    CreateWorkflowStep.Response,
    Error,
    { data: CreateWorkflowStep.Body }
  >,
) {
  // const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: CreateWorkflowStep.Body }) => {
      return createWorkflowStep(params, data, session)
    },
    {
      ...options,
      onSuccess(...args) {
        // const pathname = itemRoutes.ItemPage('workflow')({
        //   persistentId: params.persistentId,
        // }).pathname
        // revalidate({ pathname })
        // queryClient.invalidateQueries(itemKeys.search())
        // queryClient.invalidateQueries(
        //   keysByItemCategory['workflow'].detail({ persistentId: params.persistentId }),
        // )
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useUpdateWorkflowStep(
  params: UpdateWorkflowStep.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<
    UpdateWorkflowStep.Response,
    Error,
    { data: UpdateWorkflowStep.Body }
  >,
) {
  // const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: UpdateWorkflowStep.Body }) => {
      return updateWorkflowStep(params, data, session)
    },
    {
      ...options,
      onSuccess(...args) {
        // const pathname = itemRoutes.ItemPage('workflow')({
        //   persistentId: params.persistentId,
        // }).pathname
        // revalidate({ pathname })
        // queryClient.invalidateQueries(itemKeys.search())
        // queryClient.invalidateQueries(
        //   keysByItemCategory['workflow'].detail({ persistentId: params.persistentId }),
        // )
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useDeleteWorkflowStep(
  params: DeleteWorkflowStep.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<DeleteWorkflowStep.Response, Error>,
) {
  // const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deleteWorkflowStep(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        // const pathname = itemRoutes.ItemPage('workflow')({
        //   persistentId: params.persistentId,
        // }).pathname
        // revalidate({ pathname })
        // queryClient.invalidateQueries(itemKeys.search())
        // queryClient.invalidateQueries(
        //   keysByItemCategory['workflow'].detail({ persistentId: params.persistentId }),
        // )
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useDeleteWorkflowStepVersion(
  params: DeleteWorkflowStepVersion.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<DeleteWorkflowStepVersion.Response, Error>,
) {
  // const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deleteWorkflowStepVersion(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        // const pathname = itemRoutes.ItemPage('workflow')({
        //   persistentId: params.persistentId,
        // }).pathname
        // revalidate({ pathname })
        // queryClient.invalidateQueries(itemKeys.search())
        // queryClient.invalidateQueries(
        //   keysByItemCategory['workflow'].detail({ persistentId: params.persistentId }),
        // )
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useRevertWorkflowStepToVersion(
  params: RevertWorkflowStepToVersion.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<RevertWorkflowStepToVersion.Response, Error>,
) {
  // const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return revertWorkflowStepToVersion(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        // const pathname = itemRoutes.ItemPage('workflow')({
        //   persistentId: params.persistentId,
        // }).pathname
        // revalidate({ pathname })
        // queryClient.invalidateQueries(itemKeys.search())
        // queryClient.invalidateQueries(
        //   keysByItemCategory['workflow'].detail({ persistentId: params.persistentId }),
        // )
        options?.onSuccess?.(...args)
      },
    },
  )
}

export const useApproveWorkflowStepVersion = useRevertWorkflowStepToVersion
export const useRejectWorkflowStepVersion = useDeleteWorkflowStepVersion

// export function useCommitDraftWorkflowStep(
//   params: CommitDraftWorkflowStep.Params,
//   auth?: AuthData | undefined,
//   options?: UseMutationOptions<CommitDraftWorkflowStep.Response, Error>,
// ) {
//   const session = useSession(auth)
//   return useMutation(() => {
//     return commitDraftWorkflowStep(params, auth)
//   }, options)
// }

export function useMergedWorkflowStep<TData = GetMergedWorkflowStep.Response>(
  params: GetMergedWorkflowStep.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetMergedWorkflowStep.Response,
    Error,
    TData,
    ReturnType<typeof keys.merged>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.merged(params, session),
    ({ signal }) => {
      return getMergedWorkflowStep(params, session, { signal })
    },
    options,
  )
}

export function useMergeWorkflowSteps(
  params: MergeWorkflowSteps.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<
    MergeWorkflowSteps.Response,
    Error,
    { data: MergeWorkflowSteps.Body }
  >,
) {
  // const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: MergeWorkflowSteps.Body }) => {
      return mergeWorkflowSteps(params, data, session)
    },
    {
      ...options,
      onSuccess(...args) {
        // const pathname = itemRoutes.ItemPage('workflow')({
        //   persistentId: params.persistentId,
        // }).pathname
        // revalidate({ pathname })
        // queryClient.invalidateQueries(itemKeys.search())
        // queryClient.invalidateQueries(
        //   keysByItemCategory['workflow'].detail({ persistentId: params.persistentId }),
        // )
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useWorkflowStepDiff<TData = GetWorkflowStepDiff.Response>(
  params: GetWorkflowStepDiff.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetWorkflowStepDiff.Response,
    Error,
    TData,
    ReturnType<typeof keys.diff>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.diff(params, session),
    ({ signal }) => {
      return getWorkflowStepDiff(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowStepVersionDiff<TData = GetWorkflowStepVersionDiff.Response>(
  params: GetWorkflowStepVersionDiff.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetWorkflowStepVersionDiff.Response,
    Error,
    TData,
    ReturnType<typeof keys.diffVersion>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.diffVersion(params, session),
    ({ signal }) => {
      return getWorkflowStepVersionDiff(params, session, { signal })
    },
    options,
  )
}

export function useWorkflowStepSources<TData = GetWorkflowStepSources.Response>(
  params: GetWorkflowStepSources.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetWorkflowStepSources.Response,
    Error,
    TData,
    ReturnType<typeof keys.sources>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.sources(params, session),
    ({ signal }) => {
      return getWorkflowStepSources(params, session, { signal })
    },
    options,
  )
}
