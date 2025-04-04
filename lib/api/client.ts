import "server-only";

import {
	createUrl,
	createUrlSearchParams,
	request as _request,
	type RequestConfig,
} from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import {
	itemBasicDtoCategoryValues,
	type paths,
	pathsApiItemSearchGetParametersQueryOrderValues,
} from "@/lib/api/schema";
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
 * Auth.
 * ================================================================================================
 */

export declare namespace GetCurrentUser {
	export type Response =
		paths["/api/auth/me"]["get"]["responses"]["200"]["content"]["application/json"];
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
 * Util.
 * ================================================================================================
 */

export const itemCategories = itemBasicDtoCategoryValues;

export type ItemCategory = (typeof itemCategories)[number];

export type ItemFacet = "activity" | "source" | "keyword" | "language";

/** Frontend uses pluralized pathnames. */
export const pluralize = {
	categories(category: ItemCategory) {
		switch (category) {
			case "dataset":
				return "datasets";
			case "publication":
				return "publications";
			case "step":
				return "steps";
			case "tool-or-service":
				return "tools-services";
			case "training-material":
				return "training-materials";
			case "workflow":
				return "workflows";
		}
	},
	facets(facet: ItemFacet) {
		switch (facet) {
			case "activity":
				return "activities";
			case "keyword":
				return "keywords";
			case "language":
				return "languages";
			case "source":
				return "sources";
		}
	},
};

/**
 * Items.
 * ================================================================================================
 */

export declare namespace SearchItems {
	export type SearchParams = paths["/api/item-search"]["get"]["parameters"]["query"] &
		Partial<Record<`f.${ItemFacet}`, Array<string>>>;

	export type Response =
		paths["/api/item-search"]["get"]["responses"]["200"]["content"]["application/json"] & {
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
		searchParams: createUrlSearchParams(searchParams),
	});

	return (await request(url, { responseType: "json" })) as SearchItems.Response;
}

export const searchItemsOrders = pathsApiItemSearchGetParametersQueryOrderValues;

//

export declare namespace AutocompleteItems {
	export type SearchParams = paths["/api/item-search/autocomplete"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/item-search/autocomplete"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function autocompleteItems(
	searchParams: AutocompleteItems.SearchParams,
): Promise<AutocompleteItems.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/item-search/autocomplete",
		searchParams: createUrlSearchParams(searchParams),
	});

	return (await request(url, { responseType: "json" })) as AutocompleteItems.Response;
}

//
