import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import WorkflowDraftEditScreen from '@/screens/item/workflow/WorkflowDraftEditScreen'

/**
 * Draft workflow edit page.
 */
export default function WorkflowDraftEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <WorkflowDraftEditScreen />
    </ProtectedScreen>
  )
}
