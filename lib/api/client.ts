import "server-only";

import { createUrl, createUrlSearchParams, request } from "@acdh-oeaw/lib";
import createClient from "openapi-fetch";

import { env } from "@/config/env.config";
import {
	itemBasicDtoCategoryValues,
	type paths,
	pathsApiItemSearchGetParametersQueryOrderValues,
} from "@/lib/api/schema";

const client = createClient<paths>({ baseUrl: env.NEXT_PUBLIC_API_BASE_URL });

/**
 * Auth.
 * ================================================================================================
 */

export declare namespace GetCurrentUser {
	export type Response =
		paths["/api/auth/me"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getCurrentUser({
	token,
}: {
	token: string;
}): Promise<GetCurrentUser.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/auth/me",
	});

	const data = (await request(url, {
		headers: { authorization: token },
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

export async function searchItems({
	searchParams,
	token,
}: {
	searchParams: SearchItems.SearchParams;
	token?: string | null;
}): Promise<SearchItems.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/item-search",
		searchParams: createUrlSearchParams(searchParams),
	});

	return (await request(url, {
		headers: token != null ? { authorization: token } : undefined,
		responseType: "json",
	})) as SearchItems.Response;
}

export const searchItemsOrders = pathsApiItemSearchGetParametersQueryOrderValues;

//

export declare namespace AutocompleteItems {
	export type SearchParams = paths["/api/item-search/autocomplete"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/item-search/autocomplete"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function autocompleteItems({
	searchParams,
	token,
}: {
	searchParams: AutocompleteItems.SearchParams;
	token?: string | null;
}): Promise<AutocompleteItems.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/item-search/autocomplete",
		searchParams: createUrlSearchParams(searchParams),
	});

	return (await request(url, {
		headers: token != null ? { authorization: token } : undefined,
		responseType: "json",
	})) as AutocompleteItems.Response;
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

export async function getDataset({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: GetDataset.SearchParams;
	token?: string | null;
}): Promise<GetDataset.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/datasets/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: token != null ? { authorization: token } : undefined,
		responseType: "json",
	})) as GetDataset.Response;
}

//

export declare namespace DeleteDataset {
	export type SearchParams = paths["/api/datasets/{persistentId}"]["delete"]["parameters"]["query"];

	export type Response =
		paths["/api/datasets/{persistentId}"]["delete"]["responses"]["200"]["content"];
}

export async function deleteDataset({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: DeleteDataset.SearchParams;
	token?: string | null;
}): Promise<DeleteDataset.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/datasets/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request<undefined>(url, {
		method: "delete",
		headers: token != null ? { authorization: token } : undefined,
		responseType: "void",
	})) as DeleteDataset.Response;
}

//

export declare namespace GetDatasetVersion {
	export type SearchParams =
		paths["/api/datasets/{persistentId}/versions/{versionId}"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/datasets/{persistentId}/versions/{versionId}"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getDatasetVersion({
	persistentId,
	versionId,
	searchParams,
	token,
}: {
	persistentId: string;
	versionId: number;
	searchParams?: GetDatasetVersion.SearchParams;
	token: string;
}): Promise<GetDatasetVersion.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/datasets/${persistentId}/versions/${String(versionId)}`,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: { authorization: token },
		responseType: "json",
	})) as GetDatasetVersion.Response;
}

//

export declare namespace DeleteDatasetVersion {
	export type SearchParams =
		paths["/api/datasets/{persistentId}/versions/{versionId}"]["delete"]["parameters"]["query"];

	export type Response =
		paths["/api/datasets/{persistentId}/versions/{versionId}"]["delete"]["responses"]["200"]["content"];
}

export async function deleteDatasetVersion({
	persistentId,
	versionId,
	searchParams,
	token,
}: {
	persistentId: string;
	versionId: number;
	searchParams?: DeleteDatasetVersion.SearchParams;
	token: string;
}): Promise<DeleteDatasetVersion.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/datasets/${persistentId}/versions/${String(versionId)}`,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request<undefined>(url, {
		method: "delete",
		headers: { authorization: token },
		responseType: "void",
	})) as DeleteDatasetVersion.Response;
}

//

export declare namespace GetDatasetVersions {
	export type SearchParams =
		paths["/api/datasets/{persistentId}/history"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/datasets/{persistentId}/history"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getDatasetVersions({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: GetDatasetVersions.SearchParams;
	token: string;
}): Promise<GetDatasetVersions.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/datasets/${persistentId}/history`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: { authorization: token },
		responseType: "json",
	})) as GetDatasetVersions.Response;
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

export async function getPublication({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: GetPublication.SearchParams;
	token?: string | null;
}): Promise<GetPublication.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/publications/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: token != null ? { authorization: token } : undefined,
		responseType: "json",
	})) as GetPublication.Response;
}

//

export declare namespace DeletePublication {
	export type SearchParams =
		paths["/api/publications/{persistentId}"]["delete"]["parameters"]["query"];

	export type Response =
		paths["/api/publications/{persistentId}"]["delete"]["responses"]["200"]["content"];
}

export async function deletePublication({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: DeletePublication.SearchParams;
	token?: string | null;
}): Promise<DeletePublication.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/publications/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request<undefined>(url, {
		method: "delete",
		headers: token != null ? { authorization: token } : undefined,
		responseType: "void",
	})) as DeletePublication.Response;
}

//

export declare namespace GetPublicationVersion {
	export type SearchParams =
		paths["/api/publications/{persistentId}/versions/{versionId}"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/publications/{persistentId}/versions/{versionId}"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getPublicationVersion({
	persistentId,
	versionId,
	searchParams,
	token,
}: {
	persistentId: string;
	versionId: number;
	searchParams?: GetPublicationVersion.SearchParams;
	token: string;
}): Promise<GetPublicationVersion.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/publications/${persistentId}/versions/${String(versionId)}`,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: { authorization: token },
		responseType: "json",
	})) as GetPublicationVersion.Response;
}

//

export declare namespace DeletePublicationVersion {
	export type SearchParams =
		paths["/api/publications/{persistentId}/versions/{versionId}"]["delete"]["parameters"]["query"];

	export type Response =
		paths["/api/publications/{persistentId}/versions/{versionId}"]["delete"]["responses"]["200"]["content"];
}

export async function deletePublicationVersion({
	persistentId,
	versionId,
	searchParams,
	token,
}: {
	persistentId: string;
	versionId: number;
	searchParams?: DeletePublicationVersion.SearchParams;
	token: string;
}): Promise<DeletePublicationVersion.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/publications/${persistentId}/versions/${String(versionId)}`,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request<undefined>(url, {
		method: "delete",
		headers: { authorization: token },
		responseType: "void",
	})) as DeletePublicationVersion.Response;
}

//

export declare namespace GetPublicationVersions {
	export type SearchParams =
		paths["/api/publications/{persistentId}/history"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/publications/{persistentId}/history"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getPublicationVersions({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: GetPublicationVersions.SearchParams;
	token: string;
}): Promise<GetPublicationVersions.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/publications/${persistentId}/history`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: { authorization: token },
		responseType: "json",
	})) as GetPublicationVersions.Response;
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

export async function getToolOrService({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: GetToolOrService.SearchParams;
	token?: string | null;
}): Promise<GetToolOrService.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/tools-services/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: token != null ? { authorization: token } : undefined,
		responseType: "json",
	})) as GetToolOrService.Response;
}

//

export declare namespace DeleteToolOrService {
	export type SearchParams =
		paths["/api/tools-services/{persistentId}"]["delete"]["parameters"]["query"];

	export type Response =
		paths["/api/tools-services/{persistentId}"]["delete"]["responses"]["200"]["content"];
}

export async function deleteToolOrService({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: DeleteToolOrService.SearchParams;
	token?: string | null;
}): Promise<DeleteToolOrService.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/tools-services/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request<undefined>(url, {
		method: "delete",
		headers: token != null ? { authorization: token } : undefined,
		responseType: "void",
	})) as DeleteToolOrService.Response;
}

//

export declare namespace GetToolOrServiceVersion {
	export type SearchParams =
		paths["/api/tools-services/{persistentId}/versions/{versionId}"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/tools-services/{persistentId}/versions/{versionId}"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getToolOrServiceVersion({
	persistentId,
	versionId,
	searchParams,
	token,
}: {
	persistentId: string;
	versionId: number;
	searchParams?: GetToolOrServiceVersion.SearchParams;
	token: string;
}): Promise<GetToolOrServiceVersion.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/tools-services/${persistentId}/versions/${String(versionId)}`,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: { authorization: token },
		responseType: "json",
	})) as GetToolOrServiceVersion.Response;
}

//

export declare namespace DeleteToolOrServiceVersion {
	export type SearchParams =
		paths["/api/tools-services/{persistentId}/versions/{versionId}"]["delete"]["parameters"]["query"];

	export type Response =
		paths["/api/tools-services/{persistentId}/versions/{versionId}"]["delete"]["responses"]["200"]["content"];
}

export async function deleteToolOrServiceVersion({
	persistentId,
	versionId,
	searchParams,
	token,
}: {
	persistentId: string;
	versionId: number;
	searchParams?: DeleteToolOrServiceVersion.SearchParams;
	token: string;
}): Promise<DeleteToolOrServiceVersion.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/tools-services/${persistentId}/versions/${String(versionId)}`,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request<undefined>(url, {
		method: "delete",
		headers: { authorization: token },
		responseType: "void",
	})) as DeleteToolOrServiceVersion.Response;
}

//

export declare namespace GetToolOrServiceVersions {
	export type SearchParams =
		paths["/api/tools-services/{persistentId}/history"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/tools-services/{persistentId}/history"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getToolOrServiceVersions({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: GetToolOrServiceVersions.SearchParams;
	token: string;
}): Promise<GetToolOrServiceVersions.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/tools-services/${persistentId}/history`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: { authorization: token },
		responseType: "json",
	})) as GetToolOrServiceVersions.Response;
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

export async function getTrainingMaterial({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: GetTrainingMaterial.SearchParams;
	token?: string | null;
}): Promise<GetTrainingMaterial.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/training-materials/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: token != null ? { authorization: token } : undefined,
		responseType: "json",
	})) as GetTrainingMaterial.Response;
}

//

export declare namespace DeleteTrainingMaterial {
	export type SearchParams =
		paths["/api/training-materials/{persistentId}"]["delete"]["parameters"]["query"];

	export type Response =
		paths["/api/training-materials/{persistentId}"]["delete"]["responses"]["200"]["content"];
}

export async function deleteTrainingMaterial({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: DeleteTrainingMaterial.SearchParams;
	token?: string | null;
}): Promise<DeleteTrainingMaterial.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/training-materials/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request<undefined>(url, {
		method: "delete",
		headers: token != null ? { authorization: token } : undefined,
		responseType: "void",
	})) as DeleteTrainingMaterial.Response;
}

//

export declare namespace GetTrainingMaterialVersion {
	export type SearchParams =
		paths["/api/training-materials/{persistentId}/versions/{versionId}"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/training-materials/{persistentId}/versions/{versionId}"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getTrainingMaterialVersion({
	persistentId,
	versionId,
	searchParams,
	token,
}: {
	persistentId: string;
	versionId: number;
	searchParams?: GetTrainingMaterialVersion.SearchParams;
	token: string;
}): Promise<GetTrainingMaterialVersion.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/training-materials/${persistentId}/versions/${String(versionId)}`,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: { authorization: token },
		responseType: "json",
	})) as GetTrainingMaterialVersion.Response;
}

//

export declare namespace DeleteTrainingMaterialVersion {
	export type SearchParams =
		paths["/api/training-materials/{persistentId}/versions/{versionId}"]["delete"]["parameters"]["query"];

	export type Response =
		paths["/api/training-materials/{persistentId}/versions/{versionId}"]["delete"]["responses"]["200"]["content"];
}

export async function deleteTrainingMaterialVersion({
	persistentId,
	versionId,
	searchParams,
	token,
}: {
	persistentId: string;
	versionId: number;
	searchParams?: DeleteTrainingMaterialVersion.SearchParams;
	token: string;
}): Promise<DeleteTrainingMaterialVersion.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/training-materials/${persistentId}/versions/${String(versionId)}`,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request<undefined>(url, {
		method: "delete",
		headers: { authorization: token },
		responseType: "void",
	})) as DeleteTrainingMaterialVersion.Response;
}

//

export declare namespace GetTrainingMaterialVersions {
	export type SearchParams =
		paths["/api/training-materials/{persistentId}/history"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/training-materials/{persistentId}/history"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getTrainingMaterialVersions({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: GetTrainingMaterialVersions.SearchParams;
	token: string;
}): Promise<GetTrainingMaterialVersions.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/training-materials/${persistentId}/history`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: { authorization: token },
		responseType: "json",
	})) as GetTrainingMaterialVersions.Response;
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

export async function getWorkflow({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: GetWorkflow.SearchParams;
	token?: string | null;
}): Promise<GetWorkflow.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/workflows/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: token != null ? { authorization: token } : undefined,
		responseType: "json",
	})) as GetWorkflow.Response;
}

//

export declare namespace DeleteWorkflow {
	export type SearchParams =
		paths["/api/workflows/{persistentId}"]["delete"]["parameters"]["query"];

	export type Response =
		paths["/api/workflows/{persistentId}"]["delete"]["responses"]["200"]["content"];
}

export async function deleteWorkflow({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: DeleteWorkflow.SearchParams;
	token?: string | null;
}): Promise<DeleteWorkflow.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/workflows/${persistentId}`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request<undefined>(url, {
		method: "delete",
		headers: token != null ? { authorization: token } : undefined,
		responseType: "void",
	})) as DeleteWorkflow.Response;
}

//

export declare namespace GetWorkflowVersion {
	export type SearchParams =
		paths["/api/workflows/{persistentId}/versions/{versionId}"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/workflows/{persistentId}/versions/{versionId}"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getWorkflowVersion({
	persistentId,
	versionId,
	searchParams,
	token,
}: {
	persistentId: string;
	versionId: number;
	searchParams?: GetWorkflowVersion.SearchParams;
	token: string;
}): Promise<GetWorkflowVersion.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/workflows/${persistentId}/versions/${String(versionId)}`,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: { authorization: token },
		responseType: "json",
	})) as GetWorkflowVersion.Response;
}

//

export declare namespace DeleteWorkflowVersion {
	export type SearchParams =
		paths["/api/workflows/{persistentId}/versions/{versionId}"]["delete"]["parameters"]["query"];

	export type Response =
		paths["/api/workflows/{persistentId}/versions/{versionId}"]["delete"]["responses"]["200"]["content"];
}

export async function deleteWorkflowVersion({
	persistentId,
	versionId,
	searchParams,
	token,
}: {
	persistentId: string;
	versionId: number;
	searchParams?: DeleteWorkflowVersion.SearchParams;
	token: string;
}): Promise<DeleteWorkflowVersion.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/workflows/${persistentId}/versions/${String(versionId)}`,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request<undefined>(url, {
		method: "delete",
		headers: { authorization: token },
		responseType: "void",
	})) as DeleteWorkflowVersion.Response;
}

//

export declare namespace GetWorkflowVersions {
	export type SearchParams =
		paths["/api/workflows/{persistentId}/history"]["get"]["parameters"]["query"];

	export type Response =
		paths["/api/workflows/{persistentId}/history"]["get"]["responses"]["200"]["content"]["application/json"];
}

export async function getWorkflowVersions({
	persistentId,
	searchParams,
	token,
}: {
	persistentId: string;
	searchParams?: GetWorkflowVersions.SearchParams;
	token: string;
}): Promise<GetWorkflowVersions.Response> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: `/api/workflows/${persistentId}/history`,
		searchParams: searchParams ? createUrlSearchParams(searchParams) : undefined,
	});

	return (await request(url, {
		headers: { authorization: token },
		responseType: "json",
	})) as GetWorkflowVersions.Response;
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
