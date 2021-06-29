import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import TrainingMaterialVersionScreen from '@/screens/item/training-material/TrainingMaterialVersionScreen'

/**
 * TrainingMaterial version detail page.
 */
export default function TrainingMaterialVersionPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <TrainingMaterialVersionScreen />
    </ProtectedScreen>
  )
}
