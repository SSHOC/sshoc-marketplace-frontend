import type { UseMutationOptions, UseQueryOptions } from "react-query";
import { useMutation, useQuery } from "react-query";

import type { AuthData } from "@/data/sshoc/api/common";
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
} from "@/data/sshoc/api/workflow-step";
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
} from "@/data/sshoc/api/workflow-step";
import { useSession } from "@/data/sshoc/lib/useSession";

/**
 * Note: Workflow step mutations should only ever happen in tandem with workflow
 * mutations, so we should be able to rely on the workflow mutations correctly
 * invalidating query caches and revalidating static workflow detail pages.
 */

// TODO: This needs some hierarchy, to be able to effectively use React Query's
// query invalidation with partial query key matching.
/** scope */
const workflowStep = "step";
/** kind */
const list = "list";
const detail = "detail";
const version = "version";
const history = "history";
const informationContributors = "informationContributors";
const versionInformationContributors = "versionInformationContributors";
const merged = "merged";
const sources = "sources";
const diff = "diff";

export const keys = {
	all(auth?: AuthData) {
		return [workflowStep, auth ?? {}] as const;
	},
	lists(auth?: AuthData) {
		return [workflowStep, list, auth ?? {}] as const;
	},
	// list(params: GetWorkflowSteps.Params, auth?: AuthData | undefined) {
	//   return [workflowStep, list, params, auth ?? {}] as const
	// },
	details(auth?: AuthData) {
		return [workflowStep, detail, auth ?? {}] as const;
	},
	detail(params: GetWorkflowStep.Params, auth?: AuthData) {
		return [workflowStep, detail, params, auth ?? {}] as const;
	},
	// versions(auth?: AuthData | undefined) {
	//   return [workflowStep, version, auth ?? {}] as const
	// },
	version(params: GetWorkflowStepVersion.Params, auth?: AuthData) {
		return [workflowStep, version, params, auth ?? {}] as const;
	},
	// histories(auth?: AuthData | undefined) {
	//   return [workflowStep, history, auth ?? {}] as const
	// },
	history(params: GetWorkflowStepHistory.Params, auth?: AuthData) {
		return [workflowStep, history, params, auth ?? {}] as const;
	},
	// informationContributors(auth?: AuthData | undefined) {
	//   return [workflowStep, informationContributors, auth ?? {}] as const
	// },
	informationContributors(params: GetWorkflowStepInformationContributors.Params, auth?: AuthData) {
		return [workflowStep, informationContributors, params, auth ?? {}] as const;
	},
	// versionInformationContributors(auth?: AuthData | undefined) {
	//   return [workflowStep, versionInformationContributors, auth ?? {}] as const
	// },
	versionInformationContributors(
		params: GetWorkflowStepVersionInformationContributors.Params,
		auth?: AuthData,
	) {
		return [workflowStep, versionInformationContributors, params, auth ?? {}] as const;
	},
	merged(params: GetMergedWorkflowStep.Params, auth?: AuthData) {
		return [workflowStep, merged, params, auth ?? {}] as const;
	},
	sources(params: GetWorkflowStepSources.Params, auth?: AuthData) {
		return [workflowStep, sources, params, auth ?? {}] as const;
	},
	diff(params: GetWorkflowStepDiff.Params, auth?: AuthData) {
		return [workflowStep, diff, params, auth ?? {}] as const;
	},
	diffVersion(params: GetWorkflowStepVersionDiff.Params, auth?: AuthData) {
		return [workflowStep, version, diff, params, auth ?? {}] as const;
	},
};

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
	auth?: AuthData,
	options?: UseQueryOptions<GetWorkflowStep.Response, Error, TData, ReturnType<typeof keys.detail>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.detail(params, session),
		({ signal }) => {
			return getWorkflowStep(params, session, { signal });
		},
		options,
	);
}

export function useWorkflowStepVersion<TData = GetWorkflowStepVersion.Response>(
	params: GetWorkflowStepVersion.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetWorkflowStepVersion.Response,
		Error,
		TData,
		ReturnType<typeof keys.version>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.version(params, session),
		({ signal }) => {
			return getWorkflowStepVersion(params, session, { signal });
		},
		options,
	);
}

export function useWorkflowStepHistory<TData = GetWorkflowStepHistory.Response>(
	params: GetWorkflowStepHistory.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetWorkflowStepHistory.Response,
		Error,
		TData,
		ReturnType<typeof keys.history>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.history(params, session),
		({ signal }) => {
			return getWorkflowStepHistory(params, session, { signal });
		},
		options,
	);
}

export function useWorkflowStepInformationContributors<
	TData = GetWorkflowStepInformationContributors.Response,
>(
	params: GetWorkflowStepInformationContributors.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetWorkflowStepInformationContributors.Response,
		Error,
		TData,
		ReturnType<typeof keys.informationContributors>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.informationContributors(params, session),
		({ signal }) => {
			return getWorkflowStepInformationContributors(params, session, { signal });
		},
		options,
	);
}

export function useWorkflowStepVersionInformationContributors<
	TData = GetWorkflowStepVersionInformationContributors.Response,
>(
	params: GetWorkflowStepVersionInformationContributors.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetWorkflowStepVersionInformationContributors.Response,
		Error,
		TData,
		ReturnType<typeof keys.versionInformationContributors>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.versionInformationContributors(params, session),
		({ signal }) => {
			return getWorkflowStepVersionInformationContributors(params, session, { signal });
		},
		options,
	);
}

export function useCreateWorkflowStep(
	params: CreateWorkflowStep.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		CreateWorkflowStep.Response,
		Error,
		{ data: CreateWorkflowStep.Body }
	>,
) {
	// const queryClient = useQueryClient()
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: CreateWorkflowStep.Body }) => {
			return createWorkflowStep(params, data, session);
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
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useUpdateWorkflowStep(
	params: UpdateWorkflowStep.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		UpdateWorkflowStep.Response,
		Error,
		{ data: UpdateWorkflowStep.Body }
	>,
) {
	// const queryClient = useQueryClient()
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: UpdateWorkflowStep.Body }) => {
			return updateWorkflowStep(params, data, session);
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
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useDeleteWorkflowStep(
	params: DeleteWorkflowStep.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteWorkflowStep.Response, Error>,
) {
	// const queryClient = useQueryClient()
	const session = useSession(auth);
	return useMutation(
		() => {
			return deleteWorkflowStep(params, session);
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
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useDeleteWorkflowStepVersion(
	params: DeleteWorkflowStepVersion.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteWorkflowStepVersion.Response, Error>,
) {
	// const queryClient = useQueryClient()
	const session = useSession(auth);
	return useMutation(
		() => {
			return deleteWorkflowStepVersion(params, session);
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
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useRevertWorkflowStepToVersion(
	params: RevertWorkflowStepToVersion.Params,
	auth?: AuthData,
	options?: UseMutationOptions<RevertWorkflowStepToVersion.Response, Error>,
) {
	// const queryClient = useQueryClient()
	const session = useSession(auth);
	return useMutation(
		() => {
			return revertWorkflowStepToVersion(params, session);
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
				options?.onSuccess?.(...args);
			},
		},
	);
}

export const useApproveWorkflowStepVersion = useRevertWorkflowStepToVersion;
export const useRejectWorkflowStepVersion = useDeleteWorkflowStepVersion;

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
	auth?: AuthData,
	options?: UseQueryOptions<
		GetMergedWorkflowStep.Response,
		Error,
		TData,
		ReturnType<typeof keys.merged>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.merged(params, session),
		({ signal }) => {
			return getMergedWorkflowStep(params, session, { signal });
		},
		options,
	);
}

export function useMergeWorkflowSteps(
	params: MergeWorkflowSteps.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		MergeWorkflowSteps.Response,
		Error,
		{ data: MergeWorkflowSteps.Body }
	>,
) {
	// const queryClient = useQueryClient()
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: MergeWorkflowSteps.Body }) => {
			return mergeWorkflowSteps(params, data, session);
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
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useWorkflowStepDiff<TData = GetWorkflowStepDiff.Response>(
	params: GetWorkflowStepDiff.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetWorkflowStepDiff.Response,
		Error,
		TData,
		ReturnType<typeof keys.diff>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.diff(params, session),
		({ signal }) => {
			return getWorkflowStepDiff(params, session, { signal });
		},
		options,
	);
}

export function useWorkflowStepVersionDiff<TData = GetWorkflowStepVersionDiff.Response>(
	params: GetWorkflowStepVersionDiff.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetWorkflowStepVersionDiff.Response,
		Error,
		TData,
		ReturnType<typeof keys.diffVersion>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.diffVersion(params, session),
		({ signal }) => {
			return getWorkflowStepVersionDiff(params, session, { signal });
		},
		options,
	);
}

export function useWorkflowStepSources<TData = GetWorkflowStepSources.Response>(
	params: GetWorkflowStepSources.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetWorkflowStepSources.Response,
		Error,
		TData,
		ReturnType<typeof keys.sources>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.sources(params, session),
		({ signal }) => {
			return getWorkflowStepSources(params, session, { signal });
		},
		options,
	);
}
