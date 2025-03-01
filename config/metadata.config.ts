import { createSiteUrl } from '@/lib/utils'
import type { Locale } from '~/config/i18n.config.mjs'

export interface SiteMetadata {
  locale: Locale
  url: string
  title: string
  shortTitle?: string
  description: string
  favicon: {
    src: string
    maskable?: boolean
  }
  image: {
    src: string
    alt: string
  }
  twitter?: {
    handle?: string
  }
  creator?: {
    name: string
    shortName?: string
    affiliation?: string
    website: string
    address?: {
      street: string
      zip: string
      city: string
    }
    image?: {
      src: string
      alt: string
    }
    phone?: string
    email?: string
    twitter?: {
      handle?: string
    }
  }
}

export const siteMetadata: SiteMetadata = {
  locale: 'en',
  url: String(createSiteUrl({ locale: 'en' })),
  title: 'Social Sciences & Humanities Open Marketplace',
  shortTitle: 'SSHOC Marketplace',
  description:
    'Discover new resources for your research in Social Sciences and Humanities: tools, services, training materials and datasets, contextualised.',
  favicon: {
    src: 'public/assets/images/logo-maskable.svg',
    maskable: true,
  },
  image: {
    src: 'public/assets/images/logo-with-text.svg',
    alt: 'SSHOC Marketplace',
  },
  twitter: {
    handle: 'SSHOpenCloud',
  },
} as const
