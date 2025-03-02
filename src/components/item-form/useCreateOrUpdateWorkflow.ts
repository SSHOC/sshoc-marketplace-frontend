import type { UseMutationOptions, UseMutationResult } from 'react-query'
import { useMutation, useQueryClient } from 'react-query'

import type { ItemFormValues } from '@/components/item-form/ItemForm'
import type { AuthData } from '@/data/sshoc/api/common'
import type { Workflow, WorkflowInput } from '@/data/sshoc/api/workflow'
import { commitDraftWorkflow, createWorkflow, updateWorkflow } from '@/data/sshoc/api/workflow'
import type { WorkflowStepInput } from '@/data/sshoc/api/workflow-step'
import {
  createWorkflowStep,
  deleteWorkflowStep,
  updateWorkflowStep,
} from '@/data/sshoc/api/workflow-step'
import { keys as itemKeys } from '@/data/sshoc/hooks/item'
import { keys } from '@/data/sshoc/hooks/tool-or-service'
import type { AllowedRequestOptions } from '@/data/sshoc/lib/types'
import { useSession } from '@/data/sshoc/lib/useSession'
import { revalidate } from '@/lib/core/app/revalidate'

// FIXME: DRY up.
// TODO: export ItemFormValues<WorkflowInput & ...> type here, and use it on the /new page.

/* eslint-disable-next-line @typescript-eslint/no-namespace */
export namespace UseCreateOrUpdateWorkflow {
  export type SearchParams = {
    /** @default false */
    draft?: boolean
  }
  export type Params = SearchParams
  export type Body = ItemFormValues<
    WorkflowInput & { composedOf?: Array<ItemFormValues<WorkflowStepInput>> }
  >
  export type Variables = Params & { data: Body }
  export type Response = Workflow
}

export async function createOrUpdateWorkflow(
  params: UseCreateOrUpdateWorkflow.Params,
  data: UseCreateOrUpdateWorkflow.Body,
  auth?: AuthData,
  requestOptions?: AllowedRequestOptions,
): Promise<UseCreateOrUpdateWorkflow.Response> {
  const steps = data.composedOf ?? []

  if (params.draft === true) {
    if (data.persistentId == null) {
      const workflow = await createWorkflow({ draft: true }, data, auth, requestOptions)

      const createdSteps = []
      for (const [index, step] of steps.entries()) {
        const stepNo = index + 1
        const createdStep = await createWorkflowStep(
          { persistentId: workflow.persistentId, draft: true },
          { ...step, stepNo },
          auth,
          requestOptions,
        )
        createdSteps.push(createdStep)
      }

      return { ...workflow, composedOf: createdSteps }
    } else {
      const workflow = await updateWorkflow(
        { persistentId: data.persistentId, draft: true },
        data,
        auth,
        requestOptions,
      )

      const updatedSteps = []
      for (const [index, step] of steps.entries()) {
        const stepNo = index + 1
        const stepPersistentId = step.persistentId
        if (stepPersistentId != null) {
          const updatedStep = await updateWorkflowStep(
            { persistentId: workflow.persistentId, stepPersistentId, draft: true },
            { ...step, stepNo },
            auth,
            requestOptions,
          )
          updatedSteps.push(updatedStep)
        } else {
          const createdStep = await createWorkflowStep(
            { persistentId: workflow.persistentId, draft: true },
            { ...step, stepNo },
            auth,
            requestOptions,
          )
          updatedSteps.push(createdStep)
        }
      }

      const updatedStepIds = new Set(
        updatedSteps.map((step) => {
          return step.persistentId
        }),
      )
      const deletedSteps = workflow.composedOf.filter((step) => {
        return !updatedStepIds.has(step.persistentId)
      })
      for (const step of deletedSteps) {
        const stepPersistentId = step.persistentId
        await deleteWorkflowStep(
          {
            persistentId: workflow.persistentId,
            stepPersistentId,
            draft: true,
          },
          auth,
          requestOptions,
        )
      }

      return { ...workflow, composedOf: updatedSteps }
    }
  } else {
    if (data.persistentId == null) {
      const workflow = await createWorkflow({}, data, auth, requestOptions)

      const createdSteps = []
      for (const [index, step] of steps.entries()) {
        const stepNo = index + 1
        const createdStep = await createWorkflowStep(
          { persistentId: workflow.persistentId },
          { ...step, stepNo },
          auth,
          requestOptions,
        )
        createdSteps.push(createdStep)
      }

      return { ...workflow, composedOf: createdSteps }
    } else if (data.status === 'draft') {
      const workflow = await updateWorkflow(
        { persistentId: data.persistentId, draft: true },
        data,
        auth,
        requestOptions,
      )

      const updatedSteps = []
      for (const [index, step] of steps.entries()) {
        const stepNo = index + 1
        const stepPersistentId = step.persistentId
        if (stepPersistentId != null) {
          const updatedStep = await updateWorkflowStep(
            { persistentId: workflow.persistentId, stepPersistentId, draft: true },
            { ...step, stepNo },
            auth,
            requestOptions,
          )
          updatedSteps.push(updatedStep)
        } else {
          const createdStep = await createWorkflowStep(
            { persistentId: workflow.persistentId, draft: true },
            { ...step, stepNo },
            auth,
            requestOptions,
          )
          updatedSteps.push(createdStep)
        }
      }

      const updatedStepIds = new Set(
        updatedSteps.map((step) => {
          return step.persistentId
        }),
      )
      const deletedSteps = workflow.composedOf.filter((step) => {
        return !updatedStepIds.has(step.persistentId)
      })
      for (const step of deletedSteps) {
        const stepPersistentId = step.persistentId
        await deleteWorkflowStep(
          {
            persistentId: workflow.persistentId,
            stepPersistentId,
            draft: true,
          },
          auth,
          requestOptions,
        )
      }

      return commitDraftWorkflow({ persistentId: data.persistentId }, auth, requestOptions)
    } else {
      const workflow = await updateWorkflow(
        { persistentId: data.persistentId, draft: true },
        data,
        auth,
        requestOptions,
      )

      const updatedSteps = []
      for (const [index, step] of steps.entries()) {
        const stepNo = index + 1
        const stepPersistentId = step.persistentId
        if (stepPersistentId != null) {
          const updatedStep = await updateWorkflowStep(
            { persistentId: workflow.persistentId, stepPersistentId, draft: true },
            { ...step, stepNo },
            auth,
            requestOptions,
          )
          updatedSteps.push(updatedStep)
        } else {
          const createdStep = await createWorkflowStep(
            { persistentId: workflow.persistentId, draft: true },
            { ...step, stepNo },
            auth,
            requestOptions,
          )
          updatedSteps.push(createdStep)
        }
      }

      const updatedStepIds = new Set(
        updatedSteps.map((step) => {
          return step.persistentId
        }),
      )
      const deletedSteps = workflow.composedOf.filter((step) => {
        return !updatedStepIds.has(step.persistentId)
      })
      for (const step of deletedSteps) {
        const stepPersistentId = step.persistentId
        await deleteWorkflowStep(
          {
            persistentId: workflow.persistentId,
            stepPersistentId,
            draft: true,
          },
          auth,
          requestOptions,
        )
      }

      return commitDraftWorkflow({ persistentId: data.persistentId }, auth, requestOptions)
    }
  }
}

export function useCreateOrUpdateWorkflow(
  auth?: AuthData | undefined,
  options?: UseMutationOptions<
    UseCreateOrUpdateWorkflow.Response,
    Error,
    UseCreateOrUpdateWorkflow.Variables
  >,
): UseMutationResult<
  UseCreateOrUpdateWorkflow.Response,
  Error,
  UseCreateOrUpdateWorkflow.Variables
> {
  // FIXME: should we keep state here about persistentId and status and composedOf?
  // would need to be initialised with initial form values.
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data, ...params }: UseCreateOrUpdateWorkflow.Variables) => {
      return createOrUpdateWorkflow(params, data, session)
    },
    {
      ...options,
      onSuccess(workflow, ...args) {
        const pathname = `/workflow/${workflow.persistentId}`
        revalidate({ pathname })
        queryClient.invalidateQueries(itemKeys.search())
        queryClient.invalidateQueries(itemKeys.drafts())
        queryClient.invalidateQueries(keys.lists())
        queryClient.invalidateQueries(keys.detail({ persistentId: workflow.persistentId }))
        options?.onSuccess?.(workflow, ...args)
      },
    },
  )
}
