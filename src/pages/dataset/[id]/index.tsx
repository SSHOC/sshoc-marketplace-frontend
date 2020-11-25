import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getDataset } from '@/api/sshoc'
import type { DatasetDto } from '@/api/sshoc'
import DatasetScreen from '@/screens/item/dataset/DatasetScreen'
import { sanitizeItemQueryParams } from '@/utils/sanitizeItemQueryParams'

export type PageProps = {
  dataset: DatasetDto
}

/**
 * Dataset page.
 */
export default function DatasetPage({ dataset }: PageProps): JSX.Element {
  return <DatasetScreen dataset={dataset} />
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageProps>> {
  const { id } = sanitizeItemQueryParams(context.params)

  if (id === undefined) return { notFound: true }

  try {
    const dataset = await getDataset({ id })
    return { props: { dataset } }
  } catch {
    /** context.res.statusCode = 404 */
    return { notFound: true }
  }
}
