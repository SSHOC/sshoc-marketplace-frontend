import Image from 'next/image'

import css from '@/components/common/FundingNotice.module.css'
import { useI18n } from '@/lib/core/i18n/useI18n'
import EUFlag from '~/public/assets/images/eu-flag.svg'

export function FundingNotice(): JSX.Element {
  const { t } = useI18n<'common'>()

  return (
    <section className={css['container']}>
      <Image src={EUFlag} alt={t(['common', 'eu-flag'])} />
      <p>{t(['common', 'funding-notice'])}</p>
    </section>
  )
}
