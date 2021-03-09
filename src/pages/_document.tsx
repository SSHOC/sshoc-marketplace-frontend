import NextDocument, { Head, Html, Main, NextScript } from 'next/document'

/**
 * Document wrapper.
 */
export default class Document extends NextDocument {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap"
            as="style"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <Matomo />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

/**
 * Initialize Matomo analytics.
 */
function Matomo() {
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PUBLIC_MATOMO_BASE_URL === undefined ||
    process.env.NEXT_PUBLIC_MATOMO_SITE_ID === undefined
  ) {
    return null
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
        var _paq = window._paq || []
        // _paq.push(["requireConsent"]);
        _paq.push(['disableCookies']) // disable as long as we don't have a consent form
        _paq.push(['setSecureCookie', true])
        _paq.push(['enableHeartBeatTimer'])
        ;(function() {
          var u = "${process.env.NEXT_PUBLIC_MATOMO_BASE_URL}"
          _paq.push(['setTrackerUrl', u + 'matomo.php'])
          _paq.push(['setSiteId', ${process.env.NEXT_PUBLIC_MATOMO_SITE_ID}])
          var d = document,
              g = d.createElement('script'),
              s = d.getElementsByTagName('script')[0]
          g.type = 'text/javascript'
          g.async = true
          g.defer = true
          g.src = u + 'matomo.js'
          s.parentNode.insertBefore(g, s)
        })()`,
      }}
    />
  )
}
