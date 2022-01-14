import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetTrainingMaterial } from '@/api/sshoc'
import { convertToInitialFormValues } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/TrainingMaterialEditForm/TrainingMaterialEditForm'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { useAuth } from '@/modules/auth/AuthContext'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Edit training material screen.
 */
export default function TrainingMaterialEditScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()

  const id = router.query.id as string | undefined
  const trainingMaterial = useGetTrainingMaterial(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { persistentId: id! },
    {},
    {
      enabled: id != null,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    { token: auth.session?.accessToken },
  )

  return (
    <Fragment>
      <Metadata noindex title="Edit training material" />
      <GridLayout style={{ alignContent: 'stretch ' }}>
        <ContentColumn className="px-6 py-12 space-y-12">
          <Title>Edit training material</Title>
          {trainingMaterial.data === undefined || id == undefined ? (
            <div className="flex flex-col items-center justify-center">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemForm
              id={id}
              versionId={trainingMaterial.data.id!}
              category="training-material"
              initialValues={convertToInitialFormValues(trainingMaterial.data)}
              item={trainingMaterial.data}
            />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
