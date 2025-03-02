import type { FormApi, SubmissionErrors } from 'final-form'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import css from '@/components/contact/ContactForm.module.css'
import type { SubmitContactForm } from '@/components/contact/useSubmitContactForm'
import { useSubmitContactForm } from '@/components/contact/useSubmitContactForm'
import { Form, FORM_ERROR } from '@/lib/core/form/Form'
import { FormButton } from '@/lib/core/form/FormButton'
import { FormHiddenField } from '@/lib/core/form/FormHiddenField'
import { FormTextArea } from '@/lib/core/form/FormTextArea'
import { FormTextField } from '@/lib/core/form/FormTextField'
import { useSearchParams } from '@/lib/core/navigation/useSearchParams'
import type { MutationMetadata } from '@/lib/core/query/types'
import { isEmail, isNonEmptyString } from '@/lib/utils'

export type ContactFormValues = SubmitContactForm.Body

function useInitialContactFormValues(): Partial<ContactFormValues> {
  const searchParams = useSearchParams()

  const initialContactFormValues = useMemo(() => {
    if (searchParams == null) return {}

    return {
      email: searchParams.get('email') ?? undefined,
      subject: searchParams.get('subject') ?? undefined,
      message: searchParams.get('message') ?? undefined,
    }
  }, [searchParams])

  return initialContactFormValues
}

export function ContactForm(): JSX.Element {
  const t = useTranslations('common')
  const router = useRouter()
  const initialContactFormValues = useInitialContactFormValues()
  const meta: MutationMetadata = {
    messages: {
      mutate() {
        return t('contact.form-submission-pending')
      },
      success() {
        return t('contact.form-submission-success')
      },
      error() {
        return t('contact.form-submission-error')
      },
    },
  }
  const submitContactForm = useSubmitContactForm({
    onSuccess() {
      router.push('/')
    },
    meta,
  })

  function onSubmit(
    values: ContactFormValues,
    form: FormApi<ContactFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    submitContactForm.mutate(
      { data: values },
      {
        onSuccess() {
          done?.()
        },
        onError(error) {
          done?.({ [FORM_ERROR]: String(error) })
        },
      },
    )
  }

  function validate(values: Partial<ContactFormValues>) {
    const errors: Partial<Record<keyof ContactFormValues, string>> = {}

    if (!isNonEmptyString(values.email) || !isEmail(values.email)) {
      errors.email = t('contact.validation.invalid-email')
    }

    if (!isNonEmptyString(values.subject)) {
      errors.subject = t('contact.validation.empty-subject')
    }

    if (!isNonEmptyString(values.message)) {
      errors.message = t('contact.validation.empty-message')
    }

    return errors
  }

  return (
    <div className={css['container']}>
      <Form<ContactFormValues>
        name="contact"
        action="/api/contact"
        method="post"
        onSubmit={onSubmit}
        initialValues={initialContactFormValues}
        validate={validate}
        // validate={validateSchema(schema, errorMap)}
      >
        <div className={css['form-fields']}>
          <FormHiddenField name="bot" />
          <FormTextField name="email" label={t('contact.email')} type="email" isRequired />
          <FormTextField name="subject" label={t('contact.subject')} isRequired />
          <FormTextArea name="message" label={t('contact.message')} rows={6} isRequired />
          <div className={css['controls']}>
            <FormButton type="submit">{t('contact.submit')}</FormButton>
          </div>
        </div>
      </Form>
    </div>
  )
}
