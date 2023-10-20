import type { ReactNode } from 'react'
import { Fragment } from 'react'

import { useItemDiffFormFieldsMetadata } from '@/components/item-form/useItemDiffFormFieldsMetadata'
import type { ItemsDiff } from '@/data/sshoc/api/item'

export interface ReviewFormMetadataProps {
  children?: ReactNode
  diff: ItemsDiff | undefined
  prefix?: string
}

export function ReviewFormMetadata(props: ReviewFormMetadataProps): JSX.Element {
  const { children, diff, prefix } = props

  /**
   * Attaches field metadata. Needs to run *after* all fields have been registered (which is a bit
   * tricky for the multi-step workflow-step edit/review form).
   */
  useItemDiffFormFieldsMetadata(diff, prefix)

  return <Fragment>{children}</Fragment>
}
