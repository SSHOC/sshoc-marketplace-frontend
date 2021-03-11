import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import WorkflowVersionScreen from '@/screens/item/workflow/WorkflowVersionScreen'

/**
 * Workflow version detail page.
 */
export default function WorkflowVersionPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <WorkflowVersionScreen />
    </ProtectedScreen>
  )
}
