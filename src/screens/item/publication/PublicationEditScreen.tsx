import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetPublication } from '@/api/sshoc'
import { convertToInitialFormValues } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/PublicationEditForm/PublicationEditForm'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { useAuth } from '@/modules/auth/AuthContext'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Edit publication screen.
 */
export default function PublicationEditScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()

  const id = router.query.id as string | undefined
  const publication = useGetPublication(
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
      <Metadata noindex title="Edit publication" />
      <GridLayout style={{ alignContent: 'stretch ' }}>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>Edit publication</Title>
          {publication.data === undefined || id == undefined ? (
            <div className="flex flex-col items-center justify-center">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemForm
              id={id}
              versionId={publication.data.id!}
              category="publication"
              initialValues={convertToInitialFormValues(publication.data)}
              item={publication.data}
            />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
