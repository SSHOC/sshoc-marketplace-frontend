import { useRouter } from 'next/router'
import { Fragment } from 'react'

import {
  useGetPublicationAndVersionedItemDifferences,
  useGetPublicationVersion,
} from '@/api/sshoc'
import { convertToInitialFormValues } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/PublicationEditForm/PublicationEditForm'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Edit publication version screen.
 */
export default function PublicationVersionEditScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()
  const handleError = useErrorHandlers()

  const id = useQueryParam('id', false)
  const versionId = useQueryParam('versionId', false, Number)
  const publication = useGetPublicationVersion(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { persistentId: id!, versionId: versionId! },
    {
      enabled:
        id != null && versionId != null && auth.session?.accessToken != null,
      onError(error) {
        toast.error('Failed to fetch workflow version')

        router.push('/')

        if (error instanceof Error) {
          handleError(error)
        }
      },
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    { token: auth.session?.accessToken },
  )

  const isReview = useQueryParam('review', false, Boolean) === true
  const diff = useGetPublicationAndVersionedItemDifferences(
    { persistentId: id! },
    { with: id!, otherVersionId: versionId! },
    {
      enabled: isReview && auth.session?.accessToken != null,
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
        <ContentColumn className="px-6 py-12 space-y-12">
          <Title>Edit publication</Title>
          {publication.data == null ||
          id == null ||
          (isReview && diff.data == null) ? (
            <div className="flex flex-col items-center justify-center">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemForm
              id={id}
              category="publication"
              initialValues={convertToInitialFormValues(publication.data)}
              item={publication.data}
              diff={diff.data}
            />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
