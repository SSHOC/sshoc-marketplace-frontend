import { baseUrl } from '~/config/site.config'

export const siteMetadata = {
  locale: 'en',
  url: baseUrl,
  title: 'Social Sciences & Humanities Open Marketplace',
  shortTitle: 'SSHOC Marketplace',
  description:
    'Discover new resources for your research in Social Sciences and Humanities: tools, services, training materials and datasets, contextualised.',
  image: {
    src: 'public/assets/images/logo-with-text.svg',
    alt: 'SSHOC Marketplace',
  },
  favicon: {
    src: 'public/assets/images/logo-maskable.svg',
    maskable: true,
  },
  twitter: {
    handle: 'SSHOpenCloud',
  },
}
