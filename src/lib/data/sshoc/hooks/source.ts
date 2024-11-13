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
  CreateSource,
  DeleteSource,
  GetSource,
  GetSources,
  UpdateSource,
} from "@/lib/data/sshoc/api/source";
import {
  createSource,
  deleteSource,
  getSource,
  getSources,
  updateSource,
} from "@/lib/data/sshoc/api/source";
import { useSession } from "@/lib/data/sshoc/lib/useSession";

/** scope */
const source = "source";
/** kind */
const list = "list";
const detail = "detail";
const infinite = "infinite";

export const keys = {
  all(auth?: AuthData | undefined) {
    return [source, auth ?? null] as const;
  },
  lists(auth?: AuthData | undefined) {
    return [source, list, auth ?? null] as const;
  },
  list(params: GetSources.Params, auth?: AuthData | undefined) {
    return [source, list, params, auth ?? null] as const;
  },
  listInfinite(params: GetSources.Params, auth?: AuthData | undefined) {
    return [source, list, infinite, params, auth ?? null] as const;
  },
  details(auth?: AuthData | undefined) {
    return [source, detail, auth ?? null] as const;
  },
  detail(params: GetSource.Params, auth?: AuthData | undefined) {
    return [source, detail, params, auth ?? null] as const;
  },
};

export function useSources<TData = GetSources.Response>(
  params: GetSources.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetSources.Response,
    Error,
    TData,
    ReturnType<typeof keys.list>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.list(params, session),
    ({ signal }) => {
      return getSources(params, session, { signal });
    },
    { keepPreviousData: true, ...options }
  );
}

export function useSourcesInfinite<TData = GetSources.Response>(
  params: GetSources.Params,
  auth?: AuthData | undefined,
  options?: UseInfiniteQueryOptions<
    GetSources.Response,
    Error,
    TData,
    GetSources.Response,
    ReturnType<typeof keys.listInfinite>
  >
) {
  const session = useSession(auth);
  return useInfiniteQuery(
    keys.listInfinite(params, session),
    ({ signal, pageParam = params.page }) => {
      return getSources({ ...params, page: pageParam }, session, { signal });
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

export function useSource<TData = GetSource.Response>(
  params: GetSource.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetSource.Response,
    Error,
    TData,
    ReturnType<typeof keys.detail>
  >
) {
  const session = useSession(auth);
  return useQuery(
    keys.detail(params, session),
    ({ signal }) => {
      return getSource(params, session, { signal });
    },
    options
  );
}

export function useCreateSource(
  auth?: AuthData | undefined,
  options?: UseMutationOptions<
    CreateSource.Response,
    Error,
    { data: CreateSource.Body }
  >
) {
  const queryClient = useQueryClient();
  const session = useSession(auth);
  return useMutation(
    ({ data }: { data: CreateSource.Body }) => {
      return createSource(data, session);
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.lists());
        options?.onSuccess?.(...args);
      },
    }
  );
}

export function useUpdateSource(
  params: UpdateSource.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<
    UpdateSource.Response,
    Error,
    { data: UpdateSource.Body }
  >
) {
  const queryClient = useQueryClient();
  const session = useSession(auth);
  return useMutation(
    ({ data }: { data: UpdateSource.Body }) => {
      return updateSource(params, data, session);
    },
    {
      ...options,
      onSuccess(source, ...args) {
        queryClient.invalidateQueries(keys.lists());
        queryClient.invalidateQueries(keys.detail({ id: source.id }));
        options?.onSuccess?.(source, ...args);
      },
    }
  );
}

export function useDeleteSource(
  params: DeleteSource.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<DeleteSource.Response, Error>
) {
  const queryClient = useQueryClient();
  const session = useSession(auth);
  return useMutation(
    () => {
      return deleteSource(params, session);
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.lists());
        queryClient.invalidateQueries(keys.detail({ id: params.id }));
        options?.onSuccess?.(...args);
      },
    }
  );
}
