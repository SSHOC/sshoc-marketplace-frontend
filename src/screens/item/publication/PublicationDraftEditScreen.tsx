import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetPublicationVersion } from '@/api/sshoc'
import { convertToInitialFormValues } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/DatasetEditForm/DatasetEditForm'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { useAuth } from '@/modules/auth/AuthContext'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Edit draft publication screen.
 */
export default function PublicationDraftEditScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()

  const id = router.query.id as string
  const draftId = Number(router.query.draftId)
  const dataset = useGetPublicationVersion(
    { id, versionId: draftId },
    {
      enabled: auth.session?.accessToken != null,
    },
    { token: auth.session?.accessToken },
  )

  return (
    <Fragment>
      <Metadata noindex title="Edit dataset" />
      <GridLayout style={{ alignContent: 'stretch ' }}>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>Edit dataset</Title>
          {dataset.data === undefined ? (
            <div className="flex flex-col items-center justify-center">
              <ProgressSpinner />
            </div>
          ) : dataset.data.status !== 'draft' ? (
            // FIXME: check if this is actually the intened behavior
            <div>
              <p>
                You cannot only edit draft items by diretly specifying a version
                id.
              </p>
            </div>
          ) : (
            <ItemForm
              id={id}
              category="dataset"
              initialValues={convertToInitialFormValues(dataset.data)}
              item={dataset.data}
            />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
