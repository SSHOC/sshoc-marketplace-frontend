import { NavLink } from '@/components/common/NavLink'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { routes } from '@/lib/core/navigation/routes'
import css from '@/lib/core/page/PageFooter.module.css'

export function PageFooter(): JSX.Element {
  const { t } = useI18n<'common'>()

  const links = [
    { label: t(['common', 'pages', 'about']), href: routes.AboutPage({ id: 'service' }) },
    { label: t(['common', 'pages', 'privacy-policy']), href: routes.PrivacyPolicyPage() },
    { label: t(['common', 'pages', 'contact']), href: routes.ContactPage() },
  ]

  return (
    <footer className={css['container']}>
      <nav className={css['footer-nav']} aria-label={t(['common', 'footer-navigation'])}>
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
