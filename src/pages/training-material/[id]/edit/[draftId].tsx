import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import TrainingMaterialDraftEditScreen from '@/screens/item/training-material/TrainingMaterialDraftEditScreen'

/**
 * Edit draft training material page.
 */
export default function TrainingMaterialDraftEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <TrainingMaterialDraftEditScreen />
    </ProtectedScreen>
  )
}
