import { useRouter } from 'next/router'

import { useGetTool } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Draft tool screen.
 */
export default function ToolDraftScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()
  const handleError = useErrorHandlers()

  const id = useQueryParam('id', false)

  const tool = useGetTool(
    { persistentId: id! },
    { draft: true },
    {
      enabled: id != null && auth.session?.accessToken != null,
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
