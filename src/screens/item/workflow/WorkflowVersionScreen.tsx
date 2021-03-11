import { useRouter } from 'next/router'

import { useGetWorkflowVersion } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { toast } from '@/elements/Toast/useToast'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ItemLayout from '@/screens/item/ItemLayout'
import Steps from '@/screens/item/workflow/Steps'

/**
 * Workflow version screen.
 */
export default function WorkflowVersionScreen(): JSX.Element {
  const router = useRouter()

  const id = useQueryParam('id', false)
  const versionId = useQueryParam('versionId', false, Number)

  const auth = useAuth()
  const handleError = useErrorHandlers()

  const workflow = useGetWorkflowVersion(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { workflowId: id!, versionId: versionId! },
    {
      enabled: id != null && versionId != null && !Number.isNaN(versionId),
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

  return (
    <ItemLayout item={workflow.data}>
      <Steps steps={workflow.data.composedOf} />
    </ItemLayout>
  )
}
