import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import TrainingMaterialCreateScreen from '@/screens/item/training-material/TrainingMaterialCreateScreen'

/**
 * Create new training material page.
 */
export default function TrainingMaterialCreatePage(): JSX.Element {
  return (
    <ProtectedScreen>
      <TrainingMaterialCreateScreen />
    </ProtectedScreen>
  )
}
