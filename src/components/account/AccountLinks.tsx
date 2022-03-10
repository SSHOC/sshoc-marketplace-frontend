import css from '@/components/account/AccountLinks.module.css'
import { useAccountLinks } from '@/components/account/useAccountLinks'
import { Link } from '@/components/common/Link'

export function AccountLinks(): JSX.Element {
  const accountLinks = useAccountLinks()

  return (
    <ul className={css['items']} role="list">
      {accountLinks.map((link) => {
        const Icon = link.icon

        return (
          <li key={link.href.pathname}>
            <div className={css['link']}>
              <Link href={link.href}>
                <Icon className={css['icon']} />
                {link.label}
              </Link>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
