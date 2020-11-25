import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import ToolCreateScreen from '@/screens/item/tool/ToolCreateScreen'

/**
 * Create new tool or service page.
 */
export default function ToolCreatePage(): JSX.Element {
  return (
    <ProtectedScreen>
      <ToolCreateScreen />
    </ProtectedScreen>
  )
}
