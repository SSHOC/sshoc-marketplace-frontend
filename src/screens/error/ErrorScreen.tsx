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
  statusCode = 500,
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
            className="-z-10 object-cover object-right-bottom"
          />
          <div className="py-12 space-y-12 relative h-full flex flex-col justify-center items-start">
            <Title>{message}</Title>
            <p>Sorry for the inconvenience.</p>
            <Link href="/">
              <a className="rounded text-white bg-secondary-700 py-3 px-12 inline-block hover:bg-secondary-500 transition-colors duration-150">
                Go to Main page
              </a>
            </Link>
          </div>
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
