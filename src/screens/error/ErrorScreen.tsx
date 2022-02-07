import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

type ErrorScreenProps = {
  message?: string
  statusCode?: number
  className?: string
}

/**
 * Error screen.
 */
export default function ErrorScreen({
  message = 'An unexpected error has occurred.',
  className,
}: ErrorScreenProps): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex nofollow title="Error" />
      <GridLayout className={className} style={{ gridTemplateRows: '1fr' }}>
        <ContentColumn style={{ gridColumn: '3 / -2' }}>
          <Image
            src={'/assets/images/error/people@2x.png'}
            alt=""
            loading="lazy"
            layout="fill"
            quality={100}
            className="object-cover object-right-bottom -z-10"
          />
          <div className="relative flex flex-col items-start justify-center h-full py-12 space-y-12">
            <Title>{message}</Title>
            <p>Sorry for the inconvenience.</p>
            <Link href="/">
              <a className="inline-block px-12 py-3 text-white transition-colors duration-150 rounded bg-secondary-700 hover:bg-secondary-500">
                Go to Main page
              </a>
            </Link>
          </div>
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
