import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import WorkflowCreateScreen from '@/screens/item/workflow/WorkflowCreateScreen'

/**
 * Create new workflow page.
 */
export default function WorkflowCreatePage(): JSX.Element {
  return (
    <ProtectedScreen>
      <WorkflowCreateScreen />
    </ProtectedScreen>
  )
}
