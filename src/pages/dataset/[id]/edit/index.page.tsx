import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import DatasetEditScreen from '@/screens/item/dataset/DatasetEditScreen'

/**
 * Edit dataset page.
 */
export default function DatasetEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <DatasetEditScreen />
    </ProtectedScreen>
  )
}
