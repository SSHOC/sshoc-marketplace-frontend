import cx from 'clsx'
import Image from 'next/image'
import { Fragment, useRef } from 'react'
import ReCaptcha from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import FormField from '@/modules/form/FormField'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import Mdx from '@/modules/markdown/Mdx'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
// import LastUpdatedAt from '@/modules/ui/LastUpdatedAt'
import TextField from '@/modules/ui/TextField'
import { SubSectionTitle } from '@/modules/ui/typography/SubSectionTitle'
import { Title } from '@/modules/ui/typography/Title'
import type { PageProps } from '@/pages/contact/index'
import Content, { metadata } from '@@/content/pages/contact.mdx'

type ContentMetadata = {
  title: string
}

const meta = metadata as ContentMetadata

/**
 * Contact screen.
 */
export default function ContactScreen({
  lastUpdatedAt,
}: PageProps): JSX.Element {
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
            className="-z-10 object-cover object-right-bottom"
          />
          <div className="space-y-6 p-6 pb-12 max-w-screen-sm relative">
            <Title>{meta.title}</Title>
            <Mdx>
              <Content />
            </Mdx>
            <ContactForm />
            {/* <LastUpdatedAt date={lastUpdatedAt} /> */}
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
  const { handleSubmit, register, errors, formState } = useForm<
    ContactFormData
  >({
    mode: 'onChange',
  })
  const recaptchaRef = useRef<ReCaptcha>(null)

  function onSubmit(formData: ContactFormData) {
    // TODO: where is contact form data sent to?
    const recaptchaValue = recaptchaRef.current?.getValue()
    recaptchaRef.current?.reset()
  }

  const isDisabled = !formState.isValid || formState.isSubmitting

  return (
    <Fragment>
      <SubSectionTitle>Contact us</SubSectionTitle>
      <VStack as="form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email" error={errors.email}>
          <TextField
            name="email"
            type="email"
            aria-invalid={Boolean(errors.email)}
            ref={register({ required: 'Email is required.' })}
          />
        </FormField>
        <FormField label="Subject" error={errors.subject}>
          <TextField
            name="subject"
            aria-invalid={Boolean(errors.subject)}
            ref={register({ required: 'Subject is required.' })}
          />
        </FormField>
        <FormField label="Message" error={errors.message}>
          <TextField
            name="message"
            aria-invalid={Boolean(errors.message)}
            ref={register({ required: 'Message is required.' })}
            as="textarea"
            rows={5}
            className="resize-none"
          />
        </FormField>
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
        <HStack className="py-2 justify-end">
          <button
            className={cx(
              'w-32 rounded py-3 px-6 transition-colors duration-150',
              isDisabled
                ? 'bg-gray-200 text-gray-500 pointer-events-none'
                : 'bg-primary-800 text-white hover:bg-primary-700',
            )}
            disabled={isDisabled}
            type="submit"
          >
            Send
          </button>
        </HStack>
      </VStack>
    </Fragment>
  )
}
