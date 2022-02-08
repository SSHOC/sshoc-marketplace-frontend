import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import WorkflowHistoryScreen from '@/screens/item/workflow/WorkflowHistoryScreen'

/**
 * Edit workflow page.
 */
export default function WorkflowEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <WorkflowHistoryScreen />
    </ProtectedScreen>
  )
}
