import { useRouter } from 'next/router'

import { useGetTrainingMaterial } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Draft training material screen.
 */
export default function TrainingMaterialDraftScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()
  const handleError = useErrorHandlers()

  const id = useQueryParam('id', false)

  const trainingMaterial = useGetTrainingMaterial(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { id: id! },
    { draft: true },
    {
      enabled: id != null && auth.session?.accessToken != null,
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
