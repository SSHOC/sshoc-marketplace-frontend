import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import type { ToolDto } from '@/api/sshoc'
import { getTool } from '@/api/sshoc'
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

  if (id === undefined) {
    console.log(
      `Invalid tool id provided: ${JSON.stringify(context.params?.id)}`,
    )
    return { notFound: true }
  }

  try {
    const tool = await getTool({ persistentId: id }, {})
    return { props: { tool } }
  } catch (error) {
    console.log(`Failed to fetch tool ${id}: ${JSON.stringify(error)}`)
    return { notFound: true }
  }
}
