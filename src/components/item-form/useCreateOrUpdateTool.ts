import type { UseMutationOptions, UseMutationResult } from "react-query";
import { useMutation, useQueryClient } from "react-query";

import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { AuthData } from "@/lib/data/sshoc/api/common";
import type { Tool, ToolInput } from "@/lib/data/sshoc/api/tool-or-service";
import {
  commitDraftTool,
  createTool,
  updateTool,
} from "@/lib/data/sshoc/api/tool-or-service";
import { keys as itemKeys } from "@/lib/data/sshoc/hooks/item";
import { keys } from "@/lib/data/sshoc/hooks/tool-or-service";
import type { AllowedRequestOptions } from "@/lib/data/sshoc/lib/types";
import { useSession } from "@/lib/data/sshoc/lib/useSession";
import { revalidate } from "@/lib/core/app/revalidate";
import { routes } from "@/lib/core/navigation/routes";

/* eslint-disable-next-line @typescript-eslint/no-namespace */
export namespace UseCreateOrUpdateTool {
  export type SearchParams = {
    /** @default false */
    draft?: boolean;
  };
  export type Params = SearchParams;
  export type Body = ItemFormValues<ToolInput>;
  export type Variables = Params & { data: Body };
  export type Response = Tool;
}

export async function createOrUpdateTool(
  params: UseCreateOrUpdateTool.Params,
  data: UseCreateOrUpdateTool.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions
): Promise<UseCreateOrUpdateTool.Response> {
  if (params.draft === true) {
    if (data.persistentId == null) {
      return createTool({ draft: true }, data, auth, requestOptions);
    } else {
      return updateTool(
        { persistentId: data.persistentId, draft: true },
        data,
        auth,
        requestOptions
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
        requestOptions
      );
      return commitDraftTool(
        { persistentId: data.persistentId },
        auth,
        requestOptions
      );
    } else {
      return updateTool(
        { persistentId: data.persistentId },
        data,
        auth,
        requestOptions
      );
    }
  }
}

export function useCreateOrUpdateTool(
  auth?: AuthData | undefined,
  options?: UseMutationOptions<
    UseCreateOrUpdateTool.Response,
    Error,
    UseCreateOrUpdateTool.Variables
  >
): UseMutationResult<
  UseCreateOrUpdateTool.Response,
  Error,
  UseCreateOrUpdateTool.Variables
> {
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
        const pathname = routes.ToolOrServicePage({
          persistentId: tool.persistentId,
        }).pathname;
        revalidate({ pathname });
        queryClient.invalidateQueries(itemKeys.search());
        queryClient.invalidateQueries(itemKeys.drafts());
        queryClient.invalidateQueries(keys.lists());
        queryClient.invalidateQueries(
          keys.detail({ persistentId: tool.persistentId })
        );
        options?.onSuccess?.(tool, ...args);
      },
    }
  );
}
