import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import PublicationDraftEditScreen from '@/screens/item/publication/PublicationDraftEditScreen'

/**
 * Draft publication edit page.
 */
export default function PublicationDraftEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <PublicationDraftEditScreen />
    </ProtectedScreen>
  )
}
