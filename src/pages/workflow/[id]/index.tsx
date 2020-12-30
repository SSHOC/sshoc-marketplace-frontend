import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getWorkflow } from '@/api/sshoc'
import type { WorkflowDto } from '@/api/sshoc'
import WorkflowScreen from '@/screens/item/workflow/WorkflowScreen'
import { sanitizeItemQueryParams } from '@/utils/sanitizeItemQueryParams'

export type PageProps = {
  workflow: WorkflowDto
}

/**
 * Workflow page.
 */
export default function WorkflowPage({ workflow }: PageProps): JSX.Element {
  return <WorkflowScreen workflow={workflow} />
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageProps>> {
  const { id } = sanitizeItemQueryParams(context.params)

  if (id === undefined) {
    console.log(
      `Invalid workflow id provided: ${JSON.stringify(context.params?.id)}`,
    )
    return { notFound: true }
  }

  try {
    const workflow = await getWorkflow({ workflowId: id }, {})
    return { props: { workflow } }
  } catch (error) {
    console.log(`Failed to fetch workflow ${id}: ${JSON.stringify(error)}`)
    return { notFound: true }
  }
}
