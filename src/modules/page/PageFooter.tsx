import cx from 'clsx'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import { Fragment } from 'react'

import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import styles from '@/modules/page/PageFooter.module.css'
import type { UrlObject } from '@/utils/useActiveLink'
import { useActiveLink } from '@/utils/useActiveLink'
import { Svg as EuFlag } from '~/assets/images/eu.svg'

import ContentColumn from '../layout/ContentColumn'

/**
 * Page footer.
 */
export default function PageFooter(): JSX.Element {
  return (
    <GridLayout as="footer">
      <EuGrantNote />
      <SecondaryNavigation />
    </GridLayout>
  )
}

function EuGrantNote() {
  return (
    <Fragment>
      <b className={cx(styles.leftBleed, 'border-t border-gray-200')} />
      <ContentColumn as={HStack} className="px-4 py-24 space-x-4 border-t border-gray-200">
        <EuFlag width="2.5em" className="flex-shrink-0" />
        <p className="max-w-screen-sm text-xs text-gray-550">
          The SSH Open Marketplace is developed as part of the &quot;Social Sciences and Humanities
          Open Cloud&apos; SSHOC project, European Union&quot;s Horizon 2020 project call
          H2020-INFRAEOSC-04-2018, grant agreement #823782.
        </p>
      </ContentColumn>
      <b className={cx(styles.rightBleed, 'border-t border-gray-200')} />
    </Fragment>
  )
}

/**
 * Secondary navigation.
 */
function SecondaryNavigation() {
  return (
    <Fragment>
      <b className={cx(styles.leftBleed, 'bg-gray-200')} />
      <ContentColumn as="nav" aria-label="Secondary Menu" className="bg-gray-200">
        <HStack as="ul" className="flex flex-col py-2 md:flex-row md:py-0">
          <li className="grid">
            <NavLink href={{ pathname: '/about/service' }}>About</NavLink>
          </li>
          <li className="grid">
            <NavLink href={{ pathname: '/privacy-policy' }}>Privacy policy</NavLink>
          </li>
          <li className="grid">
            <NavLink href={{ pathname: '/contact' }}>Contact</NavLink>
          </li>
        </HStack>
      </ContentColumn>
      <b className={cx(styles.rightBleed, 'bg-gray-200')} />
    </Fragment>
  )
}

function NavLink({ href, children }: PropsWithChildren<{ href: UrlObject }>) {
  const isActive = useActiveLink(href)
  return (
    <Link href={href}>
      <a
        aria-current={isActive ? 'page' : undefined}
        className="inline-block p-4 text-sm transition-colors duration-150 hover:bg-gray-100"
      >
        {children}
      </a>
    </Link>
  )
}
