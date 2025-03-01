import type { UseMutationOptions, UseMutationResult } from 'react-query'
import { useMutation, useQueryClient } from 'react-query'

import type { ItemFormValues } from '@/components/item-form/ItemForm'
import type { AuthData } from '@/data/sshoc/api/common'
import type { Publication, PublicationInput } from '@/data/sshoc/api/publication'
import {
  commitDraftPublication,
  createPublication,
  updatePublication,
} from '@/data/sshoc/api/publication'
import { keys as itemKeys } from '@/data/sshoc/hooks/item'
import { keys } from '@/data/sshoc/hooks/publication'
import type { AllowedRequestOptions } from '@/data/sshoc/lib/types'
import { useSession } from '@/data/sshoc/lib/useSession'
import { revalidate } from '@/lib/core/app/revalidate'

/* eslint-disable-next-line @typescript-eslint/no-namespace */
export namespace UseCreateOrUpdatePublication {
  export type SearchParams = {
    /** @default false */
    draft?: boolean
  }
  export type Params = SearchParams
  export type Body = ItemFormValues<PublicationInput>
  export type Variables = Params & { data: Body }
  export type Response = Publication
}

export async function createOrUpdatePublication(
  params: UseCreateOrUpdatePublication.Params,
  data: UseCreateOrUpdatePublication.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UseCreateOrUpdatePublication.Response> {
  if (params.draft === true) {
    if (data.persistentId == null) {
      return createPublication({ draft: true }, data, auth, requestOptions)
    } else {
      return updatePublication(
        { persistentId: data.persistentId, draft: true },
        data,
        auth,
        requestOptions,
      )
    }
  } else {
    if (data.persistentId == null) {
      return createPublication({}, data, auth, requestOptions)
    } else if (data.status === 'draft') {
      await updatePublication(
        { persistentId: data.persistentId, draft: true },
        data,
        auth,
        requestOptions,
      )
      return commitDraftPublication({ persistentId: data.persistentId }, auth, requestOptions)
    } else {
      return updatePublication({ persistentId: data.persistentId }, data, auth, requestOptions)
    }
  }
}

export function useCreateOrUpdatePublication(
  auth?: AuthData | undefined,
  options?: UseMutationOptions<
    UseCreateOrUpdatePublication.Response,
    Error,
    UseCreateOrUpdatePublication.Variables
  >,
): UseMutationResult<
  UseCreateOrUpdatePublication.Response,
  Error,
  UseCreateOrUpdatePublication.Variables
> {
  // FIXME: should we keep state here about persistentId and status?
  // would need to be initialised with initial form values.
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data, ...params }: UseCreateOrUpdatePublication.Variables) => {
      return createOrUpdatePublication(params, data, session)
    },
    {
      ...options,
      onSuccess(publication, ...args) {
        const pathname = routes.PublicationPage({
          persistentId: publication.persistentId,
        }).pathname
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(itemKeys.drafts())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: publication.persistentId }))
        options?.onSuccess?.(publication, ...args)
      },
    },
  )
}
