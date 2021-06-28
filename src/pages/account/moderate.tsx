import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import ModerateItemsScreen from '@/screens/account/ModerateItemsScreen'

/**
 * Items to moderate.
 */
export default function ModerateItemsPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <ModerateItemsScreen />
    </ProtectedScreen>
  )
}
