import Head from 'next/head'
import { Fragment } from 'react'

import { PageMetadata as NextPageMetadata } from '@/lib/core/metadata/PageMetadata'
import { useCanonicalUrl } from '@/lib/core/metadata/useCanonicalUrl'
import { usePageTitleTemplate } from '@/lib/core/metadata/usePageTitleTemplate'
import { useSiteMetadata } from '@/lib/core/metadata/useSiteMetadata'
import { createFaviconLink } from '@/lib/utils'
import { openGraphImageName } from '~/config/site.config'

export function SiteMetadata(): JSX.Element {
  const { locale, title, description, image, twitter } = useSiteMetadata()
  const canonicalUrl = useCanonicalUrl()
  const titleTemplate = usePageTitleTemplate()

  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={String(createFaviconLink(locale, '/favicon.ico'))} sizes="any" />
        <link
          rel="icon"
          href={String(createFaviconLink(locale, '/icon.svg'))}
          type="image/svg+xml"
        />
        <link rel="apple-touch-icon" href={String(createFaviconLink(locale, '/apple-icon.png'))} />
      </Head>
      <NextPageMetadata
        canonicalUrl={canonicalUrl}
        language={locale}
        titleTemplate={titleTemplate}
        description={description}
        openGraph={{
          type: 'website',
          siteName: title,
          images: [{ src: String(createFaviconLink(locale, openGraphImageName)), alt: image.alt }],
        }}
        twitter={{
          cardType: 'summary',
          site: title,
          ...twitter,
        }}
      />
    </Fragment>
  )
}
