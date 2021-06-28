import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import DatasetEditDraftScreen from '@/screens/item/dataset/DatasetDraftEditScreen'

/**
 * Edit draft dataset page.
 */
export default function DatasetDraftEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <DatasetEditDraftScreen />
    </ProtectedScreen>
  )
}
