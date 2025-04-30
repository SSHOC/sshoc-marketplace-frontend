import type { AuthData, PaginatedRequest, PaginatedResponse } from "@/data/sshoc/api/common";
import type { ItemBase, ItemBaseInput, ItemHistoryEntry, ItemsDiff } from "@/data/sshoc/api/item";
import type { Source } from "@/data/sshoc/api/source";
import type { User } from "@/data/sshoc/api/user";
import type { RequestOptions } from "@/data/sshoc/lib/client";
import { createUrl, request } from "@/data/sshoc/lib/client";
import type { AllowedRequestOptions, IsoDateString } from "@/data/sshoc/lib/types";
import { datasetInputSchema } from "@/data/sshoc/validation-schemas/dataset";

export interface Dataset extends ItemBase {
	category: "dataset";
	dateCreated?: IsoDateString;
	dateLastUpdated?: IsoDateString;
}

export interface DatasetInput extends ItemBaseInput {
	// category: 'dataset'
	dateCreated?: IsoDateString;
	dateLastUpdated?: IsoDateString;
}

export namespace GetDatasets {
	export type SearchParams = PaginatedRequest<{
		/** @default true */
		approved?: boolean;
	}>;
	export type Params = SearchParams;
	export type Response = PaginatedResponse<{
		datasets: Array<Dataset>;
	}>;
}

export function getDatasets(
	params: GetDatasets.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetDatasets.Response> {
	const url = createUrl({ pathname: "/api/datasets", searchParams: params });
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetDataset {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
		/** @default true */
		approved?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Response = Dataset;
}

export function getDataset(
	params: GetDataset.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetDataset.Response> {
	const url = createUrl({ pathname: `/api/datasets/${params.persistentId}`, searchParams: params });
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetDatasetVersion {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
		versionId: Dataset["id"];
	}
	export type Params = PathParams;
	export type Response = Dataset;
}

export function getDatasetVersion(
	params: GetDatasetVersion.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetDatasetVersion.Response> {
	const url = createUrl({
		pathname: `/api/datasets/${params.persistentId}/versions/${params.versionId}`,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetDatasetHistory {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
		/** @default true */
		approved?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Response = Array<ItemHistoryEntry>;
}

export function getDatasetHistory(
	params: GetDatasetHistory.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetDatasetHistory.Response> {
	const url = createUrl({ pathname: `/api/datasets/${params.persistentId}/history` });
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetDatasetInformationContributors {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
	}
	export type Params = PathParams;
	export type Response = Array<User>;
}

export function getDatasetInformationContributors(
	params: GetDatasetInformationContributors.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetDatasetInformationContributors.Response> {
	const url = createUrl({
		pathname: `/api/datasets/${params.persistentId}/information-contributors`,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetDatasetVersionInformationContributors {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
		versionId: Dataset["id"];
	}
	export type Params = PathParams;
	export type Response = Array<User>;
}

export function getDatasetVersionInformationContributors(
	params: GetDatasetVersionInformationContributors.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetDatasetVersionInformationContributors.Response> {
	const url = createUrl({
		pathname: `/api/datasets/${params.persistentId}/versions/${params.versionId}/information-contributors`,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace CreateDataset {
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
	}
	export type Params = SearchParams;
	export type Body = DatasetInput;
	export type Response = Dataset;
}

export function createDataset(
	params: CreateDataset.Params,
	data: CreateDataset.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<CreateDataset.Response> {
	const url = createUrl({ pathname: "/api/datasets", searchParams: params });
	const json = datasetInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "post", json };

	return request(url, options, auth);
}

export namespace CommitDraftDataset {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
	}
	export type Params = PathParams;
	export type Response = Dataset;
}

export function commitDraftDataset(
	params: CommitDraftDataset.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<CommitDraftDataset.Response> {
	const url = createUrl({ pathname: `/api/datasets/${params.persistentId}/commit` });
	const options: RequestOptions = { ...requestOptions, method: "post" };

	return request(url, options, auth);
}

export namespace UpdateDataset {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
		/** @default true */
		approved?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Body = DatasetInput;
	export type Response = Dataset;
}

export function updateDataset(
	params: UpdateDataset.Params,
	data: UpdateDataset.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<UpdateDataset.Response> {
	const url = createUrl({ pathname: `/api/datasets/${params.persistentId}`, searchParams: params });
	const json = datasetInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "put", json };

	return request(url, options, auth);
}

export namespace DeleteDataset {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Response = void;
}

export function deleteDataset(
	params: DeleteDataset.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<DeleteDataset.Response> {
	const url = createUrl({ pathname: `/api/datasets/${params.persistentId}`, searchParams: params });
	const options: RequestOptions = { ...requestOptions, method: "delete", responseType: "void" };

	return request(url, options, auth);
}

export namespace DeleteDatasetVersion {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
		versionId: Dataset["id"];
	}
	export type Params = PathParams;
	export type Response = void;
}

export function deleteDatasetVersion(
	params: DeleteDatasetVersion.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<DeleteDatasetVersion.Response> {
	const url = createUrl({
		pathname: `/api/datasets/${params.persistentId}/versions/${params.versionId}`,
	});
	const options: RequestOptions = { ...requestOptions, method: "delete", responseType: "void" };

	return request(url, options, auth);
}

export namespace RevertDatasetToVersion {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
		versionId: Dataset["id"];
	}
	export type Params = PathParams;
	export type Response = Dataset;
}

export function revertDatasetToVersion(
	params: RevertDatasetToVersion.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<RevertDatasetToVersion.Response> {
	const url = createUrl({
		pathname: `/api/datasets/${params.persistentId}/versions/${params.versionId}/revert`,
	});
	const options: RequestOptions = { ...requestOptions, method: "put" };

	return request(url, options, auth);
}

export const approveDatasetVersion = revertDatasetToVersion;
export const rejectDatasetVersion = deleteDatasetVersion;

export namespace GetMergedDataset {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
	}
	export interface SearchParams {
		with: Array<Dataset["persistentId"]>;
	}
	export type Params = PathParams & SearchParams;
	export type Response = Dataset;
}

export function getMergedDataset(
	params: GetMergedDataset.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetMergedDataset.Response> {
	const url = createUrl({
		pathname: `/api/datasets/${params.persistentId}/merge`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace MergeDatasets {
	export interface SearchParams {
		with: Array<Dataset["persistentId"]>;
	}
	export type Params = SearchParams;
	export type Body = DatasetInput;
	export type Response = Dataset;
}

export function mergeDatasets(
	params: MergeDatasets.Params,
	data: MergeDatasets.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<MergeDatasets.Response> {
	const url = createUrl({ pathname: "/api/datasets/merge", searchParams: params });
	const json = datasetInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "post", json };

	return request(url, options, auth);
}

export namespace GetDatasetDiff {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
	}
	export interface SearchParams {
		/** `persistentId` of item to compare with. */
		with: Dataset["persistentId"];
		/** `versionId` of item to compare with. */
		otherVersionId?: Dataset["id"];
	}
	export type Params = PathParams & SearchParams;
	export type Response = ItemsDiff;
}

export function getDatasetDiff(
	params: GetDatasetDiff.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetDatasetDiff.Response> {
	const url = createUrl({
		pathname: `/api/datasets/${params.persistentId}/diff`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetDatasetVersionDiff {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
		versionId: Dataset["id"];
	}
	export interface SearchParams {
		/** `persistentId` of item to compare with. */
		with: Dataset["persistentId"];
		/** `versionId` of item to compare with. */
		otherVersionId?: Dataset["id"];
	}
	export type Params = PathParams & SearchParams;
	export type Response = ItemsDiff;
}

export function getDatasetVersionDiff(
	params: GetDatasetVersionDiff.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetDatasetVersionDiff.Response> {
	const url = createUrl({
		pathname: `/api/datasets/${params.persistentId}/versions/${params.versionId}/diff`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetDatasetSources {
	export interface PathParams {
		persistentId: Dataset["persistentId"];
	}
	export type Params = PathParams;
	export type Response = Array<Source>;
}

export function getDatasetSources(
	params: GetDatasetSources.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetDatasetSources.Response> {
	const url = createUrl({ pathname: `/api/datasets/${params.persistentId}/sources` });
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}
