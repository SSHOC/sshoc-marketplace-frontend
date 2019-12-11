import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Heading from '../../elements/Heading/Heading'
import Grid from '../../elements/Grid/Grid'
import Separator from '../../elements/Separator/Separator'
import RelatedItem from '../RelatedItem/RelatedItem'

const RelatedItems = ({ items }) => {
  if (!items || !items.length) {
    return null
  }

  return (
    <>
      <Heading as="h2" css={css({ my: 3 })} variant="h3">
        Related
      </Heading>
      <Box css={css({ bg: 'subtler', p: 4 })}>
        <Heading as="h3" css={css({ mb: 4 })} variant="h4">
          Related Datasets, Tools, Training Materials
        </Heading>
        <Separator />
        <Grid
          as="ul"
          css={css({
            // FIXME: Don't hardcode min width
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          })}
        >
          {items.map(item => (
            <li key={item.id}>
              <RelatedItem item={item} />
            </li>
          ))}
        </Grid>
      </Box>
    </>
  )
}

export default RelatedItems
