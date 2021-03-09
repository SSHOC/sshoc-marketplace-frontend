import { Fragment } from 'react'

import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Shared item edit layout.
 */
export default function ItemEditLayout(): JSX.Element {
  return (
    <Fragment>
      <Metadata title={`Edit item`} />
      <Title>Edit item</Title>
    </Fragment>
  )
}
