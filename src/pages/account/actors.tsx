import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import ActorsScreen from '@/screens/account/ActorsScreen'

/**
 * Actors.
 */
export default function ActorsPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <ActorsScreen />
    </ProtectedScreen>
  )
}
