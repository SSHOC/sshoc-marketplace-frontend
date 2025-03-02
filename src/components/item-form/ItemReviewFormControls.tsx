import type { FormApi } from 'final-form'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-final-form'

import { FormControls } from '@/components/common/FormControls'
import { FormButton } from '@/lib/core/form/FormButton'
import { FormButtonLink } from '@/lib/core/form/FormButtonLink'

export interface ItemReviewFormControlsProps<T> {
  form?: string
  onBeforeSubmit?: (form: FormApi<T>) => void
  onCancel: (form: FormApi<T>) => void
  onReject: (form: FormApi<T>) => void
}

export function ItemReviewFormControls<T>(props: ItemReviewFormControlsProps<T>): JSX.Element {
  const t = useTranslations('authenticated')
  const form = useForm<T>()

  function onBeforeSubmit() {
    props.onBeforeSubmit?.(form)
  }

  function onReject() {
    props.onReject(form)
  }

  function onCancel() {
    props.onCancel(form)
  }

  return (
    <FormControls>
      <FormButtonLink onPress={onCancel}>{t('controls.cancel')}</FormButtonLink>
      <FormButtonLink onPress={onReject}>{t('controls.reject')}</FormButtonLink>
      <FormButton form={props.form} onPress={onBeforeSubmit} type="submit">
        {t('controls.approve')}
      </FormButton>
    </FormControls>
  )
}
