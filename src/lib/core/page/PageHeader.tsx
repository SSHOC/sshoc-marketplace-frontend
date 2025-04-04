import { createUrlSearchParams } from '@stefanprobst/request'
import Image from 'next/legacy/image'

import { NavLink } from '@/components/common/NavLink'
import { useCurrentUser } from '@/data/sshoc/hooks/auth'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { usePathname } from '@/lib/core/navigation/usePathname'
import { AuthButton } from '@/lib/core/page/AuthButton'
import { MobileNavigationMenu } from '@/lib/core/page/MobileNavigationMenu'
import css from '@/lib/core/page/PageHeader.module.css'
import { PageNavigation } from '@/lib/core/page/PageNavigation'
import Logo from '~/public/assets/images/logo-with-text.svg'

export function PageHeader(): JSX.Element {
  const { t } = useI18n<'common'>()
  const pathname = usePathname()
  const currentUser = useCurrentUser()

  return (
    <header className={css['container']}>
      <div className={css['home-link']}>
        <NavLink href="/" aria-label={t(['common', 'pages', 'home'])}>
          <Image src={Logo} alt="" priority />
        </NavLink>
      </div>
      <div className={css['secondary-nav']}>
        <div className={css['secondary-nav-link']}>
          <NavLink
            href={`/contact?${createUrlSearchParams({
              email: currentUser.data?.email,
              subject: t(['common', 'report-issue']),
              message: t(['common', 'report-issue-message'], { values: { pathname } }),
            })}`}
          >
            {t(['common', 'report-issue'])}
          </NavLink>
        </div>
        <AuthButton />
      </div>
      <PageNavigation />
      <MobileNavigationMenu />
    </header>
  )
}
