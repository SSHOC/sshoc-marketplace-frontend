import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import DatasetVersionScreen from '@/screens/item/dataset/DatasetVersionScreen'

/**
 * Dataset version detail page.
 */
export default function DatasetVersionPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <DatasetVersionScreen />
    </ProtectedScreen>
  )
}
