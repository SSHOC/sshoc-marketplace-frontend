import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetWorkflow } from '@/api/sshoc'
import { convertToInitialFormValues } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/WorkflowEditForm/WorkflowEditForm'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Edit draft workflow screen.
 */
export default function WorkflowDraftEditScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()
  const handleError = useErrorHandlers()

  const id = router.query.id as string | undefined
  // const draftId = Number(router.query.draftId) as number | undefined
  // const workflow = useGetWorkflowVersion(
  //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //   { workflowId: id!, versionId: draftId! },
  //   {
  //     enabled:
  //       id != null && draftId != null && auth.session?.accessToken != null,
  //   },
  //   { token: auth.session?.accessToken },
  // )
  // FIXME: Event though the version history screen lists multiple drafts for an item
  // we can actually only get one draft (the latest) by setting `?draft=true`.
  // The version endpoint above does not work because it explicitly does
  // not handles drafts (only returns them for admins).
  const workflow = useGetWorkflow(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { workflowId: id! },
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
    },
    { token: auth.session?.accessToken },
  )

  return (
    <Fragment>
      <Metadata noindex title="Edit workflow" />
      <GridLayout style={{ alignContent: 'stretch ' }}>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>Edit workflow</Title>
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
