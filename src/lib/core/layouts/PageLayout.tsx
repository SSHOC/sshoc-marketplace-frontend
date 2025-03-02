import type { ReactNode } from 'react'

import type { SharedPageProps } from '@/lib/core/app/types'
import { useTranslations } from 'next-intl'
import css from '@/lib/core/layouts/PageLayout.module.css'
import { AuthHeader } from '@/lib/core/page/AuthHeader'
import { PageFooter } from '@/lib/core/page/PageFooter'
import { PageHeader } from '@/lib/core/page/PageHeader'
import { SkipLink } from '@/lib/core/page/SkipLink'

export interface PageLayoutProps {
  children?: ReactNode
  pageProps: SharedPageProps
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
  const t = useTranslations('common')

  return (
    <div className={css['page-layout']}>
      <SkipLink>{t(['common', 'skip-to-main-content'])}</SkipLink>
      <PageHeader />
      <AuthHeader />
      {props.children}
      <PageFooter />
    </div>
  )
}
