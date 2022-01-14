import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetDatasetVersion } from '@/api/sshoc'
import { convertToInitialFormValues } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/DatasetEditForm/DatasetEditForm'
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
 * Edit dataset version screen.
 */
export default function DatasetVersionEditScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()
  const handleError = useErrorHandlers()

  const id = useQueryParam('id', false)
  const versionId = useQueryParam('versionId', false, Number)
  const dataset = useGetDatasetVersion(
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

  return (
    <Fragment>
      <Metadata noindex title="Edit dataset" />
      <GridLayout style={{ alignContent: 'stretch ' }}>
        <ContentColumn className="px-6 py-12 space-y-12">
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
