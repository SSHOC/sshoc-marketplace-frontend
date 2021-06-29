import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import TrainingMaterialVersionEditScreen from '@/screens/item/training-material/TrainingMaterialVersionEditScreen'

/**
 * Edit draft training material page.
 */
export default function TrainingMaterialVersionEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <TrainingMaterialVersionEditScreen />
    </ProtectedScreen>
  )
}
