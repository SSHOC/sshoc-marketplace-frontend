import { useRouter } from 'next/router'
import { Fragment } from 'react'

import {
  HttpError,
  useGetWorkflowAndVersionedItemDifferences,
  useGetWorkflowVersion,
} from '@/api/sshoc'
import { convertToInitialFormValues } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/WorkflowEditForm/WorkflowEditForm'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'

/**
 * Edit workflow version screen.
 */
export default function WorkflowVersionEditScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()
  const handleError = useErrorHandlers()

  const id = useQueryParam('id', false)
  const versionId = useQueryParam('versionId', false, Number)
  const workflow = useGetWorkflowVersion(
    { persistentId: id!, versionId: versionId! },
    {
      enabled: id != null && versionId != null && auth.session?.accessToken != null,
      onError(error) {
        toast.error('Failed to fetch workflow version')

        router.push('/')

        if (error instanceof Error) {
          handleError(error)
        }
      },
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    { token: auth.session?.accessToken },
  )

  const isReview = useQueryParam('review', false, Boolean) === true
  const diff = useGetWorkflowAndVersionedItemDifferences(
    { persistentId: id! },
    { with: id!, otherVersionId: versionId! },
    {
      enabled: isReview && auth.session?.accessToken != null,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      /** 404 error is legitimate, since it just means there is no existing approved vesion. */
      retry: false,
    },
    { token: auth.session?.accessToken },
  )

  return (
    <Fragment>
      <Metadata noindex title="Edit workflow" />
      <GridLayout style={{ alignContent: 'stretch ' }}>
        <ContentColumn className="px-6 py-12 space-y-12">
          {workflow.data == null ||
          id == null ||
          (isReview && diff.data == null && diff.error == null) ||
          // when there is no approved version yet, the diff endpoint will return 404
          (isReview && diff.error instanceof HttpError && diff.error.statusCode !== 404) ? (
            <div className="flex flex-col items-center justify-center">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemForm
              id={id}
              category="workflow"
              initialValues={convertToInitialFormValues(workflow.data)}
              item={workflow.data}
              diff={diff.data}
            />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
