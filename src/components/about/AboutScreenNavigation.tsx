import { useTranslations } from 'next-intl'

import { ScreenNavigation } from '@/components/common/ScreenNavigation'
import { useAboutNavItems } from '@/lib/core/page/useAboutNavItems'

export function AboutScreenNavigation(): JSX.Element {
  const t = useTranslations('common')
  const items = useAboutNavItems()

  return <ScreenNavigation label={t('pages.about')} items={items} />
}
