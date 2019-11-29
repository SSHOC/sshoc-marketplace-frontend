import css from '@styled-system/css'
import variant from '@styled-system/variant'
import styled from 'styled-components/macro'

const Heading = styled('h1')(
  css({
    m: 0,
    variant: 'text.heading',
  }),
  variant({
    variants: {
      h1: {
        fontSize: 7,
      },
      h2: {
        fontSize: 6,
      },
      h3: {
        fontSize: 5,
      },
      h4: {
        fontSize: 4,
      },
      h5: {
        fontSize: 3,
      },
    },
  })
)

export default Heading
