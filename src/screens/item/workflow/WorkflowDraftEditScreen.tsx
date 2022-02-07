import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetWorkflow } from '@/api/sshoc'
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
 * Edit draft workflow screen.
 */
export default function WorkflowDraftEditScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()
  const handleError = useErrorHandlers()

  const id = useQueryParam('id', false)
  const workflow = useGetWorkflow(
    { persistentId: id! },
    { draft: true },
    {
      enabled: id != null && auth.session?.accessToken != null,
      onError(error) {
        toast.error('Failed to fetch draft workflow')

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

  return (
    <Fragment>
      <Metadata noindex title="Edit workflow" />
      <GridLayout style={{ alignContent: 'stretch ' }}>
        <ContentColumn className="px-6 py-12 space-y-12">
          {workflow.data === undefined || id == null ? (
            <div className="flex flex-col items-center justify-center">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemForm
              id={id}
              category="workflow"
              initialValues={convertToInitialFormValues(workflow.data)}
              item={workflow.data}
            />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
