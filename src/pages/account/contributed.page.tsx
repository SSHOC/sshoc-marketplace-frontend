import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import ContributedItemsScreen from '@/screens/account/ContributedItemsScreen'

/**
 * My contributed items.
 */
export default function ContributedItemsPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <ContributedItemsScreen />
    </ProtectedScreen>
  )
}
