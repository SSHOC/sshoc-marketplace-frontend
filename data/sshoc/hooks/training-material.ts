import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from "react-query";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

import type { AuthData } from "@/data/sshoc/api/common";
import type {
	CommitDraftTrainingMaterial,
	CreateTrainingMaterial,
	DeleteTrainingMaterial,
	DeleteTrainingMaterialVersion,
	GetMergedTrainingMaterial,
	GetTrainingMaterial,
	GetTrainingMaterialDiff,
	GetTrainingMaterialHistory,
	GetTrainingMaterialInformationContributors,
	GetTrainingMaterials,
	GetTrainingMaterialSources,
	GetTrainingMaterialVersion,
	GetTrainingMaterialVersionDiff,
	GetTrainingMaterialVersionInformationContributors,
	MergeTrainingMaterials,
	RevertTrainingMaterialToVersion,
	UpdateTrainingMaterial,
} from "@/data/sshoc/api/training-material";
import {
	commitDraftTrainingMaterial,
	createTrainingMaterial,
	deleteTrainingMaterial,
	deleteTrainingMaterialVersion,
	getMergedTrainingMaterial,
	getTrainingMaterial,
	getTrainingMaterialDiff,
	getTrainingMaterialHistory,
	getTrainingMaterialInformationContributors,
	getTrainingMaterials,
	getTrainingMaterialSources,
	getTrainingMaterialVersion,
	getTrainingMaterialVersionDiff,
	getTrainingMaterialVersionInformationContributors,
	mergeTrainingMaterials,
	revertTrainingMaterialToVersion,
	updateTrainingMaterial,
} from "@/data/sshoc/api/training-material";
import { keys as itemKeys } from "@/data/sshoc/hooks/item";
import { useSession } from "@/data/sshoc/lib/useSession";
import { revalidate } from "@/lib/core/app/revalidate";
import { itemRoutes } from "@/lib/core/navigation/item-routes";

// TODO: This needs some hierarchy, to be able to effectively use React Query's
// query invalidation with partial query key matching.
/** scope */
const trainingMaterial = "training-material";
/** kind */
const list = "list";
const detail = "detail";
const infinite = "infinite";
const version = "version";
const history = "history";
const informationContributors = "informationContributors";
const versionInformationContributors = "versionInformationContributors";
const merged = "merged";
const sources = "sources";
const diff = "diff";

export const keys = {
	all(auth?: AuthData) {
		return [trainingMaterial, auth ?? null] as const;
	},
	lists(auth?: AuthData) {
		return [trainingMaterial, list, auth ?? null] as const;
	},
	list(params: GetTrainingMaterials.Params, auth?: AuthData) {
		return [trainingMaterial, list, params, auth ?? null] as const;
	},
	listInfinite(params: GetTrainingMaterials.Params, auth?: AuthData) {
		return [trainingMaterial, list, infinite, params, auth ?? null] as const;
	},
	details(auth?: AuthData) {
		return [trainingMaterial, detail, auth ?? null] as const;
	},
	detail(params: GetTrainingMaterial.Params, auth?: AuthData) {
		return [trainingMaterial, detail, params, auth ?? null] as const;
	},
	// versions(auth?: AuthData | undefined) {
	//   return [trainingMaterial, version, auth ?? null] as const
	// },
	version(params: GetTrainingMaterialVersion.Params, auth?: AuthData) {
		return [trainingMaterial, version, params, auth ?? null] as const;
	},
	// histories(auth?: AuthData | undefined) {
	//   return [trainingMaterial, history, auth ?? null] as const
	// },
	history(params: GetTrainingMaterialHistory.Params, auth?: AuthData) {
		return [trainingMaterial, history, params, auth ?? null] as const;
	},
	// informationContributors(auth?: AuthData | undefined) {
	//   return [trainingMaterial, informationContributors, auth ?? null] as const
	// },
	informationContributors(
		params: GetTrainingMaterialInformationContributors.Params,
		auth?: AuthData,
	) {
		return [trainingMaterial, informationContributors, params, auth ?? null] as const;
	},
	// versionInformationContributors(auth?: AuthData | undefined) {
	//   return [trainingMaterial, versionInformationContributors, auth ?? null] as const
	// },
	versionInformationContributors(
		params: GetTrainingMaterialVersionInformationContributors.Params,
		auth?: AuthData,
	) {
		return [trainingMaterial, versionInformationContributors, params, auth ?? null] as const;
	},
	merged(params: GetMergedTrainingMaterial.Params, auth?: AuthData) {
		return [trainingMaterial, merged, params, auth ?? null] as const;
	},
	sources(params: GetTrainingMaterialSources.Params, auth?: AuthData) {
		return [trainingMaterial, sources, params, auth ?? null] as const;
	},
	diff(params: GetTrainingMaterialDiff.Params, auth?: AuthData) {
		return [trainingMaterial, diff, params, auth ?? null] as const;
	},
	diffVersion(params: GetTrainingMaterialVersionDiff.Params, auth?: AuthData) {
		return [trainingMaterial, version, diff, params, auth ?? null] as const;
	},
};

export function useTrainingMaterials<TData = GetTrainingMaterials.Response>(
	params: GetTrainingMaterials.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetTrainingMaterials.Response,
		Error,
		TData,
		ReturnType<typeof keys.list>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.list(params, session),
		({ signal }) => {
			return getTrainingMaterials(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function useTrainingMaterialsInfinite<TData = GetTrainingMaterials.Response>(
	params: GetTrainingMaterials.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		GetTrainingMaterials.Response,
		Error,
		TData,
		GetTrainingMaterials.Response,
		ReturnType<typeof keys.listInfinite>
	>,
) {
	const session = useSession(auth);
	return useInfiniteQuery(
		keys.listInfinite(params, session),
		({ signal, pageParam = params.page }) => {
			return getTrainingMaterials({ ...params, page: pageParam }, session, { signal });
		},
		{
			keepPreviousData: true,
			...options,
			getNextPageParam(lastPage, _allPages) {
				if (lastPage.page < lastPage.pages) {
					return lastPage.page + 1;
				}
				return undefined;
			},
		},
	);
}

export function useTrainingMaterial<TData = GetTrainingMaterial.Response>(
	params: GetTrainingMaterial.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetTrainingMaterial.Response,
		Error,
		TData,
		ReturnType<typeof keys.detail>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.detail(params, session),
		({ signal }) => {
			return getTrainingMaterial(params, session, { signal });
		},
		options,
	);
}

export function useTrainingMaterialVersion<TData = GetTrainingMaterialVersion.Response>(
	params: GetTrainingMaterialVersion.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetTrainingMaterialVersion.Response,
		Error,
		TData,
		ReturnType<typeof keys.version>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.version(params, session),
		({ signal }) => {
			return getTrainingMaterialVersion(params, session, { signal });
		},
		options,
	);
}

export function useTrainingMaterialHistory<TData = GetTrainingMaterialHistory.Response>(
	params: GetTrainingMaterialHistory.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetTrainingMaterialHistory.Response,
		Error,
		TData,
		ReturnType<typeof keys.history>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.history(params, session),
		({ signal }) => {
			return getTrainingMaterialHistory(params, session, { signal });
		},
		options,
	);
}

export function useTrainingMaterialInformationContributors<
	TData = GetTrainingMaterialInformationContributors.Response,
>(
	params: GetTrainingMaterialInformationContributors.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetTrainingMaterialInformationContributors.Response,
		Error,
		TData,
		ReturnType<typeof keys.informationContributors>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.informationContributors(params, session),
		({ signal }) => {
			return getTrainingMaterialInformationContributors(params, session, { signal });
		},
		options,
	);
}

export function useTrainingMaterialVersionInformationContributors<
	TData = GetTrainingMaterialVersionInformationContributors.Response,
>(
	params: GetTrainingMaterialVersionInformationContributors.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetTrainingMaterialVersionInformationContributors.Response,
		Error,
		TData,
		ReturnType<typeof keys.versionInformationContributors>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.versionInformationContributors(params, session),
		({ signal }) => {
			return getTrainingMaterialVersionInformationContributors(params, session, { signal });
		},
		options,
	);
}

export function useCreateTrainingMaterial(
	params: CreateTrainingMaterial.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		CreateTrainingMaterial.Response,
		Error,
		{ data: CreateTrainingMaterial.Body }
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: CreateTrainingMaterial.Body }) => {
			return createTrainingMaterial(params, data, session);
		},
		{
			...options,
			onSuccess(trainingMaterial, ...args) {
				const pathname = itemRoutes.ItemPage("training-material")({
					persistentId: trainingMaterial.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				options?.onSuccess?.(trainingMaterial, ...args);
			},
		},
	);
}

export function useUpdateTrainingMaterial(
	params: UpdateTrainingMaterial.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		UpdateTrainingMaterial.Response,
		Error,
		{ data: UpdateTrainingMaterial.Body }
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: UpdateTrainingMaterial.Body }) => {
			return updateTrainingMaterial(params, data, session);
		},
		{
			...options,
			onSuccess(trainingMaterial, ...args) {
				const pathname = itemRoutes.ItemPage("training-material")({
					persistentId: trainingMaterial.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }));
				options?.onSuccess?.(trainingMaterial, ...args);
			},
		},
	);
}

export function useDeleteTrainingMaterial(
	params: DeleteTrainingMaterial.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteTrainingMaterial.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return deleteTrainingMaterial(params, session);
		},
		{
			...options,
			onSuccess(...args) {
				const pathname = itemRoutes.ItemPage("training-material")({
					persistentId: params.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useDeleteTrainingMaterialVersion(
	params: DeleteTrainingMaterialVersion.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteTrainingMaterialVersion.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return deleteTrainingMaterialVersion(params, session);
		},
		{
			...options,
			onSuccess(...args) {
				const pathname = itemRoutes.ItemPage("training-material")({
					persistentId: params.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useRevertTrainingMaterialToVersion(
	params: RevertTrainingMaterialToVersion.Params,
	auth?: AuthData,
	options?: UseMutationOptions<RevertTrainingMaterialToVersion.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return revertTrainingMaterialToVersion(params, session);
		},
		{
			...options,
			onSuccess(trainingMaterial, ...args) {
				const pathname = itemRoutes.ItemPage("training-material")({
					persistentId: trainingMaterial.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }));
				options?.onSuccess?.(trainingMaterial, ...args);
			},
		},
	);
}

export const useApproveTrainingMaterialVersion = useRevertTrainingMaterialToVersion;
export const useRejectTrainingMaterialVersion = useDeleteTrainingMaterialVersion;

export function useCommitDraftTrainingMaterial(
	params: CommitDraftTrainingMaterial.Params,
	auth?: AuthData,
	options?: UseMutationOptions<CommitDraftTrainingMaterial.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return commitDraftTrainingMaterial(params, session);
		},
		{
			...options,
			onSuccess(trainingMaterial, ...args) {
				const pathname = itemRoutes.ItemPage("training-material")({
					persistentId: trainingMaterial.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }));
				queryClient.invalidateQueries(itemKeys.drafts());
				options?.onSuccess?.(trainingMaterial, ...args);
			},
		},
	);
}

export function useMergedTrainingMaterial<TData = GetMergedTrainingMaterial.Response>(
	params: GetMergedTrainingMaterial.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetMergedTrainingMaterial.Response,
		Error,
		TData,
		ReturnType<typeof keys.merged>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.merged(params, session),
		({ signal }) => {
			return getMergedTrainingMaterial(params, session, { signal });
		},
		options,
	);
}

export function useMergeTrainingMaterials(
	params: MergeTrainingMaterials.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		MergeTrainingMaterials.Response,
		Error,
		{ data: MergeTrainingMaterials.Body }
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: MergeTrainingMaterials.Body }) => {
			return mergeTrainingMaterials(params, data, session);
		},
		{
			...options,
			onSuccess(trainingMaterial, ...args) {
				const pathname = itemRoutes.ItemPage("training-material")({
					persistentId: trainingMaterial.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				options?.onSuccess?.(trainingMaterial, ...args);
			},
		},
	);
}

export function useTrainingMaterialDiff<TData = GetTrainingMaterialDiff.Response>(
	params: GetTrainingMaterialDiff.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetTrainingMaterialDiff.Response,
		Error,
		TData,
		ReturnType<typeof keys.diff>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.diff(params, session),
		({ signal }) => {
			return getTrainingMaterialDiff(params, session, { signal });
		},
		options,
	);
}

export function useTrainingMaterialVersionDiff<TData = GetTrainingMaterialVersionDiff.Response>(
	params: GetTrainingMaterialVersionDiff.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetTrainingMaterialVersionDiff.Response,
		Error,
		TData,
		ReturnType<typeof keys.diffVersion>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.diffVersion(params, session),
		({ signal }) => {
			return getTrainingMaterialVersionDiff(params, session, { signal });
		},
		options,
	);
}

export function useTrainingMaterialSources<TData = GetTrainingMaterialSources.Response>(
	params: GetTrainingMaterialSources.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetTrainingMaterialSources.Response,
		Error,
		TData,
		ReturnType<typeof keys.sources>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.sources(params, session),
		({ signal }) => {
			return getTrainingMaterialSources(params, session, { signal });
		},
		options,
	);
}
