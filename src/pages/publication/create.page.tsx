import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import PublicationCreateScreen from '@/screens/item/publication/PublicationCreateScreen'

/**
 * Create new publication page.
 */
export default function PublicationCreatePage(): JSX.Element {
  return (
    <ProtectedScreen>
      <PublicationCreateScreen />
    </ProtectedScreen>
  )
}
