import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import ToolVersionScreen from '@/screens/item/tool/ToolVersionScreen'

/**
 * Tool version detail page.
 */
export default function ToolVersionPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <ToolVersionScreen />
    </ProtectedScreen>
  )
}
