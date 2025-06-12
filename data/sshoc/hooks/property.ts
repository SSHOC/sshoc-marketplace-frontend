import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from "react-query";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

import type { AuthData } from "@/data/sshoc/api/common";
import type {
	CreatePropertyType,
	DeletePropertyType,
	GetPropertyType,
	GetPropertyTypes,
	ReorderPropertyTypes,
	UpdatePropertyType,
} from "@/data/sshoc/api/property";
import {
	createPropertyType,
	deletePropertyType,
	getPropertyType,
	getPropertyTypes,
	reorderPropertyTypes,
	updatePropertyType,
} from "@/data/sshoc/api/property";
import { useSession } from "@/data/sshoc/lib/useSession";

/** scope */
const propertyType = "property-type";
/** kind */
const list = "list";
const detail = "detail";
const infinite = "infinite";

export const keys = {
	all(auth?: AuthData) {
		return [propertyType, auth ?? {}] as const;
	},
	lists(auth?: AuthData) {
		return [propertyType, list, auth ?? {}] as const;
	},
	list(params: GetPropertyTypes.Params, auth?: AuthData) {
		return [propertyType, list, params, auth ?? {}] as const;
	},
	listInfinite(params: GetPropertyTypes.Params, auth?: AuthData) {
		return [propertyType, list, infinite, params, auth ?? {}] as const;
	},
	details(auth?: AuthData) {
		return [propertyType, detail, auth ?? {}] as const;
	},
	detail(params: GetPropertyType.Params, auth?: AuthData) {
		return [propertyType, detail, params, auth ?? {}] as const;
	},
};

export function usePropertyTypes<TData = GetPropertyTypes.Response>(
	params: GetPropertyTypes.Params,
	auth?: AuthData,
	options?: UseQueryOptions<GetPropertyTypes.Response, Error, TData, ReturnType<typeof keys.list>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.list(params, session),
		({ signal }) => {
			return getPropertyTypes(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function usePropertyTypesInfinite<TData = GetPropertyTypes.Response>(
	params: GetPropertyTypes.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		GetPropertyTypes.Response,
		Error,
		TData,
		GetPropertyTypes.Response,
		ReturnType<typeof keys.listInfinite>
	>,
) {
	const session = useSession(auth);
	return useInfiniteQuery(
		keys.listInfinite(params, session),
		({ signal, pageParam = params.page }) => {
			return getPropertyTypes({ ...params, page: pageParam }, session, { signal });
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

export function usePropertyType<TData = GetPropertyType.Response>(
	params: GetPropertyType.Params,
	auth?: AuthData,
	options?: UseQueryOptions<GetPropertyType.Response, Error, TData, ReturnType<typeof keys.detail>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.detail(params, session),
		({ signal }) => {
			return getPropertyType(params, session, { signal });
		},
		options,
	);
}

export function useCreatePropertyType(
	auth?: AuthData,
	options?: UseMutationOptions<
		CreatePropertyType.Response,
		Error,
		{ data: CreatePropertyType.Body }
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: CreatePropertyType.Body }) => {
			return createPropertyType(data, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.lists());
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useUpdatePropertyType(
	params: UpdatePropertyType.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		UpdatePropertyType.Response,
		Error,
		{ data: UpdatePropertyType.Body }
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: UpdatePropertyType.Body }) => {
			return updatePropertyType(params, data, session);
		},
		{
			...options,
			onSuccess(propertyType, ...args) {
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ code: propertyType.code }));
				options?.onSuccess?.(propertyType, ...args);
			},
		},
	);
}

export function useDeletePropertyType(
	params: DeletePropertyType.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeletePropertyType.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return deletePropertyType(params, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ code: params.code }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useReorderPropertyTypes(
	auth?: AuthData,
	options?: UseMutationOptions<
		ReorderPropertyTypes.Response,
		Error,
		{ data: ReorderPropertyTypes.Body }
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: ReorderPropertyTypes.Body }) => {
			return reorderPropertyTypes(data, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.lists());
				options?.onSuccess?.(...args);
			},
		},
	);
}
