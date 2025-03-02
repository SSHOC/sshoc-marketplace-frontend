import { useTranslations } from 'next-intl'
import { Fragment } from 'react'
import { useFormState } from 'react-final-form'

import css from '@/components/item-form/FormSubmitErrorMessage.module.css'

export function FormSubmitErrorMessage(): JSX.Element {
  const t = useTranslations('authenticated')
  const form = useFormState({ subscription: { hasSubmitErrors: true, submitError: true } })

  if (!form.hasSubmitErrors) return <Fragment />

  return (
    <p className={css['message']}>
      {t('validation.last-submission-failed')}: {form.submitError}
    </p>
  )
}
