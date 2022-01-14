import type { Toc } from '@stefanprobst/remark-extract-toc'
import cx from 'clsx'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import { Fragment } from 'react'

import { TableOfContents } from '@/components/common/TableOfContents'
import GridLayout from '@/modules/layout/GridLayout'
import Mdx from '@/modules/markdown/Mdx'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import LastUpdatedAt from '@/modules/ui/LastUpdatedAt'
import Triangle from '@/modules/ui/Triangle'
import { Title } from '@/modules/ui/typography/Title'
import styles from '@/screens/contribute/ContributeLayout.module.css'
import type { UrlObject } from '@/utils/useActiveLink'
import { useActiveLink } from '@/utils/useActiveLink'

/**
 * Shared contribute screen layout.
 */
export default function ContributeLayout({
  breadcrumb,
  title,
  lastUpdatedAt,
  children,
  links,
  toc,
}: PropsWithChildren<{
  title: string
  breadcrumb: { pathname: string; label: string }
  lastUpdatedAt: string
  links: Array<{ label: string; pathname: string; menu: string }>
  toc: Toc
}>): JSX.Element {
  return (
    <Fragment>
      <Metadata title={title} />
      <GridLayout className={styles.grid}>
        <Header image={'/assets/images/about/clouds@2x.png'}>
          <Breadcrumbs links={[{ pathname: '/', label: 'Home' }, breadcrumb]} />
        </Header>
        <b
          className={cx(
            'border-b bg-gray-50 border-gray-200',
            styles.leftBleed,
          )}
        />
        <div
          className={cx(
            'border-b bg-gray-50 border-gray-200',
            styles.sideColumn,
          )}
        >
          <p className="p-6 text-lg font-bold">Find out more</p>
        </div>
        <SideColumn>
          <nav aria-label="Page navigation">
            <ul className="pl-6">
              {links.map(({ menu, pathname }) => {
                return (
                  <li key={pathname}>
                    <NavLink href={{ pathname }}>{menu}</NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>
        </SideColumn>
        <MainColumn>
          <div className="mx-auto space-y-6 max-w-80ch">
            <Title>{title}</Title>
            <TableOfContents toc={toc} />
            <Mdx>{children}</Mdx>
            <LastUpdatedAt date={lastUpdatedAt} />
          </div>
        </MainColumn>
      </GridLayout>
    </Fragment>
  )
}

/**
 * Main column layout.
 */
function MainColumn({ children }: PropsWithChildren<unknown>) {
  const classNames = {
    section: cx('px-6 pb-12', styles.mainColumn),
    bleed: cx(styles.rightBleed),
  }

  return (
    <Fragment>
      <section className={classNames.section}>{children}</section>
      <b className={classNames.bleed} />
    </Fragment>
  )
}

/**
 * Side column layout.
 */
function SideColumn({ children }: PropsWithChildren<unknown>) {
  const classNames = {
    section: cx('bg-gray-50 pb-12', styles.sideColumn),
    bleed: cx('bg-gray-50', styles.leftBleed),
  }

  return (
    <Fragment>
      <b className={classNames.bleed} />
      <section className={classNames.section}>{children}</section>
    </Fragment>
  )
}

function NavLink({ href, children }: PropsWithChildren<{ href: UrlObject }>) {
  const isActive = useActiveLink(href)
  const classNames = cx(
    'px-8 py-10 inline-flex border-l-4 w-full justify-between',
    isActive
      ? 'border-gray-800 bg-gray-200'
      : 'text-primary-800 border-gray-200 hover:bg-gray-100',
  )
  return (
    <Link href={href}>
      <a className={classNames}>
        <span>{children}</span>
        <span className="flex transform -rotate-90">
          <Triangle />
        </span>
      </a>
    </Link>
  )
}
