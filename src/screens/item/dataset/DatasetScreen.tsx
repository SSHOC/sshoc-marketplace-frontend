import { JsonLd } from '@stefanprobst/next-page-metadata'
import { Fragment } from 'react'
import type { DeepRequired } from 'utility-types'

import type { DatasetDto } from '@/api/sshoc'
import { useGetDataset } from '@/api/sshoc'
import { useAuth } from '@/modules/auth/AuthContext'
import type { PageProps } from '@/pages/dataset/[id]/index'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Dataset screen.
 */
export default function DatasetScreen({
  dataset: initialData,
}: PageProps): JSX.Element {
  /** token is used to get hidden properties */
  const auth = useAuth()

  /**
   * populate client cache with data from getServerSideProps,
   * to allow background refreshing
   */
  const { data } = useGetDataset(
    { id: initialData.persistentId! },
    {},
    { enabled: initialData.persistentId !== undefined, initialData },
    { token: auth.session?.accessToken },
  )
  /** backend does not specify required fields. should be safe here */
  const dataset = (data ?? initialData) as DeepRequired<DatasetDto>

  const license = dataset.properties.find((property) => {
    return property.type.code === 'license'
  })?.concept.label

  return (
    <Fragment>
      {dataset !== undefined ? (
        <JsonLd
          schema={{
            '@type': 'Dataset',
            headline: dataset.label,
            name: dataset.label,
            abstract: dataset.description,
            description: dataset.description,
            url: dataset.accessibleAt,
            about: dataset.properties
              .filter((property) => property.type.code === 'keyword')
              .map((property) => property.value),
            license,
            version: dataset.version,
            contributor: dataset.contributors.map(
              (contributor) => contributor.actor.name,
            ),
            dateCreated: dataset.dateCreated,
            dateModified: dataset.dateLastUpdated,
            inLanguage: dataset.properties
              .filter((property) => property.type.code === 'language')
              .map((property) => property.concept.label),
          }}
        />
      ) : null}
      <ItemLayout item={dataset} />
    </Fragment>
  )
}
