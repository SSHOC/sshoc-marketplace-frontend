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

  if (id === undefined) return { notFound: true }

  try {
    const workflow = await getWorkflow({ workflowId: id })
    return { props: { workflow } }
  } catch {
    /** context.res.statusCode = 404 */
    return { notFound: true }
  }
}
