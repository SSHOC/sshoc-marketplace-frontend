'use client'

import type { NextWebVitalsMetric } from 'next/app'
import { usePathname, useSearchParams } from 'next/navigation'
import { useReportWebVitals } from 'next/web-vitals'
import { useEffect } from 'react'

import { baseUrl } from '~/config/site.config'

declare global {
  interface Window {
    _paq?: Array<unknown>
  }
}

export function PageViewTracker(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = new URL(pathname, baseUrl)
    url.search = String(searchParams)

    trackPageView(url)
  }, [pathname, searchParams])

  useReportWebVitals(reportWebVitals)

  return null
}

function trackPageView(url: URL): void {
  window._paq?.push(['setCustomUrl', url])
  window._paq?.push(['trackPageView'])
  window._paq?.push(['enableLinkTracking'])
}

function reportWebVitals(metric: NextWebVitalsMetric): void {
  window._paq?.push([
    'trackEvent',
    'Analytics',
    `Web Vitals ${metric.id}`,
    metric.name,
    Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  ])
}
