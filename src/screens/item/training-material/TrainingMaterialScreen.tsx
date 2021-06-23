import { JsonLd } from '@stefanprobst/next-page-metadata'
import { Fragment } from 'react'
import type { DeepRequired } from 'utility-types'

import type { TrainingMaterialDto } from '@/api/sshoc'
import { useGetTrainingMaterial } from '@/api/sshoc'
import type { PageProps } from '@/pages/training-material/[id]/index'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * TrainingMaterial screen.
 */
export default function TrainingMaterialScreen({
  trainingMaterial: initialData,
}: PageProps): JSX.Element {
  /**
   * populate client cache with data from getServerSideProps,
   * to allow background refreshing
   */
  const { data } = useGetTrainingMaterial(
    { id: initialData.persistentId! },
    {},
    { enabled: initialData.persistentId !== undefined, initialData },
  )
  /** backend does not specify required fields. should be safe here */
  const trainingMaterial = (data ??
    initialData) as DeepRequired<TrainingMaterialDto>

  const license = trainingMaterial.properties.find((property) => {
    return property.type.code === 'license'
  })?.concept.label

  return (
    <Fragment>
      {trainingMaterial !== undefined ? (
        <JsonLd
          schema={{
            '@type': 'CreativeWork',
            headline: trainingMaterial.label,
            name: trainingMaterial.label,
            abstract: trainingMaterial.description,
            description: trainingMaterial.description,
            url: trainingMaterial.accessibleAt,
            about: trainingMaterial.properties
              .filter((property) => property.type.code === 'keyword')
              .map((property) => property.value),
            license,
            version: trainingMaterial.version,
            contributor: trainingMaterial.contributors.map(
              (contributor) => contributor.actor.name,
            ),
            dateCreated: trainingMaterial.dateCreated,
            dateModified: trainingMaterial.dateLastUpdated,
            inLanguage: trainingMaterial.properties
              .filter((property) => property.type.code === 'language')
              .map((property) => property.concept.label),
          }}
        />
      ) : null}
      <ItemLayout item={trainingMaterial} />
    </Fragment>
  )
}
