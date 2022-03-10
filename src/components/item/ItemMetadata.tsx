import type { ReactNode } from 'react'

import { SectionHeader } from '@/components/common/SectionHeader'
import { SectionTitle } from '@/components/common/SectionTitle'
import css from '@/components/item/ItemMetadata.module.css'
import { useI18n } from '@/lib/core/i18n/useI18n'

export interface ItemMetadataProps {
  children?: ReactNode
}

export function ItemMetadata(props: ItemMetadataProps): JSX.Element {
  const { t } = useI18n<'common'>()

  return (
    <div className={css['container']}>
      <SectionHeader>
        <SectionTitle>{t(['common', 'item', 'details'])}</SectionTitle>
      </SectionHeader>
      <dl className={css['list']}>{props.children}</dl>
    </div>
  )
}
