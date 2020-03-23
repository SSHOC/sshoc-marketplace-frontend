import styled from 'styled-components/macro'
import css from '@styled-system/css'

const Divider = styled('hr')(
  css({
    bg: 'subtle',
    border: 0,
    height: 1,
    m: 0,
  })
)

export default Divider
