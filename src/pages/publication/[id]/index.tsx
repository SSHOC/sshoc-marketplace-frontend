import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import type { PublicationDto } from '@/api/sshoc'
import { getPublication } from '@/api/sshoc'
import PublicationScreen from '@/screens/item/publication/PublicationScreen'
import { sanitizeItemQueryParams } from '@/utils/sanitizeItemQueryParams'

export type PageProps = {
  publication: PublicationDto
}

/**
 * Publication page.
 */
export default function PublicationPage({
  publication,
}: PageProps): JSX.Element {
  return <PublicationScreen publication={publication} />
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageProps>> {
  const { id } = sanitizeItemQueryParams(context.params)

  if (id === undefined) {
    console.log(
      `Invalid publication id provided: ${JSON.stringify(context.params?.id)}`,
    )
    return { notFound: true }
  }

  try {
    const publication = await getPublication({ id }, {})
    return { props: { publication } }
  } catch (error) {
    console.log(`Failed to fetch publication ${id}: ${JSON.stringify(error)}`)
    return { notFound: true }
  }
}
