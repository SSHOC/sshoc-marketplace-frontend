import type {
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "react-query";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

import type { AuthData } from "@/lib/data/sshoc/api/common";
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
} from "@/lib/data/sshoc/api/dataset";
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
} from "@/lib/data/sshoc/api/dataset";
import { keys as itemKeys } from "@/lib/data/sshoc/hooks/item";
import { useSession } from "@/lib/data/sshoc/lib/useSession";
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
  all(auth?: AuthData | undefined) {
    return [dataset, auth ?? null] as const;
  },
  lists(auth?: AuthData | undefined) {
    return [dataset, list, auth ?? null] as const;
  },
  list(params: GetDatasets.Params, auth?: AuthData | undefined) {
    return [dataset, list, params, auth ?? null] as const;
  },
  listInfinite(params: GetDatasets.Params, auth?: AuthData | undefined) {
    return [dataset, list, infinite, params, auth ?? null] as const;
  },
  details(auth?: AuthData | undefined) {
    return [dataset, detail, auth ?? null] as const;
  },
  detail(params: GetDataset.Params, auth?: AuthData | undefined) {
    return [dataset, detail, params, auth ?? null] as const;
  },
  // versions(auth?: AuthData | undefined) {
  //   return [dataset, version, auth ?? null] as const
  // },
  version(params: GetDatasetVersion.Params, auth?: AuthData | undefined) {
    return [dataset, version, params, auth ?? null] as const;
  },
  // histories(auth?: AuthData | undefined) {
  //   return [dataset, history, auth ?? null] as const
  // },
  history(params: GetDatasetHistory.Params, auth?: AuthData | undefined) {
    return [dataset, history, params, auth ?? null] as const;
  },
  // informationContributors(auth?: AuthData | undefined) {
  //   return [dataset, informationContributors, auth ?? null] as const
  // },
  informationContributors(
    params: GetDatasetInformationContributors.Params,
    auth?: AuthData | undefined
  ) {
    return [dataset, informationContributors, params, auth ?? null] as const;
  },
  // versionInformationContributors(auth?: AuthData | undefined) {
  //   return [dataset, versionInformationContributors, auth ?? null] as const
  // },
  versionInformationContributors(
    params: GetDatasetVersionInformationContributors.Params,
    auth?: AuthData | undefined
  ) {
    return [
      dataset,
      versionInformationContributors,
      params,
      auth ?? null,
    ] as const;
  },
  merged(params: GetMergedDataset.Params, auth?: AuthData | undefined) {
    return [dataset, merged, params, auth ?? null] as const;
  },
  sources(params: GetDatasetSources.Params, auth?: AuthData | undefined) {
    return [dataset, sources, params, auth ?? null] as const;
  },
  diff(params: GetDatasetDiff.Params, auth?: AuthData | undefined) {
    return [dataset, diff, params, auth ?? null] as const;
  },
  diffVersion(
    params: GetDatasetVersionDiff.Params,
    auth?: AuthData | undefined
  ) {
    return [dataset, version, diff, params, auth ?? null] as const;
  },
};

export function useDatasets<TData = GetDatasets.Response>(
  params: GetDatasets.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetDatasets.Response,
    Error,
    TData,
    ReturnType<typeof keys.list>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.list(params, session),
    ({ signal }) => {
      return getDatasets(params, session, { signal });
    },
    { keepPreviousData: true, ...options }
  );
}

export function useDatasetsInfinite<TData = GetDatasets.Response>(
  params: GetDatasets.Params,
  auth?: AuthData | undefined,
  options?: UseInfiniteQueryOptions<
    GetDatasets.Response,
    Error,
    TData,
    GetDatasets.Response,
    ReturnType<typeof keys.listInfinite>
  >
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
        if (lastPage.page < lastPage.pages) return lastPage.page + 1;
        return undefined;
      },
    }
  );
}

export function useDataset<TData = GetDataset.Response>(
  params: GetDataset.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetDataset.Response,
    Error,
    TData,
    ReturnType<typeof keys.detail>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.detail(params, session),
    ({ signal }) => {
      return getDataset(params, session, { signal });
    },
    options
  );
}

export function useDatasetVersion<TData = GetDatasetVersion.Response>(
  params: GetDatasetVersion.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetDatasetVersion.Response,
    Error,
    TData,
    ReturnType<typeof keys.version>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.version(params, session),
    ({ signal }) => {
      return getDatasetVersion(params, session, { signal });
    },
    options
  );
}

export function useDatasetHistory<TData = GetDatasetHistory.Response>(
  params: GetDatasetHistory.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetDatasetHistory.Response,
    Error,
    TData,
    ReturnType<typeof keys.history>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.history(params, session),
    ({ signal }) => {
      return getDatasetHistory(params, session, { signal });
    },
    options
  );
}

export function useDatasetInformationContributors<
  TData = GetDatasetInformationContributors.Response
>(
  params: GetDatasetInformationContributors.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetDatasetInformationContributors.Response,
    Error,
    TData,
    ReturnType<typeof keys.informationContributors>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.informationContributors(params, session),
    ({ signal }) => {
      return getDatasetInformationContributors(params, session, { signal });
    },
    options
  );
}

export function useDatasetVersionInformationContributors<
  TData = GetDatasetVersionInformationContributors.Response
>(
  params: GetDatasetVersionInformationContributors.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetDatasetVersionInformationContributors.Response,
    Error,
    TData,
    ReturnType<typeof keys.versionInformationContributors>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.versionInformationContributors(params, session),
    ({ signal }) => {
      return getDatasetVersionInformationContributors(params, session, {
        signal,
      });
    },
    options
  );
}

export function useCreateDataset(
  params: CreateDataset.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<
    CreateDataset.Response,
    Error,
    { data: CreateDataset.Body }
  >
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
        }).pathname;
        revalidate({ pathname });
        queryClient.invalidateQueries(itemKeys.search());
        queryClient.invalidateQueries(keys.lists());
        options?.onSuccess?.(dataset, ...args);
      },
    }
  );
}

export function useUpdateDataset(
  params: UpdateDataset.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<
    UpdateDataset.Response,
    Error,
    { data: UpdateDataset.Body }
  >
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
        }).pathname;
        revalidate({ pathname });
        queryClient.invalidateQueries(itemKeys.search());
        queryClient.invalidateQueries(keys.lists());
        queryClient.invalidateQueries(
          keys.detail({ persistentId: params.persistentId })
        );
        options?.onSuccess?.(dataset, ...args);
      },
    }
  );
}

export function useDeleteDataset(
  params: DeleteDataset.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<DeleteDataset.Response, Error>
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
        }).pathname;
        revalidate({ pathname });
        queryClient.invalidateQueries(itemKeys.search());
        queryClient.invalidateQueries(keys.lists());
        queryClient.invalidateQueries(
          keys.detail({ persistentId: params.persistentId })
        );
        options?.onSuccess?.(...args);
      },
    }
  );
}

export function useDeleteDatasetVersion(
  params: DeleteDatasetVersion.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<DeleteDatasetVersion.Response, Error>
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
        }).pathname;
        revalidate({ pathname });
        queryClient.invalidateQueries(itemKeys.search());
        queryClient.invalidateQueries(keys.lists());
        queryClient.invalidateQueries(
          keys.detail({ persistentId: params.persistentId })
        );
        options?.onSuccess?.(...args);
      },
    }
  );
}

export function useRevertDatasetToVersion(
  params: RevertDatasetToVersion.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<RevertDatasetToVersion.Response, Error>
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
        }).pathname;
        revalidate({ pathname });
        queryClient.invalidateQueries(itemKeys.search());
        queryClient.invalidateQueries(keys.lists());
        queryClient.invalidateQueries(
          keys.detail({ persistentId: params.persistentId })
        );
        options?.onSuccess?.(dataset, ...args);
      },
    }
  );
}

export const useApproveDatasetVersion = useRevertDatasetToVersion;
export const useRejectDatasetVersion = useDeleteDatasetVersion;

export function useCommitDraftDataset(
  params: CommitDraftDataset.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<CommitDraftDataset.Response, Error>
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
        }).pathname;
        revalidate({ pathname });
        queryClient.invalidateQueries(itemKeys.search());
        queryClient.invalidateQueries(keys.lists());
        queryClient.invalidateQueries(
          keys.detail({ persistentId: params.persistentId })
        );
        queryClient.invalidateQueries(itemKeys.drafts());
        options?.onSuccess?.(dataset, ...args);
      },
    }
  );
}

export function useMergedDataset<TData = GetMergedDataset.Response>(
  params: GetMergedDataset.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetMergedDataset.Response,
    Error,
    TData,
    ReturnType<typeof keys.merged>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.merged(params, session),
    ({ signal }) => {
      return getMergedDataset(params, session, { signal });
    },
    options
  );
}

export function useMergeDatasets(
  params: MergeDatasets.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<
    MergeDatasets.Response,
    Error,
    { data: MergeDatasets.Body }
  >
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
        }).pathname;
        revalidate({ pathname });
        queryClient.invalidateQueries(itemKeys.search());
        queryClient.invalidateQueries(keys.lists());
        options?.onSuccess?.(dataset, ...args);
      },
    }
  );
}

export function useDatasetDiff<TData = GetDatasetDiff.Response>(
  params: GetDatasetDiff.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetDatasetDiff.Response,
    Error,
    TData,
    ReturnType<typeof keys.diff>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.diff(params, session),
    ({ signal }) => {
      return getDatasetDiff(params, session, { signal });
    },
    options
  );
}

export function useDatasetVersionDiff<TData = GetDatasetVersionDiff.Response>(
  params: GetDatasetVersionDiff.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetDatasetVersionDiff.Response,
    Error,
    TData,
    ReturnType<typeof keys.diffVersion>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.diffVersion(params, session),
    ({ signal }) => {
      return getDatasetVersionDiff(params, session, { signal });
    },
    options
  );
}

export function useDatasetSources<TData = GetDatasetSources.Response>(
  params: GetDatasetSources.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetDatasetSources.Response,
    Error,
    TData,
    ReturnType<typeof keys.sources>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.sources(params, session),
    ({ signal }) => {
      return getDatasetSources(params, session, { signal });
    },
    options
  );
}
