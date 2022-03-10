import css from '@/components/auth/SignUpForm.module.css'
import { Link } from '@/components/common/Link'
import type { OAuthRegistrationInput } from '@/data/sshoc/api/auth'
import { useAuth } from '@/lib/core/auth/useAuth'
import { Form } from '@/lib/core/form/Form'
import { FormButton } from '@/lib/core/form/FormButton'
import { FormCheckBox } from '@/lib/core/form/FormCheckBox'
import { FormHiddenField } from '@/lib/core/form/FormHiddenField'
import { FormTextField } from '@/lib/core/form/FormTextField'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { routes } from '@/lib/core/navigation/routes'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'
import { isEmail, isNonEmptyString } from '@/lib/utils'

export type SignUpFormValues = OAuthRegistrationInput

export function SignUpForm(): JSX.Element {
  const { t } = useI18n<'common'>()
  const { registrationData, validateRegistrationData, session } = useAuth()

  if (registrationData == null) {
    return (
      <Centered>
        <LoadingIndicator />
      </Centered>
    )
  }

  const isDisabled = session.status !== 'awaitingRegistrationFormData'

  function onSubmit(formValues: SignUpFormValues) {
    if (!isDisabled && registrationData != null) {
      validateRegistrationData({
        ...formValues,
        id: Number(formValues.id),
      })
    }
  }

  function validate(formValues: Partial<SignUpFormValues>) {
    const errors: Partial<Record<keyof SignUpFormValues, string>> = {}

    if (!isNonEmptyString(formValues.displayName)) {
      errors.displayName = t(['common', 'auth', 'validation', 'empty-display-name'])
    }

    if (!isNonEmptyString(formValues.email)) {
      errors.email = t(['common', 'auth', 'validation', 'empty-email'])
    } else if (!isEmail(formValues.email)) {
      errors.email = t(['common', 'auth', 'validation', 'invalid-email'])
    }

    if (formValues.acceptedRegulations !== true) {
      errors.acceptedRegulations = t([
        'common',
        'auth',
        'validation',
        'not-accepted-terms-of-service',
      ])
    }

    return errors
  }

  return (
    <div className={css['container']}>
      <div className={css['line']} />
      <p>{t(['common', 'auth', 'sign-up-message-oauth'])}</p>
      <Form<SignUpFormValues>
        onSubmit={onSubmit}
        validate={validate}
        initialValues={registrationData}
      >
        <div className={css['form-fields']}>
          <FormHiddenField name="id" />
          <FormTextField
            name="displayName"
            label={t(['common', 'auth', 'displayName'])}
            isRequired
          />
          <FormTextField
            name="email"
            label={t(['common', 'auth', 'email'])}
            type="email"
            isRequired
          />
          <FormCheckBox name="acceptedRegulations">
            {t(['common', 'auth', 'accept-terms-of-service'], {
              components: {
                PrivacyPolicyLink(props) {
                  return <Link href={routes.PrivacyPolicyPage()}>{props.children}</Link>
                },
              },
            })}
          </FormCheckBox>
          <div className={css['controls']}>
            <FormButton isDisabled={isDisabled} type="submit">
              {t(['common', 'auth', 'sign-up-submit'])}
            </FormButton>
          </div>
        </div>
      </Form>
      <footer className={css['footer']}>
        <div className={css['line']} />
        <small className={css['helptext']}>
          {t(['common', 'auth', 'sign-up-helptext'], {
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
