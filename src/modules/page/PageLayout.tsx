import type { PropsWithChildren } from 'react'

import PageFooter from '@/modules/page/PageFooter'
import PageHeader from '@/modules/page/PageHeader'
import styles from '@/modules/page/PageLayout.module.css'

type PageLayoutProps = PropsWithChildren<unknown>

/**
 * Page layout.
 */
export default function PageLayout({ children }: PageLayoutProps): JSX.Element {
  return (
    <div className={styles.pageLayout}>
      <PageHeader />
      {children}
      <PageFooter />
    </div>
  )
}
