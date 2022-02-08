import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import type { DatasetDto } from '@/api/sshoc'
import { getDataset } from '@/api/sshoc'
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

  if (id === undefined) {
    // eslint-disable-next-line no-console
    console.log(`Invalid dataset id provided: ${JSON.stringify(context.params?.id)}`)
    return { notFound: true }
  }

  try {
    const dataset = await getDataset({ persistentId: id }, {})
    return { props: { dataset } }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Failed to fetch dataset ${id}: ${JSON.stringify(error)}`)
    return { notFound: true }
  }
}
