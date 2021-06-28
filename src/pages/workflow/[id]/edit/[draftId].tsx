import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import WorkflowDraftEditScreen from '@/screens/item/workflow/WorkflowDraftEditScreen'

/**
 * Edit draft workflow page.
 */
export default function WorkflowDraftEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <WorkflowDraftEditScreen />
    </ProtectedScreen>
  )
}
