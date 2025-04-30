import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from "react-query";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

import type { AuthData } from "@/data/sshoc/api/common";
import type {
	CreateItemComment,
	CreateItemRelation,
	CreateItemRelationKind,
	CreateItemSource,
	DeleteItemComment,
	DeleteItemRelation,
	DeleteItemRelationKind,
	DeleteItemSource,
	GetContributedItems,
	GetDraftItems,
	GetItemCategories,
	GetItemComments,
	GetItemRelationKind,
	GetItemRelations,
	GetItemsBySource,
	GetItemsBySourceItem,
	GetItemSource,
	GetItemSources,
	GetLastItemComments,
	ItemAutocomplete,
	ItemSearch,
	UpdateItemComment,
	UpdateItemRelationKind,
	UpdateItemSource,
} from "@/data/sshoc/api/item";
import {
	autocompleteItems,
	createItemComment,
	createItemRelation,
	createItemRelationKind,
	createItemSource,
	deleteItemComment,
	deleteItemRelation,
	deleteItemRelationKind,
	deleteItemSource,
	getContributedItems,
	getDraftItems,
	getItemCategories,
	getItemComments,
	getItemRelationKind,
	getItemRelations,
	getItemsBySource,
	getItemsBySourceItem,
	getItemSource,
	getItemSources,
	getLastItemComments,
	searchItems,
	updateItemComment,
	updateItemRelationKind,
	updateItemSource,
} from "@/data/sshoc/api/item";
import { useSession } from "@/data/sshoc/lib/useSession";

/** scope */
const items = "items";
/** kind */
// const list = 'list'
const search = "search";
const infinite = "infinite";
const autocomplete = "autocomplete";
// const detail = 'detail'
const categories = "categories";
const bySource = "bySource";
const bySourceItem = "bySourceItem";
const drafts = "drafts";
const relations = "relations";
const relationKind = "relationKind";
const comments = "comments";
const lastComments = "lastComments";
const source = "source";
const sources = "sources";
const contributedItems = "contributedItems";

export const keys = {
	all(auth?: AuthData) {
		return [items, auth ?? null] as const;
	},
	// lists(auth?: AuthData | undefined) {
	//   return [items, list, auth ?? null] as const
	// },
	// list(params, auth?: AuthData | undefined) {
	//   return [items, list, params, auth ?? null] as const
	// },
	search(params: ItemSearch.Params = {}, auth?: AuthData) {
		return [items, search, params, auth ?? null] as const;
	},
	searchInfinite(params: ItemSearch.Params, auth?: AuthData) {
		return [items, search, infinite, params, auth ?? null] as const;
	},
	// details(auth?: AuthData | undefined) {
	//   return [items, detail, auth ?? null] as const
	// },
	// detail(params, auth?: AuthData | undefined) {
	//   return [items, detail, params, auth ?? null] as const
	// },
	autocomplete(params: ItemAutocomplete.Params, auth?: AuthData) {
		return [items, autocomplete, params, auth ?? null] as const;
	},
	categories(auth?: AuthData) {
		return [items, categories, auth ?? null] as const;
	},
	bySource(params: GetItemsBySource.Params, auth?: AuthData) {
		return [items, bySource, params, auth ?? null] as const;
	},
	bySourceInfinite(params: GetItemsBySource.Params, auth?: AuthData) {
		return [items, bySource, infinite, params, auth ?? null] as const;
	},
	bySourceItem(params: GetItemsBySourceItem.Params, auth?: AuthData) {
		return [items, bySourceItem, params, auth ?? null] as const;
	},
	bySourceItemInfinite(params: GetItemsBySourceItem.Params, auth?: AuthData) {
		return [items, bySourceItem, infinite, params, auth ?? null] as const;
	},
	drafts(params: GetDraftItems.Params = {}, auth?: AuthData) {
		return [items, drafts, params, auth ?? null] as const;
	},
	draftsInfinite(params: GetDraftItems.Params, auth?: AuthData) {
		return [items, drafts, infinite, params, auth ?? null] as const;
	},
	relations(params: GetItemRelations.Params = {}, auth?: AuthData) {
		return [items, relations, params, auth ?? null] as const;
	},
	relationsInfinite(params: GetItemRelations.Params, auth?: AuthData) {
		return [items, relations, infinite, params, auth ?? null] as const;
	},
	relationKinds(auth?: AuthData) {
		return [items, relationKind, auth ?? null] as const;
	},
	relationKind(params: GetItemRelationKind.Params, auth?: AuthData) {
		return [items, relationKind, params, auth ?? null] as const;
	},
	comments(params: GetItemComments.Params, auth?: AuthData) {
		return [items, comments, params, auth ?? null] as const;
	},
	lastComments(params: GetLastItemComments.Params, auth?: AuthData) {
		return [items, lastComments, params, auth ?? null] as const;
	},
	sources(auth?: AuthData) {
		return [items, sources, auth ?? null] as const;
	},
	source(params: GetItemSource.Params, auth?: AuthData) {
		return [items, source, params, auth ?? null] as const;
	},
	contributedItems(params: GetContributedItems.Params, auth?: AuthData) {
		return [contributedItems, params, auth ?? null] as const;
	},
};

export function useItemSearch<TData = ItemSearch.Response>(
	params: ItemSearch.Params,
	auth?: AuthData,
	options?: UseQueryOptions<ItemSearch.Response, Error, TData, ReturnType<typeof keys.search>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.search(params, session),
		({ signal }) => {
			return searchItems(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function useItemSearchInfinite<TData = ItemSearch.Response>(
	params: ItemSearch.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		ItemSearch.Response,
		Error,
		TData,
		ItemSearch.Response,
		ReturnType<typeof keys.searchInfinite>
	>,
) {
	const session = useSession(auth);
	return useInfiniteQuery(
		keys.searchInfinite(params, session),
		({ signal, pageParam = params.page }) => {
			return searchItems({ ...params, page: pageParam }, session, { signal });
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

export function useItemAutocomplete<TData = ItemAutocomplete.Response>(
	params: ItemAutocomplete.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		ItemAutocomplete.Response,
		Error,
		TData,
		ReturnType<typeof keys.autocomplete>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.autocomplete(params, session),
		({ signal }) => {
			return autocompleteItems(params, session, { signal });
		},
		{ enabled: params.q.length > 0, keepPreviousData: true, ...options },
	);
}

export function useItemCategories<TData = GetItemCategories.Response>(
	auth?: AuthData,
	options?: UseQueryOptions<
		GetItemCategories.Response,
		Error,
		TData,
		ReturnType<typeof keys.categories>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.categories(session),
		({ signal }) => {
			return getItemCategories(session, { signal });
		},
		{ keepPreviousData: true, staleTime: Infinity, ...options },
	);
}

export function useItemsBySource<TData = GetItemsBySource.Response>(
	params: GetItemsBySource.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetItemsBySource.Response,
		Error,
		TData,
		ReturnType<typeof keys.bySource>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.bySource(params, session),
		({ signal }) => {
			return getItemsBySource(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function useItemsBySourceInfinite<TData = GetItemsBySource.Response>(
	params: GetItemsBySource.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		GetItemsBySource.Response,
		Error,
		TData,
		GetItemsBySource.Response,
		ReturnType<typeof keys.bySourceInfinite>
	>,
) {
	const session = useSession(auth);
	return useInfiniteQuery(
		keys.bySourceInfinite(params, session),
		({ signal, pageParam = params.page }) => {
			return getItemsBySource({ ...params, page: pageParam }, session, { signal });
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

export function useItemsBySourceItem<TData = GetItemsBySourceItem.Response>(
	params: GetItemsBySourceItem.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetItemsBySourceItem.Response,
		Error,
		TData,
		ReturnType<typeof keys.bySourceItem>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.bySourceItem(params, session),
		({ signal }) => {
			return getItemsBySourceItem(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function useItemsBySourceItemInfinite<TData = GetItemsBySourceItem.Response>(
	params: GetItemsBySourceItem.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		GetItemsBySourceItem.Response,
		Error,
		TData,
		GetItemsBySourceItem.Response,
		ReturnType<typeof keys.bySourceItemInfinite>
	>,
) {
	const session = useSession(auth);
	return useInfiniteQuery(
		keys.bySourceItemInfinite(params, session),
		({ signal, pageParam = params.page }) => {
			return getItemsBySourceItem({ ...params, page: pageParam }, session, { signal });
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

export function useDraftItems<TData = GetDraftItems.Response>(
	params: GetDraftItems.Params,
	auth?: AuthData,
	options?: UseQueryOptions<GetDraftItems.Response, Error, TData, ReturnType<typeof keys.drafts>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.drafts(params, session),
		({ signal }) => {
			return getDraftItems(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function useDraftItemsInfinite<TData = GetDraftItems.Response>(
	params: GetDraftItems.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		GetDraftItems.Response,
		Error,
		TData,
		GetDraftItems.Response,
		ReturnType<typeof keys.draftsInfinite>
	>,
) {
	const session = useSession(auth);
	return useInfiniteQuery(
		keys.draftsInfinite(params, session),
		({ signal, pageParam = params.page }) => {
			return getDraftItems({ ...params, page: pageParam }, session, { signal });
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

export function useItemRelations<TData = GetItemRelations.Response>(
	params: GetItemRelations.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetItemRelations.Response,
		Error,
		TData,
		ReturnType<typeof keys.relations>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.relations(params, session),
		({ signal }) => {
			return getItemRelations(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function useItemRelationsInfinite<TData = GetItemRelations.Response>(
	params: GetItemRelations.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		GetItemRelations.Response,
		Error,
		TData,
		GetItemRelations.Response,
		ReturnType<typeof keys.relationsInfinite>
	>,
) {
	const session = useSession(auth);
	return useInfiniteQuery(
		keys.relationsInfinite(params, session),
		({ signal, pageParam = params.page }) => {
			return getItemRelations({ ...params, page: pageParam }, session, { signal });
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

export function useCreateItemRelation(
	params: CreateItemRelation.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		CreateItemRelation.Response,
		Error,
		{ data: CreateItemRelation.Body }
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: CreateItemRelation.Body }) => {
			return createItemRelation(params, data, session);
		},
		{
			...options,
			onSuccess(relation, ...args) {
				queryClient.invalidateQueries(keys.relations());
				// TODO:
				// queryClient.invalidateQueries(keysByItemCategory[relation.object.category].detail({ persistentId: relation.object.persistentId}))
				// queryClient.invalidateQueries(keysByItemCategory[relation.subject.category].detail({ persistentId: relation.subject.persistentId}))
				options?.onSuccess?.(relation, ...args);
			},
		},
	);
}

export function useDeleteItemRelation(
	params: DeleteItemRelation.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteItemRelation.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return deleteItemRelation(params, session);
		},
		{
			...options,
			onSuccess(relation, ...args) {
				queryClient.invalidateQueries(keys.relations());
				// TODO:
				// queryClient.invalidateQueries(keysByItemCategory[relation.object.category].detail({ persistentId: relation.object.persistentId}))
				// queryClient.invalidateQueries(keysByItemCategory[relation.subject.category].detail({ persistentId: relation.subject.persistentId}))
				options?.onSuccess?.(relation, ...args);
			},
		},
	);
}

export function useItemRelationKind<TData = GetItemRelationKind.Response>(
	params: GetItemRelationKind.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetItemRelationKind.Response,
		Error,
		TData,
		ReturnType<typeof keys.relationKind>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.relationKind(params, session),
		({ signal }) => {
			return getItemRelationKind(params, session, { signal });
		},
		options,
	);
}

export function useCreateItemRelationKind(
	auth?: AuthData,
	options?: UseMutationOptions<
		CreateItemRelationKind.Response,
		Error,
		{ data: CreateItemRelationKind.Body }
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: CreateItemRelationKind.Body }) => {
			return createItemRelationKind(data, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.relationKinds());
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useUpdateItemRelationKind(
	params: UpdateItemRelationKind.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		UpdateItemRelationKind.Response,
		Error,
		{ data: UpdateItemRelationKind.Body }
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: UpdateItemRelationKind.Body }) => {
			return updateItemRelationKind(params, data, session);
		},
		{
			...options,
			onSuccess(kind, ...args) {
				queryClient.invalidateQueries(keys.relationKinds());
				queryClient.invalidateQueries(keys.relationKind({ code: kind.code }));
				options?.onSuccess?.(kind, ...args);
			},
		},
	);
}

export function useDeleteItemRelationKind(
	params: DeleteItemRelationKind.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteItemRelationKind.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return deleteItemRelationKind(params, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.relationKinds());
				queryClient.invalidateQueries(keys.relationKind({ code: params.code }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useItemComments<TData = GetItemComments.Response>(
	params: GetItemComments.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetItemComments.Response,
		Error,
		TData,
		ReturnType<typeof keys.comments>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.comments(params, session),
		({ signal }) => {
			return getItemComments(params, session, { signal });
		},
		options,
	);
}

export function useLastItemComments<TData = GetLastItemComments.Response>(
	params: GetLastItemComments.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetLastItemComments.Response,
		Error,
		TData,
		ReturnType<typeof keys.lastComments>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.lastComments(params, session),
		({ signal }) => {
			return getLastItemComments(params, session, { signal });
		},
		options,
	);
}

export function useCreateItemComment(
	params: CreateItemComment.Params,
	auth?: AuthData,
	options?: UseMutationOptions<CreateItemComment.Response, Error, { data: CreateItemComment.Body }>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: CreateItemComment.Body }) => {
			return createItemComment(params, data, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.comments({ itemId: params.itemId }));
				queryClient.invalidateQueries(keys.lastComments({ itemId: params.itemId }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useUpdateItemComment(
	params: UpdateItemComment.Params,
	auth?: AuthData,
	options?: UseMutationOptions<UpdateItemComment.Response, Error, { data: UpdateItemComment.Body }>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: UpdateItemComment.Body }) => {
			return updateItemComment(params, data, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.comments({ itemId: params.itemId }));
				queryClient.invalidateQueries(keys.lastComments({ itemId: params.itemId }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useDeleteItemComment(
	params: DeleteItemComment.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteItemComment.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return deleteItemComment(params, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.comments({ itemId: params.itemId }));
				queryClient.invalidateQueries(keys.lastComments({ itemId: params.itemId }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useItemSources<TData = GetItemSources.Response>(
	auth?: AuthData,
	options?: UseQueryOptions<GetItemSources.Response, Error, TData, ReturnType<typeof keys.sources>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.sources(session),
		({ signal }) => {
			return getItemSources(session, { signal });
		},
		options,
	);
}

export function useItemSource<TData = GetItemSource.Response>(
	params: GetItemSource.Params,
	auth?: AuthData,
	options?: UseQueryOptions<GetItemSource.Response, Error, TData, ReturnType<typeof keys.source>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.source(params, session),
		({ signal }) => {
			return getItemSource(params, session, { signal });
		},
		options,
	);
}

export function useCreateItemSource(
	auth?: AuthData,
	options?: UseMutationOptions<CreateItemSource.Response, Error, { data: CreateItemSource.Body }>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: CreateItemSource.Body }) => {
			return createItemSource(data, session);
		},
		{
			...options,
			onSuccess(source, ...args) {
				queryClient.invalidateQueries(keys.sources());
				queryClient.invalidateQueries(keys.source({ code: source.code }));
				options?.onSuccess?.(source, ...args);
			},
		},
	);
}

export function useUpdateItemSource(
	params: UpdateItemSource.Params,
	auth?: AuthData,
	options?: UseMutationOptions<UpdateItemSource.Response, Error, { data: UpdateItemSource.Body }>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data }: { data: UpdateItemSource.Body }) => {
			return updateItemSource(params, data, session);
		},
		{
			...options,
			onSuccess(source, ...args) {
				queryClient.invalidateQueries(keys.sources());
				queryClient.invalidateQueries(keys.source({ code: source.code }));
				options?.onSuccess?.(source, ...args);
			},
		},
	);
}

export function useDeleteItemSource(
	params: DeleteItemSource.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteItemSource.Response, Error>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		() => {
			return deleteItemSource(params, session);
		},
		{
			...options,
			onSuccess(source, ...args) {
				queryClient.invalidateQueries(keys.sources());
				queryClient.invalidateQueries(keys.source({ code: params.code }));
				options?.onSuccess?.(source, ...args);
			},
		},
	);
}

export function useContributedItems<TData = GetContributedItems.Response>(
	params: GetContributedItems.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetContributedItems.Response,
		Error,
		TData,
		ReturnType<typeof keys.contributedItems>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.contributedItems(params, auth),
		({ signal }) => {
			return getContributedItems(params, session, { signal });
		},
		options,
	);
}
