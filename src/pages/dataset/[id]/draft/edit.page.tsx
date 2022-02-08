import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import DatasetDraftEditScreen from '@/screens/item/dataset/DatasetDraftEditScreen'

/**
 * Draft dataset edit page.
 */
export default function DatasetDraftEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <DatasetDraftEditScreen />
    </ProtectedScreen>
  )
}
