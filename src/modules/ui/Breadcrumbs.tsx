import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { Fragment } from 'react'
import { useActiveLink } from '@/utils/useActiveLink'

type Item = {
  pathname: string
  query?: Exclude<LinkProps['href'], string>['query']
  label: string
}

export default function Breadcrumbs({
  links,
}: {
  links: Array<Item>
}): JSX.Element {
  return (
    <nav aria-label="Breadcrumbs navigation">
      <ul className="flex space-x-3 py-4 text-sm">
        {links.map((item, index) => {
          return (
            <Fragment key={index}>
              {index !== 0 ? <li>{'/'}</li> : null}
              <BreadcrumbItem {...item} />
            </Fragment>
          )
        })}
      </ul>
    </nav>
  )
}

function BreadcrumbItem({ pathname, query, label }: Item) {
  const isActive = useActiveLink({ pathname })
  return (
    <li>
      {isActive ? (
        <span className="text-gray-550">{label}</span>
      ) : (
        <Link href={{ pathname, query }}>
          <a className="text-primary-750">{label}</a>
        </Link>
      )}
    </li>
  )
}
