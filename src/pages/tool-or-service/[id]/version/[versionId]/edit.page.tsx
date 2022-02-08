import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import ToolVersionEditScreen from '@/screens/item/tool/ToolVersionEditScreen'

/**
 * Edit draft tool page.
 */
export default function ToolVersionEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <ToolVersionEditScreen />
    </ProtectedScreen>
  )
}
