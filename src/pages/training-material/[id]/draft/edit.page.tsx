import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import TrainingMaterialDraftEditScreen from '@/screens/item/training-material/TrainingMaterialDraftEditScreen'

/**
 * Draft training material edit page.
 */
export default function TrainingMaterialDraftEditPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <TrainingMaterialDraftEditScreen />
    </ProtectedScreen>
  )
}
