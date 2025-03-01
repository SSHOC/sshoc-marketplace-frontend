/** Needs to be imported before `src/styles/index.css` so we can overwrite custom properties. */
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/index.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Suspense } from 'react'

import { PageViewTracker } from '@/app/_lib/page-view-tracker'
import { AnalyticsScript } from '@/lib/core/analytics/AnalyticsScript'
import { ContextProviders as Providers } from '@/lib/core/app/Providers'
import { PageLayout } from '@/lib/core/layouts/PageLayout'
import { siteMetadata as meta } from '~/config/metadata.config'
import { baseUrl, googleSiteId } from '~/config/site.config'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: './',
  },
  title: {
    default: meta.title,
    template: ['%s', meta.title].join(' | '),
  },
  description: meta.description,
  openGraph: {
    type: 'website',
    description: meta.description,
    url: './',
    siteName: meta.title,
  },
  twitter: {
    card: 'summary_large_image',
    site: meta.title,
    creator: meta.twitter?.handle,
  },
  verification: {
    google: googleSiteId,
  },
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout(props: Readonly<RootLayoutProps>): ReactNode {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Providers pageProps={{}} isPageAccessible={false}>
          <AnalyticsScript />
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>

          <PageLayout pageProps={{}}>{children}</PageLayout>
        </Providers>
      </body>
    </html>
  )
}
