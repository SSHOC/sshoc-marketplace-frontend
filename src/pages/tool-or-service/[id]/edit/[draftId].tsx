import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import ToolDraftEditScreen from '@/screens/item/tool/ToolDraftEditScreen'

/**
 * Edit draft tool page.
 */
export default function ToolDraftEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <ToolDraftEditScreen />
    </ProtectedScreen>
  )
}
