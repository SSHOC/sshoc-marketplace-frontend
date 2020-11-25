import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import ToolEditScreen from '@/screens/item/tool/ToolEditScreen'

/**
 * Edit tool page.
 */
export default function ToolEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <ToolEditScreen />
    </ProtectedScreen>
  )
}
