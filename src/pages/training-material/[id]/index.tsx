import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getTrainingMaterial } from '@/api/sshoc'
import type { TrainingMaterialDto } from '@/api/sshoc'
import TrainingMaterialScreen from '@/screens/item/training-material/TrainingMaterialScreen'
import { sanitizeItemQueryParams } from '@/utils/sanitizeItemQueryParams'

export type PageProps = {
  trainingMaterial: TrainingMaterialDto
}

/**
 * Training material page.
 */
export default function TrainingMaterialPage({
  trainingMaterial,
}: PageProps): JSX.Element {
  return <TrainingMaterialScreen trainingMaterial={trainingMaterial} />
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageProps>> {
  const { id } = sanitizeItemQueryParams(context.params)

  if (id === undefined) return { notFound: true }

  try {
    const trainingMaterial = await getTrainingMaterial({ id })
    return { props: { trainingMaterial } }
  } catch {
    /** context.res.statusCode = 404 */
    return { notFound: true }
  }
}
