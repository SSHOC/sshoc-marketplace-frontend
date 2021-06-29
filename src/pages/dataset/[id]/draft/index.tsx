import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import DatasetDraftScreen from '@/screens/item/dataset/DatasetDraftScreen'

/**
 * Draft dataset detail page.
 */
export default function DatasetDraftPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <DatasetDraftScreen />
    </ProtectedScreen>
  )
}
