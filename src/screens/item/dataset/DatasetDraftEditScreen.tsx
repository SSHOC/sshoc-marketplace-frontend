import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetDataset } from '@/api/sshoc'
import { convertToInitialFormValues } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/DatasetEditForm/DatasetEditForm'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Edit draft dataset screen.
 */
export default function DatasetDraftEditScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()
  const handleError = useErrorHandlers()

  const id = router.query.id as string | undefined
  // const draftId = Number(router.query.draftId) as number | undefined
  // const dataset = useGetDatasetVersion(
  //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //   { id: id!, versionId: draftId! },
  //   {
  //     enabled:
  //       id != null && draftId != null && auth.session?.accessToken != null,
  //   },
  //   { token: auth.session?.accessToken },
  // )
  // FIXME: Event though the version history screen lists multiple drafts for an item
  // we can actually only get one draft (the latest) by setting `?draft=true`.
  // The version endpoint above does not work because it explicitly does
  // not handles drafts (only returns them for admins).
  const dataset = useGetDataset(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { id: id! },
    { draft: true },
    {
      enabled: id != null && auth.session?.accessToken != null,
      onError(error) {
        toast.error('Failed to fetch draft dataset')

        router.push('/')

        if (error instanceof Error) {
          handleError(error)
        }
      },
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
          {dataset.data === undefined || id == null ? (
            <div className="flex flex-col items-center justify-center">
              <ProgressSpinner />
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
