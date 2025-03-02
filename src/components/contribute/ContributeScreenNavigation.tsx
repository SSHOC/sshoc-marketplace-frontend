import { useTranslations } from 'next-intl'

import { ScreenNavigation } from '@/components/common/ScreenNavigation'
import { useContributeNavItems } from '@/lib/core/page/useContributeNavItems'

export function ContributeScreenNavigation(): JSX.Element {
  const t = useTranslations('common')
  const items = useContributeNavItems()

  return <ScreenNavigation label={t('pages.contribute')} items={items} />
}
