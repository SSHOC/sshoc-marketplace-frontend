import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from "react-query";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

import type { AuthData } from "@/data/sshoc/api/common";
import type {
	CreateUser,
	GetUser,
	GetUsers,
	UpdateUserDisplayName,
	UpdateUserPassword,
	UpdateUserRole,
	UpdateUserStatus,
} from "@/data/sshoc/api/user";
import {
	createUser,
	getUser,
	getUsers,
	updateUserDisplayName,
	updateUserPassword,
	updateUserRole,
	updateUserStatus,
} from "@/data/sshoc/api/user";
import { useSession } from "@/data/sshoc/lib/useSession";

/** scope */
const user = "user";
/** kind */
const list = "list";
const detail = "detail";
const infinite = "infinite";

export const keys = {
	all(auth?: AuthData) {
		return [user, auth ?? {}] as const;
	},
	lists(auth?: AuthData) {
		return [user, list, auth ?? {}] as const;
	},
	list(params: GetUsers.Params, auth?: AuthData) {
		return [user, list, params, auth ?? {}] as const;
	},
	listInfinite(params: GetUsers.Params, auth?: AuthData) {
		return [user, list, infinite, params, auth ?? {}] as const;
	},
	details(auth?: AuthData) {
		return [user, detail, auth ?? {}] as const;
	},
	detail(params: GetUser.Params, auth?: AuthData) {
		return [user, detail, params, auth ?? {}] as const;
	},
};

export function useUsers<TData = GetUsers.Response>(
	params: GetUsers.Params,
	auth?: AuthData,
	options?: UseQueryOptions<GetUsers.Response, Error, TData, ReturnType<typeof keys.list>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.list(params, session),
		({ signal }) => {
			return getUsers(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function useUsersInfinite<TData = GetUsers.Response>(
	params: GetUsers.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		GetUsers.Response,
		Error,
		TData,
		GetUsers.Response,
		ReturnType<typeof keys.listInfinite>
	>,
) {
	const session = useSession(auth);
	return useInfiniteQuery(
		keys.listInfinite(params, session),
		({ signal, pageParam = params.page }) => {
			return getUsers({ ...params, page: pageParam }, session, { signal });
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

export function useUser<TData = GetUser.Response>(
	params: GetUser.Params,
	auth?: AuthData,
	options?: UseQueryOptions<GetUser.Response, Error, TData, ReturnType<typeof keys.detail>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.detail(params, session),
		({ signal }) => {
			return getUser(params, session, { signal });
		},
		options,
	);
}

export namespace UseCreateUser {
	export interface Variables {
		data: CreateUser.Body;
	}
}

export function useCreateUser(
	auth?: AuthData,
	options?: UseMutationOptions<CreateUser.Response, Error, UseCreateUser.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: UseCreateUser.Variables) => {
			return createUser(data, session);
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

export namespace UseUpdateUserDisplayName {
	export type Variables = Partial<UpdateUserDisplayName.Params> & {
		data: UpdateUserDisplayName.Body;
	};
}

export function useUpdateUserDisplayName(
	params: UpdateUserDisplayName.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		UpdateUserDisplayName.Response,
		Error,
		UseUpdateUserDisplayName.Variables
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data, ...parameters }: UseUpdateUserDisplayName.Variables) => {
			return updateUserDisplayName({ ...params, ...parameters }, data, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ id: params.id }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export namespace UseUpdateUserPassword {
	export type Variables = Partial<UpdateUserPassword.Params> & { data: UpdateUserPassword.Body };
}

export function useUpdateUserPassword(
	params: UpdateUserPassword.Params,
	auth?: AuthData,
	options?: UseMutationOptions<UpdateUserPassword.Response, Error, UseUpdateUserPassword.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data, ...parameters }: UseUpdateUserPassword.Variables) => {
			return updateUserPassword({ ...params, ...parameters }, data, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ id: params.id }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export namespace UseUpdateUserRole {
	export type Variables = Partial<UpdateUserRole.Params>;
}

export function useUpdateUserRole(
	params: UpdateUserRole.Params,
	auth?: AuthData,
	options?: UseMutationOptions<UpdateUserRole.Response, Error, UseUpdateUserRole.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ ...parameters }: UseUpdateUserRole.Variables) => {
			return updateUserRole({ ...params, ...parameters }, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ id: params.id }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export namespace UseUpdateUserStatus {
	export type Variables = Partial<UpdateUserStatus.Params>;
}

export function useUpdateUserStatus(
	params: UpdateUserStatus.Params,
	auth?: AuthData,
	options?: UseMutationOptions<UpdateUserStatus.Response, Error, UseUpdateUserStatus.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		async ({ ...parameters }: UseUpdateUserStatus.Variables) => {
			return updateUserStatus({ ...params, ...parameters }, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ id: params.id }));
				options?.onSuccess?.(...args);
			},
		},
	);
}
