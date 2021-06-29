import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import PublicationDraftScreen from '@/screens/item/publication/PublicationDraftScreen'

/**
 * Draft publication detail page.
 */
export default function PublicationDraftPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <PublicationDraftScreen />
    </ProtectedScreen>
  )
}
