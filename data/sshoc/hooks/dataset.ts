import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from "react-query";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

import type { AuthData } from "@/data/sshoc/api/common";
import type {
	CommitDraftDataset,
	CreateDataset,
	DeleteDataset,
	DeleteDatasetVersion,
	GetDataset,
	GetDatasetDiff,
	GetDatasetHistory,
	GetDatasetInformationContributors,
	GetDatasets,
	GetDatasetSources,
	GetDatasetVersion,
	GetDatasetVersionDiff,
	GetDatasetVersionInformationContributors,
	GetMergedDataset,
	MergeDatasets,
	RevertDatasetToVersion,
	UpdateDataset,
} from "@/data/sshoc/api/dataset";
import {
	commitDraftDataset,
	createDataset,
	deleteDataset,
	deleteDatasetVersion,
	getDataset,
	getDatasetDiff,
	getDatasetHistory,
	getDatasetInformationContributors,
	getDatasets,
	getDatasetSources,
	getDatasetVersion,
	getDatasetVersionDiff,
	getDatasetVersionInformationContributors,
	getMergedDataset,
	mergeDatasets,
	revertDatasetToVersion,
	updateDataset,
} from "@/data/sshoc/api/dataset";
import { keys as itemKeys } from "@/data/sshoc/hooks/item";
import { useSession } from "@/data/sshoc/lib/useSession";
import { revalidate } from "@/lib/core/app/revalidate";
import { itemRoutes } from "@/lib/core/navigation/item-routes";

// TODO: This needs some hierarchy, to be able to effectively use React Query's
// query invalidation with partial query key matching.
/** scope */
const dataset = "dataset";
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
		return [dataset, auth ?? {}] as const;
	},
	lists(auth?: AuthData) {
		return [dataset, list, auth ?? {}] as const;
	},
	list(params: GetDatasets.Params, auth?: AuthData) {
		return [dataset, list, params, auth ?? {}] as const;
	},
	listInfinite(params: GetDatasets.Params, auth?: AuthData) {
		return [dataset, list, infinite, params, auth ?? {}] as const;
	},
	details(auth?: AuthData) {
		return [dataset, detail, auth ?? {}] as const;
	},
	detail(params: GetDataset.Params, auth?: AuthData) {
		return [dataset, detail, params, auth ?? {}] as const;
	},
	// versions(auth?: AuthData | undefined) {
	//   return [dataset, version, auth ?? {}] as const
	// },
	version(params: GetDatasetVersion.Params, auth?: AuthData) {
		return [dataset, version, params, auth ?? {}] as const;
	},
	// histories(auth?: AuthData | undefined) {
	//   return [dataset, history, auth ?? {}] as const
	// },
	history(params: GetDatasetHistory.Params, auth?: AuthData) {
		return [dataset, history, params, auth ?? {}] as const;
	},
	// informationContributors(auth?: AuthData | undefined) {
	//   return [dataset, informationContributors, auth ?? {}] as const
	// },
	informationContributors(params: GetDatasetInformationContributors.Params, auth?: AuthData) {
		return [dataset, informationContributors, params, auth ?? {}] as const;
	},
	// versionInformationContributors(auth?: AuthData | undefined) {
	//   return [dataset, versionInformationContributors, auth ?? {}] as const
	// },
	versionInformationContributors(
		params: GetDatasetVersionInformationContributors.Params,
		auth?: AuthData,
	) {
		return [dataset, versionInformationContributors, params, auth ?? {}] as const;
	},
	merged(params: GetMergedDataset.Params, auth?: AuthData) {
		return [dataset, merged, params, auth ?? {}] as const;
	},
	sources(params: GetDatasetSources.Params, auth?: AuthData) {
		return [dataset, sources, params, auth ?? {}] as const;
	},
	diff(params: GetDatasetDiff.Params, auth?: AuthData) {
		return [dataset, diff, params, auth ?? {}] as const;
	},
	diffVersion(params: GetDatasetVersionDiff.Params, auth?: AuthData) {
		return [dataset, version, diff, params, auth ?? {}] as const;
	},
};

export function useDatasets<TData = GetDatasets.Response>(
	params: GetDatasets.Params,
	auth?: AuthData,
	options?: UseQueryOptions<GetDatasets.Response, Error, TData, ReturnType<typeof keys.list>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.list(params, session),
		({ signal }) => {
			return getDatasets(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function useDatasetsInfinite<TData = GetDatasets.Response>(
	params: GetDatasets.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		GetDatasets.Response,
		Error,
		TData,
		GetDatasets.Response,
		ReturnType<typeof keys.listInfinite>
	>,
) {
	const session = useSession(auth);
	return useInfiniteQuery(
		keys.listInfinite(params, session),
		({ signal, pageParam = params.page }) => {
			return getDatasets({ ...params, page: pageParam }, session, { signal });
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

export function useDataset<TData = GetDataset.Response>(
	params: GetDataset.Params,
	auth?: AuthData,
	options?: UseQueryOptions<GetDataset.Response, Error, TData, ReturnType<typeof keys.detail>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.detail(params, session),
		({ signal }) => {
			return getDataset(params, session, { signal });
		},
		options,
	);
}

export function useDatasetVersion<TData = GetDatasetVersion.Response>(
	params: GetDatasetVersion.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetDatasetVersion.Response,
		Error,
		TData,
		ReturnType<typeof keys.version>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.version(params, session),
		({ signal }) => {
			return getDatasetVersion(params, session, { signal });
		},
		options,
	);
}

export function useDatasetHistory<TData = GetDatasetHistory.Response>(
	params: GetDatasetHistory.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetDatasetHistory.Response,
		Error,
		TData,
		ReturnType<typeof keys.history>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.history(params, session),
		({ signal }) => {
			return getDatasetHistory(params, session, { signal });
		},
		options,
	);
}

export function useDatasetInformationContributors<
	TData = GetDatasetInformationContributors.Response,
>(
	params: GetDatasetInformationContributors.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetDatasetInformationContributors.Response,
		Error,
		TData,
		ReturnType<typeof keys.informationContributors>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.informationContributors(params, session),
		({ signal }) => {
			return getDatasetInformationContributors(params, session, { signal });
		},
		options,
	);
}

export function useDatasetVersionInformationContributors<
	TData = GetDatasetVersionInformationContributors.Response,
>(
	params: GetDatasetVersionInformationContributors.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetDatasetVersionInformationContributors.Response,
		Error,
		TData,
		ReturnType<typeof keys.versionInformationContributors>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.versionInformationContributors(params, session),
		({ signal }) => {
			return getDatasetVersionInformationContributors(params, session, { signal });
		},
		options,
	);
}

export function useCreateDataset(
	params: CreateDataset.Params,
	auth?: AuthData,
	options?: UseMutationOptions<CreateDataset.Response, Error, { data: CreateDataset.Body }>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: CreateDataset.Body }) => {
			return createDataset(params, data, session);
		},
		{
			...options,
			onSuccess(dataset, ...args) {
				const pathname = itemRoutes.ItemPage("dataset")({
					persistentId: dataset.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				options?.onSuccess?.(dataset, ...args);
			},
		},
	);
}

export function useUpdateDataset(
	params: UpdateDataset.Params,
	auth?: AuthData,
	options?: UseMutationOptions<UpdateDataset.Response, Error, { data: UpdateDataset.Body }>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: UpdateDataset.Body }) => {
			return updateDataset(params, data, session);
		},
		{
			...options,
			onSuccess(dataset, ...args) {
				const pathname = itemRoutes.ItemPage("dataset")({
					persistentId: dataset.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }));
				options?.onSuccess?.(dataset, ...args);
			},
		},
	);
}

export function useDeleteDataset(
	params: DeleteDataset.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteDataset.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return deleteDataset(params, session);
		},
		{
			...options,
			onSuccess(...args) {
				const pathname = itemRoutes.ItemPage("dataset")({
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

export function useDeleteDatasetVersion(
	params: DeleteDatasetVersion.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteDatasetVersion.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return deleteDatasetVersion(params, session);
		},
		{
			...options,
			onSuccess(...args) {
				const pathname = itemRoutes.ItemPage("dataset")({
					persistentId: params.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }));
				queryClient.invalidateQueries(itemKeys.drafts());
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useRevertDatasetToVersion(
	params: RevertDatasetToVersion.Params,
	auth?: AuthData,
	options?: UseMutationOptions<RevertDatasetToVersion.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return revertDatasetToVersion(params, session);
		},
		{
			...options,
			onSuccess(dataset, ...args) {
				const pathname = itemRoutes.ItemPage("dataset")({
					persistentId: dataset.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }));
				options?.onSuccess?.(dataset, ...args);
			},
		},
	);
}

export const useApproveDatasetVersion = useRevertDatasetToVersion;
export const useRejectDatasetVersion = useDeleteDatasetVersion;

export function useCommitDraftDataset(
	params: CommitDraftDataset.Params,
	auth?: AuthData,
	options?: UseMutationOptions<CommitDraftDataset.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return commitDraftDataset(params, session);
		},
		{
			...options,
			onSuccess(dataset, ...args) {
				const pathname = itemRoutes.ItemPage("dataset")({
					persistentId: dataset.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ persistentId: params.persistentId }));
				queryClient.invalidateQueries(itemKeys.drafts());
				options?.onSuccess?.(dataset, ...args);
			},
		},
	);
}

export function useMergedDataset<TData = GetMergedDataset.Response>(
	params: GetMergedDataset.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetMergedDataset.Response,
		Error,
		TData,
		ReturnType<typeof keys.merged>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.merged(params, session),
		({ signal }) => {
			return getMergedDataset(params, session, { signal });
		},
		options,
	);
}

export function useMergeDatasets(
	params: MergeDatasets.Params,
	auth?: AuthData,
	options?: UseMutationOptions<MergeDatasets.Response, Error, { data: MergeDatasets.Body }>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: MergeDatasets.Body }) => {
			return mergeDatasets(params, data, session);
		},
		{
			...options,
			onSuccess(dataset, ...args) {
				const pathname = itemRoutes.ItemPage("dataset")({
					persistentId: dataset.persistentId,
				});
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(keys.lists());
				options?.onSuccess?.(dataset, ...args);
			},
		},
	);
}

export function useDatasetDiff<TData = GetDatasetDiff.Response>(
	params: GetDatasetDiff.Params,
	auth?: AuthData,
	options?: UseQueryOptions<GetDatasetDiff.Response, Error, TData, ReturnType<typeof keys.diff>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.diff(params, session),
		({ signal }) => {
			return getDatasetDiff(params, session, { signal });
		},
		options,
	);
}

export function useDatasetVersionDiff<TData = GetDatasetVersionDiff.Response>(
	params: GetDatasetVersionDiff.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetDatasetVersionDiff.Response,
		Error,
		TData,
		ReturnType<typeof keys.diffVersion>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.diffVersion(params, session),
		({ signal }) => {
			return getDatasetVersionDiff(params, session, { signal });
		},
		options,
	);
}

export function useDatasetSources<TData = GetDatasetSources.Response>(
	params: GetDatasetSources.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetDatasetSources.Response,
		Error,
		TData,
		ReturnType<typeof keys.sources>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.sources(params, session),
		({ signal }) => {
			return getDatasetSources(params, session, { signal });
		},
		options,
	);
}
