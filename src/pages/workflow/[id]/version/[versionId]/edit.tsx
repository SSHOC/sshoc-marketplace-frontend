import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import WorkflowVersionEditScreen from '@/screens/item/workflow/WorkflowVersionEditScreen'

/**
 * Edit draft workflow page.
 */
export default function WorkflowVersionEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <WorkflowVersionEditScreen />
    </ProtectedScreen>
  )
}
