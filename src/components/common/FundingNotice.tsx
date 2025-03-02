import Image from 'next/legacy/image'
import { useTranslations } from 'next-intl'

import css from '@/components/common/FundingNotice.module.css'
import CessdaLogo from '~/public/assets/cms/images/cessda-logo.png'
import ClarinLogo from '~/public/assets/cms/images/clarin-logo.png'
import DariahEuLogo from '~/public/assets/cms/images/dariah-eu-logo.png'
import EUFlag from '~/public/assets/images/eu-flag.svg'

export function FundingNotice(): JSX.Element {
  const t = useTranslations('common')

  return (
    <section className={css['container']}>
      <Image src={EUFlag} alt={t('eu-flag')} />
      <p>{t('funding-notice')}</p>
      <div className={css['logos']}>
        <Image src={CessdaLogo} alt={t('cessda')} objectFit="contain" />
        <Image src={ClarinLogo} alt={t('clarin')} objectFit="contain" />
        <Image src={DariahEuLogo} alt={t('dariah-eu')} objectFit="contain" />
      </div>
    </section>
  )
}
