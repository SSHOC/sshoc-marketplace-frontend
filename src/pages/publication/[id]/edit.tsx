import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import PublicationEditScreen from '@/screens/item/publication/PublicationEditScreen'

/**
 * Edit publication page.
 */
export default function PublicationEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <PublicationEditScreen />
    </ProtectedScreen>
  )
}
