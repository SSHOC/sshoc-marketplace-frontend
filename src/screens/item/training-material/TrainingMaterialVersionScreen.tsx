import { useRouter } from 'next/router'

import { useGetTrainingMaterialVersion } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Training material version screen.
 */
export default function TrainingMaterialVersionScreen(): JSX.Element {
  const router = useRouter()

  const id = useQueryParam('id', false)
  const versionId = useQueryParam('versionId', false, Number)

  const auth = useAuth()
  const handleError = useErrorHandlers()

  const trainingMaterial = useGetTrainingMaterialVersion(
    { persistentId: id!, versionId: versionId! },
    {
      enabled: id != null && versionId != null && !Number.isNaN(versionId),
      onError(error) {
        toast.error('Failed to fetch trainingMaterial')

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

  if (trainingMaterial.data === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ProgressSpinner />
      </div>
    )
  }

  return <ItemLayout item={trainingMaterial.data} />
}
