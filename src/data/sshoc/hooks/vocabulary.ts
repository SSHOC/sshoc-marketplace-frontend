import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from "react-query";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

import type { AuthData } from "@/data/sshoc/api/common";
import type {
	CommitSuggestedConcept,
	CreateConcept,
	CreateVocabulary,
	DeleteConcept,
	DeleteVocabulary,
	GetConcept,
	GetConceptRelations,
	GetVocabularies,
	GetVocabulary,
	MergeConcepts,
	SearchConcepts,
	SetVocabularyClosed,
	SetVocabularyOpen,
	UpdateConcept,
	UpdateVocabulary,
} from "@/data/sshoc/api/vocabulary";
import {
	commitSuggestedConcept,
	createConcept,
	createVocabulary,
	deleteConcept,
	deleteVocabulary,
	getConcept,
	getConceptRelations,
	getVocabularies,
	getVocabulary,
	mergeConcepts,
	searchConcepts,
	setVocabularyClosed,
	setVocabularyOpen,
	updateConcept,
	updateVocabulary,
} from "@/data/sshoc/api/vocabulary";
import { useSession } from "@/data/sshoc/lib/useSession";

/** scope */
const vocabulary = "vocabulary";
const concept = "concept";
const relation = "concept-relation";
/** kind */
const list = "list";
const detail = "detail";
const search = "search";
const infinite = "infinite";

export const keys = {
	all(auth?: AuthData) {
		return [vocabulary, auth ?? null] as const;
	},
	lists(auth?: AuthData) {
		return [vocabulary, list, auth ?? null] as const;
	},
	list(params: GetVocabularies.Params, auth?: AuthData) {
		return [vocabulary, list, params, auth ?? null] as const;
	},
	listInfinite(params: GetVocabularies.Params, auth?: AuthData) {
		return [vocabulary, list, infinite, params, auth ?? null] as const;
	},
	details(auth?: AuthData) {
		return [vocabulary, detail, auth ?? null] as const;
	},
	detail(params: GetVocabulary.Params, auth?: AuthData) {
		return [vocabulary, detail, params, auth ?? null] as const;
	},
	detailInfinite(params: GetVocabulary.Params, auth?: AuthData) {
		return [vocabulary, detail, infinite, params, auth ?? null] as const;
	},
	relation(auth?: AuthData) {
		return [relation, auth ?? null] as const;
	},
	concept: {
		all(auth?: AuthData) {
			return [vocabulary, concept, auth ?? null] as const;
		},
		details(auth?: AuthData) {
			return [vocabulary, concept, detail, auth ?? null] as const;
		},
		detail(params: GetConcept.Params, auth?: AuthData) {
			return [vocabulary, concept, detail, params, auth ?? null] as const;
		},
		search(params: SearchConcepts.Params = {}, auth?: AuthData) {
			return [vocabulary, concept, search, params, auth ?? null] as const;
		},
		searchInfinite(params: SearchConcepts.Params, auth?: AuthData) {
			return [vocabulary, concept, search, infinite, params, auth ?? null] as const;
		},
	},
};

export function useVocabularies<TData = GetVocabularies.Response>(
	params: GetVocabularies.Params,
	auth?: AuthData,
	options?: UseQueryOptions<GetVocabularies.Response, Error, TData, ReturnType<typeof keys.list>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.list(params, session),
		({ signal }) => {
			return getVocabularies(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function useVocabulariesInfinite<TData = GetVocabularies.Response>(
	params: GetVocabularies.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		GetVocabularies.Response,
		Error,
		TData,
		GetVocabularies.Response,
		ReturnType<typeof keys.listInfinite>
	>,
) {
	const session = useSession(auth);
	return useInfiniteQuery(
		keys.listInfinite(params, session),
		({ signal, pageParam = params.page }) => {
			return getVocabularies({ ...params, page: pageParam }, session, { signal });
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

export function useVocabulary<TData = GetVocabulary.Response>(
	params: GetVocabulary.Params,
	auth?: AuthData,
	options?: UseQueryOptions<GetVocabulary.Response, Error, TData, ReturnType<typeof keys.detail>>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.detail(params, session),
		({ signal }) => {
			return getVocabulary(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function useVocabularyInfinite<TData = GetVocabulary.Response>(
	params: GetVocabulary.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		GetVocabulary.Response,
		Error,
		TData,
		GetVocabulary.Response,
		ReturnType<typeof keys.detailInfinite>
	>,
) {
	const session = useSession(auth);
	return useInfiniteQuery(
		keys.detailInfinite(params, session),
		({ signal, pageParam = params.page }) => {
			return getVocabulary({ ...params, page: pageParam }, session, { signal });
		},
		{
			keepPreviousData: true,
			...options,
			getNextPageParam(lastPage, _allPages) {
				if (lastPage.conceptResults.page < lastPage.conceptResults.pages) {
					return lastPage.conceptResults.page + 1;
				}
				return undefined;
			},
		},
	);
}

export namespace UseCreateVocabulary {
	export type Variables = Partial<CreateVocabulary.Params> & {
		data: CreateVocabulary.Body;
	};
}

export function useCreateVocabulary(
	params: CreateVocabulary.Params,
	auth?: AuthData,
	options?: UseMutationOptions<CreateVocabulary.Response, Error, UseCreateVocabulary.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data, ...parameters }: UseCreateVocabulary.Variables) => {
			return createVocabulary({ ...params, ...parameters }, data, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.concept.search());
				queryClient.invalidateQueries(keys.lists());
				options?.onSuccess?.(...args);
			},
		},
	);
}

export namespace UseUpdateVocabulary {
	export type Variables = Partial<UpdateVocabulary.Params> & {
		data: UpdateVocabulary.Body;
	};
}

export function useUpdateVocabulary(
	params: UpdateVocabulary.Params,
	auth?: AuthData,
	options?: UseMutationOptions<UpdateVocabulary.Response, Error, UseUpdateVocabulary.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data, ...parameters }: UseUpdateVocabulary.Variables) => {
			return updateVocabulary({ ...params, ...parameters }, data, session);
		},
		{
			...options,
			onSuccess(vocabulary, ...args) {
				queryClient.invalidateQueries(keys.concept.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ code: vocabulary.code }));
				options?.onSuccess?.(vocabulary, ...args);
			},
		},
	);
}

export namespace UseDeleteVocabulary {
	export type Variables = Partial<DeleteVocabulary.Params>;
}

export function useDeleteVocabulary(
	params: DeleteVocabulary.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteVocabulary.Response, Error, UseDeleteVocabulary.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		(parameters: UseDeleteVocabulary.Variables) => {
			return deleteVocabulary({ ...params, ...parameters }, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.concept.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ code: params.code }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export namespace UseSetVocabularyToClosed {
	export type Variables = Partial<SetVocabularyClosed.Params>;
}

export function useSetVocabularyToClosed(
	params: SetVocabularyClosed.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		SetVocabularyClosed.Response,
		Error,
		UseSetVocabularyToClosed.Variables
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		(parameters) => {
			return setVocabularyClosed({ ...params, ...parameters }, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.concept.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ code: params.code }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export namespace UseSetVocabularyToOpen {
	export type Variables = Partial<SetVocabularyOpen.Params>;
}

export function useSetVocabularyToOpen(
	params: SetVocabularyOpen.Params,
	auth?: AuthData,
	options?: UseMutationOptions<SetVocabularyOpen.Response, Error, UseSetVocabularyToOpen.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		(parameters) => {
			return setVocabularyOpen({ ...params, ...parameters }, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.concept.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ code: params.code }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useConcept<TData = GetConcept.Response>(
	params: GetConcept.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		GetConcept.Response,
		Error,
		TData,
		ReturnType<typeof keys.concept.detail>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.concept.detail(params, session),
		({ signal }) => {
			return getConcept(params, session, { signal });
		},
		options,
	);
}

export namespace UseCreateConcept {
	export type Variables = Partial<CreateConcept.Params> & {
		data: CreateConcept.Body;
	};
}

export function useCreateConcept(
	params: CreateConcept.Params,
	auth?: AuthData,
	options?: UseMutationOptions<CreateConcept.Response, Error, UseCreateConcept.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data, ...parameters }: UseCreateConcept.Variables) => {
			return createConcept({ ...params, ...parameters }, data, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.concept.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ code: params.vocabularyCode }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export namespace UseUpdateConcept {
	export type Variables = Partial<UpdateConcept.Params> & {
		data: UpdateConcept.Body;
	};
}

export function useUpdateConcept(
	params: UpdateConcept.Params,
	auth?: AuthData,
	options?: UseMutationOptions<UpdateConcept.Response, Error, UseUpdateConcept.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data, ...parameters }: UseUpdateConcept.Variables) => {
			return updateConcept({ ...params, ...parameters }, data, session);
		},
		{
			...options,
			onSuccess(concept, ...args) {
				queryClient.invalidateQueries(keys.concept.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ code: concept.vocabulary.code }));
				queryClient.invalidateQueries(
					keys.concept.detail({ code: concept.code, vocabularyCode: concept.vocabulary.code }),
				);
				options?.onSuccess?.(concept, ...args);
			},
		},
	);
}

export namespace UseDeleteConcept {
	export type Variables = Partial<DeleteConcept.Params>;
}

export function useDeleteConcept(
	params: DeleteConcept.Params,
	auth?: AuthData,
	options?: UseMutationOptions<DeleteConcept.Response, Error, UseDeleteConcept.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		(parameters) => {
			return deleteConcept({ ...params, ...parameters }, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.concept.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ code: params.vocabularyCode }));
				queryClient.invalidateQueries(
					keys.concept.detail({ code: params.code, vocabularyCode: params.vocabularyCode }),
				);
				options?.onSuccess?.(...args);
			},
		},
	);
}

export function useConceptRelations<TData = GetConceptRelations.Response>(
	auth?: AuthData,
	options?: UseQueryOptions<
		GetConceptRelations.Response,
		Error,
		TData,
		ReturnType<typeof keys.relation>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.relation(session),
		({ signal }) => {
			return getConceptRelations(session, { signal });
		},
		options,
	);
}

export function useConceptSearch<TData = SearchConcepts.Response>(
	params: SearchConcepts.Params,
	auth?: AuthData,
	options?: UseQueryOptions<
		SearchConcepts.Response,
		Error,
		TData,
		ReturnType<typeof keys.concept.search>
	>,
) {
	const session = useSession(auth);
	return useQuery(
		keys.concept.search(params, session),
		({ signal }) => {
			return searchConcepts(params, session, { signal });
		},
		{ keepPreviousData: true, ...options },
	);
}

export function useConceptSearchInfinite<TData = SearchConcepts.Response>(
	params: SearchConcepts.Params,
	auth?: AuthData,
	options?: UseInfiniteQueryOptions<
		SearchConcepts.Response,
		Error,
		TData,
		SearchConcepts.Response,
		ReturnType<typeof keys.concept.searchInfinite>
	>,
) {
	return useInfiniteQuery(
		keys.concept.searchInfinite(params, auth),
		({ signal, pageParam = params.page }) => {
			return searchConcepts({ ...params, page: pageParam }, auth, { signal });
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

export namespace UseCommitSuggestedConcept {
	export type Variables = Partial<CommitSuggestedConcept.Params>;
}

export function useCommitSuggestedConcept(
	params: CommitSuggestedConcept.Params,
	auth?: AuthData,
	options?: UseMutationOptions<
		CommitSuggestedConcept.Response,
		Error,
		UseCommitSuggestedConcept.Variables
	>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		(parameters) => {
			return commitSuggestedConcept({ ...params, ...parameters }, session);
		},
		{
			...options,
			onSuccess(concept, ...args) {
				queryClient.invalidateQueries(keys.concept.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ code: concept.vocabulary.code }));
				queryClient.invalidateQueries(
					keys.concept.detail({ code: concept.code, vocabularyCode: concept.vocabulary.code }),
				);
				options?.onSuccess?.(concept, ...args);
			},
		},
	);
}

export namespace UseMergeConcepts {
	export type Variables = Partial<MergeConcepts.Params>;
}

export function useMergeConcepts(
	params: MergeConcepts.Params,
	auth?: AuthData,
	options?: UseMutationOptions<MergeConcepts.Response, Error, UseMergeConcepts.Variables>,
) {
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		(parameters) => {
			return mergeConcepts({ ...params, ...parameters }, session);
		},
		{
			...options,
			onSuccess(...args) {
				queryClient.invalidateQueries(keys.concept.search());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ code: params.vocabularyCode }));
				options?.onSuccess?.(...args);
			},
		},
	);
}

export type { UseCommitSuggestedConcept as UseApproveSuggestedConcept };
export const useApproveSuggestedConcept = useCommitSuggestedConcept;

export type { UseDeleteConcept as UseRejectSuggestedConcept };
export const useRejectSuggestedConcept = useDeleteConcept;
