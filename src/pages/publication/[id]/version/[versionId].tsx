import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import PublicationVersionScreen from '@/screens/item/publication/PublicationVersionScreen'

/**
 * Publication version detail page.
 */
export default function PublicationVersionPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <PublicationVersionScreen />
    </ProtectedScreen>
  )
}
