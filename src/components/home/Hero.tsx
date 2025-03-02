import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import { Link } from '@/components/common/Link'
import css from '@/components/home/Hero.module.css'

export interface HeroProps {
  children?: ReactNode
}

export function Hero(props: HeroProps): JSX.Element {
  const t = useTranslations('common')

  return (
    <section className={css['container']}>
      <h1 className={css['title']}>{t('home.title')}</h1>
      <p className={css['paragraph']}>
        {t('home.lead-in')}{' '}
        <Link aria-label={t('home.read-more-about-sshocmp')} href="/about/service">
          {t('read-more')}&hellip;
        </Link>
      </p>
      {props.children}
    </section>
  )
}
