import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import PublicationDraftEditScreen from '@/screens/item/publication/PublicationDraftEditScreen'

/**
 * Edit draft publication page.
 */
export default function PublicationDraftEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <PublicationDraftEditScreen />
    </ProtectedScreen>
  )
}
