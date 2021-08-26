import { useRouter } from 'next/router'

import { useGetToolVersion } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Tool version screen.
 */
export default function ToolVersionScreen(): JSX.Element {
  const router = useRouter()

  const id = useQueryParam('id', false)
  const versionId = useQueryParam('versionId', false, Number)

  const auth = useAuth()
  const handleError = useErrorHandlers()

  const tool = useGetToolVersion(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { persistentId: id!, versionId: versionId! },
    {
      enabled: id != null && versionId != null && !Number.isNaN(versionId),
      onError(error) {
        toast.error('Failed to fetch tool')

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

  if (tool.data === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ProgressSpinner />
      </div>
    )
  }

  return <ItemLayout item={tool.data} />
}
