import { JsonLd } from '@stefanprobst/next-page-metadata'
import { Fragment } from 'react'
import type { DeepRequired } from 'utility-types'
import { useGetDataset } from '@/api/sshoc'
import type { DatasetDto } from '@/api/sshoc'
import type { PageProps } from '@/pages/dataset/[id]/index'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Dataset screen.
 */
export default function DatasetScreen({
  dataset: initialData,
}: PageProps): JSX.Element {
  /**
   * populate client cache with data from getServerSideProps,
   * to allow background refreshing
   */
  const { data } = useGetDataset(
    { id: initialData.persistentId! },
    {},
    { enabled: initialData.persistentId !== undefined, initialData },
  )
  /** backend does not specify required fields. should be safe here */
  const dataset = (data ?? initialData) as DeepRequired<DatasetDto>

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
            license: dataset.licenses.map((license) => license.label),
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
