import { ScreenNavigation } from '@/components/common/ScreenNavigation'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { useAboutNavItems } from '@/lib/core/page/useAboutNavItems'

export function AboutScreenNavigation(): JSX.Element {
  const { t } = useI18n<'common'>()
  const items = useAboutNavItems()

  return <ScreenNavigation label={t(['common', 'pages', 'about'])} items={items} />
}
