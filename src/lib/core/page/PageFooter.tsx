import { useTranslations } from 'next-intl'

import { NavLink } from '@/components/common/NavLink'
import css from '@/lib/core/page/PageFooter.module.css'

export function PageFooter(): JSX.Element {
  const t = useTranslations('common')

  const links = [
    { label: t('pages.about'), href: '/about/service' },
    { label: t('pages.privacy-policy'), href: '/privacy-policy' },
    { label: t('pages.terms-of-use'), href: '/terms-of-use' },
    { label: t('pages.contact'), href: '/contact' },
  ]

  return (
    <footer className={css['container']}>
      <nav className={css['footer-nav']} aria-label={t('footer-navigation')}>
        <ul className={css['nav-items']} role="list">
          {links.map((link) => {
            return (
              <li key={link.label}>
                <NavLink variant="nav-link-footer" href={link.href}>
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </footer>
  )
}
