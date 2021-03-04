import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import ToolHistoryScreen from '@/screens/item/tool/ToolHistoryScreen'

/**
 * Edit tool page.
 */
export default function ToolEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <ToolHistoryScreen />
    </ProtectedScreen>
  )
}
