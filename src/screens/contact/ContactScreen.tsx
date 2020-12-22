import cx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useRef, useEffect } from 'react'
import ReCaptcha from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
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
import { ensureScalar } from '@/utils/ensureScalar'
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
            className="object-cover object-right-bottom -z-10"
          />
          <div className="relative max-w-screen-sm p-6 pb-12 space-y-6">
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
  const { handleSubmit, register, errors, formState, setValue } = useForm<
    ContactFormData
  >({
    mode: 'onChange',
  })
  const router = useRouter()
  const recaptchaRef = useRef<ReCaptcha>(null)

  /** pre-populate fields from query params, e.g. for "Report an issue" link */
  useEffect(() => {
    if (router.query !== undefined && Object.keys(router.query).length > 0) {
      const allowedFields = ['subject', 'message', 'email']
      allowedFields.forEach((field) => {
        const q = router.query[field]
        const value = q !== undefined && ensureScalar(q).trim()
        if (value !== undefined) {
          setValue(field, value)
        }
      })
      // remove query params from url
      router.replace({ query: {} }, undefined, { shallow: true })
    }
  }, [router.query, router, setValue])

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

  const isDisabled = !formState.isValid || formState.isSubmitting

  return (
    <Fragment>
      <SubSectionTitle>Contact us</SubSectionTitle>
      <VStack as="form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" name="bot" ref={register} />
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
            rows={6}
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
        <HStack className="justify-end py-2">
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
