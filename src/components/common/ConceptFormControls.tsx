import { FormControls } from '@/components/common/FormControls'
import { FormButton } from '@/lib/core/form/FormButton'
import { FormButtonLink } from '@/lib/core/form/FormButtonLink'
import { useI18n } from '@/lib/core/i18n/useI18n'

export interface ConceptFormControlsProps {
  form?: string
  onCancel: () => void
}

export function ConceptFormControls(props: ConceptFormControlsProps): JSX.Element {
  const { form, onCancel } = props

  const { t } = useI18n<'authenticated' | 'common'>()

  return (
    <FormControls>
      <FormButtonLink onPress={onCancel}>
        {t(['authenticated', 'controls', 'cancel'])}
      </FormButtonLink>
      <FormButton form={form} type="submit">
        {t(['authenticated', 'controls', 'submit'])}
      </FormButton>
    </FormControls>
  )
}
