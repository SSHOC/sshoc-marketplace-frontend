import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import DatasetCreateScreen from '@/screens/item/dataset/DatasetCreateScreen'

/**
 * Create new dataset page.
 */
export default function DatasetCreatePage(): JSX.Element {
  return (
    <ProtectedScreen>
      <DatasetCreateScreen />
    </ProtectedScreen>
  )
}
