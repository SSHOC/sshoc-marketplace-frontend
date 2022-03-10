import { InitialThemeScript } from '@stefanprobst/next-theme'
import { Head, Html, Main, NextScript } from 'next/document'

import { PreloadData } from '@/lib/core/app/PreloadData'

export default function Document(): JSX.Element {
  return (
    <Html>
      <Head>
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        /> */}
        <PreloadData />
        <InitialThemeScript />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
