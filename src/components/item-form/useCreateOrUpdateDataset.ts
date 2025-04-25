import type { UseMutationOptions, UseMutationResult } from 'react-query'
import { useMutation, useQueryClient } from 'react-query'

import type { ItemFormValues } from '@/components/item-form/ItemForm'
import type { AuthData } from '@/data/sshoc/api/common'
import type { Dataset, DatasetInput } from '@/data/sshoc/api/dataset'
import { commitDraftDataset, createDataset, updateDataset } from '@/data/sshoc/api/dataset'
import { keys } from '@/data/sshoc/hooks/dataset'
import { keys as itemKeys } from '@/data/sshoc/hooks/item'
import type { AllowedRequestOptions } from '@/data/sshoc/lib/types'
import { useSession } from '@/data/sshoc/lib/useSession'
import { revalidate } from '@/lib/core/app/revalidate'

 
export namespace UseCreateOrUpdateDataset {
  export interface SearchParams {
    /** @default false */
    draft?: boolean
  }
  export type Params = SearchParams
  export type Body = ItemFormValues<DatasetInput>
  export type Variables = Params & { data: Body }
  export type Response = Dataset
}

export async function createOrUpdateDataset(
  params: UseCreateOrUpdateDataset.Params,
  data: UseCreateOrUpdateDataset.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UseCreateOrUpdateDataset.Response> {
  if (params.draft === true) {
    if (data.persistentId == null) {
      return createDataset({ draft: true }, data, auth, requestOptions)
    } else {
      return updateDataset(
        { persistentId: data.persistentId, draft: true },
        data,
        auth,
        requestOptions,
      )
    }
  } else {
    if (data.persistentId == null) {
      return createDataset({}, data, auth, requestOptions)
    } else if (data.status === 'draft') {
      await updateDataset(
        { persistentId: data.persistentId, draft: true },
        data,
        auth,
        requestOptions,
      )
      return commitDraftDataset({ persistentId: data.persistentId }, auth, requestOptions)
    } else {
      return updateDataset({ persistentId: data.persistentId }, data, auth, requestOptions)
    }
  }
}

export function useCreateOrUpdateDataset(
  auth?: AuthData  ,
  options?: UseMutationOptions<
    UseCreateOrUpdateDataset.Response,
    Error,
    UseCreateOrUpdateDataset.Variables
  >,
): UseMutationResult<UseCreateOrUpdateDataset.Response, Error, UseCreateOrUpdateDataset.Variables> {
  // FIXME: should we keep state here about persistentId and status?
  // would need to be initialised with initial form values.
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data, ...params }: UseCreateOrUpdateDataset.Variables) => {
      return createOrUpdateDataset(params, data, session)
    },
    {
      ...options,
      onSuccess(dataset, ...args) {
        const pathname = `/dataset/${dataset.persistentId}`
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(itemKeys.drafts())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: dataset.persistentId }))
        options?.onSuccess?.(dataset, ...args)
      },
    },
  )
}
