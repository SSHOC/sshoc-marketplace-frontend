import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useRef } from 'react'
import ReCaptcha from 'react-google-recaptcha'
import { toast } from 'react-toastify'

import { Button } from '@/elements/Button/Button'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import { FormTextArea } from '@/modules/form/components/FormTextArea/FormTextArea'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { Form } from '@/modules/form/Form'
import { FormField } from '@/modules/form/FormField'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import Mdx from '@/modules/markdown/Mdx'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { SubSectionTitle } from '@/modules/ui/typography/SubSectionTitle'
import { Title } from '@/modules/ui/typography/Title'
import Content, { metadata } from '@@/content/pages/contact.mdx'

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
      <GridLayout style={{ gridTemplateRows: 'auto 1fr' }}>
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
        <section style={{ gridColumn: '3 / span 11' }} className="relative">
          <Image
            src={'/assets/images/contact/people@2x.png'}
            alt=""
            loading="lazy"
            layout="fill"
            quality={100}
            className="object-contain object-right-bottom -z-10"
          />
          <div className="relative max-w-screen-sm p-6 pb-12 space-y-6">
            <Title>{meta.title}</Title>
            <Mdx>
              <Content />
            </Mdx>
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
  const recaptchaRef = useRef<ReCaptcha>(null)

  /** pre-populate fields from query params, e.g. for "Report an issue" link */
  const email = useQueryParam('email', false)
  const subject = useQueryParam('subject', false)
  const message = useQueryParam('message', false)

  function onSubmit(formData: ContactFormData) {
    // const recaptchaValue = recaptchaRef.current?.getValue()
    // recaptchaRef.current?.reset()

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
      <Form onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit, pristine, invalid, submitting }) => {
          return (
            <VStack as="form" onSubmit={handleSubmit} className="space-y-4">
              <FormField type="hidden" name="bot" component="input" />
              <FormTextField name="email" type="email" label="Email" />
              <FormTextField name="subject" label="Subject" />
              <FormTextArea name="message" label="Message" rows={6} />
              {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY !== undefined ? (
                <div className="py-2">
                  <ReCaptcha
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    hl="en"
                    size="normal"
                  />
                </div>
              ) : null}
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
