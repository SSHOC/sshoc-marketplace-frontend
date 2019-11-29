import css from '@styled-system/css'
import variant from '@styled-system/variant'
import styled from 'styled-components/macro'
import Box from '../Box/Box'

const Container = styled(Box)(
  css({
    maxWidth: 'container',
    mx: 'auto',
    p: 3,
  }),
  variant({
    variants: {
      narrow: {
        maxWidth: 'narrow',
      },
      wide: {
        maxWidth: 'wide',
      },
    },
  })
)

export default Container
