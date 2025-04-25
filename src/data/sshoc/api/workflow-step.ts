import type { AuthData } from "@/data/sshoc/api/common";
import type { ItemBase, ItemBaseInput, ItemHistoryEntry, ItemsDiff } from "@/data/sshoc/api/item";
import type { Source } from "@/data/sshoc/api/source";
import type { User } from "@/data/sshoc/api/user";
import type { Workflow } from "@/data/sshoc/api/workflow";
import type { RequestOptions } from "@/data/sshoc/lib/client";
import { createUrl, request } from "@/data/sshoc/lib/client";
import type { AllowedRequestOptions } from "@/data/sshoc/lib/types";
import { workflowStepInputSchema } from "@/data/sshoc/validation-schemas/workflow-step";

export interface WorkflowStep extends ItemBase {
	category: "step";
	composedOf: Array<WorkflowStep>;
}

export interface WorkflowStepInput extends ItemBaseInput {
	// category: 'step'
	stepNo?: number;
}

export namespace GetWorkflowStep {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
		/** @default true */
		approved?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Response = WorkflowStep;
}

export function getWorkflowStep(
	params: GetWorkflowStep.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowStep.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowStepVersion {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
		stepVersionId: WorkflowStep["id"];
	}
	export type Params = PathParams;
	export type Response = WorkflowStep;
}

export function getWorkflowStepVersion(
	params: GetWorkflowStepVersion.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowStepVersion.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}/versions/${params.stepVersionId}`,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowStepHistory {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
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

export function getWorkflowStepHistory(
	params: GetWorkflowStepHistory.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowStepHistory.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}/history`,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowStepInformationContributors {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
	}
	export type Params = PathParams;
	export type Response = Array<User>;
}

export function getWorkflowStepInformationContributors(
	params: GetWorkflowStepInformationContributors.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowStepInformationContributors.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}/information-contributors`,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowStepVersionInformationContributors {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
		stepVersionId: WorkflowStep["id"];
	}
	export type Params = PathParams;
	export type Response = Array<User>;
}

export function getWorkflowStepVersionInformationContributors(
	params: GetWorkflowStepVersionInformationContributors.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowStepVersionInformationContributors.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}/versions/${params.stepVersionId}/information-contributors`,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace CreateWorkflowStep {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Body = WorkflowStepInput;
	export type Response = WorkflowStep;
}

export function createWorkflowStep(
	params: CreateWorkflowStep.Params,
	data: CreateWorkflowStep.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<CreateWorkflowStep.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps`,
		searchParams: params,
	});
	const json = workflowStepInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "post", json };

	return request(url, options, auth);
}

export namespace CreateWorkflowSubStep {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Body = WorkflowStepInput;
	export type Response = WorkflowStep;
}

export function createWorkflowSubStep(
	params: CreateWorkflowSubStep.Params,
	data: CreateWorkflowSubStep.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<CreateWorkflowSubStep.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}/steps`,
		searchParams: params,
	});
	const json = workflowStepInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "post", json };

	return request(url, options, auth);
}

export namespace UpdateWorkflowStep {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
		/** @default true */
		approved?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Body = WorkflowStepInput;
	export type Response = WorkflowStep;
}

export function updateWorkflowStep(
	params: UpdateWorkflowStep.Params,
	data: UpdateWorkflowStep.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<UpdateWorkflowStep.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}`,
		searchParams: params,
	});
	const json = workflowStepInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "put", json };

	return request(url, options, auth);
}

export namespace DeleteWorkflowStep {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
	}
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
	}
	export type Params = PathParams & SearchParams;
	export type Response = void;
}

export function deleteWorkflowStep(
	params: DeleteWorkflowStep.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<DeleteWorkflowStep.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions, method: "delete", responseType: "void" };

	return request(url, options, auth);
}

export namespace DeleteWorkflowStepVersion {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
		stepVersionId: WorkflowStep["id"];
	}
	export type Params = PathParams;
	export type Response = void;
}

export function deleteWorkflowStepVersion(
	params: DeleteWorkflowStepVersion.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<DeleteWorkflowStepVersion.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}/versions/${params.stepVersionId}`,
	});
	const options: RequestOptions = { ...requestOptions, method: "delete", responseType: "void" };

	return request(url, options, auth);
}

export namespace RevertWorkflowStepToVersion {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
		stepVersionId: WorkflowStep["id"];
	}
	export type Params = PathParams;
	export type Response = WorkflowStep;
}

export function revertWorkflowStepToVersion(
	params: RevertWorkflowStepToVersion.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<RevertWorkflowStepToVersion.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}/versions/${params.stepVersionId}/revert`,
	});
	const options: RequestOptions = { ...requestOptions, method: "put" };

	return request(url, options, auth);
}

export const approveWorkflowStepVersion = revertWorkflowStepToVersion;

export namespace GetMergedWorkflowStep {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
	}
	export interface SearchParams {
		with: Array<WorkflowStep["persistentId"]>;
	}
	export type Params = PathParams & SearchParams;
	export type Response = WorkflowStep;
}

export function getMergedWorkflowStep(
	params: GetMergedWorkflowStep.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetMergedWorkflowStep.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}/merge`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace MergeWorkflowSteps {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
	}
	export interface SearchParams {
		with: Array<WorkflowStep["persistentId"]>;
	}
	export type Params = PathParams & SearchParams;
	export type Body = WorkflowStepInput;
	export type Response = WorkflowStep;
}

export function mergeWorkflowSteps(
	params: MergeWorkflowSteps.Params,
	data: MergeWorkflowSteps.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<MergeWorkflowSteps.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/merge`,
		searchParams: params,
	});
	const json = workflowStepInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "post", json };

	return request(url, options, auth);
}

export namespace GetWorkflowStepDiff {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
	}
	export interface SearchParams {
		/** `persistentId` of item to compare with. */
		with: WorkflowStep["persistentId"];
		/** `versionId` of item to compare with. */
		otherVersionId?: WorkflowStep["id"];
	}
	export type Params = PathParams & SearchParams;
	export type Response = ItemsDiff;
}

export function getWorkflowStepDiff(
	params: GetWorkflowStepDiff.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowStepDiff.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}/diff`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowStepVersionDiff {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
		stepVersionId: WorkflowStep["id"];
	}
	export interface SearchParams {
		/** `persistentId` of item to compare with. */
		with: WorkflowStep["persistentId"];
		/** `versionId` of item to compare with. */
		otherVersionId?: WorkflowStep["id"];
	}
	export type Params = PathParams & SearchParams;
	export type Response = ItemsDiff;
}

export function getWorkflowStepVersionDiff(
	params: GetWorkflowStepVersionDiff.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowStepVersionDiff.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}/versions/${params.stepVersionId}/diff`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetWorkflowStepSources {
	export interface PathParams {
		persistentId: Workflow["persistentId"];
		stepPersistentId: WorkflowStep["persistentId"];
	}
	export type Params = PathParams;
	export type Response = Array<Source>;
}

export function getWorkflowStepSources(
	params: GetWorkflowStepSources.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetWorkflowStepSources.Response> {
	const url = createUrl({
		pathname: `/api/workflows/${params.persistentId}/steps/${params.stepPersistentId}/sources`,
	});
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}
