import { useRouter } from 'next/router'

import { useGetDatasetVersion } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Dataset version screen.
 */
export default function DatasetVersionScreen(): JSX.Element {
  const router = useRouter()

  const id = useQueryParam('id', false)
  const versionId = useQueryParam('versionId', false, Number)

  const auth = useAuth()
  const handleError = useErrorHandlers()

  const dataset = useGetDatasetVersion(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { id: id!, versionId: versionId! },
    {
      enabled: id != null && versionId != null && !Number.isNaN(versionId),
      onError(error) {
        toast.error('Failed to fetch dataset')

        router.push('/')

        if (error instanceof Error) {
          handleError(error)
        }
      },
    },
    {
      token: auth.session?.accessToken,
    },
  )

  if (dataset.data === undefined) {
    return (
      <div>
        <ProgressSpinner />
      </div>
    )
  }

  return <ItemLayout item={dataset.data} />
}
