import { useRouter } from 'next/router'

import { useGetWorkflow } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Draft workflow screen.
 */
export default function WorkflowDraftScreen(): JSX.Element {
  const router = useRouter()
  const auth = useAuth()
  const handleError = useErrorHandlers()

  const id = useQueryParam('id', false)

  const workflow = useGetWorkflow(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { workflowId: id! },
    { draft: true },
    {
      enabled: id != null && auth.session?.accessToken != null,
      onError(error) {
        toast.error('Failed to fetch workflow')

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

  if (workflow.data === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ProgressSpinner />
      </div>
    )
  }

  return <ItemLayout item={workflow.data} />
}
