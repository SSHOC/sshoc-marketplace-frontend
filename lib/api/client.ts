import "server-only";

import {
	createUrl,
	createUrlSearchParams,
	request as _request,
	type RequestConfig,
} from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import type {
	SearchItem,
	SearchItemsData,
	SearchItemsResponse,
	UserDto,
} from "@/lib/api/sshoc/types.gen";
import { redirect } from "@/lib/navigation/navigation";
import { assertSession, getSession } from "@/lib/server/auth/session";
import { isUnauthorizedError } from "@/lib/server/errors";

type ResponseType =
	| "arrayBuffer"
	| "blob"
	| "formData"
	| "json"
	| "raw"
	| "stream"
	| "text"
	| "void";

async function request<TData = unknown, TResponseType extends ResponseType = ResponseType>(
	url: URL,
	config: RequestConfig<TResponseType>,
	authentication: "none" | "optional" | "required" = "optional",
) {
	try {
		const token =
			authentication === "optional"
				? await getSession()
				: authentication === "required"
					? await assertSession()
					: null;

		return await _request<TData, TResponseType>(
			url,
			token ? { ...config, headers: { authorization: token } } : config,
		);
	} catch (error) {
		if (isUnauthorizedError(error)) {
			// FIXME: only allowed in server action
			// await invalidateSession();

			redirect("/auth/sign-in");
		}

		throw error;
	}
}

/**
 * Utilities.
 * ================================================================================================
 */

// type PaginatedResponse<T> = T & {
// 	hits: number;
// 	count: number;
// 	page: number;
// 	perpage: number;
// 	pages: number;
// };

/**
 * Auth.
 * ================================================================================================
 */

declare namespace GetCurrentUser {
	export type Response = Required<UserDto>;
}

export async function getCurrentUser(): Promise<GetCurrentUser.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/auth/me",
	});

	const data = (await request(url, {
		responseType: "json",
	})) as GetCurrentUser.Response;

	return data;
}

/**
 * Items.
 * ================================================================================================
 */

export type ItemCategory = NonNullable<SearchItem["category"]>;

type ItemFacet = "activity" | "source" | "keyword" | "language";

// type ItemStatus = NonNullable<SearchItem["status"]>;

// type ItemSortOrder = NonNullable<NonNullable<SearchItemsData["query"]>["order"]>;

declare namespace SearchItems {
	export type SearchParams = SearchItemsData["query"] &
		Partial<Record<`f.${ItemFacet}`, Array<string>>>;

	export type Response = Required<Omit<SearchItemsResponse, "items">> & {
		items: Array<Required<SearchItem>>;
		categories: Record<ItemCategory, { checked: boolean; count: string; label: string }>;
		facets: Record<ItemFacet, Record<string, { checked: boolean; count: string }>>;
	};
}

export async function searchItems(
	searchParams: SearchItems.SearchParams,
): Promise<SearchItems.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/item-search",
		searchParams: createUrlSearchParams({ ...searchParams }),
	});

	return (await request(url, { responseType: "json" })) as SearchItems.Response;
}

//
