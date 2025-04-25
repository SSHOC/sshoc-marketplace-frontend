import type { AuthData, PaginatedRequest, PaginatedResponse } from "@/data/sshoc/api/common";
import type { ItemBase, ItemBaseInput, ItemHistoryEntry, ItemsDiff } from "@/data/sshoc/api/item";
import type { Source } from "@/data/sshoc/api/source";
import type { User } from "@/data/sshoc/api/user";
import type { WorkflowStep } from "@/data/sshoc/api/workflow-step";
import type { RequestOptions } from "@/data/sshoc/lib/client";
import { createUrl, request } from "@/data/sshoc/lib/client";
import type { AllowedRequestOptions } from "@/data/sshoc/lib/types";
import { workflowInputSchema } from "@/data/sshoc/validation-schemas/workflow";

export interface Workflow extends ItemBase {
	category: "workflow";
	composedOf: Array<WorkflowStep>;
}

export type WorkflowInput = ItemBaseInput;

export namespace GetWorkflows {
	export type SearchParams = PaginatedRequest<{
		/** @default true */
		approved?: boolean;
	}>;
	export type Params = SearchParams;
	export type Response = PaginatedResponse<{
		workflows: Array<Workflow>;
	}>;
}

export function getWorkflows(
	params: GetWorkflows.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflows.Response> {
	const url = createUrl({ pathname: "/api/workflows", searchParams: params });
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflow {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
		/** @default true */
		approved?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Response = Workflow;
}

export function getWorkflow(
	params: GetWorkflow.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflow.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowVersion {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		versionId: Workflow["id"];
	}
	export type Params = PathParams;
	export type Response = Workflow;
}

export function getWorkflowVersion(
	params: GetWorkflowVersion.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowVersion.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/versions/${params.versionId}`,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowHistory {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
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

export function getWorkflowHistory(
	params: GetWorkflowHistory.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowHistory.Response> {
	const url = createUrl({ pathname: `/api/workflows/${params.persistentId}/history` });
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowInformationContributors {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
	}
	export type Params = PathParams;
	export type Response = Array<User>;
}

export function getWorkflowInformationContributors(
	params: GetWorkflowInformationContributors.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowInformationContributors.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/information-contributors`,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowVersionInformationContributors {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		versionId: Workflow["id"];
	}
	export type Params = PathParams;
	export type Response = Array<User>;
}

export function getWorkflowVersionInformationContributors(
	params: GetWorkflowVersionInformationContributors.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowVersionInformationContributors.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/versions/${params.versionId}/information-contributors`,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace CreateWorkflow {
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
	}
	export type Params = SearchParams;
	export type Body = WorkflowInput;
	export type Response = Workflow;
}

export function createWorkflow(
	params: CreateWorkflow.Params,
	data: CreateWorkflow.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<CreateWorkflow.Response> {
	const url = createUrl({ pathname: "/api/workflows", searchParams: params });
	const json = workflowInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "post", json };

	return request(url, options, auth);
}

export namespace CommitDraftWorkflow {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
	}
	export type Params = PathParams;
	export type Response = Workflow;
}

export function commitDraftWorkflow(
	params: CommitDraftWorkflow.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<CommitDraftWorkflow.Response> {
	const url = createUrl({ pathname: `/api/workflows/${params.persistentId}/commit` });
	const options: RequestOptions = { ...requestOptions, method: "post" };

	return request(url, options, auth);
}

export namespace UpdateWorkflow {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
		/** @default true */
		approved?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Body = WorkflowInput;
	export type Response = Workflow;
}

export function updateWorkflow(
	params: UpdateWorkflow.Params,
	data: UpdateWorkflow.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<UpdateWorkflow.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}`,
		searchParams: params,
	});
	const json = workflowInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "put", json };

	return request(url, options, auth);
}

export namespace DeleteWorkflow {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Response = void;
}

export function deleteWorkflow(
	params: DeleteWorkflow.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<DeleteWorkflow.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions, method: "delete", responseType: "void" };

	return request(url, options, auth);
}

export namespace DeleteWorkflowVersion {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		versionId: Workflow["id"];
	}
	export type Params = PathParams;
	export type Response = void;
}

export function deleteWorkflowVersion(
	params: DeleteWorkflowVersion.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<DeleteWorkflowVersion.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/versions/${params.versionId}`,
	});
	const options: RequestOptions = { ...requestOptions, method: "delete", responseType: "void" };

	return request(url, options, auth);
}

export namespace RevertWorkflowToVersion {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		versionId: Workflow["id"];
	}
	export type Params = PathParams;
	export type Response = Workflow;
}

export function revertWorkflowToVersion(
	params: RevertWorkflowToVersion.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<RevertWorkflowToVersion.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/versions/${params.versionId}/revert`,
	});
	const options: RequestOptions = { ...requestOptions, method: "put" };

	return request(url, options, auth);
}

export const approveWorkflowVersion = revertWorkflowToVersion;

export namespace GetMergedWorkflow {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
	}
	export interface SearchParams {
		with: Array<Workflow["persistentId"]>;
	}
	export type Params = PathParams & SearchParams;
	export type Response = Workflow;
}

export function getMergedWorkflow(
	params: GetMergedWorkflow.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetMergedWorkflow.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/merge`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace MergeWorkflows {
	export interface SearchParams {
		with: Array<Workflow["persistentId"]>;
	}
	export type Params = SearchParams;
	export type Body = WorkflowInput;
	export type Response = Workflow;
}

export function mergeWorkflows(
	params: MergeWorkflows.Params,
	data: MergeWorkflows.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<MergeWorkflows.Response> {
	const url = createUrl({ pathname: "/api/workflows/merge", searchParams: params });
	const json = workflowInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "post", json };

	return request(url, options, auth);
}

export namespace GetWorkflowDiff {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
	}
	export interface SearchParams {
		/** `persistentId` of item to compare with. */
		with: Workflow["persistentId"];
		/** `versionId` of item to compare with. */
		otherVersionId?: Workflow["id"];
	}
	export type Params = PathParams & SearchParams;
	export type Response = ItemsDiff;
}

export function getWorkflowDiff(
	params: GetWorkflowDiff.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowDiff.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/diff`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowVersionDiff {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		versionId: Workflow["id"];
	}
	export interface SearchParams {
		/** `persistentId` of item to compare with. */
		with: Workflow["persistentId"];
		/** `versionId` of item to compare with. */
		otherVersionId?: Workflow["id"];
	}
	export type Params = PathParams & SearchParams;
	export type Response = ItemsDiff;
}

export function getWorkflowVersionDiff(
	params: GetWorkflowVersionDiff.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowVersionDiff.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/versions/${params.versionId}/diff`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowSources {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
	}
	export type Params = PathParams;
	export type Response = Array<Source>;
}

export function getWorkflowSources(
	params: GetWorkflowSources.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowSources.Response> {
	const url = createUrl({ pathname: `/api/workflows/${params.persistentId}/sources` });
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}
