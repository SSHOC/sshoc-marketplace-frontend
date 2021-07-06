import { JsonLd } from '@stefanprobst/next-page-metadata'
import { Fragment } from 'react'
import type { DeepRequired } from 'utility-types'

import type { WorkflowDto } from '@/api/sshoc'
import { useGetWorkflow } from '@/api/sshoc'
import { useAuth } from '@/modules/auth/AuthContext'
import type { PageProps } from '@/pages/workflow/[id]/index'
import ItemLayout from '@/screens/item/ItemLayout'
import Steps from '@/screens/item/workflow/Steps'

/**
 * Workflow screen.
 */
export default function WorkflowScreen({
  workflow: initialData,
}: PageProps): JSX.Element {
  /** token is used to get hidden properties */
  const auth = useAuth()

  /**
   * populate client cache with data from getServerSideProps,
   * to allow background refreshing
   */
  const { data } = useGetWorkflow(
    { workflowId: initialData.persistentId! },
    {},
    { enabled: initialData.persistentId !== undefined, initialData },
    { token: auth.session?.accessToken },
  )
  /** backend does not specify required fields. should be safe here */
  const workflow = (data ?? initialData) as DeepRequired<WorkflowDto>

  const license = workflow.properties.find((property) => {
    return property.type.code === 'license'
  })?.concept.label

  return (
    <Fragment>
      {workflow !== undefined ? (
        <JsonLd
          schema={{
            '@type': 'HowTo',
            headline: workflow.label,
            name: workflow.label,
            abstract: workflow.description,
            description: workflow.description,
            url: workflow.accessibleAt,
            about: workflow.properties
              .filter((property) => property.type.code === 'keyword')
              .map((property) => property.value),
            license,
            version: workflow.version,
            contributor: workflow.contributors.map(
              (contributor) => contributor.actor.name,
            ),
            inLanguage: workflow.properties
              .filter((property) => property.type.code === 'language')
              .map((property) => property.concept.label),
            // step => composedOf
          }}
        />
      ) : null}
      <ItemLayout item={workflow}>
        <Steps steps={workflow.composedOf} />
      </ItemLayout>
    </Fragment>
  )
}
