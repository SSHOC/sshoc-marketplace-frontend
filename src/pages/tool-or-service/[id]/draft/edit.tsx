import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import ToolDraftEditScreen from '@/screens/item/tool/ToolDraftEditScreen'

/**
 * Draft tool edit page.
 */
export default function ToolDraftEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <ToolDraftEditScreen />
    </ProtectedScreen>
  )
}
