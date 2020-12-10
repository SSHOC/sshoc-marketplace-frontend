import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getPublication } from '@/api/sshoc'
import type { PublicationDto } from '@/api/sshoc'
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

  if (id === undefined) return { notFound: true }

  try {
    const publication = await getPublication({ id }, {})
    return { props: { publication } }
  } catch {
    /** context.res.statusCode = 404 */
    return { notFound: true }
  }
}
