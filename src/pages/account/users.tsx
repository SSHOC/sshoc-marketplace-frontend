import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import UsersScreen from '@/screens/account/UsersScreen'

/**
 * Users.
 */
export default function UsersPage(): JSX.Element {
  return (
    <ProtectedScreen roles={['administrator']}>
      <UsersScreen />
    </ProtectedScreen>
  )
}
