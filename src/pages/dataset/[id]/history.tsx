import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import DatasetHistoryScreen from '@/screens/item/dataset/DatasetHistoryScreen'

/**
 * Edit dataset page.
 */
export default function DatasetEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <DatasetHistoryScreen />
    </ProtectedScreen>
  )
}
