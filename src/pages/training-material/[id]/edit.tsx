import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import TrainingMaterialEditScreen from '@/screens/item/training-material/TrainingMaterialEditScreen'

/**
 * Edit training material page.
 */
export default function TrainingMaterialEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <TrainingMaterialEditScreen />
    </ProtectedScreen>
  )
}
