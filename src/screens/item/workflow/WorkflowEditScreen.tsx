import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetWorkflow } from '@/api/sshoc'
import { convertToInitialFormValues } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/WorkflowEditForm/WorkflowEditForm'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { useAuth } from '@/modules/auth/AuthContext'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'

/**
 * Edit workflow screen.
 */
export default function WorkflowEditScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()

  const id = router.query.id as string | undefined
  const workflow = useGetWorkflow(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { persistentId: id! },
    {},
    {
      enabled: id != null,
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
          {workflow.data === undefined || id == undefined ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemForm
              id={id}
              versionId={workflow.data.id!}
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
