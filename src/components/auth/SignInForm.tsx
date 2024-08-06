import { useButton } from '@react-aria/button'
import { useRef } from 'react'

import css from '@/components/auth/SignInForm.module.css'
import { Link } from '@/components/common/Link'
import type { SignInInput } from '@/data/sshoc/api/auth'
import { useAuth } from '@/lib/core/auth/useAuth'
import { Form } from '@/lib/core/form/Form'
import { FormButton } from '@/lib/core/form/FormButton'
import { FormTextField } from '@/lib/core/form/FormTextField'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { routes } from '@/lib/core/navigation/routes'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import AlertIcon from '@/lib/core/ui/icons/alert.svg?symbol-icon'
import { isNonEmptyString } from '@/lib/utils'
import EoscLogo from '~/public/assets/images/eosc.svg?symbol-icon'

export type SignInFormValues = SignInInput

export function SignInForm(): JSX.Element {
  const { t } = useI18n<'common'>()
  const { signInWithBasicAuth, signInWithOAuth, isSignedOut } = useAuth()

  // TODO: <Button variant>
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(
    {
      isDisabled:
        process.env["NEXT_PUBLIC_BASE_URL"] !== 'https://sshoc-marketplace.acdh-dev.oeaw.ac.at' &&
        process.env["NEXT_PUBLIC_BASE_URL"] !== 'http://localhost:3000',
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
      errors.username = t(['common', 'auth', 'validation', 'empty-username'])
    }

    if (!isNonEmptyString(formValues.password)) {
      errors.password = t(['common', 'auth', 'validation', 'empty-password'])
    }

    return errors
  }

  return (
    <div className={css['container']}>
      <div className={css['line']} />
      <p>
        {t(['common', 'auth', 'sign-in-message-oauth'], {
          components: {
            Provider(props) {
              return <span className={css['provider']}>{props.children}</span>
            },
          },
        })}
      </p>
      <button {...buttonProps} ref={buttonRef} className={css['oauth-button']}>
        <EoscLogo aria-hidden />
        Sign in with EOSC
      </button>
      <div className={css['disabled-note']}>
        <Icon icon={AlertIcon} />
        <span>
          We are currently experiencing a technical issue with the EOSC-login that we are working
          diligently to resolve. Please bear with us as we work to restore access as soon as
          possible. Thank you for your patience and understanding.
        </span>
      </div>
      <div role="separator" className={css['separator']}>
        <span>{t(['common', 'auth', 'sign-in-alternative'])}</span>
        <div className={css['line']} />
      </div>
      <p>{t(['common', 'auth', 'sign-in-message-basic-auth'])}</p>
      <Form<SignInFormValues> onSubmit={onSubmit} validate={validate}>
        <div className={css['form-fields']}>
          <FormTextField name="username" label={t(['common', 'auth', 'username'])} isRequired />
          <FormTextField
            name="password"
            label={t(['common', 'auth', 'password'])}
            type="password"
            isRequired
          />
          <div className={css['controls']}>
            <FormButton type="submit">{t(['common', 'auth', 'sign-in-submit'])}</FormButton>
          </div>
        </div>
      </Form>
      <footer className={css['footer']}>
        <div className={css['line']} />
        <small className={css['helptext']}>
          {t(['common', 'auth', 'sign-in-helptext'], {
            components: {
              ContactLink(props) {
                return <Link href={routes.ContactPage()}>{props.children}</Link>
              },
            },
          })}
        </small>
      </footer>
    </div>
  )
}
