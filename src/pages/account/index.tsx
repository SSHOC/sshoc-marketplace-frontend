import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import AccountScreen from '@/screens/account/AccountScreen'

/**
 * My account.
 */
export default function AccountPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <AccountScreen />
    </ProtectedScreen>
  )
}
