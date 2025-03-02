import { useTranslations } from 'next-intl'

import { FormControls } from '@/components/common/FormControls'
import { FormButton } from '@/lib/core/form/FormButton'
import { FormButtonLink } from '@/lib/core/form/FormButtonLink'

export interface ConceptFormControlsProps {
  form?: string
  onCancel: () => void
}

export function ConceptFormControls(props: ConceptFormControlsProps): JSX.Element {
  const { form, onCancel } = props

  const t = useTranslations('authenticated')

  return (
    <FormControls>
      <FormButtonLink onPress={onCancel}>{t('controls.cancel')}</FormButtonLink>
      <FormButton form={form} type="submit">
        {t('controls.submit')}
      </FormButton>
    </FormControls>
  )
}
