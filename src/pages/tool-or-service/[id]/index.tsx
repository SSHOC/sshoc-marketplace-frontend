import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getTool } from '@/api/sshoc'
import type { ToolDto } from '@/api/sshoc'
import ToolScreen from '@/screens/item/tool/ToolScreen'
import { sanitizeItemQueryParams } from '@/utils/sanitizeItemQueryParams'

export type PageProps = {
  tool: ToolDto
}

/**
 * Tool or service page.
 */
export default function ToolPage({ tool }: PageProps): JSX.Element {
  return <ToolScreen tool={tool} />
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageProps>> {
  const { id } = sanitizeItemQueryParams(context.params)

  if (id === undefined) return { notFound: true }

  try {
    const tool = await getTool({ id }, {})
    return { props: { tool } }
  } catch {
    /** context.res.statusCode = 404 */
    return { notFound: true }
  }
}
