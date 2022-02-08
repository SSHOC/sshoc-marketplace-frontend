import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment } from 'react'

import Content, { metadata } from '@/components/contact/contact.mdx'
import { Button } from '@/elements/Button/Button'
import { toast } from '@/elements/Toast/useToast'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { FormTextArea } from '@/modules/form/components/FormTextArea/FormTextArea'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { Form } from '@/modules/form/Form'
import { FormField } from '@/modules/form/FormField'
import { isEmail } from '@/modules/form/validate'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import Mdx from '@/modules/markdown/Mdx'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { SubSectionTitle } from '@/modules/ui/typography/SubSectionTitle'
import { Title } from '@/modules/ui/typography/Title'
import styles from '@/screens/contact/ContactScreen.module.css'

type ContentMetadata = {
  title: string
}

const meta = metadata as ContentMetadata

/**
 * Contact screen.
 */
export default function ContactScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata title={meta.title} />
      <GridLayout className={styles.container}>
        <Header>
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              {
                pathname: '/contact',
                label: 'Contact',
              },
            ]}
          />
        </Header>
        <section className={styles.section}>
          <Image
            src={'/assets/images/contact/people@2x.png'}
            alt=""
            loading="lazy"
            layout="fill"
            quality={100}
            className="object-contain object-right-bottom -z-10"
          />
          <div className="relative max-w-screen-sm p-6 pb-12 space-y-6 break-words">
            <Title>{meta.title}</Title>
            <Mdx content={Content} />
            <ContactForm />
          </div>
        </section>
      </GridLayout>
    </Fragment>
  )
}

type ContactFormData = {
  email: string
  subject: string
  message: string
}

function ContactForm() {
  const router = useRouter()

  /** pre-populate fields from query params, e.g. for "Report an issue" link */
  const email = useQueryParam('email', false)
  const subject = useQueryParam('subject', false)
  const message = useQueryParam('message', false)

  function onSubmit(formData: ContactFormData) {
    return fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error()

        toast.success('Thanks for your message.')
        router.push({ pathname: '/' })
      })
      .catch(() => {
        toast.error('Failed to deliver message.')
      })
  }

  function onValidate(values: Partial<ContactFormData>) {
    const errors: Partial<Record<keyof typeof values, any>> = {}

    if (values.email == null || values.email.length === 0 || !isEmail(values.email)) {
      errors.email = 'Please provide a valid email address.'
    }

    if (values.subject == null || values.subject.length === 0) {
      errors.subject = 'Please provide a subject.'
    }

    if (values.message == null || values.message.length === 0) {
      errors.message = 'What do you want to tell us?'
    }

    return errors
  }

  if (router.isReady !== true) {
    return null
  }

  const initialValues = {
    email,
    subject,
    message,
  }

  return (
    <Fragment>
      <SubSectionTitle>Contact us</SubSectionTitle>
      <Form onSubmit={onSubmit} validate={onValidate} initialValues={initialValues}>
        {({ handleSubmit, pristine, invalid, submitting }) => {
          return (
            <VStack as="form" onSubmit={handleSubmit} className="space-y-4">
              <FormField type="hidden" name="bot" component="input" />
              <FormTextField name="email" type="email" label="Email" />
              <FormTextField name="subject" label="Subject" />
              <FormTextArea name="message" label="Message" rows={6} />
              <HStack className="justify-end py-2">
                <Button
                  className="w-32 px-6 py-3 transition-colors duration-150 rounded"
                  isDisabled={pristine || invalid || submitting}
                  type="submit"
                >
                  Send
                </Button>
              </HStack>
            </VStack>
          )
        }}
      </Form>
    </Fragment>
  )
}
