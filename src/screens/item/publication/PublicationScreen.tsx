import { JsonLd } from '@stefanprobst/next-page-metadata'
import { Fragment } from 'react'
import type { DeepRequired } from 'utility-types'
import { useGetPublication } from '@/api/sshoc'
import type { PublicationDto } from '@/api/sshoc'
import type { PageProps } from '@/pages/publication/[id]/index'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Publication screen.
 */
export default function PublicationScreen({
  publication: initialData,
}: PageProps): JSX.Element {
  /**
   * populate client cache with data from getServerSideProps,
   * to allow background refreshing
   */
  const { data } = useGetPublication(
    { id: initialData.persistentId! },
    {},
    { enabled: initialData.persistentId !== undefined, initialData },
  )
  /** backend does not specify required fields. should be safe here */
  const publication = (data ?? initialData) as DeepRequired<PublicationDto>

  return (
    <Fragment>
      {publication !== undefined ? (
        <JsonLd
          schema={{
            '@type': 'CreativeWork',
            headline: publication.label,
            name: publication.label,
            abstract: publication.description,
            description: publication.description,
            url: publication.accessibleAt,
            about: publication.properties
              .filter((property) => property.type.code === 'keyword')
              .map((property) => property.value),
            license: publication.licenses.map((license) => license.label),
            version: publication.version,
            contributor: publication.contributors.map(
              (contributor) => contributor.actor.name,
            ),
            dateCreated: publication.dateCreated,
            dateModified: publication.dateLastUpdated,
            inLanguage: publication.properties
              .filter((property) => property.type.code === 'language')
              .map((property) => property.concept.label),
          }}
        />
      ) : null}
      <ItemLayout item={publication} />
    </Fragment>
  )
}
