import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import TrainingMaterialHistoryScreen from '@/screens/item/training-material/TrainingMaterialHistoryScreen'

/**
 * Edit training material page.
 */
export default function TrainingMaterialEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <TrainingMaterialHistoryScreen />
    </ProtectedScreen>
  )
}
