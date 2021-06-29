import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import DatasetEditDraftScreen from '@/screens/item/dataset/DatasetVersionEditScreen'

/**
 * Edit draft dataset page.
 */
export default function DatasetVersionEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <DatasetEditDraftScreen />
    </ProtectedScreen>
  )
}
