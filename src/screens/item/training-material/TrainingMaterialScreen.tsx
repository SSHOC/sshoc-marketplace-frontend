import { SchemaOrg } from '@stefanprobst/next-page-metadata'
import { Fragment } from 'react'
import type { DeepRequired } from 'utility-types'

import type { TrainingMaterialDto } from '@/api/sshoc'
import { useGetTrainingMaterial } from '@/api/sshoc'
import { useAuth } from '@/modules/auth/AuthContext'
import type { PageProps } from '@/pages/training-material/[id]/index.page'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * TrainingMaterial screen.
 */
export default function TrainingMaterialScreen({
  trainingMaterial: initialData,
}: PageProps): JSX.Element {
  /** token is used to get hidden properties */
  const auth = useAuth()

  /**
   * populate client cache with data from getServerSideProps,
   * to allow background refreshing
   */
  const { data } = useGetTrainingMaterial(
    { persistentId: initialData.persistentId! },
    {},
    { enabled: initialData.persistentId !== undefined, initialData },
    { token: auth.session?.accessToken },
  )
  /** backend does not specify required fields. should be safe here */
  const trainingMaterial = (data ?? initialData) as DeepRequired<TrainingMaterialDto>

  const license = trainingMaterial.properties.find((property) => {
    return property.type.code === 'license'
  })?.concept.label

  return (
    <Fragment>
      {trainingMaterial !== undefined ? (
        <SchemaOrg
          schema={{
            '@type': 'CreativeWork',
            headline: trainingMaterial.label,
            name: trainingMaterial.label,
            abstract: trainingMaterial.description,
            description: trainingMaterial.description,
            url: trainingMaterial.accessibleAt,
            about: trainingMaterial.properties
              .filter((property) => {
                return property.type.code === 'keyword'
              })
              .map((property) => {
                return property.value
              }),
            license,
            version: trainingMaterial.version,
            contributor: trainingMaterial.contributors.map((contributor) => {
              return contributor.actor.name
            }),
            dateCreated: trainingMaterial.dateCreated,
            dateModified: trainingMaterial.dateLastUpdated,
            inLanguage: trainingMaterial.properties
              .filter((property) => {
                return property.type.code === 'language'
              })
              .map((property) => {
                return property.concept.label
              }),
          }}
        />
      ) : null}
      <ItemLayout item={trainingMaterial} />
    </Fragment>
  )
}
