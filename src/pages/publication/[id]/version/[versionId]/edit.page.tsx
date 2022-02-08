import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import PublicationVersionEditScreen from '@/screens/item/publication/PublicationVersionEditScreen'

/**
 * Edit draft publication page.
 */
export default function PublicationVersionEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <PublicationVersionEditScreen />
    </ProtectedScreen>
  )
}
