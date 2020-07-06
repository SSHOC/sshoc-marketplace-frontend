import { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

export default function useMatomo() {
  const history = useHistory()
  const previousPathname = useRef(null)

  useEffect(() => {
    const trackPageView = (location = window.location) => {
      if (!window._paq) return

      /**
       * note that matomo will use a stale `window.location` reference if not
       * using `setCustomUrl`
       * also note that matomo does not handle trailing slashes for us,
       * i.e. /about and /about/ will register as two different pages
       */
      const pathname = location.pathname.endsWith('/')
        ? location.pathname
        : location.pathname + '/'
      // don't log when only query params change
      if (previousPathname.current === pathname) return
      if (previousPathname.current !== null) {
        window._paq.push(['setReferrerUrl', previousPathname.current])
      }
      window._paq.push(['setCustomUrl', pathname])
      window._paq.push(['setDocumentTitle', `Page ${pathname}`])
      window._paq.push(['deleteCustomVariables', 'page'])
      window._paq.push(['setGenerationTimeMs', 0])
      window._paq.push(['trackPageView'])
      previousPathname.current = pathname
      window._paq.push(['enableLinkTracking'])
    }

    trackPageView()
    return history.listen(trackPageView)
  }, [history])
}
