import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import SourcesScreen from '@/screens/account/SourcesScreen'

/**
 * Sources.
 */
export default function SourcesPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <SourcesScreen />
    </ProtectedScreen>
  )
}
