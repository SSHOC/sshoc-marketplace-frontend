import { useButton } from '@react-aria/button'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import css from '@/components/auth/SignInForm.module.css'
import { Link } from '@/components/common/Link'
import type { SignInInput } from '@/data/sshoc/api/auth'
import { useAuth } from '@/lib/core/auth/useAuth'
import { Form } from '@/lib/core/form/Form'
import { FormButton } from '@/lib/core/form/FormButton'
import { FormTextField } from '@/lib/core/form/FormTextField'
import { isNonEmptyString } from '@/lib/utils'

export type SignInFormValues = SignInInput

export function SignInForm(): JSX.Element {
  const t = useTranslations('common')
  const { signInWithBasicAuth, signInWithOAuth, isSignedOut } = useAuth()

  // TODO: <Button variant>
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(
    {
      onPress() {
        signInWithOAuth()
      },
    },
    buttonRef,
  )

  function onSubmit(formValues: SignInFormValues) {
    if (isSignedOut) {
      signInWithBasicAuth(formValues)
    }
  }

  function validate(formValues: Partial<SignInFormValues>) {
    const errors: Partial<Record<keyof SignInFormValues, string>> = {}

    if (!isNonEmptyString(formValues.username)) {
      errors.username = t('auth.validation.empty-username')
    }

    if (!isNonEmptyString(formValues.password)) {
      errors.password = t('auth.validation.empty-password')
    }

    return errors
  }

  return (
    <div className={css['container']}>
      <div className={css['line']} />
      <p>
        {t.rich('auth.sign-in-message-oauth', {
          Provider(chunks) {
            return <span className={css['provider']}>{chunks}</span>
          },
        })}
      </p>
      <button {...buttonProps} ref={buttonRef} className={css['oauth-button']}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/logo-my-access-id.png" alt="" />
        Sign in with MyAccessID
      </button>
      <div role="separator" className={css['separator']}>
        <span>{t('auth.sign-in-alternative')}</span>
        <div className={css['line']} />
      </div>
      <p>{t('auth.sign-in-message-basic-auth')}</p>
      <Form<SignInFormValues> onSubmit={onSubmit} validate={validate}>
        <div className={css['form-fields']}>
          <FormTextField name="username" label={t('auth.username')} isRequired />
          <FormTextField name="password" label={t('auth.password')} type="password" isRequired />
          <div className={css['controls']}>
            <FormButton type="submit">{t('auth.sign-in-submit')}</FormButton>
          </div>
        </div>
      </Form>
      <footer className={css['footer']}>
        <div className={css['line']} />
        <small className={css['helptext']}>
          {t.rich('auth.sign-in-helptext', {
            ContactLink(chunks) {
              return <Link href="/contact">{chunks}</Link>
            },
          })}
        </small>
      </footer>
    </div>
  )
}
