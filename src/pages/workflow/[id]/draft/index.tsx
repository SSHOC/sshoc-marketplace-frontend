import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import WorkflowDraftScreen from '@/screens/item/workflow/WorkflowDraftScreen'

/**
 * Draft workflow detail page.
 */
export default function WorkflowDraftPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <WorkflowDraftScreen />
    </ProtectedScreen>
  )
}
