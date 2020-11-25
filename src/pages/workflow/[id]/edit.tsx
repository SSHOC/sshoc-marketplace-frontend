import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import WorkflowEditScreen from '@/screens/item/workflow/WorkflowEditScreen'

/**
 * Edit workflow page.
 */
export default function WorkflowEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <WorkflowEditScreen />
    </ProtectedScreen>
  )
}
