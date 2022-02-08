import ProtectedScreen from '@/modules/auth/ProtectedScreen'
import TrainingMaterialDraftScreen from '@/screens/item/training-material/TrainingMaterialDraftScreen'

/**
 * Draft training material detail page.
 */
export default function TrainingMaterialDraftPage(): JSX.Element {
  return (
    <ProtectedScreen>
      <TrainingMaterialDraftScreen />
    </ProtectedScreen>
  )
}
