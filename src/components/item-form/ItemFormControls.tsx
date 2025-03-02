import type { FormApi } from 'final-form'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-final-form'

import { FormControls } from '@/components/common/FormControls'
import { usePublishPermission } from '@/data/sshoc/utils/usePublishPermission'
import { FormButton } from '@/lib/core/form/FormButton'
import { FormButtonLink } from '@/lib/core/form/FormButtonLink'

export interface ItemFormControlsProps<T> {
  form?: string
  onBeforeSaveAsDraft?: (form: FormApi<T>) => void
  onBeforeSubmit?: (form: FormApi<T>) => void
  onCancel: (form: FormApi<T>) => void
}

export function ItemFormControls<T>(props: ItemFormControlsProps<T>): JSX.Element {
  const t = useTranslations('authenticated')
  const hasPublishPermissions = usePublishPermission()
  const form = useForm<T>()

  function onBeforeSaveAsDraft() {
    props.onBeforeSaveAsDraft?.(form)
  }

  function onBeforeSubmit() {
    props.onBeforeSubmit?.(form)
  }

  function onCancel() {
    props.onCancel(form)
  }

  return (
    <FormControls>
      <FormButtonLink onPress={onCancel}>{t('controls.cancel')}</FormButtonLink>
      <FormButtonLink form={props.form} onPress={onBeforeSaveAsDraft} type="submit">
        {t('controls.save-as-draft')}
      </FormButtonLink>
      <FormButton form={props.form} onPress={onBeforeSubmit} type="submit">
        {t(`controls.${hasPublishPermissions ? 'publish' : 'submit'}`)}
      </FormButton>
    </FormControls>
  )
}
