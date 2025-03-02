import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import { SectionHeader } from '@/components/common/SectionHeader'
import { SectionTitle } from '@/components/common/SectionTitle'
import css from '@/components/item/ItemMetadata.module.css'

export interface ItemMetadataProps {
  children?: ReactNode
}

export function ItemMetadata(props: ItemMetadataProps): JSX.Element {
  const t = useTranslations('common')

  return (
    <div className={css['container']}>
      <SectionHeader>
        <SectionTitle>{t('item.details')}</SectionTitle>
      </SectionHeader>
      <dl className={css['list']}>{props.children}</dl>
    </div>
  )
}
