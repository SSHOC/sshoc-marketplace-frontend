import Link from 'next/link'
import type { PropsWithChildren } from 'react'

import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import type { UrlObject } from '@/utils/useActiveLink'
import { useActiveLink } from '@/utils/useActiveLink'
import { Svg as Logo } from '@@/assets/images/logo-with-text.svg'

const links = [
  { label: 'About', pathname: '/about' },
  { label: 'Browse', pathname: '/browse' },
]

/**
 * Page navigation.
 */
export default function PageNavigation(): JSX.Element {
  return (
    <nav aria-label="Main menu" className="flex justify-between">
      <NavLink href={{ pathname: '/' }}>
        <Logo aria-label="Home" height="4em" width="auto" />
      </NavLink>
      <VStack>
        <HStack as="ul">
          {links.map(({ label, pathname }) => {
            return (
              <li key={pathname}>
                <NavLink href={{ pathname }}>{label}</NavLink>
              </li>
            )
          })}
        </HStack>
      </VStack>
    </nav>
  )
}

function NavLink({ href, children }: PropsWithChildren<{ href: UrlObject }>) {
  const isActive = useActiveLink(href)
  return (
    <Link href={href}>
      <a
        aria-current={isActive ? 'page' : undefined}
        className="p-4 inline-block text-sm hover:bg-gray-100 transition-colors duration-150"
      >
        {children}
      </a>
    </Link>
  )
}
