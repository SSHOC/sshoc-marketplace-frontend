import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import DraftItemsScreen from '@/screens/account/DraftItemsScreen'

/**
 * My draft items.
 */
export default function DraftItemsPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <DraftItemsScreen />
    </ProtectedScreen>
  )
}
