import css from '@styled-system/css'
import variant from '@styled-system/variant'
import styled from 'styled-components/macro'
import Box from '../Box/Box'

const Text = styled(Box)(
  css({
    color: 'text',
    fontSize: 2,
    variant: 'text.body',
  }),
  variant({
    variants: {
      paragraph: {
        my: 3,
      },
    },
  }),
  variant({
    prop: 'size',
    variants: {
      small: {
        fontSize: 0,
      },
    },
  })
)

export default Text
