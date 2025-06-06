import type { UseMutationOptions, UseMutationResult } from "react-query";
import { useMutation, useQueryClient } from "react-query";

import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { AuthData } from "@/data/sshoc/api/common";
import type { Tool, ToolInput } from "@/data/sshoc/api/tool-or-service";
import { commitDraftTool, createTool, updateTool } from "@/data/sshoc/api/tool-or-service";
import { keys as itemKeys } from "@/data/sshoc/hooks/item";
import { keys } from "@/data/sshoc/hooks/tool-or-service";
import type { AllowedRequestOptions } from "@/data/sshoc/lib/types";
import { useSession } from "@/data/sshoc/lib/useSession";
import { revalidate } from "@/lib/core/app/revalidate";

export namespace UseCreateOrUpdateTool {
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
	}
	export type Params = SearchParams;
	export type Body = ItemFormValues<ToolInput>;
	export type Variables = Params & { data: Body };
	export type Response = Tool;
}

export async function createOrUpdateTool(
	params: UseCreateOrUpdateTool.Params,
	data: UseCreateOrUpdateTool.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<UseCreateOrUpdateTool.Response> {
	if (params.draft === true) {
		if (data.persistentId == null) {
			return createTool({ draft: true }, data, auth, requestOptions);
		} else {
			return updateTool(
				{ persistentId: data.persistentId, draft: true },
				data,
				auth,
				requestOptions,
			);
		}
	} else {
		if (data.persistentId == null) {
			return createTool({}, data, auth, requestOptions);
		} else if (data.status === "draft") {
			await updateTool(
				{ persistentId: data.persistentId, draft: true },
				data,
				auth,
				requestOptions,
			);
			return commitDraftTool({ persistentId: data.persistentId }, auth, requestOptions);
		} else {
			return updateTool({ persistentId: data.persistentId }, data, auth, requestOptions);
		}
	}
}

export function useCreateOrUpdateTool(
	auth?: AuthData,
	options?: UseMutationOptions<
		UseCreateOrUpdateTool.Response,
		Error,
		UseCreateOrUpdateTool.Variables
	>,
): UseMutationResult<UseCreateOrUpdateTool.Response, Error, UseCreateOrUpdateTool.Variables> {
	// FIXME: should we keep state here about persistentId and status?
	// would need to be initialised with initial form values.
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data, ...params }: UseCreateOrUpdateTool.Variables) => {
			return createOrUpdateTool(params, data, session);
		},
		{
			...options,
			onSuccess(tool, ...args) {
				const pathname = `/tool-or-service/${tool.persistentId}`;
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(itemKeys.drafts());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ persistentId: tool.persistentId }));
				options?.onSuccess?.(tool, ...args);
			},
		},
	);
}
