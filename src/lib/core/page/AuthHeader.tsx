import { Fragment } from 'react'

import { NavLink } from '@/components/common/NavLink'
import { useAuth } from '@/lib/core/auth/useAuth'
import { useI18n } from '@/lib/core/i18n/useI18n'
import css from '@/lib/core/page/AuthHeader.module.css'
import { useCreateItemLinks } from '@/lib/core/page/useCreateItemLinks'

export function AuthHeader(): JSX.Element {
  const { t } = useI18n<'common'>()
  const items = useCreateItemLinks()
  const { isSignedIn } = useAuth()

  if (!isSignedIn || items == null) {
    return <Fragment />
  }

  return (
    <nav aria-label={t(['common', 'create-new-items'])} className={css['container']}>
      <ul role="list" className={css['items']}>
        {items.map((item) => {
          return (
            <li key={item.id}>
              <div className={css['link']}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
