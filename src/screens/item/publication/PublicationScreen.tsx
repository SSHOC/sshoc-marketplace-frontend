import { JsonLd } from '@stefanprobst/next-page-metadata'
import { Fragment } from 'react'
import type { DeepRequired } from 'utility-types'

import type { PublicationDto } from '@/api/sshoc'
import { useGetPublication } from '@/api/sshoc'
import { useAuth } from '@/modules/auth/AuthContext'
import type { PageProps } from '@/pages/publication/[id]/index'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Publication screen.
 */
export default function PublicationScreen({
  publication: initialData,
}: PageProps): JSX.Element {
  /** token is used to get hidden properties */
  const auth = useAuth()

  /**
   * populate client cache with data from getServerSideProps,
   * to allow background refreshing
   */
  const { data } = useGetPublication(
    { id: initialData.persistentId! },
    {},
    { enabled: initialData.persistentId !== undefined, initialData },
    { token: auth.session?.accessToken },
  )
  /** backend does not specify required fields. should be safe here */
  const publication = (data ?? initialData) as DeepRequired<PublicationDto>

  const license = publication.properties.find((property) => {
    return property.type.code === 'license'
  })?.concept.label

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
            license,
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
