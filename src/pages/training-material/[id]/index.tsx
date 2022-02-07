import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import type { TrainingMaterialDto } from '@/api/sshoc'
import { getTrainingMaterial } from '@/api/sshoc'
import TrainingMaterialScreen from '@/screens/item/training-material/TrainingMaterialScreen'
import { sanitizeItemQueryParams } from '@/utils/sanitizeItemQueryParams'

export type PageProps = {
  trainingMaterial: TrainingMaterialDto
}

/**
 * Training material page.
 */
export default function TrainingMaterialPage({ trainingMaterial }: PageProps): JSX.Element {
  return <TrainingMaterialScreen trainingMaterial={trainingMaterial} />
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageProps>> {
  const { id } = sanitizeItemQueryParams(context.params)

  if (id === undefined) {
    // eslint-disable-next-line no-console
    console.log(`Invalid training material id provided: ${JSON.stringify(context.params?.id)}`)
    return { notFound: true }
  }

  try {
    const trainingMaterial = await getTrainingMaterial({ persistentId: id }, {})
    return { props: { trainingMaterial } }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Failed to fetch training material ${id}: ${JSON.stringify(error)}`)
    return { notFound: true }
  }
}
