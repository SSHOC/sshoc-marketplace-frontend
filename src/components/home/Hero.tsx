import type { ReactNode } from 'react'

import { Link } from '@/components/common/Link'
import css from '@/components/home/Hero.module.css'
import { useI18n } from '@/lib/core/i18n/useI18n'

export interface HeroProps {
  children?: ReactNode
}

export function Hero(props: HeroProps): JSX.Element {
  const { t } = useI18n<'common'>()

  return (
    <section className={css['container']}>
      <h1 className={css['title']}>{t(['common', 'home', 'title'])}</h1>
      <p className={css['paragraph']}>
        {t(['common', 'home', 'lead-in'])}{' '}
        <Link aria-label={t(['common', 'home', 'read-more-about-sshocmp'])} href="/about/service">
          {t(['common', 'read-more'])}&hellip;
        </Link>
      </p>
      {props.children}
    </section>
  )
}
