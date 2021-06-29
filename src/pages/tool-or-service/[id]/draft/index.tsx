import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import ToolDraftScreen from '@/screens/item/tool/ToolDraftScreen'

/**
 * Draft tool detail page.
 */
export default function ToolDraftPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <ToolDraftScreen />
    </ProtectedScreen>
  )
}
