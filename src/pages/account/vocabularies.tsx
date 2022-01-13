import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import VocabulariesScreen from '@/screens/account/VocabulariesScreen'

/**
 * Vocabularies.
 */
export default function VocabulariesPage(): JSX.Element {
  return (
    <ProtectedScreen roles={['administrator', 'moderator']}>
      <VocabulariesScreen />
    </ProtectedScreen>
  )
}
