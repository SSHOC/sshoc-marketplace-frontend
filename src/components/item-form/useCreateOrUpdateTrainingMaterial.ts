import type { UseMutationOptions, UseMutationResult } from "react-query";
import { useMutation, useQueryClient } from "react-query";

import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { AuthData } from "@/data/sshoc/api/common";
import type { TrainingMaterial, TrainingMaterialInput } from "@/data/sshoc/api/training-material";
import {
	commitDraftTrainingMaterial,
	createTrainingMaterial,
	updateTrainingMaterial,
} from "@/data/sshoc/api/training-material";
import { keys as itemKeys } from "@/data/sshoc/hooks/item";
import { keys } from "@/data/sshoc/hooks/training-material";
import type { AllowedRequestOptions } from "@/data/sshoc/lib/types";
import { useSession } from "@/data/sshoc/lib/useSession";
import { revalidate } from "@/lib/core/app/revalidate";

export namespace UseCreateOrUpdateTrainingMaterial {
	export interface SearchParams {
		/** @default false */
		draft?: boolean;
	}
	export type Params = SearchParams;
	export type Body = ItemFormValues<TrainingMaterialInput>;
	export type Variables = Params & { data: Body };
	export type Response = TrainingMaterial;
}

export async function createOrUpdateTrainingMaterial(
	params: UseCreateOrUpdateTrainingMaterial.Params,
	data: UseCreateOrUpdateTrainingMaterial.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<UseCreateOrUpdateTrainingMaterial.Response> {
	if (params.draft === true) {
		if (data.persistentId == null) {
			return createTrainingMaterial({ draft: true }, data, auth, requestOptions);
		} else {
			return updateTrainingMaterial(
				{ persistentId: data.persistentId, draft: true },
				data,
				auth,
				requestOptions,
			);
		}
	} else {
		if (data.persistentId == null) {
			return createTrainingMaterial({}, data, auth, requestOptions);
		} else if (data.status === "draft") {
			await updateTrainingMaterial(
				{ persistentId: data.persistentId, draft: true },
				data,
				auth,
				requestOptions,
			);
			return commitDraftTrainingMaterial({ persistentId: data.persistentId }, auth, requestOptions);
		} else {
			return updateTrainingMaterial(
				{ persistentId: data.persistentId },
				data,
				auth,
				requestOptions,
			);
		}
	}
}

export function useCreateOrUpdateTrainingMaterial(
	auth?: AuthData,
	options?: UseMutationOptions<
		UseCreateOrUpdateTrainingMaterial.Response,
		Error,
		UseCreateOrUpdateTrainingMaterial.Variables
	>,
): UseMutationResult<
	UseCreateOrUpdateTrainingMaterial.Response,
	Error,
	UseCreateOrUpdateTrainingMaterial.Variables
> {
	// FIXME: should we keep state here about persistentId and status?
	// would need to be initialised with initial form values.
	const queryClient = useQueryClient();
	const session = useSession(auth);
	return useMutation(
		({ data, ...params }: UseCreateOrUpdateTrainingMaterial.Variables) => {
			return createOrUpdateTrainingMaterial(params, data, session);
		},
		{
			...options,
			onSuccess(trainingMaterial, ...args) {
				const pathname = `/training-material/${trainingMaterial.persistentId}`;
				revalidate({ pathname });
				queryClient.invalidateQueries(itemKeys.search());
				queryClient.invalidateQueries(itemKeys.drafts());
				queryClient.invalidateQueries(keys.lists());
				queryClient.invalidateQueries(keys.detail({ persistentId: trainingMaterial.persistentId }));
				options?.onSuccess?.(trainingMaterial, ...args);
			},
		},
	);
}
