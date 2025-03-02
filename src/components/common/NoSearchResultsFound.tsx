import { useTranslations } from 'next-intl'

import css from '@/components/common/NoSearchResultsFound.module.css'
import NothingFoundImage from '~/public/assets/images/search/nothing-found.svg?symbol-icon'

export function NoSearchResultsFound(): JSX.Element {
  const t = useTranslations('common')

  return (
    <div className={css['container']} role="status">
      <div className={css['image-container']}>
        <NothingFoundImage aria-hidden />
      </div>
      <strong className={css['heading']}>{t('search.no-results')}</strong>
      <p>{t('search.nothing-found-message')}</p>
    </div>
  )
}
