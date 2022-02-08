import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import PublicationHistoryScreen from '@/screens/item/publication/PublicationHistoryScreen'

/**
 * Edit publication page.
 */
export default function PublicationEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <PublicationHistoryScreen />
    </ProtectedScreen>
  )
}
