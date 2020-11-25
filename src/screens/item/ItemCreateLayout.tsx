import { Fragment } from 'react'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Shared create item layout.
 */
export default function ItemCreateLayout(): JSX.Element {
  return (
    <Fragment>
      <Metadata title={`Create item`} />
      <Title>Create item</Title>
    </Fragment>
  )
}
