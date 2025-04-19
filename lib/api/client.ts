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
	token?: string | null,
) {
	try {
		return await _request<TData, TResponseType>(
			url,
			token != null ? { ...config, headers: { authorization: token } } : config,
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

export async function getCurrentUser(token: string): Promise<GetCurrentUser.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/auth/me",
	});

	const data = (await request(
		url,
		{
			responseType: "json",
		},
		token,
	)) as GetCurrentUser.Response;

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
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

	export type Response = Omit<
		paths["/api/item-search"]["get"]["responses"]["200"]["content"]["application/json"],
		"categories" | "facets"
	> & {
		categories: Record<ItemCategory, { checked: boolean; count: number; label: string }>;
		facets: Record<ItemFacet, Record<string, { checked: boolean; count: number }>>;
	};
}

export async function searchItems(
	searchParams: SearchItems.SearchParams,
	token?: string | null,
): Promise<SearchItems.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/item-search",
		searchParams: createUrlSearchParams(searchParams),
	});

	return (await request(
		url,
		{
			responseType: "json",
		},
		token,
	)) as SearchItems.Response;
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
	token?: string | null,
): Promise<AutocompleteItems.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/item-search/autocomplete",
		searchParams: createUrlSearchParams(searchParams),
	});

	return (await request(
		url,
		{
			responseType: "json",
		},
		token,
	)) as AutocompleteItems.Response;
}

/**
 * Datasets.
 * ================================================================================================
 */

export declare namespace GetDataset {
	export type SearchParams = paths["/api/datasets/{persistentId}"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/datasets/{persistentId}"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getDataset(
	persistentId: string,
	searchParams?: GetDataset.SearchParams,
	token?: string | null,
): Promise<GetDataset.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/datasets/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(
		url,
		{
			responseType: "json",
		},
		token,
	)) as GetDataset.Response;
}

/**
 * Publications.
 * ================================================================================================
 */

export declare namespace GetPublication {
	export type SearchParams =
		paths["/api/publications/{persistentId}"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/publications/{persistentId}"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getPublication(
	persistentId: string,
	searchParams?: GetPublication.SearchParams,
	token?: string | null,
): Promise<GetPublication.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/publications/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(
		url,
		{
			responseType: "json",
		},
		token,
	)) as GetPublication.Response;
}

/**
 * Tools & services.
 * ================================================================================================
 */

export declare namespace GetToolOrService {
	export type SearchParams =
		paths["/api/tools-services/{persistentId}"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/tools-services/{persistentId}"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getToolOrService(
	persistentId: string,
	searchParams?: GetToolOrService.SearchParams,
	token?: string | null,
): Promise<GetToolOrService.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/tools-services/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(
		url,
		{
			responseType: "json",
		},
		token,
	)) as GetToolOrService.Response;
}

/**
 * Training materials.
 * ================================================================================================
 */

export declare namespace GetTrainingMaterial {
	export type SearchParams =
		paths["/api/training-materials/{persistentId}"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/training-materials/{persistentId}"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getTrainingMaterial(
	persistentId: string,
	searchParams?: GetTrainingMaterial.SearchParams,
	token?: string | null,
): Promise<GetTrainingMaterial.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/training-materials/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(
		url,
		{
			responseType: "json",
		},
		token,
	)) as GetTrainingMaterial.Response;
}

/**
 * Workflows.
 * ================================================================================================
 */

export declare namespace GetWorkflow {
	export type SearchParams = paths["/api/workflows/{persistentId}"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/workflows/{persistentId}"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getWorkflow(
	persistentId: string,
	searchParams?: GetWorkflow.SearchParams,
	token?: string | null,
): Promise<GetWorkflow.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/workflows/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(
		url,
		{
			responseType: "json",
		},
		token,
	)) as GetWorkflow.Response;
}

/**
 * Media thumbnails.
 * ================================================================================================
 */

export function getMediaThumbnailUrl(mediaId: string): URL {
	return createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/media/thumbnail/${mediaId}`,
	});
}
